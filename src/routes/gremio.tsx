import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getAllLeads } from "@/lib/leads.functions";

export const Route = createFileRoute("/gremio")({
  component: GremioPage,
  head: () => ({
    meta: [
      { title: "Grêmio — Leads" },
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

  useEffect(() => {
    getAllLeads()
      .then((res) => setLeads(res.leads as Lead[]))
      .catch((e) => setError(e?.message ?? "Erro ao carregar"));
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="mx-auto max-w-7xl">
        <header className="flex items-end justify-between mb-6 gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-black uppercase">Leads capturados</h1>
            <p className="text-sm text-muted-foreground">
              Total: {leads?.length ?? "—"}
            </p>
          </div>
          <button
            onClick={() => {
              setLeads(null);
              setError(null);
              getAllLeads()
                .then((res) => setLeads(res.leads as Lead[]))
                .catch((e) => setError(e?.message ?? "Erro"));
            }}
            className="rounded-lg border border-border px-4 py-2 text-sm font-semibold hover:bg-accent"
          >
            Recarregar
          </button>
        </header>

        {error && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive text-sm">
            {error}
          </div>
        )}

        {!leads && !error && (
          <p className="text-muted-foreground text-sm">Carregando...</p>
        )}

        {leads && leads.length === 0 && (
          <p className="text-muted-foreground text-sm">Nenhum lead ainda.</p>
        )}

        {leads && leads.length > 0 && (
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
      </div>
    </div>
  );
}
