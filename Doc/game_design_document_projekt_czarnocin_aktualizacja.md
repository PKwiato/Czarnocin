# GAME DESIGN DOCUMENT (GDD)

## Tytuł roboczy: Projekt Czarnocin 2002

**Gatunek:** Virtual Desktop / UI Detective Game (Browser-based)
**Platforma:** Przeglądarka internetowa (React / Vue + HTML5)
**Klimat:** Neo-noir, kryminał policyjny, Polska transformacji ustrojowej (wczesne lata 2000.)

---

## 1. Koncept Główny i Pętla Rozgrywki (Core Loop)

Gracz wciela się w policyjnego dochodzeniowca pracującego w surowym środowisku intranetowym (wzorowanym na wczesnym KSIP). Rozgrywka toczy się w 100% na ekranie wirtualnego komputera.

**Pełna pętla rozgrywki:**
1. **Analiza (Czytanie):** Gracz otrzymuje wstępne raporty. Analizuje skany, zeznania i zdjęcia.
2. **Przetwarzanie (Narzędzia):** Zaznacza sprzeczności, układa oś czasu.
3. **Działanie (Zlecenia):** Zleca czynności w terenie (np. ponowne przesłuchanie, weryfikacja bilingów, analiza balistyczna). **Każde zlecenie kosztuje wirtualny czas / budżet śledztwa.**
4. **Synteza (Wniosek):** Z zebranych, żelaznych dowodów kompletuje formalny Wniosek o Aresztowanie.
5. **Ocena i Progresja:** Sąd/Prokurator ocenia wniosek. Sukces przyznaje Punkty Służbowe, prowadząc do awansu.

---

## 2. Świat i Realia (Setting)

* **Miasto:** Czarnocin - fikcyjne, postindustrialne miasto. Upadająca Huta "Silesia", bezrobocie, nowobogaccy biznesmeni, biedaszyby i osiedla z wielkiej płyty.
* **Technologia (2001/2002):** Brak smartfonów, powszechnego monitoringu HD czy szybkiego internetu. System to surowy Windows 2000/NT. Akta dostarczane są jako skany faksów, dane na dyskietkach (ikony napędu A:), zdjęcia z aparatów 2.0 MP, papierowe wydruki bilingów (operatorzy np. Era, Idea).
* **Układ:** Nieformalna sieć łącząca byłych oficerów MO (agencje ochrony), syndyka upadłej Huty, lokalny biznes i skorumpowaną prokuraturę.

---

## 3. Interfejs i Narzędzia Analityczne Gracza

Pulpit wyposażony jest w programy symulujące pracę śledczego:
* **Marker Aktowy (Highlighter):** Narzędzie do kolorowania tekstu (Żółty = alibi/fakty, Czerwony = kłamstwa/sprzeczności, Niebieski = powiązania osobiste). Zaznaczone fragmenty można "Wpiąć do akt" jako osobny dowód.
* **Generator Osi Czasu (Timeline):** Aplikacja, do której gracz przeciąga zeznania z godzinami. System układa je graficznie, pomagając wyłapać, że podejrzany nie mógł być w dwóch miejscach jednocześnie.
* **Baza KSIP (Weryfikator):** Prosta wyszukiwarka krzyżowa. Wpisanie nazwiska PESEL wyrzuca powiązane notatki, rejestracje pojazdów i notowania kryminalne.

---

## 4. Mechaniki Systemowe

### A. Moduł Wnioskowy (Formularz Sankcji)
Gracz nie klika "Aresztuj X". Wypełnia surowy formularz procesowy. Do każdego wymogu (np. *Obalenie Alibi*, *Obecność na miejscu*, *Ślad materialny*, *Motyw*) musi podpiąć konkretną, poprawną sygnaturę dowodu. Błąd merytoryczny skutkuje odrzuceniem wniosku przez prokuratora i karą dyscyplinarną.

### B. System Progresji i Uprawnień (Rangi)
Zdobywanie Punktów Służbowych za bezbłędne śledztwa skutkuje awansami, które fizycznie rozbudowują system operacyjny gracza:
1. **Młodszy Aspirant (Początek):**
   * *Uprawnienia:* Baza PESEL, notatki dzielnicowych, proste raporty z rejonu.
   * *Ograniczenia:* Wnioski o bilingi i ekspertyzy laboratoryjne wymagają żmudnej akceptacji przełożonego (limit zapytań).
2. **Aspirant / Podkomisarz (Środek gry):**
   * *Uprawnienia:* Samodzielne pobieranie bilingów BTS, dostęp do centralnego rejestru pojazdów skradzionych i bazy broni palnej.
   * *Sprawy:* Porachunki gangu, morderstwa na zlecenie.
