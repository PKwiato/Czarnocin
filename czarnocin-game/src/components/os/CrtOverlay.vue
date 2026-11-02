<template>
  <div v-if="enabled" class="crt-overlay" aria-hidden="true"></div>
</template>

<script setup lang="ts">
defineProps<{
  enabled: boolean;
}>();
</script>
