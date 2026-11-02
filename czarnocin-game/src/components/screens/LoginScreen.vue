<template>
  <div class="screen-container">
    <!-- Górny nagłówek KSIP -->
    <header class="ksip-top-header">
      <div class="police-emblem">POLICJA</div>
      <div>
        <div class="header-org-text">KOMENDA GŁÓWNA POLICJI · KOMENDA MIEJSKA W CZARNOCINIE</div>
        <h1 class="header-title-text">Krajowy System Informacji Policji (KSIP)</h1>
      </div>
      <div class="header-meta-text">
        DO UŻYTKU SŁUŻBOWEGO<br />
        wersja 2.3 · Windows 2000
      </div>
    </header>

    <!-- Okno dialogowe logowania -->
    <div class="login-dialog window-frame border-outset">
      <div class="window-titlebar">
        <span>Logowanie do systemu KSIP</span>
        <div class="window-controls">
          <span class="win-btn-control">_</span>
          <span class="win-btn-control">✕</span>
        </div>
      </div>

      <div class="dialog-body">
        <p class="dialog-desc">
          Wpisz adres e-mail i hasło konta policyjnego w chmurze lub skorzystaj z logowania lokalnego na stanowisku dyżurnym KC-07.
        </p>

        <!-- Komunikat błędu / ostrzeżenia -->
        <div v-if="errorMessage" class="error-banner border-inset">
          <span class="error-icon">⚠️</span>
          <div class="error-text">
            <strong>Błąd autoryzacji KSIP:</strong>
            <div>{{ errorMessage }}</div>
          </div>
        </div>

        <div class="form-row">
          <label>Adres e-mail:</label>
          <input
            v-model="email"
            type="email"
            class="input-retro"
            placeholder="np. funkcjonariusz@policja.pl"
            :disabled="authStore.isLoading"
            @keydown.enter="handleCloudLogin"
          />
        </div>

        <div class="form-row">
          <label>Hasło dostępowe:</label>
          <input
            v-model="password"
            type="password"
            class="input-retro"
            placeholder="wpisz hasło"
            :disabled="authStore.isLoading"
            @keydown.enter="handleCloudLogin"
          />
        </div>

        <div class="form-row">
          <label>Numer służbowy:</label>
          <div class="input-retro readonly-field">{{ authStore.badgeNumber }}</div>
        </div>

        <div class="form-row">
          <label>Jednostka:</label>
          <div class="input-retro readonly-field">KMP Czarnocin, Wydz. Dochodzeniowo-Śledczy</div>
        </div>

        <div class="last-login-info">
          Stanowisko: KC-07 (offline/online) · Terminal stacji roboczej
        </div>
      </div>

      <div class="dialog-actions">
        <button
          type="button"
          class="btn-retro action-btn btn-secondary"
          :disabled="authStore.isLoading"
          title="Wejdź do śledztwa bez logowania do bazy chmurowej"
          @click="handleLocalLogin"
        >
          Stanowisko KC-07 (Lokalnie)
        </button>

        <button
          type="button"
          class="btn-retro action-btn"
          :disabled="authStore.isLoading"
          @click="$emit('switch-screen', 'register')"
        >
          Nowe konto...
        </button>

        <button
          type="button"
          class="btn-retro action-btn btn-primary"
          :disabled="authStore.isLoading"
          @click="handleCloudLogin"
        >
          {{ authStore.isLoading ? 'Logowanie...' : 'Zaloguj' }}
        </button>
      </div>
    </div>

    <!-- Ostrzeżenie urzędowe -->
    <div class="system-warning warning-box">
      <strong>UWAGA!</strong> System zawiera dane objęte tajemnicą państwową i służbową. Nieuprawniony dostęp lub przeglądanie danych osób niezwiązanych ze sprawą jest rejestrowane w logach audytowych i podlega kontroli BSW oraz odpowiedzialności karnej na mocy art. 266 § 1 k.k.
    </div>

    <div class="copyright-info">
      © 1998–2002 Biuro Łączności i Informatyki KGP · KMP Czarnocin
    </div>

    <!-- Dolna belka systemowa -->
    <footer class="login-footer border-outset">
      <span>KMP Czarnocin · Wydział Łączności i Informatyki · stanowisko KC-07</span>
      <span style="margin-left: auto">Czwartek 08:00 · Połączenie: {{ authStore.authMode === 'supabase' ? 'CHMURA' : 'LOKALNE' }}</span>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '../../stores/authStore';
