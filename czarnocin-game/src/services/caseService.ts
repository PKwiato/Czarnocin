import type {
  CaseData,
  CaseDocument,
  CasePhoto,
  FieldAction,
  TimelineEvent,
  InternalMail,
} from '../types/case.types';
import caseDataJson from '../data/cases/case-01/case.json';
import documentsJson from '../data/cases/case-01/documents.json';
import photosJson from '../data/cases/case-01/photos.json';
import fieldActionsJson from '../data/cases/case-01/field-actions.json';
import timelineEventsJson from '../data/cases/case-01/timeline-events.json';
import mailsJson from '../data/cases/case-01/mails.json';
import { supabase } from './supabaseClient';

class CaseService {
  private isSupabaseAvailable = false;

  constructor() {
    this.checkSupabaseConnection();
  }

  private async checkSupabaseConnection(): Promise<boolean> {
    try {
      const { data, error } = await supabase.from('cases').select('id').limit(1);
      this.isSupabaseAvailable = !error && !!data;
    } catch {
      this.isSupabaseAvailable = false;
    }
    return this.isSupabaseAvailable;
  }

  /**
   * Pobiera metadane sprawy (z bazy lub fallback do JSON)
   */
  public async getCaseData(caseId = 'case-01'): Promise<CaseData> {
    if (this.isSupabaseAvailable) {
      try {
        const { data, error } = await supabase
          .from('cases')
          .select('*')
          .eq('id', caseId)
          .single();

        if (!error && data) {
          return {
            id: data.id,
            code: data.code,
            title: data.title,
            subtitle: (data as any).subtitle || caseDataJson.subtitle,
            startingDate: (data as any).startingDate || caseDataJson.startingDate,
            startingClock: (data as any).startingClock || caseDataJson.startingClock,
            startingBudgetHours: data.starting_budget_hours || 80,
            ksipQueriesLimit: 10,
            rewardPoints: 100,
            initialSuspects: caseDataJson.initialSuspects,
          };
        }
      } catch (err) {
        console.warn('Supabase getCaseData failed, using local JSON fallback', err);
      }
    }
    return caseDataJson as CaseData;
  }

  /**
   * Pobiera wszystkie dokumenty sprawy z oznaczeniem dostępności
   */
  public async getDocuments(caseId = 'case-01'): Promise<CaseDocument[]> {
    return (documentsJson as CaseDocument[]).filter((doc) => doc.caseId === caseId);
  }

  /**
   * Pobiera pojedynczy dokument po identyfikatorze (np. 'AKT-001')
   */
  public async getDocumentById(docId: string, caseId = 'case-01'): Promise<CaseDocument | null> {
    const docs = await this.getDocuments(caseId);
    return docs.find((d) => d.id === docId) || null;
  }

  /**
   * Pobiera zdjęcia kryminalistyczne z miejsca zdarzenia
   */
  public async getPhotos(caseId = 'case-01'): Promise<CasePhoto[]> {
    return (photosJson as CasePhoto[]).filter((photo) => photo.caseId === caseId);
  }

  /**
   * Pobiera listę czynności operacyjnych w terenie
   */
  public async getFieldActions(caseId = 'case-01'): Promise<FieldAction[]> {
    return (fieldActionsJson as FieldAction[]).filter((action) => action.caseId === caseId);
  }

  /**
   * Wykonanie zlecenia w terenie (odliczenie godzin budżetowych i odblokowanie dokumentów)
   */
  public async executeFieldAction(
    actionId: string,
    currentBudget: number,
    caseId = 'case-01'
  ): Promise<{
    success: boolean;
    costHours: number;
    newBudget: number;
    unlockedDocumentIds: string[];
    message: string;
  }> {
    const actions = await this.getFieldActions(caseId);
    const action = actions.find((a) => a.id === actionId);

    if (!action) {
      return {
        success: false,
        costHours: 0,
        newBudget: currentBudget,
        unlockedDocumentIds: [],
        message: 'Nie znaleziono wybranego zlecenia operacyjnego.',
      };
    }

    if (currentBudget < action.costHours) {
      return {
        success: false,
        costHours: action.costHours,
        newBudget: currentBudget,
        unlockedDocumentIds: [],
        message: `Niewystarczający budżet roboczogodzin (wymagane: ${action.costHours}h, pozostało: ${currentBudget}h).`,
      };
    }

    const newBudget = currentBudget - action.costHours;

    return {
      success: true,
      costHours: action.costHours,
      newBudget,
      unlockedDocumentIds: action.unlockedDocumentIds,
      message: `Zlecenie „${action.name}” zostało zrealizowane. Czas realizacji: ${action.costHours}h. Nowe dokumenty włączono do akt.`,
    };
  }

  /**
   * Pobiera zdarzenia do osi czasu
   */
  public async getTimelineEvents(caseId = 'case-01'): Promise<TimelineEvent[]> {
    return (timelineEventsJson as TimelineEvent[]);
  }

  /**
   * Pobiera pocztę wewnętrzną
   */
  public async getMails(caseId = 'case-01'): Promise<InternalMail[]> {
    return (mailsJson as InternalMail[]).filter((m) => m.caseId === caseId);
  }
}

export const caseService = new CaseService();
