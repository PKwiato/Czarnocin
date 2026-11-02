<template>
  <div class="notepad-app">
    <!-- Pasek menu notatnika Windows 2000 -->
    <div class="notepad-menubar">
      <span class="menu-item" @click="saveNotes()">Plik</span>
      <span class="menu-item">Edycja</span>
      <span class="menu-item">Format</span>
      <span class="menu-item">Pomoc</span>
      <span v-if="saveFeedback" class="save-status">{{ saveFeedback }}</span>
    </div>

    <!-- Pole edycyjne notatnika -->
    <div class="notepad-editor-container border-inset">
      <textarea
        v-model="notesContent"
        class="notepad-textarea"
        placeholder="Wpisuj tutaj własne hipotezy, powiązania i numery telefonów... Notatki z C:\TEMP\NOTATKI zostają na dysku pomiędzy kolejnymi sprawami."
        @input="handleInput"
      ></textarea>
    </div>

    <!-- Pasek statusu -->
    <footer class="window-statusbar">
      <span>Plik: C:\TEMP\NOTATKI\operacyjne.txt</span>
      <span class="status-sep">|</span>
      <span>Znaków: {{ notesContent.length }}</span>
      <span class="status-sep">|</span>
      <span style="margin-left: auto">Windows (CRLF) · ANSI</span>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useSoundEffects } from '../../composables/useSoundEffects';

const storageKey = 'czarnocin_temp_notatki';
const initialDefault = `C:\\TEMP\\NOTATKI\\operacyjne.txt
=========================================
ŚLEDZTWO: Ds. 112/02 (Zabójstwo na bocznicy)
Data: 14.03.2002 r.

[WŁASNE HIPOTEZY I NOTATKI ŚLEDCZE]
- Brama nr 3: dozorca Józef K. znalazł zwłoki 23:50
- Sprawdzić bilingi i powiązania firmy TRANS-MET z Hutą Silesia
- Kto dzwonił z numeru 602 552 071 (ochrona)?
`;

const notesContent = ref('');
const saveFeedback = ref('');
const { playSound } = useSoundEffects();

let saveTimeout: number | undefined;

const handleInput = () => {
  clearTimeout(saveTimeout);
  saveTimeout = window.setTimeout(() => {
    saveNotes(false);
  }, 1000);
};

const saveNotes = (withFeedback = true) => {
  try {
    localStorage.setItem(storageKey, notesContent.value);
    if (withFeedback) {
      playSound('click');
      saveFeedback.value = 'Zapisano!';
      setTimeout(() => {
        saveFeedback.value = '';
      }, 2000);
    }
  } catch {
    // Ignoruj błędy localStorage
  }
};

onMounted(() => {
  const saved = localStorage.getItem(storageKey);
  notesContent.value = saved !== null ? saved : initialDefault;
});
</script>

<style scoped>
.notepad-app {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: var(--win-gray);
  font-size: 11px;
}

.notepad-menubar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 2px 6px;
  background-color: var(--win-gray);
  border-bottom: 1px solid #808080;
  user-select: none;
}

.menu-item {
  cursor: pointer;
  padding: 1px 4px;
}

.menu-item:hover {
  background-color: #0a246a;
  color: #ffffff;
}

.save-status {
  margin-left: auto;
  font-weight: bold;
  color: #0a5a1a;
}

.notepad-editor-container {
  flex: 1;
  background-color: #ffffff;
  display: flex;
  min-height: 0;
}

.notepad-textarea {
  flex: 1;
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  resize: none;
  padding: 8px 10px;
  font-family: var(--font-mono);
  font-size: 12px;
  line-height: 1.5;
  color: #111111;
  background-color: #ffffff;
  box-sizing: border-box;
}

.status-sep {
  margin: 0 6px;
  color: #808080;
}
</style>
