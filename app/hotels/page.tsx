import type { Metadata } from "next";
import { getService } from "@/data/services";
import { ServicePageLayout } from "@/components/editorial/ServicePageLayout";

const service = getService("hotels");

export const metadata: Metadata = {
  title: service.name,
  description: service.summary,
};

export default function HotelsPage() {
  return <ServicePageLayout service={service} />;
}
