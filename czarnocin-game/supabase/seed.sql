-- SEED DATA: Projekt Czarnocin 2002 (Sprawa 1: Ds. 112/02)

-- 1. Wpisanie sprawy Ds. 112/02
INSERT INTO public.cases (id, code, title, subtitle, required_rank, starting_budget_hours, ksip_queries_limit, reward_points)
VALUES ('case-01', 'Ds. 112/02', 'Złom na bocznicy', 'Zabójstwo mężczyzny na bocznicy kolejowej Huty Silesia', 'mlodszy_aspirant', 80, 10, 100)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;

-- 2. Zlecenia w terenie (Field Actions)
INSERT INTO public.field_actions (id, case_id, name, cost_hours, requires_superior_approval, result_document_ids)
VALUES ('Z-01', 'case-01', 'Przesłuchanie obsługi i gości baru „Pod Lipą”', 6, false, ARRAY['AKT-009', 'AKT-010']::TEXT[])
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.field_actions (id, case_id, name, cost_hours, requires_superior_approval, result_document_ids)
VALUES ('Z-02', 'case-01', 'Wydruk bilingu połączeń wskazanego numeru komórkowego', 10, true, ARRAY['AKT-011']::TEXT[])
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.field_actions (id, case_id, name, cost_hours, requires_superior_approval, result_document_ids)
VALUES ('Z-03', 'case-01', 'Przesłuchanie stróża bramy nr 3 Huty Silesia', 6, false, ARRAY['AKT-012']::TEXT[])
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.field_actions (id, case_id, name, cost_hours, requires_superior_approval, result_document_ids)
VALUES ('Z-04', 'case-01', 'Przesłuchanie siostry pokrzywdzonego (Teresy D.)', 6, false, ARRAY['AKT-013']::TEXT[])
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.field_actions (id, case_id, name, cost_hours, requires_superior_approval, result_document_ids)
VALUES ('Z-05', 'case-01', 'Ekspertyza noża D-1 i porównanie daktyloskopijne', 14, true, ARRAY['AKT-014']::TEXT[])
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.field_actions (id, case_id, name, cost_hours, requires_superior_approval, result_document_ids)
VALUES ('Z-06', 'case-01', 'Weryfikacja alibi wskazanej osoby (Tadeusz W.)', 6, false, ARRAY['AKT-015']::TEXT[])
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.field_actions (id, case_id, name, cost_hours, requires_superior_approval, result_document_ids)
VALUES ('Z-07', 'case-01', 'Ponowne przesłuchanie Zbigniewa M.', 6, false, ARRAY['AKT-016']::TEXT[])
ON CONFLICT (id) DO NOTHING;

-- 3. Baza KSIP (K-01 do K-08)
INSERT INTO public.ksip_records (id, category, search_query, display_title, record_data, is_meta_clue)
VALUES ('K-01', 'vehicle', 'SBI 7305', 'Rejestr Pojazdów: FSC Żuk A 07 (SBI 7305)', '{"Pojazd": "FSC Żuk A 07 (samochód dostawczy), kolor biały, rok prod. 1987", "Rejestracja": "SBI 7305, wydana 1991 r.", "Właściciel": "Zbigniew M., ul. Hutnicza 21, Czarnocin (punkt skupu złomu)", "Uwagi": "Brak adnotacji o kradzieży lub wycofaniu z ruchu."}'::jsonb, false)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.ksip_records (id, category, search_query, display_title, record_data, is_meta_clue)
VALUES ('K-02', 'person', 'Zbigniew M.', 'Kartoteka Ludności: Zbigniew M.', '{"Dane osobowe": "Zbigniew M., syn Jana, ur. 07.11.1949 r., zam. Czarnocin, ul. Hutnicza 21", "Telefony": "Komórkowy: 502 281 930, Stacjonarny skupu: (032) 255 41 09", "Pojazdy": "FSC Żuk A 07, rej. SBI 7305", "Notowania": "1996 r., art. 291 § 1 k.k. (paserstwo), SR w Czarnocinie, sygn. II K 118/96 (1 rok w zawieszeniu na 3 lata)", "Kartoteka daktyloskopijna": "TAK, karta nr CZ/D/1996/0417"}'::jsonb, false)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.ksip_records (id, category, search_query, display_title, record_data, is_meta_clue)
VALUES ('K-03', 'person', 'Tadeusz W.', 'Kartoteka Ludności: Tadeusz W.', '{"Dane osobowe": "Tadeusz W., ur. 1963, zam. Czarnocin, os. Zachód", "Notowania": "1998 r., art. 157 § 2 k.k. (uszkodzenie ciała), wyrok w zawieszeniu. Dwie interwencje dzielnicowego.", "Kartoteka daktyloskopijna": "TAK, karta nr CZ/D/1998/0102"}'::jsonb, false)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.ksip_records (id, category, search_query, display_title, record_data, is_meta_clue)
VALUES ('K-04', 'phone', '602 552 071', 'Wykaz Numerów: 602 552 071 (Era)', '{"Abonent": "Brak bezpośrednich danych abonenckich w KSIP", "Powiązania": "Notatka służbowa nr 214/99 WRD z 19.08.1999 r.: kontrola ciężarówki SBI 2218. Kierowca podał numer jako kontakt ''ochrona''", "Uwagi": "Numer figuruje jako kontakt agencji ochrony mienia (nazwa agencji niewpisana w notatce)."}'::jsonb, true)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.ksip_records (id, category, search_query, display_title, record_data, is_meta_clue)
VALUES ('K-05', 'company', 'TRANS-MET', 'Rejestr Podmiotów: TRANS-MET sp. z o.o.', '{"Nazwa i adres": "TRANS-MET sp. z o.o., ul. Przemysłowa 14, Czarnocin, NIP 625-xx-xx-xxx", "Przedmiot działalności": "Skup i transport złomu metali", "Pojazdy": "Ciężarowy, rej. SBI 2218", "Notatki": "Kontrola drogowa z dnia 19.08.1999 r. (notatka nr 214/99)"}'::jsonb, true)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.ksip_records (id, category, search_query, display_title, record_data, is_meta_clue)
VALUES ('K-06', 'person', 'Roman S.', 'Kartoteka Ludności: Roman S.', '{"Dane osobowe": "Roman S., ur. 1953, zam. Czarnocin, os. Zachód, zatrudniony w Zakładzie Energetycznym", "Notowania": "Brak notowań kryminalnych"}'::jsonb, false)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.ksip_records (id, category, search_query, display_title, record_data, is_meta_clue)
VALUES ('K-07', 'phone', '(032) 255 41 09', 'Wykaz Numerów: (032) 255 41 09', '{"Abonent": "Zbigniew M., punkt skupu złomu i metali kolorowych, ul. Hutnicza 21, Czarnocin", "Linia": "Telekomunikacja Polska S.A., centrala miejska"}'::jsonb, false)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.ksip_records (id, category, search_query, display_title, record_data, is_meta_clue)
VALUES ('K-08', 'person', 'Henryk D.', 'Kartoteka Ludności: Henryk D. (pokrzywdzony)', '{"Dane osobowe": "Henryk D., ur. 1954, zam. Czarnocin, os. Wschód", "Notowania": "1997 r., art. 278 § 1 k.k. (kradzież metali), postępowanie umorzone. 2000 r., wykroczenie (mandat).", "Kartoteka daktyloskopijna": "BRAK karty w kartotece"}'::jsonb, false)
ON CONFLICT (id) DO NOTHING;

