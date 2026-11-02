import { ref } from 'vue';
import type { HighlightColor, EvidenceItem } from '../types/evidence.types';
import { useEvidenceStore } from '../stores/evidenceStore';

export function useEvidenceExtractor() {
  const evidenceStore = useEvidenceStore();
  const selectedColor = ref<HighlightColor>('yellow');
  const lastSelectedText = ref<string>('');

  const setColor = (color: HighlightColor) => {
    selectedColor.value = color;
  };

  const captureSelection = (): string => {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed) {
      return '';
    }
    const text = sel.toString().trim();
    if (text.length > 3) {
      lastSelectedText.value = text;
    }
    return text;
  };

  const pinEvidence = (
    docId: string,
    sourceTitle: string,
    overrideText?: string
  ): { success: boolean; evidence?: EvidenceItem; message: string } => {
    const textToPin = overrideText || lastSelectedText.value || captureSelection();

    if (!textToPin || textToPin.length < 3) {
      return {
        success: false,
        message: 'Zaznacz fragment tekstu w dokumencie przed wpięciem do akt.',
      };
    }

    const newItem: EvidenceItem = {
      id: `ev-${docId.toLowerCase()}-${Date.now()}`,
      caseId: 'case-01',
      documentId: docId,
      type: 'document_quote',
      quote: textToPin,
      color: selectedColor.value,
      sourceTitle,
      createdAt: new Date().toISOString(),
    };

    const added = evidenceStore.addEvidence(newItem);

    if (added) {
      return {
        success: true,
        evidence: newItem,
        message: `Cytat z ${docId} został wpięty do akt śledztwa.`,
      };
    } else {
      return {
        success: false,
        message: 'Ten fragment został już wcześniej wpięty do akt.',
      };
    }
  };

  return {
    selectedColor,
    lastSelectedText,
    setColor,
    captureSelection,
    pinEvidence,
  };
}
