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
          Wpisz adres e-mail i hasło. Pozostałe dane uzupełniono automatycznie dla tego stanowiska (szare pola).
        </p>

        <div class="form-row">
          <label>Numer służbowy:</label>
          <div class="input-retro readonly-field">{{ authStore.badgeNumber }}</div>
        </div>

        <div class="form-row">
          <label>Jednostka:</label>
          <div class="input-retro readonly-field">KMP Czarnocin, Wydz. Kryminalny</div>
        </div>

        <div class="form-row">
          <label>Adres e-mail:</label>
          <input
            v-model="email"
            type="email"
            class="input-retro"
            placeholder="np. adamski@policja.gov.pl"
            @keydown.enter="handleLogin"
          />
        </div>

        <div class="form-row">
          <label>Hasło:</label>
          <input
            v-model="password"
            type="password"
            class="input-retro"
            placeholder="wpisz hasło"
            @keydown.enter="handleLogin"
          />
        </div>

        <div class="last-login-info">
          Ostatnie udane logowanie: czwartek 07:45, stanowisko KC-07
        </div>
      </div>

      <div class="dialog-actions">
        <button
          type="button"
          class="btn-retro action-btn btn-primary"
          @click="handleLogin"
        >
          Zaloguj
        </button>
        <button
          type="button"
          class="btn-retro action-btn"
          @click="$emit('switch-screen', 'register')"
        >
          Nowe konto...
        </button>
      </div>
    </div>

    <!-- Ostrzeżenie urzędowe -->
    <div class="system-warning warning-box">
      <strong>UWAGA!</strong> System zawiera dane objęte tajemnicą służbową. Nieuprawniony dostęp lub przeglądanie danych osób niezwiązanych ze sprawą jest rejestrowane i podlega kontroli BSW oraz odpowiedzialności karnej.
    </div>

    <div class="copyright-info">
      © 1998–2002 Biuro Informatyki KGP
    </div>

    <!-- Dolna belka systemowa -->
    <footer class="login-footer border-outset">
      <span>KMP Czarnocin · Wydział Łączności i Informatyki · stanowisko KC-07</span>
      <span style="margin-left: auto">Czwartek 08:00</span>
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

const email = ref('adamski@policja.gov.pl');
const password = ref('********');

const handleLogin = () => {
  playSound('click');
  authStore.login();
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
  left: 420px;
  top: 170px;
  width: 440px;
  height: 380px;
}

.dialog-body {
  padding: 16px 22px;
  flex: 1;
}

.dialog-desc {
  margin: 0 0 14px;
  font-size: 11px;
  line-height: 1.5;
  color: #333333;
}

.readonly-field {
  background-color: #ece9e0;
  color: #444444;
}

.last-login-info {
  font-size: 11px;
  color: #555555;
  margin-top: 12px;
}

.dialog-actions {
  display: flex;
  gap: 8px;
  padding: 10px 22px;
  justify-content: flex-end;
  border-top: 1px solid #808080;
  background-color: var(--win-gray);
}

.action-btn {
  min-width: 90px;
}

.btn-primary {
  font-weight: bold;
}

.system-warning {
  position: absolute;
  left: 420px;
  top: 575px;
  width: 440px;
}

.copyright-info {
  position: absolute;
  left: 40px;
  top: 690px;
  font-size: 12px;
  color: #9fb3b8;
}

.login-footer {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 34px;
  background-color: var(--win-gray);
  display: flex;
  align-items: center;
  padding: 0 10px;
  font-size: 11px;
}
</style>
