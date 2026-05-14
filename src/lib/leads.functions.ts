import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const insertSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().min(8).max(30),
  cpf: z.string().trim().max(20).optional().nullable(),
  source: z.string().max(50).optional(),
  referrer: z.string().max(2048).optional().nullable(),
  page_url: z.string().max(2048).optional().nullable(),
  language: z.string().max(20).optional().nullable(),
  timezone: z.string().max(80).optional().nullable(),
  screen: z.string().max(80).optional().nullable(),
  platform: z.string().max(120).optional().nullable(),
  browser_data: z.record(z.string(), z.any()).optional().nullable(),
});

export const submitLead = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => insertSchema.parse(data))
  .handler(async ({ data }) => {
    const req = getRequest();
    const headers = req.headers;
    const ip =
      headers.get("cf-connecting-ip") ||
      headers.get("x-real-ip") ||
      headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      null;
    const userAgent = headers.get("user-agent") || null;

    const acceptLanguage = headers.get("accept-language");
    const browserData = {
      ...(data.browser_data ?? {}),
      accept_language: acceptLanguage,
    };
    const { error } = await supabaseAdmin.from("leads").insert({
      name: data.name,
      email: data.email,
      phone: data.phone,
      cpf: data.cpf ?? null,
      source: data.source ?? "landing",
      ip_address: ip,
      user_agent: userAgent,
      referrer: data.referrer ?? null,
      page_url: data.page_url ?? null,
      language: data.language ?? null,
      timezone: data.timezone ?? null,
      screen: data.screen ?? null,
      platform: data.platform ?? null,
      browser_data: browserData,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const getAllLeads = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await supabaseAdmin
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1000);
  if (error) throw new Error(error.message);
  return { leads: data ?? [] };
});
