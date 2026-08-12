"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useId, useState, type ReactNode } from "react";
import { Plus } from "lucide-react";
import { SPRING_UI } from "@/lib/motion";
import { cn } from "@/lib/utils";

export interface AccordionEntry {
  q: string;
  a: ReactNode;
}

export function Accordion({
  items,
  className,
  defaultOpen = null,
}: {
  items: AccordionEntry[];
  className?: string;
  defaultOpen?: number | null;
}) {
  const [open, setOpen] = useState<number | null>(defaultOpen);

  return (
    <div className={cn("divide-y divide-[var(--hairline)]", className)}>
      {items.map((item, i) => (
        <AccordionRow
          key={i}
          item={item}
          isOpen={open === i}
          onToggle={() => setOpen(open === i ? null : i)}
        />
      ))}
    </div>
  );
}

function AccordionRow({
  item,
  isOpen,
  onToggle,
}: {
  item: AccordionEntry;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const reduced = useReducedMotion();
  const id = useId();

  return (
    <div>
      <h3>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-controls={`${id}-panel`}
          id={`${id}-trigger`}
          className={cn(
            "group flex w-full items-start justify-between gap-6 py-6 text-left",
            "transition-colors duration-200 hover:text-[var(--accent)]",
          )}
        >
          <span className="t-h4 text-ink group-hover:text-[var(--accent)] transition-colors duration-200">
            {item.q}
          </span>
          <motion.span
            aria-hidden
            className={cn(
              "mt-0.5 grid size-8 shrink-0 place-items-center rounded-full border",
              isOpen
                ? "border-transparent bg-[var(--accent-bright)] text-[var(--navy-950)]"
                : "border-line-strong text-ink-muted group-hover:border-[var(--accent)]",
            )}
            animate={{ rotate: isOpen ? 135 : 0 }}
            transition={SPRING_UI}
          >
            <Plus className="size-4" strokeWidth={2.4} />
          </motion.span>
        </button>
      </h3>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="panel"
            id={`${id}-panel`}
            role="region"
            aria-labelledby={`${id}-trigger`}
            // Enter and exit along the SAME path (Apple §7) —
            // height and opacity, mirrored.
            initial={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
            animate={reduced ? { opacity: 1 } : { height: "auto", opacity: 1 }}
            exit={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={reduced ? { duration: 0.2 } : SPRING_UI}
            className="overflow-hidden"
          >
            <div className="t-body max-w-[68ch] pb-7 pr-12">{item.a}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
