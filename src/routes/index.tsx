import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import heroImg from "@/assets/projetor.png";
import { Check, Flame, Package, ShieldCheck, Zap, Tv, Sparkles, Users, Film, ShoppingCart, RotateCcw, Truck, BadgeCheck, Monitor, Sun, Maximize, Volume2, Cable, Lightbulb, User, Mail, Phone, CheckCircle2 } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { buildCheckoutUrl, trackClick, type ProductId } from "@/lib/tracking";
import { submitLead } from "@/lib/leads.functions";

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

const PRICES: Record<ProductId, number> = {
  projetor: 297,
};

const URLS: Record<ProductId, string> = {
  projetor: CHECKOUT_URL,
};

function ctaProps(product: ProductId, source: string) {
  return {
    href: buildCheckoutUrl(URLS[product], { product, price: PRICES[product], source }),
    target: "_blank" as const,
    rel: "noopener",
    onClick: (e: React.MouseEvent<HTMLAnchorElement>) => {
      trackClick({ product, price: PRICES[product], source });
      // Scroll suave até o bloco do projetor antes de abrir o checkout
      const target = document.getElementById("projetor-specs");
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        const url = e.currentTarget.href;
        window.setTimeout(() => window.open(url, "_blank", "noopener"), 700);
      }
    },
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
            <img src={heroImg} alt="Mini projetor ArenaBox Pro" width={1024} height={1024} className="relative mx-auto w-full max-w-md product-glow" />
          </div>

          {/* Bloco persuasivo abaixo do projetor */}
          <div className="mt-10 mx-auto max-w-3xl">
            <p className="text-2xl md:text-3xl font-black uppercase leading-tight">
              Não é só pra Copa. <span className="text-primary">Dura o ano inteiro.</span>
            </p>
            <p className="mt-4 text-lg md:text-xl text-foreground/90 leading-relaxed">
              Imagine assistir <span className="text-primary font-semibold">UFC, Brasileirão, Libertadores e Champions League</span> em tela gigante, do seu sofá, com seus amigos gritando cada gol e cada nocaute como se fosse no estádio.
            </p>
            <p className="mt-4 text-lg md:text-xl text-foreground/90 leading-relaxed">
              Imagine transformar sua sala em um <span className="text-primary font-semibold">cinema particular</span> — filmes, séries e maratonas com a família, sem pagar ingresso, sem sair de casa, todo dia.
            </p>
            <p className="mt-6 text-base md:text-lg text-muted-foreground italic">
              Enquanto você pensa, outras pessoas já estão garantindo o delas. <span className="text-primary not-italic font-semibold">Não fique de fora.</span>
            </p>
          </div>

          <div className="mt-8 flex flex-col items-center gap-2">
            <p className="text-3xl md:text-4xl font-bold">12x disponível</p>
            <p className="text-xl text-muted-foreground">ou <span className="text-primary font-semibold">R$297</span> à vista</p>
            <p className="text-sm text-muted-foreground">frete calculado no checkout (aprox. R$316,90 total)</p>
          </div>

          <a id="produto-projetor" {...ctaProps("projetor", "hero")} className="scroll-mt-24 mt-8 inline-flex items-center justify-center w-full max-w-md rounded-xl px-8 py-5 text-lg font-bold uppercase tracking-wide text-primary-foreground transition-transform hover:scale-[1.02]" style={{ background: "var(--gradient-gold)", boxShadow: "var(--shadow-gold)" }}>
            Quero meu ArenaBox Pro
          </a>

          <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5"><Package className="h-4 w-4" /> Envio rápido para todo o Brasil</span>
            <span className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4" /> Compra segura e protegida</span>
            <span className="flex items-center gap-1.5"><Zap className="h-4 w-4" /> Estoque limitado da Copa</span>
          </div>
        </div>
      </section>

      {/* ESPECIFICAÇÕES DO PROJETOR */}
      <section id="projetor-specs" className="scroll-mt-24 py-24 px-6 bg-card/50">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary">
              <Sparkles className="h-3.5 w-3.5" /> Mini Projetor YG-300
            </span>
            <h2 className="mt-6 text-4xl md:text-5xl font-black uppercase">
              Conheça o <span className="text-primary">ArenaBox Pro</span>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Mini projetor portátil LED com suporte a 1080p, 600 lúmens e entradas HDMI, USB, AV e cartão TF. Perfeito para casa, trabalho ou estudo.
            </p>
          </div>

          <div className="mt-14 grid lg:grid-cols-2 gap-10 items-center">
            <div className="relative rounded-3xl border-2 border-primary/40 bg-gradient-to-br from-primary/10 via-card to-card p-8 md:p-12 flex items-center justify-center" style={{ boxShadow: "var(--shadow-glow)" }}>
              <img src={heroImg} alt="Mini projetor ArenaBox Pro em destaque" width={1024} height={1024} loading="lazy" className="w-full max-w-md product-glow" />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { icon: Maximize, title: "Tela 24\" a 60\"", text: "Distância de projeção ajustável de 1,5 a 2 metros para o tamanho ideal." },
                { icon: Sun, title: "600 lúmens · 800:1", text: "Imagem nítida em ambientes escuros ou com pouca luminosidade." },
                { icon: Monitor, title: "Suporte a 1080p", text: "Resolução nativa 240×320 com suporte de entrada até 1920×1080." },
                { icon: Cable, title: "HDMI · USB · AV · TF", text: "Conecte notebook, videogame, TV box, pendrive ou cartão de memória." },
                { icon: Volume2, title: "Alto-falante embutido", text: "Áudio integrado e ruído baixíssimo de apenas 24 dB em operação." },
                { icon: Lightbulb, title: "LED · 30.000 horas", text: "Lâmpada LED de longa duração e baixíssima necessidade de manutenção." },
              ].map(({ icon: Icon, title, text }, i) => (
                <div key={i} className="rounded-2xl border border-border bg-background p-5">
                  <div className="inline-flex rounded-lg p-2" style={{ background: "var(--gradient-gold)" }}>
                    <Icon className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <h3 className="mt-3 font-black uppercase text-base">{title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* DESCRIÇÃO + ESPECIFICAÇÕES COMPLETAS + ITENS INCLUSOS */}
          <div className="mt-16 grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 rounded-2xl border border-border bg-background p-6 md:p-8">
              <h3 className="text-2xl font-black uppercase">Sobre o produto</h3>
              <div className="mt-4 space-y-4 text-foreground/90 leading-relaxed">
                <p>O <strong>Mini Projetor Portátil LED 1080p 600 Lumens HDMI YG300</strong> é compacto e portátil, com tecnologia de iluminação LED para projetar imagens em alta definição. Reproduz vídeos e imagens com qualidade nítida e detalhada.</p>
                <p>Possui saída <strong>HDMI</strong> e suporte a <strong>AV, USB e cartão de memória</strong> — conecte laptops, tablets, consoles de videogame, TV box e reprodutores de mídia de forma prática.</p>
                <p>Com <strong>600 lúmens</strong> de brilho, é ideal para ambientes escuros ou com pouca luz. Funciona em casa para filmes, séries e jogos, e também em apresentações de negócios ou aulas.</p>
                <p>Tamanho compacto que cabe em qualquer mochila e lâmpada LED com vida útil de até <strong>30.000 horas</strong> — longa duração e baixa manutenção.</p>
              </div>

              <h4 className="mt-8 text-xl font-black uppercase text-primary">Benefícios</h4>
              <ul className="mt-4 grid sm:grid-cols-2 gap-2.5">
                {[
                  "Tamanho compacto e portátil, fácil de transportar",
                  "Imagem nítida, comparável a um projetor grande",
                  "Suporte a vídeo 1080p para filmes e jogos em HD",
                  "Vida útil de 30.000 horas do LED",
                  "Compatível com diversos formatos de mídia",
                  "Distância de projeção ajustável conforme a necessidade",
                ].map((b, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-foreground/90">
                    <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>

              <h4 className="mt-8 text-xl font-black uppercase text-primary">Especificações técnicas</h4>
              <dl className="mt-4 grid sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                {[
                  ["Modelo", "YG-300"],
                  ["Tipo de exibição", "LCD"],
                  ["Resolução original", "240×320"],
                  ["Resolução suportada", "1920×1080"],
                  ["Brilho", "600 lúmens"],
                  ["Contraste", "800:1"],
                  ["Distância de projeção", "1,5 – 2 m"],
                  ["Tamanho da projeção", "24 – 60 polegadas"],
                  ["Interfaces", "HDMI, USB, áudio 3.5mm, cartão TF"],
                  ["Certificações", "CE, ROHS, FCC"],
                  ["Lâmpada", "LED"],
                  ["Vida útil do LED", "30.000 horas"],
                  ["Formatos de imagem", "BMP, PNG, JPEG"],
                  ["Formatos de vídeo", "MP4, RMVB, AVI, RM, MKV e outros"],
                  ["Formatos de áudio", "MP3, WMA, OGG, AAC, FLAC, APE, WAV"],
                  ["Entrada de tensão", "100–240 V · 50/60 Hz · 2.0A"],
                  ["Potência de saída", "12V · 1.5A"],
                  ["Alto-falante embutido", "Sim"],
                  ["Ruído", "24 dB"],
                  ["Material da carcaça", "ABS"],
                  ["Tamanho do produto", "12,5 × 8,5 × 4,5 cm"],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-3 border-b border-border/60 py-1.5">
                    <dt className="text-muted-foreground">{k}</dt>
                    <dd className="font-medium text-right">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="space-y-6">
              <div className="rounded-2xl border-2 border-primary/40 bg-background p-6" style={{ boxShadow: "var(--shadow-glow)" }}>
                <div className="inline-flex rounded-lg p-2" style={{ background: "var(--gradient-gold)" }}>
                  <Package className="h-5 w-5 text-primary-foreground" />
                </div>
                <h3 className="mt-3 text-xl font-black uppercase">Itens inclusos</h3>
                <ul className="mt-4 space-y-2.5 text-sm">
                  {[
                    "1× Mini Projetor Portátil LED 1080p 600 Lumens",
                    "1× Cabo P2 × AV Fêmea",
                    "1× Manual do usuário",
                    "1× Fonte de alimentação",
                    "1× Controle remoto",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-border bg-background p-6">
                <div className="inline-flex rounded-lg p-2" style={{ background: "var(--gradient-gold)" }}>
                  <BadgeCheck className="h-5 w-5 text-primary-foreground" />
                </div>
                <h3 className="mt-3 text-lg font-black uppercase">Testado antes do envio</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Todos os produtos são testados</strong> antes do envio para garantir que cheguem funcionando perfeitamente.
                </p>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                  Qualquer dúvida, entre em contato. Respondemos o mais rápido possível em <span className="text-primary font-semibold">horário comercial</span>.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <a {...ctaProps("projetor", "specs")} className="inline-flex items-center justify-center gap-2 rounded-xl px-8 py-5 text-lg font-black uppercase tracking-wide text-primary-foreground transition-transform hover:scale-[1.02]" style={{ background: "var(--gradient-gold)", boxShadow: "var(--shadow-gold)" }}>
              <ShoppingCart className="h-5 w-5" /> Quero meu ArenaBox Pro
            </a>
            <p className="mt-3 text-sm text-muted-foreground">12x disponível • R$297 à vista</p>
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
        <div className="mx-auto max-w-5xl mb-20">
          <div className="rounded-3xl border-2 border-primary/40 bg-card p-8 md:p-12" style={{ boxShadow: "var(--shadow-glow)" }}>
            <div className="flex flex-col items-center text-center">
              <div className="rounded-full p-4" style={{ background: "var(--gradient-gold)" }}>
                <ShieldCheck className="h-10 w-10 text-primary-foreground" />
              </div>
              <h2 className="mt-6 text-3xl md:text-5xl font-black uppercase">
                Garantia de <span className="text-primary">risco zero</span>
              </h2>
              <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl">
                Você compra com tranquilidade. Se não amar o ArenaBox Pro, devolvemos <span className="text-primary font-semibold">100% do seu dinheiro</span>. Sem perguntas, sem burocracia.
              </p>
            </div>

            <div className="mt-10 grid md:grid-cols-3 gap-5">
              <div className="rounded-2xl border border-border bg-background p-6 text-center">
                <BadgeCheck className="h-8 w-8 text-primary mx-auto" />
                <h3 className="mt-3 font-black uppercase">7 dias para testar</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Direito de arrependimento garantido por lei (Art. 49 CDC). Devolva em até 7 dias após o recebimento.
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-background p-6 text-center">
                <RotateCcw className="h-8 w-8 text-primary mx-auto" />
                <h3 className="mt-3 font-black uppercase">Troca em 30 dias</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Defeito de fábrica? Trocamos sem custo em até 30 dias. Você não corre nenhum risco.
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-background p-6 text-center">
                <Truck className="h-8 w-8 text-primary mx-auto" />
                <h3 className="mt-3 font-black uppercase">Reembolso total</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Se mudar de ideia, devolvemos cada centavo na mesma forma de pagamento. Simples assim.
                </p>
              </div>
            </div>

            <p className="mt-8 text-center text-base text-foreground/90">
              <span className="text-primary font-semibold">O risco é todo nosso.</span> Você só precisa testar e se apaixonar.
            </p>
          </div>
        </div>

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
      <LeadForm />

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
    if (digits.length <= 10)
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }

  function formatCpf(v: string) {
    const d = v.replace(/\D/g, "").slice(0, 11);
    if (d.length <= 3) return d;
    if (d.length <= 6) return `${d.slice(0,3)}.${d.slice(3)}`;
    if (d.length <= 9) return `${d.slice(0,3)}.${d.slice(3,6)}.${d.slice(6)}`;
    return `${d.slice(0,3)}.${d.slice(3,6)}.${d.slice(6,9)}-${d.slice(9)}`;
  }

  function collectBrowserData() {
    if (typeof window === "undefined") return {};
    const n = window.navigator as Navigator & {
      userAgentData?: { brands?: unknown; mobile?: boolean; platform?: string };
      deviceMemory?: number;
      connection?: { effectiveType?: string; downlink?: number; rtt?: number };
    };
    const s = window.screen;
    return {
      user_agent: n.userAgent,
      languages: n.languages,
      platform: n.platform,
      vendor: n.vendor,
      hardware_concurrency: n.hardwareConcurrency,
      device_memory: n.deviceMemory,
      max_touch_points: n.maxTouchPoints,
      cookie_enabled: n.cookieEnabled,
      do_not_track: n.doNotTrack,
      online: n.onLine,
      user_agent_data: n.userAgentData
        ? { brands: n.userAgentData.brands, mobile: n.userAgentData.mobile, platform: n.userAgentData.platform }
        : null,
      connection: n.connection
        ? { effective_type: n.connection.effectiveType, downlink: n.connection.downlink, rtt: n.connection.rtt }
        : null,
      screen: { w: s.width, h: s.height, avail_w: s.availWidth, avail_h: s.availHeight, color_depth: s.colorDepth, pixel_depth: s.pixelDepth },
      viewport: { w: window.innerWidth, h: window.innerHeight, dpr: window.devicePixelRatio },
      timezone_offset_min: new Date().getTimezoneOffset(),
      history_length: window.history.length,
      session_storage: typeof window.sessionStorage !== "undefined",
      local_storage: typeof window.localStorage !== "undefined",
    };
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const phoneDigits = phone.replace(/\D/g, "");
    const cpfDigits = cpf.replace(/\D/g, "");

    if (trimmedName.length < 2 || trimmedName.length > 100) {
      setError("Informe um nome válido.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail) || trimmedEmail.length > 255) {
      setError("Informe um e-mail válido.");
      return;
    }
    if (phoneDigits.length < 10 || phoneDigits.length > 11) {
      setError("Informe um telefone com DDD.");
      return;
    }

    setLoading(true);
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      await submitLead({
        data: {
          name: trimmedName,
          email: trimmedEmail,
          phone: phoneDigits,
          cpf: cpfDigits || null,
          source: "landing",
          referrer: typeof document !== "undefined" ? document.referrer : null,
          page_url: typeof window !== "undefined" ? window.location.href : null,
          language: typeof navigator !== "undefined" ? navigator.language : null,
          timezone: tz,
          screen: typeof window !== "undefined" ? `${window.screen.width}x${window.screen.height}@${window.devicePixelRatio}` : null,
          platform: typeof navigator !== "undefined" ? navigator.platform : null,
          browser_data: collectBrowserData(),
        },
      });
      setSubmitted(true);
    } catch (err) {
      console.error("[lead] insert failed", err);
      setError("Não foi possível enviar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="py-20 px-6 bg-background border-t border-border">
      <div className="mx-auto max-w-2xl">
        <div className="text-center">
          <Sparkles className="h-10 w-10 mx-auto text-primary" />
          <h2 className="mt-4 text-3xl md:text-4xl font-black uppercase">
            Garanta sua <span className="text-primary">condição especial</span>
          </h2>
          <p className="mt-3 text-muted-foreground">
            Deixe seus dados e receba o link com o desconto exclusivo da Copa.
          </p>
        </div>

        {submitted ? (
          <div className="mt-8 rounded-xl border border-primary/40 bg-primary/5 p-6 text-center">
            <CheckCircle2 className="h-10 w-10 mx-auto text-primary" />
            <p className="mt-3 font-bold text-foreground">Recebemos seus dados!</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Em instantes você receberá o contato com a oferta.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 grid gap-4" noValidate>
            <label className="block">
              <span className="text-sm font-semibold text-foreground">Nome</span>
              <div className="relative mt-1">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={100}
                  required
                  placeholder="Seu nome completo"
                  className="w-full rounded-lg border border-border bg-card pl-10 pr-3 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-foreground">E-mail</span>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  maxLength={255}
                  required
                  placeholder="voce@email.com"
                  className="w-full rounded-lg border border-border bg-card pl-10 pr-3 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-foreground">Telefone (WhatsApp)</span>
              <div className="relative mt-1">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="tel"
                  inputMode="numeric"
                  value={phone}
                  onChange={(e) => setPhone(formatPhone(e.target.value))}
                  required
                  placeholder="(11) 99999-9999"
                  className="w-full rounded-lg border border-border bg-card pl-10 pr-3 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-foreground">CPF</span>
              <div className="relative mt-1">
                <BadgeCheck className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  inputMode="numeric"
                  value={cpf}
                  onChange={(e) => setCpf(formatCpf(e.target.value))}
                  placeholder="000.000.000-00"
                  className="w-full rounded-lg border border-border bg-card pl-10 pr-3 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </label>

            {error && (
              <p className="text-sm font-semibold text-destructive">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 inline-flex items-center justify-center rounded-xl px-8 py-5 text-base font-black uppercase tracking-wide text-primary-foreground transition-transform hover:scale-[1.02] disabled:opacity-60"
              style={{ background: "var(--gradient-gold)", boxShadow: "var(--shadow-gold)" }}
            >
              {loading ? "Enviando..." : "Quero minha oferta"}
            </button>

            <p className="text-center text-xs text-muted-foreground">
              Seus dados são usados apenas para enviar a oferta. Sem spam.
            </p>
          </form>
        )}
      </div>
    </section>
  );
}

