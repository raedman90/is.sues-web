const authenticateUser = () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        return `Bearer ${token}`;
      } else {
        console.warn("Token não encontrado.");
        return null; // Retorna null para evitar falha nas requisições
      }
    } catch (error) {
      console.error("Erro ao obter token:", error);
      return null;
    }
  };
  
  export default authenticateUser;
  