<template>
  <a-row type="flex" style="padding: 16px;">
    <a-col :span="8">
      <APIPlatform style="margin-right: 24px;" />
    </a-col>
    <a-col :span="16">
      <Selector style="margin-bottom: 16px;" />
      <Exporter />
    </a-col>
  </a-row>
</template>

<script lang="ts" setup>
import { isEmpty } from 'radash';
import { CONTEXT_KEY, type ContextState } from './context';
import mock from './mock.json'


const state = reactive<ContextState>({
  response: mock,
  jsonataExpr: [],
  currentExpr: {}
})
provide<ContextState>(CONTEXT_KEY, state)

const { generateJsonataExpression } = useGenerateJsonataExpression()

watchEffect(() => {
  if (isEmpty(state.response)) {
    return;
  }

  state.jsonataExpr = generateJsonataExpression(state.response);
})
</script>