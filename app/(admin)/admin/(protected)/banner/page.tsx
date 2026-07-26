import type { Metadata } from "next";
import { ContentList } from "@/components/admin/content-list";
import { bannerRepository } from "@/lib/repositories/content";

export const metadata: Metadata = {
  title: "Banners",
};

export default async function BannerPage() {
  const rows = (await bannerRepository.all()).map((row) => ({ ...row, title: row.title ?? "" }));

  return (
    <ContentList
      section="banner"
      title="Banners"
      description="Control the homepage carousel with rich desktop and mobile art and ordering."
      addHref="/admin/banner/new"
      rows={rows}
      emptyTitle="No banners yet"
      emptyDescription="Add the first banner to bring the homepage carousel to life."
    />
  );
}
