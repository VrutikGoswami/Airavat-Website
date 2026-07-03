/**
 * Generates the demonstration imagery in /public/images as flat editorial
 * SVG illustrations in the brand palette. These are placeholders with zero
 * licensing risk — replace with licensed photography before launch.
 *
 * Re-run after edits:  node scripts/generate-images.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const W = 1600;
const H = 1000;
const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "images");

// Brand-aligned scene palettes.
const P = {
  duskSky: ["#E9B44C", "#D97B3F", "#B4531F"],
  daySky: ["#F3E9D2", "#E4CFA3", "#D9B98C"],
  coastSky: ["#F3E9D2", "#DCE3D5", "#B9C7B2"],
  nightSky: ["#3A4A3A", "#2E3B2C", "#232D22"],
  ink: "#26221B",
  deep: "#2E3B2C",
  olive: "#4A5A40",
  sage: "#8B9678",
  sand: "#D9C39A",
  clay: "#9A4519",
  ochre: "#B4531F",
  gold: "#E9B44C",
  cream: "#F7F2E9",
  water: "#7C8FA0",
};

const uid = (() => {
  let i = 0;
  return () => `g${(i += 1)}`;
})();

function sky(stops) {
  const id = uid();
  const stopEls = stops
    .map((c, i) => `<stop offset="${Math.round((i / (stops.length - 1)) * 100)}%" stop-color="${c}"/>`)
    .join("");
  return {
    def: `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">${stopEls}</linearGradient>`,
    fill: `url(#${id})`,
  };
}

const sun = (cx, cy, r, color = P.gold, opacity = 0.9) =>
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${color}" opacity="${opacity}"/>`;

function hills(y, amp, color, opacity = 1) {
  let d = `M0 ${y}`;
  for (let x = 0; x <= W; x += 200) {
    const dy = amp * Math.sin(x / 240 + y);
    d += ` Q ${x + 100} ${y - amp - dy} ${x + 200} ${y + dy * 0.4}`;
  }
  d += ` L ${W} ${H} L 0 ${H} Z`;
  return `<path d="${d}" fill="${color}" opacity="${opacity}"/>`;
}

const ground = (y, color) => `<rect x="0" y="${y}" width="${W}" height="${H - y}" fill="${color}"/>`;

function acacia(x, y, s, color = P.ink) {
  return `<g fill="${color}" transform="translate(${x} ${y}) scale(${s})">
    <path d="M0 0 L6 -70 L10 -70 L18 0 Z"/>
    <path d="M8 -70 L-52 -96 M8 -70 L64 -100 M8 -70 L4 -104" stroke="${color}" stroke-width="5" fill="none"/>
    <ellipse cx="-48" cy="-98" rx="46" ry="12"/>
    <ellipse cx="56" cy="-102" rx="52" ry="13"/>
    <ellipse cx="4" cy="-112" rx="40" ry="11"/>
  </g>`;
}

const birds = (x, y, s = 1, color = P.ink) =>
  `<g stroke="${color}" stroke-width="${3 * s}" fill="none" opacity="0.75">
    <path d="M${x} ${y} q ${8 * s} ${-8 * s} ${16 * s} 0 q ${8 * s} ${-8 * s} ${16 * s} 0"/>
    <path d="M${x + 60 * s} ${y - 26 * s} q ${7 * s} ${-7 * s} ${14 * s} 0 q ${7 * s} ${-7 * s} ${14 * s} 0"/>
    <path d="M${x - 50 * s} ${y - 40 * s} q ${6 * s} ${-6 * s} ${12 * s} 0 q ${6 * s} ${-6 * s} ${12 * s} 0"/>
  </g>`;

function wildebeest(x, y, s, color = P.ink) {
  return `<g fill="${color}" transform="translate(${x} ${y}) scale(${s})">
    <ellipse cx="0" cy="0" rx="26" ry="12"/>
    <rect x="-22" y="6" width="6" height="18"/>
    <rect x="14" y="6" width="6" height="18"/>
    <path d="M20 -6 L36 -14 L38 -8 L26 0 Z"/>
    <path d="M34 -16 q 6 -6 10 -2"/>
  </g>`;
}

const herd = (y, color = P.ink) =>
  [0, 1, 2, 3, 4, 5, 6]
    .map((i) => wildebeest(180 + i * 200 + (i % 3) * 40, y + (i % 2) * 14, 0.9 + (i % 3) * 0.12, color))
    .join("");

function balloon(x, y, s, body = P.ochre, stripe = P.cream) {
  return `<g transform="translate(${x} ${y}) scale(${s})">
    <path d="M0 -90 C -52 -90 -60 -20 0 30 C 60 -20 52 -90 0 -90 Z" fill="${body}"/>
    <path d="M-18 -86 C -30 -60 -26 -10 0 28 C 26 -10 30 -60 18 -86" fill="none" stroke="${stripe}" stroke-width="6" opacity="0.85"/>
    <path d="M-12 34 L12 34 L9 52 L-9 52 Z" fill="${P.ink}"/>
    <path d="M-10 30 L-8 40 M10 30 L8 40" stroke="${P.ink}" stroke-width="3"/>
  </g>`;
}

function safariVan(x, y, s, body = P.olive) {
  return `<g transform="translate(${x} ${y}) scale(${s})">
    <rect x="0" y="0" width="150" height="52" rx="9" fill="${body}"/>
    <rect x="14" y="-26" width="108" height="30" rx="6" fill="${body}"/>
    <rect x="22" y="-20" width="26" height="18" rx="3" fill="${P.cream}" opacity="0.85"/>
    <rect x="56" y="-20" width="26" height="18" rx="3" fill="${P.cream}" opacity="0.85"/>
    <rect x="90" y="-20" width="24" height="18" rx="3" fill="${P.cream}" opacity="0.85"/>
    <rect x="10" y="-34" width="116" height="10" rx="4" fill="${P.ink}"/>
    <circle cx="36" cy="56" r="17" fill="${P.ink}"/>
    <circle cx="114" cy="56" r="17" fill="${P.ink}"/>
    <circle cx="36" cy="56" r="7" fill="${P.sand}"/>
    <circle cx="114" cy="56" r="7" fill="${P.sand}"/>
  </g>`;
}

function plane(x, y, s, color = P.ink) {
  return `<g fill="${color}" transform="translate(${x} ${y}) scale(${s}) rotate(-12)">
    <path d="M0 0 L150 0 Q170 0 176 8 Q170 16 150 16 L0 16 Q-14 8 0 0 Z"/>
    <path d="M60 4 L28 -44 L44 -44 L88 4 Z"/>
    <path d="M60 12 L36 48 L50 48 L88 12 Z"/>
    <path d="M142 2 L128 -22 L140 -22 L158 2 Z"/>
  </g>`;
}

function tent(x, y, s, color = P.sand) {
  return `<g transform="translate(${x} ${y}) scale(${s})">
    <path d="M0 0 L70 -64 L140 0 Z" fill="${color}"/>
    <path d="M70 -64 L70 0 M40 0 L70 -40 L100 0" stroke="${P.ink}" stroke-width="4" fill="none" opacity="0.55"/>
    <path d="M58 0 L70 -22 L82 0 Z" fill="${P.ink}" opacity="0.8"/>
  </g>`;
}

function palm(x, y, s, color = P.deep) {
  const frond = (a) => `<path d="M0 -60 Q ${44 * Math.cos(a)} ${-60 + 40 * Math.sin(a) - 26} ${78 * Math.cos(a)} ${-60 + 44 * Math.sin(a)}" stroke="${color}" stroke-width="7" fill="none" stroke-linecap="round"/>`;
  return `<g transform="translate(${x} ${y}) scale(${s})">
    <path d="M-4 0 Q 2 -34 6 -60 L14 -58 Q 8 -30 8 0 Z" fill="${color}"/>
    ${[0.2, 0.9, 1.7, 2.5, 3.1, -0.5].map(frond).join("")}
    <circle cx="8" cy="-62" r="7" fill="${color}"/>
  </g>`;
}

function skyline(y, color = P.ink) {
  const blocks = [
    [60, 200, 120], [200, 320, 90], [310, 160, 140], [470, 260, 110],
    [600, 380, 100], [720, 220, 150], [880, 300, 120], [1020, 180, 100],
    [1140, 340, 130], [1290, 240, 110], [1420, 160, 140],
  ];
  const rects = blocks
    .map(([x, h, w]) => `<rect x="${x}" y="${y - h}" width="${w}" height="${h}" fill="${color}"/>`)
    .join("");
  const lights = blocks
    .map(([x, h, w], i) =>
      [...Array(4)]
        .map(
          (_, j) =>
            `<rect x="${x + 14 + ((i + j) % 3) * (w / 3.4)}" y="${y - h + 18 + j * (h / 5)}" width="10" height="14" fill="${P.gold}" opacity="0.55"/>`,
        )
        .join(""),
    )
    .join("");
  return rects + lights;
}

function waves(y, color = P.cream) {
  let out = "";
  for (let row = 0; row < 3; row += 1) {
    let d = `M0 ${y + row * 46}`;
    for (let x = 0; x <= W; x += 120) d += ` q 60 ${row % 2 ? 14 : -14} 120 0`;
    out += `<path d="${d}" stroke="${color}" stroke-width="5" fill="none" opacity="${0.5 - row * 0.12}"/>`;
  }
  return out;
}

function scene(name, skyStops, layers) {
  const s = sky(skyStops);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="Illustrative placeholder — replace with licensed photography">
  <defs>${s.def}</defs>
  <rect width="${W}" height="${H}" fill="${s.fill}"/>
  ${layers.join("\n  ")}
</svg>`;
  writeFileSync(join(OUT, `${name}.svg`), svg);
  console.log(`wrote ${name}.svg`);
}

mkdirSync(OUT, { recursive: true });

// --- Mara & safari ---------------------------------------------------------
scene("mara-hero", P.duskSky, [
  sun(1130, 430, 190),
  birds(420, 240, 1.2),
  hills(560, 40, "#7A4A28", 0.8),
  ground(650, "#5D3A1E"),
  ground(780, "#3F2A15"),
  herd(700, "#2A1B0E"),
  acacia(210, 780, 1.7, "#241709"),
  acacia(1310, 760, 1.35, "#241709"),
  acacia(760, 745, 0.9, "#2A1B0E"),
]);

scene("mara-plains", P.daySky, [
  sun(320, 250, 110, P.gold, 0.7),
  birds(1050, 220, 1),
  hills(520, 55, P.sage, 0.7),
  ground(620, "#C9AF7F"),
  ground(800, "#AD8F5F"),
  herd(730, "#4A3A20"),
  acacia(1240, 790, 1.6, P.deep),
  acacia(420, 770, 1.1, P.deep),
  safariVan(700, 820, 1.15),
]);

scene("mara-river", P.daySky, [
  sun(1240, 240, 100, P.gold, 0.65),
  hills(480, 50, P.sage, 0.65),
  ground(600, "#B99A6B"),
  `<path d="M0 720 C 360 660 620 780 900 720 C 1180 660 1420 740 1600 700 L1600 1000 L0 1000 Z" fill="${P.water}"/>`,
  waves(770, P.cream),
  acacia(180, 660, 1.2, P.deep),
  acacia(1380, 650, 1.45, P.deep),
  herd(620, "#4A3A20"),
]);

scene("experience-drive", P.daySky, [
  sun(1200, 260, 120, P.gold, 0.7),
  hills(540, 45, P.sage, 0.7),
  ground(640, "#C4A878"),
  ground(820, "#A5875A"),
  acacia(280, 800, 1.5, P.deep),
  safariVan(880, 830, 1.5),
  birds(600, 260, 1),
]);

scene("experience-balloon", P.duskSky, [
  sun(400, 380, 150),
  balloon(1050, 330, 1.6),
  balloon(650, 200, 0.9, P.clay),
  hills(640, 45, "#7A4A28", 0.8),
  ground(730, "#4A2F17"),
  acacia(1280, 880, 1.4, "#241709"),
  birds(240, 220, 1),
]);

scene("experience-photo", P.duskSky, [
  sun(820, 360, 170, P.gold, 0.85),
  hills(600, 40, "#7A4A28", 0.75),
  ground(700, "#4A2F17"),
  wildebeest(820, 640, 2.2, "#241709"),
  acacia(300, 700, 1.3, "#241709"),
  safariVan(1150, 700, 1.1, "#3A2A14"),
  birds(1250, 250, 1.1),
]);

scene("experience-conservancy", P.daySky, [
  sun(300, 240, 100, P.gold, 0.6),
  hills(500, 60, P.sage, 0.8),
  ground(620, "#B7A374"),
  tent(620, 800, 1.7),
  tent(1080, 800, 1.2, "#CBB088"),
  acacia(240, 780, 1.4, P.deep),
  birds(1200, 260, 1),
]);

scene("experience-family", P.daySky, [
  sun(1250, 250, 110, P.gold, 0.65),
  hills(540, 50, P.sage, 0.7),
  ground(660, "#C4A878"),
  acacia(950, 640, 1.0, P.deep),
  safariVan(420, 830, 1.5),
  `<g fill="${P.ink}"><circle cx="1130" cy="806" r="16"/><rect x="1120" y="820" width="20" height="40" rx="8"/><circle cx="1180" cy="816" r="12"/><rect x="1172" y="826" width="16" height="34" rx="7"/></g>`,
  birds(700, 240, 1),
]);

scene("experience-dining", P.nightSky, [
  `<circle cx="1200" cy="230" r="90" fill="${P.cream}" opacity="0.9"/>`,
  `<circle cx="1170" cy="210" r="80" fill="#3A4A3A"/>`,
  ground(700, "#1D2418"),
  `<g transform="translate(700 780)"><rect x="-90" y="0" width="180" height="12" rx="4" fill="${P.sand}"/><rect x="-70" y="12" width="10" height="46" fill="${P.sand}"/><rect x="60" y="12" width="10" height="46" fill="${P.sand}"/><circle cx="-30" cy="-12" r="9" fill="${P.gold}"/><circle cx="10" cy="-12" r="9" fill="${P.gold}"/><circle cx="46" cy="-14" r="7" fill="${P.ochre}"/></g>`,
  acacia(280, 760, 1.4, "#141A11"),
  `<circle cx="450" cy="330" r="3" fill="${P.cream}"/><circle cx="620" cy="180" r="2.5" fill="${P.cream}"/><circle cx="890" cy="260" r="3" fill="${P.cream}"/><circle cx="320" cy="150" r="2" fill="${P.cream}"/><circle cx="1010" cy="120" r="2.5" fill="${P.cream}"/>`,
]);

scene("experience-flyin", P.daySky, [
  sun(360, 260, 120, P.gold, 0.7),
  plane(880, 300, 1.5),
  hills(600, 50, P.sage, 0.7),
  ground(700, "#BFA271"),
  `<rect x="500" y="840" width="620" height="14" rx="7" fill="#8A7048"/>`,
  acacia(240, 820, 1.4, P.deep),
  birds(1300, 200, 1),
]);

scene("experience-road", P.daySky, [
  sun(1220, 240, 110, P.gold, 0.65),
  hills(500, 70, P.sage, 0.8),
  hills(580, 40, P.olive, 0.7),
  ground(660, "#B79868"),
  `<path d="M700 1000 L820 660 L860 660 L1050 1000 Z" fill="#6E5638"/>`,
  `<path d="M868 1000 L870 660 L878 660 L920 1000 Z" fill="${P.cream}" opacity="0.5"/>`,
  safariVan(810, 700, 1.0),
  acacia(300, 640, 1.2, P.deep),
]);

scene("experience-coast", P.coastSky, [
  sun(1200, 220, 110, P.gold, 0.75),
  `<rect x="0" y="560" width="${W}" height="240" fill="${P.water}"/>`,
  waves(600),
  ground(800, "#E6D3A8"),
  palm(280, 800, 1.8),
  palm(430, 810, 1.3),
  birds(800, 240, 1.1),
]);

// --- Itineraries -------------------------------------------------------------
scene("itinerary-mara", P.duskSky, [
  sun(500, 400, 170),
  hills(620, 45, "#7A4A28", 0.8),
  ground(720, "#4A2F17"),
  herd(660, "#241709"),
  acacia(1200, 860, 1.7, "#241709"),
  birds(950, 260, 1.1),
]);

scene("itinerary-nairobi-mara", P.duskSky, [
  sun(1150, 350, 150),
  skyline(660, "#2A1B0E"),
  ground(660, "#4A2F17"),
  acacia(260, 850, 1.5, "#241709"),
  wildebeest(600, 800, 1.6, "#241709"),
  birds(500, 220, 1),
]);

scene("itinerary-coast", P.coastSky, [
  sun(400, 240, 120, P.gold, 0.8),
  `<rect x="0" y="540" width="${W}" height="260" fill="${P.water}"/>`,
  waves(580),
  `<path d="M1100 540 l90 0 l-14 -36 l-62 0 Z" fill="${P.cream}"/><rect x="1140" y="470" width="6" height="40" fill="${P.ink}"/><path d="M1146 470 l52 26 l-52 6 Z" fill="${P.ochre}"/>`,
  ground(800, "#E6D3A8"),
  palm(1320, 800, 1.9),
  palm(180, 810, 1.4),
]);

scene("itinerary-family", P.daySky, [
  sun(1230, 250, 110, P.gold, 0.7),
  hills(520, 55, P.sage, 0.75),
  `<ellipse cx="800" cy="680" rx="520" ry="70" fill="${P.water}" opacity="0.85"/>`,
  ground(740, "#BFA271"),
  safariVan(560, 830, 1.3),
  acacia(1180, 810, 1.4, P.deep),
  birds(420, 230, 1),
]);

scene("itinerary-corporate", P.nightSky, [
  `<circle cx="330" cy="220" r="70" fill="${P.cream}" opacity="0.85"/>`,
  skyline(760, "#1A2016"),
  plane(950, 210, 1.2, "#141A11"),
  ground(760, "#141A11"),
  `<rect x="0" y="880" width="${W}" height="8" fill="${P.gold}" opacity="0.35"/>`,
]);

// --- Services ---------------------------------------------------------------
scene("service-flights", P.duskSky, [
  sun(1150, 500, 210),
  plane(560, 330, 2.2, "#241709"),
  hills(700, 35, "#7A4A28", 0.7),
  ground(790, "#4A2F17"),
  `<rect x="380" y="890" width="840" height="12" rx="6" fill="#2A1B0E"/>`,
  birds(300, 220, 1),
]);

scene("service-hotels", P.nightSky, [
  `<circle cx="1250" cy="200" r="80" fill="${P.cream}" opacity="0.9"/>`,
  skyline(780, "#1A2016"),
  ground(780, "#141A11"),
  `<g transform="translate(640 500)"><rect x="0" y="0" width="330" height="280" fill="#232D22"/><rect x="24" y="24" width="60" height="70" fill="${P.gold}" opacity="0.75"/><rect x="132" y="24" width="60" height="70" fill="${P.gold}" opacity="0.45"/><rect x="240" y="24" width="60" height="70" fill="${P.gold}" opacity="0.7"/><rect x="24" y="120" width="60" height="70" fill="${P.gold}" opacity="0.5"/><rect x="132" y="120" width="60" height="70" fill="${P.gold}" opacity="0.8"/><rect x="240" y="120" width="60" height="70" fill="${P.gold}" opacity="0.4"/><rect x="120" y="216" width="90" height="64" fill="${P.sand}"/></g>`,
]);

scene("service-transport", P.daySky, [
  sun(300, 230, 100, P.gold, 0.65),
  skyline(600, "#8B967855"),
  ground(640, "#B7A374"),
  `<rect x="0" y="810" width="${W}" height="26" fill="#6E5638"/>`,
  `<rect x="0" y="820" width="70" height="6" fill="${P.cream}" opacity="0.6"/><rect x="140" y="820" width="70" height="6" fill="${P.cream}" opacity="0.6"/><rect x="280" y="820" width="70" height="6" fill="${P.cream}" opacity="0.6"/><rect x="420" y="820" width="70" height="6" fill="${P.cream}" opacity="0.6"/><rect x="560" y="820" width="70" height="6" fill="${P.cream}" opacity="0.6"/><rect x="700" y="820" width="70" height="6" fill="${P.cream}" opacity="0.6"/><rect x="840" y="820" width="70" height="6" fill="${P.cream}" opacity="0.6"/><rect x="980" y="820" width="70" height="6" fill="${P.cream}" opacity="0.6"/><rect x="1120" y="820" width="70" height="6" fill="${P.cream}" opacity="0.6"/><rect x="1260" y="820" width="70" height="6" fill="${P.cream}" opacity="0.6"/><rect x="1400" y="820" width="70" height="6" fill="${P.cream}" opacity="0.6"/>`,
  safariVan(620, 760, 1.5, P.deep),
  birds(1150, 230, 1),
]);

scene("service-corporate", P.nightSky, [
  `<circle cx="380" cy="190" r="66" fill="${P.cream}" opacity="0.85"/>`,
  skyline(820, "#1A2016"),
  plane(1020, 240, 1.1, "#101510"),
  ground(820, "#141A11"),
]);

scene("service-group", P.daySky, [
  sun(1240, 240, 110, P.gold, 0.7),
  hills(560, 45, P.sage, 0.7),
  ground(680, "#BFA271"),
  `<g transform="translate(480 760)"><rect x="0" y="0" width="300" height="80" rx="10" fill="${P.deep}"/><rect x="16" y="14" width="52" height="34" rx="4" fill="${P.cream}" opacity="0.85"/><rect x="84" y="14" width="52" height="34" rx="4" fill="${P.cream}" opacity="0.85"/><rect x="152" y="14" width="52" height="34" rx="4" fill="${P.cream}" opacity="0.85"/><rect x="220" y="14" width="52" height="34" rx="4" fill="${P.cream}" opacity="0.85"/><circle cx="60" cy="88" r="20" fill="${P.ink}"/><circle cx="240" cy="88" r="20" fill="${P.ink}"/></g>`,
  `<g fill="${P.ink}"><circle cx="920" cy="790" r="14"/><rect x="911" y="802" width="18" height="38" rx="8"/><circle cx="965" cy="792" r="13"/><rect x="957" y="803" width="17" height="36" rx="8"/><circle cx="1008" cy="795" r="12"/><rect x="1001" y="805" width="15" height="33" rx="7"/><circle cx="1046" cy="798" r="10"/><rect x="1040" y="806" width="13" height="28" rx="6"/></g>`,
  acacia(220, 660, 1.2, P.deep),
]);

// --- Destination previews -----------------------------------------------------
scene("dest-amboseli", P.daySky, [
  `<path d="M500 470 L800 210 L1100 470 Z" fill="#6C7A8A"/>`,
  `<path d="M713 285 L800 210 L887 285 L845 285 L800 250 L755 285 Z" fill="${P.cream}"/>`,
  ground(470, "#C9B183"),
  ground(760, "#AD8F5F"),
  `<g fill="#3A2A14"><ellipse cx="700" cy="830" rx="70" ry="42"/><rect x="640" y="850" width="18" height="52"/><rect x="740" y="850" width="18" height="52"/><circle cx="768" cy="800" r="26"/><path d="M780 810 q 30 10 26 56 q -16 4 -22 -10" /><path d="M745 780 q -20 -28 -46 -22" stroke="#3A2A14" stroke-width="8" fill="none"/></g>`,
  acacia(300, 760, 1.3, P.deep),
  birds(1150, 240, 1),
]);

scene("dest-naivasha", P.coastSky, [
  sun(1200, 230, 100, P.gold, 0.7),
  hills(460, 60, P.sage, 0.8),
  `<rect x="0" y="600" width="${W}" height="230" fill="${P.water}"/>`,
  waves(660),
  ground(830, "#9BA97F"),
  `<g fill="${P.ink}" opacity="0.85"><ellipse cx="620" cy="700" rx="46" ry="18"/><circle cx="662" cy="682" r="12"/><path d="M672 678 q 14 -2 16 8" stroke="${P.ink}" stroke-width="5" fill="none"/></g>`,
  acacia(230, 820, 1.3, P.deep),
  birds(880, 250, 1.2),
]);

scene("dest-nairobi", P.duskSky, [
  sun(1180, 380, 160),
  skyline(700, "#2A1B0E"),
  ground(700, "#3F2A15"),
  acacia(220, 860, 1.5, "#241709"),
  `<g fill="#241709"><ellipse cx="600" cy="820" rx="30" ry="14"/><rect x="580" y="830" width="8" height="26"/><rect x="614" y="830" width="8" height="26"/><path d="M624 812 L648 770 L654 774 L636 816 Z"/><circle cx="652" cy="766" r="8"/></g>`,
  birds(800, 240, 1),
]);

scene("dest-mombasa", P.coastSky, [
  sun(320, 230, 110, P.gold, 0.75),
  `<rect x="0" y="520" width="${W}" height="260" fill="${P.water}"/>`,
  waves(560),
  `<path d="M1050 520 l120 0 l-18 -44 l-84 0 Z" fill="${P.cream}"/><rect x="1104" y="430" width="7" height="48" fill="${P.ink}"/><path d="M1111 430 l60 30 l-60 8 Z" fill="${P.ochre}"/>`,
  ground(780, "#E6D3A8"),
  `<g fill="#8A7048"><rect x="430" y="620" width="200" height="160" /><rect x="410" y="600" width="240" height="26"/><rect x="470" y="660" width="40" height="120" fill="#5C4A30"/><rect x="550" y="660" width="46" height="60" fill="#5C4A30"/></g>`,
  palm(300, 780, 1.6),
  palm(1350, 790, 1.9),
]);

console.log("done");
