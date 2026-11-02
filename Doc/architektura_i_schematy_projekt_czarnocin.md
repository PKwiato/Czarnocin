# ARCHITEKTURA PROJEKTU I SCHEMATY PRZEPŁYWÓW (AGENDA)

Dokument zawiera strukturę katalogów dla stosu technicznego Vue 3 + Pinia + Supabase, schematy przepływu danych, pętlę śledztwa oraz cykl życia wirtualnych okien systemu KSIP.

---

## 1. Struktura katalogów projektu

Architektura rozdziela warstwę wirtualnego systemu operacyjnego (okna, pasek zadań, dźwięki) od logiki śledztwa, zapytań do bazy Supabase oraz silnika weryfikacji łańcucha dowodowego.

```text
czarnocin-game/
├── .env.example                     # Wzór zmiennych środowiskowych
├── index.html                       # Punkt wejścia z linkami do fontów retro
├── package.json
├── tsconfig.json
├── vite.config.ts
│
├── supabase/                        # Konfiguracja lokalna Supabase CLI i migracje bazy
│   ├── config.toml
│   ├── migrations/
│   │   ├── 20261028000001_create_profiles_and_auth.sql
│   │   ├── 20261028000002_create_cases_and_documents.sql
│   │   └── 20261028000003_create_evidence_and_warrants.sql
│   └── seed.sql                     # Rekordy początkowe (Sprawa 1: Awantura na bocznicy)
│
├── public/
│   ├── assets/
│   │   ├── audio/                   # Efekty dźwiękowe (kliknięcia, szum dyskietki, faks)
│   │   ├── icons/                   # Ikony pulpitu 32x32 i 16x16
│   │   └── textures/                # Tekstury papieru, zabrudzeń i pieczątek
│
└── src/
    ├── main.ts                      # Inicjalizacja Vue, Pinii i montowanie widoku
    ├── App.vue                      # Warunkowy routing: Loader -> LoginScreen -> Desktop
    │
    ├── assets/
    │   └── styles/
    │       ├── 98.css               # Surowa baza stylów okien i kontrolek Windows 2000
    │       ├── crt-overlay.css      # Poziome linie skanowania monitora kineskopowego
    │       ├── typography.css       # Pikselowe czcionki systemowe i maszynowe
    │       └── main.css             # Resety stylów i zmienne globalne CSS
    │
    ├── components/
    │   ├── os/                      # Powłoka wirtualnego systemu operacyjnego
    │   │   ├── Desktop.vue          
    │   │   ├── Taskbar.vue          
    │   │   ├── StartMenu.vue        
    │   │   ├── SystemTray.vue       
    │   │   ├── WindowFrame.vue      # Generyczna ramka: przesuwanie, z-index, nagłówek
    │   │   ├── ContextMenu.vue      
    │   │   └── CrtOverlay.vue       
    │   │
        ├── apps/                    # Aplikacje dochodzeniowe
        │   ├── KsipApp/             # Baza Ewidencji Ludności i Pojazdów (+ generowanie notatek K-xx)
        │   ├── CaseViewerApp/       # Przeglądarka zdigitalizowanych akt śledztwa (Marker Aktowy)
        │   ├── PhotoViewerApp/      # Przeglądarka zdjęć kryminalistycznych (IMG-01 do IMG-12) z lupą
        │   ├── TimelineApp/         # Generator Osi Czasu (alibi vs bilingi BTS, kolizje czasowe)
        │   ├── WarrantApp/          # Formularz wniosku o tymczasowy areszt (wieloslotowy multi-drop)
        │   ├── FieldDispatcherApp/  # Zlecanie czynności w terenie (budżet roboczogodzin)
        │   ├── MailApp/             # Poczta wewnętrzna (polecenia, zgody przełożonego)
        │   └── NotepadApp/          # Notatnik operacyjny i brudnopis gracza (C:\\TEMP\\NOTATKI)
        │
        └── common/                  # Reużywalne miniaturowe komponenty UI
            ├── EvidenceCard.vue     # Karta przeciągalnego dowodu (sygnatura, cytat, znacznik)
            └── DropSlot.vue         # Wieloslotowe pole upuszczania dla wniosku i osi czasu
    │
    ├── composables/                 # Logika stanu wyciągnięta poza komponenty
    │   ├── useDraggable.ts          
    │   ├── useEvidenceExtractor.ts  
    │   ├── useVirtualClock.ts       
    │   └── useSoundEffects.ts       
    │
    ├── stores/                      # Centralny stan aplikacji (Pinia)
    │   ├── authStore.ts             # Sesja Supabase, profil, ranga, uprawnienia
    │   ├── windowManagerStore.ts    # Rejestr okien, z-index, minimalizacje
    │   ├── activeCaseStore.ts       # Bieżąca sprawa, odblokowane akta
    │   ├── evidenceStore.ts         # Schowek dowodowy (cytaty, pliki, notatki KSIP)
    │   ├── timelineStore.ts         # Zdarzenia i tory osi czasu
    │   └── virtualTimeStore.ts      # Data i godzina w świecie gry oraz budżet roboczogodzin
    │
    ├── services/                    # Warstwa komunikacji z backendem i logiki gry
    │   ├── supabaseClient.ts        
    │   ├── caseService.ts           
    │   ├── ksipService.ts           
    │   ├── warrantService.ts        
    │   └── warrantValidator.ts      # Deterministyczny silnik weryfikacji wymogów wniosku
    │
    ├── data/                        # Ustrukturyzowane dane fabularne w formacie JSON
    │   └── cases/
    │       └── case-01/
    │           ├── case.json
    │           ├── documents.json
    │           ├── photos.json
    │           ├── ksip-records.json
    │           ├── field-actions.json
    │           ├── timeline-events.json
    │           ├── validation-rules.json
    │           └── mails.json
    │
    ├── types/                       # Definicje TypeScript
    │   ├── database.types.ts        
    │   ├── os.types.ts              
    │   ├── case.types.ts            
    │   ├── evidence.types.ts        
    │   └── warrant.types.ts         
    │
    └── utils/                       # Funkcje pomocnicze
        ├── dateFormatter.ts         
        └── textParser.ts
```

