import { defineStore } from 'pinia';

export interface VirtualTimeState {
  currentDate: string; // '2002-03-14'
  dayName: string; // 'Czwartek'
  currentTime: string; // '08:00'
  hoursElapsed: number;
  budgetHoursTotal: number;
  budgetHoursLeft: number;
}

export const useVirtualTimeStore = defineStore('virtualTime', {
  state: (): VirtualTimeState => ({
    currentDate: '2002-03-14',
    dayName: 'Czwartek',
    currentTime: '08:00',
    hoursElapsed: 0,
    budgetHoursTotal: 80,
    budgetHoursLeft: 80,
  }),

  getters: {
    formattedClock(state): string {
      return `${state.dayName} ${state.currentTime}`;
    },

    budgetUsagePercentage(state): number {
      const used = state.budgetHoursTotal - state.budgetHoursLeft;
      return Math.round((used / state.budgetHoursTotal) * 100);
    },

    isBudgetExhausted(state): boolean {
      return state.budgetHoursLeft <= 0;
    },
  },

  actions: {
    deductBudgetHours(hours: number) {
      this.budgetHoursLeft = Math.max(0, this.budgetHoursLeft - hours);
      this.advanceVirtualTime(Math.ceil(hours / 2)); // zlecenia realizowane równolegle
    },

    applyBudgetPenalty(hours: number) {
      this.budgetHoursLeft = Math.max(0, this.budgetHoursLeft - hours);
    },

    advanceVirtualTime(hoursToAdd: number) {
      this.hoursElapsed += hoursToAdd;

      const [startHour, startMin] = this.currentTime.split(':').map(Number);
      let totalMinutes = (startHour * 60 + startMin) + hoursToAdd * 60;

      let currentDayIndex = 0; // 0 = Czwartek, 1 = Piątek, 2 = Sobota
      const days = ['Czwartek', 'Piątek', 'Sobota', 'Niedziela'];

      while (totalMinutes >= 24 * 60) {
        totalMinutes -= 24 * 60;
        currentDayIndex = Math.min(currentDayIndex + 1, days.length - 1);
      }

      const newHour = Math.floor(totalMinutes / 60);
      const newMin = totalMinutes % 60;

      this.dayName = days[currentDayIndex];
      this.currentTime = `${String(newHour).padStart(2, '0')}:${String(newMin).padStart(2, '0')}`;
    },

    reset() {
      this.currentDate = '2002-03-14';
      this.dayName = 'Czwartek';
      this.currentTime = '08:00';
      this.hoursElapsed = 0;
      this.budgetHoursLeft = 80;
    },
  },
});