-- 4. Zdjęcia oględzin miejsca zdarzenia (IMG-01 do IMG-12)
INSERT INTO public.case_photos (id, case_id, file_name, title, description, technician_notes, is_trap)
VALUES ('IMG-01', 'case-01', 'IMG_0001.JPG', 'Bocznica kolejowa Huty Silesia – widok ogólny', 'Widok ogólny bocznicy nr 4 od strony bramy nr 3. Tor, sześć wagonów towarowych, w głębi oświetlenie techniczne.', 'Warunki: noc, mgła, wilgoć po opadach deszczu.', false)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.case_photos (id, case_id, file_name, title, description, technician_notes, is_trap)
VALUES ('IMG-02', 'case-01', 'IMG_0002.JPG', 'Tor nr 4 i wagon towarowy nr 665-4112', 'Zbliżenie na wagon nr 665-4112 z odległości ok. 20 m.', 'Ślady rdzy, resztki ładunku złomu miedzianego.', false)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.case_photos (id, case_id, file_name, title, description, technician_notes, is_trap)
VALUES ('IMG-03', 'case-01', 'IMG_0003.JPG', 'Ułożenie zwłok względem toru i wagonu', 'Ciało mężczyzny leżące na plecach w odległości 40 cm od ściany wagonu.', 'Głowa w stronę szyny, brak widocznych śladów wleczenia.', false)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.case_photos (id, case_id, file_name, title, description, technician_notes, is_trap)
VALUES ('IMG-04', 'case-01', 'IMG_0004.JPG', 'Klatka piersiowa ofiary i uszkodzenie odzieży', 'Kurtka robocza z pojedynczym rozcięciem i rozległą plamą krwi.', 'Pojedyncza rana kłuta z lewej strony klatki.', false)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.case_photos (id, case_id, file_name, title, description, technician_notes, is_trap)
VALUES ('IMG-05', 'case-01', 'IMG_0005.JPG', 'Blaszana skrzynka narzędziowa przy torze', 'Skrzynka po prawej stronie ciała, zamknięta na kłódkę.', 'Brak śladów wyłamania zamka.', false)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.case_photos (id, case_id, file_name, title, description, technician_notes, is_trap)
VALUES ('IMG-06', 'case-01', 'IMG_0006.JPG', 'Kłódka skrzynki narzędziowej (D-4)', 'Kłódka żeliwna, nienaruszona, zabezpieczona do badań.', 'Ślady korozji atmosferycznej.', false)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.case_photos (id, case_id, file_name, title, description, technician_notes, is_trap)
VALUES ('IMG-07', 'case-01', 'IMG_0007.JPG', 'Nasyp tłuczniowy i plama krwi pod ciałem', 'Skrzepła krew na kamieniach podsypki torowej (40 x 30 cm).', 'Pobrano próbki do oznaczenia grupy krwi (A Rh+).', false)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.case_photos (id, case_id, file_name, title, description, technician_notes, is_trap)
VALUES ('IMG-08', 'case-01', 'IMG_0008.JPG', 'Ślad opony jednokołowej w kałuży', 'Odcisk wąskiej opony taczki lub wózka dwukołowego.', 'Typowy sprzęt zbieraczy złomu, niepowiązany ze sprawcą.', false)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.case_photos (id, case_id, file_name, title, description, technician_notes, is_trap)
VALUES ('IMG-09', 'case-01', 'IMG_0009.JPG', 'Ślad obuwia w błocie przy skrzynce (D-2)', 'Ślad buta roboczego z miarką milimetrową. Długość 28 cm, wzór jodełka.', 'UWAGA: Bieżnik powszechny na Śląsku (popularne obuwie robocze Stomil). Trop pozorny bez cech indywidualnych.', true)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.case_photos (id, case_id, file_name, title, description, technician_notes, is_trap)
VALUES ('IMG-10', 'case-01', 'IMG_0010.JPG', 'Przedmioty ujawnione w kieszeniach denata', 'Zapalniczka, chusteczka, klucz, 7,40 zł w bilonie. Brak portfela i telefonu.', 'W kieszeni wewnętrznej zabezpieczono zgniecioną fakturę.', false)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.case_photos (id, case_id, file_name, title, description, technician_notes, is_trap)
VALUES ('IMG-11', 'case-01', 'IMG_0011.JPG', 'Zgnieciona faktura przewozowa D-3 z miarką', 'Faktura przewozowa nr 0231/02 z odręcznym dopiskiem ''ZbM / HD''.', 'Papier zwilgocony, tusz czytelny.', false)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.case_photos (id, case_id, file_name, title, description, technician_notes, is_trap)
VALUES ('IMG-12', 'case-01', 'IMG_0012.JPG', 'Perspektywa od zwłok w kierunku bramy nr 3', 'Odległość ok. 180 m w linii prostej do budki dozorcy.', 'Widoczność ograniczona przez wagony i mgłę.', false)
ON CONFLICT (id) DO NOTHING;

