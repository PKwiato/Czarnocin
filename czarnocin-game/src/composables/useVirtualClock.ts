import { computed } from 'vue';
import { useVirtualTimeStore } from '../stores/virtualTimeStore';
import { useAuthStore } from '../stores/authStore';

export function useVirtualClock() {
  const timeStore = useVirtualTimeStore();
  const authStore = useAuthStore();

  const formattedDateTime = computed(() => {
    return `${timeStore.dayName} ${timeStore.currentTime}`;
  });

  const budgetDisplay = computed(() => {
    return `Budżet: ${timeStore.budgetHoursLeft} / ${timeStore.budgetHoursTotal}h`;
  });

  const rankDisplay = computed(() => {
    return authStore.rankTitle;
  });

  return {
    timeStore,
    authStore,
    formattedDateTime,
    budgetDisplay,
    rankDisplay,
  };
}
