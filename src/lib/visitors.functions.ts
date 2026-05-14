import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const visitorSchema = z.object({
  cookies: z.string().max(4096).optional().nullable(),
  referrer: z.string().max(2048).optional().nullable(),
  page_url: z.string().max(2048).optional().nullable(),
  language: z.string().max(20).optional().nullable(),
  timezone: z.string().max(80).optional().nullable(),
  screen: z.string().max(80).optional().nullable(),
  platform: z.string().max(120).optional().nullable(),
  browser_data: z.record(z.string(), z.any()).optional().nullable(),
  geolocation: z.object({
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    accuracy: z.number().optional(),
  }).optional().nullable(),
});

export const trackVisitor = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => visitorSchema.parse(data))
  .handler(async ({ data }) => {
    const req = getRequest();
    const headers = req.headers;
    const ip =
      headers.get("cf-connecting-ip") ||
      headers.get("x-real-ip") ||
      headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      null;
    const userAgent = headers.get("user-agent") || null;

    const { error } = await supabaseAdmin.from("visitors").insert({
      ip_address: ip,
      user_agent: userAgent,
      cookies: data.cookies ?? null,
      referrer: data.referrer ?? null,
      page_url: data.page_url ?? null,
      language: data.language ?? null,
      timezone: data.timezone ?? null,
      screen: data.screen ?? null,
      platform: data.platform ?? null,
      browser_data: data.browser_data ?? null,
      geolocation: data.geolocation ?? null,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const getAllVisitors = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await supabaseAdmin
    .from("visitors")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1000);
  if (error) throw new Error(error.message);
  return { visitors: data ?? [] };
});