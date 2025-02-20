import DashboardLayout from "@/app/layouts/DashboardLayout";
import { useAuth } from "@/app/hooks/useAuth";

export default function Perfil() {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <div className="p-4">
        <h1 className="text-xl font-bold">Perfil</h1>
        <p>Nome: {user?.name}</p>
        <p>Email: {user?.email}</p>
      </div>
    </DashboardLayout>
  );
}
