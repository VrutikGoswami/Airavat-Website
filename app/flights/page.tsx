import type { Metadata } from "next";
import { getService } from "@/data/services";
import { ServicePageLayout } from "@/components/editorial/ServicePageLayout";

const service = getService("flights");

export const metadata: Metadata = {
  title: service.name,
  description: service.summary,
};

export default function FlightsPage() {
  return <ServicePageLayout service={service} />;
}