---

## 2. Schemat przepływu danych i architektury

Diagram obrazuje podział odpowiedzialności między przeglądarką gracza, store'ami Pinii a zabezpieczonym backendem w Supabase.

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│                                WARSTWA KLIENTA (VUE 3)                       │
│                                                                              │
│   ┌──────────────────────────────────────────────────────────────────────┐   │
│   │                           WIDOK PULPITU                              │   │
│   │  [Akta Sprawy]         [Baza KSIP]         [Wniosek o Areszt]        │   │
│   └──────┬──────────────────────┬───────────────────────┬────────────────┘   │
│          │                      │                       │                    │
│          ▼                      ▼                       ▼                    │
│   ┌───────────────┐      ┌───────────────┐      ┌───────────────┐            │
│   │  useDraggable │      │  useEvidence  │      │  useVirtual   │  (Composables)
│   │               │      │   Extractor   │      │     Clock     │            │
│   └──────┬────────┘      └──────┬────────┘      └───────┬───────┘            │
│          │                      │                       │                    │
│          ▼                      ▼                       ▼                    │
│   ┌──────────────────────────────────────────────────────────────────────┐   │
│   │                        STAN CENTRALNY (PINIA)                        │   │
│   │                                                                      │   │
│   │  • windowManagerStore : Koordynaty okien, warstwy Z-index, focus     │   │
│   │  • activeCaseStore    : Zestaw otwartych akt, uprawnienia w sprawie  │   │
│   │  • evidenceStore      : Schowek dowodowy (cytaty, pliki, powiązania) │   │
│   │  • authStore          : Profil policjanta, ranga, uprawnienia (RLS)  │   │
│   └──────────────────────────────────┬───────────────────────────────────┘   │
│                                      │                                       │
│                                      ▼ (Wywołania serwisów przez API)        │
│   ┌──────────────────────────────────────────────────────────────────────┐   │
│   │                     supabaseClient (HTTPS / WSS)                     │   │
│   └──────────────────────────────────┬───────────────────────────────────┘   │
└──────────────────────────────────────┼───────────────────────────────────────┘
                                       │
                                       ▼ (JWT Token z nagłówkiem RLS)
