import { NextResponse } from "next/server";
import { quoteSchema } from "@/lib/validation/quote";
import { enquiryStore } from "@/lib/integrations";
import { generateEnquiryReference } from "@/lib/enquiry-reference";
import {
  buildDemoEnquiry,
  saveToSupabaseCrm,
} from "@/lib/server/enquiry-intake";

/**
 * Demonstration enquiry intake. Validates the submission, assigns a
 * reference and stores it in the in-memory demo store. Replace the store
 * with a CRM/email implementation via `lib/integrations` — the request and
 * response shapes are the stable contract.
 */
export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = quoteSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Please review the highlighted fields and try again.",
        issues: parsed.error.issues.map((i) => ({
          path: i.path.join("."),
          message: i.message,
        })),
      },
      { status: 422 },
    );
  }

  const raw = payload && typeof payload === "object" ? payload as Record<string, unknown> : {};
  const sourceContext =
    raw.sourceContext && typeof raw.sourceContext === "object"
      ? raw.sourceContext as Record<string, unknown>
      : {};
  const v = parsed.data;
  const reference = generateEnquiryReference();

  const crmResult = await saveToSupabaseCrm(reference, v, sourceContext);
  if (!crmResult) {
    await enquiryStore.save(buildDemoEnquiry(reference, v));
  }

  return NextResponse.json({ reference }, { status: 201 });
}
