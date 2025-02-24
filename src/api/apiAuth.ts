import Cookies from "js-cookie";

const authenticateUser = (): string | null => {
  try {
    const token = Cookies.get("token");

    if (!token) {
      console.warn("⚠️ Token não encontrado.");
      return null;
    }

    return `Bearer ${token}`;
  } catch (error) {
    console.error("❌ Erro ao obter token:", error);
    return null;
  }
};

export default authenticateUser;
