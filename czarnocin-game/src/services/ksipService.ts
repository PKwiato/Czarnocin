import type { KsipRecord } from '../types/case.types';
import type { EvidenceItem } from '../types/evidence.types';
import ksipRecordsJson from '../data/cases/case-01/ksip-records.json';
import { supabase } from './supabaseClient';

export interface KsipSearchResult {
  records: KsipRecord[];
  queriesUsed: number;
  queriesLeft: number;
  isLimitReached: boolean;
  message?: string;
}

class KsipService {
  private readonly defaultLimit = 10;

  /**
   * Wykonuje wyszukiwanie krzyżowe w rejestrach KSIP
   */
  public async search(
    rawQuery: string,
    currentQueriesUsed = 0,
    queryLimit = this.defaultLimit,
    sessionId?: string
  ): Promise<KsipSearchResult> {
    const trimmed = rawQuery.trim();
    if (!trimmed) {
      return {
        records: [],
        queriesUsed: currentQueriesUsed,
        queriesLeft: Math.max(0, queryLimit - currentQueriesUsed),
        isLimitReached: currentQueriesUsed >= queryLimit,
        message: 'Wpisz zapytanie (np. numer rejestracyjny, nazwisko, NIP lub numer telefonu).',
      };
    }

    if (currentQueriesUsed >= queryLimit) {
      return {
        records: [],
        queriesUsed: currentQueriesUsed,
        queriesLeft: 0,
        isLimitReached: true,
        message: `Przekroczono dopuszczalny limit ${queryLimit} zapytań w KSIP dla Twojego stopnia. Ryzyko wszczęcia postępowania wyjaśniającego BSW.`,
      };
    }

    const newQueryCount = currentQueriesUsed + 1;

    // Próba zapisu do ksip_audit_log w Supabase
    if (sessionId) {
      try {
        await supabase.from('ksip_audit_log').insert({
          session_id: sessionId,
          query_text: trimmed,
        });
      } catch {
        // Cichy fallback audit logu
      }
    }

    const normalizedQuery = trimmed.toLowerCase().replace(/[\s-]/g, '');
    const allRecords = ksipRecordsJson as unknown as KsipRecord[];

    const matchingRecords = allRecords.filter((rec) => {
      const matchSearchQuery = rec.searchQuery.toLowerCase().replace(/[\s-]/g, '').includes(normalizedQuery);
      const matchDisplayTitle = rec.displayTitle.toLowerCase().includes(trimmed.toLowerCase());
      const matchCategory = rec.category.toLowerCase().includes(trimmed.toLowerCase());
      const matchFields = Object.values(rec.fields).some((val) =>
        typeof val === 'string' && (
          val.toLowerCase().includes(trimmed.toLowerCase()) ||
          val.toLowerCase().replace(/[\s-]/g, '').includes(normalizedQuery)
        )
      );

      return matchSearchQuery || matchDisplayTitle || matchCategory || matchFields;
    });

    const queriesLeft = Math.max(0, queryLimit - newQueryCount);

    return {
      records: matchingRecords,
      queriesUsed: newQueryCount,
      queriesLeft,
      isLimitReached: queriesLeft <= 0,
      message: matchingRecords.length === 0 ? `Brak wpisów w KSIP dla hasła: "${trimmed}".` : undefined,
    };
  }

  /**
   * Tworzy obiekt dowodu EvidenceItem z rekordu KSIP gotowy do wpięcia do akt
   */
  public createEvidenceFromRecord(record: KsipRecord, caseId = 'case-01'): EvidenceItem {
    const summary = Object.entries(record.fields)
      .map(([k, v]) => `${k}: ${v}`)
      .join(' | ');

    return {
      id: `ev-${record.id.toLowerCase()}-${Date.now()}`,
      caseId,
      documentId: record.id,
      type: 'ksip_record',
      quote: `[ODPIS KSIP ${record.id}] ${record.displayTitle}\n${summary}`,
      color: 'yellow',
      sourceTitle: `Baza KSIP: ${record.displayTitle}`,
      targetRequirement: record.category === 'vehicle' ? 'presence' : 'material_trace',
      createdAt: new Date().toISOString(),
      metadata: {
        recordId: record.id,
        category: record.category,
        isMetaClue: record.isMetaClue,
        ...record.fields,
      },
    };
  }
}

export const ksipService = new KsipService();
