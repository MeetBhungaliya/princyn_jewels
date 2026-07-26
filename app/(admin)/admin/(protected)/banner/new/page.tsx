import type { Metadata } from "next";
import { ContentEditor } from "@/components/admin/content-editor";

export const metadata: Metadata = {
  title: "Add Banner",
};

export default function NewBannerPage() {
  return <ContentEditor section="banner" redirectTo="/admin/banner" />;
}
