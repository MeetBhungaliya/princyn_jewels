import { notFound } from "next/navigation";

import { ContentEditor } from "@/components/admin/content-editor";
import { bannerRepository } from "@/lib/repositories/content";

export default async function EditBannerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const initial = await bannerRepository.byId(id);
  if (!initial) notFound();
  return <ContentEditor section="banner" initial={{ ...initial, title: initial.title ?? "", link: initial.link ?? "" }} redirectTo="/admin/banner" />;
}
