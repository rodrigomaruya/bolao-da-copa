"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/users", {
      method: "POST",
      body: JSON.stringify({ name, email }),
    });
    const user = await res.json();
    localStorage.setItem("bolaoUserId", user.id);
    router.push("/palpites");
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 max-w-sm mx-auto space-y-4">
      <h1 className="text-xl font-bold">Entrar no Bolão</h1>
      <input
        placeholder="Seu nome"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border p-2 w-full rounded"
        required
      />
      <input
        placeholder="Seu email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 w-full rounded"
        required
      />
      <button className="bg-violet-600 text-white px-4 py-2 rounded w-full">
        Entrar
      </button>
    </form>
  );
}
