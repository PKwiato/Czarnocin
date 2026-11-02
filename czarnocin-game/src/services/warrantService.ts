import type {
  WarrantFormState,
  WarrantEvaluationResult,
} from '../types/warrant.types';
import { WarrantValidator } from './warrantValidator';
import { supabase } from './supabaseClient';

class WarrantService {
  private readonly storageKey = 'czarnocin_warrant_draft';

  /**
   * Ewaluacja wniosku o aresztowanie przez silnik prokuratorski
   */
  public evaluate(form: WarrantFormState): WarrantEvaluationResult {
    return WarrantValidator.evaluateCase01(form);
  }

  /**
   * Zapis szkicu wniosku
   */
  public async saveDraft(form: WarrantFormState, sessionId?: string): Promise<boolean> {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(form));
    } catch {
      // Ignoruj błędy localStorage
    }

    if (sessionId) {
      try {
        const alibiIds = (form.requirements.alibi || []).map((e) => e.id);
        const presenceIds = (form.requirements.presence || []).map((e) => e.id);
        const traceIds = (form.requirements.material_trace || []).map((e) => e.id);
        const motiveIds = (form.requirements.motive || []).map((e) => e.id);

        await supabase.from('warrants').upsert({
          session_id: sessionId,
          case_id: form.caseId,
          suspect_name: form.suspectName,
          alibi_evidence_ids: alibiIds,
          presence_evidence_ids: presenceIds,
          material_trace_evidence_ids: traceIds,
          motive_evidence_ids: motiveIds,
          status: 'draft',
        });
      } catch {
        // Fallback do localStorage
      }
    }
    return true;
  }

  /**
   * Wczytanie zapisanego szkicu
   */
  public loadDraft(caseId = 'case-01'): WarrantFormState | null {
    try {
      const data = localStorage.getItem(this.storageKey);
      if (data) {
        const parsed = JSON.parse(data) as WarrantFormState;
        if (parsed.caseId === caseId) {
          return parsed;
        }
      }
    } catch {
      // Błąd parsowania
    }
    return null;
  }

  /**
   * Złożenie wniosku do prokuratora
   */
  public async submitWarrant(
    form: WarrantFormState,
    sessionId?: string
  ): Promise<{ result: WarrantEvaluationResult; saved: boolean }> {
    const evaluation = this.evaluate(form);

    let saved = false;
    if (sessionId) {
      try {
        const alibiIds = (form.requirements.alibi || []).map((e) => e.id);
        const presenceIds = (form.requirements.presence || []).map((e) => e.id);
        const traceIds = (form.requirements.material_trace || []).map((e) => e.id);
        const motiveIds = (form.requirements.motive || []).map((e) => e.id);

        const { data: warrant } = await supabase
          .from('warrants')
          .insert({
            session_id: sessionId,
            case_id: form.caseId,
            suspect_name: form.suspectName,
            alibi_evidence_ids: alibiIds,
            presence_evidence_ids: presenceIds,
            material_trace_evidence_ids: traceIds,
            motive_evidence_ids: motiveIds,
            status: evaluation.isApproved ? 'approved' : 'rejected',
            submitted_at: new Date().toISOString(),
          })
          .select('id')
          .single();

        saved = !!warrant;
      } catch (err) {
        console.warn('Supabase warrant save failed, using local status', err);
      }
    }

    return {
      result: evaluation,
      saved,
    };
  }
}

export const warrantService = new WarrantService();
