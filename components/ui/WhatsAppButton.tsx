"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { buildWhatsAppUrl, whatsappGreeting } from "@/lib/whatsapp";
import { track } from "@/lib/analytics";
import { cls } from "@/components/ui/Button";

type Props = {
  /** Page context appended to the greeting, e.g. "I would like help planning a Maasai Mara safari." */
  context?: string;
  /** Full message override (wins over context). */
  message?: string;
  label?: string;
  variant?: "primary" | "dark" | "outline" | "light" | "ghost";
  size?: "md" | "lg";
  trackingSource: string;
  className?: string;
};

/**
 * Context-aware WhatsApp action. While the company number is still a
 * placeholder it routes to the contact page instead of opening a chat
 * with a bracketed number.
 */
export function WhatsAppButton({
  context,
  message,
  label = "Chat on WhatsApp",
  variant = "outline",
  size = "md",
  trackingSource,
  className = "",
}: Props) {
  const text = message ?? whatsappGreeting(context);
  const url = buildWhatsAppUrl(text);
  const onClick = () => track("whatsapp_clicked", { source: trackingSource });

  if (!url) {
    return (
      <Link
        href="/contact#whatsapp"
        className={`${cls(variant, size)} ${className}`}
        onClick={onClick}
      >
        <MessageCircle aria-hidden className="size-4" />
        {label}
      </Link>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`${cls(variant, size)} ${className}`}
      onClick={onClick}
    >
      <MessageCircle aria-hidden className="size-4" />
      {label}
    </a>
  );
}
