import type { Metadata } from "next";
import { ContentEditor } from "@/components/admin/content-editor";

export const metadata: Metadata = {
  title: "Add Category",
};

export default function NewCategoryPage() {
  return <ContentEditor section="category" redirectTo="/admin/categories" />;
}
