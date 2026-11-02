export interface CaseData {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  startingDate: string;
  startingClock: string;
  startingBudgetHours: number;
  ksipQueriesLimit: number;
  rewardPoints: number;
  initialSuspects: string[];
}

export interface CaseDocument {
  id: string; // np. 'AKT-001'
  caseId: string;
  title: string;
  docType: 'protocol' | 'billing' | 'invoice' | 'report' | 'lab_opinion' | 'order';
  pagesCount: number;
  pages: string[]; // HTML content per page with span markers
  availableAtStart: boolean;
  unlockedByActionId?: string | null;
  markersHint?: string;
  defaultHighlights?: Array<{
    quote: string;
    color: 'yellow' | 'red' | 'blue';
    note?: string;
  }>;
}

export interface CasePhoto {
  id: string; // np. 'IMG-01'
  caseId: string;
  fileName: string;
  title: string;
  description: string;
  technicianNotes: string;
  date: string;
  isTrap: boolean; // np. IMG-09 jest tropem pozornym
}

export interface KsipRecord {
  id: string; // np. 'K-01'
  category: 'vehicle' | 'person' | 'company' | 'phone';
  searchQuery: string;
  displayTitle: string;
  fields: Record<string, string>;
  isMetaClue: boolean; // okruch dla Układu
}

export interface FieldAction {
  id: string; // np. 'Z-01'
  caseId: string;
  name: string;
  costHours: number;
  requiresSuperiorApproval: boolean;
  isAvailable: boolean;
  isExecuted: boolean;
  unlockedDocumentIds: string[];
  targetSelectionRequired?: 'person' | 'phone' | 'none';
}

export interface TimelineEvent {
  id: string;
  time: string; // np. '21:41'
  track: 'alibi' | 'bts' | 'scene';
  title: string;
  description: string;
  btsStation?: string;
  documentId: string;
  isConflict: boolean;
}

export interface InternalMail {
  id: string; // np. 'MAIL-01'
  caseId: string;
  date: string;
  from: string;
  subject: string;
  content: string;
  isRead: boolean;
}
