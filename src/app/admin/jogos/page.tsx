"use client";
import { useEffect, useState } from "react";

type Jogo = {
  id: string;
  timeCasa: string;
  timeFora: string;
  dataJogo: string;
  premioUrl: string | null;
  finalizado: boolean;
};

export default function AdminJogosPage() {
  const [jogos, setJogos] = useState<Jogo[]>([]);
  const [timeCasa, setTimeCasa] = useState("");
  const [timeFora, setTimeFora] = useState("");
  const [dataJogo, setDataJogo] = useState("");
  const [premioUrl, setPremioUrl] = useState("");
  const [erro, setErro] = useState("");

  async function carregarJogos() {
    const res = await fetch("/api/jogos");
    setJogos(await res.json());
  }

  useEffect(() => {
    carregarJogos();
  }, []);

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    setErro("");

    const res = await fetch("/api/jogos", {
      method: "POST",
      body: JSON.stringify({ timeCasa, timeFora, dataJogo, premioUrl }),
    });

    if (res.status === 401) {
      setErro("Sessão de admin expirada. Faça login novamente.");
      return;
    }

    setTimeCasa("");
    setTimeFora("");
    setDataJogo("");
    setPremioUrl("");

    carregarJogos();
  }

  return (
    <div className="p-6 max-w-xl mx-auto space-y-8">
      <h1 className="text-xl font-bold">Adicionar Jogo</h1>

      <form onSubmit={handleSubmit} className="space-y-3 border p-4 rounded-lg">
        <div className="flex gap-2">
          <input
            placeholder="Time da casa"
            value={timeCasa}
            onChange={(e) => setTimeCasa(e.target.value)}
            className="border p-2 rounded w-full"
            required
          />
          <input
            placeholder="Time visitante"
            value={timeFora}
            onChange={(e) => setTimeFora(e.target.value)}
            className="border p-2 rounded w-full"
            required
          />
        </div>

        <input
          type="datetime-local"
          value={dataJogo}
          onChange={(e) => setDataJogo(e.target.value)}
          className="border p-2 rounded w-full"
          required
        />
        <input
          placeholder="URL da imagem do prêmio (opcional)"
          value={premioUrl}
          onChange={(e) => setPremioUrl(e.target.value)}
          className="border p-2 rounded w-full"
        />

        {erro && <p className="text-red-500 text-sm">{erro}</p>}

        <button className="bg-violet-600 text-white px-4 py-2 rounded w-full">
          Criar jogo
        </button>
      </form>

      <div>
        <h2 className="font-semibold mb-2">Jogos cadastrados</h2>
        <ul className="space-y-2">
          {jogos.map((j) => (
            <li
              key={j.id}
              className="border p-3 rounded-lg flex justify-between items-center"
            >
              <span>
                {j.timeCasa} x {j.timeFora} —{" "}
                {new Date(j.dataJogo).toLocaleString("pt-BR")}
              </span>
              {j.finalizado && (
                <span className="text-xs text-green-600">Finalizado</span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
