import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import heroImg from "@/assets/projetor.png";
import baldeImg from "@/assets/balde.png";
import somImg from "@/assets/caixa-som.png";
import bandeiraImg from "@/assets/bandeira.png";
import { Check, Flame, Package, ShieldCheck, Zap, Tv, Sparkles, Users, Film, ShoppingCart } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { buildCheckoutUrl, trackClick, type ProductId } from "@/lib/tracking";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "ArenaBox Pro — Sua casa vai virar a Copa do Mundo" },
      { name: "description", content: "Mini projetor ArenaBox Pro: assista jogos, filmes e esportes em tela gigante com experiência de estádio dentro da sua casa. 12x ou R$297 à vista." },
      { property: "og:title", content: "ArenaBox Pro — Transforme sua casa em estádio" },
      { property: "og:description", content: "Tela gigante em qualquer parede. Perfeito para a Copa, filmes e séries." },
    ],
  }),
});

const CHECKOUT_URL = "https://pay.kaiross.com.br/13qxfBIkBJKO";
const UPSELL_URL = "https://pay.kaiross.com.br/toYaqm1esck6";
const SOM_URL = "https://pay.kaiross.com.br/LvyNrKXNY2RX";
const BANDEIRA_URL = "https://pay.kaiross.com.br/CiDSlddhxPPM";

const PRICES: Record<ProductId, number> = {
  projetor: 297,
  balde: 100,
  "caixa-som": 265,
  bandeira: 30,
};

const URLS: Record<ProductId, string> = {
  projetor: CHECKOUT_URL,
  balde: UPSELL_URL,
  "caixa-som": SOM_URL,
  bandeira: BANDEIRA_URL,
};

function ctaProps(product: ProductId, source: string) {
  return {
    href: buildCheckoutUrl(URLS[product], { product, price: PRICES[product], source }),
    target: "_blank" as const,
    rel: "noopener",
    onClick: () => trackClick({ product, price: PRICES[product], source }),
    "data-product": product,
    "data-source": source,
  };
}

