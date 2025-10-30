"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Superadmin } from "@/types/superadmin";

export function useSuperadminAuth() {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<Superadmin | null>(null);
  const router = useRouter();

  useEffect(() => {
    checkSession();
  }, []);

  async function checkSession() {
    try {
      const response = await fetch("/api/superadmin/auth/session");
      const data = await response.json();

      if (response.ok && data.isAuthenticated) {
        setIsAuthenticated(true);
        setUser(data.user);
      } else {
        setIsAuthenticated(false);
        setUser(null);
        // Redirect to login if not authenticated
        router.push("/superadmin/login");
      }
    } catch (error) {
      console.error("Session check failed:", error);
      setIsAuthenticated(false);
      setUser(null);
      router.push("/superadmin/login");
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    try {
      setLoading(true);
      await fetch("/api/superadmin/auth/logout", { method: "POST" });
      setIsAuthenticated(false);
      setUser(null);
      router.push("/superadmin/login");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLoading(false);
    }
  }

  return { loading, isAuthenticated, user, logout };
}