┌──────────────────────────────────────────────────────────────────────────────┐
│                            BACKEND SUPABASE (CLOUD)                          │
│                                                                              │
│   ┌────────────────────────┐                   ┌─────────────────────────┐   │
│   │     Supabase Auth      │                   │     PostgreSQL 15       │   │
│   │                        │                   │                         │   │
│   │  Zarządzanie sesją     ├──────────────────►│  Tabela `profiles`      │   │
│   │  Weryfikacja tożsamości│                   │  Tabela `cases`         │   │
│   └────────────────────────┘                   │  Tabela `documents`     │   │
│                                                │  Tabela `evidence`      │   │
│                                                │  Tabela `warrants`      │   │
│                                                └────────────┬────────────┘   │
│                                                             │                │
│                                                             ▼                │
│                                                ┌─────────────────────────┐   │
│                                                │   Row Level Security    │   │
│                                                │ (Blokady akt wg rangi)  │   │
│                                                └─────────────────────────┘   │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Pętla śledztwa (Gameplay Loop)

Logiczny przebieg pojedynczej sprawy kryminalnej – od wstępnych akt, przez zbieranie poszlak i obalanie alibi, aż po formalną sankcję prokuratorską.

```text
                  ┌───────────────────────────────┐
                  │    PRZYDZIAŁ NOWEJ SPRAWY    │
                  │   (Spływa teczka wyjściowa)   │
                  └───────────────┬───────────────┘
                                  │
                                  ▼
                  ┌───────────────────────────────┐
                  │     ANALIZA AKT W SYSTEMIE    │
                  │  (Protokoły, oględziny, trup) │
                  └───────┬───────────────┬───────┘
                          │               │
     [Wykryto sprzeczność]│               │[Brakujące powiązanie]
                          ▼               ▼
┌───────────────────────────────┐   ┌───────────────────────────────┐
│     ZLECENIE CZYNNOŚCI        │   │    WYSZUKIWANIE W KSIP        │
│ • Rewizja meliny / magazynu   │   │ • PESEL, właściciel auta      │
│ • Przesłuchanie uzupełniające │   │ • Notowania kryminalne        │
└───────────────┬───────────────┘   └───────────────┬───────────────┘
                │                                   │
                │ [Upływ czasu wirtualnego + koszt] │
                ▼                                   ▼
┌───────────────────────────────────────────────────────────────────┐
│              POZYSKANIE NOWEGO MATERIAŁU DOWODOWEGO               │
│               (Nowy skan dokumentu trafia do akt)                 │
└─────────────────────────────────┬─────────────────────────────────┘
                                  │
                                  ▼
┌───────────────────────────────────────────────────────────────────┐
│             MECHANIZM PINOWANIA CYTATU (SELEKCJA)                 │
│    Gracz zaznacza fragment tekstu -> "Zapisz jako dowód"          │
│    (Trafi do bocznego schowka `evidenceStore`)                    │
└─────────────────────────────────┬─────────────────────────────────┘
                                  │
                                  ▼
┌───────────────────────────────────────────────────────────────────┐
│             FORMULARZ POSTANOWIENIA O ZARZUTACH                   │
│      Gracz przeciąga dowody pod 4 wymogi formalne:                │
│                                                                   │
│  [1. Obalenie alibi]          <-- Przypnij dowód                  │
│  [2. Ślad na miejscu zbrodni] <-- Przypnij dowód                  │
│  [3. Narzędzie przestępstwa]  <-- Przypnij dowód                  │
│  [4. Motyw czynu]             <-- Przypnij dowód                  │
└─────────────────────────────────┬─────────────────────────────────┘
                                  │
                                  ▼
                  /───────────────────────────────\
                 /   Wszystkie 4 pola obsadzone    \
                <       poprawnymi dowodami?        >
                 \                                 /
                  \───────────────────────────────/
                            │           │
                    [NIE]   │           │ [TAK]
            ┌───────────────┘           └───────────────┐
            ▼                                           ▼
┌───────────────────────────────┐   ┌───────────────────────────────┐
│     PROKURATOR ODRZUCA        │   │       SĄD WYDAJE NAKAZ        │
│ • Kara do budżetu             │   │       (Tymczasowy areszt)     │
│ • Upomnienie służbowe         │   └───────────────┬───────────────┘
│ • Powrót do analizy           │                   │
└───────────────────────────────┘                   ▼
                                    ┌───────────────────────────────┐
                                    │    ZAMKNIĘCIE SPRAWY I AWANS  │
                                    │ • Wyższy stopień policyjny    │
                                    │ • Dostęp do głębszych baz     │
                                    │ • Zapis wątku do Afery Głównej│
                                    └───────────────────────────────┘
```

