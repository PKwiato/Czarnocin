import { WarrantRequirementId, EvidenceItem } from './evidence.types';

export interface WarrantFormState {
  caseId: string;
  suspectName: string;
  requirements: Record<WarrantRequirementId, EvidenceItem[]>;
  submittedAt?: string;
}

export interface WarrantRequirementEvaluation {
  requirementId: WarrantRequirementId;
  name: string;
  isSatisfied: boolean;
  statusText: 'Zaliczono' | 'Błąd' | 'Brak';
  attachedDocumentIds: string[];
  feedbackMessage?: string;
}

export interface WarrantEvaluationResult {
  isApproved: boolean;
  overallDecision: 'POSTANOWIENIE O UWZGLĘDNIENIU' | 'POSTANOWIENIE O ODMOWIE';
  requirements: Record<WarrantRequirementId, WarrantRequirementEvaluation>;
  justificationText: string;
  penaltyBudgetHours: number;
  penaltyPoints: number;
  rewardPoints: number;
  nextRankUnlocked?: string;
}
