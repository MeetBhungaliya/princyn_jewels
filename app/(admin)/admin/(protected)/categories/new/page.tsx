import { ContentEditor } from "@/components/admin/content-editor";

export default function NewCategoryPage() {
  return <ContentEditor section="category" redirectTo="/admin/categories" />;
}