---

## 4. Cykl życia okna w systemie (State Machine)

Architektura interakcji z oknami, zarządzająca pozycją, zminimalizowaniem oraz stosem Z-index bez przeładowywania drzewa DOM.

```text
                     ┌──────────────────┐
                     │ Ikona na pulpicie│
                     └────────┬─────────┘
                              │
                     [Podwójne kliknięcie]
                              │
                              ▼
                /────────────────────────────\
               /  Czy okno jest zarejestrowane\  [NIE]
              <        w pamięci RAM?          >──────► [Błąd aplikacji]
               \                              /
                \────────────────────────────/
                              │ [TAK]
                              ▼
                /────────────────────────────\
               /       Czy okno jest już      \  [TAK]   ┌────────────────────┐
              <        otwarte na ekranie?     >────────►│ Wyciągnij na wierzch│
               \                              /          │  (topZIndex + 1)   │
                \────────────────────────────/           └────────────────────┘
                              │ [NIE]
                              ▼
               ┌──────────────────────────────┐
               │    windowManagerStore.open   │
               │ • isOpen = true              │
               │ • isMinimized = false        │
               │ • zIndex = ++topZIndex       │
               └──────────────┬───────────────┘
                              │
                              ▼
               ┌──────────────────────────────┐
               │     ZDARZENIA UŻYTKOWNIKA    │
               └──────┬───────┬────────┬──────┘
                      │       │        │
      ┌───────────────┘       │        └────────────────┐
      ▼                       ▼                         ▼
[Klik w okno]        [Klik Minimalizuj]           [Klik Zamknij]
      │                       │                         │
      ▼                       ▼                         ▼
┌───────────────┐   ┌───────────────────┐     ┌───────────────────┐
│ focusWindow() │   │ minimizeWindow()  │     │  closeWindow()    │
│ • zIndex =    │   │ • isMinimized=true│     │ • isOpen=false    │
│   ++topZIndex │   │ • ukrycie w DOM   │     │ • zniknięcie z    │
│ • aktywacja   │   │ • przycisk w tray │     │   paska zadań     │
│   belki tytułu│   │   pozostaje       │     │ • czyszczenie stanu│
└───────────────┘   └───────────────────┘     └───────────────────┘
```
---

## 5. Ujednolicony Model Dowodowy i Deterministyczny Silnik Walidacji (Krok 2)

W celu wyeliminowania rozbieżności pomiędzy mechaniką zakreślania tekstu markerem a weryfikacją formalną wniosku przez prokuratora, system operuje na ustandaryzowanym obiekcie `EvidenceItem`.

### 5.1. Model danych dowodu (TypeScript)

```typescript
export type EvidenceType = 'document_quote' | 'ksip_record' | 'case_photo' | 'physical_item';
export type HighlightColor = 'yellow' | 'red' | 'blue' | 'neutral';

export interface EvidenceItem {
  id: string;               // Unikalny UUID dowodu w sesji (np. 'ev-akt-006-1')
  caseId: string;           // Identyfikator sprawy (np. 'case-01')
  documentId: string;       // Sygnatura źródła (np. 'AKT-006', 'K-01', 'IMG-09', 'D-1')
  type: EvidenceType;       // Typ materiału
  quote: string;            // Zacytowany fragment tekstu lub odpis z rejestru
  color: HighlightColor;    // Kolor zakreślenia (żółty = alibi/fakt, czerwony = kłamstwo, niebieski = relacja)
  sourceTitle: string;      // Tytuł dokumentu źródłowego
  targetRequirement?: 'alibi' | 'presence' | 'material_trace' | 'motive'; // Opcjonalna sugestia
  createdAt: string;        // Znacznik czasu dodania do schowka
  metadata?: Record<string, any>; // Dodatkowe atrybuty (stacja BTS, godzina, PESEL, rejestracja)
}
```