import { useSoundEffects } from '../../composables/useSoundEffects';

const emit = defineEmits<{
  (e: 'login-success'): void;
  (e: 'switch-screen', screen: 'register'): void;
}>();

const authStore = useAuthStore();
const { playSound } = useSoundEffects();

const email = ref('');
const password = ref('');
const errorMessage = ref<string | null>(null);

const handleCloudLogin = async () => {
  playSound('click');
  errorMessage.value = null;

  if (!email.value || !password.value) {
    errorMessage.value = 'Wpisz adres e-mail oraz hasło służbowe.';
    return;
  }

  const result = await authStore.loginWithSupabase(email.value, password.value);
  if (result.success) {
    emit('login-success');
  } else {
    playSound('floppy_seek');
    if (result.code === 'email_not_confirmed') {
      errorMessage.value = 'Konto nie zostało jeszcze aktywowane linkiem e-mail. Sprawdź skrzynkę lub skorzystaj z przycisku „Stanowisko KC-07 (Lokalnie)”.';
    } else if (result.code === 'invalid_credentials') {
      errorMessage.value = 'Niepoprawny e-mail lub hasło.';
    } else {
      errorMessage.value = result.error || 'Nie udało się połączyć z serwerem KSIP.';
    }
  }
};

const handleLocalLogin = () => {
  playSound('click');
  authStore.loginLocal();
  emit('login-success');
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

.ksip-top-header {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 84px;
  background-color: #0a246a;
  border-bottom: 3px solid #c8b560;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 0 40px;
  box-sizing: border-box;
  color: #ffffff;
}

.header-org-text {
  font-size: 11px;
  letter-spacing: 2px;
  color: #c8b560;
}

.header-title-text {
  font-size: 22px;
  font-weight: bold;
  margin-top: 2px;
}

.header-meta-text {
  margin-left: auto;
  font-size: 11px;
  text-align: right;
  line-height: 1.5;
  color: #ece9e0;
}

.login-dialog {
  position: absolute;
  left: 50%;
  top: 140px;
  transform: translateX(-50%);
  width: 480px;
  min-height: 400px;
}

.dialog-body {
  padding: 14px 20px;
  flex: 1;
}

.dialog-desc {
  margin: 0 0 12px;
  font-size: 11px;
  line-height: 1.4;
  color: #222222;
}

.error-banner {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  background-color: #fff4d1;
  border: 1px solid #d4a017;
  padding: 8px 10px;
  margin-bottom: 12px;
  font-size: 11px;
  color: #663300;
  line-height: 1.35;
}

.error-icon {
  font-size: 16px;
  flex-shrink: 0;
}

.error-text {
  flex: 1;
}

.readonly-field {
  background-color: #ece9e0;
  color: #444444;
}

.last-login-info {
  font-size: 10px;
  color: #555555;
  margin-top: 10px;
  border-top: 1px dashed #aaaaaa;
  padding-top: 6px;
}

.dialog-actions {
  display: flex;
  gap: 8px;
  padding: 10px 18px;
  justify-content: flex-end;
  border-top: 1px solid #808080;
  background-color: var(--win-gray);
}

.action-btn {
  min-width: 90px;
  font-size: 11px;
}

.btn-secondary {
  color: #003366;
}

.btn-primary {
  font-weight: bold;
}

.system-warning {
  position: absolute;
  left: 50%;
  top: 575px;
  transform: translateX(-50%);
  width: 480px;
}

.copyright-info {
  position: absolute;
  left: 40px;
  top: 720px;
  font-size: 11px;
  color: #9fb3b8;
}

.login-footer {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 30px;
  background-color: var(--win-gray);
  display: flex;
  align-items: center;
  padding: 0 10px;
  font-size: 11px;
}
</style>
