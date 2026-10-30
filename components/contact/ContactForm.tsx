"use client";

import { Building2, CheckCircle2, ChevronDown, IndianRupee, Loader2, Lock, Mail, MapPin, MessageCircle, Phone, Send, User } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { contact, services } from "@/lib/content";

const budgetRanges = ["Under ₹50 L", "₹50 L – ₹2 Cr", "₹2 Cr – ₹10 Cr", "₹10 Cr +", "Not sure yet"] as const;

/**
 * Enquiries are delivered to the office inbox through FormSubmit
 * (https://formsubmit.co) — no server or API key needed. The very first
 * submission sends a one-time activation email to `contact.email`; once
 * that is confirmed every enquiry arrives in the inbox as a table.
 * WhatsApp is offered alongside as an instant alternative.
 */
const ENDPOINT = `https://formsubmit.co/ajax/${contact.email}`;

type Status = "idle" | "sending" | "sent" | "error";

/* form building blocks — defined outside the form so inputs keep focus between renders */
const Step = ({ n, title }: { n: string; title: string }) => (
  <p className="mb-3 flex items-center gap-2.5 text-body font-semibold uppercase tracking-[0.14em] text-ink">
    <span className="grid h-6 w-6 place-items-center rounded-full bg-rpc text-body text-white">{n}</span>
    {title}
  </p>
);
const Field = ({ label, icon, children }: { label: string; icon: ReactNode; children: ReactNode }) => (
  <label className="block">
    <span className="mb-1.5 block text-body font-medium text-ink-2">{label}</span>
    <span className="relative block">
      <span aria-hidden className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-mute">{icon}</span>
      {children}
    </span>
  </label>
);

