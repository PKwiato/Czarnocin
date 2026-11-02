# PLAN IMPLEMENTACJI — PROJEKT CZARNOCIN 2002
**Wirtualny Terminal Śledczy KSIP (Virtual Desktop / Detective Game)**  
*Stan projektu na dzień: 28 października 2026 r.*

---

## 📊 Podsumowanie Statusu Projektu

Projekt zrealizował pełną implementację **frontendu w Vue 3**, **wirtualnego systemu operacyjnego Windows 2000**, **8 dedykowanych aplikacji dochodzeniowych**, **zarządzania stanem w Pinia**, **kompletnego silnika walidacji procesowej wraz z testami Vitest** oraz **wszystkich ekranów przepływu gry (Logowanie, Rejestracja, Przydział sprawy, Pulpit, Postanowienie prokuratury)**.

```text
Postęp ogólny projektu (Sprawa 1 / MVP):
[██████████████████████████████████████░] ~95%
  • Game Design, Fabuła i Merytoryka:    100% [x]
  • Schemat Bazy Danych i Seed SQL:      100% [x]
  • Dane fabularne JSON & Zdjęcia:       100% [x]
  • Assety retro (ikony, dźwięki, tła):  100% [x]
  • Logika walidacji wniosków (TS):      100% [x]
  • Serwisy danych (Case, KSIP, Warrant):100% [x]
  • Makiety referencyjne UI:             100% [x]
  • System stylizacji Windows 2000 / CRT:100% [x]
  • Stan Pinia Stores i Composables:     100% [x]
  • Powłoka wirtualnego OS (Shell):      100% [x]
  • Dedykowane aplikacje śledcze (8):    100% [x]
  • Ekrany przepływu (Auth, Intro, Sąd): 100% [x]
  • Testy jednostkowe Vitest:            100% [x]
  • Wdrożenie chmurowe Supabase:           0% [ ] (Opcjonalne, offline MVP działa)
```

---

## ETAP 1: Koncepcja, GDD i Merytoryka Kryminalna

