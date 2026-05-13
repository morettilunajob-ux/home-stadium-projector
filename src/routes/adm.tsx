import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import heroImg from "@/assets/projetor.png";
import {
  Check,
  Flame,
  ShieldCheck,
  Package,
  Zap,
  Tv,
  Film,
  Users,
  Sparkles,
  ShoppingCart,
  Star,
  Maximize,
  Wallet,
} from "lucide-react";
import { buildCheckoutUrl, trackClick } from "@/lib/tracking";

export const Route = createFileRoute("/adm")({
  component: AdmSPP,
  head: () => ({
    meta: [
      { title: "ArenaBox Pro — Sua casa vira estádio e cinema em segundos" },
      {
        name: "description",
        content:
          "Mini projetor portátil ArenaBox Pro: tela gigante em qualquer parede. 12x ou R$297 à vista. Estoque promocional limitado.",
      },
      { property: "og:title", content: "ArenaBox Pro — Tela gigante em qualquer parede" },
      {
        property: "og:description",
        content: "Assista jogos, filmes e grandes eventos em tela gigante sem pagar caro em TV grande.",
      },
    ],
  }),
});

const CHECKOUT = "https://pay.kaiross.com.br/13qxfBIkBJKO";

function ctaProps(source: string) {
  return {
    href: buildCheckoutUrl(CHECKOUT, { product: "projetor", price: 297, source }),
    target: "_blank" as const,
    rel: "noopener",
    onClick: () => trackClick({ product: "projetor", price: 297, source }),
  };
}