3. **Komisarz / Podinspektor (Endgame - KGP/CBŚ):**
   * *Uprawnienia:* Klauzula "Ściśle Tajne", dostęp do raczkującej ogólnopolskiej bazy DNA, podsłuchy stacjonarne, rejestry kont bankowych (Generalny Inspektor Informacji Finansowej).
   * *Możliwość ominięcia lokalnej prokuratury* (wysyłanie wniosków do szczebla apelacyjnego).

### C. Prywatna Teczka Operacyjna (Metagra)
Gracz ma na dysku ukryty folder (np. `C:\TEMP\NOTATKI`). Zapisuje w nim numery rejestracyjne, nazwiska, nazwy firm i fragmenty bilingów. Gra nie mówi mu wprost, co się przyda. Gracz sam musi użyć wyszukiwarki KSIP w Sprawie 4, by sprawdzić NIP firmy, o którym czytał w Sprawie 1.

### D. Reakcja Systemu ("Układ" jako Nemesis)
Im gracz wyżej awansuje i bliżej jest jądra afery, tym system staje się bardziej wrogi:
* Znikające akta (Błąd 404 - usunięto przez administratora).
* Czerwone klauzule prokuratorskie blokujące odczyt zeznań.
* Kontrole Biura Spraw Wewnętrznych (BSW) za zbyt częste korzystanie z bazy KSIP względem osób "niepowiązanych" z lokalnymi śledztwami.
* Maile z pogróżkami od zastępcy komendanta wymuszające zamknięcie śledztwa ze wskazaniem na fałszywego sprawcę ("kozła ofiarnego").

---

## 5. Struktura Fabularna: Kryptonim "Kombinat"

Wszystkie sprawy początkowo wyglądają na izolowane incydenty. Stopniowo układają się w makro-śledztwo dotyczące wyprzedaży majątku Huty Silesia i mafii paliwowej.

* **Sprawa 1: Złom na bocznicy (Młodszy aspirant)**
  * *Zbrodnia:* Morderstwo złomiarza nożem.
  * *Rozwiązanie:* Winny okazuje się lokalny paser.
  * *Ukryty okruch dla gracza:* Faktura przewozowa na spółkę "TRANS-MET" i pojawiający się w bilingu obcy numer z Ery, powiązany z agencją ochrony.

* **Sprawa 2: Skok z balkonu (Aspirant)**
  * *Zbrodnia:* Upozorowane samobójstwo głównej księgowej syndyka Huty.
  * *Rozwiązanie:* Znalezienie śladów eteru i obalenie alibi jej brutalnego konkubenta.
  * *Ukryty okruch dla gracza:* Arkusz Excela z wyprowadzonymi funduszami zatwierdzony przez notariusza J. Rawicza. W logach modemu konkubenta widnieje kontakt z tym samym numerem Ery ze Sprawy 1.

* **Sprawa 3: Wojna w motelu (Podkomisarz)**
  * *Zbrodnia:* Egzekucja w motelu, ginie gangster, ranny jest ochroniarz agencji "Huzar".
  * *Rozwiązanie:* Powiązanie łusek i śladów opon z wozem ucieczkowym.
  * *Ukryty okruch dla gracza:* Notes z listą łapówek na własnej komendzie. Odkrycie, że szefem "Huzara" jest kumpel Twojego komendanta, a prana kasa trafia do "TRANS-MET".

* **Sprawa 4: Archiwum X - Pętla czasu (Komisarz)**
  * *Zbrodnia:* Wykopanie szkieletu dawnego dyrektora Huty (zaginięcie w 1993 roku przed prywatyzacją).
  * *Rozwiązanie:* Zestawienie starych teczek milicyjnych z nową bazą DNA. Odkrycie, kto przejął jego udziały po "zaginięciu".
  * *Ukryty okruch dla gracza:* Zrozumienie, że cały biznesowy szczyt Czarnocina został zbudowany na tej jednej egzekucji.

* **Sprawa 5: Ostateczne uderzenie (Podinspektor / Finał)**
  * *Zbrodnia:* Podpalenie zakładowego archiwum i próba zniszczenia dysków.
  * *Rozwiązanie:* Gra przeciwko własnemu komendantowi. Zamiast szukać mordercy z ulicy, gracz szuka dowodów korupcji urzędniczej. Kompletuje wielki wniosek do Wydziału Przestępczości Zorganizowanej z pominięciem lokalnych blokad, zamykając wszystkich aktorów pojawiających się od Sprawy 1.