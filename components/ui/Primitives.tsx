import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";
import { Magnetic } from "./Magnetic";

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn("eyebrow", className)}>{children}</p>;
}

/** a section's number and name, as on the home sections: "06 —— Performance record" */
export function SectionMarker({ index, label, className }: { index: string; label: string; className?: string }) {
  const onDark = /text-paper|text-white/.test(className ?? "");
  return (
    <div className={cn("flex items-center gap-3 text-[1.4rem] font-medium", className)}>
      <span className={cn("font-semibold tabular-nums", onDark ? "text-white/85" : "text-rpc")}>{index}</span>
      <span className="h-px w-8 bg-current opacity-35" />
      <span className={onDark ? "text-paper/85" : "text-mute"}>{label}</span>
    </div>
  );
}

export function ArrowLink({
  href,
  children,
  variant = "solid",
  className,
}: {
  href: string;
  children: ReactNode;
  variant?: "solid" | "light" | "ghost";
  className?: string;
}) {
  return (
    <Magnetic>
      <Link href={href} className={cn("btn", `btn-${variant}`, className)}>
        <span>{children}</span>
        <span className="btn-icon" aria-hidden>
          <ArrowUpRight size={15} strokeWidth={1.5} />
        </span>
      </Link>
    </Magnetic>
  );
}

/** Label/value pair used for project metadata */
export function Meta({ label, value, className }: { label: string; value: ReactNode; className?: string }) {
  return (
    <div className={cn("border-t border-current/15 pt-3", className)}>
      <dt className="eyebrow mb-1.5 opacity-50">{label}</dt>
      <dd className="text-body">{value}</dd>
    </div>
  );
}
