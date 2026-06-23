"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

type Jogo = {
  id: string;
  timeCasa: string;
  timeFora: string;
  finalizado: boolean;
};
interface MessageProps {
  error: string;
  message: string;
}

export default function Palpites() {
  const [jogos, setJogos] = useState<Jogo[]>([]);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    fetch("/api/me")
      .then((r) => r.json())
      .then((u) => setUserId(u?.id || ""));
    fetch("/api/jogos")
      .then((r) => r.json())
      .then(setJogos);
  }, []);

  async function enviarPalpite(
    jogoId: string,
    golsCasa: number,
    golsFora: number,
  ) {
    const result = await fetch("/api/palpites", {
      method: "POST",
      body: JSON.stringify({ userId, jogoId, golsCasa, golsFora }),
    });
    result
      .json()
      .then((result) => {
        if (result.ok === true) {
          alert(result.success);
        } else {
          alert(result.error);
        }
      })
      .catch((result) => console.log("e o error", result.error));
  }

  return (
    <div className="p-6 space-y-4">
      {jogos
        .filter((j) => !j.finalizado)
        .map((jogo) => (
          <PalpiteCard key={jogo.id} jogo={jogo} onSubmit={enviarPalpite} />
        ))}
      <div>
        <Link
          href={"/resultados"}
          className="bg-blue-500 rounded-2xl px-4 text-white py-2"
        >
          Ver os palpites dos outros usuários.
        </Link>
      </div>
    </div>
  );
}

function PalpiteCard({
  jogo,
  onSubmit,
}: {
  jogo: Jogo;
  onSubmit: (id: string, c: number, f: number) => void;
}) {
  const [gc, setGc] = useState(0);
  const [gf, setGf] = useState(0);
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    await onSubmit(jogo.id, gc, gf);
    setLoading(false);
  }

  return (
    <div className="border p-4 rounded-lg flex items-center gap-3">
      <span>{jogo.timeCasa}</span>
      <input
        type="number"
        value={gc}
        onChange={(e) => setGc(+e.target.value)}
        className="w-12 border rounded text-center"
      />
      x
      <input
        type="number"
        value={gf}
        onChange={(e) => setGf(+e.target.value)}
        className="w-12 border rounded text-center"
      />
      <span>{jogo.timeFora}</span>
      <button
        onClick={handleClick}
        disabled={loading}
        className="ml-auto bg-violet-600 text-white px-3 py-1 rounded disabled:opacity-50"
      >
        {loading ? "Enviando..." : "Palpitar"}
      </button>
    </div>
  );
}
