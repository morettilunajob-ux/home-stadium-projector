import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import heroImg from "@/assets/projetor.png";
import {
  Check,
  Flame,
  ShieldCheck,
  Zap,
  Tv,
  Film,
  Sparkles,
  ShoppingCart,
  Star,
  Maximize,
  Wallet,
  Clock,
  Eye,
  Gift,
  TrendingDown,
  Lock,
  Truck,
  RotateCcw,
  MapPin,
  TrendingUp,
  Crown,
  AlertTriangle,
  X,
  PartyPopper,
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
  // Contagem regressiva persistente (15 min por sessão) — urgência elegante
  const [secondsLeft, setSecondsLeft] = useState(15 * 60);
  // "Pessoas vendo agora" — variando levemente
  const [viewers, setViewers] = useState(47);
  // Estoque restante simulado (decai lentamente)
  const [stock, setStock] = useState(12);
  // Vendidos hoje — sobe ao longo do tempo, simula alta demanda
  const [soldToday, setSoldToday] = useState(287);
  // Toast de venda recente
  const [toast, setToast] = useState<{ name: string; city: string; minutes: number } | null>(null);
  // Popup de bônus surpresa (dopamina) — aparece após 8s
  const [showPopup, setShowPopup] = useState(false);
  // Pequenas explosões de "confetti" no clique do CTA
  const [bursts, setBursts] = useState<{ id: number; x: number; y: number }[]>([]);

  useEffect(() => {
    const onScroll = () => setShowSticky(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const KEY = "arenabox_countdown_end";
    let end = Number(localStorage.getItem(KEY));
    if (!end || isNaN(end) || end < Date.now()) {
      end = Date.now() + 15 * 60 * 1000;
      localStorage.setItem(KEY, String(end));
    }
    const tick = () => {
      const left = Math.max(0, Math.floor((end - Date.now()) / 1000));
      setSecondsLeft(left);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setViewers((v) => Math.max(28, Math.min(72, v + (Math.random() > 0.5 ? 1 : -1) * Math.ceil(Math.random() * 3))));
    }, 4000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setStock((s) => (s > 4 ? s - 1 : s));
    }, 45000);
    return () => clearInterval(id);
  }, []);

  // Sobe contador de vendidos hoje
  useEffect(() => {
    const id = setInterval(() => {
      setSoldToday((s) => s + 1);
    }, 9000);
    return () => clearInterval(id);
  }, []);

  // Popup surpresa: aparece uma vez por sessão após 8s
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("arenabox_popup_shown")) return;
    const id = window.setTimeout(() => {
      setShowPopup(true);
      sessionStorage.setItem("arenabox_popup_shown", "1");
    }, 8000);
    return () => clearTimeout(id);
  }, []);

  const fireBurst = (e: React.MouseEvent) => {
    const id = Date.now();
    setBursts((b) => [...b, { id, x: e.clientX, y: e.clientY }]);
    window.setTimeout(() => setBursts((b) => b.filter((x) => x.id !== id)), 1200);
  };

  // Notificações de compra recente (rotativas)
  useEffect(() => {
    const buyers = [
      { name: "João S.", city: "São Paulo, SP" },
      { name: "Marina L.", city: "Rio de Janeiro, RJ" },
      { name: "Carlos M.", city: "Belo Horizonte, MG" },
      { name: "Patrícia R.", city: "Curitiba, PR" },
      { name: "Rafael T.", city: "Porto Alegre, RS" },
      { name: "Aline F.", city: "Salvador, BA" },
      { name: "Diego A.", city: "Recife, PE" },
      { name: "Beatriz N.", city: "Fortaleza, CE" },
      { name: "Gustavo P.", city: "Brasília, DF" },
      { name: "Larissa C.", city: "Manaus, AM" },
    ];
    let i = 0;
    const show = () => {
      const b = buyers[i % buyers.length];
      i++;
      setToast({ name: b.name, city: b.city, minutes: Math.floor(Math.random() * 8) + 1 });
      window.setTimeout(() => setToast(null), 5000);
    };
    const first = window.setTimeout(show, 3500);
    const id = setInterval(show, 11000);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, []);

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden antialiased">
      {/* TOP URGENCY BAR — countdown sempre visível */}
      <div className="sticky top-0 z-40 text-primary-foreground" style={{ background: "var(--gradient-gold)" }}>
        <div className="mx-auto max-w-xl px-4 py-2 flex items-center justify-center gap-2 text-[12px] sm:text-sm font-bold">
          <Clock className="h-4 w-4 animate-pulse" />
          <span className="uppercase tracking-wide">Oferta termina em</span>
          <span className="tabular-nums font-black text-base bg-background/20 rounded-md px-2 py-0.5">
            {mm}:{ss}
          </span>
        </div>
      </div>

      {/* HERO */}
      <section className="relative isolate overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
        <div className="absolute inset-0 -z-10 opacity-50" aria-hidden>
          <div
            className="absolute top-1/3 left-1/2 -translate-x-1/2 h-[520px] w-[520px] rounded-full blur-3xl"
            style={{ background: "var(--gradient-gold)", opacity: 0.28 }}
          />
        </div>

        <div className="mx-auto max-w-xl px-5 pt-10 pb-12 text-center">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3.5 py-1.5 text-xs font-semibold text-primary backdrop-blur animate-in fade-in slide-in-from-top-2 duration-700">
              <Flame className="h-3.5 w-3.5" /> Produto mais desejado da temporada
            </div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-primary px-3 py-1.5 text-xs font-black uppercase tracking-wider text-primary-foreground" style={{ background: "var(--gradient-gold)" }}>
              <TrendingUp className="h-3.5 w-3.5" />
              <span className="tabular-nums">{soldToday}</span> vendidos hoje
            </div>
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
            <div className="pointer-events-none absolute inset-0" aria-hidden>
              {[
                { l: "12%", t: "70%", d: "0s" },
                { l: "78%", t: "62%", d: ".7s" },
                { l: "30%", t: "82%", d: "1.4s" },
                { l: "62%", t: "78%", d: "2.1s" },
                { l: "48%", t: "68%", d: ".3s" },
              ].map((s, i) => (
                <Sparkles
                  key={i}
                  className="spark absolute h-4 w-4 text-primary"
                  style={{ left: s.l, top: s.t, animationDelay: s.d }}
                />
              ))}
            </div>
            <div className="absolute top-2 right-2 inline-flex items-center gap-1.5 rounded-full bg-background/80 backdrop-blur border border-primary/30 px-2.5 py-1 text-[11px] font-semibold">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              <Eye className="h-3 w-3" /> {viewers} pessoas vendo agora
            </div>
          </div>

          {/* PREÇO ANCORADO */}
          <div className="mt-8 mx-auto max-w-sm rounded-2xl border-2 border-primary/40 bg-card/80 backdrop-blur p-5" style={{ boxShadow: "var(--shadow-glow)" }}>
            <div className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-primary">
              <TrendingDown className="h-4 w-4" /> Você economiza R$300
            </div>
            <p className="mt-2 text-sm text-muted-foreground line-through">de R$597</p>
            <p className="text-5xl font-black leading-none">
              R$<span className="text-primary">297</span>
            </p>
            <p className="mt-2 text-base">
              ou <span className="font-black">12x</span> no cartão
            </p>
            <p className="mt-1 text-[11px] text-muted-foreground">frete calculado no checkout</p>
          </div>

          <a
            {...ctaProps("hero")}
            onClick={(e) => { fireBurst(e); ctaProps("hero").onClick(); }}
            className="shimmer-cta pulse-ring gradient-pan mt-6 relative inline-flex items-center justify-center gap-2 w-full rounded-2xl px-6 py-5 text-base font-black uppercase tracking-wide text-primary-foreground transition-transform hover:scale-[1.03] active:scale-[0.97]"
            style={{ backgroundImage: "var(--gradient-gold)", boxShadow: "var(--shadow-gold)" }}
          >
            <ShoppingCart className="h-5 w-5" /> Quero meu ArenaBox Pro
          </a>

          {/* MEDIDOR DE ESTOQUE */}
          <div className="mt-5 mx-auto max-w-sm">
            <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider mb-1.5">
              <span className="text-primary flex items-center gap-1"><Flame className="h-3 w-3" /> Últimas unidades</span>
              <span className="text-foreground/80">apenas {stock} restantes</span>
            </div>
            <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{
                  width: `${Math.max(8, (stock / 50) * 100)}%`,
                  background: "var(--gradient-gold)",
                  boxShadow: "var(--shadow-gold)",
                }}
              />
            </div>
          </div>

          <div className="mt-5 flex flex-wrap justify-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5"><Lock className="h-3.5 w-3.5" /> Pagamento 100% seguro</span>
            <span className="flex items-center gap-1.5"><Truck className="h-3.5 w-3.5" /> Envio para todo Brasil</span>
            <span className="flex items-center gap-1.5"><RotateCcw className="h-3.5 w-3.5" /> 7 dias de garantia</span>
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

      {/* BÔNUS EXCLUSIVOS — stack de valor */}
      <section className="px-5 py-14 bg-card/50">
        <div className="mx-auto max-w-xl">
          <div className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-primary">
              <Gift className="h-3.5 w-3.5" /> Bônus exclusivos hoje
            </span>
            <h2 className="mt-5 text-3xl font-black uppercase leading-tight">
              Leve <span className="text-primary">R$447 em bônus</span>
              <br />
              comprando agora
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Inclusos automaticamente — sem custo extra. Apenas para os pedidos de hoje.
            </p>
          </div>

          <div className="mt-8 space-y-3">
            {[
              { title: "Suporte ajustável de mesa", value: "R$97" },
              { title: "Cabo HDMI premium 1,5m", value: "R$67" },
              { title: "Guia: melhores filmes para o telão", value: "R$47" },
              { title: "Garantia estendida 30 dias", value: "R$236" },
            ].map((b, i) => (
              <div key={i} className="flex items-center gap-3 rounded-2xl border border-primary/20 bg-background p-4">
                <div className="rounded-lg p-2 shrink-0" style={{ background: "var(--gradient-gold)" }}>
                  <Gift className="h-4 w-4 text-primary-foreground" />
                </div>
                <p className="flex-1 text-sm font-semibold">{b.title}</p>
                <span className="text-sm font-black text-primary line-through opacity-70">{b.value}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border-2 border-primary bg-card p-5 text-center" style={{ boxShadow: "var(--shadow-glow)" }}>
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Valor total</p>
            <p className="mt-1 text-xl text-muted-foreground line-through">R$1.044</p>
            <p className="mt-1 text-[11px] uppercase tracking-widest text-primary font-bold">Hoje você leva por</p>
            <p className="text-5xl font-black leading-none mt-1">
              R$<span className="text-primary">297</span>
            </p>
            <p className="mt-2 text-sm text-foreground/80">ou 12x no cartão</p>

            <a
              {...ctaProps("bonus-stack")}
              className="mt-5 inline-flex items-center justify-center gap-2 w-full rounded-2xl px-6 py-4 text-sm font-black uppercase tracking-wide text-primary-foreground transition-transform hover:scale-[1.02] active:scale-[0.98]"
              style={{ background: "var(--gradient-gold)", boxShadow: "var(--shadow-gold)" }}
            >
              <ShoppingCart className="h-4 w-4" /> Quero garantir os bônus
            </a>
          </div>
        </div>
      </section>

      {/* URGÊNCIA */}
      <div
        className="px-5 py-4 text-center text-sm font-bold text-primary-foreground"
        style={{ background: "var(--gradient-gold)" }}
      >
        ⚠️ Apenas {stock} unidades restantes neste lote promocional
      </div>

      {/* PROVA SOCIAL */}
      <section className="px-5 py-14 bg-card/50">
        <div className="mx-auto max-w-xl">
          <div className="mb-8 grid grid-cols-3 gap-3">
            <div className="rounded-2xl border-2 border-primary bg-card p-4 text-center" style={{ boxShadow: "var(--shadow-gold)" }}>
              <Crown className="h-5 w-5 mx-auto text-primary" />
              <p className="mt-1.5 text-2xl font-black tabular-nums">{soldToday}+</p>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">vendidos hoje</p>
            </div>
            <div className="rounded-2xl border border-primary/30 bg-card p-4 text-center">
              <Star className="h-5 w-5 mx-auto text-primary fill-current" />
              <p className="mt-1.5 text-2xl font-black">4.9</p>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">+12 mil avaliações</p>
            </div>
            <div className="rounded-2xl border border-primary/30 bg-card p-4 text-center">
              <MapPin className="h-5 w-5 mx-auto text-primary" />
              <p className="mt-1.5 text-2xl font-black">26</p>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">estados atendidos</p>
            </div>
          </div>

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

      {/* GARANTIA RISCO ZERO */}
      <section className="px-5 py-14 bg-card/50">
        <div className="mx-auto max-w-xl rounded-3xl border-2 border-primary/40 bg-card p-6 text-center" style={{ boxShadow: "var(--shadow-glow)" }}>
          <div className="mx-auto inline-flex rounded-full p-3" style={{ background: "var(--gradient-gold)" }}>
            <ShieldCheck className="h-7 w-7 text-primary-foreground" />
          </div>
          <h2 className="mt-4 text-2xl sm:text-3xl font-black uppercase">
            Garantia de <span className="text-primary">risco zero</span>
          </h2>
          <p className="mt-3 text-sm text-foreground/90">
            Teste por <strong>7 dias</strong> sem compromisso. Se não amar,
            devolvemos <span className="text-primary font-bold">100% do seu dinheiro</span>.
            Sem perguntas. Sem burocracia. O risco é todo nosso.
          </p>
          <div className="mt-5 grid grid-cols-3 gap-2 text-[11px] font-bold uppercase tracking-wider">
            <div className="rounded-lg bg-background p-3"><RotateCcw className="h-4 w-4 mx-auto text-primary" /><span className="block mt-1.5">7 dias para testar</span></div>
            <div className="rounded-lg bg-background p-3"><Lock className="h-4 w-4 mx-auto text-primary" /><span className="block mt-1.5">Pagamento seguro</span></div>
            <div className="rounded-lg bg-background p-3"><Truck className="h-4 w-4 mx-auto text-primary" /><span className="block mt-1.5">Envio nacional</span></div>
          </div>
        </div>
      </section>

      {/* ALERTA DE DEMANDA */}
      <section className="px-5 py-12">
        <div className="mx-auto max-w-xl rounded-3xl border-2 border-primary bg-gradient-to-br from-primary/15 via-card to-card p-6" style={{ boxShadow: "var(--shadow-gold)" }}>
          <div className="flex items-start gap-3">
            <div className="rounded-lg p-2.5 shrink-0 animate-pulse" style={{ background: "var(--gradient-gold)" }}>
              <AlertTriangle className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <p className="text-[11px] font-black uppercase tracking-widest text-primary">Aviso importante</p>
              <h3 className="mt-1 text-xl font-black uppercase leading-tight">
                Demanda absurda — limite de 300 unidades por dia
              </h3>
              <p className="mt-2 text-sm text-foreground/85 leading-relaxed">
                Por questões de logística, liberamos no máximo <span className="text-primary font-bold">300 ArenaBox Pro por dia</span>.
                Quando o lote do dia acaba, a página é fechada e o próximo lote sai pelo preço cheio.
              </p>
              <p className="mt-3 text-sm font-bold">
                <span className="text-primary">{soldToday}</span> de 300 já foram comprados hoje.
              </p>
              <div className="mt-3 h-2 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{
                    width: `${Math.min(100, (soldToday / 300) * 100)}%`,
                    background: "var(--gradient-gold)",
                    boxShadow: "var(--shadow-gold)",
                  }}
                />
              </div>
            </div>
          </div>

          <a
            {...ctaProps("alerta-demanda")}
            className="mt-5 inline-flex items-center justify-center gap-2 w-full rounded-2xl px-6 py-4 text-sm font-black uppercase tracking-wide text-primary-foreground transition-transform hover:scale-[1.02] active:scale-[0.98]"
            style={{ background: "var(--gradient-gold)", boxShadow: "var(--shadow-gold)" }}
          >
            <ShoppingCart className="h-4 w-4" /> Quero o meu antes que esgote
          </a>
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
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-primary">
            <Clock className="h-3.5 w-3.5" /> Oferta termina em {mm}:{ss}
          </div>
          <h2 className="mt-5 text-3xl sm:text-4xl font-black uppercase leading-tight">
            Hoje você decide:<br />
            <span className="text-primary">tela gigante</span> ou continuar olhando pra TV pequena?
          </h2>
          <p className="mt-4 text-base text-muted-foreground">
            Quando essa página voltar, o preço volta pra <span className="line-through">R$597</span>.
            Quem aproveitou hoje, pagou só <span className="text-primary font-bold">R$297</span> + R$447 em bônus.
          </p>

          <div className="mt-6 flex flex-col items-center gap-0.5">
            <p className="text-sm text-muted-foreground line-through">de R$597</p>
            <p className="text-5xl font-black leading-none">
              R$<span className="text-primary">297</span>
            </p>
            <p className="mt-1 text-base">
              ou <span className="font-black">12x</span> no cartão
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
            Pagamento 100% seguro • Garantia de 7 dias • Envio para todo Brasil
          </p>
        </div>
      </section>

      <footer className="py-8 px-5 pb-28 text-center text-xs text-muted-foreground border-t border-border">
        © {new Date().getFullYear()} ArenaBox Pro. Todos os direitos reservados.
      </footer>

      {/* STICKY BOTTOM CTA */}
      {/* TOAST DE COMPRA RECENTE */}
      <div
        aria-live="polite"
        className={`fixed left-3 z-50 max-w-[300px] rounded-2xl border border-primary/40 bg-card/95 backdrop-blur p-3 pr-4 shadow-2xl transition-all duration-500 ${
          toast ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
        }`}
        style={{ bottom: "calc(env(safe-area-inset-bottom, 0px) + 84px)", boxShadow: "var(--shadow-gold)" }}
      >
        <div className="flex items-start gap-3">
          <div className="rounded-full p-1.5 shrink-0" style={{ background: "var(--gradient-gold)" }}>
            <ShoppingCart className="h-3.5 w-3.5 text-primary-foreground" />
          </div>
          <div className="text-[12px] leading-snug">
            <p className="font-bold">
              {toast?.name} <span className="text-muted-foreground font-normal">acabou de comprar</span>
            </p>
            <p className="text-muted-foreground">
              {toast?.city} · há {toast?.minutes} min
            </p>
          </div>
        </div>
      </div>

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