import { WarrantRequirementId, EvidenceItem } from '../types/evidence.types';
import {
  WarrantFormState,
  WarrantEvaluationResult,
  WarrantRequirementEvaluation,
} from '../types/warrant.types';

export class WarrantValidator {
  /**
   * Główna funkcja oceniająca wniosek o areszt dla Sprawy 1: Ds. 112/02
   */
  public static evaluateCase01(form: WarrantFormState): WarrantEvaluationResult {
    const suspect = form.suspectName.trim().toLowerCase();

    // Sprawdzenie czy wskazano właściwego podejrzanego
    const isMainSuspect =
      suspect.includes('zbigniew') ||
      suspect.includes('zbigniew m') ||
      suspect === 'm.' ||
      suspect === 'zbigniew m.';

    const isFalseSuspect =
      suspect.includes('tadeusz') ||
      suspect.includes('tadeusz w') ||
      suspect === 'w.' ||
      suspect === 'tadeusz w.';

    // Weryfikacja wymogu 1: Obalenie alibi
    const alibiEval = this.evaluateAlibi(form.requirements.alibi || []);

    // Weryfikacja wymogu 2: Obecność na miejscu zdarzenia
    const presenceEval = this.evaluatePresence(form.requirements.presence || []);

    // Weryfikacja wymogu 3: Ślad materialny / Narzędzie zbrodni
    const traceEval = this.evaluateMaterialTrace(form.requirements.material_trace || []);

    // Weryfikacja wymogu 4: Motyw czynu
    const motiveEval = this.evaluateMotive(form.requirements.motive || []);

    // Jeśli wskazano niewłaściwą osobę (fałszywy trop: Tadeusz W.)
    if (isFalseSuspect) {
      return {
        isApproved: false,
        overallDecision: 'POSTANOWIENIE O ODMOWIE',
        requirements: {
          alibi: {
            requirementId: 'alibi',
            name: 'Obalenie alibi',
            isSatisfied: false,
            statusText: 'Błąd',
            attachedDocumentIds: (form.requirements.alibi || []).map((e) => e.documentId),
            feedbackMessage:
              'Dowód potwierdza niepodważalne alibi osoby wskazanej we wniosku jako podejrzana (pobyt w izbie wytrzeźwień w godz. 19:50–06:30, AKT-015).',
          },
          presence: presenceEval,
          material_trace: traceEval,
          motive: motiveEval,
        },
        justificationText:
          'Wniosek skierowany przeciwko niewłaściwej osobie. Tadeusz W. w czasie zbrodni przebywał w izbie wytrzeźwień pod stałym nadzorem personelu.',
        penaltyBudgetHours: 10,
        penaltyPoints: 20,
        rewardPoints: 0,
      };
    }

    const allSatisfied =
      isMainSuspect &&
      alibiEval.isSatisfied &&
      presenceEval.isSatisfied &&
      traceEval.isSatisfied &&
      motiveEval.isSatisfied;

    if (allSatisfied) {
      return {
        isApproved: true,
        overallDecision: 'POSTANOWIENIE O UWZGLĘDNIENIU',
        requirements: {
          alibi: alibiEval,
          presence: presenceEval,
          material_trace: traceEval,
          motive: motiveEval,
        },
        justificationText:
          'Zgromadzone dowody w sposób spójny obalają alibi podejrzanego Zbigniewa M., wskazują jego obecność na miejscu zdarzenia, zawierają ślad materialny (odcisk kciuka na narzędziu zbrodni D-1) oraz uprawdopodobniają motyw. Sąd wydaje nakaz tymczasowego aresztowania na okres 3 miesięcy.',
        penaltyBudgetHours: 0,
        penaltyPoints: 0,
        rewardPoints: 100,
        nextRankUnlocked: 'Aspirant',
      };
    }

    // Konstruowanie szczegółowego uzasadnienia odmowy
    const errorMessages: string[] = [];
    if (!isMainSuspect) {
      errorMessages.push('Brak jednoznacznego wskazania podejrzanego Zbigniewa M.');
    }
    if (!alibiEval.isSatisfied && alibiEval.feedbackMessage) {
      errorMessages.push(`Obalenie alibi: ${alibiEval.feedbackMessage}`);
    }
    if (!presenceEval.isSatisfied && presenceEval.feedbackMessage) {
      errorMessages.push(`Obecność na miejscu: ${presenceEval.feedbackMessage}`);
    }
    if (!traceEval.isSatisfied && traceEval.feedbackMessage) {
      errorMessages.push(`Ślad materialny: ${traceEval.feedbackMessage}`);
    }
    if (!motiveEval.isSatisfied && motiveEval.feedbackMessage) {
      errorMessages.push(`Motyw: ${motiveEval.feedbackMessage}`);
    }

    return {
      isApproved: false,
      overallDecision: 'POSTANOWIENIE O ODMOWIE',
      requirements: {
        alibi: alibiEval,
        presence: presenceEval,
        material_trace: traceEval,
        motive: motiveEval,
      },
      justificationText:
        errorMessages.join(' ') ||
        'Wniosek zawiera błędy merytoryczne lub braki w materiale dowodowym. Polecam uzupełnić materiał dowodowy i złożyć wniosek ponownie.',
      penaltyBudgetHours: 10,
      penaltyPoints: 20,
      rewardPoints: 0,
    };
  }

