"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowUpRight, Clock } from "lucide-react";
import { blogCategories, blogPosts, formatDate, type BlogPost } from "@/lib/blog";

/** Compact card: 2 per row on phones, 3 on desktop. */
export function PostCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-xl bg-paper-2 ring-1 ring-ink/10 transition-shadow duration-500 hover:shadow-[0_24px_50px_-30px_rgba(17,19,22,0.45)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-stone">
        <Image
          src={post.cover}
          alt={post.coverAlt}
          fill
          sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 46vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />
        <span className="absolute left-2 top-2 rounded-full bg-paper/90 px-2 py-0.5 text-body font-medium text-ink md:left-3 md:top-3 md:px-2.5 md:py-1 md:text-body">
          {post.category}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-3 md:p-5">
        <h3 className="line-clamp-3 text-body font-medium leading-snug md:text-lg md:leading-snug" style={{ minHeight: "3.9em" }}>
          {post.title}
        </h3>
        <p className="mt-2 hidden text-body leading-relaxed text-ink-2 md:line-clamp-2">{post.excerpt}</p>
        <p className="mt-auto flex items-center gap-1.5 pt-3 text-body text-mute md:text-body">
          <span>{formatDate(post.date)}</span>
          <span aria-hidden>·</span>
          <Clock size={11} /> {post.readMinutes} min
        </p>
      </div>
    </Link>
  );
}

/** Featured post + category filter + grid. */
export function BlogIndex() {
  const [cat, setCat] = useState<(typeof blogCategories)[number]>("All");
  const [featured, ...rest] = blogPosts;
  const list = useMemo(() => (cat === "All" ? rest : blogPosts.filter((p) => p.category === cat)), [cat, rest]);

  return (
    <div className="gutter flex flex-col gap-8 pb-20 md:gap-12 md:pb-28">
      {/* featured */}
      {featured && cat === "All" && (
        <Link
          href={`/blog/${featured.slug}`}
          className="group mt-6 grid overflow-hidden rounded-2xl bg-night text-paper md:mt-10 md:grid-cols-2"
        >
          <div className="relative aspect-[16/10] overflow-hidden md:aspect-auto md:min-h-[26rem]">
            <Image src={featured.cover} alt={featured.coverAlt} fill priority sizes="(min-width: 768px) 50vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
          </div>
          <div className="flex flex-col justify-between gap-6 p-5 md:p-10">
            <div>
              <p className="flex items-center gap-2 text-body uppercase tracking-[0.18em] text-paper/60">
                <span className="h-1.5 w-1.5 rounded-full bg-rpc" /> Featured · {featured.category}
              </p>
              <h2 className="display mt-3 text-3xl leading-[1.05] md:mt-4 md:text-5xl">{featured.title}</h2>
              <p className="mt-3 text-body leading-relaxed text-paper/70 md:mt-4 md:text-base">{featured.excerpt}</p>
            </div>
            <div className="flex items-center justify-between gap-4 text-body text-paper/60">
              <span>
                {formatDate(featured.date)} · {featured.readMinutes} min read
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-paper px-4 py-2 text-body font-medium text-ink">
                Read <ArrowUpRight size={13} />
              </span>
            </div>
          </div>
        </Link>
      )}

      {/* filters */}
      <div className={`grid grid-cols-3 gap-1 rounded-2xl bg-white/60 p-1.5 ring-1 ring-ink/10 md:flex md:w-fit md:flex-wrap md:rounded-full ${cat !== "All" ? "mt-6 md:mt-10" : ""}`}>
        {blogCategories.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCat(c)}
            aria-pressed={cat === c}
            className={`whitespace-nowrap rounded-full px-2 py-2 text-body font-medium transition-colors md:px-4 md:py-1.5 ${
              cat === c ? "bg-ink text-paper" : "text-ink/70 hover:bg-ink/[0.06] hover:text-ink"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* grid */}
      <ul className="grid grid-cols-2 gap-3 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
        {list.map((p) => (
          <li key={p.slug} className="h-full">
            <PostCard post={p} />
          </li>
        ))}
      </ul>
    </div>
  );
}
