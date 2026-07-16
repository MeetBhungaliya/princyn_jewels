import { redirect } from "next/navigation";
import { Toaster } from "sonner";
import { requireAdmin } from "@/lib/auth/auth";
import { AdminShell } from "@/components/admin/admin-shell";

export const dynamic = "force-dynamic";

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin().catch(() => null);
  if (!session) redirect("/admin/login");
  return <AdminShell><Toaster richColors />{children}</AdminShell>;
}
