import type { Metadata } from "next";
import { getService } from "@/data/services";
import { ServicePageLayout } from "@/components/editorial/ServicePageLayout";

const service = getService("transport");

export const metadata: Metadata = {
  title: service.name,
  description: service.summary,
};

export default function TransportPage() {
  return <ServicePageLayout service={service} />;
}
