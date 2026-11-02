-- 1. Tabela spraw kryminalnych (Cases)
CREATE TABLE IF NOT EXISTS public.cases (
    id VARCHAR(64) PRIMARY KEY,
    code VARCHAR(32) NOT NULL,
    title VARCHAR(256) NOT NULL,
    subtitle VARCHAR(512),
    required_rank VARCHAR(64) NOT NULL DEFAULT 'mlodszy_aspirant',
    starting_budget_hours INTEGER NOT NULL DEFAULT 80,
    ksip_queries_limit INTEGER NOT NULL DEFAULT 10,
    reward_points INTEGER NOT NULL DEFAULT 100,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Tabela zdigitalizowanych dokumentów akt (Documents)
CREATE TABLE IF NOT EXISTS public.documents (
    id VARCHAR(32) PRIMARY KEY, -- np. 'AKT-001'
    case_id VARCHAR(64) NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
    title VARCHAR(256) NOT NULL,
    doc_type VARCHAR(64) NOT NULL, -- protocol, billing, invoice, lab_opinion, order
    pages_count INTEGER NOT NULL DEFAULT 1,
    content_html TEXT NOT NULL,
    available_at_start BOOLEAN NOT NULL DEFAULT true,
    unlocked_by_action_id VARCHAR(32),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Tabela zdjęć kryminalistycznych (Case Photos)
CREATE TABLE IF NOT EXISTS public.case_photos (
    id VARCHAR(32) PRIMARY KEY, -- np. 'IMG-01'
    case_id VARCHAR(64) NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
    file_name VARCHAR(128) NOT NULL,
    title VARCHAR(256) NOT NULL,
    description TEXT NOT NULL,
    technician_notes TEXT,
    is_trap BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Tabela bazy KSIP (Krajowy System Informacji Policji)
CREATE TABLE IF NOT EXISTS public.ksip_records (
    id VARCHAR(32) PRIMARY KEY, -- np. 'K-01'
    category VARCHAR(64) NOT NULL, -- vehicle, person, phone, company
    search_query VARCHAR(128) NOT NULL,
    display_title VARCHAR(256) NOT NULL,
    record_data JSONB NOT NULL,
    is_meta_clue BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Tabela zleceń terenowych (Field Actions)
CREATE TABLE IF NOT EXISTS public.field_actions (
    id VARCHAR(32) PRIMARY KEY, -- np. 'Z-01'
    case_id VARCHAR(64) NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
    name VARCHAR(256) NOT NULL,
    cost_hours INTEGER NOT NULL,
    requires_superior_approval BOOLEAN NOT NULL DEFAULT false,
    result_document_ids TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Włączenie RLS dla tabel materiałów sprawy (odczyt dla zalogowanych)
ALTER TABLE public.cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ksip_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.field_actions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Wszyscy uwierzytelnieni mogą czytać sprawy"
    ON public.cases FOR SELECT TO authenticated USING (true);

CREATE POLICY "Wszyscy uwierzytelnieni mogą czytać dokumenty"
    ON public.documents FOR SELECT TO authenticated USING (true);

CREATE POLICY "Wszyscy uwierzytelnieni mogą czytać zdjęcia"
    ON public.case_photos FOR SELECT TO authenticated USING (true);

CREATE POLICY "Wszyscy uwierzytelnieni mogą przeszukiwać KSIP"
    ON public.ksip_records FOR SELECT TO authenticated USING (true);

CREATE POLICY "Wszyscy uwierzytelnieni mogą przeglądać zlecenia"
    ON public.field_actions FOR SELECT TO authenticated USING (true);
