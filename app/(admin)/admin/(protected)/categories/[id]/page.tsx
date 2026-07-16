import { notFound } from "next/navigation";

import { ContentEditor } from "@/components/admin/content-editor";
import { categoryRepository } from "@/lib/repositories/content";

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const initial = await categoryRepository.byId(id);
  if (!initial) notFound();
  return <ContentEditor section="category" initial={initial} redirectTo="/admin/categories" />;
}
