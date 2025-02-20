import { useContext, useState } from "react";
import { AuthContext } from "@/src/contexts/AuthProvider";

export default function LoginPage() {
  const auth = useContext(AuthContext);
  const [token, setToken] = useState("");

  const handleLogin = () => {
    auth?.login(token);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-xl font-bold mb-4">Login</h2>
        <input
          type="text"
          className="border p-2 w-full mb-4"
          placeholder="Token"
          value={token}
          onChange={(e) => setToken(e.target.value)}
        />
        <button onClick={handleLogin} className="bg-blue-500 text-white p-2 w-full">
          Entrar
        </button>
      </div>
    </div>
  );
}
