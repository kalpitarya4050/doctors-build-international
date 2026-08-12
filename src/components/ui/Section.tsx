import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";
import { Eyebrow } from "./Surface";

export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = "center",
  className,
  titleClassName,
  as = "h2",
}: {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  align?: "center" | "left";
  className?: string;
  titleClassName?: string;
  as?: "h1" | "h2";
}) {
  const Tag = as;
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" ? "items-center text-center" : "items-start text-left",
        className,
      )}
    >
      {eyebrow && (
        <Reveal direction="up">
          <Eyebrow>{eyebrow}</Eyebrow>
        </Reveal>
      )}
      <Reveal direction="up" delay={0.05}>
        <Tag className={cn(as === "h1" ? "t-h1" : "t-h2", "text-brand", titleClassName)}>
          {title}
        </Tag>
      </Reveal>
      {lead && (
        <Reveal direction="up" delay={0.1}>
          <p className={cn("t-lead", align === "center" ? "mx-auto max-w-[62ch]" : "max-w-[62ch]")}>
            {lead}
          </p>
        </Reveal>
      )}
    </div>
  );
}

/** Ambient gold/navy bloom behind a section. Purely decorative,
 *  and kept semi-transparent so it never fights the content. */
export function Bloom({
  className,
  tone = "gold",
}: {
  className?: string;
  tone?: "gold" | "navy" | "both";
}) {
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 -z-10 overflow-hidden", className)}>
      {(tone === "gold" || tone === "both") && (
        <div
          className="absolute -top-32 left-1/2 size-[42rem] -translate-x-1/2 rounded-full opacity-[0.5] blur-[120px]"
          style={{
            background:
              "radial-gradient(circle, color-mix(in srgb, var(--gold-500) 22%, transparent), transparent 68%)",
          }}
        />
      )}
      {(tone === "navy" || tone === "both") && (
        <div
          className="absolute -bottom-40 right-0 size-[38rem] rounded-full opacity-[0.45] blur-[130px]"
          style={{
            background:
              "radial-gradient(circle, color-mix(in srgb, var(--navy-600) 26%, transparent), transparent 70%)",
          }}
        />
      )}
    </div>
  );
}
