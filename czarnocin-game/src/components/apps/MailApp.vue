<template>
  <div class="mail-app">
    <!-- Pasek narzędzi Outlook Express -->
    <div class="win-toolbar mail-toolbar">
      <button type="button" class="btn-retro" @click="playSound('mail')">
        ✉️ Utwórz wiadomość
      </button>
      <button type="button" class="btn-retro" @click="playSound('click')">
        📥 Odbierz pocztę
      </button>
    </div>

    <!-- Główna zawartość -->
    <div class="mail-main">
      <!-- Skrzynka odbiorcza (Lista wiadomości) -->
      <div class="mail-list-panel border-inset">
        <table class="retro-table mail-table">
          <thead>
            <tr>
              <th style="width: 30px">!</th>
              <th style="width: 170px">Od</th>
              <th>Temat</th>
              <th style="width: 110px">Wysłano</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="mail in mails"
              :key="mail.id"
              :class="{ active: selectedMail?.id === mail.id, unread: !mail.isRead }"
              @click="selectMail(mail)"
            >
              <td style="text-align: center">
                <span v-if="!mail.isRead">✉️</span>
                <span v-else>📭</span>
              </td>
              <td><strong>{{ mail.from }}</strong></td>
              <td>{{ mail.subject }}</td>
              <td>{{ mail.date }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Podgląd wiadomości -->
      <div class="mail-view-panel border-inset">
        <div v-if="selectedMail" class="mail-content">
          <div class="mail-meta-header">
            <div><strong>Od:</strong> {{ selectedMail.from }}</div>
            <div><strong>Do:</strong> Dochodzeniowiec dyżurny (Mł. Aspirant)</div>
            <div><strong>Temat:</strong> {{ selectedMail.subject }}</div>
            <div><strong>Data:</strong> {{ selectedMail.date }}</div>
          </div>
          <hr class="mail-divider" />
          <div class="mail-body-text">
            {{ selectedMail.content }}
          </div>
        </div>

        <div v-else class="mail-empty">
          Wybierz wiadomość ze skrzynki odbiorczej.
        </div>
      </div>
    </div>

    <!-- Pasek statusu -->
    <footer class="window-statusbar">
      <span>Wiadomości: {{ mails.length }}</span>
      <span class="status-sep">|</span>
      <span>Nieprzeczytane: {{ unreadCount }}</span>
      <span class="status-sep">|</span>
      <span style="margin-left: auto">Konto: adamski@kmp.czarnocin.policja.gov.pl</span>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { InternalMail } from '../../types/case.types';
import mailsJson from '../../data/cases/case-01/mails.json';
import { useSoundEffects } from '../../composables/useSoundEffects';

const mails = ref<InternalMail[]>(mailsJson as InternalMail[]);
const selectedMail = ref<InternalMail | null>(mails.value[0] || null);

const { playSound } = useSoundEffects();

const unreadCount = computed(() => mails.value.filter((m) => !m.isRead).length);

const selectMail = (mail: InternalMail) => {
  playSound('click');
  selectedMail.value = mail;
  mail.isRead = true;
};
</script>

<style scoped>
.mail-app {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: var(--win-gray);
  font-size: 11px;
}

.mail-toolbar {
  display: flex;
  gap: 6px;
  align-items: center;
  padding: 4px 6px;
}

.mail-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 6px;
  min-height: 0;
}

.mail-list-panel {
  height: 140px;
  background-color: #ffffff;
  overflow-y: auto;
}

.mail-table tr {
  cursor: pointer;
}

.mail-table tr.active {
  background-color: #0a246a;
  color: #ffffff;
}

.mail-table tr.unread {
  font-weight: bold;
}

.mail-view-panel {
  flex: 1;
  background-color: #ffffff;
  padding: 10px 12px;
  overflow-y: auto;
}

.mail-meta-header {
  font-size: 11px;
  line-height: 1.5;
  color: #222222;
}

.mail-divider {
  border: none;
  border-top: 1px solid #d4d0c8;
  margin: 8px 0;
}

.mail-body-text {
  font-family: var(--font-os);
  font-size: 12px;
  line-height: 1.6;
  color: #111111;
  white-space: pre-line;
}

.mail-empty {
  color: #888888;
  font-style: italic;
  padding: 20px;
  text-align: center;
}

.status-sep {
  margin: 0 6px;
  color: #808080;
}
</style>