-- 5. Dokumenty akt (AKT-001 do AKT-016)
INSERT INTO public.documents (id, case_id, title, doc_type, pages_count, content_html, available_at_start, unlocked_by_action_id)
VALUES ('AKT-001', 'case-01', 'Polecenie służbowe nr 31/02', 'order', 1, '<p>*Skan faksu · strona 1 z 1 · dostępne od startu*</p>
<p>**KOMENDA MIEJSKA POLICJI W CZARNOCINIE** **POLECENIE SŁUŻBOWE nr 31/02** Czarnocin, dnia 14.03.2002 r., godz. 07:55

Na podstawie zgłoszenia z dnia 13.03.2002 r., przyjętego o godz. 23:55 od dozorcy bramy nr 3 Huty „Silesia”, polecam przejęcie i prowadzenie czynności w sprawie **Ds. 112/02**, dotyczącej zabójstwa mężczyzny, znalezionego na terenie bocznicy kolejowej Huty „Silesia”.

**Pokrzywdzony:** Henryk D., lat 47, zbieracz złomu, bez stałego zatrudnienia. **Przyczyna zgonu (wstępnie):** rana kłuta klatki piersiowej. Narzędzie zbrodni nie zostało odnalezione. **Czas zdarzenia:** wieczór 13.03.2002 r. **Kwalifikacja wstępna:** art. 148 § 1 k.k. **Zadanie:** ustalić sprawcę i skompletować wniosek o tymczasowe aresztowanie wraz z dowodami. **Uwaga:** prokurator nadzorujący oczekuje kompletnego wniosku. Wniosek z błędem merytorycznym będzie odrzucony.

z-ca Naczelnika Wydz. Kryminalnego *podpis nieczytelny*</p>
<p>---</p>', true, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.documents (id, case_id, title, doc_type, pages_count, content_html, available_at_start, unlocked_by_action_id)
VALUES ('AKT-002', 'case-01', 'Protokół oględzin miejsca zdarzenia', 'protocol', 4, '<p>*Skan, 4 strony · dostępne od startu*</p>
<p>**PROTOKÓŁ OGLĘDZIN MIEJSCA ZDARZENIA** Czarnocin, dnia 14.03.2002 r. Czynność rozpoczęto o godz. 00:35, zakończono o godz. 03:10.

**Obecni:** asp. Leszek Gajda (kierujący czynnością), st. technik kryminalistyki Andrzej Lasota, lek. med. Barbara Ciesielska, Józef K., dozorca bramy nr 3 Huty (zgłaszający).

**Warunki:** noc, ok. +3°C, od popołudnia do około godz. 19:00 padający deszcz, grunt rozmokły. Oświetlenie: reflektor policyjny.

**Strona 1. Opis miejsca.** Oglądane miejsce to bocznica nr 4 na terenie Huty „Silesia”, oślepły tor, od strony ul. Hutniczej dostępny przez bramę nr 3 (odległość do miejsca zdarzenia ok. 180 m) oraz przez furtkę dla pieszych przy bramie. Na torze stoi sześć wagonów towarowych. Teren częściowo ogrodzony, ogrodzenie w kilku miejscach uszkodzone, bez oznak świeżego uszkodzenia.

**Strona 2. Zwłoki.** Na tle wagonu nr 665-4112, w odległości ok. 40 cm od jego ściany leży na plecach mężczyzna w wieku ok. 45–50 lat, głowa skierowana w stronę toru. Ubranie: kurtka robocza, ciemne spodnie, buty gumowe. Na kurtce w okolicy klatki piersiowej plama krwi i niewielkie przerwanie tkaniny. Obok, po prawej stronie zwłok, stoi blaszana skrzynka narzędziowa zamknięta na kłódkę, nieuszkodzona. W lewej wewnętrznej kieszeni kurtki znaleziono zgnieciony dokument (faktura przewozowa, zabezpieczono jako D-3). W pozostałych kieszeniach: zapalniczka, chusteczka, klucz do mieszkania i 7,40 zł w bilonie. Nie znaleziono portfela ani telefonu komórkowego.

**Strona 3. Ślady.** Pod zwłokami na tłuczniu plama krwi o wymiarach ok. 40 × 30 cm. Na ziemi wokół zwłok widoczne liczne niewyraźne ślady obuwia. Jeden ślad jest wyraźny, znajduje się w błocie przy skrzynce narzędziowej (zdjęcie IMG-09, odlew gipsowy D-2): długość ok. 28 cm, bieżnik typu „jodełka”, obuwie robocze. Nie stwierdzono śladów szamotaniny. Narzędzia zbrodni na miejscu nie ujawniono, zabezpieczono jedynie kłódkę skrzynki (D-4).

**Strona 4. Ustalenia dodatkowe.** Józef K. oświadczył, że zwłoki znalazł ok. godz. 23:50 podczas obchodu terenu. Zdjęcia wykonano aparatem cyfrowym (12 plików, IMG-01 do IMG-12). Protokół odczytano i podpisano.</p>
<div class=''markers-hint'' style=''color:#555;font-size:11px;border-top:1px dashed #aaa;padding-top:4px;''>Znaczniki: żółty – „wagon nr 665-4112”, „zgnieciony dokument (faktura przewozowa)”; niebieski – „Nie znaleziono portfela ani telefonu”; czerwony – brak.</div>
<p>---</p>', true, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.documents (id, case_id, title, doc_type, pages_count, content_html, available_at_start, unlocked_by_action_id)
VALUES ('AKT-003', 'case-01', 'Wykaz materiału fotograficznego (IMG-01 do IMG-12)', 'report', 1, '<p>*12 plików JPG, aparat 2.0 MP, data 14.03.2002 · dostępne od startu*</p>
<div class=''table-block''>| Plik | Opis kadru |
| --- | --- |
| IMG-01 | Widok ogólny bocznicy od strony bramy nr 3, tor, sześć wagonów, w głębi reflektor |
| IMG-02 | Tor nr 4 i wagon nr 665-4112 z odległości ok. 20 m |
| IMG-03 | Zwłoki w ujęciu ogólnym, ustawienie względem wagonu |
| IMG-04 | Zwłoki, tors i kurtka (plama krwi, przerwanie tkaniny) |
| IMG-05 | Skrzynka narzędziowa, widok z przodu, kłódka zamknięta |
| IMG-06 | Kłódka skrzynki w zbliżeniu, bez uszkodzeń |
| IMG-07 | Tłuczniowa nasyp i plama krwi pod ciałem |
| IMG-08 | Kałuża z odciskiem opony roweru lub wózka (nieistotny) |
| IMG-09 | **Ślad obuwia w błocie z miarką** (bieżnik „jodełka”, ok. 28 cm) |
| IMG-10 | Zawartość kieszeni: zapalniczka, chusteczka, klucz, bilon |
| IMG-11 | Zgnieciona faktura przewozowa na tle skali |
| IMG-12 | Widok z miejsca zdarzenia w stronę bramy nr 3 i furtki |</div>
<p>Uwaga projektowa: IMG-09 jest tropem pozornym. Bieżnik „jodełka” to popularne obuwie robocze i nie wskazuje na konkretną osobę.</p>
<p>---</p>', true, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.documents (id, case_id, title, doc_type, pages_count, content_html, available_at_start, unlocked_by_action_id)
VALUES ('AKT-004', 'case-01', 'Wstępna opinia lekarska o przyczynie zgonu', 'lab_opinion', 1, '<p>*Skan, 1 strona · dostępne od startu*</p>
<p>**WSTĘPNA OPINIA LEKARZA O PRZYCZYNIE ZGONU** Czarnocin, 14.03.2002 r., oględziny zwłok o godz. 01:20, lek. med. Barbara Ciesielska

Na zwłokach mężczyzny, zidentyfikowanego jako Henryk D., lat 47, stwierdzono pojedynczą ranę kłutą klatki piersiowej po stronie lewej, o długości kanału ok. 8 cm. Kształt rany wskazuje na narzędzie jednosieczne o szerokości ostrza ok. 2 cm i długości ostrza co najmniej 9 cm. Ranę spowodował jeden cios, zadany od przodu. Przyczyną zgonu jest krwotok wewnętrzny i uszkodzenie serca. Brak obrażeń obronnych na dłoniach.

Zgon nastąpił szybko, orientacyjnie w przedziale godz. 21:00–23:00 dnia 13.03.2002 r. (dokładniejsze ustalenie po sekcji). Wyczuwalna woń alkoholu, stężenie do oznaczenia.

Grupa krwi pokrzywdzonego: **A Rh+**. Dalsze wnioski po sekcji zwłok.</p>
<div class=''markers-hint'' style=''color:#555;font-size:11px;border-top:1px dashed #aaa;padding-top:4px;''>Znaczniki: żółty – „21:00–23:00”, „jeden cios, zadany od przodu”, „A Rh+”.</div>
<p>---</p>', true, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.documents (id, case_id, title, doc_type, pages_count, content_html, available_at_start, unlocked_by_action_id)
VALUES ('AKT-005', 'case-01', 'Wydruk bilingu telefonu Henryka D. (Idea)', 'billing', 2, '<p>*Wydruk operatora Idea, 2 strony · numer 501 224 018 · dostępne od startu*</p>
<p>**IDEA – WYKAZ POŁĄCZEŃ DLA NUMERU 501 224 018** Okres: 13.03.2002, 00:00–23:59. Lokalizacja wg stacji bazowej, w której zarejestrowano połączenie.</p>
<div class=''table-block''>| Data i godz. | Rodzaj | Numer | Czas | Stacja bazowa |
| --- | --- | --- | --- | --- |
| 13.03 07:48 | wychodzące | 501 330 774 | 0:31 | Czarnocin-Osiedle |
| 13.03 16:10 | wychodzące | (032) 255 41 09 | 0:48 | Czarnocin-Osiedle |
| 13.03 17:25 | wychodzące | (032) 255 41 09 | 1:12 | Czarnocin-Osiedle |
| 13.03 18:40 | wychodzące | (032) 255 41 09 | 2:05 | Czarnocin-Osiedle |
| 13.03 19:12 | wychodzące | (032) 255 41 09 | 0:30 | Czarnocin-Osiedle |
| 13.03 19:41 | wychodzące | (032) 255 41 09 | 3:00 | Czarnocin-Osiedle |
| 13.03 20:05 | przychodzące | 602 552 071 | 1:20 | Czarnocin-Osiedle |
| 13.03 20:22 | SMS wychodzący | 602 552 071 | – | Czarnocin Huta-Płn. |
| 13.03 21:41 | przychodzące | 502 281 930 | 0:42 | Czarnocin Huta-Płn. |</div>
<p>Uwaga operatora: zestawienie nie zawiera treści rozmów ani wiadomości.</p>
<div class=''markers-hint'' style=''color:#555;font-size:11px;border-top:1px dashed #aaa;padding-top:4px;''>Znaczniki: niebieski – pięć połączeń do numeru (032) 255 41 09, numer 602 552 071, połączenie z 502 281 930; żółty – stacja Huta-Płn. od 20:22.</div>
<p>---</p>', true, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.documents (id, case_id, title, doc_type, pages_count, content_html, available_at_start, unlocked_by_action_id)
VALUES ('AKT-006', 'case-01', 'Protokół przesłuchania świadka Zbigniewa M.', 'protocol', 3, '<p>*Skan faksu, 3 strony · dostępne od startu*</p>
<p>**PROTOKÓŁ PRZESŁUCHANIA ŚWIADKA** Czarnocin, dnia 14.03.2002 r., godz. 09:40. Przesłuchujący: asp. Leszek Gajda.

**Świadek:** Zbigniew M., syn Jana, ur. 07.11.1949 r., zam. Czarnocin, ul. Hutnicza 21 (punkt skupu złomu), tel. kom. 502 281 930, zawodowo: właściciel punktu skupu złomu i metali kolorowych. Niekarany, według oświadczenia.

Świadka pouczono o obowiązku mówienia prawdy i odpowiedzialności za fałszywe zeznania.

**Strona 1.** Świadek zeznaje: Zmarłego Henryka D. znam z widzenia, przychodził czasem z złomem do mojego punktu, jak wielu ludzi. Wczoraj, czyli w środę, 13 marca, po zamknięciu punktu o 18:00 poszedłem do baru „Pod Lipą” przy ul. Lipowej. Przyszedłem pieszo, mojego Żuka zostawiłem pod skupem. Byłem w barze **od około 20:30 do 22:30**, razem z kolegą Romanem S., który mieszka na osiedlu Zachód. Przez ten czas **nie opuszczałem lokalu**. Obsługiwała nas barmanka, która mnie zna.

**Strona 2.** Na pytanie o bocznicę Huty: **„W ogóle tam nie jeżdżę, nie znam tego miejsca.”** Na pytanie, czy tego wieczoru z kimś rozmawiałem przez telefon: około 21:10 dzwonił do mnie na komórkę mężczyzna z ochrony, nazwiska nie pamiętam, pytał o towar. Rozmowa trwała chwilę. Poza tym z nikim się nie kontaktowałem.

**Strona 3.** Okazano świadkowi fakturę przewozową nr 0231/02 zabezpieczoną przy zwłokach. Świadek obejrzał dokument i oświadczył, że nie ma nic do dodania. Do protokołu dodaje: nic więcej nie wiem w tej sprawie, o śmierci Henryka dowiedziałem się dzisiaj od policji. Protokół odczytano, świadek podpisał.</p>
<div class=''markers-hint'' style=''color:#555;font-size:11px;border-top:1px dashed #aaa;padding-top:4px;''>Znaczniki: żółty – „od około 20:30 do 22:30”, „nie opuszczałem lokalu”; czerwony – „W ogóle tam nie jeżdżę, nie znam tego miejsca”, „mojego Żuka zostawiłem pod skupem”, „Z nikim się nie kontaktowałem”; niebieski – „mężczyzna z ochrony”, numer 502 281 930.</div>
<p>---</p>', true, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.documents (id, case_id, title, doc_type, pages_count, content_html, available_at_start, unlocked_by_action_id)
VALUES ('AKT-007', 'case-01', 'Faktura przewozowa nr 0231/02 (D-3)', 'invoice', 1, '<p>*Skan dokumentu znalezionego przy zwłokach (D-3), zgnieciony, 1 strona · dostępne od startu*</p>
<p>**FAKTURA PRZEWOZOWA nr 0231/02** Data wystawienia: 11.03.2002 r.

**Nadawca:** Huta „Silesia” S.A., bocznica nr 4 **Odbiorca:** **TRANS-MET sp. z o.o.**, ul. Przemysłowa 14, Czarnocin **Towar:** złom miedziany (druty, średnica 2–4 mm), 4 200 kg **Wagon:** nr 665-4112 **Pojazd odbierający:** ciężarówka, rej. SBI 2218 **Wartość przewozu:** 8 400 zł netto **Podpis odbierającego:** nieczytelny

*Dopisek ołówkiem na odwrocie, pismem odręcznym:* ZbM 3200 / HD 1600 – reszta po rozliczeniu</p>
<div class=''markers-hint'' style=''color:#555;font-size:11px;border-top:1px dashed #aaa;padding-top:4px;''>Znaczniki: niebieski – nazwa „TRANS-MET sp. z o.o.”, „ZbM” i „HD” w dopisku; żółty – numer wagonu 665-4112 (ten sam co w protokole oględzin).</div>
<p>---</p>', true, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.documents (id, case_id, title, doc_type, pages_count, content_html, available_at_start, unlocked_by_action_id)
VALUES ('AKT-008', 'case-01', 'Notatka służbowa dzielnicowego (rejon XII)', 'report', 2, '<p>*Skan, 2 strony · dostępne od startu*</p>
<p>**NOTATKA SŁUŻBOWA** Czarnocin, dnia 14.03.2002 r., godz. 11:20. Sporządził: asp. Piotr Kania, dzielnicowy rejonu XII (Hutnicza, Przemysłowa).

**1. Poświadczenie z dnia 11.03.2002 r.** W poniedziałek wieczorem o godz. ok. 18:30 sąsiad Edmund C. zgłosił mi, że przed punktem skupu złomu przy ul. Hutniczej 21 doszło do awantury między dwoma zbieraczami złomu: Henrykiem D. i Tadeuszem W. Obaj byli pod wpływem alkoholu. Powodem miało być „miejsce na wagonach”. Nikt nie ucierpiał poważnie, wymiana ciosów trwała kilka minut, awanturę przerwał właściciel skupu. Zdarzenie nie zostało formalnie zgłoszone. Tadeusz W. jest mi znany z poprzednich interwencji, zam. os. Zachód, 14.03 nie zastano go w domu, według sąsiadów „pije”.

**2. Ujawnienie narzędzia.** W dniu 14.03.2002 r. o godz. ok. 10:30, w trakcie patrolu rejonu, ujawniłem w rowie przy ul. Hutniczej, na wysokości posesji nr 19, nóż składany: ostrze jednosieczne długości ok. 9 cm, rękojeść drewniana z mosiężną okładką. Na ostrzu widoczne ciemne zabrudzenia. Nóż zabezpieczono jako **dowód rzeczowy D-1** i przekazano do depozytu. Rów jest około 150 m od bramy nr 3.

Wnioski: należy rozważyć zlecenie ekspertyzy noża oraz sprawdzenie, czy Tadeusz W. miał kontakt z pokrzywdzonym 13.03.

asp. Piotr Kania</p>
<div class=''markers-hint'' style=''color:#555;font-size:11px;border-top:1px dashed #aaa;padding-top:4px;''>Znaczniki: żółty – „dowód rzeczowy D-1”, „posesji nr 19”; niebieski – „właściciel skupu”, „Tadeusz W.”; czerwony – brak.</div>
<p>---</p>
<p># Część 2: dokumenty odblokowywane zleceniami</p>
<p>---</p>', true, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.documents (id, case_id, title, doc_type, pages_count, content_html, available_at_start, unlocked_by_action_id)
VALUES ('AKT-009', 'case-01', 'Protokół przesłuchania świadka Romana S.', 'protocol', 1, '<p>*Zlecenie Z-01 · 15.03.2002 r., godz. 10:15 · przesłuchał sierż. szt. Wiesław Pająk*</p>
<p>**PROTOKÓŁ PRZESŁUCHANIA ŚWIADKA**

**Świadek:** Roman S., ur. 1953, zam. Czarnocin, os. Zachód, elektryk w zakładzie energetycznym, niekarany. Pouczony o obowiązku mówienia prawdy.

Zeznaję: Zbyszka M. znam od kilkunastu lat, w środy po pracy siadamy w barze „Pod Lipą”. W środę 13 marca Zbyszek był już na miejscu, kiedy przyszedłem, to było około 20:30. Siedzieliśmy przy stoliku pod oknem. Około 21:10 Zbyszkowi zadzwonił telefon, wyszedł na chwilę do przedsionka, wrócił i wydawał mi się spięty, ale nie powiedział, o co chodzi.

Wyszedłem około 21:15, bo rano miałem dyżur w zakładzie. **Zbyszek został przy stoliku**, zamówił jeszcze jedno piwo. Nie wiem, co robił po moim wyjściu i czy opuszczał lokal.

Henryka D. znam tylko z widzenia. Raz Zbyszek wspomniał, że „jeden złomiarz robi mu problemy”, nazwiska nie podał. Więcej nie wiem. Protokół odczytano, świadek podpisał.</p>
<div class=''markers-hint'' style=''color:#555;font-size:11px;border-top:1px dashed #aaa;padding-top:4px;''>Znaczniki: żółty – „około 20:30”, „Wyszedłem około 21:15”, „Zbyszek został przy stoliku”; niebieski – „jeden złomiarz robi mu problemy”; czerwony – brak.</div>
<p>Uwaga projektowa: zeznanie potwierdza alibi tylko do 21:15 i nie obala alibi M. Podpięte do wymogu „Obalenie alibi” samo nie wystarcza.</p>
<p>---</p>', false, 'Z-01')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.documents (id, case_id, title, doc_type, pages_count, content_html, available_at_start, unlocked_by_action_id)
VALUES ('AKT-010', 'case-01', 'Protokół przesłuchania świadka Haliny P.', 'protocol', 1, '<p>*Zlecenie Z-01 · 15.03.2002 r., godz. 11:00 · przesłuchał sierż. szt. Wiesław Pająk*</p>
<p>**PROTOKÓŁ PRZESŁUCHANIA ŚWIADKA**

**Świadek:** Halina P., ur. 1966, zam. Czarnocin, barmanka w barze „Pod Lipą”, niekarana. Pouczona o obowiązku mówienia prawdy.

Zeznaję: Zbigniewa M. znam jako stałego gościa, przychodzi w środy z kolegą Romanem. W środę 13 marca przyszedł około 20:30. Około 21:10 miał telefon, rozmawiał w przedsionku. Roman wyszedł krótko po tym, koło 21:15.

**Koło wpół do dziesiątej, to jest około 21:30, Zbigniew wziął kurtkę i wyszedł**, powiedział: „zaraz wracam”. Nie zapłacił, zostawił rachunek. Po chwili usłyszałam z parkingu **odpalany silnik diesla**. Nie widziałam samochodu, ale wiem, że to jego Żuk, bo ma bardzo głośny silnik i po nim go poznaję.

**Wrócił około 22:25**, zdyszany, w **butach całych w błocie**, aż zostawił ślady na podłodze, musiałam wycierać. Zamówił dwie wódki i wypił jedną po drugiej. Zapłacił i wyszedł około 22:50. Czasy znam, bo przy każdym rachunku patrzę na zegar nad kasą.

Protokół odczytano, świadek podpisała.</p>
<div class=''markers-hint'' style=''color:#555;font-size:11px;border-top:1px dashed #aaa;padding-top:4px;''>Znaczniki: czerwony – „Koło wpół do dziesiątej... wyszedł”, „Wrócił około 22:25”, „butach całych w błocie”; żółty – „odpalany silnik diesla”, „zegar nad kasą”.</div>
<p>---</p>', false, 'Z-01')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.documents (id, case_id, title, doc_type, pages_count, content_html, available_at_start, unlocked_by_action_id)
VALUES ('AKT-011', 'case-01', 'Wydruk bilingu telefonu Zbigniewa M. (Idea)', 'billing', 2, '<p>*Zlecenie Z-02 (za zgodą przełożonego) · wydruk operatora Idea, 2 strony · numer 502 281 930*</p>
<p>**IDEA – WYKAZ POŁĄCZEŃ DLA NUMERU 502 281 930** Abonent: Zbigniew M., ul. Hutnicza 21, Czarnocin. Okres: 13.03.2002, 00:00–23:59. Lokalizacja wg stacji bazowej, w której zarejestrowano połączenie.</p>
<div class=''table-block''>| Data i godz. | Rodzaj | Numer | Czas | Stacja bazowa |
| --- | --- | --- | --- | --- |
| 13.03 09:10 | wychodzące | 502 440 612 | 1:44 | Czarnocin-Centrum |
| 13.03 14:25 | przychodzące | 502 440 612 | 0:50 | Czarnocin-Centrum |
| 13.03 17:50 | wychodzące | 600 118 204 | 0:36 | Czarnocin-Centrum |
| 13.03 21:12 | przychodzące | 602 552 071 | 1:48 | Czarnocin-Centrum |
| 13.03 21:41 | wychodzące | 501 224 018 | 0:42 | Czarnocin Huta-Płn. |
| 13.03 22:19 | wychodzące | 602 552 071 | 0:25 | Czarnocin Huta-Płn. |
| 13.03 22:34 | SMS przychodzący | 602 552 071 | – | Czarnocin-Centrum |</div>
<p>Uwaga operatora: zestawienie nie zawiera treści rozmów ani wiadomości.</p>
<div class=''markers-hint'' style=''color:#555;font-size:11px;border-top:1px dashed #aaa;padding-top:4px;''>Znaczniki: czerwony – wpisy 21:41 i 22:19 (stacja Huta-Płn. w czasie, gdy M. twierdzi, że nie opuszczał baru); niebieski – numer 501 224 018 (to numer Henryka D. z AKT-005), numer 602 552 071 (ten sam co w AKT-005).</div>
<p>---</p>', false, 'Z-02')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.documents (id, case_id, title, doc_type, pages_count, content_html, available_at_start, unlocked_by_action_id)
VALUES ('AKT-012', 'case-01', 'Protokół przesłuchania Józefa K. z kopią książki wjazdów', 'protocol', 2, '<p>*Zlecenie Z-03 · 15.03.2002 r., godz. 12:30 · przesłuchał mł. asp. Ewa Bielak*</p>
<p>**PROTOKÓŁ PRZESŁUCHANIA ŚWIADKA**

**Świadek:** Józef K., ur. 1944, zam. Czarnocin, dozorca bramy nr 3 Huty „Silesia” (służba 18:00–06:00), niekarany. Pouczony o obowiązku mówienia prawdy.

Zeznaję: W środę 13 marca pełniłem służbę przy bramie nr 3. Około 20:20 przez furtkę wszedł Henryk D., którego znam, bo często zbierał na bocznicy. Zapytałem, czy na długo. Powiedział, że **ma się z kimś spotkać**, i poszedł w stronę toru. Nie widziałem, z kim.

**O 21:45 przez bramę wjechał biały Żuk** z napisem „SKUP ZŁOMU – METALE KOLOROWE”. Numer rejestracyjny zaczynał się od **SBI 73**, resztę zasłaniało błoto. Kierowcę widziałem słabo, w gorszym świetle: jeden mężczyzna, tęgi, w czapce. Wpisałem wjazd do książki. **Żuk wyjechał około 22:15.** Takie samochody ze złomem często tu zaglądają, więc nie robiłem z tego sprawy.

Obchód terenu robię co trzy godziny, o 20:50 i o 23:50. O 20:50 niczego nie zauważyłem. **O 23:50 znalazłem zwłoki** między wagonem a skrzynką. Zadzwoniłem na 997 z budki przy bramie o 23:55. Protokół odczytano, świadek podpisał.

**Kopia książki wjazdów, 13.03.2002:**

| Godzina | Pojazd / osoba | Cel |
| --- | --- | --- |
| 20:20 | pieszo, H. D. | furtka, złom |
| 21:45 | Żuk SBI 73.. | skup, złom |
| 22:15 | Żuk SBI 73.. | wyjazd |</p>
<div class=''markers-hint'' style=''color:#555;font-size:11px;border-top:1px dashed #aaa;padding-top:4px;''>Znaczniki: żółty – „O 21:45... biały Żuk”, „SBI 73”, „Żuk wyjechał około 22:15”; niebieski – „ma się z kimś spotkać”; czerwony – brak.</div>
<p>---</p>', false, 'Z-03')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.documents (id, case_id, title, doc_type, pages_count, content_html, available_at_start, unlocked_by_action_id)
VALUES ('AKT-013', 'case-01', 'Protokół przesłuchania świadka Teresy D.', 'protocol', 2, '<p>*Zlecenie Z-04 · 15.03.2002 r., godz. 13:40 · przesłuchała mł. asp. Ewa Bielak*</p>
<p>**PROTOKÓŁ PRZESŁUCHANIA ŚWIADKA**

**Świadek:** Teresa D., ur. 1958, zam. Czarnocin, os. Wschód, siostra pokrzywdzonego, niekarana. Pouczona o prawie odmowy zeznań i o odpowiedzialności za fałszywe zeznania.

Zeznaję: Z bratem Henrykiem widywałam się co kilka dni. We wtorek 12 marca był u mnie wieczorem. Opowiedział mi, że **„Zbyszek płaci mi połowę stawki, a sam bierze drugie tyle i jeszcze więcej na tym, co sprzedaje dalej do jakiejś firmy”**. Heniek powiedział, że ma **fakturę z tej firmy** i że jeśli Zbyszek nie dopłaci, to **„pójdzie z nią tam, gdzie trzeba”**. Mówił, że ma już dość, że nie będzie za grosze nosić miedzi. Nie wiem, o jaką firmę chodziło, o Zbyszku mówił po imieniu i nigdy nie podał nazwiska, ale wiem, że chodzi o właściciela skupu przy Hutniczej, bo tam brat sprzedawał złom.

Brat wspominał kiedyś, że jakiś człowiek z ochrony Huty „załatwia mu wejście na bocznicę” i że „ma ucho do rozmowy”. Nie wiem, kto to.

O awanturze z Tadeuszem W. przed skupem 11 marca wiem, brat mówił, że poszło o miejsce na wagonach, nic poważnego. W środę 13 marca rano rozmawiałam z bratem krótko przez telefon, był zdenerwowany, ale nie powiedział dlaczego. Protokół odczytano, świadek podpisała.</p>
<div class=''markers-hint'' style=''color:#555;font-size:11px;border-top:1px dashed #aaa;padding-top:4px;''>Znaczniki: żółty – „Zbyszek płaci mi połowę stawki”, „fakturę z tej firmy”; czerwony – „pójdzie z nią tam, gdzie trzeba”; niebieski – „właściciela skupu przy Hutniczej”, „człowiek z ochrony Huty”.</div>
<p>---</p>', false, 'Z-04')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.documents (id, case_id, title, doc_type, pages_count, content_html, available_at_start, unlocked_by_action_id)
VALUES ('AKT-014', 'case-01', 'Opinia z ekspertyzy kryminalistycznej noża (D-1)', 'lab_opinion', 1, '<p>*Zlecenie Z-05 (za zgodą przełożonego) · Laboratorium Kryminalistyczne, opinia nr LK/112/02/D1 · 15.03.2002 r.*</p>
<p>Treść zależy od osoby wskazanej przez gracza do porównania odcisków.</p>
<p>**Część wspólna (każdy wariant):**</p>
<p>**OPINIA KRYMINALISTYCZNA**

**Przedmiot badania:** nóż składany, ostrze jednosieczne długości 9,2 cm, rękojeść drewniana z mosiężną okładką, dowód D-1 (zabezpieczony 14.03.2002 r. w rowie przy ul. Hutniczej).

**Wyniki:** Na ostrzu stwierdzono krew ludzką grupy A Rh+, zgodną z grupą krwi pokrzywdzonego Henryka D. (AKT-004). Wymiary ostrza są zgodne z narzędziem opisanym w opinii lekarskiej. Na rękojeści ujawniono **fragment odcisku kciuka**, nadający się do identyfikacji. Badań DNA nie zlecono.</p>
<p>**Wariant A: porównanie z odciskami Zbigniewa M. (karta CZ/D/1996/0417):**</p>
<p>**Porównanie:** Ujawniony fragment odcisku kciuka jest **zgodny w 12 cechach identyfikacyjnych** z odciskiem kciuka prawej ręki na karcie daktyloskopijnej Zbigniewa M., ur. 07.11.1949 r. **Wniosek: odcisk na rękojeści noża D-1 pozostawił Zbigniew M.**</p>
<p>**Wariant B: porównanie z odciskami innej osoby (np. Tadeusza W., karta CZ/D/1998/0102):**</p>
<p>**Porównanie:** Ujawniony fragment odcisku kciuka **nie jest zgodny** z odciskami na karcie daktyloskopijnej wskazanej osoby. **Wniosek: odcisk na rękojeści noża D-1 nie pochodzi od tej osoby.** Dalsze porównania wymagają nowego zlecenia.</p>
<div class=''markers-hint'' style=''color:#555;font-size:11px;border-top:1px dashed #aaa;padding-top:4px;''>Znaczniki: żółty – „krew ludzką grupy A Rh+”, „fragment odcisku kciuka”; w wariancie A czerwony – „zgodny w 12 cechach identyfikacyjnych”.</div>
<p>---</p>', false, 'Z-05')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.documents (id, case_id, title, doc_type, pages_count, content_html, available_at_start, unlocked_by_action_id)
VALUES ('AKT-015', 'case-01', 'Karta przyjęcia do Izby Wytrzeźwień nr 1187/02', 'report', 1, '<p>*Zlecenie Z-06 (weryfikacja alibi Tadeusza W.) · skan, 1 strona*</p>
<p>**IZBA WYTRZEŹWIEŃ W CZARNOCINIE** **KARTA PRZYJĘCIA nr 1187/02**

**Osoba przyjęta:** Tadeusz W., ur. 1963, zam. Czarnocin, os. Zachód. **Data i godzina przyjęcia:** 13.03.2002 r., godz. 19:50, doprowadzony przez patrol. **Stan:** upojenie alkoholowe znacznego stopnia, stężenie alkoholu 2,9‰ (pomiar o godz. 19:55). **Pobyt:** cała noc, bez opuszczania izby, kontrola co godzinę (podpisy dyżurnych w rubrykach). **Zwolnienie:** 14.03.2002 r., godz. 06:30.

Dyżurny izby: st. sierż. Mirosław Cichy. *Podpis.*</p>
<div class=''markers-hint'' style=''color:#555;font-size:11px;border-top:1px dashed #aaa;padding-top:4px;''>Znaczniki: żółty – „19:50”, „cała noc, bez opuszczania izby”, „06:30”.</div>
<p>---</p>', false, 'Z-06')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.documents (id, case_id, title, doc_type, pages_count, content_html, available_at_start, unlocked_by_action_id)
VALUES ('AKT-016', 'case-01', 'Protokół ponownego przesłuchania Zbigniewa M.', 'protocol', 2, '<p>*Zlecenie Z-07 · 15.03.2002 r., godz. 14:10 · przesłuchał asp. Leszek Gajda · dokument ma wartość poznawczą, nie jest dowodem do wniosku*</p>
<p>**Wersja podstawowa (gracz nie okazał jeszcze AKT-011):**</p>
<p>**PROTOKÓŁ PONOWNEGO PRZESŁUCHANIA ŚWIADKA**

Zbigniew M. zeznaje: Poprawiam się. Henryka znałem lepiej, niż mówiłem. Kupowałem od niego złom, rozliczaliśmy się po swojemu, bez rachunków, jak w tej branży. Żuk jest mój, ale od środy rano stoi pod skupem, na pewno nie byłem nim na bocznicy.

O telefonie z ochrony mogę powiedzieć tyle, że **dzwonił jakiś Darek w sprawie towaru**. Nie wiem, kim jest, numer miałem w komórce, ale nie zapisany. Faktury nie znam, nie wiem, skąd Henryk ją miał.

Z baru nie wychodziłem do 22:30. Mam tam świadków. Protokół odczytano, świadek podpisał.</p>
<p>**Wersja po okazaniu wydruku bilingu (gracz okazał AKT-011):**</p>
<p>Po okazaniu wydruku bilingu numeru 502 281 930 świadek zamilkł, po czym oświadczył: **„Nie będę dalej zeznawał bez adwokata.”** Przesłuchanie przerwano o godz. 14:25.</p>
<div class=''markers-hint'' style=''color:#555;font-size:11px;border-top:1px dashed #aaa;padding-top:4px;''>Znaczniki: żółty – „Henryka znałem lepiej, niż mówiłem”, „Żuk jest mój”; czerwony – „od środy rano stoi pod skupem”, „Z baru nie wychodziłem do 22:30”; niebieski – „jakiś Darek w sprawie towaru”.</div>
<p>---</p>
<p># Część 3: KSIP, poczta służbowa i komunikaty prokuratora</p>
<p>---</p>', false, 'Z-07')
ON CONFLICT (id) DO NOTHING;