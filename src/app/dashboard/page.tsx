"use client";

import DashboardLayout from "@/app/layouts/DashboardLayout";
import { useAuth } from "@/app/hooks/useAuth";

export default function Dashboard() {
  const { user } = useAuth();
  return (
    <DashboardLayout>
      <div className="p-4">
        <h1 className="text-xl font-bold">Bem-vindo, {user?.name}!</h1>
      </div>
    </DashboardLayout>
  );
}
