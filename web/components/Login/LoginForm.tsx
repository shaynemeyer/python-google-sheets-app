"use client";

import { API_BASE_URL } from "@/lib/constants";
import { useState } from "react";

function LoginForm({ onLogin }: { onLogin: (loginToken: string) => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const result = await fetch(`${API_BASE_URL}/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `grant_type=&username=${username}&password=${password}&scope=&client_id=&client_secret=`,
      });
      const data = await result.json();

      if (!result.ok) {
        throw new Error(data.detail || "Failed to login");
      }
      setLoginError("");
      // console.log(data);
      onLogin(data.access_token);
    } catch (error) {
      console.log(error);
      setLoginError("An error occurred while attempting to login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          disabled={isLoading}
          onClick={handleLogin}
          className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600"
        >
          {isLoading ? "Loading..." : "Login"}
        </button>
        {loginError && <p className="text-red-500 mt-2">{loginError}</p>}
      </div>
    </div>
  );
}
export default LoginForm;
