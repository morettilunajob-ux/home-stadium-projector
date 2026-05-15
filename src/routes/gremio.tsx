import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getAllLeads } from "@/lib/leads.functions";
import { getAllVisitors } from "@/lib/visitors.functions";

export const Route = createFileRoute("/gremio")({
  component: GremioPage,
  head: () => ({
    meta: [
      { title: "Grêmio — Leads & Visitantes" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});

type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string;
  cpf: string | null;
  source: string | null;
  ip_address: string | null;
  user_agent: string | null;
  referrer: string | null;
  page_url: string | null;
  language: string | null;
  timezone: string | null;
  screen: string | null;
  platform: string | null;
  browser_data: Record<string, unknown> | null;
  created_at: string;
};

function GremioPage() {
  const [leads, setLeads] = useState<Lead[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [visitors, setVisitors] = useState<any[] | null>(null);
  const [tab, setTab] = useState<"leads" | "visitors">("visitors");

  useEffect(() => {
    getAllLeads()
      .then((res) => setLeads(res.leads as Lead[]))
      .catch((e) => setError(e?.message ?? "Erro ao carregar"));
    getAllVisitors()
      .then((res) => setVisitors(res.visitors))
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground p-6 relative">
      <div 
        className="absolute inset-0 z-0 opacity-10 pointer-events-none" 
        style={{ 
          backgroundImage: 'url("https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Gremio_logo.svg/1200px-Gremio_logo.svg.png")', 
          backgroundSize: '50%', 
          backgroundPosition: 'center', 
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed'
        }} 
      />
      <div className="mx-auto max-w-7xl relative z-10">
        <header className="flex items-end justify-between mb-6 gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-black uppercase">Painel de dados</h1>
            <p className="text-sm text-muted-foreground">
              Leads: {leads?.length ?? "—"} · Visitantes: {visitors?.length ?? "—"}
            </p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setTab("visitors")} className={`rounded-lg border px-4 py-2 text-sm font-semibold ${tab === "visitors" ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-accent"}`}>Visitantes</button>
            <button onClick={() => setTab("leads")} className={`rounded-lg border px-4 py-2 text-sm font-semibold ${tab === "leads" ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-accent"}`}>Leads</button>
            <button
              onClick={() => {
                setLeads(null); setVisitors(null); setError(null);
                getAllLeads().then((res) => setLeads(res.leads as Lead[])).catch((e) => setError(e?.message ?? "Erro"));
                getAllVisitors().then((res) => setVisitors(res.visitors)).catch(() => {});
              }}
              className="rounded-lg border border-border px-4 py-2 text-sm font-semibold hover:bg-accent"
            >
              Recarregar
            </button>
          </div>
        </header>

        {error && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive text-sm">
            {error}
          </div>
        )}

        {!leads && !error && (
          <p className="text-muted-foreground text-sm">Carregando...</p>
        )}

        {/* VISITORS TABLE */}
        {tab === "visitors" && visitors && visitors.length > 0 && (
          <div className="overflow-x-auto rounded-lg border border-border mb-8">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="text-left px-3 py-2">Data</th>
                  <th className="text-left px-3 py-2">IP</th>
                  <th className="text-left px-3 py-2">Localização</th>
                  <th className="text-left px-3 py-2">Cookies</th>
                  <th className="text-left px-3 py-2">Idioma</th>
                  <th className="text-left px-3 py-2">Fuso</th>
                  <th className="text-left px-3 py-2">Tela</th>
                  <th className="text-left px-3 py-2">Plataforma</th>
                  <th className="text-left px-3 py-2">Página</th>
                  <th className="text-left px-3 py-2">User-Agent</th>
                  <th className="text-left px-3 py-2">Browser data</th>
                </tr>
              </thead>
              <tbody>
                {visitors.map((v: any) => (
                  <tr key={v.id} className="border-t border-border align-top">
                    <td className="px-3 py-2 whitespace-nowrap text-muted-foreground">{new Date(v.created_at).toLocaleString("pt-BR")}</td>
                    <td className="px-3 py-2 font-mono text-xs">{v.ip_address ?? "—"}</td>
                    <td className="px-3 py-2 text-xs">{v.geolocation ? `${(v.geolocation as any).latitude?.toFixed(4)}, ${(v.geolocation as any).longitude?.toFixed(4)}` : "—"}</td>
                    <td className="px-3 py-2 text-xs max-w-[200px] truncate" title={v.cookies ?? ""}>{v.cookies || "—"}</td>
                    <td className="px-3 py-2 text-xs">{v.language ?? "—"}</td>
                    <td className="px-3 py-2 text-xs">{v.timezone ?? "—"}</td>
                    <td className="px-3 py-2 text-xs">{v.screen ?? "—"}</td>
                    <td className="px-3 py-2 text-xs">{v.platform ?? "—"}</td>
                    <td className="px-3 py-2 text-xs max-w-[200px] truncate" title={v.page_url ?? ""}>{v.page_url ?? "—"}</td>
                    <td className="px-3 py-2 text-xs text-muted-foreground max-w-[300px] truncate">{v.user_agent ?? "—"}</td>
                    <td className="px-3 py-2 text-xs max-w-[280px]">
                      <details>
                        <summary className="cursor-pointer text-primary">ver</summary>
                        <pre className="mt-2 whitespace-pre-wrap break-all text-[10px] bg-muted/40 p-2 rounded">{JSON.stringify(v.browser_data, null, 2)}</pre>
                      </details>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === "visitors" && visitors && visitors.length === 0 && (
          <p className="text-muted-foreground text-sm">Nenhum visitante capturado ainda.</p>
        )}

        {tab === "leads" && leads && leads.length > 0 && (
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="text-left px-3 py-2">Data</th>
                  <th className="text-left px-3 py-2">Nome</th>
                  <th className="text-left px-3 py-2">E-mail</th>
                  <th className="text-left px-3 py-2">Telefone</th>
                  <th className="text-left px-3 py-2">CPF</th>
                  <th className="text-left px-3 py-2">Origem</th>
                  <th className="text-left px-3 py-2">IP</th>
                  <th className="text-left px-3 py-2">Página</th>
                  <th className="text-left px-3 py-2">Referrer</th>
                  <th className="text-left px-3 py-2">Idioma</th>
                  <th className="text-left px-3 py-2">Fuso</th>
                  <th className="text-left px-3 py-2">Tela</th>
                  <th className="text-left px-3 py-2">Plataforma</th>
                  <th className="text-left px-3 py-2">User-Agent</th>
                  <th className="text-left px-3 py-2">Browser data</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((l) => (
                  <tr key={l.id} className="border-t border-border align-top">
                    <td className="px-3 py-2 whitespace-nowrap text-muted-foreground">
                      {new Date(l.created_at).toLocaleString("pt-BR")}
                    </td>
                    <td className="px-3 py-2 font-medium">{l.name}</td>
                    <td className="px-3 py-2">
                      <a
                        href={`mailto:${l.email}`}
                        className="text-primary hover:underline"
                      >
                        {l.email}
                      </a>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <a
                        href={`https://wa.me/55${l.phone}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary hover:underline"
                      >
                        {l.phone}
                      </a>
                    </td>
                    <td className="px-3 py-2 font-mono text-xs">{l.cpf ?? "—"}</td>
                    <td className="px-3 py-2 text-muted-foreground">
                      {l.source ?? "—"}
                    </td>
                    <td className="px-3 py-2 font-mono text-xs">
                      {l.ip_address ?? "—"}
                    </td>
                    <td className="px-3 py-2 text-xs max-w-[200px] truncate" title={l.page_url ?? ""}>{l.page_url ?? "—"}</td>
                    <td className="px-3 py-2 text-xs max-w-[200px] truncate" title={l.referrer ?? ""}>{l.referrer ?? "—"}</td>
                    <td className="px-3 py-2 text-xs">{l.language ?? "—"}</td>
                    <td className="px-3 py-2 text-xs">{l.timezone ?? "—"}</td>
                    <td className="px-3 py-2 text-xs">{l.screen ?? "—"}</td>
                    <td className="px-3 py-2 text-xs">{l.platform ?? "—"}</td>
                    <td className="px-3 py-2 text-xs text-muted-foreground max-w-[300px] truncate">
                      {l.user_agent ?? "—"}
                    </td>
                    <td className="px-3 py-2 text-xs max-w-[280px]">
                      <details>
                        <summary className="cursor-pointer text-primary">ver</summary>
                        <pre className="mt-2 whitespace-pre-wrap break-all text-[10px] bg-muted/40 p-2 rounded">
{JSON.stringify(l.browser_data, null, 2)}
                        </pre>
                      </details>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === "leads" && leads && leads.length === 0 && (
          <p className="text-muted-foreground text-sm">Nenhum lead ainda.</p>
        )}
      </div>
    </div>
  );
}