function AdmSPP() {
  const [showSticky, setShowSticky] = useState(false);
  useEffect(() => {
    const onScroll = () => setShowSticky(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden antialiased">
      {/* HERO */}
      <section className="relative isolate overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
        <div className="absolute inset-0 -z-10 opacity-50" aria-hidden>
          <div
            className="absolute top-1/3 left-1/2 -translate-x-1/2 h-[520px] w-[520px] rounded-full blur-3xl"
            style={{ background: "var(--gradient-gold)", opacity: 0.28 }}
          />
        </div>

        <div className="mx-auto max-w-xl px-5 pt-10 pb-12 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3.5 py-1.5 text-xs font-semibold text-primary backdrop-blur animate-in fade-in slide-in-from-top-2 duration-700">
            <Flame className="h-3.5 w-3.5" /> Produto mais desejado da temporada
          </div>

          <h1 className="mt-6 text-4xl sm:text-5xl font-black tracking-tight uppercase leading-[0.95]">
            Sua casa vira{" "}
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-gold)" }}>
              estádio e cinema
            </span>{" "}
            em segundos
          </h1>

          <p className="mt-4 text-base sm:text-lg text-muted-foreground">
            Assista jogos, filmes e grandes eventos em tela gigante sem pagar caro em TV grande.
          </p>

          <div className="relative mt-8">
            <img
              src={heroImg}
              alt="ArenaBox Pro — mini projetor portátil"
              width={1024}
              height={1024}
              className="mx-auto w-full max-w-sm product-glow animate-in fade-in zoom-in-95 duration-700"
            />
          </div>

          <div className="mt-6 flex flex-col items-center gap-1">
            <p className="text-3xl font-black">12x disponíveis</p>
            <p className="text-lg text-muted-foreground">
              ou <span className="text-primary font-bold">R$297</span> à vista
            </p>
            <p className="text-xs text-muted-foreground">frete calculado no checkout</p>
          </div>

          <a
            {...ctaProps("hero")}
            className="mt-6 inline-flex items-center justify-center gap-2 w-full rounded-2xl px-6 py-5 text-base font-black uppercase tracking-wide text-primary-foreground transition-transform hover:scale-[1.02] active:scale-[0.98]"
            style={{ background: "var(--gradient-gold)", boxShadow: "var(--shadow-gold)" }}
          >
            <ShoppingCart className="h-5 w-5" /> Quero meu ArenaBox Pro
          </a>

          <div className="mt-5 flex flex-wrap justify-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5" /> Compra segura</span>
            <span className="flex items-center gap-1.5"><Package className="h-3.5 w-3.5" /> Envio nacional</span>
            <span className="flex items-center gap-1.5"><Flame className="h-3.5 w-3.5" /> Estoque limitado</span>
          </div>
        </div>
      </section>

      {/* BENEFÍCIOS */}
      <section className="px-5 py-14">
        <div className="mx-auto max-w-xl">
          <h2 className="text-center text-3xl font-black uppercase">
            Por que <span className="text-primary">ArenaBox Pro</span>
          </h2>
          <div className="mt-8 grid grid-cols-2 gap-3">
            {[
              { icon: Maximize, text: "Tela gigante em qualquer parede" },
              { icon: Sparkles, text: "Portátil e moderno" },
              { icon: Zap, text: "Instalação simples" },
              { icon: Tv, text: "Perfeito para futebol e filmes" },
              { icon: Wallet, text: "Muito mais barato que TV grande" },
              { icon: Film, text: "Diversão o ano inteiro" },
            ].map(({ icon: Icon, text }, i) => (
              <div
                key={i}
                className="rounded-2xl border border-primary/20 bg-card p-4 flex flex-col items-start gap-2 transition-transform hover:-translate-y-0.5"
                style={{ boxShadow: "0 6px 24px -12px oklch(0.82 0.17 88 / 0.25)" }}
              >
                <div className="rounded-lg p-2" style={{ background: "var(--gradient-gold)" }}>
                  <Icon className="h-4 w-4 text-primary-foreground" />
                </div>
                <p className="text-sm font-semibold leading-snug">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EMOCIONAL */}
      <section className="px-5 py-14 bg-card/50">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-3xl sm:text-4xl font-black uppercase leading-tight">
            Você não vai só assistir.
            <br />
            <span className="text-primary">Vai viver.</span>
          </h2>
          <ul className="mt-8 space-y-3 text-left">
            {[
              "Gol do seu time com a casa vibrando.",
              "Filme no telão com quem você gosta.",
              "Resenha com amigos como num estádio.",
              "Experiência que TV comum não entrega.",
            ].map((t, i) => (
              <li key={i} className="flex items-start gap-3 rounded-xl border border-border bg-background p-4">
                <Sparkles className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span className="text-base">{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* COMPARAÇÃO */}
      <section className="px-5 py-14">
        <div className="mx-auto max-w-xl">
          <h2 className="text-center text-3xl font-black uppercase">
            Vale mais que uma <span className="text-primary">TV cara</span>
          </h2>
          <div className="mt-8 grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-border bg-background/60 p-5">
              <h3 className="text-sm font-bold text-muted-foreground uppercase">TV grande</h3>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li>Cara</li>
                <li>Pesada</li>
                <li>Fixa</li>
                <li>Ocupa espaço</li>
              </ul>
            </div>
            <div className="rounded-2xl border-2 border-primary bg-card p-5" style={{ boxShadow: "var(--shadow-gold)" }}>
              <h3 className="text-sm font-black text-primary uppercase">ArenaBox Pro</h3>
              <ul className="mt-3 space-y-2 text-sm font-semibold">
                {["Acessível", "Leve", "Portátil", "Tela gigante"].map((t) => (
                  <li key={t} className="flex items-center gap-1.5">
                    <Check className="h-4 w-4 text-primary" /> {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <a
            {...ctaProps("after-comparacao")}
            className="mt-8 inline-flex items-center justify-center gap-2 w-full rounded-2xl px-6 py-4 text-sm font-black uppercase tracking-wide text-primary-foreground transition-transform hover:scale-[1.02] active:scale-[0.98]"
            style={{ background: "var(--gradient-gold)", boxShadow: "var(--shadow-gold)" }}
          >
            <ShoppingCart className="h-4 w-4" /> Quero meu ArenaBox Pro
          </a>
        </div>
      </section>

      {/* URGÊNCIA */}
      <div
        className="px-5 py-4 text-center text-sm font-bold text-primary-foreground"
        style={{ background: "var(--gradient-gold)" }}
      >
        ⚠️ Oferta especial ativa hoje enquanto durar estoque
      </div>

      {/* PROVA SOCIAL */}
      <section className="px-5 py-14 bg-card/50">
        <div className="mx-auto max-w-xl">
          <h2 className="text-center text-3xl font-black uppercase">
            Quem comprou <span className="text-primary">amou</span>
          </h2>
          <div className="mt-8 grid sm:grid-cols-2 gap-3">
            {[
              { name: "Lucas R.", text: "Melhor compra que fiz esse ano." },
              { name: "Camila S.", text: "Imagem surpreendente, parece cinema." },
              { name: "Diego M.", text: "Todo mundo elogiou na resenha." },
              { name: "Bruna T.", text: "Vale muito a pena. Recomendo demais." },
            ].map(({ name, text }, i) => (
              <div key={i} className="rounded-2xl border border-border bg-background p-4">
                <div className="flex gap-0.5 text-primary">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="mt-2 text-sm">{text}</p>
                <p className="mt-1.5 text-xs text-muted-foreground">— {name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-5 py-14">
        <div className="mx-auto max-w-xl">
          <h2 className="text-center text-3xl font-black uppercase">
            Perguntas <span className="text-primary">frequentes</span>
          </h2>
          <div className="mt-8 space-y-3">
            {[
              { q: "Funciona em casa?", a: "Sim, em parede lisa ou superfície clara." },
              { q: "É fácil usar?", a: "Sim, rápido e simples — plug and play." },
              { q: "Serve só para jogos?", a: "Não, também filmes, séries e eventos." },
              { q: "Tem entrega?", a: "Sim, para todo o Brasil." },
            ].map(({ q, a }, i) => (
              <details
                key={i}
                className="group rounded-2xl border border-border bg-card p-4 [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="flex cursor-pointer items-center justify-between gap-3 text-base font-bold">
                  {q}
                  <span className="text-primary transition-transform group-open:rotate-45 text-xl leading-none">+</span>
                </summary>
                <p className="mt-3 text-sm text-muted-foreground">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="relative overflow-hidden px-5 py-20" style={{ background: "var(--gradient-hero)" }}>
        <div className="absolute inset-0 -z-10 opacity-25" aria-hidden style={{ background: "var(--gradient-gold)" }} />
        <div className="mx-auto max-w-xl text-center">
          <Users className="mx-auto h-10 w-10 text-primary" />
          <h2 className="mt-5 text-3xl sm:text-4xl font-black uppercase leading-tight">
            Seu próximo jogo merece <span className="text-primary">tela gigante</span>
          </h2>
          <p className="mt-4 text-base text-muted-foreground">
            Garanta agora antes que o lote promocional acabe.
          </p>

          <div className="mt-6 flex flex-col items-center gap-1">
            <p className="text-2xl font-black">12x disponíveis</p>
            <p className="text-base text-muted-foreground">
              ou <span className="text-primary font-bold">R$297</span> à vista
            </p>
          </div>

          <a
            {...ctaProps("final-cta")}
            className="mt-6 inline-flex items-center justify-center gap-2 w-full rounded-2xl px-6 py-5 text-base font-black uppercase tracking-wide text-primary-foreground transition-transform hover:scale-[1.02] active:scale-[0.98]"
            style={{ background: "var(--gradient-gold)", boxShadow: "var(--shadow-gold)" }}
          >
            <ShoppingCart className="h-5 w-5" /> Garantir o meu agora
          </a>
          <p className="mt-4 text-xs text-muted-foreground">
            Compra segura • Envio nacional • Estoque promocional limitado
          </p>
        </div>
      </section>

      <footer className="py-8 px-5 pb-28 text-center text-xs text-muted-foreground border-t border-border">
        © {new Date().getFullYear()} ArenaBox Pro. Todos os direitos reservados.
      </footer>

      {/* STICKY BOTTOM CTA */}
      <div
        className={`fixed bottom-0 inset-x-0 z-50 backdrop-blur-md bg-background/90 border-t border-primary/30 transition-transform duration-300 ${
          showSticky ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="mx-auto max-w-xl px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex flex-col leading-tight">
            <span className="font-black text-sm uppercase">ArenaBox Pro</span>
            <span className="text-[11px] text-muted-foreground">12x ou R$297 à vista</span>
          </div>
          <a
            {...ctaProps("sticky-bottom")}
            className="inline-flex flex-1 max-w-[60%] items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-black uppercase text-primary-foreground transition-transform hover:scale-[1.02] active:scale-[0.98]"
            style={{ background: "var(--gradient-gold)", boxShadow: "var(--shadow-gold)" }}
          >
            <ShoppingCart className="h-4 w-4" /> Comprar agora
          </a>
        </div>
      </div>
    </div>
  );
}