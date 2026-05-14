CREATE TABLE public.visitors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ip_address TEXT,
  user_agent TEXT,
  cookies TEXT,
  referrer TEXT,
  page_url TEXT,
  language TEXT,
  timezone TEXT,
  screen TEXT,
  platform TEXT,
  browser_data JSONB,
  geolocation JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.visitors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert visitors"
ON public.visitors
FOR INSERT
TO anon, authenticated
WITH CHECK (true);