"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCompany } from "@/app/hooks/useCompany";
import { CompanyDto } from "@/dtos/CompanyDTO";
import CompanyMap from "@/components/Map";

export default function CreateCompany() {
  const router = useRouter();
  const { createCompany } = useCompany();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [description, setDescription] = useState("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const headid = new URLSearchParams(window.location.search).get("headid");

  const handleCreateCompany = async () => {
    setError(null);

    if (!name || !email || !password) {
      setError("Nome, email e senha são obrigatórios.");
      return;
    }

    if (latitude === null || longitude === null) {
      setError("A localização da empresa é necessária.");
      return;
    }

    const companyData: CompanyDto = {
      name,
      email,
      password,
      headid: headid ?? null,
      latitude,
      longitude,
      description: description || "",
    };

    setLoading(true);
    try {
      await createCompany(companyData);
      alert("Empresa criada com sucesso!");
      router.push("/dashboard");
    } catch (error) {
      setError("Erro ao criar empresa. Tente novamente.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Criar Empresa</h1>
        <p className="text-sm text-gray-600 mb-4">Preencha os detalhes da empresa</p>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <CompanyMap
          onLocationSelect={(lat, lng) => {
            setLatitude(lat);
            setLongitude(lng);
          }}
        />

        <div className="space-y-4 mt-4">
          <input
            type="text"
            placeholder="Nome da empresa"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border px-4 py-2 rounded-md focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="email"
            placeholder="Email da empresa"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border px-4 py-2 rounded-md focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border px-4 py-2 rounded-md focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Descrição da empresa"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border px-4 py-2 rounded-md focus:ring-2 focus:ring-blue-500"
          />

          <button
            onClick={handleCreateCompany}
            disabled={loading}
            className={`w-full py-3 rounded-md font-bold transition hover:shadow-lg ${
              loading ? "bg-gray-300 text-gray-600 cursor-not-allowed" : "bg-green-500 text-white hover:bg-green-600"
            }`}
          >
            {loading ? "Criando empresa..." : "Criar Empresa"}
          </button>
        </div>
      </div>
    </div>
  );
}
