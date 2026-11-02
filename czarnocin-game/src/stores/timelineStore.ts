import { defineStore } from 'pinia';
import type { TimelineEvent } from '../types/case.types';
import timelineEventsJson from '../data/cases/case-01/timeline-events.json';

export interface TimelineStoreState {
  events: TimelineEvent[];
  placedEventIds: string[];
}

export const useTimelineStore = defineStore('timeline', {
  state: (): TimelineStoreState => ({
    events: timelineEventsJson as TimelineEvent[],
    placedEventIds: ['ev-time-02', 'ev-time-04', 'TE-06', 'TE-10'], // Domyślnie umieszczone na osi: Zeznanie baru oraz BTS Huta
  }),

  getters: {
    placedEvents(state): TimelineEvent[] {
      return state.events.filter((e) => state.placedEventIds.includes(e.id));
    },

    availableEvents(state): TimelineEvent[] {
      return state.events.filter((e) => !state.placedEventIds.includes(e.id));
    },

    /**
     * Wykrywa sprzeczność czasową w oknie 21:41–22:19
     * (gdy na osi umieszczono alibi w barze oraz logowanie ze stacji BTS Huta-Płn.)
     */
    conflictDetected(state): boolean {
      const hasAlibi = state.placedEventIds.some((id) => id === 'ev-time-02' || id === 'TE-06'); // bar Pod Lipą 20:30-22:30
      const hasBtsConflict = state.placedEventIds.some((id) => id === 'ev-time-04' || id === 'TE-10'); // BTS Huta-Płn 21:41
      return hasAlibi && hasBtsConflict;
    },

    conflictDescription(): string {
      return 'Sprzeczność: 21:41–22:19 podejrzany w dwóch miejscach jednocześnie (alibi w barze wykluczone przez stację BTS Huta-Płn.).';
    },

    eventsByDocumentId: (state) => (docId: string): TimelineEvent[] => {
      return state.events.filter((e) => e.documentId === docId);
    },
  },

  actions: {
    placeEvent(eventId: string) {
      if (!this.placedEventIds.includes(eventId)) {
        this.placedEventIds.push(eventId);
      }
    },

    removeEvent(eventId: string) {
      this.placedEventIds = this.placedEventIds.filter((id) => id !== eventId);
    },

    reset() {
      this.placedEventIds = [];
    },
  },
});
