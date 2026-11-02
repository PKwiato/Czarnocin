<template>
  <div class="screen-container">
    <header class="ksip-top-header">
      <div class="police-emblem">POLICJA</div>
      <div>
        <div class="header-org-text">KOMENDA GŁÓWNA POLICJI · KOMENDA MIEJSKA W CZARNOCINIE</div>
        <h1 class="header-title-text">Krajowy System Informacji Policji (KSIP)</h1>
      </div>
      <div class="header-meta-text">
        DO UŻYTKU SŁUŻBOWEGO<br />
        Formularz KSIP-R1
      </div>
    </header>

    <!-- Okno formularza rejestracji -->
    <div class="register-dialog window-frame border-outset">
      <div class="window-titlebar">
        <span>Wniosek o nadanie uprawnień użytkownika systemu KSIP</span>
        <div class="window-controls">
          <span class="win-btn-control">_</span>
          <span class="win-btn-control">✕</span>
        </div>
      </div>

      <div class="dialog-body">
        <p class="dialog-desc">
          Wypełnij dane funkcjonariusza, aby zarejestrować nowe konto w policyjnym rejestrze KSIP i utworzyć indywidualną teczkę śledczą.
        </p>

        <!-- Baner błędu -->
        <div v-if="errorMessage" class="notice-banner error-banner border-inset">
          <span class="banner-icon">⚠️</span>
          <div class="banner-text">
            <strong>Błąd rejestracji:</strong>
            <div>{{ errorMessage }}</div>
          </div>
        </div>

        <!-- Baner sukcesu z wymaganym potwierdzeniem -->
        <div v-if="confirmationRequired" class="notice-banner success-banner border-inset">
          <span class="banner-icon">ℹ️</span>
          <div class="banner-text">
            <strong>Wniosek został przyjęty przez centralę KGP!</strong>
            <div>Link aktywacyjny przesłano na podany adres e-mail.</div>
            <div style="margin-top: 6px;">
              Możesz kliknąć link w poczcie lub natychmiast rozpocząć czynności śledcze w trybie stanowiska lokalnego KC-07:
            </div>
            <div style="margin-top: 8px;">
              <button type="button" class="btn-retro btn-primary" @click="handleContinueLocally">
                Rozpocznij służbę na stanowisku KC-07
              </button>
            </div>
          </div>
        </div>

        <div class="form-row">
          <label>Imię i nazwisko:</label>
          <input
            v-model="fullName"
            type="text"
            class="input-retro"
            placeholder="np. St. post. Marek Adamski"
            :disabled="authStore.isLoading || confirmationRequired"
          />
        </div>

        <div class="form-row">
          <label>Numer legitymacji:</label>
          <input
            v-model="badgeNumber"
            type="text"
            class="input-retro"
            placeholder="np. CZ 20412/02"
            :disabled="authStore.isLoading || confirmationRequired"
          />
        </div>

        <div class="form-row">
          <label>Stopień służbowy:</label>
          <div class="input-retro readonly-field">Młodszy Aspirant (przydział początkowy)</div>
        </div>

        <div class="form-row">
          <label>Jednostka:</label>
          <div class="input-retro readonly-field">KMP Czarnocin, Wydział Dochodzeniowo-Śledczy</div>
        </div>

        <div class="form-row">
          <label>Przełożony:</label>
          <div class="input-retro readonly-field">z-ca Naczelnika Wydziału Kryminalnego</div>
        </div>

        <div class="form-row">
          <label>Adres e-mail:</label>
          <input
            v-model="email"
            type="email"
            class="input-retro"
            placeholder="np. adamski@policja.pl"
            :disabled="authStore.isLoading || confirmationRequired"
          />
        </div>

        <div class="form-row">
          <label>Hasło (min. 6 znaków):</label>
          <input
            v-model="password"
            type="password"
            class="input-retro"
            placeholder="wpisz hasło"
            :disabled="authStore.isLoading || confirmationRequired"
          />
        </div>

        <div class="form-row">
          <label>Powtórz hasło:</label>
          <input
            v-model="confirmPassword"
            type="password"
            class="input-retro"
            placeholder="powtórz hasło"
            :disabled="authStore.isLoading || confirmationRequired"
          />
        </div>

        <div class="declaration-box border-groove">
          <label class="declaration-label">
            <input type="checkbox" v-model="declarationAccepted" :disabled="confirmationRequired" />
            <span>
              Oświadczam, że znam przepisy o ochronie informacji niejawnych i zobowiązuję się do zachowania tajemnicy służbowej. Przyjmuję do wiadomości, że korzystanie z bazy KSIP jest rejestrowane i kontrolowane przez Biuro Spraw Wewnętrznych KGP.
            </span>
          </label>
        </div>
      </div>

      <div class="dialog-actions">
        <button
          type="button"
          class="btn-retro"
          :disabled="authStore.isLoading"
          @click="$emit('switch-screen', 'login')"
        >
          {{ confirmationRequired ? 'Przejdź do logowania' : 'Anuluj' }}
        </button>

        <button
          v-if="!confirmationRequired"
          type="button"
          class="btn-retro btn-primary"
          :disabled="!declarationAccepted || authStore.isLoading"
          @click="handleRegister"
        >
          {{ authStore.isLoading ? 'Rejestrowanie wniosku...' : 'Utwórz konto i rozpocznij służbę' }}
        </button>
      </div>
    </div>

    <!-- Podgląd legitymacji służbowej po prawej -->
    <div class="badge-preview-card border-outset">
      <div class="badge-card-header">
        <span>POLICJA</span>
        <span>LEGITYMACJA SŁUŻBOWA</span>
      </div>
      <div class="badge-card-body">
        <div class="badge-photo-placeholder border-inset">
          zdjęcie<br />3,5 × 4,5 cm
        </div>
        <div class="badge-details">
          <strong>{{ fullName.trim() || 'St. post. Marek Adamski' }}</strong><br />
          Młodszy Aspirant<br />
          KMP Czarnocin<br />
          Nr {{ badgeNumber.trim() || 'CZ 20412/02' }}<br />
          Ważna do: 31.12.2004
        </div>
      </div>
    </div>

    <!-- Dolna belka -->
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
  (e: 'register-success'): void;
  (e: 'switch-screen', screen: 'login'): void;
}>();

