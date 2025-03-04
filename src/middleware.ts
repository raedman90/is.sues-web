import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  console.log("🔍 Middleware: Verificando autenticação...");

  const token = req.cookies.get("token")?.value || null;
  const authRoutes = ["/login", "/register", "/"];
  const dashboardRoutes = ["/dashboard"];

  console.log("Token encontrado:", token);
  console.log("Caminho atual:", req.nextUrl.pathname);

  if (!token) {
    if (authRoutes.includes(req.nextUrl.pathname)) {
      console.log("Usuário NÃO autenticado - Permissão concedida:", req.nextUrl.pathname);
      return NextResponse.next();
    }

    if (dashboardRoutes.some(route => req.nextUrl.pathname.startsWith(route))) {
      console.warn("Usuário NÃO autenticado - Redirecionando para /login");
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  if (token && authRoutes.includes(req.nextUrl.pathname)) {
    console.log("🟢 Usuário autenticado - Redirecionando para /dashboard");
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  console.log("Usuário pode acessar:", req.nextUrl.pathname);
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register", "/"],
};