### 5.2. Trzy źródła pozyskiwania dowodów do schowka (`evidenceStore`)

1. **Marker Aktowy (`CaseViewerApp`):**
   * Gracz zaznacza myszą fragment tekstu w dokumencie (stylizowanym na pismo maszynowe / faks z 2002 r.).
   * Wybiera kolor zakreślacza (żółty, czerwony, niebieski) i klika przycisk *„Wepnij do akt”*.
   * Utworzony obiekt `EvidenceItem` trafia do bocznego schowka dowodowego z zapisanym zakresem cytatu i kolorem.
2. **Odpis z Bazy Ewidencji (`KsipApp`):**
   * Wynik wyszukiwania w KSIP (np. `K-01: FSC Żuk SBI 7305`) posiada akcję *„Wepnij wyciąg z rejestru do akt sprawy”*.
   * Generuje to kartę dowodową o sygnaturze `K-01` gotową do przeciągnięcia do wniosku.
3. **Przeglądarka Zdjęć Oględzin (`PhotoViewerApp`):**
   * Każde zdjęcie z miejsca zdarzenia (`IMG-01` do `IMG-12`) może zostać dołączone do akt jako załącznik fotograficzny (np. `IMG-09: Odlew śladu obuwia D-2`).

### 5.3. Wieloslotowy kontener upuszczania dowodów (`Multi-Slot DropZone`)

Formularz wniosku o aresztowanie (`WarrantApp`) nie ogranicza się do pojedynczego slotu. Każdy z 4 wymogów procesowych posiada listę slotów `DropSlot(items: EvidenceItem[])`:

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ WNIOSEK O TYMCZASOWE ARESZTOWANIE (Ds. 112/02)                              │
├──────────────────────────────────────────────────────────────────────────────┤
│ 1. Obalenie alibi:                                                           │
│    [ AKT-006: Zeznanie M. (20:30-22:30 w barze) ] [ AKT-011: Biling BTS ]   │
├──────────────────────────────────────────────────────────────────────────────┤
│ 2. Obecność na miejscu zdarzenia:                                            │
│    [ AKT-012: Zeznanie stróża (Żuk SBI 73..) ]   [ K-01: Właściciel M. ]    │
├──────────────────────────────────────────────────────────────────────────────┤
│ 3. Ślad materialny / Narzędzie zbrodni:                                      │
│    [ AKT-014: Ekspertyza noża D-1 (12 cech zgodności z M.) ]                │
├──────────────────────────────────────────────────────────────────────────────┤
│ 4. Motyw czynu:                                                              │
│    [ AKT-013: Zeznanie siostry (szantaż/faktura) ] [ AKT-007: Faktura TRANS ]│
└──────────────────────────────────────────────────────────────────────────────┘
```

### 5.4. Logika walidacji wniosku (`warrantValidator.ts`)

| Wymóg formalny | Wymagane dowody (Zaliczony) | Dowody wspierające | Błędne dowody (Odrzucenie wniosku) |
| :--- | :--- | :--- | :--- |
| **1. Obalenie alibi** | `AKT-006` (kłamstwo M.) **ORAZ** (`AKT-010` [barmanka] **LUB** `AKT-011` [biling BTS Huta-Płn.]) | Oba dowody przeciwalibiowe razem | `AKT-009` (daje alibi do 21:15), `AKT-015` (alibi Tadeusza W.) |
| **2. Obecność na miejscu** | `AKT-012` (wjazd Żuka w książce) **ORAZ** `K-01` (Żuk zarejestrowany na M.) | `AKT-011` (logowanie w BTS Huta-Płn.) | `IMG-09` (powszechny wzór bieżnika), `AKT-008` (bójka z 11.03) |
| **3. Ślad materialny** | `AKT-014` w wariancie A (odcisk palca M. na nożu D-1) | `K-02` (karta daktyloskopijna M.) | `IMG-09` (odlew śladu buta), `AKT-008` (samo ujawnienie noża bez ekspertyzy), `AKT-014` w wariancie B (odcisk W.) |
| **4. Motyw czynu** | `AKT-013` (zeznanie siostry) **ORAZ** (`AKT-007` [faktura z dopiskiem] **LUB** `AKT-005` [biling z 5 połączeniami do skupu]) | `K-08` (notowania ofiary za kradzież miedzi) | `AKT-008` (bójka z Tadeuszem W. nie stanowi motywu dla podejrzanego M.) |

### 5.5. Ujednolicenie chronologii i budżetu

* **Zegar systemowy w zasobniku (Tray):** Start sprawy na pulpicie to **Czwartek 14.03.2002 r., godz. 08:00**.
* **Pula budżetowa (Roboczogodziny):** 80 godzin to pula *roboczogodzin operacyjnych*. Zlecenia terenowe realizowane są równolegle przez funkcjonariuszy KMP Czarnocin, co wyjaśnia, dlaczego wykonanie zleceń o sumarycznym koszcie 54 roboczogodzin pozwala zamknąć śledztwo w piątek o godz. 15:42.

---

## 6. Specyfikacja Komponentów Osi Czasu i Przeglądarki Zdjęć (Krok 3)

### 6.1. Generator Osi Czasu (`TimelineApp.vue`)

Komponent analizuje sekwencję zdarzeń z 13.03.2002 r. w przedziale 19:30–24:00 (podziałka co 15 minut).

```text
19:30   20:00   20:30   21:00   21:30   22:00   22:30   23:00   23:30   24:00
──┬───────┬───────┬───────┬───────┬───────┬───────┬───────┬───────┬───────┬──
  │               [--- Zeznanie: Bar Pod Lipą (M.) ---]   │       │
  │                       │               │               │       │
  │                       │   [BTS Huta]  │               │       │
  │                       │   (21:41-22:19)               │       │
  │                       │       ▲                       │       │
  │                       │       │                       │       │
  │                       │   [BRAMA NR 3: Żuk]           │       │
  │                       │   (21:45-22:15)               │       │
  │                       │                               │       │
  │                       │  ░░░ OKNO KOLIZJI ░░░         │       │
  │                       └──[ 21:41 - 22:19 ]────────────┘       │
  │                                                               [Trup]
