import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/auth";
import { saveImage, uploadKinds } from "@/lib/uploads/images";

export const runtime = "nodejs";
export async function POST(request: Request) {
  try {
    await requireAdmin();
    const form = await request.formData();
    const file = form.get("file"); const kind = form.get("kind");
    if (!(file instanceof File) || !uploadKinds.includes(kind as never)) return NextResponse.json({ error: "Invalid upload." }, { status: 400 });
    return NextResponse.json({ path: await saveImage(file, kind as (typeof uploadKinds)[number]) });
  } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Upload failed." }, { status: 401 }); }
}
