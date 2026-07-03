"use client";

import type { ReactNode } from "react";
import { track } from "@/lib/analytics";

type Props = {
  kind: "phone" | "email";
  value: string;
  children: ReactNode;
  className?: string;
};

/**
 * Phone/email link with analytics. While the config value is still a
 * bracketed placeholder it renders as plain text so no broken tel:/mailto:
 * links ship.
 */
export function ContactLink({ kind, value, children, className = "" }: Props) {
  const isPlaceholder = value.startsWith("[");
  if (isPlaceholder) {
    return <span className={className}>{children}</span>;
  }
  const href = kind === "phone" ? `tel:${value.replace(/\s+/g, "")}` : `mailto:${value}`;
  return (
    <a
      href={href}
      className={className}
      onClick={() => track(kind === "phone" ? "phone_clicked" : "email_clicked")}
    >
      {children}
    </a>
  );
}
