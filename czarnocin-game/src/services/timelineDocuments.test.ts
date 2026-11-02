import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import timelineEventsJson from '../data/cases/case-01/timeline-events.json';
import documentsJson from '../data/cases/case-01/documents.json';
import { useTimelineStore } from '../stores/timelineStore';
import { useActiveCaseStore } from '../stores/activeCaseStore';
import { useWindowManagerStore } from '../stores/windowManagerStore';

describe('Integracja Osi Czasu z Aktami Sprawy (Timeline & Documents)', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('każde zdarzenie na osi czasu odwołuje się do istniejącego dokumentu w aktach (AKT-xxx)', () => {
    const docIds = new Set(documentsJson.map((d) => d.id));

    expect(timelineEventsJson.length).toBeGreaterThanOrEqual(15);

    for (const event of timelineEventsJson) {
      expect(event.documentId).toMatch(/^AKT-\d{3}$/);
      expect(docIds.has(event.documentId)).toBe(true);
    }
  });

  it('kluczowe paski na wykresie osi czasu mapują się na odpowiednie akta', () => {
    // 1. Zeznanie o alibi M. w barze -> AKT-006
    const akt006 = documentsJson.find((d) => d.id === 'AKT-006');
    expect(akt006).toBeDefined();
    expect(akt006?.title).toContain('Protokół przesłuchania świadka Zbigniewa M.');

    // 2. Biling BTS (Centrum oraz Huta-Płn.) -> AKT-011
    const akt011 = documentsJson.find((d) => d.id === 'AKT-011');
    expect(akt011).toBeDefined();
    expect(akt011?.title).toContain('Wydruk bilingu telefonu Zbigniewa M.');

    // 3. Ruch Żuka przez Bramę nr 3 -> AKT-012
    const akt012 = documentsJson.find((d) => d.id === 'AKT-012');
    expect(akt012).toBeDefined();
    expect(akt012?.title).toContain('Józefa K. z kopią książki wjazdów');

    // 4. Ujawnienie zwłok -> AKT-002
    const akt002 = documentsJson.find((d) => d.id === 'AKT-002');
    expect(akt002).toBeDefined();
    expect(akt002?.title).toContain('Protokół oględzin miejsca zdarzenia');
  });

  it('wywołanie otwarcia dokumentu z osi czasu aktualizuje activeDocument w activeCaseStore oraz otwiera okno w windowManager', async () => {
    const caseStore = useActiveCaseStore();
    const windowManager = useWindowManagerStore();

    await caseStore.loadCase('case-01');

    // Symulacja kliknięcia paska alibi M. (AKT-006)
    caseStore.setActiveDocument('AKT-006');
    windowManager.openWindow('case-viewer');

    expect(caseStore.activeDocumentId).toBe('AKT-006');
    expect(caseStore.activeDocument?.id).toBe('AKT-006');
    expect(windowManager.windows['case-viewer'].isOpen).toBe(true);
    expect(windowManager.windows['case-viewer'].isMinimized).toBe(false);
    expect(windowManager.activeWindowId).toBe('case-viewer');

    // Symulacja kliknięcia paska BTS Huta-Płn. (AKT-011)
    caseStore.setActiveDocument('AKT-011');
    windowManager.openWindow('case-viewer');

    expect(caseStore.activeDocumentId).toBe('AKT-011');
    expect(caseStore.activeDocument?.id).toBe('AKT-011');

    // Symulacja kliknięcia paska Żuk wjazd/wyjazd (AKT-012)
    caseStore.setActiveDocument('AKT-012');
    expect(caseStore.activeDocumentId).toBe('AKT-012');
  });

  it('detekcja sprzeczności w timelineStore prawidłowo rozpoznaje kolizję alibi z bilingiem', () => {
    const timelineStore = useTimelineStore();

    expect(timelineStore.conflictDetected).toBe(true);
    expect(timelineStore.conflictDescription).toContain('21:41–22:19');
  });
});
