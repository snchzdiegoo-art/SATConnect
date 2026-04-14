import { UploadCenter } from "@/components/prospects/UploadCenter";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Load Center B2B | SAT Connect",
  description:
    "Ingesta, enriquecimiento automático y sincronización con HubSpot de bases de prospectos B2B para SAT Connect.",
};

export default function LoadCenterPage() {
  return <UploadCenter />;
}
