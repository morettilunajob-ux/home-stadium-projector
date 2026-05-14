import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const insertSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().min(10).max(20),
  source: z.string().max(50).optional(),
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

    const { error } = await supabaseAdmin.from("leads").insert({
      name: data.name,
      email: data.email,
      phone: data.phone,
      source: data.source ?? "landing",
      ip_address: ip,
      user_agent: userAgent,
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
