<template>
    <h3>Output</h3>
    <a-radio-group v-model:value="type" :options="options" />
    <vue-monaco-editor :value="yamlContent" language="yaml" height="60vh" :options="{
        wordWrap: true,
        minimap: { enabled: false },
    }" />
</template>

<script lang="ts" setup>
import yaml from 'yaml'
import { CONTEXT_KEY, type ContextState } from './context';
import { isEmpty } from 'radash';
const context = inject<ContextState>(CONTEXT_KEY)!

enum Type {
    Puller,
    Object
}

const options = [
    { label: 'Puller', value: Type.Puller },
    { label: 'Object', value: Type.Object },
];
const type = ref(0)

const getPullerContent = () => {
    const jsonataList: { [k: string]: string, value: string } = {}
    const { key, mappingKeys } = context.selectedExpression
    if (mappingKeys.length === 0) { return {} }

    const keyName = key ? key.split('.').at(-2) : ''
    jsonataList[keyName] = `$.${key}{ ${mappingKeys} }`

    console.log(jsonataList)

    const content = {}
    for (const [k, v] of Object.entries(jsonataList)) {
        content[k] = {
            acceptedStatus: ['success'],
            expression: `
${v}[]
`
        }
    }
    return content
}

const getObjectContent = () => {
    const content = { resultKey: "", mappings: {} }
    const { key, mappingKeys } = context.selectedExpression
    content.resultKey = key ? key.split('.').at(-2) : 'undefined'

    mappingKeys.forEach(key => {
        const mappingKey = key.split(':').at(0).replace(/['"]+/g, '').trim()

        content.mappings[mappingKey] = {
            constraints: ['NONE'],
        }
    })

    return content
}

const jsonContent = computed(() => {
    if (isEmpty(context.selectedExpression)) { return {} }

    switch (type.value) {
        case Type.Puller:
            return getPullerContent()
        case Type.Object:
            return getObjectContent()
    }
})

const yamlContent = computed(() => yaml.stringify(jsonContent.value))
</script>