import { describe, it, expect } from 'vitest';
import documents from '../data/cases/case-01/documents.json';

describe('Formatowanie i spójność dokumentów w Markerze Aktowym', () => {
  it('wszystkie 16 dokumentów posiada poprawną liczbę stron odpowiadającą pagesCount', () => {
    expect(documents.length).toBe(16);

    for (const doc of documents) {
      expect(doc.id).toMatch(/^AKT-\d{3}$/);
      expect(doc.title).toBeTruthy();
      expect(doc.pages.length).toBe(doc.pagesCount);
      expect(doc.pages.length).toBeGreaterThan(0);
    }
  });

  it('żaden dokument nie zawiera wycieków deweloperskich ani surowego niesformatowanego markdownu', () => {
    for (const doc of documents) {
      for (const page of doc.pages) {
        // Brak surowych poziomych linii <p>---</p>
        expect(page).not.toContain('<p>---</p>');
        // Brak nagłówków deweloperskich z dokumentu projektowego
        expect(page).not.toContain('# Część 2');
        expect(page).not.toContain('# Część 3');
        expect(page).not.toContain('Uwaga projektowa:');
        expect(page).not.toContain('Wariant A:');
        expect(page).not.toContain('Wariant B:');
        // Brak niesformatowanych tabel markdown (np. | --- |)
        expect(page).not.toContain('| --- |');
      }
    }
  });

  it('dokumenty posiadają bogate formatowanie HTML (tabele, akapity, nagłówki)', () => {
    // AKT-003, AKT-005, AKT-011, AKT-012 posiadają sformatowane tabele
    const tableDocs = ['AKT-003', 'AKT-005', 'AKT-011', 'AKT-012'];
    for (const id of tableDocs) {
      const doc = documents.find((d) => d.id === id);
      expect(doc).toBeDefined();
      const allContent = doc!.pages.join('\n');
      expect(allContent).toContain('<table class="dossier-table">');
      expect(allContent).toContain('<th>');
      expect(allContent).toContain('<td>');
    }
  });

  it('kluczowe poszlaki do wniosku o areszt i osi czasu są obecne w treści dokumentów', () => {
    const akt006 = documents.find((d) => d.id === 'AKT-006')!;
    const akt006Content = akt006.pages.join(' ');
    expect(akt006Content).toContain('od około 20:30 do 22:30');
    expect(akt006Content).toContain('nie opuszczałem lokalu');
    expect(akt006Content).toContain('W ogóle tam nie jeżdżę, nie znam tego miejsca');
    expect(akt006Content).toContain('mężczyzna z ochrony');

    const akt011 = documents.find((d) => d.id === 'AKT-011')!;
    const akt011Content = akt011.pages.join(' ');
    expect(akt011Content).toContain('Huta-Płn.');
    expect(akt011Content).toContain('501 224 018');

    const akt012 = documents.find((d) => d.id === 'AKT-012')!;
    const akt012Content = akt012.pages.join(' ');
    expect(akt012Content).toContain('Żuk');
    expect(akt012Content).toContain('SBI 73');
    expect(akt012Content).toContain('21:45');
    expect(akt012Content).toContain('22:15');

    const akt014 = documents.find((d) => d.id === 'AKT-014')!;
    const akt014Content = akt014.pages.join(' ');
    expect(akt014Content).toContain('12 cech');
    expect(akt014Content).toContain('Zbigniew M');
    expect(akt014Content).toContain('A Rh+');

    const akt013 = documents.find((d) => d.id === 'AKT-013')!;
    const akt013Content = akt013.pages.join(' ');
    expect(akt013Content).toContain('Zbyszek płaci mi połowę stawki');
    expect(akt013Content).toContain('fakturę z tej firmy');

    const akt015 = documents.find((d) => d.id === 'AKT-015')!;
    const akt015Content = akt015.pages.join(' ');
    expect(akt015Content).toContain('Tadeusz W.');
    expect(akt015Content).toContain('19:50');
    expect(akt015Content).toContain('całą noc, bez opuszczania izby');
  });
});