- [x] **1.1. Game Design Document (GDD v2.0)**
  - [x] Opracowanie pętli rozgrywki (Analiza akt ➔ Zlecenia terenowe ➔ Weryfikacja w KSIP ➔ Wniosek o sankcję ➔ Ocena sądu).
  - [x] Zdefiniowanie settingu: Czarnocin 2002, upadająca Huta Silesia, era telefonii Era/Idea, Windows 2000 / KSIP.
  - [x] Opracowanie systemu rang policyjnych (Młodszy aspirant ➔ Aspirant ➔ Podkomisarz ➔ Komisarz ➔ Podinspektor).
  - [x] Mechanika metagry: Prywatna teczka operacyjna (`C:\TEMP\NOTATKI`) oraz reakcja "Układu" (kontrole BSW, cenzura akt).
  - [x] Zarys 5 spraw kampanii głównej „Kryptonim Kombinat”.
  - *Plik źródłowy:* [`Doc/game_design_document_projekt_czarnocin_aktualizacja.md`](file:///d:/source/Czarnocin/Doc/game_design_document_projekt_czarnocin_aktualizacja.md)

- [x] **1.2. Merytoryka Sprawy 1 („Złom na bocznicy”, sygn. Ds. 112/02)**
  - [x] Opracowanie pełnego klucza rozwiązania sprawy, powiązań między podejrzanymi i fałszywych tropów (Tadeusz W. vs Zbigniew M.).
  - [x] Przygotowanie pełnych tekstów 16 dokumentów procesowych (`AKT-001` do `AKT-016`): protokoły oględzin, zeznania świadków, bilingi stacji BTS, faktury, ekspertyza daktyloskopijna noża D-1.
  - *Pliki źródłowe:* `Doc/Fabuła/1/Sprawa 1 Złom na bocznicy - dane i klucz rozwiązania.md`, `Doc/Fabuła/1/Sprawa 1 Złom na bocznicy - pełne teksty dokumentów.md`

- [x] **1.3. Architektura techniczna i schematy przepływów**
  - [x] Opracowanie struktury katalogów i mapy zależności komponentów Vue 3 + Pinia + Supabase.
  - [x] Zdefiniowanie cyklu życia wirtualnych okien (Focus, Minimise, Maximise, Stos Z-index).
  - [x] Opracowanie ujednoliconego modelu dowodowego (`EvidenceItem`) i zasad walidacji prokuratorskiej.
  - *Plik źródłowy:* [`Doc/architektura_i_schematy_projekt_czarnocin.md`](file:///d:/source/Czarnocin/Doc/architektura_i_schematy_projekt_czarnocin.md)

---

## ETAP 2: Baza Danych i Backend (Supabase / PostgreSQL 15)

- [x] **2.1. Migracje bazy danych PostgreSQL**
  - [x] `20261028000001_create_profiles_and_auth.sql`: Profile policjantów, stopnie, punkty służbowe, sesje gry (`game_sessions`), polityki RLS.
  - [x] `20261028000002_create_cases_and_documents.sql`: Sprawy kryminalne, dokumenty śledcze, zdjęcia z oględzin, baza KSIP, zlecenia terenowe.
  - [x] `20261028000003_create_evidence_and_warrants.sql`: Przypięte dowody, wnioski o areszt, oceny formalne prokuratury, audit log KSIP z triggerem limitu zapytań.
  - *Katalog migracji:* [`czarnocin-game/supabase/migrations/`](file:///d:/source/Czarnocin/czarnocin-game/supabase/migrations)

- [x] **2.2. Dane początkowe (Seed Data)**
  - [x] `seed.sql`: Wprowadzenie danych sprawy `Ds. 112/02`, 7 zleceń terenowych (`Z-01` do `Z-07`), 8 rekordów KSIP (`K-01` do `K-08`), 12 wpisów fotograficznych (`IMG-01` do `IMG-12`), 16 dokumentów procesowych (`AKT-001` do `AKT-016`), wiadomości e-mail (`MAIL-01` do `MAIL-03`) oraz reguł walidacyjnych.
  - *Plik źródłowy:* [`czarnocin-game/supabase/seed.sql`](file:///d:/source/Czarnocin/czarnocin-game/supabase/seed.sql)

- [ ] **2.3. Wdrożenie i środowisko Supabase (Opcjonalne / Cloud)**
  - [ ] Uruchomienie lokalnego środowiska Supabase CLI (`supabase start`) lub spięcie z instancją chmurową.
  - [ ] Weryfikacja działania polityk Row Level Security (RLS) i triggerów audytowych KSIP.
  - [ ] Utworzenie kont testowych funkcjonariuszy w `auth.users`.

---

## ETAP 3: Zasoby Danych Fabularnych i Assety Wizualne

- [x] **3.1. Ustrukturyzowane zbiory JSON (Offline / Fast Cache)**
  - [x] `case.json`: Metadane sprawy, budżet 80h, limit 10 zapytań KSIP.
  - [x] `documents.json`: 16 dokumentów w HTML z domyślnymi znacznikami i treścią retro.
  - [x] `ksip-records.json`: Kartoteki osób, pojazdów (Żuk `SBI 7305`), telefonów i firm (`TRANS-MET`).
  - [x] `field-actions.json`: Akcje terenowe z kosztami w roboczogodzinach i flagą zgody szefa.
  - [x] `timeline-events.json`: Zdarzenia godzinowe i logowania stacji BTS z 13.03.2002 r.
  - [x] `photos.json`: Metadane kadrów kryminalistycznych st. asp. Andrzeja Lasoty.
  - [x] `validation-rules.json`: Zbiór poprawnych, wspierających i wykluczających dowodów.
  - [x] `mails.json`: Wiadomości komendanta i prokuratury.
  - *Katalog danych:* [`czarnocin-game/src/data/cases/case-01/`](file:///d:/source/Czarnocin/czarnocin-game/src/data/cases/case-01)

- [x] **3.2. Zdjęcia kryminalistyczne z miejsca zdarzenia**
  - [x] Przygotowanie 12 fotografii `IMG_0001.JPG` – `IMG_0012.JPG` w folderze publicznym.
  - *Katalog:* [`czarnocin-game/public/assets/cases/case-01/photos/`](file:///d:/source/Czarnocin/czarnocin-game/public/assets/cases/case-01/photos)

- [x] **3.3. Assety graficzne i dźwiękowe systemu retro**
  - [x] Ikony pulpitu 32x32, 16x16 i wektorowe SVG (`public/assets/icons/`): Teczka akt (`case_folder`), KSIP (`ksip_terminal`), Stacja dyskietek 3.5'' (`floppy_35`), Poczta Outlook Express (`mail`), Notatnik (`notepad`), Kosz (`recycle_bin`), Zdjęcia (`photos`), Oś czasu (`timeline`), Dyspozytor (`dispatcher`), Wniosek o areszt (`warrant`).
  - [x] Tekstury papieru, zabrudzeń i pieczęci urzędowych (`public/assets/textures/`): Pożółkły papier aktowy (`paper_dossier.png`), papier faksowy (`paper_fax.png`), plama po kawie (`coffee_stain.png`), zagięcie narożnika (`crease_fold.png`), zabrudzenia bębna faksu (`fax_grunge.png`), okrągła pieczęć policyjna (`stamp_kmp_czarnocin.png`), pieczęć prokuratury (`stamp_prokuratura.png`), pieczęć wpływu (`stamp_wplynelo.png`), klauzula tajności (`stamp_tajne.png`), pieczęć aresztu (`stamp_zatwierdzono.png`), odmowa (`stamp_odrzucono.png`), pieczęć sądu (`stamp_sad_rejonowy.png`).
  - [x] Efekty dźwiękowe PCM WAV 16-bit 44.1kHz (`public/assets/audio/`): Klik przycisku myszy (`mouse_click.wav`), szum i pozycjonowanie głowicy FDD (`floppy_seek.wav`, `floppy_read.wav`), drukarka igłowa (`dot_matrix_printer.wav`), dzwonek poczty (`mail_alert.wav`), handshake faksu (`fax_handshake.wav`), uderzenie stempla sądowego (`court_stamp.wav`).

---

## ETAP 4: Makiety Referencyjne UI (Design Reference)

- [x] **4.1. Statyczne makiety HTML/CSS**
  - [x] Makieta ekranu logowania do KSIP (`Makieta UI/Logowanie do KSIP-html/`).
  - [x] Makieta rejestracji nowego funkcjonariusza (`Makieta UI/Rejestracja - nowe konto funkcjonariusza-html/`).
  - [x] Makieta wprowadzenia i przydziału sprawy (`Makieta UI/Przydział sprawy - Sprawa 1-html/`).
  - [x] Makieta pulpitu śledczego z oknami i markerem aktowym (`Makieta UI/Pulpit śledczego - Sprawa 1-html/`).
  - [x] Makieta orzeczenia sądu – zatwierdzenie aresztu (`Makieta UI/Ocena wniosku - zatwierdzony-html/`).
  - [x] Makieta orzeczenia sądu – odrzucenie wniosku (`Makieta UI/Ocena wniosku - odrzucony-html/`).

---

## ETAP 5: Warstwa Logiki i Modeli TypeScript

- [x] **5.1. Typy domenowe TypeScript**
  - [x] `case.types.ts`: Typy spraw, dokumentów, akcji, zdjęć i KSIP.
  - [x] `database.types.ts`: Kompletny schemat tabel bazy PostgreSQL z relacjami.
  - [x] `evidence.types.ts`: Model `EvidenceItem`, typy zakreśleń i slotów wnioskowych.
  - [x] `os.types.ts`: Rejestr okien `WindowState`, rangi policyjne, stan wirtualnego zegara.
  - [x] `warrant.types.ts`: Struktury formularza wniosku i wyniku oceny prokuratorskiej.
  - *Katalog typów:* [`czarnocin-game/src/types/`](file:///d:/source/Czarnocin/czarnocin-game/src/types)

- [x] **5.2. Deterministyczny silnik walidacji wniosków**
  - [x] Implementacja klasy `WarrantValidator` w `src/services/warrantValidator.ts`:
    - Weryfikacja alibi (`AKT-006` + `AKT-010`/`AKT-011`).
    - Weryfikacja obecności na miejscu (`AKT-012` + `K-01`).
    - Weryfikacja śladu materialnego (odcisk palca na nożu `AKT-014` wariant A).
    - Weryfikacja motywu (`AKT-013` + `AKT-007`/`AKT-005`).
    - Obsługa fałszywych tropów (Tadeusz W., odlew buta `IMG-09`, bójka z `AKT-008`).
    - Naliczanie punktów awansu (+100) oraz kar budżetowych (-10h).
  - *Plik źródłowy:* [`czarnocin-game/src/services/warrantValidator.ts`](file:///d:/source/Czarnocin/czarnocin-game/src/services/warrantValidator.ts)

- [x] **5.3. Inicjalizacja klienta Supabase**
  - [x] Implementacja `src/services/supabaseClient.ts` z obsługą zmiennych środowiskowych `.env`.

- [x] **5.4. Pozostałe serwisy danych**
  - [x] `caseService.ts`: Pobieranie sprawy, otwieranie dokumentów, wykonywanie zleceń, tryb offline fallback (JSON).
  - [x] `ksipService.ts`: Wyszukiwanie krzyżowe w bazie KSIP, rejestracja zapytań w audit logu, konwersja do EvidenceItem.
  - [x] `warrantService.ts`: Zapis wniosków procesowych, szkiców i integracja z `WarrantValidator`.

---

## ETAP 6: Konfiguracja Środowiska Frontendowego i Stylów Retro

- [x] **6.1. Zależności projektu**
  - [x] Wykonanie `npm install` w katalogu `czarnocin-game/` (Vue 3, Pinia, @vueuse/core, Supabase JS, Vitest).
  - [x] Weryfikacja kompilacji TypeScript (`vue-tsc --noEmit`).

- [x] **6.2. System stylizacji Windows 2000 / Retro CRT**
  - [x] `src/assets/styles/98.css`: Klasy okienkowe (ramki `outset`/`inset`, paleta `#d4d0c8`, paski tytułu `#0a246a` -> `#3a6ea5`, przyciski retro, kontrolki).
  - [x] `src/assets/styles/typography.css`: Fonty Tahoma/Verdana dla OS oraz maszyna do pisania `Courier New` dla akt śledczych.
  - [x] `src/assets/styles/crt-overlay.css`: Nakładka skanlinii CRT 60Hz z winietą kineskopu.
  - [x] `src/assets/styles/main.css`: Zmienne CSS, reset marginesów, tło biurka śledczego `#12262b`.
  - [x] `src/main.ts` i `src/vite-env.d.ts`: Inicjalizacja aplikacji i deklaracje typów.

---

## ETAP 7: Zarządzanie Stanem (Pinia Stores) i Composables

- [x] **7.1. Centralne store'y aplikacji (`src/stores/`)**
  - [x] `authStore.ts`: Stan zalogowanego funkcjonariusza, stopień, uprawnienia RLS, punkty służbowe.
  - [x] `windowManagerStore.ts`: Dynamiczny rejestr 8 okien, koordynaty X/Y, rozmiary, `zIndex`, aktywne okno, minimalizacja do paska.
  - [x] `activeCaseStore.ts`: Przechowywanie danych aktywnej sprawy, odblokowane dokumenty, lista podejrzanych, wykonywanie zleceń.
  - [x] `evidenceStore.ts`: Boczny schowek dowodowy śledczego, dodawanie cytatów, miniatur zdjęć i odpisów KSIP, usuwanie dowodów.
  - [x] `timelineStore.ts`: Zdarzenia przypisane do pasów czasu (Alibi, BTS, Miejsce zbrodni), wykrywanie kolizji godzinowych 21:41–22:19.
  - [x] `virtualTimeStore.ts`: Obsługa wirtualnego zegara (start: 14.03.2002 08:00) i budżetu roboczogodzin operacyjnych (80h).

- [x] **7.2. Composables (`src/composables/`)**
  - [x] `useDraggable.ts`: Obsługa płynnego przesuwania okien po pulpicie z ograniczeniem granic (1280x800).
  - [x] `useEvidenceExtractor.ts`: Mechanizm zaznaczania fragmentów tekstu w dokumentach, wybór koloru zakreślacza i funkcja „Wepnij do akt”.
  - [x] `useVirtualClock.ts`: Obliczanie upływu czasu przy zleceniach terenowych i formatowanie daty w zasobniku systemowym.
  - [x] `useSoundEffects.ts`: Dźwięki systemowe (klik, stempel, dyskietka, drukarka igłowa, poczta) z przełącznikiem wyciszenia.

---

## ETAP 8: Powłoka Wirtualnego Systemu Operacyjnego (OS Shell)

- [x] **8.1. Komponenty powłoki (`src/components/os/`)**
  - [x] `WindowFrame.vue`: Uniwersalna ramka okna retro (pasek tytułu z ikoną i przyciskami `_`, `□`, `X`, obsługa przesuwania, focus przy kliknięciu).
  - [x] `Desktop.vue`: Pulpit z siatką ikon systemowych (Akta, KSIP, Stacja A:, Poczta, Notatki, Zdjęcia, Kosz) i podwójnym kliknięciem otwierającym okno.
  - [x] `Taskbar.vue`: Dolny pasek zadań Windows 2000 z przyciskiem Start i listą otwartych programów.
  - [x] `StartMenu.vue`: Klasyczne menu Start z pionowym niebieskim banerem KSIP i danymi zalogowanego policjanta.
  - [x] `SystemTray.vue`: Zasobnik systemowy wyświetlający wirtualną datę, godzinę, pozostały budżet godzinowy, stopień służbowy oraz przełączniki audio i CRT.
  - [x] `ContextMenu.vue`: Menu kontekstowe pod prawym przyciskiem myszy na pulpicie.
  - [x] `CrtOverlay.vue`: Warstwa efektu retro kineskopu z opcją włączenia/wyłączenia.

---

## ETAP 9: Reużywalne Komponenty Dochodzeniowe (Common)

- [x] **9.1. Komponenty dowodowe (`src/components/common/`)**
  - [x] `EvidenceCard.vue`: Przeciągalna karta dowodu (sygnatura np. `AKT-006`, kolor znacznika, cytat, źródło, przycisk usunięcia).
  - [x] `DropSlot.vue`: Wieloslotowy kontener Drag & Drop dowodów dla modułu wniosku o areszt oraz generatora osi czasu.

---

## ETAP 10: Dedykowane Aplikacje Dochodzeniowe (Apps)

- [x] **10.1. `CaseViewerApp.vue` (Przeglądarka Akt & Marker Aktowy)**
  - [x] Lewy panel z listą dokumentów (`AKT-001` do `AKT-016`) z blokadami kłódką.
  - [x] Pasek narzędzi markera: Żółty (fakty/alibi), Czerwony (sprzeczności), Niebieski (powiązania), przycisk „Wepnij do akt”.
  - [x] Podgląd dokumentu z czcionką maszynową i układem faksów/protokołów z 2002 roku.
  - [x] Integracja z `useEvidenceExtractor` i wysyłanie cytatu do `evidenceStore`.

- [x] **10.2. `PhotoViewerApp.vue` (Przeglądarka Zdjęć Kryminalistycznych)**
  - [x] Miniatury kadrów `IMG-01` do `IMG-12` w bocznym panelu.
  - [x] Główne okno podglądu z lupą powiększającą (100%, 200%, 400%).
  - [x] Pasek metadanych (data 14.03.2002 01:45, notatki technika st. asp. Lasoty).
  - [x] Przycisk dołączenia odbitki jako dowodu fotograficznego do schowka.

- [x] **10.3. `TimelineApp.vue` (Generator Osi Czasu)**
  - [x] Oś godzinowa 19:30 – 24:00 (13.03.2002 r.) z podziałką co 15 minut.
  - [x] 3 tory: Tor Alibi (świadkowie), Tor BTS (stacje przekaźnikowe), Tor Bocznicy (ruchy pojazdów).
  - [x] Detekcja sprzeczności: automatyczne generowanie czerwonego pasma kolizji w oknie **21:41–22:19** i utworzenie wniosku analitycznego.

- [x] **10.4. `KsipApp.vue` (Terminal Bazy Danych KSIP)**
  - [x] Wyszukiwarka rejestrowa (PESEL, nazwisko, rejestracja auta, numer telefonu, NIP).
  - [x] Wyświetlanie kartoteki osób i pojazdów (np. Żuk `SBI 7305`, notowania paserskie Zbigniewa M.).
  - [x] Licznik zapytań (maksymalnie 10 zapytań dla Młodszego Aspiranta) z ostrzeżeniem przed blokadą BSW.
  - [x] Przycisk „Wepnij wyciąg z rejestru do akt sprawy” (tworzenie dowodu `K-xx`).

- [x] **10.5. `FieldDispatcherApp.vue` (Dyspozytor Zleceń w Terenie)**
  - [x] Lista czynności śledczych (`Z-01` do `Z-07`) z kosztami czasowymi (6h, 10h, 14h).
  - [x] Blokada zleceń wymagających zgody komendanta (np. bilingi BTS, ekspertyza laboratoryjna noża).
  - [x] Odliczanie wirtualnych roboczogodzin z budżetu i odblokowywanie nowych dokumentów w aktach sprawy.

- [x] **10.6. `WarrantApp.vue` (Formularz Wniosku o Tymczasowe Aresztowanie)**
  - [x] Wskazanie podejrzanego (Zbigniew M. vs Tadeusz W.).
  - [x] 4 wieloslotowe strefy upuszczania dowodów (alibi, obecność, ślad, motyw).
  - [x] Przycisk „Złóż do prokuratora” wywołujący silnik `WarrantValidator` i przekazujący wynik do ekranu orzeczenia.

- [x] **10.7. `MailApp.vue` (Poczta Służbowa)**
  - [x] Skrzynka odbiorcza z wiadomościami od przełożonego i laboratorium (`MAIL-01` do `MAIL-03`).
  - [x] Możliwość odczytu zatwierdzeń zleceń i ostrzeżeń dyscyplinarnych.

- [x] **10.8. `NotepadApp.vue` (Brudnopis Śledczego — `C:\TEMP\NOTATKI`)**
  - [x] Edytor tekstowy zachowujący notatki gracza pomiędzy sprawami w `localStorage`.
  - [x] Predefiniowane notatki o aferze Huty Silesia, firmie `TRANS-MET` i agencji ochrony.

---

## ETAP 11: Ekrany Przepływu Gry i Integracja Główna (`App.vue`)

- [x] **11.1. Ekran Logowania do KSIP (`LoginScreen.vue`)**
  - [x] Wizualna implementacja na bazie makiety (`Makieta UI/Logowanie do KSIP-html/`).
  - [x] Wprowadzanie numeru odznaki i hasła, przejście do przydziału sprawy.

- [x] **11.2. Ekran Rejestracji Funkcjonariusza (`RegisterScreen.vue`)**
  - [x] Formularz zakładania konta dochodzeniowca na bazie makiety (`Makieta UI/Rejestracja.../`).
  - [x] Podgląd legitymacji służbowej Młodszego Aspiranta.

- [x] **11.3. Ekran Przydziału Sprawy (`CaseAssignmentScreen.vue`)**
  - [x] Prezentacja teczki wyjściowej Ds. 112/02 (faks polecenia nr 31/02) na bazie makiety.
  - [x] Rozpoczęcie śledztwa: załadowanie akt wyjściowych i przejście do pulpitu.

- [x] **11.4. Ekran Orzeczenia Sądowego / Prokuratorskiego (`WarrantResultScreen.vue`)**
  - [x] Postanowienie o aresztowaniu – zatwierdzenie wniosku (awans, nagroda punktowa +100 pkt).
  - [x] Postanowienie o odmowie – odrzucenie wniosku (wskazanie braków formalnych, kara budżetowa -10h, powrót do śledztwa).

- [x] **11.5. Główna integracja powłoki (`App.vue`)**
  - [x] Warunkowy routing widoków: Login -> Register -> Assignment -> Desktop -> WarrantResult.
  - [x] Responsywne skalowanie wirtualnego ekranu 1280x800 z zachowaniem aspect-ratio.

---

## ETAP 12: Testy, Szlifowanie i Dźwięk

- [x] **12.1. Testy jednostkowe silnika walidacji (`vitest`)**
  - [x] Napisanie i pomyślne wykonanie 4 testów Vitest dla `WarrantValidator.evaluateCase01`:
    - Ścieżka idealna (pełny łańcuch dowodowy -> sukces i awans).
    - Ścieżka błędna (podejrzenie Tadeusza W. -> natychmiastowe odrzucenie z alibi z izby wytrzeźwień).
    - Ścieżka braków (brakujące alibi, zły odcisk palca, niewystarczający motyw).
    - Ścieżka pułapki (podpięcie śladu buta `IMG-09`).
  - *Plik testów:* [`czarnocin-game/src/services/warrantValidator.test.ts`](file:///d:/source/Czarnocin/czarnocin-game/src/services/warrantValidator.test.ts)

- [x] **12.2. Polishing wizualny i dźwiękowy**
  - [x] Skalowanie wirtualnego OS (1280x800 z zachowaniem proporcji).
  - [x] Udźwiękowienie kluczowych akcji (kliknięcia, pieczęć prokuratora, przeciąganie kart, faks, dyskietka).
  - [x] Opcje w zasobniku: wyłączenie filtra CRT, głośność/wyciszenie dźwięków.

---

## ETAP 13: Kampania Główna — Kolejne Sprawy (Post-MVP)

- [ ] **13.1. Sprawa 2: „Skok z balkonu” (Aspirant)**
  - [ ] Śmierć księgowej syndyka Huty Silesia, logi dial-up, bilingi BTS, powiązanie notariusza Rawicza.
- [ ] **13.2. Sprawa 3: „Wojna w motelu” (Podkomisarz)**
  - [ ] Porachunki gangsterskie, ranny ochroniarz agencji "Huzar", wątek korupcji w KMP.
- [ ] **13.3. Sprawa 4: „Archiwum X – Pętla czasu” (Komisarz)**
  - [ ] Ekshumacja szkieletu dyrektora z 1993 r., raczkująca baza DNA, prywatyzacja majątku.
- [ ] **13.4. Sprawa 5: „Ostateczne uderzenie” (Podinspektor / Finał)**
  - [ ] Ominięcie lokalnej prokuratury, konfrontacja z komendantem i rozbicie układu w Czarnocinie.