const authStore = useAuthStore();
const { playSound } = useSoundEffects();

const fullName = ref('St. post. Marek Adamski');
const badgeNumber = ref('CZ 20412/02');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const declarationAccepted = ref(true);

const errorMessage = ref<string | null>(null);
const confirmationRequired = ref(false);

const handleRegister = async () => {
  playSound('click');
  errorMessage.value = null;

  if (!email.value.trim() || !password.value) {
    errorMessage.value = 'Wypełnij adres e-mail i hasło dostępowe.';
    return;
  }

  if (password.value.length < 6) {
    errorMessage.value = 'Hasło musi zawierać co najmniej 6 znaków.';
    return;
  }

  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Podane hasła nie są identyczne.';
    return;
  }

  if (!declarationAccepted.value) {
    errorMessage.value = 'Musisz zatwierdzić oświadczenie o zachowaniu tajemnicy służbowej.';
    return;
  }

  const result = await authStore.registerWithSupabase(
    email.value,
    password.value,
    fullName.value.trim() || 'St. post. Marek Adamski',
    badgeNumber.value.trim() || 'CZ 20412/02'
  );

  if (result.success) {
    if (result.needsConfirmation) {
      playSound('printer');
      confirmationRequired.value = true;
    } else {
      playSound('printer');
      emit('register-success');
    }
  } else {
    playSound('floppy_seek');
    if (result.code === 'user_already_exists') {
      errorMessage.value = 'Funkcjonariusz o tym adresie e-mail jest już zarejestrowany w systemie KSIP.';
    } else {
      errorMessage.value = result.error || 'Nie udało się zarejestrować wniosku w bazie.';
    }
  }
};

const handleContinueLocally = () => {
  playSound('click');
  authStore.loginLocal(badgeNumber.value.trim() || 'CZ 20412/02', fullName.value.trim() || 'St. post. Marek Adamski');
  emit('register-success');
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

.register-dialog {
  position: absolute;
  left: 50px;
  top: 96px;
  width: 740px;
  max-height: 660px;
  display: flex;
  flex-direction: column;
}

.dialog-body {
  padding: 12px 18px;
  overflow-y: auto;
  flex: 1;
}

.dialog-desc {
  margin: 0 0 10px;
  font-size: 11px;
  color: #222222;
}

.notice-banner {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 8px 10px;
  margin-bottom: 10px;
  font-size: 11px;
  line-height: 1.4;
}

.error-banner {
  background-color: #fff4d1;
  border: 1px solid #d4a017;
  color: #663300;
}

.success-banner {
  background-color: #e6f4ea;
  border: 1px solid #34a853;
  color: #0d652d;
}

.banner-icon {
  font-size: 16px;
  flex-shrink: 0;
}

.banner-text {
  flex: 1;
}

.readonly-field {
  background-color: #ece9e0;
  color: #444444;
}

.declaration-box {
  background-color: #f3f1e8;
  padding: 8px 10px;
  margin-top: 8px;
  font-size: 11px;
  line-height: 1.4;
}

.declaration-label {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  cursor: pointer;
}

.dialog-actions {
  display: flex;
  gap: 8px;
  padding: 10px 18px;
  justify-content: flex-end;
  border-top: 1px solid #808080;
  background-color: var(--win-gray);
}

.btn-primary {
  font-weight: bold;
}

.badge-preview-card {
  position: absolute;
  left: 810px;
  top: 120px;
  width: 400px;
  background-color: #f3f1e8;
  padding: 14px 16px;
  box-sizing: border-box;
}

.badge-card-header {
  display: flex;
  justify-content: space-between;
  font-weight: bold;
  font-size: 12px;
  letter-spacing: 1px;
  border-bottom: 2px solid #0a246a;
  padding-bottom: 4px;
}

.badge-card-body {
  display: flex;
  gap: 16px;
  margin-top: 14px;
}

.badge-photo-placeholder {
  width: 96px;
  height: 120px;
  background-color: #cccccc;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  text-align: center;
  color: #444444;
}

.badge-details {
  font-size: 12px;
  line-height: 1.6;
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
