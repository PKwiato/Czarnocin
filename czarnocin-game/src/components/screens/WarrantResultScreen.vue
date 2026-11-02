<template>
  <div class="screen-container">
    <div class="result-dialog window-frame border-outset">
      <div class="window-titlebar">
        <span>Poczta służbowa — Postanowienie Prokuratury Rejonowej w Czarnocinie</span>
        <div class="window-controls">
          <span class="win-btn-control">_</span>
          <span class="win-btn-control">□</span>
          <span class="win-btn-control">✕</span>
        </div>
      </div>

      <!-- Nagłówek e-mail / faksu -->
      <div class="mail-header-info">
        <div><strong>Od:</strong> Prokuratura Rejonowa w Czarnocinie</div>
        <div><strong>Do:</strong> Młodszy Aspirant (dochodzeniowiec prowadzący)</div>
        <div>
          <strong>Temat:</strong> Ds. 112/02 — wniosek o tymczasowe aresztowanie:
          <span :class="result.isApproved ? 'status-approved-text' : 'status-rejected-text'">
            {{ result.isApproved ? 'UWZGLĘDNIONY' : 'ODRZUCONY' }}
          </span>
        </div>
      </div>

      <div class="result-body">
        <!-- Lewy panel: faks postanowienia prokuratorskiego -->
        <div class="fax-panel border-inset">
          <div class="fax-header">
            PROKURATURA REJONOWA W CZARNOCINIE<br />
            <strong>{{ result.overallDecision }}</strong>
          </div>
          <div class="fax-date">Skan faksu · strona 1 z 1 · Czarnocin</div>

          <p v-if="result.isApproved" class="fax-paragraph">
            W sprawie <strong>Ds. 112/02</strong> wniosek o zastosowanie tymczasowego aresztowania wobec podejrzanego został <strong>uwzględniony</strong>.
          </p>
          <p v-else class="fax-paragraph">
            W sprawie <strong>Ds. 112/02</strong> wniosek o zastosowanie tymczasowego aresztowania został <strong class="text-rejected">odrzucony</strong>.
          </p>

          <p class="fax-paragraph">
            <strong>Uzasadnienie:</strong> {{ result.justificationText }}
          </p>

          <div v-if="!result.isApproved" class="fax-instruction">
            Wniosek zawiera błędy merytoryczne lub braki dowodowe. Polecam uzupełnić materiał dowodowy w drodze czynności operacyjnych i złożyć wniosek ponownie.
          </div>

          <div class="fax-sign">
            prokurator rejonowy<br />
            <em>podpis nieczytelny</em>
          </div>
        </div>

        <!-- Prawy panel: szczegółowa ocena 4 wymogów i rozliczenie -->
        <div class="result-details-panel">
          <!-- Tabela 4 wymogów procesowych -->
          <div class="group-box">
            <h3>Ocena formalna wniosku procesowego</h3>
            <table class="retro-table">
              <thead>
                <tr>
                  <th>Wymóg procesowy</th>
                  <th style="width: 85px">Wynik</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(ev, key) in result.requirements" :key="key">
                  <td>
                    <strong>{{ ev.name }}</strong>
                    <div v-if="ev.feedbackMessage" class="req-feedback-sub">
                      {{ ev.feedbackMessage }}
                    </div>
                  </td>
                  <td>
                    <span :class="ev.isSatisfied ? 'val-success' : 'val-error'">
                      {{ ev.statusText }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Karta sukcesu / awansu -->
          <div v-if="result.isApproved" class="group-box">
            <h3>Awans służbowy</h3>
            <div class="progress-bar-container border-inset">
              <div class="progress-bar-fill" style="width: 100%"></div>
            </div>
            <p class="advance-text">
              Punkty służbowe: <strong>+{{ result.rewardPoints }} pkt</strong>. Odblokowano stopień: <strong>Aspirant</strong> (samodzielne bilingi BTS, baza skradzionych pojazdów).
            </p>
          </div>

          <!-- Karta kary dyscyplinarnej przy odrzuceniu -->
          <div v-else class="group-box group-box-penalty">
            <h3 style="color: #7a0a14">Kara dyscyplinarna</h3>
            <div class="kv-row"><span>Wpis do akt</span><b>Nagana prokuratorska</b></div>
            <div class="kv-row"><span>Utrata budżetu</span><b style="color: #7a0a14">-{{ result.penaltyBudgetHours }} godz.</b></div>
            <div class="kv-row"><span>Punkty karne</span><b style="color: #7a0a14">-{{ result.penaltyPoints }} pkt</b></div>
            <p class="penalty-text">
              Kolejne odrzucenie wniosku może skutkować dyscyplinarnym odebraniem sprawy przez komendanta.
            </p>
          </div>
        </div>
      </div>

      <!-- Dolna belka -->
      <footer class="result-footer">
        <span v-if="result.isApproved">Śledztwo w sprawie Ds. 112/02 zakończone sukcesem procesowym.</span>
        <span v-else>Akta sprawy pozostają otwarte. Popraw wniosek przed wyczerpaniem budżetu.</span>

        <button
          v-if="!result.isApproved"
          type="button"
          class="btn-retro btn-primary btn-action"
          @click="$emit('return-to-desktop')"
        >
          📂 Wróć do akt i popraw wniosek
        </button>
        <button
          v-else
          type="button"
          class="btn-retro btn-primary btn-action"
          @click="$emit('accept-promotion')"
        >
          ⭐ Przyjmij awans i zamknij sprawę
        </button>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { WarrantEvaluationResult } from '../../types/warrant.types';

defineProps<{
  result: WarrantEvaluationResult;
}>();

defineEmits<{
  (e: 'return-to-desktop'): void;
  (e: 'accept-promotion'): void;
}>();
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

.result-dialog {
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

.status-approved-text {
  color: #0a5a1a;
  font-weight: bold;
}

.status-rejected-text {
  color: #7a0a14;
  font-weight: bold;
}

.result-body {
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

.fax-paragraph {
  margin-bottom: 10px;
}

.text-rejected {
  background-color: #e8707a;
  padding: 1px 4px;
}

.fax-instruction {
  margin-top: 12px;
  padding: 8px 10px;
  background-color: #fbf0b0;
  border: 1px dashed #7a0a14;
  font-size: 11px;
}

.fax-sign {
  margin-top: 18px;
  text-align: right;
  line-height: 1.4;
}

.result-details-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.req-feedback-sub {
  font-size: 10px;
  font-weight: normal;
  color: #555555;
  margin-top: 2px;
}

.val-success {
  color: #0a5a1a;
  font-weight: bold;
}

.val-error {
  color: #7a0a14;
  font-weight: bold;
}

.group-box-penalty {
  border-color: #7a0a14;
}

.progress-bar-container {
  height: 14px;
  background-color: #ffffff;
  margin: 6px 0;
}

.progress-bar-fill {
  height: 100%;
  background-color: #0a246a;
}

.advance-text,
.penalty-text {
  font-size: 11px;
  line-height: 1.5;
  margin-top: 6px;
}

.result-footer {
  display: flex;
  align-items: center;
  padding: 8px 14px;
  border-top: 1px solid #808080;
  background-color: var(--win-gray);
  font-size: 11px;
}

.btn-action {
  margin-left: auto;
  font-weight: bold;
  padding: 4px 16px;
}
</style>
