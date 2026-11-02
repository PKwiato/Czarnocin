<template>
  <div class="screen-container">
    <div class="assignment-dialog window-frame border-outset">
      <div class="window-titlebar">
        <span>Poczta służbowa — Polecenie przydziału sprawy (Ds. 112/02)</span>
        <div class="window-controls">
          <span class="win-btn-control">_</span>
          <span class="win-btn-control">□</span>
          <span class="win-btn-control">✕</span>
        </div>
      </div>

      <!-- Nagłówek wiadomości służbowej -->
      <div class="mail-header-info">
        <div><strong>Od:</strong> Komenda Miejska Policji w Czarnocinie, Wydział Kryminalny</div>
        <div><strong>Do:</strong> Młodszy Aspirant (dochodzeniowiec dyżurny)</div>
        <div><strong>Temat:</strong> Przydział sprawy Ds. 112/02 — zabójstwo na bocznicy kolejowej Huty Silesia</div>
      </div>

      <!-- Dwa panele: Faks po lewej, karta sprawy po prawej -->
      <div class="assignment-body">
        <!-- Lewy panel: faks polecenia służbowego -->
        <div class="fax-panel border-inset">
          <div class="fax-header">
            KOMENDA MIEJSKA POLICJI W CZARNOCINIE<br />
            <strong>POLECENIE SŁUŻBOWE nr 31/02</strong>
          </div>
          <div class="fax-date">Skan faksu · strona 1 z 1 · 14.03.2002 r., godz. 07:55</div>

          <p>
            Na podstawie zgłoszenia z dnia 13.03.2002 r. polecam przejęcie i prowadzenie czynności w sprawie <strong>Ds. 112/02</strong>, dotyczącej zabójstwa mężczyzny, znalezionego na terenie bocznicy kolejowej Huty „Silesia”.
          </p>

          <p><strong>Pokrzywdzony:</strong> Henryk D., lat 47, zbieracz złomu, bez stałego zatrudnienia.</p>
          <p><strong>Przyczyna zgonu (wstępnie):</strong> rana kłuta klatki piersiowej. Narzędzie zbrodni nie zostało odnalezione.</p>
          <p><strong>Czas zdarzenia:</strong> wieczór 13.03.2002 r.</p>
          <p><strong>Kwalifikacja wstępna:</strong> art. 148 § 1 k.k.</p>
          <p><strong>Zadanie:</strong> ustalić sprawcę i skompletować wniosek o tymczasowe aresztowanie wraz z dowodami.</p>
          <p><strong>Uwaga:</strong> prokurator nadzorujący oczekuje kompletnego wniosku. Wniosek z błędem merytorycznym będzie odrzucony.</p>

          <div class="fax-sign">
            z-ca Naczelnika Wydz. Kryminalnego<br />
            <em>podpis nieczytelny</em>
          </div>
        </div>

        <!-- Prawy panel: karta sprawy i wytyczne -->
        <div class="dossier-summary-panel">
          <div class="group-box">
            <h3>Karta sprawy</h3>
            <div class="kv-row"><span>Sygnatura</span><b>Ds. 112/02</b></div>
            <div class="kv-row"><span>Rodzaj</span><b>Zabójstwo (nóż)</b></div>
            <div class="kv-row"><span>Miejsce</span><b>Bocznica nr 4, Huta „Silesia”</b></div>
            <div class="kv-row"><span>Pokrzywdzony</span><b>Henryk D., l. 47</b></div>
            <div class="kv-row"><span>Prowadzący</span><b>Młodszy Aspirant</b></div>
          </div>

          <div class="group-box">
            <h3>Materiały włączone do akt na starcie</h3>
            <ul class="summary-list">
              <li>Protokół oględzin miejsca zdarzenia (skan, 4 strony)</li>
              <li>Wykaz materiału fotograficznego (12 kadrów cyfrowych)</li>
              <li>Opinia lekarska o przyczynie zgonu</li>
              <li>Zeznanie Zbigniewa M. (skup złomu)</li>
              <li>Faktura przewozowa znaleziona przy zwłokach (D-3)</li>
            </ul>
          </div>

          <div class="group-box">
            <h3>Zasoby i limity operacyjne</h3>
            <div class="kv-row"><span>Budżet roboczogodzin</span><b>80 godz.</b></div>
            <div class="kv-row"><span>Limit zapytań KSIP</span><b>10 / miesiąc</b></div>
            <div class="kv-row"><span>Nagroda za sankcję</span><b>+100 pkt służbowych</b></div>
          </div>
        </div>
      </div>

      <!-- Dolna belka akcji -->
      <footer class="assignment-footer">
        <span>Śledztwo rozpoczyna się w czwartek 14.03.2002 r. o godz. 08:00.</span>
        <button
          type="button"
          class="btn-retro btn-primary btn-start-investigation"
          @click="startInvestigation"
        >
          📂 Otwórz akta i przejdź do pulpitu dochodzeniowego
        </button>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useActiveCaseStore } from '../../stores/activeCaseStore';
import { useSoundEffects } from '../../composables/useSoundEffects';

const emit = defineEmits<{
  (e: 'start-case'): void;
}>();

const caseStore = useActiveCaseStore();
const { playSound } = useSoundEffects();

const startInvestigation = async () => {
  playSound('floppy_read');
  await caseStore.loadCase('case-01');
  emit('start-case');
};
</script>

<style scoped>
.screen-container {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #12262b;
  overflow: hidden;
  font-family: var(--font-os);
}

.assignment-dialog {
  left: 60px;
  top: 20px;
  width: 1160px;
  height: 726px;
}

.mail-header-info {
  padding: 8px 12px;
  border-bottom: 1px solid #808080;
  font-size: 11px;
  line-height: 1.6;
  background-color: var(--win-gray);
}

.assignment-body {
  display: flex;
  gap: 14px;
  padding: 12px;
  flex: 1;
  min-height: 0;
}

.fax-panel {
  width: 640px;
  background-color: #f3f1e8;
  padding: 18px 24px;
  font-family: var(--font-mono);
  font-size: 12px;
  line-height: 1.6;
  color: #222222;
  overflow-y: auto;
}

.fax-header {
  text-align: center;
  margin-bottom: 4px;
}

.fax-date {
  text-align: center;
  font-size: 10px;
  color: #555555;
  margin-bottom: 12px;
}

.fax-sign {
  margin-top: 18px;
  text-align: right;
  line-height: 1.4;
}

.dossier-summary-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.summary-list {
  padding-left: 16px;
  font-size: 11px;
  line-height: 1.5;
}

.assignment-footer {
  display: flex;
  align-items: center;
  padding: 8px 14px;
  border-top: 1px solid #808080;
  background-color: var(--win-gray);
  font-size: 11px;
}

.btn-start-investigation {
  margin-left: auto;
  font-weight: bold;
  padding: 4px 16px;
}
</style>
