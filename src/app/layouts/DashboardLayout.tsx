"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/app/hooks/useAuth";
import { useCompany } from "@/app/hooks/useCompany";
import Link from "next/link";
import Image from "next/image";
import { FaBars, FaTimes, FaHome, FaBuilding, FaPlus, FaTasks, FaUser, FaSignOutAlt } from "react-icons/fa";

const menuItems = [
  { name: "Home", path: "/dashboard", icon: <FaHome size={20} /> },
  { name: "Empresa", path: "/dashboard/empresa", icon: <FaBuilding size={20} /> },
];

const issuesMenu = [
  { name: "Criar Issue", path: "/dashboard/issues/criar", icon: <FaPlus size={18} /> },
  { name: "Minhas Issues", path: "/dashboard/issues", icon: <FaTasks size={18} /> },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { tokenState, signOut, user } = useAuth();
  const { companies } = useCompany();
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!tokenState) {
      console.warn("🔴 Usuário não autenticado! Redirecionando para login...");
      router.push("/login");
    }
  }, [tokenState, router]);

  if (!tokenState) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600">
        Redirecionando para login...
      </div>
    );
  }

  const userCompany = companies.find((company) => company.headid === user?.id);
  const isOwner = !!userCompany;

  return (
    <div className="flex h-screen bg-[#1B1D21] text-white font-[Poppins]">
      {/* 📌 BOTÃO DE MENU PARA MOBILE */}
      <button 
        onClick={() => setMenuOpen(!menuOpen)} 
        className="md:hidden absolute top-4 left-4 text-white text-2xl z-50"
      >
        {menuOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* MENU LATERAL */}
      <aside className={`w-64 flex flex-col p-6 bg-[#1B1D21] border-r border-gray-700 md:relative fixed h-full md:flex ${menuOpen ? "flex" : "hidden"} md:block z-40`}>
        {/* PERFIL DO USUÁRIO */}
        <div className="flex flex-col items-center mb-6">
          <Image
            key={user?.photo}
            src={user?.photo || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"}
            alt="Foto do Usuário"
            width={60}
            height={60}
            className="rounded-full border-2 border-[#7864F4] object-cover"
          />
          <h2 className="text-lg font-semibold mt-2">{user?.name}</h2>
          <p className="text-sm text-gray-400">
            {isOwner ? "Dono da Empresa" : user?.occupation || "Funcionário"}
          </p>
          {userCompany && <p className="text-xs text-gray-500">{userCompany.name}</p>}
        </div>

        {/* MENU PRINCIPAL */}
        <nav className="space-y-3">
          {menuItems.map(({ name, path, icon }) => (
            <Link
              key={name}
              href={path}
              className={`flex items-center gap-3 p-2 rounded-md transition ${
                pathname === path ? "bg-[#7864F4] text-white font-semibold" : "text-[#6C717B] hover:text-white"
              }`}
            >
              {icon}
              {name}
            </Link>
          ))}
        </nav>

        {/* ISSUES */}
        <div className="mt-8">
          <span className="text-sm font-semibold text-gray-400">Issues</span>
          <nav className="space-y-3">
            {issuesMenu.map(({ name, path, icon }) => (
              <Link
                key={name}
                href={path}
                className={`flex items-center gap-3 p-2 rounded-md transition ${
                  pathname === path ? "bg-[#7864F4] text-white font-semibold" : "text-[#6C717B] hover:text-white"
                }`}
              >
                {icon}
                {name}
              </Link>
            ))}
          </nav>
        </div>

        {/* BOTÕES DE SAIR E PERFIL */}
        <div className="mt-auto space-y-3">
          <button
            onClick={signOut}
            className="flex items-center gap-3 p-2 rounded-md text-red-500 hover:bg-red-600 hover:text-white transition"
          >
            <FaSignOutAlt size={20} />
            Sair
          </button>

          <Link
            href="/dashboard/perfil"
            className={`flex items-center gap-3 p-2 rounded-md transition ${
              pathname === "/dashboard/perfil" ? "bg-[#7864F4] text-white font-semibold" : "text-[#6C717B] hover:text-white"
            }`}
          >
            <FaUser size={20} />
            Perfil
          </Link>
        </div>
      </aside>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