```

* **Pasy zdarzeń (Tracks):**
  1. `Track: Alibi i świadkowie` (żółty pasek: 20:30–22:30 bar „Pod Lipą”),
  2. `Track: Telefonia komórkowa i stacje BTS` (niebieski pasek: 21:12 BTS Centrum, czerwony pasek: 21:41 i 22:19 BTS Huta-Płn.),
  3. `Track: Ruch na bocznicy kolejowej` (21:45 wjazd Żuka, 22:15 wyjazd Żuka, 23:50 ujawnienie zwłok przez Józefa K.).
* **Detekcja sprzeczności:** Gdy gracz upuści na oś biling `AKT-011` i zeznanie `AKT-006` lub `AKT-010`, aplikacja rysuje pionowe czerwone pasmo kolizji w przedziale **21:41–22:19** i generuje gotowy wniosek analityczny: *„Podejrzany fizycznie nie mógł przebywać w barze Pod Lipą w trakcie logowania telefonu na stacji Huta-Płn.”*.

### 6.2. Przeglądarka Zdjęć Kryminalistycznych (`PhotoViewerApp.vue`)

* **Nawigacja:** Panel boczny z miniaturami zdjęć `IMG-01` do `IMG-12` (aparat cyfrowy Olympus C-2000Z, rozdzielczość 2.0 megapiksela, format JPEG 1600×1200).
* **Narzędzia:** Lupa powiększająca (100%, 200%, 400%), obracanie, filtr kontrastu technicznego.
* **Metadane kadru:** Sygnatura, czas wykonania (14.03.2002 01:45), technik kryminalistyki st. asp. Andrzej Lasota, notatka techniczna do kadru.
* **Akcja:** Przycisk *„Dołącz odbitkę do schowka dowodowego”*.

---

## 7. Baza Danych Supabase i Struktury JSON (Krok 4)

### 7.1. Migracje bazy danych PostgreSQL 15 w Supabase (`supabase/migrations/`)

1. **`20261028000001_create_profiles_and_auth.sql`**:
   * Tabela `public.profiles` połączona kluczem obcym z `auth.users(id)`:
     - `badge_number` (np. 'CZ 20412/02'), `full_name`, `rank` ('mlodszy_aspirant', 'aspirant', 'podkomisarz', 'komisarz', 'podinspektor'), `service_points` (int), `department`.
   * Tabela `public.game_sessions`:
     - `user_id`, `active_case_id`, `virtual_time` (timestamp), `investigation_budget_hours` (int, domyślnie 80), `status` ('in_progress', 'solved', 'failed').
   * Polityki RLS: Użytkownik ma dostęp wyłącznie do swojego wiersza `profiles` oraz powiązanych sesji `game_sessions`.

2. **`20261028000002_create_cases_and_documents.sql`**:
   * Tabela `public.cases`:
     - `id`, `code` (np. 'Ds. 112/02'), `title`, `required_rank`, `starting_budget_hours`, `case_status`.
   * Tabela `public.documents`:
     - `id` (np. 'AKT-001'), `case_id`, `title`, `doc_type` ('protocol', 'billing', 'invoice', 'report', 'lab_opinion'), `content_html`, `pages_count`, `available_at_start`, `unlocked_by_action_id`.
   * Tabela `public.case_photos`:
     - `id` (np. 'IMG-01'), `case_id`, `file_name`, `description`, `technician_notes`.
   * Tabela `public.ksip_records`:
     - `id` (np. 'K-01'), `category` ('vehicle', 'person', 'phone', 'company'), `search_query`, `display_title`, `record_data` (JSONB).
   * Tabela `public.field_actions`:
     - `id` (np. 'Z-01'), `case_id`, `name`, `cost_hours`, `requires_superior_approval`, `result_document_ids`.

3. **`20261028000003_create_evidence_and_warrants.sql`**:
   * Tabela `public.evidence_items`:
     - `id`, `session_id`, `document_id`, `type`, `quote_text`, `color`, `source_title`, `metadata` (JSONB).
   * Tabela `public.warrants`:
     - `id`, `session_id`, `case_id`, `suspect_name`, `alibi_evidence_ids` (UUID[]), `presence_evidence_ids` (UUID[]), `material_trace_evidence_ids` (UUID[]), `motive_evidence_ids` (UUID[]), `submitted_at`, `status` ('draft', 'approved', 'rejected').
   * Tabela `public.warrant_evaluations`:
     - `id`, `warrant_id`, `is_approved` (boolean), `feedback_by_requirement` (JSONB), `disciplinary_penalty_hours`, `penalty_points`.
   * Tabela `public.ksip_audit_log`:
     - `id`, `session_id`, `query_text`, `created_at`. Licznik zapytań kontrolowany triggerem PostgreSQL (blokada po 10 zapytaniach dla Młodszego Aspiranta).

### 7.2. Struktura ustrukturyzowanych plików JSON w aplikacji (`src/data/cases/case-01/`)

Dla zapewnienia natychmiastowego renderowania i działania silnika walidacji dane Sprawy 1 przechowywane są również jako zestawy statyczne JSON:
* `case.json` – metadane sprawy, sygnatura, terminy, cel operacyjny.
* `documents.json` – 16 dokumentów (AKT-001 do AKT-016) z pełną treścią HTML retro i etykietami znaczników.
* `photos.json` – 12 zdjęć z oględzin (IMG-01 do IMG-12) z opisami st. asp. Lasoty.
* `ksip-records.json` – baza rekordów (K-01 do K-08) dla wyszukiwarki KSIP.
* `field-actions.json` – definicje zleceń terenowych (Z-01 do Z-07) z kosztami i wymaganiami akceptacji.
* `timeline-events.json` – zdarzenia i logowania BTS z 13.03.2002 r. do Generatora Osi Czasu.
* `validation-rules.json` – definicje poprawnych, wspierających i błędnych dowodów dla prokuratora.
* `mails.json` – wiadomości poczty wewnętrznej (MAIL-01 do MAIL-03).
