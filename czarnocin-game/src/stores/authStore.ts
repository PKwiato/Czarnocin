import { defineStore } from 'pinia';
import type { PlayerRank } from '../types/os.types';
import { supabase } from '../services/supabaseClient';

export interface AuthState {
  isLoggedIn: boolean;
  userId: string | null;
  badgeNumber: string;
  fullName: string;
  rank: PlayerRank;
  department: string;
  servicePoints: number;
  servicePointsMax: number;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    isLoggedIn: true, // domyślnie zalogowany na stanowisku KC-07
    userId: null,
    badgeNumber: 'CZ 20412/02',
    fullName: 'St. post. Marek Adamski',
    rank: 'mlodszy_aspirant',
    department: 'KMP Czarnocin · Wydz. Dochodzeniowo-Śledczy',
    servicePoints: 0,
    servicePointsMax: 100,
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
  },

  actions: {
    login(badgeNumber = 'CZ 20412/02', fullName = 'Młodszy Aspirant') {
      this.badgeNumber = badgeNumber;
      this.fullName = fullName;
      this.isLoggedIn = true;
    },

    logout() {
      this.isLoggedIn = false;
      this.userId = null;
    },

    addServicePoints(points: number) {
      this.servicePoints += points;
      if (this.servicePoints >= this.servicePointsMax && this.rank === 'mlodszy_aspirant') {
        this.promote('aspirant');
      }
    },

    applyPenaltyPoints(points: number) {
      this.servicePoints = Math.max(0, this.servicePoints - points);
    },

    promote(newRank: PlayerRank) {
      this.rank = newRank;
      this.servicePoints = 0;
      this.servicePointsMax = 150;
    },

    async fetchProfileFromSupabase() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          this.userId = user.id;
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          if (profile) {
            this.badgeNumber = profile.badge_number;
            this.fullName = profile.full_name;
            this.rank = profile.rank as PlayerRank;
            this.servicePoints = profile.service_points;
            this.department = profile.department;
            this.isLoggedIn = true;
          }
        }
      } catch {
        // Fallback do stanu lokalnego
      }
    },
  },
});
