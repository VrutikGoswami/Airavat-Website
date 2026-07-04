# Airavat — Interactive Map System (revamped, project-specific)

Enhance the **existing** map system on the Airavat tours & travel website into a
polished, editorial destination-discovery experience. This is not a greenfield
build: MapLibre, dynamic loading, central data, env-driven tiles, a fallback
list, category filters, reset/zoom controls, reduced-motion and an accessible
list already exist. Extend them to meet the requirements below without breaking
the current build.

The map must feel like part of Airavat's premium editorial brand — never a
generic Google Maps embed or a logistics dashboard.

## Work with what exists

Reuse and extend these, don't replace them:

- `components/map/MapCanvas.tsx` — shared MapLibre canvas (markers, popups,
  fit-to-markers, reset, zoom, loading skeleton, WebGL/style error fallback).
- `components/map/MapPlaceList.tsx` — keyboard-accessible location list.
- `components/map/KenyaMapPreview.tsx` → replace with a richer `ExploreKenyaMap`.
- `components/map/MaraMapExplorer.tsx` — Mara page list-and-map.
- `components/map/LazyMaps.tsx` — `next/dynamic` (ssr:false) wrappers.
- `config/map.ts` — tile provider (env `NEXT_PUBLIC_MAP_STYLE_URL` /
  `NEXT_PUBLIC_MAP_PROVIDER_KEY`, free MapLibre demo-tiles fallback,
  `KENYA_VIEW`, `MARA_VIEW`, `MAP_ATTRIBUTION_NOTE`).
- `data/map-points.ts` — the single source of map locations.
- `lib/whatsapp.ts` — `buildWhatsAppUrl`, `whatsappGreeting` (returns null while
  the number is a placeholder → link to `/contact#whatsapp`).
- `config/campaigns.ts` — `getActiveCampaign()` drives the seasonal Mara focus.
- Brand tokens in `app/globals.css`: `ivory`, `sand`, `parchment`, `forest`,
  `ink`, `ink-soft`, `stone`, `ochre`, `clay`, `gold`; fonts Fraunces (display)
  + Manrope (sans). Real photography now lives in `public/images/*.jpg`.

## Data model

Extend `MapPoint` in `types/index.ts`:

```ts
category:
  | "destination" | "reserve" | "conservancy" | "gate"
  | "airstrip" | "town" | "experience" | "departure";
destinationSlug?: string;   // links a point to a destination in data/destinations.ts
image?: string;             // /images/*.jpg
```

In `data/map-points.ts`, the six homepage markers become `category: "destination"`
with an `image`, a `destinationSlug` and an `href`:

- Nairobi, Maasai Mara, Amboseli, Lake Naivasha, Diani Beach, Mombasa.

Keep the Mara detail locations (National Reserve, Mara Triangle, Mara River,
Sekenani Gate, Talek, Nairobi departure, plus airstrip/conservancy) and support
future categories (airstrips, conservancies, camps, lodges, gates, viewpoints,
experience areas). Every demo coordinate stays `verified: false`. Never invent or
imply hotel partnerships.

## Homepage — “Explore Kenya”

Replace the current preview with an `ExploreKenyaMap` section:

- Heading “Explore Kenya” + a one-line description.
- A linked destination list (cards with small thumbnail, name, one-liner) beside
  the map on desktop; a horizontally scrollable rail above a compact map on
  mobile.
- Section actions: **View Maasai Mara** (→ `/destinations/maasai-mara`) and
  **Plan this trip** (→ the quote flow, preselecting the active destination).
- Maasai Mara is visually highlighted as the current seasonal destination
  (gold ring on the marker, “Seasonal focus” badge on the card) whenever
  `getActiveCampaign()` is active.

Two-way sync:

- Selecting a card → move the map to that marker, highlight it, open a popup
  (name, image, short description, action buttons) and scroll the card into view.
- Selecting a marker → highlight and scroll to the matching card and show the
  same information.

## Maasai Mara page — full explorer

Enhance `MaraMapExplorer`:

- Desktop: sticky map beside a scrollable, filterable locations list.
- Mobile: map first, then horizontally scrollable location cards (no cramped
  split screen).
- Category filter chips above the list.
- Popups carry the same image + action buttons; a `defaultDestinationSlug`
  (`"maasai-mara"`) drives “Plan this trip” for sub-locations.

## Popups & cards — enquiry integration

Every destination popup and card exposes:

- **View destination** → the destination page (or `/destinations` if unpublished).
- **Plan this trip** → `/request-a-quote?service=safari&destination=<slug>`.
- **Chat on WhatsApp** → `buildWhatsAppUrl(whatsappGreeting("I would like help
  planning a trip to <name>."))`, falling back to `/contact#whatsapp`. No
  sensitive data in the URL.

Popup images use the Next image optimizer URL to stay light
(`/_next/image?url=…&w=…&q=…`).

## Interactions & style

- Custom brand-coloured markers (ochre for destinations); subtle hover scale and
  a clear active/seasonal ring — no oversized or bouncing markers.
- Smooth `easeTo` movement, `fitBounds` to markers, reset control, zoom controls,
  compact attribution, loading skeleton, error fallback.
- Warm neutral surfaces, thin borders, small-radius cards, minimal controls,
  restrained shadows; respect `prefers-reduced-motion`.

## Performance

- Keep MapLibre out of the initial bundle (dynamic import) **and** only
  initialise the map when its section scrolls into view (IntersectionObserver
  gate). Prevent layout shift with fixed skeleton heights. Optimise images. The
  page must stay usable on slow mobile connections and when WebGL/tiles fail.

## Accessibility

The map is never the only path to the information: a complete linked list,
keyboard navigation, visible focus, accessible labels, screen-reader-friendly
descriptions, sufficient contrast and large mobile touch targets.

## Disclaimer

Keep the discreet note: “Map locations are provided for travel-planning context.
Routes, access points and operating conditions should be confirmed before
travel.”

## Deliverables & verification

Reusable map component; Explore-Kenya homepage section; full Mara explorer;
linked list; category filters; responsive mobile layout; central data file;
quote-form + WhatsApp integration; loading/error fallbacks; env setup; README
instructions for editing locations, styles and providers.

Verify: no SSR errors; markers work; card↔marker sync; filters; reset; mobile
layout; “Plan this trip” preselects the destination; fallback list appears when
the map fails; `npm run build` succeeds.
