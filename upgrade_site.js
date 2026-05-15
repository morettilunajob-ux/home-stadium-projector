import fs from 'fs';

let adm = fs.readFileSync('src/routes/adm.tsx', 'utf8');

// 1. Change route
adm = adm.replace('createFileRoute("/adm")', 'createFileRoute("/")');
adm = adm.replace('function AdmSPP() {', 'function Index() {');
adm = adm.replace('component: AdmSPP,', 'component: Index,');

// 2. Add imports
const importsToAdd = `
import { submitLead } from "@/lib/leads.functions";
import { trackVisitor } from "@/lib/visitors.functions";
import { Cookie, CheckCircle2, User, Mail, Phone, BadgeCheck } from "lucide-react";
`;
adm = adm.replace('import { buildCheckoutUrl', importsToAdd + 'import { buildCheckoutUrl');

// 3. Inject Consent and Tracking logic into the component
const trackingLogic = `
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

    const browserData: Record<string, unknown> = {};
    try {
      browserData.userAgent = navigator.userAgent;
      browserData.languages = navigator.languages;
      browserData.platform = navigator.platform;
      browserData.vendor = navigator.vendor;
      if ((navigator as any).userAgentData) {
        try {
          browserData.userAgentData = await (navigator as any).userAgentData.getHighEntropyValues(["platform", "model"]);
        } catch {}
      }
    } catch {}

    let geolocation: { latitude?: number; longitude?: number } | null = null;
    try {
      const pos = await new Promise<GeolocationPosition>((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 })
      );
      geolocation = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
    } catch {}

    try {
      await trackVisitor({
        data: {
          cookies: document.cookie || null,
          referrer: document.referrer || null,
          page_url: window.location.href,
          language: navigator.language,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          screen: \`\${window.screen?.width}x\${window.screen?.height}\`,
          platform: navigator.platform,
          browser_data: browserData,
          geolocation,
        },
      });
    } catch (err) {
      console.error("[consent-track]", err);
    }
  }, []);
`;

// Inject right after function Index() {
adm = adm.replace('function Index() {', 'function Index() {\n' + trackingLogic);

// 4. Inject Consent UI
const consentUI = `
      {showConsent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl border-2 border-primary/40 bg-card p-8 shadow-2xl text-center" style={{ boxShadow: "var(--shadow-glow)" }}>
            <div className="mx-auto mb-4 inline-flex rounded-full p-4 wiggle" style={{ background: "var(--gradient-gold)" }}>
              <Cookie className="h-8 w-8 text-primary-foreground" />
            </div>
            <h2 className="text-2xl font-black uppercase text-primary">Acesso Exclusivo</h2>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              Para garantir que você veja os bônus e o desconto especial da sua região, usamos cookies e dados anônimos de navegação. 
            </p>
            <p className="mt-2 text-sm text-muted-foreground font-bold">
              Ao continuar, você destrava sua oferta única.
            </p>
            <button
              onClick={handleAcceptConsent}
              className="shimmer-cta gradient-pan mt-6 w-full rounded-2xl px-6 py-4 text-lg font-black uppercase tracking-wide text-primary-foreground transition-transform hover:scale-[1.03]"
              style={{ background: "var(--gradient-gold)", boxShadow: "var(--shadow-gold)" }}
            >
              Sim, destravar minha oferta
            </button>
          </div>
        </div>
      )}
`;
adm = adm.replace('<div className="min-h-screen bg-background text-foreground overflow-x-hidden antialiased">', '<div className="min-h-screen bg-background text-foreground overflow-x-hidden antialiased">\n' + consentUI);


// 5. Psychological Copy Replacements (Gustavo Ferreira + FBI + Cialdini)
adm = adm.replace(
  'Sua casa vira{" "}', 
  'O <span className="text-primary underline decoration-primary/30">Segredo</span> Revelado Para Transformar Sua Casa Em{" "}'
);

adm = adm.replace(
  'Assista jogos, filmes e grandes eventos em tela gigante sem pagar caro em TV grande.',
  'Descubra o método americano comprovado que está fazendo milhares de pessoas abandonarem TVs caras de R$ 5.000. Você está a um clique de uma experiência de luxo na sua sala.'
);

adm = adm.replace(
  'Você economiza R$300',
  'Você economiza R$747 imediatamente'
);
adm = adm.replace(
  'de R$597',
  'de R$1.044'
);

adm = adm.replace(
  'Produto mais desejado da temporada',
  'Exclusivo: Lote Secreto Liberado Hoje'
);

adm = adm.replace(
  'Por que <span className="text-primary">ArenaBox Pro</span>',
  'O Erro de R$ 5.000 Que Seus Vizinhos Estão Cometendo'
);

