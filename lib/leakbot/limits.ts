/**
 * The Leak Doctor's daily allowance, per visitor IP: so many photo checks and
 * so many messages a day, reset at midnight India time. IPs are only kept as a
 * salted hash. Counts live in this server's memory, or in Upstash Redis when
 * UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN are set (needed on
 * serverless hosting, where memory is not shared between requests).
 */
import { createHash } from "crypto";

const num = (v: string | undefined, d: number) => (v && Number.isFinite(+v) && +v > 0 ? Math.floor(+v) : d);
export const PHOTOS_PER_DAY = num(process.env.LEAKBOT_PHOTOS_PER_DAY, 5);
export const MESSAGES_PER_DAY = num(process.env.LEAKBOT_MESSAGES_PER_DAY, 30);

export interface Quota {
  photosLeft: number;
  photosMax: number;
  messagesLeft: number;
  messagesMax: number;
  /** when the allowance resets (ISO time) */
  resetsAt: string;
}

/** today's date in India, which keys the counts */
const IST = 5.5 * 3600_000;
const today = () => new Date(Date.now() + IST).toISOString().slice(0, 10);
const nextReset = () => new Date(Date.parse(`${today()}T00:00:00Z`) - IST + 86400_000).toISOString();

export function visitorIp(req: Request) {
  const h = req.headers;
  return (h.get("cf-connecting-ip") || h.get("x-real-ip") || h.get("x-forwarded-for")?.split(",")[0] || "local").trim();
}

const visitorKey = (ip: string) =>
  createHash("sha256").update(`${process.env.LEAKBOT_SALT || "rpc-leak-doctor"}:${ip}`).digest("hex").slice(0, 24);

/* ------------------------------------------------------------- stores */

interface Store {
  /** add n (may be negative) and return the new count */
  add(key: string, n: number): Promise<number>;
}

const memory = (): Store => {
  const g = globalThis as unknown as { __leakbot?: { day: string; counts: Map<string, number> } };
  return {
    async add(key, n) {
      const day = today();
      if (!g.__leakbot || g.__leakbot.day !== day) g.__leakbot = { day, counts: new Map() };
      const v = Math.max(0, (g.__leakbot.counts.get(key) ?? 0) + n);
      g.__leakbot.counts.set(key, v);
      return v;
    },
  };
};

const upstash = (url: string, token: string): Store => ({
  async add(key, n) {
    const res = await fetch(`${url.replace(/\/$/, "")}/pipeline`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify([
        ["INCRBY", key, String(n)],
        ["EXPIRE", key, "172800"],
      ]),
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`Upstash ${res.status}`);
    const out = (await res.json()) as { result?: number }[];
    return Math.max(0, Number(out[0]?.result ?? 0));
  },
});

const store: Store =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? upstash(process.env.UPSTASH_REDIS_REST_URL, process.env.UPSTASH_REDIS_REST_TOKEN)
    : memory();

/* ------------------------------------------------------------- allowance */

const keys = (ip: string) => {
  const id = `leakbot:${today()}:${visitorKey(ip)}`;
  return { photos: `${id}:photos`, messages: `${id}:messages` };
};

const quota = (photos: number, messages: number): Quota => ({
  photosLeft: Math.max(0, PHOTOS_PER_DAY - photos),
  photosMax: PHOTOS_PER_DAY,
  messagesLeft: Math.max(0, MESSAGES_PER_DAY - messages),
  messagesMax: MESSAGES_PER_DAY,
  resetsAt: nextReset(),
});

export async function readQuota(ip: string) {
  const k = keys(ip);
  return quota(await store.add(k.photos, 0), await store.add(k.messages, 0));
}

/**
 * Take one message and `photos` photo checks from today's allowance. If either
 * would go over, nothing is taken and `ok` is false.
 */
export async function spend(ip: string, photos: number) {
  const k = keys(ip);
  const usedPhotos = await store.add(k.photos, photos);
  const usedMessages = await store.add(k.messages, 1);
  if (usedPhotos > PHOTOS_PER_DAY || usedMessages > MESSAGES_PER_DAY) {
    const q = quota(await store.add(k.photos, -photos), await store.add(k.messages, -1));
    const reason = usedPhotos > PHOTOS_PER_DAY ? ("photos" as const) : ("messages" as const);
    return { ok: false as const, reason, quota: q };
  }
  return { ok: true as const, quota: quota(usedPhotos, usedMessages) };
}

/** give back what `spend` took, when the answer could not be made */
export async function refund(ip: string, photos: number) {
  const k = keys(ip);
  return quota(await store.add(k.photos, -photos), await store.add(k.messages, -1));
}
