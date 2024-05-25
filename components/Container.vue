<template>
    <a-row type="flex" style="padding: 16px;">
        <a-col :span="12">
            <APIPlatform style="margin-right: 24px;" />
        </a-col>
        <a-col :span="12">
            <Selector style="margin-bottom: 16px;" />
            <Exporter />
        </a-col>
    </a-row>
    <FlattenParser />
</template>

<script lang="ts" setup>
import { CONTEXT_KEY, type ContextState } from './context';
import mock from './mock.json'

const state = reactive<ContextState>({
    response: mock,
    jsonataExpr: [],
    currentExpr: {}
})
provide<ContextState>(CONTEXT_KEY, state)
</script>