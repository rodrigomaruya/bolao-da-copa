import LoginPage from "@/components/login-page";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <section className="flex flex-col justify-center items-center container mx-auto min-h-screen px-4 py-10 gap-6">
      <div className="relative w-24 h-24 rounded-2xl overflow-hidden">
        <Image
          src="/trofeu.jpg"
          alt="Troféu"
          fill
          sizes="96px"
          className="object-cover"
          priority
        />
      </div>

      <div className="text-center">
        <h1 className="text-3xl font-medium">
          Chute o placar. Ganhe um milhão.
        </h1>
        <p className="text-zinc-500 mt-1">
          Entre amigos, sem estresse — só muita zoeira.
        </p>
      </div>

      {/* Regras */}
      <div className="grid grid-cols-2 gap-3 w-full max-w-md text-sm">
        {[
          {
            icon: "👤",
            title: "Cadastro simples",
            desc: "Só nome e email, sem senha.",
          },
          {
            icon: "⚽",
            title: "Um palpite por jogo",
            desc: "Uma única chance por partida.",
          },
          {
            icon: "🎯",
            title: "Só placar exato",
            desc: "Acertou o 2x1? Ganhou. Errou por um? Tchau.",
          },
          {
            icon: "📧",
            title: "Prêmio por email",
            desc: "Quem cravar recebe o prêmio na caixa de entrada.",
          },
        ].map((r) => (
          <div key={r.title} className="border rounded-xl p-3">
            <p className="text-lg mb-1">{r.icon}</p>
            <p className="font-medium">{r.title}</p>
            <p className="text-zinc-500">{r.desc}</p>
          </div>
        ))}
      </div>

      {/* Prêmio misterioso */}
      <div className="w-full max-w-md bg-zinc-50 border rounded-xl p-4 flex gap-3 items-start">
        <span className="text-2xl">🔒</span>
        <div>
          <p className="font-medium">O prêmio é... misterioso</p>
          <p className="text-sm text-zinc-500">
            Não vamos revelar o que é. Mas dizem os rumores que quem ganha fica
            milionário na hora. Pode ou não envolver cripto. Pode ou não ser
            comestível.
          </p>
          <span className="inline-block mt-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
            ⚠️ Não nos responsabilizamos por crises existenciais causadas pelo
            prêmio
          </span>
        </div>
      </div>

      <LoginPage />

      <p className="text-xs text-zinc-400 text-center">
        Use um email válido — é pra lá que vai o prêmio se você acertar.
        <br />
        Não nos responsabilizamos pela liquidez do ativo premiado.
      </p>

      <div className="flex items-center gap-3">
        <span className="text-sm text-zinc-500">
          Ver palpites dos outros apostadores
        </span>
        <Link
          href="/resultados"
          className="bg-violet-600 text-white text-sm px-3 py-1.5 rounded-xl"
        >
          Acessar
        </Link>
      </div>
    </section>
  );
}
