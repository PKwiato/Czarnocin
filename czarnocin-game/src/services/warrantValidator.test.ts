import { describe, it, expect } from 'vitest';
import { WarrantValidator } from './warrantValidator';
import type { WarrantFormState } from '../types/warrant.types';
import type { EvidenceItem } from '../types/evidence.types';

const createEvidence = (
  docId: string,
  quote = 'dowód',
  req?: any,
  meta?: any
): EvidenceItem => ({
  id: `ev-${docId}-${Math.random()}`,
  caseId: 'case-01',
  documentId: docId,
  type: 'document_quote',
  quote,
  color: 'yellow',
  sourceTitle: `Dokument ${docId}`,
  targetRequirement: req,
  createdAt: new Date().toISOString(),
  metadata: meta,
});

describe('WarrantValidator — Sprawa 1 (Ds. 112/02)', () => {
  it('Ścieżka idealna: pełny i bezbłędny łańcuch dowodowy -> UWZGLĘDNIENIE i awans', () => {
    const idealForm: WarrantFormState = {
      caseId: 'case-01',
      suspectName: 'Zbigniew M.',
      requirements: {
        alibi: [
          createEvidence('AKT-006', 'alibi w barze Pod Lipą'),
          createEvidence('AKT-011', 'logowanie BTS Huta-Płn. 21:41'),
        ],
        presence: [
          createEvidence('AKT-012', 'wjazd Żuka o 21:45'),
          createEvidence('K-01', 'właściciel Żuka Zbigniew M.'),
        ],
        material_trace: [
          createEvidence('AKT-014', 'odcisk palca M. na nożu D-1', 'material_trace', { fingerprintVariant: 'A' }),
        ],
        motive: [
          createEvidence('AKT-013', 'zeznanie siostry o szantażu'),
          createEvidence('AKT-007', 'faktura z dopiskiem TRANS-MET'),
        ],
      },
    };

    const result = WarrantValidator.evaluateCase01(idealForm);

    expect(result.isApproved).toBe(true);
    expect(result.overallDecision).toBe('POSTANOWIENIE O UWZGLĘDNIENIU');
    expect(result.rewardPoints).toBe(100);
    expect(result.nextRankUnlocked).toBe('Aspirant');
    expect(result.requirements.alibi.isSatisfied).toBe(true);
    expect(result.requirements.presence.isSatisfied).toBe(true);
    expect(result.requirements.material_trace.isSatisfied).toBe(true);
    expect(result.requirements.motive.isSatisfied).toBe(true);
  });

  it('Ścieżka błędna: wskazanie niewłaściwego podejrzanego (Tadeusz W.) -> ODMOWA i alibi z izby wytrzeźwień', () => {
    const wrongSuspectForm: WarrantFormState = {
      caseId: 'case-01',
      suspectName: 'Tadeusz W.',
      requirements: {
        alibi: [createEvidence('AKT-006'), createEvidence('AKT-011')],
        presence: [createEvidence('AKT-012'), createEvidence('K-01')],
        material_trace: [createEvidence('AKT-014')],
        motive: [createEvidence('AKT-013')],
      },
    };

    const result = WarrantValidator.evaluateCase01(wrongSuspectForm);

    expect(result.isApproved).toBe(false);
    expect(result.overallDecision).toBe('POSTANOWIENIE O ODMOWIE');
    expect(result.penaltyBudgetHours).toBe(10);
    expect(result.penaltyPoints).toBe(20);
    expect(result.justificationText).toContain('Tadeusz W.');
    expect(result.requirements.alibi.feedbackMessage).toContain('izbie wytrzeźwień');
  });

  it('Ścieżka braków dowodowych: brak obalenia alibi i brak śladu materialnego -> ODMOWA', () => {
    const incompleteForm: WarrantFormState = {
      caseId: 'case-01',
      suspectName: 'Zbigniew M.',
      requirements: {
        alibi: [createEvidence('AKT-006')], // tylko samo twierdzenie, brak obalenia przez BTS lub barmankę
        presence: [createEvidence('AKT-012'), createEvidence('K-01')],
        material_trace: [], // pusty slot śladu materialnego
        motive: [createEvidence('AKT-013'), createEvidence('AKT-007')],
      },
    };

    const result = WarrantValidator.evaluateCase01(incompleteForm);

    expect(result.isApproved).toBe(false);
    expect(result.requirements.alibi.isSatisfied).toBe(false);
    expect(result.requirements.material_trace.isSatisfied).toBe(false);
    expect(result.penaltyBudgetHours).toBe(10);
  });

  it('Ścieżka pułapki: podpięcie śladu buta IMG-09 pod ślad materialny -> ODMOWA', () => {
    const trapForm: WarrantFormState = {
      caseId: 'case-01',
      suspectName: 'Zbigniew M.',
      requirements: {
        alibi: [createEvidence('AKT-006'), createEvidence('AKT-011')],
        presence: [createEvidence('AKT-012'), createEvidence('K-01')],
        material_trace: [createEvidence('IMG-09', 'odlew śladu buta')], // fałszywy trop
        motive: [createEvidence('AKT-013'), createEvidence('AKT-007')],
      },
    };

    const result = WarrantValidator.evaluateCase01(trapForm);

    expect(result.isApproved).toBe(false);
    expect(result.requirements.material_trace.isSatisfied).toBe(false);
    expect(result.requirements.material_trace.feedbackMessage).toContain('cech indywidualnych');
  });
});
