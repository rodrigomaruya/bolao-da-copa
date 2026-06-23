"use client";
import { useEffect, useState } from "react";

type Palpite = {
  id: string;
  golsCasa: number;
  golsFora: number;
  acertou: boolean;
  user: { name: string; email: string };
  jogo: {
    id: string;
    timeCasa: string;
    timeFora: string;
    dataJogo: string;
    golsCasa: number | null;
    golsFora: number | null;
    finalizado: boolean;
  };
};

export default function AdminPalpitesPage() {
  const [palpites, setPalpites] = useState<Palpite[]>([]);

  useEffect(() => {
    fetch("/api/palpites")
      .then((r) => r.json())
      .then(setPalpites);
  }, []);

  // Agrupa os palpites por jogo
  const jogosMap = new Map<string, Palpite[]>();
  for (const p of palpites) {
    const lista = jogosMap.get(p.jogo.id) || [];
    lista.push(p);
    jogosMap.set(p.jogo.id, lista);
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-8">
      <h1 className="text-xl font-bold">Palpites de todos os usuários</h1>

      {[...jogosMap.entries()].map(([jogoId, lista]) => {
        const jogo = lista[0].jogo;
        return (
          <div key={jogoId} className="border rounded-lg p-4">
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-semibold">
                {jogo.timeCasa} x {jogo.timeFora}
              </h2>
              <span className="text-sm text-zinc-500">
                {new Date(jogo.dataJogo).toLocaleString("pt-BR")}
                {jogo.finalizado && (
                  <>
                    {" "}
                    — Resultado: {jogo.golsCasa} x {jogo.golsFora}
                  </>
                )}
              </span>
            </div>

            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-zinc-500">
                  <th className="py-1">Usuário</th>
                  <th>Palpite</th>
                  {jogo.finalizado && <th>Resultado</th>}
                </tr>
              </thead>
              <tbody>
                {lista.map((p) => (
                  <tr key={p.id} className="border-t">
                    <td className="py-1">{p.user.name}</td>
                    <td>
                      {p.golsCasa} x {p.golsFora}
                    </td>
                    {jogo.finalizado && (
                      <td>
                        {p.acertou ? (
                          <span className="text-green-600 font-medium">
                            ✅ Acertou
                          </span>
                        ) : (
                          <span className="text-zinc-400">—</span>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}

      {jogosMap.size === 0 && (
        <p className="text-zinc-500">Nenhum palpite ainda.</p>
      )}
    </div>
  );
}
