<template>
  <div class="screen-wrapper" :class="{ 'crt-disabled': !crtEnabled }">
    <div class="virtual-screen" :style="screenScaleStyle">
      <!-- Warstwa efektu kineskopu CRT 60Hz -->
      <CrtOverlay :enabled="crtEnabled" />

      <!-- Ekran wstępnego ładowania sesji KSIP -->
      <template v-if="isLoadingSession">
        <div class="boot-screen">
          <div class="boot-box">
            <div class="boot-title">KRAJOWY SYSTEM INFORMACJI POLICJI</div>
            <div class="boot-sub">Inicjalizacja terminala KC-07...</div>
          </div>
        </div>
      </template>

      <!-- Warunkowy widok ekranu (Flow) -->
      <template v-else-if="currentScreen === 'login'">
        <LoginScreen
          @login-success="handleLoginSuccess"
          @switch-screen="(s) => (currentScreen = s)"
        />
      </template>

      <template v-else-if="currentScreen === 'register'">
        <RegisterScreen
          @register-success="handleRegisterSuccess"
          @switch-screen="(s) => (currentScreen = s)"
        />
      </template>

      <template v-else-if="currentScreen === 'assignment'">
        <CaseAssignmentScreen
          @start-case="currentScreen = 'desktop'"
        />
      </template>

      <template v-else-if="currentScreen === 'warrant-result'">
        <WarrantResultScreen
          v-if="warrantResult"
          :result="warrantResult"
          @return-to-desktop="currentScreen = 'desktop'"
          @accept-promotion="handleAcceptPromotion"
        />
      </template>

      <!-- Pełny wirtualny pulpit dochodzeniowy Windows 2000 (Desktop OS) -->
      <template v-else-if="currentScreen === 'desktop'">
        <Desktop>
          <!-- 1. Przeglądarka Akt & Marker Aktowy -->
          <WindowFrame window-id="case-viewer" :min-width="340" :min-height="220">
            <CaseViewerApp />
          </WindowFrame>

          <!-- 2. Generator Osi Czasu -->
          <WindowFrame window-id="timeline" :min-width="320" :min-height="180">
            <TimelineApp />
          </WindowFrame>

          <!-- 3. Terminal KSIP (Wyszukiwarka rejestrowa) -->
          <WindowFrame window-id="ksip" :min-width="280" :min-height="160">
            <KsipApp />
          </WindowFrame>

          <!-- 4. Formularz Wniosku o Aresztowanie -->
          <WindowFrame window-id="warrant" :min-width="340" :min-height="180">
            <WarrantApp @warrant-evaluated="handleWarrantEvaluated" />
          </WindowFrame>

          <!-- 5. Dyspozytor Zleceń w Terenie -->
          <WindowFrame window-id="field-dispatcher" :min-width="260" :min-height="180">
            <FieldDispatcherApp />
          </WindowFrame>

          <!-- 6. Przeglądarka Zdjęć Oględzin (IMG-01 do IMG-12) -->
          <WindowFrame window-id="photo-viewer" :min-width="320" :min-height="200">
            <PhotoViewerApp />
          </WindowFrame>

          <!-- 7. Poczta Służbowa -->
          <WindowFrame window-id="mail" :min-width="300" :min-height="200">
            <MailApp />
          </WindowFrame>

          <!-- 8. Notatnik Śledczego (C:\TEMP\NOTATKI) -->
          <WindowFrame window-id="notepad" :min-width="240" :min-height="140">
            <NotepadApp />
          </WindowFrame>
        </Desktop>

        <!-- Dolny pasek zadań Windows 2000 z zasobnikiem i menu Start -->
        <Taskbar
          :crt-active="crtEnabled"
          @toggle-crt="crtEnabled = !crtEnabled"
          @logout="handleLogout"
        />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import type { WarrantEvaluationResult } from './types/warrant.types';
import { useAuthStore } from './stores/authStore';
import { useActiveCaseStore } from './stores/activeCaseStore';
import { useVirtualTimeStore } from './stores/virtualTimeStore';

