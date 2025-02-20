"use client";

import Dashboard from "@/components/Dashboard/Dashboard";
import LoginForm from "@/components/Login/LoginForm";
import { useState } from "react";

export default function Home() {
  const [token, setToken] = useState("");

  const handleLogin = (loginToken: string) => {
    setToken(loginToken);
  };

  return (
    <div>
      {!token ? (
        <LoginForm onLogin={handleLogin} />
      ) : (
        <Dashboard token={token} />
      )}
    </div>
  );
}