export function ContactForm() {
  const form = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [type, setType] = useState<string>(services[0]?.title ?? "Residential Construction");
  const [budget, setBudget] = useState<string>("₹50 L – ₹2 Cr");
  const [name, setName] = useState("");

  // /contact?service=Interiors preselects the discipline
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("service");
    if (q && services.some((s) => s.title === q)) setType(q);
  }, []);

  const summary = (f: FormData) =>
    [
      `Project enquiry — ${type}`,
      `Name: ${f.get("name") ?? ""}`,
      `Phone: ${f.get("phone") ?? ""}`,
      `Email: ${f.get("email") ?? ""}`,
      `Site location: ${f.get("location") ?? ""}`,
      `Budget: ${budget}`,
      "",
      String(f.get("message") ?? ""),
    ].join("\n");

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const el = e.currentTarget;
    if (!el.reportValidity()) return;
    const f = new FormData(el);
    if (f.get("_honey")) return; // bot
    setName(String(f.get("name") ?? "").split(" ")[0] ?? "");
    setStatus("sending");
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          _subject: `New project enquiry — ${type} (${f.get("location") ?? ""})`,
          _template: "table",
          _captcha: "false",
          _replyto: f.get("email"),
          Name: f.get("name"),
          Phone: f.get("phone"),
          Email: f.get("email"),
          "Site location": f.get("location"),
          "Project type": type,
          Budget: budget,
          Message: f.get("message"),
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { success?: string | boolean };
      if (!res.ok || String(data.success) === "false") throw new Error("send failed");
      setStatus("sent");
      el.reset();
    } catch {
      setStatus("error");
    }
  };

  const openWhatsApp = () => {
    const el = form.current;
    const text = el ? summary(new FormData(el)) : `Project enquiry — ${type}`;
    window.open(`${contact.whatsapp}?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  };

  if (status === "sent") {
    return (
      <div role="status" className="flex h-full flex-col justify-center py-6">
        <span className="grid h-12 w-12 place-items-center rounded-full bg-emerald-600 text-white">
          <CheckCircle2 size={24} />
        </span>
        <p className="display mt-5 text-4xl">Thank you{name ? `, ${name}` : ""}.</p>
        <p className="mt-3 max-w-md text-body leading-relaxed text-ink-2">
          Your enquiry has reached our office. An RPC engineer will call you within one working day. For anything urgent, call{" "}
          <a className="font-medium text-ink underline underline-offset-4" href={`tel:${contact.phone.replace(/[^0-9+]/g, "")}`}>{contact.phone}</a>.
        </p>
        <button type="button" onClick={() => setStatus("idle")} className="mt-6 self-start text-body font-medium text-ink underline underline-offset-4">
          Send another enquiry
        </button>
      </div>
    );
  }

  const input =
    "h-12 w-full rounded-xl border border-ink/12 bg-white/80 pl-11 pr-3.5 text-body text-ink outline-none transition-[border-color,box-shadow] placeholder:text-mute/60 focus:border-rpc focus:bg-white focus:shadow-[0_0_0_4px_rgba(39,85,158,0.12)]";
  return (
    <form ref={form} onSubmit={onSubmit} className="flex flex-col gap-7">
      {/* spam trap */}
      <input type="text" name="_honey" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

      {/* 1 — the project */}
      <div>
        <Step n="1" title="Your project" />
        {/* two single-line pickers — nothing cut off, easy to tap on a phone */}
        <div className="grid gap-3.5 sm:grid-cols-2">
          <Field label="What are you building?" icon={<Building2 size={16} />}>
            <select name="type" value={type} onChange={(e) => setType(e.target.value)} className={`${input} appearance-none pr-10`}>
              {services.map((sv) => (
                <option key={sv.id} value={sv.title}>{sv.title}</option>
              ))}
            </select>
            <ChevronDown aria-hidden size={16} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-mute" />
          </Field>
          <Field label="Estimated budget" icon={<IndianRupee size={16} />}>
            <select name="budget" value={budget} onChange={(e) => setBudget(e.target.value)} className={`${input} appearance-none pr-10`}>
              {budgetRanges.map((bd) => (
                <option key={bd} value={bd}>{bd}</option>
              ))}
            </select>
            <ChevronDown aria-hidden size={16} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-mute" />
          </Field>
        </div>
      </div>

      {/* 2 — the person */}
      <div>
        <Step n="2" title="Your details" />
        <div className="grid gap-3.5 sm:grid-cols-2">
          <Field label="Full name *" icon={<User size={16} />}>
            <input required name="name" autoComplete="name" className={input} placeholder="Your name" />
          </Field>
          <Field label="Phone *" icon={<Phone size={16} />}>
            <input required type="tel" name="phone" autoComplete="tel" inputMode="tel" pattern="[0-9+\s\-]{8,}" className={input} placeholder="+91 98765 43210" />
          </Field>
          <Field label="Email *" icon={<Mail size={16} />}>
            <input required type="email" name="email" autoComplete="email" className={input} placeholder="you@example.com" />
          </Field>
          <Field label="Site location *" icon={<MapPin size={16} />}>
            <input required name="location" className={input} placeholder="e.g. Perundurai Road, Erode" />
          </Field>
        </div>
        <label className="mt-3.5 block">
          <span className="mb-1.5 block text-body font-medium text-ink-2">About your project</span>
          <textarea
            name="message"
            rows={3}
            className="w-full resize-none rounded-xl border border-ink/12 bg-white/80 px-3.5 py-3 text-body outline-none transition-[border-color,box-shadow] placeholder:text-mute/60 focus:border-rpc focus:bg-white focus:shadow-[0_0_0_4px_rgba(39,85,158,0.12)]"
            placeholder="Plot size, number of floors, approval status, when you would like to start…"
          />
        </label>
      </div>

      {status === "error" && (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-body text-red-800">
          We couldn’t send that just now. Please try again, send it on WhatsApp, or call {contact.phone}.
        </p>
      )}

      <div className="grid gap-2.5 sm:flex sm:items-center">
        <button
          type="submit"
          disabled={status === "sending"}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-ink px-6 text-body font-semibold text-paper transition-colors hover:bg-rpc disabled:opacity-60"
        >
          {status === "sending" ? <Loader2 size={16} className="animate-spin" /> : <Send size={15} />}
          {status === "sending" ? "Sending…" : "Send enquiry"}
        </button>
        <button
          type="button"
          onClick={openWhatsApp}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-[#25D366]/50 bg-[#25D366]/10 px-6 text-body font-semibold text-[#128C4B] transition-colors hover:bg-[#25D366] hover:text-white"
        >
          <MessageCircle size={16} /> Send on WhatsApp
        </button>
      </div>
      <p className="-mt-3 flex items-center gap-1.5 text-body text-mute">
        <Lock size={12} /> We reply within one working day. Your details are only used to answer this enquiry.
      </p>
    </form>
  );
}
