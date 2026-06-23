"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/login", {
      method: "POST",
      body: JSON.stringify({ senha }),
    });
    if (res.ok) {
      router.push("/admin/jogos");
    } else {
      setErro("Senha incorreta");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 max-w-sm mx-auto space-y-4">
      <h1 className="text-xl font-bold">Admin do Bolão</h1>
      <input
        type="password"
        placeholder="Senha de admin"
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
        className="border p-2 w-full rounded"
        required
      />
      {erro && <p className="text-red-500 text-sm">{erro}</p>}
      <button className="bg-violet-600 text-white px-4 py-2 rounded w-full">
        Entrar
      </button>
    </form>
  );
}
