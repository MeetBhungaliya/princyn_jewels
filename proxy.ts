import { NextResponse, type NextRequest } from "next/server";
export function proxy(request: NextRequest) {
  // This is an optimistic guard only; layouts, actions and uploads verify the session authoritatively.
  const hasSession = [...request.cookies.getAll()].some((cookie) => cookie.name.includes("session_token"));
  if (!hasSession && request.nextUrl.pathname !== "/admin/login") return NextResponse.redirect(new URL("/admin/login", request.url));
  return NextResponse.next();
}
export const config = { matcher: ["/admin/:path*"] };
