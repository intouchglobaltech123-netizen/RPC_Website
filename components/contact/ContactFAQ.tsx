"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useState } from "react";
import { faqs } from "@/lib/content";

const ease = [0.22, 1, 0.36, 1] as const;

/** Numbered, minimal accordion — one answer open at a time. */
export function ContactFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <ul className="divide-y divide-ink/10 border-y border-ink/10">
      {faqs.map((faq, i) => {
        const isOpen = openIndex === i;
        return (
          <li key={faq.question}>
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="group flex w-full items-center gap-5 py-5 text-left"
            >
              <span className={`font-mono text-body transition-colors ${isOpen ? "text-rpc" : "text-mute"}`}>0{i + 1}</span>
              <span className={`flex-1 text-[16px] font-medium transition-colors md:text-[17px] ${isOpen ? "text-ink" : "text-ink/75 group-hover:text-ink"}`}>
                {faq.question}
              </span>
              <span
                className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border transition-all duration-500 ${
                  isOpen ? "rotate-45 border-ink bg-ink text-paper" : "border-ink/15 text-ink/60 group-hover:border-ink"
                }`}
              >
                <Plus size={14} />
              </span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.45, ease }}
                  className="overflow-hidden"
                >
                  <p className="max-w-2xl pb-6 pl-10 text-body leading-relaxed text-ink-2">{faq.answer}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
  );
}
