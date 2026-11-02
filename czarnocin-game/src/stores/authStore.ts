import { defineStore } from 'pinia';
import type { PlayerRank } from '../types/os.types';
import { supabase } from '../services/supabaseClient';

export interface AuthState {
  isLoggedIn: boolean;
  userId: string | null;
  userEmail: string | null;
  badgeNumber: string;
  fullName: string;
  rank: PlayerRank;
  department: string;
  servicePoints: number;
  servicePointsMax: number;
  authMode: 'supabase' | 'local';
  isLoading: boolean;
  authError: string | null;
}

const LOCAL_STORAGE_KEY = 'czarnocin_local_session';

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    isLoggedIn: false, // Domyślnie wymaga logowania na starcie
    userId: null,
    userEmail: null,
    badgeNumber: 'CZ 20412/02',
    fullName: 'St. post. Marek Adamski',
    rank: 'mlodszy_aspirant',
    department: 'KMP Czarnocin · Wydz. Dochodzeniowo-Śledczy',
    servicePoints: 0,
    servicePointsMax: 100,
    authMode: 'local',
    isLoading: false,
    authError: null,
  }),

  getters: {
    rankTitle(state): string {
      const titles: Record<PlayerRank, string> = {
        mlodszy_aspirant: 'Młodszy Aspirant',
        aspirant: 'Aspirant',
        podkomisarz: 'Podkomisarz',
        komisarz: 'Komisarz',
        podinspektor: 'Podinspektor',
      };
      return titles[state.rank] || 'Młodszy Aspirant';
    },

    canAccessBtsBilling(state): boolean {
      // Bilingi bez zgody komendanta od stopnia Aspirant
      return state.rank !== 'mlodszy_aspirant';
    },

    canAccessFirearmsRegistry(state): boolean {
      return state.rank === 'aspirant' || state.rank === 'podkomisarz' || state.rank === 'komisarz' || state.rank === 'podinspektor';
    },

    isSupabase(state): boolean {
      return state.authMode === 'supabase';
    },
  },

  actions: {
    /**
     * Inicjalizacja sesji przy starcie aplikacji.
     * Najpierw sprawdza aktywną sesję Supabase, a w razie braku - zapis w localStorage.
     */
    async initAuth(): Promise<boolean> {
      this.isLoading = true;
      this.authError = null;

      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session && session.user) {
          this.userId = session.user.id;
          this.userEmail = session.user.email ?? null;
          this.authMode = 'supabase';
          this.isLoggedIn = true;
          await this.fetchProfileFromSupabase();
          this.isLoading = false;
          return true;
        }
      } catch (err) {
        console.warn('Supabase getSession check skipped or failed:', err);
      }

      // Sprawdź zapisaną sesję lokalną
      try {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          this.badgeNumber = parsed.badgeNumber || 'CZ 20412/02';
          this.fullName = parsed.fullName || 'St. post. Marek Adamski';
          this.rank = (parsed.rank as PlayerRank) || 'mlodszy_aspirant';
          this.servicePoints = parsed.servicePoints ?? 0;
          this.department = parsed.department || 'KMP Czarnocin · Wydz. Dochodzeniowo-Śledczy';
          this.authMode = 'local';
          this.userId = 'local-kc-07';
          this.isLoggedIn = true;
          this.isLoading = false;
          return true;
        }
      } catch (err) {
        console.warn('Local session restore failed:', err);
      }

      this.isLoggedIn = false;
      this.isLoading = false;
      return false;
    },

    /**
     * Logowanie lokalne (tryb gościa / stanowiska KC-07 bez bazy w chmurze)
     */
    loginLocal(badgeNumber = 'CZ 20412/02', fullName = 'St. post. Marek Adamski', rank: PlayerRank = 'mlodszy_aspirant') {
      this.badgeNumber = badgeNumber;
      this.fullName = fullName;
      this.rank = rank;
      this.userId = 'local-kc-07';
      this.authMode = 'local';
      this.isLoggedIn = true;
      this.authError = null;

      try {
        localStorage.setItem(
          LOCAL_STORAGE_KEY,
          JSON.stringify({
            badgeNumber: this.badgeNumber,
            fullName: this.fullName,
            rank: this.rank,
            servicePoints: this.servicePoints,
            department: this.department,
          })
        );
      } catch {
        // Ignoruj błędy localStorage (np. private browsing)
      }
    },

    /**
     * Logowanie kontem Supabase
     */
    async loginWithSupabase(email: string, password: string): Promise<{ success: boolean; error?: string; code?: string }> {
      this.isLoading = true;
      this.authError = null;

      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) {
          this.isLoading = false;
          this.authError = error.message;
          return { success: false, error: error.message, code: error.code };
        }

        if (data.session && data.user) {
          this.userId = data.user.id;
          this.userEmail = data.user.email ?? email;
          this.authMode = 'supabase';
          this.isLoggedIn = true;
          await this.fetchProfileFromSupabase();
          this.isLoading = false;
          return { success: true };
        }

        this.isLoading = false;
        return { success: false, error: 'Nie udało się uzyskać sesji użytkownika.' };
      } catch (err: any) {
        this.isLoading = false;
        const msg = err?.message || 'Błąd połączenia z serwerem logowania.';
        this.authError = msg;
        return { success: false, error: msg };
      }
    },

    /**
     * Rejestracja nowego konta funkcjonariusza w Supabase
     */
    async registerWithSupabase(
      email: string,
      password: string,
      fullName: string,
      badgeNumber: string
    ): Promise<{ success: boolean; needsConfirmation?: boolean; error?: string; code?: string }> {
      this.isLoading = true;
      this.authError = null;

      try {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              full_name: fullName,
              badge_number: badgeNumber,
            },
          },
        });

        if (error) {
          this.isLoading = false;
          this.authError = error.message;
          return { success: false, error: error.message, code: error.code };
        }

        if (data.session && data.user) {
          // Sesja od razu utworzona (np. potwierdzanie maila wyłączone)
          this.userId = data.user.id;
          this.userEmail = data.user.email ?? email;
          this.authMode = 'supabase';
          this.isLoggedIn = true;
          await this.fetchProfileFromSupabase();
          this.isLoading = false;
          return { success: true, needsConfirmation: false };
        }

        if (data.user) {
          // Użytkownik utworzony, ale wymaga kliknięcia linku potwierdzającego
          this.isLoading = false;
          return { success: true, needsConfirmation: true };
        }

        this.isLoading = false;
        return { success: false, error: 'Nieznana odpowiedź z serwera rejestracji.' };
      } catch (err: any) {
        this.isLoading = false;
        const msg = err?.message || 'Błąd rejestracji konta.';
        this.authError = msg;
        return { success: false, error: msg };
      }
    },

    /**
     * Wylogowanie z systemu (czyści sesję Supabase i lokalną)
     */
    async logout() {
      try {
        if (this.authMode === 'supabase') {
          await supabase.auth.signOut();
        }
      } catch (err) {
        console.warn('Supabase signOut error:', err);
      } finally {
        try {
          localStorage.removeItem(LOCAL_STORAGE_KEY);
        } catch {
          // ignore
        }
        this.isLoggedIn = false;
        this.userId = null;
        this.userEmail = null;
        this.authMode = 'local';
        this.badgeNumber = 'CZ 20412/02';
        this.fullName = 'St. post. Marek Adamski';
        this.rank = 'mlodszy_aspirant';
        this.servicePoints = 0;
        this.authError = null;
      }
    },

    /**
     * Synchronizacja punktów i stopnia z bazą w chmurze
     */
    async syncProfileToSupabase() {
      if (this.authMode !== 'supabase' || !this.userId) return;

      try {
        await supabase
          .from('profiles')
          .update({
            rank: this.rank,
            service_points: this.servicePoints,
            updated_at: new Date().toISOString(),
          })
          .eq('id', this.userId);
      } catch (err) {
        console.warn('Sync profile to Supabase failed:', err);
      }
    },

    addServicePoints(points: number) {
      this.servicePoints += points;
      if (this.servicePoints >= this.servicePointsMax && this.rank === 'mlodszy_aspirant') {
        this.promote('aspirant');
      } else {
        this.syncProfileToSupabase();
      }
    },

    applyPenaltyPoints(points: number) {
      this.servicePoints = Math.max(0, this.servicePoints - points);
      this.syncProfileToSupabase();
    },

    promote(newRank: PlayerRank) {
      this.rank = newRank;
      this.servicePoints = 0;
      this.servicePointsMax = 150;
      this.syncProfileToSupabase();
    },

    async fetchProfileFromSupabase() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          this.userId = user.id;
          this.userEmail = user.email ?? null;

          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .maybeSingle();

          if (profile) {
            this.badgeNumber = profile.badge_number;
            this.fullName = profile.full_name;
            this.rank = (profile.rank as PlayerRank) || 'mlodszy_aspirant';
            this.servicePoints = profile.service_points ?? 0;
            this.department = profile.department;
            this.isLoggedIn = true;
          } else {
            // Profil nie został utworzony przez trigger - tworzymy go
            const initialBadge = (user.user_metadata?.badge_number as string) || 'CZ 20412/02';
            const initialName = (user.user_metadata?.full_name as string) || 'St. post. Marek Adamski';
            const initialRank: PlayerRank = 'mlodszy_aspirant';
            const initialDept = 'KMP Czarnocin · Wydz. Dochodzeniowo-Śledczy';

            await supabase.from('profiles').insert({
              id: user.id,
              badge_number: initialBadge,
              full_name: initialName,
              rank: initialRank,
              service_points: 0,
              department: initialDept,
            });

            this.badgeNumber = initialBadge;
            this.fullName = initialName;
            this.rank = initialRank;
            this.department = initialDept;
            this.isLoggedIn = true;
          }
        }
      } catch (err) {
        console.warn('Fallback do stanu lokalnego przy odczycie profilu:', err);
      }
    },
  },
});