  private static evaluateAlibi(items: EvidenceItem[]): WarrantRequirementEvaluation {
    const docIds = items.map((i) => i.documentId);

    if (docIds.length === 0) {
      return {
        requirementId: 'alibi',
        name: 'Obalenie alibi',
        isSatisfied: false,
        statusText: 'Brak',
        attachedDocumentIds: [],
        feedbackMessage: 'Brak dowodu przy wymogu obalenia alibi.',
      };
    }

    if (docIds.includes('AKT-015')) {
      return {
        requirementId: 'alibi',
        name: 'Obalenie alibi',
        isSatisfied: false,
        statusText: 'Błąd',
        attachedDocumentIds: docIds,
        feedbackMessage: 'Dowód potwierdza alibi innej osoby (Tadeusza W.) i nie obala alibi podejrzanego.',
      };
    }

    if (docIds.includes('AKT-009') && !docIds.includes('AKT-010') && !docIds.includes('AKT-011')) {
      return {
        requirementId: 'alibi',
        name: 'Obalenie alibi',
        isSatisfied: false,
        statusText: 'Błąd',
        attachedDocumentIds: docIds,
        feedbackMessage:
          'Zeznanie Romana S. (AKT-009) potwierdza obecność podejrzanego w lokalu tylko do godz. 21:15 i nie obala alibi w kluczowym przedziale czasowym.',
      };
    }

    const hasMStatement = docIds.includes('AKT-006');
    const hasCounterEvidence = docIds.includes('AKT-010') || docIds.includes('AKT-011');

    if (hasMStatement && hasCounterEvidence) {
      return {
        requirementId: 'alibi',
        name: 'Obalenie alibi',
        isSatisfied: true,
        statusText: 'Zaliczono',
        attachedDocumentIds: docIds,
      };
    }

    return {
      requirementId: 'alibi',
      name: 'Obalenie alibi',
      isSatisfied: false,
      statusText: 'Błąd',
      attachedDocumentIds: docIds,
      feedbackMessage:
        'Do obalenia alibi konieczne jest zestawienie oświadczenia podejrzanego (AKT-006) z dowodem wykazującym opuszczenie lokalu (zeznanie barmanki AKT-010 lub biling BTS AKT-011).',
    };
  }

  private static evaluatePresence(items: EvidenceItem[]): WarrantRequirementEvaluation {
    const docIds = items.map((i) => i.documentId);

    if (docIds.length === 0) {
      return {
        requirementId: 'presence',
        name: 'Obecność na miejscu',
        isSatisfied: false,
        statusText: 'Brak',
        attachedDocumentIds: [],
        feedbackMessage: 'Brak dowodu potwierdzającego obecność podejrzanego na miejscu zbrodni.',
      };
    }

    if (docIds.includes('IMG-09')) {
      return {
        requirementId: 'presence',
        name: 'Obecność na miejscu',
        isSatisfied: false,
        statusText: 'Błąd',
        attachedDocumentIds: docIds,
        feedbackMessage:
          'Ślad obuwia o powszechnym wzorze jodełki (IMG-09) nie pozwala na powiązanie z konkretną osobą podejrzanego.',
      };
    }

    if (docIds.includes('AKT-008') && !docIds.includes('AKT-012')) {
      return {
        requirementId: 'presence',
        name: 'Obecność na miejscu',
        isSatisfied: false,
        statusText: 'Błąd',
        attachedDocumentIds: docIds,
        feedbackMessage:
          'Notatka dzielnicowego (AKT-008) dotyczy zdarzenia z dnia 11.03 i nie odnosi się do czasu i miejsca zbrodni.',
      };
    }

    const hasGatekeeper = docIds.includes('AKT-012');
    const hasCarRegistration = docIds.includes('K-01');

    if (hasGatekeeper && hasCarRegistration) {
      return {
        requirementId: 'presence',
        name: 'Obecność na miejscu',
        isSatisfied: true,
        statusText: 'Zaliczono',
        attachedDocumentIds: docIds,
      };
    }

    return {
      requirementId: 'presence',
      name: 'Obecność na miejscu',
      isSatisfied: false,
      statusText: 'Błąd',
      attachedDocumentIds: docIds,
      feedbackMessage:
        'Samo zeznanie dozorcy (AKT-012) o wjeździe Żuka wymaga powiązania pojazdu SBI 7305 z osobą podejrzanego w rejestrze KSIP (K-01).',
    };
  }

