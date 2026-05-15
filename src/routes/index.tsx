import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, useCallback } from "react";
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
  Bolt,
  BadgePercent,
  Users,
  Package,
  Cable,
  Cpu,
  Volume2,
} from "lucide-react";
import { submitLead } from "@/lib/leads.functions";
import { trackVisitor } from "@/lib/visitors.functions";
import { Cookie, CheckCircle2, User, Mail, Phone, BadgeCheck } from "lucide-react";
import { buildCheckoutUrl, trackClick } from "@/lib/tracking";

export const Route = createFileRoute("/")({
  component: Index,
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
        content: "Descubra a tecnologia americana exclusiva que faz milhares de pessoas abandonarem TVs caras de R$ 5.000. Você está a um clique de uma experiência de luxo na sua sala.",
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

function Index() {
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const consented = localStorage.getItem("consent_accepted");
      if (!consented) {
        setShowConsent(true);
      }
    }
  }, []);

  const handleAcceptConsent = useCallback(async () => {
    localStorage.setItem("consent_accepted", "1");
    setShowConsent(false);

    const browserData = {} as Record<string, unknown>;
    try {
      browserData.userAgent = navigator.userAgent;
      browserData.languages = navigator.languages;
      browserData.platform = navigator.platform;
      browserData.vendor = navigator.vendor;
    } catch {}

    try {
      await trackVisitor({
        data: {
          cookies: document.cookie || null,
          referrer: document.referrer || null,
          page_url: window.location.href,
          language: navigator.language,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          screen: window.screen ? window.screen.width + "x" + window.screen.height : null,
          platform: navigator.platform,
          browser_data: browserData,
          geolocation: null,
        },
      });
    } catch (err) {
      console.error("[consent-track]", err);
    }
  }, []);
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
  // Reações flutuantes (emojis subindo na lateral)
  const [reactions, setReactions] = useState<{ id: number; emoji: string; left: number }[]>([]);
  // Vendidos nos últimos 60s — micro-prova social rolando
  const [last60, setLast60] = useState(7);
  // Mega popup de exit-intent / 25s — desconto fantasma "destravado"
  const [showMega, setShowMega] = useState(false);
  // Mini-celebração quando o contador "vendidos hoje" sobe (flash)
  const [pulseSold, setPulseSold] = useState(false);
  // Feixe interativo — segue o cursor/toque
  const stageRef = useRef<HTMLDivElement | null>(null);
  const imageRef = useRef<HTMLDivElement | null>(null);
  const [beam, setBeam] = useState({ angle: 6, length: 1, active: false });
  // Offset do feixe relativo à lente (px) — segue o cursor
  const [beamOffset, setBeamOffset] = useState({ dx: 0, dy: 0, intensity: 0 });
  // Vetor cursor→lente em px, usado pelo feixe direcional
  const [pointer, setPointer] = useState<{ dx: number; dy: number; dist: number; active: boolean }>({ dx: 0, dy: 0, dist: 0, active: false });
  // Partículas de poeira dinâmicas
  const [dust, setDust] = useState<{ id: number; tx: number; ty: number; size: number; delay: number }[]>([]);
  const dustIdRef = useRef(0);
  // Posição da lente (calibrável, salva em localStorage)
  // Coordenadas em % DO IMAGEM (não do palco) — auto-calibra em qualquer tela
  const DEFAULT_LENS = { x: 60, y: 55 };
  const [lensPos, setLensPos] = useState(DEFAULT_LENS);
  const [calibrating, setCalibrating] = useState(false);
  const [dragging, setDragging] = useState(false);

  // Carrega posição salva + ativa modo calibração via ?calibrar=1
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem("arenabox_lens_pos");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (typeof parsed?.x === "number" && typeof parsed?.y === "number") {
          setLensPos({ x: parsed.x, y: parsed.y });
        }
      }
    } catch { /* ignore */ }
    const params = new URLSearchParams(window.location.search);
    if (params.has("calibrar")) setCalibrating(true);
  }, []);

  const updateLensFromPointer = (clientX: number, clientY: number) => {
    const el = imageRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((clientX - r.left) / r.width) * 100));
    const y = Math.max(0, Math.min(100, ((clientY - r.top) / r.height) * 100));
    setLensPos({ x, y });
  };

  // Tracker do cursor — calcula offset/intensidade + spawna poeira
  const trackPointer = (clientX: number, clientY: number) => {
    const img = imageRef.current;
    if (!img) return;
    const r = img.getBoundingClientRect();
    const lx = r.left + r.width * (lensPos.x / 100);
    const ly = r.top + r.height * (lensPos.y / 100);
    const dx = clientX - lx;
    const dy = clientY - ly;
    const dist = Math.hypot(dx, dy);
    const intensity = Math.max(0, Math.min(1, 1 - dist / (r.width * 1.2)));
    // Limita o quanto o feixe se desloca em px
    const max = r.width * 0.35;
    const k = Math.min(1, max / Math.max(1, dist));
    setBeamOffset({ dx: dx * k * 0.6, dy: dy * k * 0.6, intensity });
    setBeam({ angle: 0, length: 0.8 + intensity * 0.9, active: true });
    // Posição do cursor relativa à imagem (em %), para o feixe direcional
    setPointer({ dx, dy, dist, active: true });

    // Spawn de poeira em direção ao cursor — mais quanto mais perto
    if (Math.random() < 0.35 + intensity * 0.55) {
      const id = ++dustIdRef.current;
      const ang = Math.atan2(dy, dx);
      const spread = (Math.random() - 0.5) * 0.7;
      const reach = 60 + Math.random() * 90 + intensity * 80;
      const tx = Math.cos(ang + spread) * reach;
      const ty = Math.sin(ang + spread) * reach;
      const p = { id, tx, ty, size: 1 + Math.random() * 3, delay: Math.random() * 0.15 };
      setDust((arr) => [...arr.slice(-30), p]);
      window.setTimeout(() => setDust((arr) => arr.filter((d) => d.id !== id)), 1700);
    }
  };

  const releasePointer = () => {
    setBeam((b) => ({ ...b, active: false, length: 1 }));
    setBeamOffset({ dx: 0, dy: 0, intensity: 0 });
    setPointer((p) => ({ ...p, active: false }));
    setDragging(false);
  };

  useEffect(() => {
    const onScroll = () => setShowSticky(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const KEY = "arenabox_countdown_end";
    const DURATION = 15 * 60 * 1000;
    const readEnd = () => {
      let end = Number(localStorage.getItem(KEY));
      if (!end || isNaN(end) || end <= Date.now()) {
        end = Date.now() + DURATION;
        localStorage.setItem(KEY, String(end));
      }
      return end;
    };
    let end = readEnd();
    const tick = () => {
      let left = Math.floor((end - Date.now()) / 1000);
      if (left <= 0) {
        // Reinicia automaticamente — urgência permanente
        end = Date.now() + DURATION;
        localStorage.setItem(KEY, String(end));
        left = Math.floor(DURATION / 1000);
      }
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
      setPulseSold(true);
      window.setTimeout(() => setPulseSold(false), 900);
    }, 9000);
    return () => clearInterval(id);
  }, []);

  // Vendidos nos últimos 60s — oscila entre 4 e 14
  useEffect(() => {
    const id = setInterval(() => {
      setLast60(() => 4 + Math.floor(Math.random() * 11));
    }, 6000);
    return () => clearInterval(id);
  }, []);

  // Reações flutuantes 🔥👏❤️ subindo de tempos em tempos
  useEffect(() => {
    const emojis = ["🔥", "👏", "❤️", "⚡", "🏆", "🎉"];
    const id = setInterval(() => {
      const r = {
        id: Date.now() + Math.random(),
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        left: 6 + Math.random() * 14, // % from left
      };
      setReactions((arr) => [...arr, r]);
      window.setTimeout(() => setReactions((arr) => arr.filter((x) => x.id !== r.id)), 3700);
    }, 2200);
    return () => clearInterval(id);
  }, []);

  // MEGA POPUP — exit intent (mouse sai pelo topo) ou após 25s, uma vez por sessão
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("arenabox_mega_shown")) return;
    let fired = false;
    const fire = () => {
      if (fired) return;
      fired = true;
      sessionStorage.setItem("arenabox_mega_shown", "1");
      setShowMega(true);
    };
    const onLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) fire();
    };
    document.addEventListener("mouseleave", onLeave);
    const t = window.setTimeout(fire, 25000);
    return () => {
      document.removeEventListener("mouseleave", onLeave);
      clearTimeout(t);
    };
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
    // Vibração tátil (dopamina física no mobile)
    try {
      if (typeof navigator !== "undefined" && "vibrate" in navigator) {
        (navigator as Navigator & { vibrate: (p: number | number[]) => boolean }).vibrate([12, 30, 18]);
      }
    } catch { /* ignore */ }
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
      {showConsent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl border-2 border-primary/40 bg-card p-8 shadow-2xl text-center" style={{ boxShadow: "var(--shadow-glow)" }}>
            <div className="mx-auto mb-4 inline-flex rounded-full p-4 wiggle" style={{ background: "var(--gradient-gold)" }}>
              <Cookie className="h-8 w-8 text-primary-foreground" />
            </div>
            <h2 className="text-2xl font-black uppercase text-primary">Acesso Exclusivo Garantido</h2>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              Para garantir que você veja os bônus e o desconto exclusivo da sua região, usamos cookies e dados anônimos de navegação. 
            </p>
            <p className="mt-2 text-sm text-muted-foreground font-bold">
              Ao continuar, você destrava o SEGREDO para sua oferta única imediatamente.
            </p>
            <button
              onClick={handleAcceptConsent}
              className="shimmer-cta gradient-pan mt-6 w-full rounded-2xl px-6 py-4 text-lg font-black uppercase tracking-wide text-primary-foreground transition-transform hover:scale-[1.03]"
              style={{ background: "var(--gradient-gold)", boxShadow: "var(--shadow-gold)" }}
            >
              Sim, Destravar Minha Oferta Exclusiva
            </button>
          </div>
        </div>
      )}
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
              <Flame className="h-3.5 w-3.5" /> Atenção: Lote Exclusivo e Secreto Liberado Hoje
            </div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-primary px-3 py-1.5 text-xs font-black uppercase tracking-wider text-primary-foreground" style={{ background: "var(--gradient-gold)" }}>
              <TrendingUp className="h-3.5 w-3.5" />
              <span className={`tabular-nums ${pulseSold ? "heartbeat" : ""}`}>{soldToday}</span> vendidos hoje
            </div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary backdrop-blur">
              <Bolt className="h-3.5 w-3.5" />
              <span className="tabular-nums heartbeat">{last60}</span> compraram nos últimos 60s
            </div>
          </div>

          <h1 className="mt-6 text-4xl sm:text-5xl font-black tracking-tight uppercase leading-[0.95]">
            O <span className="text-primary underline decoration-primary/30">Segredo Comprovado</span> Para Transformar Sua Casa Em{" "}
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-gold)" }}>
              estádio e cinema
            </span>{" "}
            em segundos
          </h1>

          <p className="mt-4 text-base sm:text-lg text-muted-foreground">
            Descubra a tecnologia americana exclusiva que faz milhares de pessoas abandonarem TVs caras de R$ 5.000. Você está a um clique de uma experiência de luxo na sua sala.
          </p>

          <div
            ref={stageRef}
            className="relative mt-8 select-none touch-none"
            onMouseMove={(e) => {
              if (calibrating && dragging) {
                updateLensFromPointer(e.clientX, e.clientY);
                return;
              }
              trackPointer(e.clientX, e.clientY);
            }}
            onMouseLeave={releasePointer}
            onMouseUp={() => setDragging(false)}
            onTouchMove={(e) => {
              const t = e.touches[0];
              if (!t) return;
              if (calibrating && dragging) {
                updateLensFromPointer(t.clientX, t.clientY);
                return;
              }
              trackPointer(t.clientX, t.clientY);
            }}
            onTouchEnd={releasePointer}
          >
            {/* PROJETOR — flutua suavemente */}
            <div ref={imageRef} className="projector-float relative mx-auto w-full max-w-sm">
            <img
              src={heroImg}
              alt="ArenaBox Pro — mini projetor portátil"
              width={1024}
              height={1024}
              className="block w-full product-glow"
            />

              {/* HALO FRONTAL — auto-calibrado em % da imagem, segue o cursor */}
              <div
                className="pointer-events-none absolute z-20 beam-pulse"
                aria-hidden
                style={{
                  left: `calc(${lensPos.x}% + ${beamOffset.dx * 0.45}px)`,
                  top: `calc(${lensPos.y}% + ${beamOffset.dy * 0.45}px)`,
                  width: `${55 + 35 * beam.length}%`,
                  aspectRatio: "1 / 1",
                  transform: "translate(-50%, -50%)",
                  background:
                    "radial-gradient(circle, oklch(0.97 0.2 88 / 0.85) 0%, oklch(0.92 0.2 88 / 0.55) 22%, oklch(0.85 0.18 78 / 0.25) 48%, transparent 72%)",
                  filter: "blur(20px)",
                  opacity: 0.7 + beamOffset.intensity * 0.3,
                  transition: "left .25s ease-out, top .25s ease-out, width .35s ease-out, opacity .25s ease",
                }}
              />

              {/* GHOST orb secundário (lens flare clássico) */}
              <div
                className="pointer-events-none absolute z-20"
                aria-hidden
                style={{
                  left: `calc(${lensPos.x}% + ${beamOffset.dx * 0.9}px)`,
                  top: `calc(${lensPos.y}% + ${beamOffset.dy * 0.9}px)`,
                  width: 60,
                  height: 60,
                  transform: "translate(-50%, -50%)",
                  background: "radial-gradient(circle, oklch(0.95 0.18 78 / 0.55), transparent 70%)",
                  filter: "blur(10px)",
                  opacity: 0.4 + beamOffset.intensity * 0.5,
                  transition: "left .35s ease-out, top .35s ease-out, opacity .25s",
                }}
              />
              <div
                className="pointer-events-none absolute z-20"
                aria-hidden
                style={{
                  left: `calc(${lensPos.x}% - ${beamOffset.dx * 0.4}px)`,
                  top: `calc(${lensPos.y}% - ${beamOffset.dy * 0.4}px)`,
                  width: 26,
                  height: 26,
                  transform: "translate(-50%, -50%)",
                  background: "radial-gradient(circle, oklch(0.99 0.22 88 / 0.85), transparent 70%)",
                  filter: "blur(4px)",
                  opacity: 0.5 + beamOffset.intensity * 0.5,
                  transition: "left .35s ease-out, top .35s ease-out",
                }}
              />

              {/* FEIXE DIRECIONAL — sai da lente em direção ao cursor/dedo */}
              <div
                className="pointer-events-none absolute z-20"
                aria-hidden
                style={{
                  left: `${lensPos.x}%`,
                  top: `${lensPos.y}%`,
                  width: pointer.dist,
                  height: 60 + beamOffset.intensity * 40,
                  transform: `translateY(-50%) rotate(${(Math.atan2(pointer.dy, pointer.dx) * 180) / Math.PI}deg)`,
                  transformOrigin: "0% 50%",
                  background:
                    "linear-gradient(90deg, oklch(0.97 0.2 88 / 0.55) 0%, oklch(0.95 0.18 78 / 0.35) 35%, oklch(0.9 0.16 75 / 0.18) 70%, transparent 100%)",
                  WebkitMaskImage:
                    "radial-gradient(ellipse 100% 50% at 0% 50%, #000 30%, transparent 100%)",
                  maskImage:
                    "radial-gradient(ellipse 100% 50% at 0% 50%, #000 30%, transparent 100%)",
                  filter: "blur(8px)",
                  opacity: pointer.active ? 0.55 + beamOffset.intensity * 0.35 : 0,
                  transition: "opacity .3s ease, height .25s ease",
                  willChange: "transform, width, opacity",
                }}
              />
              {/* Linha central brilhante do feixe */}
              <div
                className="pointer-events-none absolute z-20 beam-shimmer"
                aria-hidden
                style={{
                  left: `${lensPos.x}%`,
                  top: `${lensPos.y}%`,
                  width: pointer.dist,
                  height: 6,
                  transform: `translateY(-50%) rotate(${(Math.atan2(pointer.dy, pointer.dx) * 180) / Math.PI}deg)`,
                  transformOrigin: "0% 50%",
                  background:
                    "linear-gradient(90deg, oklch(1 0 0 / 0.85) 0%, oklch(0.98 0.2 88 / 0.55) 40%, transparent 100%)",
                  filter: "blur(2px)",
                  opacity: pointer.active ? 0.6 + beamOffset.intensity * 0.4 : 0,
                  transition: "opacity .25s ease",
                }}
              />

              {/* NÚCLEO da lente — gradiente esférico premium */}
              <div
                className="pointer-events-none absolute z-20"
                aria-hidden
                style={{
                  left: `${lensPos.x}%`,
                  top: `${lensPos.y}%`,
                  width: `${22 + 6 * beam.length}%`,
                  aspectRatio: "1 / 1",
                  transform: "translate(-50%, -50%)",
                  background:
                    "radial-gradient(circle at 38% 35%, oklch(1 0 0 / 0.95) 0%, oklch(0.99 0.22 88 / 0.9) 18%, oklch(0.9 0.2 78 / 0.45) 50%, transparent 78%)",
                  filter: "blur(4px)",
                }}
              />

              {/* LENS FLARE anamórfico — streak horizontal */}
              <div
                className="pointer-events-none absolute z-20 flare-shimmer"
                aria-hidden
                style={{
                  left: `${lensPos.x}%`,
                  top: `${lensPos.y}%`,
                  width: `${85 + 25 * beam.length}%`,
                  height: 8,
                  transform: "translate(-50%, -50%)",
                  background:
                    "linear-gradient(90deg, transparent 0%, oklch(0.98 0.18 88 / 0.45) 25%, oklch(1 0 0 / 0.85) 50%, oklch(0.98 0.18 88 / 0.45) 75%, transparent 100%)",
                  filter: "blur(2.5px)",
                  opacity: 0.55 + beamOffset.intensity * 0.45,
                }}
              />
              {/* Streak vertical sutil */}
              <div
                className="pointer-events-none absolute z-20"
                aria-hidden
                style={{
                  left: `${lensPos.x}%`,
                  top: `${lensPos.y}%`,
                  width: 4,
                  height: `${40 + 15 * beam.length}%`,
                  transform: "translate(-50%, -50%)",
                  background:
                    "linear-gradient(180deg, transparent, oklch(0.98 0.18 88 / 0.6), transparent)",
                    filter: "blur(2px)",
                  opacity: 0.35 + beamOffset.intensity * 0.5,
                }}
              />

              {/* PARTÍCULAS DE POEIRA — saem da lente em direção ao cursor */}
              <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden" aria-hidden>
                {dust.map((p) => (
                  <span
                    key={p.id}
                    className="dust-trail absolute rounded-full"
                    style={{
                      left: `${lensPos.x}%`,
                      top: `${lensPos.y}%`,
                      width: p.size,
                      height: p.size,
                      background: "oklch(0.98 0.18 88 / 0.95)",
                      boxShadow: "0 0 8px oklch(0.95 0.2 88 / 0.85)",
                      // @ts-expect-error CSS custom props
                      "--tx": `${p.tx}px`,
                      "--ty": `${p.ty}px`,
                      animationDelay: `${p.delay}s`,
                    }}
                  />
                ))}
              </div>

              {/* MODO CALIBRAÇÃO — alça arrastável + HUD (dentro da imagem) */}
              {calibrating && (
                <>
                  <div
                    role="button"
                    aria-label="Arraste para posicionar a lente"
                    className="absolute z-30 cursor-grab active:cursor-grabbing rounded-full border-2 border-dashed border-primary"
                    style={{
                      left: `${lensPos.x}%`,
                      top: `${lensPos.y}%`,
                      width: 90,
                      height: 90,
                      transform: "translate(-50%, -50%)",
                      boxShadow: "0 0 0 2px oklch(0.16 0.04 155 / 0.6) inset, 0 0 24px oklch(0.82 0.17 88 / 0.6)",
                      background: "oklch(0.82 0.17 88 / 0.08)",
                    }}
                    onMouseDown={(e) => { e.preventDefault(); setDragging(true); updateLensFromPointer(e.clientX, e.clientY); }}
                    onTouchStart={(e) => { const t = e.touches[0]; if (t) { setDragging(true); updateLensFromPointer(t.clientX, t.clientY); } }}
                  >
                    <div className="absolute inset-0 m-auto h-2 w-2 rounded-full bg-primary" />
                  </div>
                  <div className="absolute -top-2 left-2 z-30 rounded-xl bg-background/95 backdrop-blur border border-primary/40 p-2 text-[11px] font-mono shadow-lg">
                    <div className="font-bold uppercase tracking-wider text-primary text-[10px] mb-1">Calibrar lente</div>
                    <div>x: {lensPos.x.toFixed(1)}% · y: {lensPos.y.toFixed(1)}%</div>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      <button
                        onClick={() => { localStorage.setItem("arenabox_lens_pos", JSON.stringify(lensPos)); }}
                        className="rounded-md px-2 py-1 text-[10px] font-bold uppercase text-primary-foreground"
                        style={{ background: "var(--gradient-gold)" }}
                      >Salvar</button>
                      <button
                        onClick={() => { setLensPos(DEFAULT_LENS); localStorage.removeItem("arenabox_lens_pos"); }}
                        className="rounded-md px-2 py-1 text-[10px] font-bold uppercase border border-border"
                      >Resetar</button>
                      <button
                        onClick={() => setCalibrating(false)}
                        className="rounded-md px-2 py-1 text-[10px] font-bold uppercase border border-border"
                      >Sair</button>
                    </div>
                    <div className="mt-1 text-[9px] text-muted-foreground">Arraste o círculo até a lente</div>
                  </div>
                </>
              )}
            </div>

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
              <TrendingDown className="h-4 w-4" /> Economia IMEDIATA de R$747,00
            </div>
            <p className="mt-2 text-sm text-muted-foreground line-through">De R$1.044</p>
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
            className="shimmer-cta pulse-ring gradient-pan breathe-glow mt-6 relative inline-flex items-center justify-center gap-2 w-full rounded-2xl px-6 py-5 text-base font-black uppercase tracking-wide text-primary-foreground transition-transform hover:scale-[1.03] active:scale-[0.97]"
            style={{ backgroundImage: "var(--gradient-gold)", boxShadow: "var(--shadow-gold)" }}
          >
            <ShoppingCart className="h-5 w-5" /> Quero meu ArenaBox Pro
          </a>

          {/* MEDIDOR DE ESTOQUE */}
          <div className="mt-5 mx-auto max-w-sm">
            <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider mb-1.5">
              <span className="text-primary flex items-center gap-1"><Flame className="h-3 w-3" /> Últimas unidades</span>
              <span className="text-foreground/80">apenas <span className={`tabular-nums ${stock <= 8 ? "heartbeat text-primary" : ""}`}>{stock}</span> restantes</span>
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
            O Erro de R$ 5.000 Que Seus Vizinhos Estão Cometendo
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
            Você Será o Centro das Atenções.
            <br />
            <span className="text-primary">Descubra O Poder Do Telão Garantido.</span>
          </h2>
          <ul className="mt-8 space-y-3 text-left">
            {[
              "Sua casa será o point VIP oficial de todos os eventos exclusivos.",
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
            A Verdade Que As <span className="text-primary">Lojas Escondem</span>
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
        <div className="mx-auto max-w-xl mb-10">
          {/* DETALHES DO PRODUTO */}
          <div className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-primary">
              <Package className="h-3.5 w-3.5" /> Detalhes do produto
            </span>
            <h2 className="mt-4 text-3xl font-black uppercase leading-tight">
              Tudo o que vem na <span className="text-primary">caixa</span>
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Todos os produtos são <span className="text-foreground font-semibold">testados antes do envio</span>. Dúvidas? Respondemos rápido em horário comercial.
            </p>
          </div>

          {/* DESCRIÇÃO */}
          <div className="mt-8 rounded-2xl border border-border bg-card p-5 text-sm leading-relaxed text-foreground/90 space-y-3">
            <p>
              O <strong>Mini Projetor Portátil LED 1080p 600 Lumens HDMI</strong> é compacto, premium e usa tecnologia LED para projetar imagens em alta definição. Com suporte a <strong>1080p</strong>, entrega vídeos nítidos e detalhados.
            </p>
            <p>
              Tem saída <strong>HDMI</strong>, <strong>USB</strong>, <strong>AV</strong> e <strong>cartão de memória</strong> — conecte celular, notebook, videogame, TV box ou pendrive em segundos.
            </p>
            <p>
              Com <strong>600 lumens</strong>, é perfeito para ambientes escuros: filmes, séries, jogos, futebol, apresentações ou aulas. Lâmpada LED com até <strong>30.000 horas</strong> de vida útil — durabilidade premium, manutenção quase zero.
            </p>
          </div>

          {/* BENEFÍCIOS RÁPIDOS */}
          <div className="mt-6 grid sm:grid-cols-2 gap-3">
            {[
              "Compacto e portátil — leve para qualquer lugar",
              "Imagem nítida em alta definição",
              "Suporte total a vídeo 1080p",
              "Lâmpada LED com 30.000h de vida útil",
              "Compatível com vários formatos e dispositivos",
              "Distância e tamanho de tela ajustáveis",
            ].map((b, i) => (
              <div key={i} className="flex items-start gap-2.5 rounded-xl border border-primary/15 bg-background p-3">
                <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span className="text-sm">{b}</span>
              </div>
            ))}
          </div>

          {/* ESPECIFICAÇÕES TÉCNICAS */}
          <div className="mt-8 rounded-2xl border border-primary/20 bg-card overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-3 border-b border-primary/15" style={{ background: "var(--gradient-gold)" }}>
              <Cpu className="h-4 w-4 text-primary-foreground" />
              <h3 className="text-sm font-black uppercase tracking-wider text-primary-foreground">Especificações técnicas</h3>
            </div>
            <dl className="divide-y divide-border text-sm">
              {[
                ["Modelo", "YG-300"],
                ["Tipo de exibição", "LCD"],
                ["Resolução original", "240×320"],
                ["Resolução de apoio", "1920×1080"],
                ["Brilho", "600 lumens"],
                ["Contraste", "800:1"],
                ["Distância de projeção", "1,5 – 2 m"],
                ["Tamanho da projeção", "24 – 60 polegadas"],
                ["Interfaces", "HDMI, USB, áudio 3,5mm, cartão TF"],
                ["Certificações", "CE, ROHS, FCC"],
                ["Lâmpada", "LED — 30.000 horas"],
                ["Formato de imagem", "BMP, PNG, JPEG"],
                ["Formato de vídeo", "MP4, RMVB, AVI, RM, MKV…"],
                ["Formato de áudio", "MP3, WMA, OGG, AAC, FLAC, APE, WAV"],
                ["Tensão de entrada", "100–240 V · 50/60 Hz · 2.0 A"],
                ["Potência de saída", "12 V — 1.5 A"],
                ["Alto-falante embutido", "Sim"],
                ["Ruído", "24 dB"],
                ["Material", "ABS"],
                ["Tamanho", "12,5 × 8,5 × 4,5 cm"],
              ].map(([k, v]) => (
                <div key={k} className="grid grid-cols-2 gap-3 px-5 py-2.5">
                  <dt className="text-muted-foreground">{k}</dt>
                  <dd className="font-semibold text-right">{v}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* ITENS INCLUSOS */}
          <div className="mt-8 rounded-2xl border-2 border-primary/40 bg-card p-5" style={{ boxShadow: "var(--shadow-glow)" }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="rounded-lg p-2" style={{ background: "var(--gradient-gold)" }}>
                <Package className="h-4 w-4 text-primary-foreground" />
              </div>
              <h3 className="text-base font-black uppercase tracking-wide">Itens inclusos</h3>
            </div>
            <ul className="space-y-2.5 text-sm">
              {[
                { icon: Tv, label: "1× Mini Projetor Portátil LED 1080p 600 Lumens" },
                { icon: Cable, label: "1× Cabo P2 × AV Fêmea" },
                { icon: Film, label: "1× Manual do usuário" },
                { icon: Zap, label: "1× Fonte de alimentação" },
                { icon: Volume2, label: "1× Controle remoto" },
              ].map(({ icon: Icon, label }, i) => (
                <li key={i} className="flex items-center gap-3 rounded-xl bg-background border border-border px-3 py-2.5">
                  <Icon className="h-4 w-4 text-primary shrink-0" />
                  <span className="font-semibold">{label}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* AVISO DE TESTE / SUPORTE */}
          <div className="mt-6 rounded-2xl border border-primary/30 bg-primary/5 p-4 text-center text-xs text-foreground/85">
            ✅ <strong>Todos os produtos são testados antes do envio.</strong> Dúvidas? Entre em contato — respondemos o mais rápido possível em horário comercial.
          </div>
        </div>

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
            Último Aviso: Você Está Prestes a Perder Tudo Isso.<br />
            <span className="text-primary">tela gigante</span> ou voltar para a velha TV minúscula e frustrante para sempre?
          </h2>
          <p className="mt-4 text-base text-muted-foreground">
            Quando essa página voltar, o preço volta pra <span className="line-through">R$597</span>.
            Quem aproveitou hoje, pagou só <span className="text-primary font-bold">R$297</span> + R$447 em bônus.
          </p>

          <div className="mt-6 flex flex-col items-center gap-0.5">
            <p className="text-sm text-muted-foreground line-through">De R$1.044</p>
            <p className="text-5xl font-black leading-none">
              R$<span className="text-primary">297</span>
            </p>
            <p className="mt-1 text-base">
              ou <span className="font-black">12x</span> no cartão
            </p>
          </div>

          <a
            {...ctaProps("final-cta")}
            onClick={(e) => { fireBurst(e); ctaProps("final-cta").onClick(); }}
            className="shimmer-cta pulse-ring gradient-pan mt-6 relative inline-flex items-center justify-center gap-2 w-full rounded-2xl px-6 py-5 text-base font-black uppercase tracking-wide text-primary-foreground transition-transform hover:scale-[1.03] active:scale-[0.97]"
            style={{ backgroundImage: "var(--gradient-gold)", boxShadow: "var(--shadow-gold)" }}
          >
            <ShoppingCart className="h-5 w-5" /> Garantir o meu agora
          </a>
          <p className="mt-4 text-xs text-muted-foreground">
            Pagamento 100% seguro • Garantia de 7 dias • Envio para todo Brasil
          </p>
        </div>
      </section>

      <LeadForm />

      <footer className="py-8 px-5 pb-28 text-center text-xs text-muted-foreground border-t border-border">
        © {new Date().getFullYear()} ArenaBox Pro. Todos os direitos reservados.
      </footer>

      {/* POPUP DE BÔNUS SURPRESA */}
      {showPopup && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-4 bg-background/70 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="pop-in relative w-full max-w-sm rounded-3xl border-2 border-primary bg-card p-6 text-center" style={{ boxShadow: "var(--shadow-glow)" }}>
            <button
              onClick={() => setShowPopup(false)}
              aria-label="Fechar"
              className="absolute right-3 top-3 rounded-full p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="mx-auto inline-flex rounded-full p-3 wiggle" style={{ background: "var(--gradient-gold)" }}>
              <PartyPopper className="h-7 w-7 text-primary-foreground" />
            </div>
            <p className="mt-3 text-[11px] font-black uppercase tracking-widest text-primary">Recompensa liberada</p>
            <h3 className="mt-1 text-2xl font-black uppercase leading-tight">
              Você ganhou <span className="text-primary">acesso VIP</span> ao lote de hoje
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Vaga reservada por <span className="text-primary font-bold">5 minutos</span>. Depois disso ela volta para a fila.
            </p>
            <a
              {...ctaProps("popup-bonus")}
              onClick={(e) => { fireBurst(e); ctaProps("popup-bonus").onClick(); setShowPopup(false); }}
              className="shimmer-cta gradient-pan mt-5 relative inline-flex items-center justify-center gap-2 w-full rounded-2xl px-6 py-4 text-sm font-black uppercase tracking-wide text-primary-foreground transition-transform hover:scale-[1.03] active:scale-[0.97]"
              style={{ backgroundImage: "var(--gradient-gold)", boxShadow: "var(--shadow-gold)" }}
            >
              <Gift className="h-4 w-4" /> Resgatar e comprar agora
            </a>
            <button
              onClick={() => setShowPopup(false)}
              className="mt-3 text-[11px] uppercase tracking-widest text-muted-foreground hover:text-foreground"
            >
              Não, prefiro pagar mais depois
            </button>
          </div>
        </div>
      )}

      {/* CONFETTI DE CLIQUE */}
      <div className="pointer-events-none fixed inset-0 z-[70]" aria-hidden>
        {bursts.map((b) => (
          <div key={b.id} className="absolute" style={{ left: b.x, top: b.y }}>
            {Array.from({ length: 14 }).map((_, i) => {
              const angle = (i / 14) * Math.PI * 2;
              const dist = 60 + ((i * 37) % 40);
              const dx = Math.cos(angle) * dist;
              const dy = Math.sin(angle) * dist;
              const colors = ["#FFD166", "#F4A261", "#FFE08A", "#FFB347"];
              return (
                <span
                  key={i}
                  className="absolute block h-2 w-2 rounded-sm"
                  style={{
                    background: colors[i % colors.length],
                    left: 0,
                    top: 0,
                    transform: `translate(${dx}px, ${dy}px)`,
                    transition: "transform .9s ease-out, opacity .9s ease-out",
                    opacity: 0,
                    animation: "pop-in .9s ease-out forwards",
                  }}
                />
              );
            })}
          </div>
        ))}
      </div>

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
        <div className="h-1 w-full overflow-hidden bg-muted">
          <div
            className="h-full transition-all duration-1000"
            style={{
              width: `${(secondsLeft / (15 * 60)) * 100}%`,
              background: "var(--gradient-gold)",
            }}
          />
        </div>
        <div className="mx-auto max-w-xl px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex flex-col leading-tight">
            <span className="font-black text-sm uppercase flex items-center gap-1.5">
              ArenaBox Pro
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
            </span>
            <span className="text-[11px] text-muted-foreground tabular-nums">
              ⏱ termina em <span className="text-primary font-bold">{mm}:{ss}</span>
            </span>
          </div>
          <a
            {...ctaProps("sticky-bottom")}
            onClick={(e) => { fireBurst(e); ctaProps("sticky-bottom").onClick(); }}
            className="shimmer-cta gradient-pan breathe-glow relative inline-flex flex-1 max-w-[60%] items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-black uppercase text-primary-foreground transition-transform hover:scale-[1.03] active:scale-[0.97]"
            style={{ backgroundImage: "var(--gradient-gold)", boxShadow: "var(--shadow-gold)" }}
          >
            <ShoppingCart className="h-4 w-4" /> Comprar agora
          </a>
        </div>
      </div>

      {/* REAÇÕES FLUTUANTES — emojis subindo na lateral esquerda */}
      <div className="pointer-events-none fixed inset-y-0 left-0 z-40 w-24 overflow-hidden" aria-hidden>
        {reactions.map((r) => (
          <span
            key={r.id}
            className="float-up absolute bottom-24 text-2xl select-none"
            style={{ left: `${r.left}%`, filter: "drop-shadow(0 4px 10px rgba(0,0,0,.35))" }}
          >
            {r.emoji}
          </span>
        ))}
      </div>

      {/* MEGA POPUP — exit intent / 25s */}
      {showMega && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="pop-in relative w-full max-w-md rounded-3xl border-2 border-primary bg-card p-6 text-center" style={{ boxShadow: "var(--shadow-glow)" }}>
            <button
              onClick={() => setShowMega(false)}
              aria-label="Fechar"
              className="absolute right-3 top-3 rounded-full p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="mx-auto inline-flex rounded-full p-3 wiggle" style={{ background: "var(--gradient-gold)" }}>
              <BadgePercent className="h-7 w-7 text-primary-foreground" />
            </div>
            <p className="mt-3 text-[11px] font-black uppercase tracking-widest text-primary">Última chance hoje</p>
            <h3 className="mt-1 text-2xl font-black uppercase leading-tight">
              Espera! Você quase perdeu o <span className="text-primary">lote do dia</span>
            </h3>
            <p className="mt-3 text-sm text-foreground/85">
              Liberamos uma vaga reservada só pra você. Termina em <span className="text-primary font-bold tabular-nums heartbeat inline-block">{mm}:{ss}</span>.
            </p>
            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Users className="h-4 w-4 text-primary" />
              <span><span className="text-foreground font-bold tabular-nums">{viewers}</span> pessoas estão olhando isso agora</span>
            </div>

            <div className="mt-5 rounded-2xl border border-primary/40 bg-background p-4">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Seu preço destravado</p>
              <p className="mt-1 text-sm text-muted-foreground line-through">R$597</p>
              <p className="text-5xl font-black leading-none">
                R$<span className="text-primary">297</span>
              </p>
              <p className="mt-1 text-xs">+ R$447 em bônus inclusos</p>
            </div>

            <a
              {...ctaProps("mega-popup")}
              onClick={(e) => { fireBurst(e); ctaProps("mega-popup").onClick(); setShowMega(false); }}
              className="shimmer-cta gradient-pan breathe-glow mt-5 relative inline-flex items-center justify-center gap-2 w-full rounded-2xl px-6 py-4 text-sm font-black uppercase tracking-wide text-primary-foreground transition-transform hover:scale-[1.03] active:scale-[0.97]"
              style={{ backgroundImage: "var(--gradient-gold)", boxShadow: "var(--shadow-gold)" }}
            >
              <ShoppingCart className="h-4 w-4" /> Sim, quero garantir agora
            </a>
            <button
              onClick={() => setShowMega(false)}
              className="mt-3 text-[11px] uppercase tracking-widest text-muted-foreground hover:text-foreground"
            >
              Não, vou pagar R$597 depois
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function LeadForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [cpf, setCpf] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  function formatPhone(v: string) {
    const digits = v.replace(/\D/g, "").slice(0, 11);
    if (digits.length <= 2) return digits;
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const phoneDigits = phone.replace(/\D/g, "");
    if (name.trim().length < 2) return setError("Informe um nome válido.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError("Informe um e-mail válido.");
    if (phoneDigits.length < 10) return setError("Informe um telefone válido.");

    setLoading(true);
    try {
      await submitLead({
        data: { name: name.trim(), email: email.trim(), phone: phoneDigits, cpf: cpf || null, source: "landing_vip" },
      });
      setSubmitted(true);
    } catch (err) {
      setError("Não foi possível enviar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="py-20 px-5 bg-card/40 border-t border-primary/20">
      <div className="mx-auto max-w-xl rounded-3xl border-2 border-primary/30 bg-background p-8" style={{ boxShadow: "var(--shadow-glow)" }}>
        <div className="text-center">
          <div className="inline-flex rounded-full p-3 mb-4" style={{ background: "var(--gradient-gold)" }}>
            <Phone className="h-6 w-6 text-primary-foreground" />
          </div>
          <h2 className="text-2xl font-black uppercase">
            Ainda com dúvidas? <span className="text-primary">Fale com um Especialista</span>
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Deixe seus dados e um especialista entrará em contato IMEDIATAMENTE para te ajudar a garantir esse lote exclusivo.
          </p>
        </div>

        {submitted ? (
          <div className="mt-8 rounded-2xl border border-primary/40 bg-primary/5 p-6 text-center">
            <CheckCircle2 className="h-10 w-10 mx-auto text-primary" />
            <p className="mt-3 font-bold text-foreground">Acesso Exclusivo Liberado!</p>
            <p className="mt-1 text-sm text-muted-foreground">Um especialista entrará em contato pelo WhatsApp em instantes.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 grid gap-4" noValidate>
            <label className="block">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Nome Completo</span>
              <div className="relative mt-1">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Seu nome" className="w-full rounded-xl border border-border bg-card pl-10 pr-3 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
            </label>
            <label className="block">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">E-mail VIP</span>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Seu melhor e-mail" className="w-full rounded-xl border border-border bg-card pl-10 pr-3 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
            </label>
            <label className="block">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">WhatsApp</span>
              <div className="relative mt-1">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input type="tel" value={phone} onChange={(e) => setPhone(formatPhone(e.target.value))} required placeholder="(11) 99999-9999" className="w-full rounded-xl border border-border bg-card pl-10 pr-3 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
            </label>
            {error && <p className="text-sm font-semibold text-destructive text-center">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="mt-4 w-full shimmer-cta gradient-pan rounded-xl px-6 py-4 text-sm font-black uppercase tracking-wide text-primary-foreground transition-transform hover:scale-[1.02] disabled:opacity-60"
              style={{ background: "var(--gradient-gold)", boxShadow: "var(--shadow-gold)" }}
            >
              {loading ? "Garantindo..." : "Quero Falar com um Especialista Agora"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
