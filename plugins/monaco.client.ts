import { install as VueMonacoEditorPlugin } from "@guolao/vue-monaco-editor";

// TODO: Integrate https://github.com/remcohaszing/monaco-yaml

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VueMonacoEditorPlugin, {
    paths: {
      // The recommended CDN config
      vs: "https://cdn.jsdelivr.net/npm/monaco-editor@0.43.0/min/vs",
    },
  });
});
