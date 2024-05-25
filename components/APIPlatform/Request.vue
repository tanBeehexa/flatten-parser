<template>
    <h4>Request</h4>
    <a-row type="flex" :gutter="[8]">
        <a-col :span="4">
            <a-select style="width: 100%" v-model:value="method">
                <a-select-option value="GET">
                    GET
                </a-select-option>
                <a-select-option value="POST">
                    POST
                </a-select-option>
                <a-select-option value="PUT">
                    PUT
                </a-select-option>
            </a-select>
        </a-col>
        <a-col :span="17">
            <a-input v-model:value="url" />
        </a-col>
        <a-col :span="1">
            <a-button type="primary" @click="handleSend">
                Send
            </a-button>
        </a-col>
    </a-row>

    <a-tabs default-active-key="params" :animated="false">
        <a-tab-pane key="params" tab="Params">
            <CommonKeyValueForm v-model="params" />
        </a-tab-pane>
        <a-tab-pane key="headers" tab="Headers">
            <CommonKeyValueForm v-model="headers" />
        </a-tab-pane>
        <a-tab-pane key="body" tab="Body">
            <a-radio-group v-model:value="language">
                <a-radio value="json">
                    JSON
                </a-radio>
                <!-- <a-radio disabled value="xml">
                    XML
                </a-radio> -->
            </a-radio-group>
        <vue-monaco-editor
            v-model:value="body"
            height="200px"
            :language="language"
            :options="{
            wordWrap: true
            }"
        />
        </a-tab-pane>
    </a-tabs>
</template>

<script lang="ts" setup>
import { KeyValueDataSource } from '../common/KeyValueForm.vue';
import { CONTEXT_KEY, type ContextState } from '../context';
const context = inject<ContextState>(CONTEXT_KEY)!

const method = ref("GET")
const url = ref("")
const params = ref<KeyValueDataSource[]>([])
const headers = ref<KeyValueDataSource[]>([])
const language = ref("json")
const body = ref("{}")

function getArrayFromKeyValue(value: Array<any>) {
    return value.reduce((acc, { key, value }) => {
      acc[key] = value
      return acc
    }, {})
}

async function handleSend () {
    console.log('CHAY', getArrayFromKeyValue(params.value), getArrayFromKeyValue(headers.value))
    const { data } = await useFetch(url.value, {
        method: method.value,
        params: getArrayFromKeyValue(params.value),
        headers: getArrayFromKeyValue(headers.value),
        data: body.value
    })
    if (data.value) { context.response = data.value }
  }
</script>