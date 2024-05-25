<template>
    <h4>Response</h4>
    <vue-monaco-editor
        v-model:value="stringified"
        language="json"
        height="80vh"
        :options="{
          wordWrap: true,
          minimap: { enabled: false },
        }"
      />
</template>

<script lang="ts" setup>
import { CONTEXT_KEY, type ContextState } from '../context';
const context = inject<ContextState>(CONTEXT_KEY)!

const stringified = ref(JSON.stringify(context.response, null, 2))
watch(stringified, () => {
  context.response = JSON.parse(stringified.value)
})
</script>