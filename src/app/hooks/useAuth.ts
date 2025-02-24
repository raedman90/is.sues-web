"use client";

import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/app/contexts/AuthProvider";
import Cookies from "js-cookie";

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }

  const [checkedAuth, setCheckedAuth] = useState(false);

  useEffect(() => {
    const token = Cookies.get("token");

    if (!token && context.tokenState) {
      console.warn("⚠️ Token ausente! Realizando logout...");
      context.signOut();
    }

    setCheckedAuth(true);
  }, [context.tokenState]);

  if (!checkedAuth) return { ...context, loading: true };

  return context;
}
