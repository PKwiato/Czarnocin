-- 1. Tabela profili funkcjonariuszy powiązana z auth.users
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    badge_number VARCHAR(32) NOT NULL DEFAULT 'CZ 20412/02',
    full_name VARCHAR(128) NOT NULL DEFAULT 'Marek Zawada',
    rank VARCHAR(64) NOT NULL DEFAULT 'mlodszy_aspirant',
    service_points INTEGER NOT NULL DEFAULT 0,
    department VARCHAR(128) NOT NULL DEFAULT 'KMP Czarnocin, Wydział Kryminalny',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Włączenie RLS dla profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Użytkownik widzi tylko swój profil"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Użytkownik może edytować swój profil"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- 2. Tabela sesji rozgrywki (Game Sessions)
CREATE TABLE IF NOT EXISTS public.game_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    active_case_id VARCHAR(64) NOT NULL DEFAULT 'case-01',
    virtual_time TIMESTAMPTZ NOT NULL DEFAULT '2002-03-14 08:00:00+01',
    investigation_budget_hours INTEGER NOT NULL DEFAULT 80,
    ksip_queries_used INTEGER NOT NULL DEFAULT 0,
    status VARCHAR(32) NOT NULL DEFAULT 'in_progress',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Włączenie RLS dla game_sessions
ALTER TABLE public.game_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Użytkownik zarządza swoimi sesjami"
    ON public.game_sessions FOR ALL
    USING (auth.uid() = user_id);

-- Automatyczny trigger tworzenia profilu przy rejestracji w Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, badge_number, full_name, rank, service_points, department)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'badge_number', 'CZ 20412/02'),
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'Marek Zawada'),
        'mlodszy_aspirant',
        0,
        'KMP Czarnocin, Wydział Kryminalny'
    );

    INSERT INTO public.game_sessions (user_id, active_case_id, virtual_time, investigation_budget_hours)
    VALUES (NEW.id, 'case-01', '2002-03-14 08:00:00+01', 80);

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
