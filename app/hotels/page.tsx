import type { Metadata } from "next";
import { getService } from "@/data/services";
import { ServicePageLayout } from "@/components/editorial/ServicePageLayout";
import { HotelMediaGallery } from "@/components/hotels/HotelMediaGallery";
import { getHotelMediaCatalog } from "@/lib/rate-catalog";

const service = getService("hotels");

export const metadata: Metadata = {
  title: service.name,
  description: service.summary,
};

export default async function HotelsPage() {
  const hotels = await getHotelMediaCatalog();
  return (
    <ServicePageLayout service={service}>
      <HotelMediaGallery hotels={hotels} />
    </ServicePageLayout>
  );
}
