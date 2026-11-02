-- 1. Tabela schowka dowodowego gracza (Evidence Items)
CREATE TABLE IF NOT EXISTS public.evidence_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES public.game_sessions(id) ON DELETE CASCADE,
    case_id VARCHAR(64) NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
    document_id VARCHAR(32) NOT NULL,
    evidence_type VARCHAR(64) NOT NULL, -- document_quote, ksip_record, case_photo, physical_item
    quote_text TEXT NOT NULL,
    color VARCHAR(32) NOT NULL DEFAULT 'yellow', -- yellow, red, blue, neutral
    source_title VARCHAR(256) NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Tabela wniosków o tymczasowy areszt (Warrants)
CREATE TABLE IF NOT EXISTS public.warrants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES public.game_sessions(id) ON DELETE CASCADE,
    case_id VARCHAR(64) NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
    suspect_name VARCHAR(128) NOT NULL,
    alibi_evidence_ids UUID[] NOT NULL DEFAULT '{}',
    presence_evidence_ids UUID[] NOT NULL DEFAULT '{}',
    material_trace_evidence_ids UUID[] NOT NULL DEFAULT '{}',
    motive_evidence_ids UUID[] NOT NULL DEFAULT '{}',
    status VARCHAR(32) NOT NULL DEFAULT 'draft', -- draft, submitted, approved, rejected
    submitted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Tabela ocen prokuratorskich (Warrant Evaluations)
CREATE TABLE IF NOT EXISTS public.warrant_evaluations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    warrant_id UUID NOT NULL REFERENCES public.warrants(id) ON DELETE CASCADE,
    is_approved BOOLEAN NOT NULL,
    decision_type VARCHAR(64) NOT NULL,
    justification_text TEXT NOT NULL,
    feedback_by_requirement JSONB NOT NULL,
    penalty_budget_hours INTEGER NOT NULL DEFAULT 0,
    penalty_points INTEGER NOT NULL DEFAULT 0,
    reward_points INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Tabela audytu zapytań KSIP (limit zapytań)
CREATE TABLE IF NOT EXISTS public.ksip_audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES public.game_sessions(id) ON DELETE CASCADE,
    query_text VARCHAR(128) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS
ALTER TABLE public.evidence_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.warrants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.warrant_evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ksip_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Użytkownik widzi dowody ze swoich sesji"
    ON public.evidence_items FOR ALL
    USING (
        session_id IN (SELECT id FROM public.game_sessions WHERE user_id = auth.uid())
    );

CREATE POLICY "Użytkownik zarządza swoimi wnioskami"
    ON public.warrants FOR ALL
    USING (
        session_id IN (SELECT id FROM public.game_sessions WHERE user_id = auth.uid())
    );

CREATE POLICY "Użytkownik widzi oceny swoich wniosków"
    ON public.warrant_evaluations FOR SELECT
    USING (
        warrant_id IN (
            SELECT w.id FROM public.warrants w
            JOIN public.game_sessions s ON w.session_id = s.id
            WHERE s.user_id = auth.uid()
        )
    );

CREATE POLICY "Użytkownik rejestruje zapytania KSIP"
    ON public.ksip_audit_log FOR ALL
    USING (
        session_id IN (SELECT id FROM public.game_sessions WHERE user_id = auth.uid())
    );
