"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

type Dados = {
  ranking: { name: string; pontos: number }[];
  jogos: {
    id: string;
    timeCasa: string;
    timeFora: string;
    golsCasa: number;
    golsFora: number;
    dataJogo: string;
    premioUrl: string | null;
    finalizado: boolean;
    palpites: {
      golsCasa: number;
      golsFora: number;
      acertou: boolean;
      user: { name: string };
    }[];
  }[];
};

export default function ResultadosPage() {
  const [dados, setDados] = useState<Dados | null>(null);

  useEffect(() => {
    fetch("/api/publico")
      .then((r) => r.json())
      .then(setDados);
  }, []);

  if (!dados) return <div className="p-6">Carregando...</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-10">
      <div>
        <h1 className="text-xl font-bold mb-3">🏆 Ranking</h1>
        <ol className="space-y-1">
          {dados.ranking.map((u, i) => (
            <li key={i} className="flex justify-between border-b py-1">
              <span>
                {i + 1}. {u.name}
              </span>
              <span className="font-medium">{u.pontos} pts</span>
            </li>
          ))}
        </ol>
      </div>

      <div>
        <h1 className="text-xl font-bold mb-3">Palpites</h1>
        <div className="space-y-6">
          {dados.jogos.map((jogo) => (
            <div key={jogo.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-3 gap-2">
                <h2 className="font-semibold">
                  {jogo.timeCasa} {jogo.golsCasa} x {jogo.golsFora}{" "}
                  {jogo.timeFora}
                </h2>
                <span className="text-sm text-zinc-500">
                  {new Date(jogo.dataJogo).toLocaleDateString("pt-BR")}
                </span>
              </div>

              <ul className="text-sm space-y-1">
                {jogo.palpites.map((p, i) => (
                  <li key={i} className="flex justify-between">
                    <span>{p.user.name}</span>
                    <span
                      className={
                        p.acertou
                          ? "text-green-600 font-medium"
                          : "text-zinc-400"
                      }
                    >
                      {p.golsCasa} x {p.golsFora} {p.acertou && "✅"}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* {dados.jogos.map((jogo) => (
            <div key={jogo.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <h2 className="font-semibold">
                  {jogo.timeCasa}
                  {jogo.finalizado
                    ? ` ${jogo.golsCasa} x ${jogo.golsFora} `
                    : " x "}
                  {jogo.timeFora}
                </h2>
                <span className="text-sm text-zinc-500">
                  {new Date(jogo.dataJogo).toLocaleDateString("pt-BR")}
                  {!jogo.finalizado && " (a confirmar)"}
                </span>
              </div>

              <ul className="text-sm space-y-1">
                {jogo.palpites.map((p, i) => (
                  <li key={i} className="flex justify-between">
                    <span>{p.user.name}</span>
                    <span
                      className={
                        p.acertou
                          ? "text-green-600 font-medium"
                          : "text-zinc-400"
                      }
                    >
                      {p.golsCasa} x {p.golsFora}{" "}
                      {jogo.finalizado && p.acertou && "✅"}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))} */}
          <div>
            <Link
              href={"/"}
              className="bg-blue-500 text-white px-4 py-2 rounded-2xl"
            >
              Voltar
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
