import { defineStore } from 'pinia';
import type { EvidenceItem, WarrantRequirementId } from '../types/evidence.types';

export interface EvidenceStoreState {
  evidenceList: EvidenceItem[];
  selectedEvidenceId: string | null;
}

export const useEvidenceStore = defineStore('evidence', {
  state: (): EvidenceStoreState => ({
    evidenceList: [
      {
        id: 'ev-init-akt-006',
        caseId: 'case-01',
        documentId: 'AKT-006',
        type: 'document_quote',
        quote: 'od około 20:30 do 22:30',
        color: 'yellow',
        sourceTitle: 'AKT-006: Zeznanie o alibi w barze',
        targetRequirement: 'alibi',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'ev-init-akt-006-kłamstwo',
        caseId: 'case-01',
        documentId: 'AKT-006',
        type: 'document_quote',
        quote: '„W ogóle tam nie jeżdżę, nie znam tego miejsca.”',
        color: 'red',
        sourceTitle: 'AKT-006: Zeznanie o bocznicy kolejowej',
        targetRequirement: 'presence',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'ev-init-akt-006-kontakt',
        caseId: 'case-01',
        documentId: 'AKT-006',
        type: 'document_quote',
        quote: 'mężczyzna z ochrony',
        color: 'blue',
        sourceTitle: 'AKT-006: Połączenie od ochroniarza',
        targetRequirement: 'motive',
        createdAt: new Date().toISOString(),
      },
    ],
    selectedEvidenceId: null,
  }),

  getters: {
    totalCount(state): number {
      return state.evidenceList.length;
    },

    byDocumentId: (state) => (docId: string): EvidenceItem[] => {
      return state.evidenceList.filter((e) => e.documentId === docId);
    },

    byRequirement: (state) => (req: WarrantRequirementId): EvidenceItem[] => {
      return state.evidenceList.filter((e) => e.targetRequirement === req);
    },
  },

  actions: {
    addEvidence(item: EvidenceItem): boolean {
      // Zapobiegaj dodawaniu identycznych cytatów
      const exists = this.evidenceList.some(
        (e) => e.documentId === item.documentId && e.quote.trim() === item.quote.trim()
      );

      if (exists) {
        return false;
      }

      this.evidenceList.push(item);
      this.selectedEvidenceId = item.id;
      return true;
    },

    removeEvidence(id: string) {
      this.evidenceList = this.evidenceList.filter((e) => e.id !== id);
      if (this.selectedEvidenceId === id) {
        this.selectedEvidenceId = null;
      }
    },

    selectEvidence(id: string | null) {
      this.selectedEvidenceId = id;
    },

    clearEvidence() {
      this.evidenceList = [];
      this.selectedEvidenceId = null;
    },
  },
});
