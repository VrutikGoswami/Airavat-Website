# Premium Tours & Travel Website — First Public Release

An assisted-booking website for a small, owner-operated Kenyan tours and travel company.
Editorial design direction, a flagship Maasai Mara destination page with an interactive
list-and-map explorer, a guided quotation flow, and honest, verifiable copy throughout —
**no live booking, no fake inventory, no invented credentials.**

Built with Next.js (App Router) · TypeScript · Tailwind CSS 4 · React Hook Form · Zod ·
MapLibre GL JS · Lucide.

---

## Quick start

```bash
npm install
npm run dev        # http://localhost:3000
```

Other commands:

```bash
npm run build      # production build
npm run start      # serve the production build
npm run lint       # eslint
npm run typecheck  # tsc --noEmit
node scripts/generate-images.mjs   # regenerate placeholder SVG imagery
```

No environment variables are required in development. Copy `.env.example` to `.env.local`
to configure a branded map style or the canonical site URL.

---

## Architecture

```text
app/                    Routes (server components by default)
  api/enquiries/        Enquiry intake endpoint (Zod-validated, demo store)
  destinations/[slug]/  Data-driven destination pages (Mara is the flagship)
  <service>/            Seven service pages sharing one data-driven layout
components/
  layout/               SiteHeader, MobileNavigation, SiteFooter
  editorial/            PageHero, ServiceIndex, ProcessTimeline, FAQ, CTA…
  destination/          Cards, seasonality chart, filterable explorer
  map/                  MapLibre canvas + list/map composites (client-only, lazy)
  forms/                Guided quote flow, planning starter, field primitives
  ui/                   Button, WhatsAppButton, SectionHeading, ContactLink
config/                 companyConfig, navigation, seasonal campaigns, map provider
data/                   Destinations, services, itineraries, FAQs, map points, testimonials
lib/                    analytics abstraction, Zod schemas, WhatsApp helpers,
                        integration seams (Amadeus/CRM/payments — typed, unimplemented)
types/                  Central domain models (TravelEnquiry, Destination, MapPoint…)
scripts/                Placeholder image generator
```

Key design decisions:

- **Assisted booking, enforced in code.** The API route stores an enquiry and returns a
  reference; nothing simulates reservations. Success copy states explicitly that no
  booking exists.
- **Seasonal campaign system.** `config/campaigns.ts` drives the homepage hero, the header
  link and the Mara feature. Outside the date window (or with `enabled: false`) the site
  falls back to evergreen copy automatically — no stale "happening now" language.
- **Single source of company identity.** Everything reads `config/company.ts`. While the
  WhatsApp number is a placeholder, WhatsApp buttons route to the contact page instead of
  opening a chat with a bracketed number.
- **Destinations are data.** Only `published: true` destinations get pages (Mara, for now);
  the rest appear in the explorer as enquiry-first cards, avoiding thin SEO pages.
- **Maps are isolated.** Tile provider config lives in `config/map.ts` (env-driven, with a
  free default style). The MapLibre canvas handles loading, WebGL failure and reduced
  motion; the accessible place list exists outside the map, so the map is never the only
  source of location information.
- **Future integrations are seams, not fakes.** `lib/integrations` defines typed interfaces
  for Amadeus, CRM, WhatsApp Business, payments and hotel contracts. Only the in-memory
  enquiry store is implemented.

---

## Placeholders to replace before launch

Company identity — all in `config/company.ts`:

| Placeholder | Where |
| --- | --- |
| `[COMPANY NAME]`, `[SHORT NAME]`, `[POSITIONING LINE]` | `config/company.ts` (UI shows "Safari Meridian (working title)" until set) |
| `[PHONE NUMBER]`, `[WHATSAPP NUMBER]`, `[EMAIL ADDRESS]` | `config/company.ts` — WhatsApp/tel/mailto links activate automatically once real values are set |
| `[OFFICE ADDRESS]`, `[OPENING HOURS]` | `config/company.ts` |
| Social links | `config/company.ts` (footer hides them while empty) |

Content:

- **Imagery** — every file in `public/images/` is a generated SVG illustration
  (see `scripts/generate-images.mjs`). Replace with licensed photography, update `alt`
  text, then remove `dangerouslyAllowSVG` from `next.config.ts`.
- **Testimonials** — `data/testimonials.ts` entries are labelled samples; replace with
  permission-cleared feedback and set `isSample: false`.
- **Map points** — all coordinates in `data/map-points.ts` are `verified: false`
  approximations; confirm each before launch.
- **Legal pages** — `/privacy` and `/terms` are drafts with bracketed gaps
  ([JURISDICTION], [PAYMENT METHODS], [PROCESSOR LIST], [RETENTION PERIODS],
  [COMPANY REGISTRATION DETAILS], [INSURANCE POLICY]); professional review required.
- **Payment methods & response times** — deliberately unstated anywhere until confirmed.

Infrastructure:

- `NEXT_PUBLIC_SITE_URL` — canonical origin for metadata/sitemap.
- `NEXT_PUBLIC_MAP_STYLE_URL` / `NEXT_PUBLIC_MAP_PROVIDER_KEY` — branded map tiles
  (development falls back to the free MapLibre demo style, which is low-detail).
- `/api/enquiries` — swap `InMemoryEnquiryStore` for a CRM/email implementation
  (`lib/integrations`). Currently submissions live in server memory only.
- Analytics — register a real sink via `initAnalytics()` (`lib/analytics`); events are
  buffered/logged until then.
- OG image — add a real social share image once brand photography exists.

---

## Pre-launch checklist

- [ ] Replace every `config/company.ts` placeholder and confirm WhatsApp deep links open the right account
- [ ] Replace placeholder SVGs with licensed photography (check alt text + image `sizes`)
- [ ] Verify all map coordinates; set `verified: true` per point
- [ ] Replace sample testimonials or remove the section
- [ ] Legal review of `/privacy` and `/terms`; fill bracketed gaps
- [ ] Connect `/api/enquiries` to CRM or email so submissions reach consultants
- [ ] Set `NEXT_PUBLIC_SITE_URL`; verify sitemap.xml and robots.txt on the production domain
- [ ] Configure branded map tiles (`NEXT_PUBLIC_MAP_STYLE_URL`)
- [ ] Wire analytics sink if wanted; verify events fire
- [ ] Update the seasonal campaign dates/copy for the launch window
- [ ] Add real Open Graph image
- [ ] Lighthouse pass on the production domain (mobile), then fix regressions

## Seasonal campaign operations

Edit `config/campaigns.ts`. To end the Mara campaign early set `enabled: false`; to run a
new one, add an entry with fresh dates, image and CTA. When no campaign is active the
homepage automatically presents evergreen planning content and the header drops the
seasonal link. The Maasai Mara destination page stays live year-round either way.
