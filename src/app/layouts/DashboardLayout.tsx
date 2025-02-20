"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/app/hooks/useAuth";
import { FaHome, FaBuilding, FaPlusSquare, FaTasks, FaUser } from "react-icons/fa";

const menuItems = [
  { name: "Home", path: "/dashboard", icon: <FaHome size={24} /> },
  { name: "Empresa", path: "/dashboard/empresa", icon: <FaBuilding size={22} /> },
  { name: "Criar Issue", path: "/dashboard/issues/criar", icon: <FaPlusSquare size={24} /> },
  { name: "Minhas Issues", path: "/dashboard/issues", icon: <FaTasks size={24} /> },
  { name: "Perfil", path: "/dashboard/perfil", icon: <FaUser size={24} /> },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { tokenState } = useAuth();
  const pathname = usePathname();

  if (!tokenState) {
    return null; // O usuário será redirecionado para login no middleware
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">{children}</main>
      <nav className="fixed bottom-0 left-0 w-full bg-white border-t flex justify-around py-3 shadow-md">
        {menuItems.map(({ name, path, icon }) => (
          <Link key={name} href={path} className={`flex flex-col items-center text-gray-600 ${pathname === path ? "text-blue-500" : ""}`}>
            {icon}
            <span className="text-xs">{name}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
