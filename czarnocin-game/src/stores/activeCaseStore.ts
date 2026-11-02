import { defineStore } from 'pinia';
import type { CaseData, CaseDocument, CasePhoto, FieldAction } from '../types/case.types';
import { caseService } from '../services/caseService';
import { useVirtualTimeStore } from './virtualTimeStore';

export interface ActiveCaseState {
  caseData: CaseData | null;
  documents: CaseDocument[];
  unlockedDocumentIds: string[];
  activeDocumentId: string;
  fieldActions: FieldAction[];
  photos: CasePhoto[];
  suspects: string[];
  selectedSuspect: string;
  isLoading: boolean;
}

export const useActiveCaseStore = defineStore('activeCase', {
  state: (): ActiveCaseState => ({
    caseData: null,
    documents: [],
    unlockedDocumentIds: [
      'AKT-001',
      'AKT-002',
      'AKT-003',
      'AKT-004',
      'AKT-005',
      'AKT-006',
      'AKT-007',
      'AKT-008',
    ],
    activeDocumentId: 'AKT-006',
    fieldActions: [],
    photos: [],
    suspects: ['Zbigniew M.', 'Tadeusz W.'],
    selectedSuspect: 'Zbigniew M.',
    isLoading: false,
  }),

  getters: {
    activeDocument(state): CaseDocument | null {
      return state.documents.find((d) => d.id === state.activeDocumentId) || null;
    },

    availableDocuments(state): CaseDocument[] {
      return state.documents.filter(
        (d) => d.availableAtStart || state.unlockedDocumentIds.includes(d.id)
      );
    },

    lockedDocuments(state): CaseDocument[] {
      return state.documents.filter(
        (d) => !d.availableAtStart && !state.unlockedDocumentIds.includes(d.id)
      );
    },
  },

  actions: {
    async loadCase(caseId = 'case-01') {
      this.isLoading = true;
      try {
        const [caseMeta, docs, acts, pics] = await Promise.all([
          caseService.getCaseData(caseId),
          caseService.getDocuments(caseId),
          caseService.getFieldActions(caseId),
          caseService.getPhotos(caseId),
        ]);

        this.caseData = caseMeta;
        this.documents = docs;
        this.fieldActions = acts;
        this.photos = pics;

        // Inicjalizacja listy odblokowanych dokumentów
        const startingUnlocked = docs.filter((d) => d.availableAtStart).map((d) => d.id);
        this.unlockedDocumentIds = Array.from(new Set([...this.unlockedDocumentIds, ...startingUnlocked]));

        if (!this.activeDocumentId && docs.length > 0) {
          this.activeDocumentId = docs[0].id;
        }
      } catch (err) {
        console.error('Błąd podczas ładowania sprawy:', err);
      } finally {
        this.isLoading = false;
      }
    },

    setActiveDocument(docId: string) {
      this.activeDocumentId = docId;
    },

    unlockDocuments(docIds: string[]) {
      this.unlockedDocumentIds = Array.from(new Set([...this.unlockedDocumentIds, ...docIds]));
    },

    setSelectedSuspect(suspect: string) {
      this.selectedSuspect = suspect;
    },

    async runFieldAction(actionId: string): Promise<{ success: boolean; message: string }> {
      const timeStore = useVirtualTimeStore();
      const res = await caseService.executeFieldAction(actionId, timeStore.budgetHoursLeft);

      if (res.success) {
        timeStore.deductBudgetHours(res.costHours);
        this.unlockDocuments(res.unlockedDocumentIds);

        const action = this.fieldActions.find((a) => a.id === actionId);
        if (action) {
          action.isExecuted = true;
        }
      }

      return {
        success: res.success,
        message: res.message,
      };
    },
  },
});