  private static evaluateMaterialTrace(items: EvidenceItem[]): WarrantRequirementEvaluation {
    const docIds = items.map((i) => i.documentId);

    if (docIds.length === 0) {
      return {
        requirementId: 'material_trace',
        name: 'Ślad materialny',
        isSatisfied: false,
        statusText: 'Brak',
        attachedDocumentIds: [],
        feedbackMessage: 'Pod wymóg „Ślad materialny” nie podpięto żadnego dowodu.',
      };
    }

    if (docIds.includes('IMG-09')) {
      return {
        requirementId: 'material_trace',
        name: 'Ślad materialny',
        isSatisfied: false,
        statusText: 'Błąd',
        attachedDocumentIds: docIds,
        feedbackMessage: 'Odlew śladu obuwia w błocie (D-2) nie posiada cech indywidualnych.',
      };
    }

    if (docIds.includes('AKT-008') && !docIds.includes('AKT-014')) {
      return {
        requirementId: 'material_trace',
        name: 'Ślad materialny',
        isSatisfied: false,
        statusText: 'Błąd',
        attachedDocumentIds: docIds,
        feedbackMessage: 'Samo ujawnienie noża w rowie bez ekspertyzy laboratoryjnej nie łączy go z podejrzanym.',
      };
    }

    // Sprawdzenie czy podpięto opinię daktyloskopijną AKT-014 dla Zbigniewa M.
    const hasLabMatch = items.some(
      (item) =>
        item.documentId === 'AKT-014' &&
        (item.quote.includes('12 cech') ||
          item.quote.includes('Zbigniew M') ||
          item.quote.includes('zgodny') ||
          !item.quote.includes('nie jest zgodny'))
    );

    const hasNegativeMatch = items.some(
      (item) => item.documentId === 'AKT-014' && item.quote.includes('nie jest zgodny')
    );

    if (hasNegativeMatch) {
      return {
        requirementId: 'material_trace',
        name: 'Ślad materialny',
        isSatisfied: false,
        statusText: 'Błąd',
        attachedDocumentIds: docIds,
        feedbackMessage:
          'Wynik ekspertyzy wobec wskazanej osoby jest negatywny (brak zgodności linii papilarnych).',
      };
    }

    if (hasLabMatch) {
      return {
        requirementId: 'material_trace',
        name: 'Ślad materialny',
        isSatisfied: true,
        statusText: 'Zaliczono',
        attachedDocumentIds: docIds,
      };
    }

    return {
      requirementId: 'material_trace',
      name: 'Ślad materialny',
      isSatisfied: false,
      statusText: 'Błąd',
      attachedDocumentIds: docIds,
      feedbackMessage: 'Wymagana jest opinia laboratorium kryminalistycznego potwierdzająca zgodność śladów z podejrzanym (AKT-014).',
    };
  }

  private static evaluateMotive(items: EvidenceItem[]): WarrantRequirementEvaluation {
    const docIds = items.map((i) => i.documentId);

    if (docIds.length === 0) {
      return {
        requirementId: 'motive',
        name: 'Motyw',
        isSatisfied: false,
        statusText: 'Brak',
        attachedDocumentIds: [],
        feedbackMessage: 'Brak dowodu uprawdopodobniającego motyw zabójstwa.',
      };
    }

    if (docIds.includes('AKT-008') && !docIds.includes('AKT-013')) {
      return {
        requirementId: 'motive',
        name: 'Motyw',
        isSatisfied: false,
        statusText: 'Błąd',
        attachedDocumentIds: docIds,
        feedbackMessage:
          'Awantura między zbieraczami z 11.03 opisana w notatce dzielnicowego nie wskazuje motywu zabójstwa dla podejrzanego Zbigniewa M.',
      };
    }

    const hasSister = docIds.includes('AKT-013');
    const hasFinancialClue = docIds.includes('AKT-007') || docIds.includes('AKT-005');

    if (hasSister && hasFinancialClue) {
      return {
        requirementId: 'motive',
        name: 'Motyw',
        isSatisfied: true,
        statusText: 'Zaliczono',
        attachedDocumentIds: docIds,
      };
    }

    return {
      requirementId: 'motive',
      name: 'Motyw',
      isSatisfied: false,
      statusText: 'Błąd',
      attachedDocumentIds: docIds,
      feedbackMessage:
        'Należy wykazać motyw finansowy: zeznanie siostry o roszczeniach brata (AKT-013) oraz fakturę z rozliczeniem (AKT-007) lub biling natarczywych połączeń (AKT-005).',
    };
  }
}
