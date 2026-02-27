"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!username || !password) {
      setError("Please enter username and password.");
      return;
    }
    setLoading(true);
    setError("");

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    if (data.success) {
      router.push("/admin/dashboard");
    } else {
      setError("Invalid credentials.");
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "var(--background)" }}
    >
      <motion.div
        className="bg-[var(--color5)] text-[var(--background)] rounded-2xl p-8 w-full max-w-sm mx-4"
        style={{ boxShadow: "var(--background) 0px 2px 12px" }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 280, damping: 22 }}
      >
        <h1 className="text-2xl font-bold mb-6 text-center">Admin Login</h1>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold">Username</label>
            <motion.input
              initial={{ background: "#E1E1E1" }}
              whileHover={{ background: "#BDBDBD" }}
              className="border-2 rounded-xl p-2 text-base"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={handleKeyDown}
              autoComplete="username"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold">Password</label>
            <motion.input
              initial={{ background: "#E1E1E1" }}
              whileHover={{ background: "#BDBDBD" }}
              className="border-2 rounded-xl p-2 text-base"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              autoComplete="current-password"
            />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <motion.button
            onClick={handleLogin}
            disabled={loading}
            className="py-2 px-4 bg-[var(--color3)] text-[var(--foreground)] rounded-xl hover:cursor-pointer disabled:opacity-50 mt-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {loading ? "Logging in..." : "Login"}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
