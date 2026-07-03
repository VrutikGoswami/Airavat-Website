import type { MetadataRoute } from "next";
import { publishedDestinations } from "@/data/destinations";
import { services } from "@/data/services";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/destinations",
    "/about",
    "/reviews",
    "/faq",
    "/request-a-quote",
    "/contact",
    "/privacy",
    "/terms",
  ];

  return [
    ...staticRoutes.map((route) => ({
      url: `${siteUrl}${route}`,
      changeFrequency: "weekly" as const,
      priority: route === "" ? 1 : 0.7,
    })),
    ...services.map((service) => ({
      url: `${siteUrl}/${service.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...publishedDestinations().map((destination) => ({
      url: `${siteUrl}/destinations/${destination.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),
  ];
}