function Index() {
  const [showSticky, setShowSticky] = useState(false);
  useEffect(() => {
    const onScroll = () => setShowSticky(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* STICKY TOP CTA — aparece ao rolar */}
      <div className={`fixed top-0 inset-x-0 z-50 transition-transform duration-300 ${showSticky ? "translate-y-0" : "-translate-y-full"}`}>
        <div className="backdrop-blur-md bg-background/85 border-b border-border">
          <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <span className="font-black text-primary uppercase tracking-wide text-sm md:text-base">ArenaBox Pro</span>
              <span className="hidden sm:inline text-xs text-muted-foreground truncate">12x ou R$297 à vista</span>
            </div>
            <a {...ctaProps("projetor", "sticky-top")} className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold uppercase text-primary-foreground transition-transform hover:scale-[1.02] shrink-0" style={{ background: "var(--gradient-gold)", boxShadow: "var(--shadow-gold)" }}>
              <ShoppingCart className="h-4 w-4" /> Quero meu ArenaBox
            </a>
          </div>
        </div>
      </div>

      {/* HERO */}
      <section className="relative isolate overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
        <div className="absolute inset-0 -z-10 opacity-40" aria-hidden>
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 h-[600px] w-[600px] rounded-full blur-3xl" style={{ background: "var(--gradient-gold)", opacity: 0.25 }} />
        </div>
        <div className="mx-auto max-w-6xl px-6 pt-20 pb-16 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary backdrop-blur">
            <Flame className="h-4 w-4" /> Mais desejado da temporada
          </div>
          <h1 className="mt-6 text-5xl md:text-7xl font-black tracking-tight uppercase leading-[0.95]">
            Sua casa vai virar a <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-gold)" }}>Copa do Mundo</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Assista jogos, filmes e esportes em tela gigante, com experiência de estádio dentro da sua casa.
          </p>

          <div className="relative mt-10 mx-auto max-w-2xl">
            <div className="absolute inset-0 blur-3xl rounded-full" style={{ background: "var(--gradient-gold)", opacity: 0.35 }} aria-hidden />
            <img src={heroImg} alt="Mini projetor ArenaBox Pro" width={1024} height={1024} className="relative mx-auto w-full max-w-md drop-shadow-2xl" />
          </div>

          <div className="mt-8 flex flex-col items-center gap-2">
            <p className="text-3xl md:text-4xl font-bold">12x disponível</p>
            <p className="text-xl text-muted-foreground">ou <span className="text-primary font-semibold">R$297</span> à vista</p>
            <p className="text-sm text-muted-foreground">frete calculado no checkout (aprox. R$316,90 total)</p>
          </div>

          <a {...ctaProps("projetor", "hero")} className="mt-8 inline-flex items-center justify-center w-full max-w-md rounded-xl px-8 py-5 text-lg font-bold uppercase tracking-wide text-primary-foreground transition-transform hover:scale-[1.02]" style={{ background: "var(--gradient-gold)", boxShadow: "var(--shadow-gold)" }}>
            Quero meu ArenaBox Pro
          </a>

          <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5"><Package className="h-4 w-4" /> Envio rápido para todo o Brasil</span>
            <span className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4" /> Compra segura e protegida</span>
            <span className="flex items-center gap-1.5"><Zap className="h-4 w-4" /> Estoque limitado da Copa</span>
          </div>
        </div>
      </section>

      {/* EXPERIÊNCIA */}
      <section className="py-24 px-6">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-4xl md:text-5xl font-black uppercase">Não é só assistir.<br /><span className="text-primary">É viver o jogo.</span></h2>
          <div className="mt-12 grid md:grid-cols-2 gap-6 text-left">
            {[
              { icon: Sparkles, text: "Imagine o gol saindo e sua casa inteira vibrando." },
              { icon: Users, text: "Imagine amigos e família reunidos como se fosse estádio." },
              { icon: Film, text: "Imagine transformar qualquer parede em cinema gigante." },
              { icon: Flame, text: "Imagine sua casa virando o ponto oficial dos jogos." },
            ].map(({ icon: Icon, text }, i) => (
              <div key={i} className="rounded-2xl border border-border bg-card p-6 flex gap-4 items-start">
                <div className="rounded-lg p-2.5 shrink-0" style={{ background: "var(--gradient-gold)" }}>
                  <Icon className="h-5 w-5 text-primary-foreground" />
                </div>
                <p className="text-lg text-card-foreground">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFÍCIOS */}
      <section className="py-24 px-6 bg-card/50">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-4xl md:text-5xl font-black text-center uppercase">Simples, portátil <span className="text-primary">e poderoso</span></h2>
          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              "Tela gigante em qualquer parede",
              "Fácil de instalar em segundos",
              "Portátil, leve e moderno",
              "Perfeito para futebol, filmes e séries",
              "Muito mais barato que uma TV grande",
              "Experiência de cinema em casa",
            ].map((b, i) => (
              <div key={i} className="flex items-center gap-3 rounded-xl border border-border bg-background p-5">
                <Check className="h-5 w-5 text-primary shrink-0" />
                <span className="font-medium">{b}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* URGÊNCIA */}
      <div className="px-6 py-5 text-center font-semibold text-primary-foreground" style={{ background: "var(--gradient-gold)" }}>
        ⚠️ Oferta especial ativa por tempo limitado durante a campanha da Copa
      </div>

      {/* UPSELL */}
      <section className="py-24 px-6">
        <div className="mx-auto max-w-5xl rounded-3xl border border-primary/30 bg-card p-8 md:p-12 grid md:grid-cols-2 gap-10 items-center" style={{ boxShadow: "var(--shadow-glow)" }}>
          <div className="relative">
            <div className="absolute inset-0 blur-3xl rounded-full" style={{ background: "var(--gradient-gold)", opacity: 0.3 }} aria-hidden />
            <img src={baldeImg} alt="Balde com caixa de som embutida" width={768} height={768} loading="lazy" className="relative mx-auto w-full max-w-sm" />
          </div>
          <div>
            <h2 className="text-3xl md:text-4xl font-black uppercase">Balde com <span className="text-primary">caixa de som embutida</span></h2>
            <p className="mt-4 text-lg text-muted-foreground">Bebida sempre gelada e som alto no mesmo produto — 2 em 1.</p>
            <p className="mt-2 text-muted-foreground">O combo perfeito para transformar qualquer jogo em evento.</p>
            <p className="mt-6 text-4xl font-black">Apenas <span className="text-primary">R$100</span></p>
            <a {...ctaProps("balde", "upsell-balde")} className="mt-6 inline-flex items-center justify-center w-full rounded-xl px-6 py-4 font-bold uppercase text-primary-foreground transition-transform hover:scale-[1.02]" style={{ background: "var(--gradient-gold)", boxShadow: "var(--shadow-gold)" }}>
              Adicionar Balde Party Som
            </a>
            <p className="mt-3 text-sm text-muted-foreground">🔥 Ideal para Copa, churrasco e festas com amigos</p>
          </div>
        </div>

        {/* Extra upsells: Caixa de Som + Bandeira */}
        <div className="mx-auto max-w-5xl mt-10 grid md:grid-cols-2 gap-6">
          <div className="rounded-3xl border border-border bg-card p-6 flex flex-col items-center text-center">
            <div className="relative w-full h-56 flex items-center justify-center">
              <div className="absolute inset-0 blur-3xl rounded-full" style={{ background: "var(--gradient-gold)", opacity: 0.2 }} aria-hidden />
              <img src={somImg} alt="Caixa de Som Bluetooth" width={400} height={400} loading="lazy" className="relative max-h-56 w-auto" />
            </div>
            <h3 className="mt-4 text-2xl font-black uppercase">Caixa de Som <span className="text-primary">Boombox</span></h3>
            <p className="mt-2 text-muted-foreground">Som alto e grave forte para sentir cada gol como se estivesse no estádio.</p>
            <p className="mt-3 text-3xl font-black">Apenas <span className="text-primary">R$265</span></p>
            <a {...ctaProps("caixa-som", "upsell-caixa-som")} className="mt-5 inline-flex items-center justify-center w-full rounded-xl px-6 py-3.5 font-bold uppercase text-primary-foreground transition-transform hover:scale-[1.02]" style={{ background: "var(--gradient-gold)", boxShadow: "var(--shadow-gold)" }}>
              Adicionar Caixa de Som
            </a>
          </div>
          <div className="rounded-3xl border border-border bg-card p-6 flex flex-col items-center text-center">
            <div className="relative w-full h-56 flex items-center justify-center">
              <div className="absolute inset-0 blur-3xl rounded-full" style={{ background: "var(--gradient-gold)", opacity: 0.2 }} aria-hidden />
              <img src={bandeiraImg} alt="Bandeira do Brasil" width={400} height={400} loading="lazy" className="relative max-h-56 w-auto" />
            </div>
            <h3 className="mt-4 text-2xl font-black uppercase">Bandeira do <span className="text-primary">Brasil</span></h3>
            <p className="mt-2 text-muted-foreground">Decore sua casa e mostre o verdadeiro espírito da torcida brasileira.</p>
            <p className="mt-3 text-3xl font-black">Apenas <span className="text-primary">R$30</span></p>
            <a {...ctaProps("bandeira", "upsell-bandeira")} className="mt-5 inline-flex items-center justify-center w-full rounded-xl px-6 py-3.5 font-bold uppercase text-primary-foreground transition-transform hover:scale-[1.02]" style={{ background: "var(--gradient-gold)", boxShadow: "var(--shadow-gold)" }}>
              Adicionar Bandeira
            </a>
          </div>
        </div>
      </section>

      {/* COMPARAÇÃO */}
      <section className="py-24 px-6 bg-card/50">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-4xl md:text-5xl font-black text-center uppercase">Vale mais que uma <span className="text-primary">TV cara</span></h2>
          <div className="mt-12 grid grid-cols-2 gap-4">
            <div className="rounded-2xl border border-border bg-background p-6">
              <h3 className="text-xl font-bold text-muted-foreground">TV grande tradicional</h3>
              <ul className="mt-4 space-y-3 text-muted-foreground">
                <li>R$2.000 ou mais</li>
                <li>Fixa no ambiente</li>
                <li>Ocupa muito espaço</li>
                <li>Uso limitado</li>
              </ul>
            </div>
            <div className="rounded-2xl border-2 border-primary bg-card p-6" style={{ boxShadow: "var(--shadow-gold)" }}>
              <h3 className="text-xl font-bold text-primary">ArenaBox Pro</h3>
              <ul className="mt-4 space-y-3 font-medium">
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> R$297</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Portátil</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Cabe em qualquer lugar</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Filmes, jogos e esportes</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-6">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-4xl md:text-5xl font-black text-center uppercase">Perguntas <span className="text-primary">frequentes</span></h2>
          <Accordion type="single" collapsible className="mt-10">
            {[
              { q: "Funciona em qualquer parede?", a: "Sim, funciona melhor em superfícies claras e lisas." },
              { q: "Serve só para Copa?", a: "Não. Funciona para filmes, séries, jogos e qualquer conteúdo." },
              { q: "É difícil de usar?", a: "Não. É simples, rápido e intuitivo." },
              { q: "Tem entrega no Brasil?", a: "Sim, envio nacional com rastreio." },
            ].map((item, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border-border">
                <AccordionTrigger className="text-left text-lg font-semibold">{item.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base">{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="relative py-24 px-6 overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
        <div className="absolute inset-0 -z-10" aria-hidden>
          <div className="absolute inset-0 opacity-20" style={{ background: "var(--gradient-gold)" }} />
        </div>
        <div className="mx-auto max-w-3xl text-center">
          <Tv className="h-12 w-12 mx-auto text-primary" />
          <h2 className="mt-6 text-4xl md:text-6xl font-black uppercase">Sua casa pode ser o novo <span className="text-primary">estádio da Copa</span>.</h2>
          <p className="mt-6 text-lg text-muted-foreground">Não perca a chance de viver essa experiência em 2026.</p>
          <a {...ctaProps("projetor", "final-cta")} className="mt-10 inline-flex items-center justify-center w-full max-w-xl rounded-xl px-8 py-6 text-lg font-black uppercase tracking-wide text-primary-foreground transition-transform hover:scale-[1.02]" style={{ background: "var(--gradient-gold)", boxShadow: "var(--shadow-gold)" }}>
            Quero transformar minha casa agora
          </a>
          <p className="mt-6 text-sm text-muted-foreground">12x disponível • R$297 à vista • Envio para todo o Brasil</p>
        </div>
      </section>

      <footer className="py-8 px-6 pb-28 md:pb-24 text-center text-sm text-muted-foreground border-t border-border">
        © {new Date().getFullYear()} ArenaBox Pro. Todos os direitos reservados.
      </footer>

      {/* STICKY BOTTOM CTA — sempre visível */}
      <div className="fixed bottom-0 inset-x-0 z-50 backdrop-blur-md bg-background/90 border-t border-border">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-3">
          <div className="hidden sm:flex flex-col leading-tight">
            <span className="font-bold text-foreground text-sm">ArenaBox Pro</span>
            <span className="text-xs text-muted-foreground">12x ou R$297 à vista</span>
          </div>
          <a {...ctaProps("projetor", "sticky-bottom")} className="inline-flex flex-1 sm:flex-none items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm md:text-base font-bold uppercase text-primary-foreground transition-transform hover:scale-[1.02]" style={{ background: "var(--gradient-gold)", boxShadow: "var(--shadow-gold)" }}>
            <ShoppingCart className="h-4 w-4" /> Quero meu ArenaBox Pro
          </a>
        </div>
      </div>
    </div>
  );
}

