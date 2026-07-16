import { ContentList } from "@/components/admin/content-list";
import { bannerRepository } from "@/lib/repositories/content";

export default async function BannerPage() {
  const rows = (await bannerRepository.all()).map((row) => ({ ...row, title: row.title ?? "", link: row.link ?? "" }));

  return (
    <ContentList
      section="banner"
      title="Banners"
      description="Control the homepage carousel with rich desktop and mobile art, optional links, and ordering."
      addHref="/admin/banner/new"
      rows={rows}
      emptyTitle="No banners yet"
      emptyDescription="Add the first banner to bring the homepage carousel to life."
    />
  );
}
