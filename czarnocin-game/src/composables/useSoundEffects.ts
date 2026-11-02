import { ref } from 'vue';

export type SoundEffectType =
  | 'click'
  | 'floppy_seek'
  | 'floppy_read'
  | 'printer'
  | 'mail'
  | 'fax'
  | 'stamp';

const soundFiles: Record<SoundEffectType, string> = {
  click: './assets/audio/mouse_click.wav',
  floppy_seek: './assets/audio/floppy_seek.wav',
  floppy_read: './assets/audio/floppy_read.wav',
  printer: './assets/audio/dot_matrix_printer.wav',
  mail: './assets/audio/mail_alert.wav',
  fax: './assets/audio/fax_handshake.wav',
  stamp: './assets/audio/court_stamp.wav',
};

const isMuted = ref(false);
const volume = ref(0.6);

export function useSoundEffects() {
  const playSound = (sound: SoundEffectType) => {
    if (isMuted.value) return;

    try {
      const audio = new Audio(soundFiles[sound]);
      audio.volume = volume.value;
      audio.play().catch(() => {
        // Ignoruj blokady autoplay przeglądarki
      });
    } catch {
      // Ignoruj błędy odtwarzania
    }
  };

  const toggleMute = () => {
    isMuted.value = !isMuted.value;
  };

  return {
    isMuted,
    volume,
    playSound,
    toggleMute,
  };
}
