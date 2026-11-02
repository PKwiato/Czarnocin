export type EvidenceType =
  | 'document_quote'
  | 'ksip_record'
  | 'case_photo'
  | 'physical_item';

export type HighlightColor = 'yellow' | 'red' | 'blue' | 'neutral';

export type WarrantRequirementId = 'alibi' | 'presence' | 'material_trace' | 'motive';

export interface EvidenceItem {
  id: string;
  caseId: string;
  documentId: string; // np. 'AKT-006', 'K-01', 'IMG-09', 'D-1'
  type: EvidenceType;
  quote: string;
  color: HighlightColor;
  sourceTitle: string;
  targetRequirement?: WarrantRequirementId;
  createdAt: string;
  metadata?: Record<string, any>;
}

export interface RequirementSlot {
  id: WarrantRequirementId;
  title: string;
  description: string;
  requiredCount: number;
  assignedEvidence: EvidenceItem[];
  status: 'empty' | 'partial' | 'complete';
}
