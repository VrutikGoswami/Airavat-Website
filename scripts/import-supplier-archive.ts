import { createHash, randomUUID } from "node:crypto";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";
import { rateSheets } from "../data/rates";
import type { HotelRateSheet, OccupancyKey, RatePeriod } from "../types/rates";

const BATCH = "initial-supplier-archive-2026-07";
const APPLY = process.argv.includes("--apply");
const archiveArg = process.argv.find((arg) => arg.startsWith("--archive-root="));
const archiveRoot = path.resolve(archiveArg?.split("=").slice(1).join("=") || "../Airavat Supplier Rates");

function loadLocalEnv() {
  const file = path.resolve(".env.local");
  if (!existsSync(file)) return;
  for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
    const match = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!match || process.env[match[1]]) continue;
    process.env[match[1]] = match[2].replace(/^['"]|['"]$/g, "");
  }
}

function walk(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(fullPath) : [fullPath];
  });
}

function posixRelative(filePath: string): string {
  return path.relative(archiveRoot, filePath).split(path.sep).join("/");
}

function safeFileName(value: string): string {
  return value.normalize("NFKD").replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/-+/g, "-");
}

function slugify(value: string): string {
  return value.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function sourceFor(sheet: HotelRateSheet, period: RatePeriod): string {
  if (["Kibo Safari Camp", "Mara Maisha Camp", "Maisha Sweetwaters Camp"].includes(sheet.hotelName)) {
    return "Multiple Destinations/Maisha Group Resident Rates 2026-AIRAVAT TOURS AND TRAVEL LTD.pdf";
  }
  if (sheet.hotelName.startsWith("Almanara")) return "Diani/Almanara_Rates_Rack_2026.pdf";
  if (sheet.hotelName.startsWith("Jacaranda")) return "Diani/JIOBR - East African Resident Rates 2026.pdf";
  if (sheet.hotelName === "Lantana Galu Beach") {
    return sheet.market === "non-resident"
      ? "Diani/LGB USD NON-RESIDENT RACK RATES 2027.pdf"
      : "Diani/LGB KSH RESIDENT RACK RATES 2027.pdf";
  }
  if (sheet.hotelName === "The Maji Beach Boutique Hotel") {
    return sheet.market === "non-resident"
      ? "Diani/THE MAJI BEACH BOUTIQUE HOTEL RACK RATE 2025-2026.pdf"
      : "Diani/THE MAJI BEACH BOUTIQUE HOTEL RATE CARD 2025-2026 EAST AFRICA ..pdf";
  }
  if (sheet.hotelName === "Kinondo Kwetu") {
    if (sheet.market === "non-resident") return "Diani/2026 20_ USD NET Rates Kinondo Kwetu.pdf";
    return period.start < "2027-01-11"
      ? "Diani/2026 EA Resident rates New.pdf"
      : "Diani/2027 EA RESIDENT Rates Kinondo Kwetu.pdf";
  }
  if (sheet.hotelName === "Swahili Beach Resort") {
    return sheet.market === "non-resident"
      ? "Diani/SBR USD NON-RESIDENT STO Contract 2026 (2).pdf"
      : "Diani/SBR KES RESIDENT STO Contract 2026.pdf";
  }
  if (sheet.hotelName.startsWith("Diamonds Leisure")) {
    if (sheet.market === "non-resident") {
      return "Diani/2026-27 Diamonds Leisure Beach & Golf Resort_STO Rates (1) - Copy - Copy - Copy.pdf";
    }
    return sheet.board === "half-board"
      ? "Diani/Diamonds Leisure Beach_HB_Resident Rates 2025_2026 - Copy.pdf"
      : "Diani/Diamonds Leisure Beach_AI_Resident Rates 2025_2026 - Copy - Copy - Copy.pdf";
  }
  if (sheet.hotelName.startsWith("Diani Reef")) {
    return sheet.market === "non-resident"
      ? "Diani/Room Rates USD 2026 (1) (1).pdf"
      : "Diani/Room Rates KES 2026 TA (2) (1).pdf";
  }
  throw new Error(`No source mapping for ${sheet.hotelName}`);
}

const occupancyDetails: Record<OccupancyKey, { label: string; adults: number | null; children: number | null; rateType: string; unit: string }> = {
  single: { label: "Single", adults: 1, children: 0, rateType: "Accommodation", unit: "Per Room Per Night" },
  double: { label: "Double", adults: 2, children: 0, rateType: "Accommodation", unit: "Per Room Per Night" },
  triple: { label: "Triple", adults: 3, children: 0, rateType: "Accommodation", unit: "Per Room Per Night" },
  perUnit: { label: "Whole Unit", adults: null, children: null, rateType: "Accommodation", unit: "Per Room Per Night" },
  childSharing: { label: "Child Sharing", adults: null, children: 1, rateType: "Child", unit: "Per Child Per Night" },
  childTeenSharing: { label: "Teen Sharing", adults: null, children: 1, rateType: "Child", unit: "Per Child Per Night" },
  childThirdBed: { label: "Child Third Bed", adults: null, children: 1, rateType: "Child", unit: "Per Child Per Night" },
};

const boardNames: Record<HotelRateSheet["board"], string> = {
  "full-board": "Full Board", "half-board": "Half Board", "bed-breakfast": "Bed & Breakfast",
  "all-inclusive": "All Inclusive", "room-only": "Room Only",
};

const marketNames: Record<HotelRateSheet["market"], string> = {
  "east-african-resident": "East African Resident", "non-resident": "Non-Resident", all: "All",
};

type ImportRow = Record<string, unknown> & { source: string; hotel_slug: string };

function extractedRows(): ImportRow[] {
  const rows: ImportRow[] = [];
  for (const sheet of rateSheets) {
    const hotelSlug = slugify(`${sheet.hotelName}-${sheet.destinationName}`);
    const rooms = new Map(sheet.roomTypes.map((room) => [room.id, room.name]));
    for (const period of sheet.periods) {
      const source = sourceFor(sheet, period);
      for (const [roomId, occupancies] of Object.entries(period.rates)) {
        for (const [occupancyKey, amount] of Object.entries(occupancies)) {
          if (typeof amount !== "number") continue;
          const occupancy = occupancyDetails[occupancyKey as OccupancyKey];
          const signature = [source, hotelSlug, period.start, period.end, roomId, occupancyKey, sheet.board, sheet.market, amount].join("|");
          rows.push({
            source,
            hotel_slug: hotelSlug,
            extraction_key: createHash("sha256").update(signature).digest("hex"),
            rate_type: occupancy.rateType,
            season_name: period.season,
            valid_from: period.start,
            valid_to: period.end,
            booking_by: null,
            blackout_dates: [],
            room_type: rooms.get(roomId) || roomId,
            meal_plan: boardNames[sheet.board],
            occupancy: occupancy.label,
            adults: occupancy.adults,
            children: occupancy.children,
            amount,
            currency: sheet.currency,
            market: marketNames[sheet.market],
            unit_basis: occupancy.unit,
            minimum_stay: null,
            tax_included: "Yes",
            commission_included: "Unknown",
            child_policy: sheet.childPolicy ? JSON.stringify(sheet.childPolicy) : null,
            cancellation_policy: null,
            payment_terms: null,
            conditions: (sheet.notes ?? []).join(" | ") || null,
            source_page: null,
            ai_confidence: "High",
            validation_errors: [],
            review_status: "pending",
            active: false,
          });
        }
      }
    }
  }
  return rows;
}

async function main() {
  loadLocalEnv();
  if (!existsSync(archiveRoot)) throw new Error(`Archive not found: ${archiveRoot}`);
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.");

  const pdfs = walk(archiveRoot).filter((file) => path.extname(file).toLowerCase() === ".pdf");
  const ignored = walk(archiveRoot).filter((file) => path.extname(file).toLowerCase() !== ".pdf");
  const rows = extractedRows();
  const verifiedSources = new Set(rows.map((row) => row.source));
  const summary = { pdfs: pdfs.length, verifiedSources: verifiedSources.size, sheets: rateSheets.length, rows: rows.length, ignored: ignored.map(posixRelative) };
  console.log(JSON.stringify(summary, null, 2));
  if (!APPLY) {
    console.log("Dry run only. Re-run with --apply to upload and publish the verified batch.");
    return;
  }

  const supabase = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  const hotelIds = new Map<string, string>();
  for (const sheet of rateSheets) {
    const slug = slugify(`${sheet.hotelName}-${sheet.destinationName}`);
    if (hotelIds.has(slug)) continue;
    const { data, error } = await supabase.from("rate_hotels").upsert({
      slug,
      name: sheet.hotelName,
      destination_slug: sheet.destinationSlug,
      destination_name: sheet.destinationName,
      country: "Kenya",
      hotel_group: sheet.group ?? null,
      website_url: sheet.websiteUrl ?? null,
      image_urls: sheet.images ?? [],
      active: true,
    }, { onConflict: "slug" }).select("id").single();
    if (error || !data) throw error || new Error(`Could not upsert ${sheet.hotelName}`);
    hotelIds.set(slug, data.id);
  }

  let publishedDocuments = 0;
  let stagedDocuments = 0;
  let duplicateFiles = 0;
  for (const filePath of pdfs) {
    const source = posixRelative(filePath);
    const bytes = readFileSync(filePath);
    const hash = createHash("sha256").update(bytes).digest("hex");
    const { data: existing, error: findError } = await supabase.from("rate_documents")
      .select("id,status,storage_path").eq("content_sha256", hash).maybeSingle();
    if (findError) throw findError;

    let documentId = existing?.id as string | undefined;
    let storagePath = existing?.storage_path as string | undefined;
    if (!documentId) {
      documentId = randomUUID();
      storagePath = `archive/${BATCH}/${hash.slice(0, 12)}/${safeFileName(path.basename(filePath))}`;
      const { error: uploadError } = await supabase.storage.from("supplier-rate-documents")
        .upload(storagePath, bytes, { contentType: "application/pdf", upsert: false });
      if (uploadError) throw uploadError;
      const { error: insertError } = await supabase.from("rate_documents").insert({
        id: documentId,
        file_name: path.basename(filePath),
        storage_bucket: "supplier-rate-documents",
        storage_path: storagePath,
        mime_type: "application/pdf",
        file_size_bytes: bytes.length,
        content_sha256: hash,
        source_relative_path: source,
        ingestion_batch: BATCH,
        status: "uploaded",
        error_message: verifiedSources.has(source) ? null : "Awaiting structured extraction and staff review.",
      });
      if (insertError) throw insertError;
    } else if (!verifiedSources.has(source) || existing?.status === "approved") {
      duplicateFiles += 1;
      continue;
    }

    const sourceRows = rows.filter((row) => row.source === source);
    if (sourceRows.length === 0) {
      stagedDocuments += 1;
      continue;
    }

    const sheets = rateSheets.filter((sheet) => sheet.periods.some((period) => sourceFor(sheet, period) === source));
    const hotelSlugs = [...new Set(sourceRows.map((row) => row.hotel_slug))];
    const currencies = [...new Set(sourceRows.map((row) => String(row.currency)))];
    const markets = [...new Set(sourceRows.map((row) => String(row.market)))];
    await supabase.from("hotel_rate_rows").delete().eq("document_id", documentId);
    const { error: updateError } = await supabase.from("rate_documents").update({
      supplier_name: sheets[0]?.group || sheets[0]?.hotelName || "Supplier",
      contract_name: path.basename(filePath),
      document_type: "Rate Sheet",
      pricing_basis: sheets[0]?.basis || "unknown",
      default_market: markets.length === 1 ? markets[0] : "Multiple",
      default_currency: currencies.length === 1 ? currencies[0] : null,
      status: "review",
      extraction_model: "verified-legacy-transcription",
      hotel_count: hotelSlugs.length,
      valid_rate_rows: sourceRows.length,
      invalid_rate_rows: 0,
      warnings: ["Imported from the previously verified website transcription; source PDF preserved for audit."],
      summary: `Verified catalog import containing ${sourceRows.length} rate rows.`,
      ai_confidence: "High",
      extraction_payload: { importer: BATCH, source },
      extracted_at: new Date().toISOString(),
      error_message: null,
    }).eq("id", documentId);
    if (updateError) throw updateError;

    const databaseRows = sourceRows.map(({ source, hotel_slug, ...row }) => {
      void source;
      return {
        ...row,
        document_id: documentId,
        hotel_id: hotelIds.get(hotel_slug),
      };
    });
    for (let offset = 0; offset < databaseRows.length; offset += 500) {
      const { error } = await supabase.from("hotel_rate_rows").insert(databaseRows.slice(offset, offset + 500));
      if (error) throw error;
    }
    const { error: publishError } = await supabase.rpc("publish_rate_document_service", {
      p_document_id: documentId,
      p_actor_id: null,
    });
    if (publishError) throw publishError;
    publishedDocuments += 1;
  }

  console.log(JSON.stringify({ publishedDocuments, stagedDocuments, duplicateFiles }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
