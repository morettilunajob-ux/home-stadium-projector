
ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS cpf TEXT,
  ADD COLUMN IF NOT EXISTS browser_data JSONB,
  ADD COLUMN IF NOT EXISTS referrer TEXT,
  ADD COLUMN IF NOT EXISTS page_url TEXT,
  ADD COLUMN IF NOT EXISTS language TEXT,
  ADD COLUMN IF NOT EXISTS timezone TEXT,
  ADD COLUMN IF NOT EXISTS screen TEXT,
  ADD COLUMN IF NOT EXISTS platform TEXT;

DROP POLICY IF EXISTS "Anyone can insert leads" ON public.leads;
CREATE POLICY "Anyone can insert leads" ON public.leads
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    char_length(name) >= 2 AND char_length(name) <= 100
    AND char_length(email) >= 5 AND char_length(email) <= 255
    AND char_length(phone) >= 8 AND char_length(phone) <= 30
  );
