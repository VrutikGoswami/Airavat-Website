/**
 * Analytics abstraction. The site works with no analytics account: events
 * are logged to the console in development and buffered in memory. To wire
 * a real provider (GA4, Plausible, PostHog…), implement `AnalyticsSink`
 * and register it in `initAnalytics` — no component code changes.
 */

export type AnalyticsEventName =
  | "quote_started"
  | "quote_step_completed"
  | "quote_submitted"
  | "quote_validation_failed"
  | "whatsapp_clicked"
  | "phone_clicked"
  | "email_clicked"
  | "service_viewed"
  | "destination_viewed"
  | "map_opened"
  | "map_marker_selected"
  | "seasonal_campaign_clicked"
  | "itinerary_viewed"
  | "corporate_enquiry_submitted"
  | "group_enquiry_submitted";

export type AnalyticsEvent = {
  name: AnalyticsEventName;
  properties?: Record<string, string | number | boolean>;
  timestamp: string;
};

export interface AnalyticsSink {
  send(event: AnalyticsEvent): void;
}

const buffer: AnalyticsEvent[] = [];
let sink: AnalyticsSink | null = null;

export function initAnalytics(customSink: AnalyticsSink): void {
  sink = customSink;
  buffer.splice(0).forEach((e) => customSink.send(e));
}

export function track(
  name: AnalyticsEventName,
  properties?: Record<string, string | number | boolean>,
): void {
  const event: AnalyticsEvent = {
    name,
    properties,
    timestamp: new Date().toISOString(),
  };
  if (sink) {
    sink.send(event);
    return;
  }
  buffer.push(event);
  if (buffer.length > 100) buffer.shift();
  if (process.env.NODE_ENV === "development") {
    console.debug("[analytics]", name, properties ?? {});
  }
}