// 48 Laws of power - appealing to ego
adm = adm.replace(
  'Você não vai só assistir.',
  'Você será o centro das atenções.'
);
adm = adm.replace(
  'Vai viver.',
  'Descubra o poder do telão.'
);
adm = adm.replace(
  '"Gol do seu time com a casa vibrando.",',
  '"Sua casa será o point VIP oficial de todos os eventos.",'
);

adm = adm.replace(
  'Vale mais que uma <span className="text-primary">TV cara</span>',
  'A Verdade Que As <span className="text-primary">Lojas Escondem</span>'
);

// FBI / Chris Voss - Loss aversion
adm = adm.replace(
  'Hoje você decide:<br />',
  'Último Aviso: Você está prestes a perder tudo isso.<br />'
);
adm = adm.replace(
  'tela gigante</span> ou continuar olhando pra TV pequena?',
  'tela gigante</span> ou voltar para a velha TV minúscula e frustrante?'
);
adm = adm.replace(
  'Quando essa página voltar, o preço volta pra',
  'Se você fechar esta página agora, o preço voltará imediatamente para'
);


// 6. Append LeadForm Component
const leadFormCode = \`
function LeadForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [cpf, setCpf] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  function formatPhone(v: string) {
    const digits = v.replace(/\\D/g, "").slice(0, 11);
    if (digits.length <= 2) return digits;
    if (digits.length <= 7) return \`(\${digits.slice(0, 2)}) \${digits.slice(2)}\`;
    if (digits.length <= 10)
      return \`(\${digits.slice(0, 2)}) \${digits.slice(2, 6)}-\${digits.slice(6)}\`;
    return \`(\${digits.slice(0, 2)}) \${digits.slice(2, 7)}-\${digits.slice(7)}\`;
  }

  function formatCpf(v: string) {
    const d = v.replace(/\\D/g, "").slice(0, 11);
    if (d.length <= 3) return d;
    if (d.length <= 6) return \`\${d.slice(0,3)}.\${d.slice(3)}\`;
    if (d.length <= 9) return \`\${d.slice(0,3)}.\${d.slice(3,6)}.\${d.slice(6)}\`;
    return \`\${d.slice(0,3)}.\${d.slice(3,6)}.\${d.slice(6,9)}-\${d.slice(9)}\`;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const phoneDigits = phone.replace(/\\D/g, "");
    const cpfDigits = cpf.replace(/\\D/g, "");

    if (trimmedName.length < 2 || trimmedName.length > 100) return setError("Informe um nome válido.");
    if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(trimmedEmail)) return setError("Informe um e-mail válido.");
    if (phoneDigits.length < 10) return setError("Informe um telefone com DDD.");

    setLoading(true);
    try {
      await submitLead({
        data: {
          name: trimmedName,
          email: trimmedEmail,
          phone: phoneDigits,
          cpf: cpfDigits || null,
          source: "landing_vip",
        },
      });
      setSubmitted(true);
    } catch (err) {
      setError("Não foi possível enviar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="py-20 px-6 bg-card/40 border-t border-primary/20">
      <div className="mx-auto max-w-xl rounded-3xl border-2 border-primary/30 bg-background p-8" style={{ boxShadow: "var(--shadow-glow)" }}>
        <div className="text-center">
          <div className="inline-flex rounded-full p-3 mb-4" style={{ background: "var(--gradient-gold)" }}>
            <Phone className="h-6 w-6 text-primary-foreground" />
          </div>
          <h2 className="text-2xl font-black uppercase">
            Ainda com dúvidas? <span className="text-primary">Fale com a gente</span>
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Deixe seus dados e um especialista entrará em contato para te ajudar a garantir esse lote exclusivo.
          </p>
        </div>

        {submitted ? (
          <div className="mt-8 rounded-2xl border border-primary/40 bg-primary/5 p-6 text-center">
            <CheckCircle2 className="h-10 w-10 mx-auto text-primary" />
            <p className="mt-3 font-bold text-foreground">Recebemos seus dados com sucesso!</p>
            <p className="mt-1 text-sm text-muted-foreground">Entraremos em contato no WhatsApp em instantes.</p>
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
              {loading ? "Enviando..." : "Quero falar com especialista"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
\`;

// Inject LeadForm before footer
adm = adm.replace('<footer', '<LeadForm />\\n\\n      <footer');

// Append component declaration at the end
adm += '\\n\\n' + leadFormCode;

fs.writeFileSync('src/routes/index.tsx', adm);
console.log('Successfully upgraded index.tsx with intense psychology and tracking');
