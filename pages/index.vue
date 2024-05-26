<template>
  <!-- tim.nguyen 2024/05/27 - Must wrap in ClientOnly for plugin that are client only -->
  <ClientOnly>
    <Container />
  </ClientOnly>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false
})
</script>