// Powłoka OS
import Desktop from './components/os/Desktop.vue';
import WindowFrame from './components/os/WindowFrame.vue';
import Taskbar from './components/os/Taskbar.vue';
import CrtOverlay from './components/os/CrtOverlay.vue';

// Aplikacje dochodzeniowe
import CaseViewerApp from './components/apps/CaseViewerApp.vue';
import TimelineApp from './components/apps/TimelineApp.vue';
import KsipApp from './components/apps/KsipApp.vue';
import WarrantApp from './components/apps/WarrantApp.vue';
import FieldDispatcherApp from './components/apps/FieldDispatcherApp.vue';
import PhotoViewerApp from './components/apps/PhotoViewerApp.vue';
import MailApp from './components/apps/MailApp.vue';
import NotepadApp from './components/apps/NotepadApp.vue';

// Ekrany przepływu gry
import LoginScreen from './components/screens/LoginScreen.vue';
import RegisterScreen from './components/screens/RegisterScreen.vue';
import CaseAssignmentScreen from './components/screens/CaseAssignmentScreen.vue';
import WarrantResultScreen from './components/screens/WarrantResultScreen.vue';

type AppScreen = 'login' | 'register' | 'assignment' | 'desktop' | 'warrant-result';

const isLoadingSession = ref(true);
const currentScreen = ref<AppScreen>('login'); // Początkowo 'login', weryfikowane przez initAuth
const crtEnabled = ref(false); // Domyślnie wyłączona emulacja CRT
const warrantResult = ref<WarrantEvaluationResult | null>(null);

const authStore = useAuthStore();
const caseStore = useActiveCaseStore();
const timeStore = useVirtualTimeStore();

const screenScale = ref(1);

const updateScale = () => {
  const targetWidth = 1280;
  const targetHeight = 800;
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  const scaleX = windowWidth / targetWidth;
  const scaleY = windowHeight / targetHeight;
  screenScale.value = Math.min(scaleX, scaleY, 1.25);
};

const screenScaleStyle = computed(() => {
  return {
    transform: `scale(${screenScale.value})`,
    transformOrigin: 'center center',
  };
});

const handleLoginSuccess = () => {
  currentScreen.value = 'assignment';
};

const handleRegisterSuccess = () => {
  currentScreen.value = 'assignment';
};

const handleWarrantEvaluated = (result: WarrantEvaluationResult) => {
  warrantResult.value = result;
  if (!result.isApproved) {
    timeStore.applyBudgetPenalty(result.penaltyBudgetHours);
    authStore.applyPenaltyPoints(result.penaltyPoints);
  } else {
    authStore.addServicePoints(result.rewardPoints);
  }
  currentScreen.value = 'warrant-result';
};

const handleAcceptPromotion = () => {
  authStore.promote('aspirant');
  currentScreen.value = 'desktop';
};

const handleLogout = async () => {
  await authStore.logout();
  currentScreen.value = 'login';
};

onMounted(async () => {
  updateScale();
  window.addEventListener('resize', updateScale);
  await caseStore.loadCase('case-01');

  try {
    const hasSession = await authStore.initAuth();
    if (hasSession) {
      currentScreen.value = 'desktop';
    } else {
      currentScreen.value = 'login';
    }
  } catch (err) {
    console.warn('Błąd weryfikacji sesji KSIP:', err);
    currentScreen.value = 'login';
  } finally {
    isLoadingSession.value = false;
  }
});

onUnmounted(() => {
  window.removeEventListener('resize', updateScale);
});
</script>

<style scoped>
.screen-wrapper {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background-color: #0b171a;
}

.boot-screen {
  width: 100%;
  height: 100%;
  background-color: #0c181b;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-os);
  color: #c8b560;
}

.boot-box {
  text-align: center;
  padding: 30px;
  border: 2px solid #0a246a;
  background-color: #071518;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.8);
}

.boot-title {
  font-size: 15px;
  letter-spacing: 2px;
  font-weight: bold;
  color: #ffffff;
  margin-bottom: 8px;
}

.boot-sub {
  font-size: 12px;
  color: #9fb3b8;
}
</style>
