"use client";

import Dashboard from "@/components/Dashboard/Dashboard";
import LoginForm from "@/components/Login/LoginForm";
import { useEffect, useState } from "react";

export default function Home() {
  const [token, setToken] = useState("");

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const handleLogin = (loginToken: string) => {
    setToken(loginToken);
    localStorage.setItem("authToken", loginToken);
  };

  const handleLogout = () => {
    setToken("");
    localStorage.removeItem("authToken");
  };

  return (
    <div>
      {!token ? (
        <LoginForm onLogin={handleLogin} />
      ) : (
        <Dashboard token={token} onLogout={handleLogout} />
      )}
    </div>
  );
}
