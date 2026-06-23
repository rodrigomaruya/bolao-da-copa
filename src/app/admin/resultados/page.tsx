"use client";
import { useEffect, useState } from "react";

type Jogo = {
  id: string;
  timeCasa: string;
  timeFora: string;
  dataJogo: string;
  finalizado: boolean;
  golsCasa: number | null;
  golsFora: number | null;
};

export default function AdminResultadosPage() {
  const [jogos, setJogos] = useState<Jogo[]>([]);
  const [carregando, setCarregando] = useState<string | null>(null);

  async function carregarJogos() {
    const res = await fetch("/api/jogos");
    setJogos(await res.json());
  }

  useEffect(() => {
    carregarJogos();
  }, []);

  async function lancarResultado(
    id: string,
    golsCasa: number,
    golsFora: number,
  ) {
    setCarregando(id);
    console.log(id);
    const res = await fetch(`/api/jogos/${id}/finalizar`, {
      method: "POST",
      body: JSON.stringify({ golsCasa, golsFora }),
    });
    setCarregando(null);

    if (res.ok) {
      const data = await res.json();
      alert(`Resultado lançado! ${data.vencedores} acertaram o placar.`);
      carregarJogos();
    } else {
      alert("Erro ao lançar resultado.");
    }
  }

  const pendentes = jogos.filter((j) => !j.finalizado);
  const finalizados = jogos.filter((j) => j.finalizado);

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      <h1 className="text-xl font-bold">Lançar resultados</h1>

      <div className="space-y-3">
        {pendentes.map((jogo) => (
          <ResultadoCard
            key={jogo.id}
            jogo={jogo}
            onSubmit={lancarResultado}
            carregando={carregando === jogo.id}
          />
        ))}
        {pendentes.length === 0 && (
          <p className="text-zinc-500">Nenhum jogo pendente.</p>
        )}
      </div>

      {finalizados.length > 0 && (
        <div>
          <h2 className="font-semibold mb-2 text-zinc-600">Já finalizados</h2>
          <ul className="space-y-1 text-sm text-zinc-500">
            {finalizados.map((j) => (
              <li key={j.id}>
                {j.timeCasa} {j.golsCasa} x {j.golsFora} {j.timeFora}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function ResultadoCard({
  jogo,
  onSubmit,
  carregando,
}: {
  jogo: Jogo;
  onSubmit: (id: string, gc: number, gf: number) => void;
  carregando: boolean;
}) {
  const [gc, setGc] = useState(0);
  const [gf, setGf] = useState(0);

  return (
    <div className="border rounded-lg p-4 flex items-center gap-3">
      <span className="flex-1">
        {jogo.timeCasa} x {jogo.timeFora}
        <br />
        <span className="text-xs text-zinc-500">
          {new Date(jogo.dataJogo).toLocaleString("pt-BR")}
        </span>
      </span>

      <input
        type="number"
        value={gc}
        onChange={(e) => setGc(+e.target.value)}
        className="w-12 border rounded text-center"
      />
      <span>x</span>
      <input
        type="number"
        value={gf}
        onChange={(e) => setGf(+e.target.value)}
        className="w-12 border rounded text-center"
      />

      <button
        onClick={() => onSubmit(jogo.id, gc, gf)}
        disabled={carregando}
        className="bg-violet-600 text-white px-3 py-1 rounded disabled:opacity-50"
      >
        {carregando ? "Enviando..." : "Confirmar"}
      </button>
    </div>
  );
}
