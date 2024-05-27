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
  PullerJsonata,
  TableColumns,
  ObjectMappings
}

const options = [
  { label: 'Puller Jsonata', value: Type.PullerJsonata },
  { label: 'Table Columns', value: Type.TableColumns },
  { label: 'Object Mappings (Deprecated)', value: Type.ObjectMappings },
];
const type = ref(0)

function getPathDisplayName(path: string) {
  return path ? path.split('.').at(-2) : ROOT_PATH_DISPLAY_NAME
}

const getPullerJsonataContent = () => {
  const { key, mappingKeys } = context.selectedExpression
  if (mappingKeys.length === 0) { return {} }

  // tim.nguyen 2024/05/27: mappingKeys.map((val, index) --> Fix displaying mapingKeys not indent by using `\t\n`
  return {
    [`${getPathDisplayName(key)}`]: {
      acceptedStatus: ['success'],
      expression: `$.${key}{
  ${mappingKeys.map((val, index) => index > 0 ? `\t${val}` : val).join(",\n")} 
}[]
`
    }
  }
}

const getTableColumnsContent = () => {
  const { mappingKeys } = context.selectedExpression
  const columns: { [key: string]: object } = {}

  mappingKeys.forEach(key => {
    const mappingKeyName = (key as string).split(':').at(0)?.replace(/['"]+/g, '')

    columns[`${mappingKeyName}`] = {
      name: mappingKeyName
    }
  })

  return {
    columns
  }
}

const getObjectMappingsContent = () => {
  const { key, mappingKeys } = context.selectedExpression
  const mappings: { [key: string]: object } = {}

  mappingKeys.forEach(key => {
    const mappingKeyName = (key as string).split(':').at(0)?.replace(/['"]+/g, '')

    mappings[`${mappingKeyName}`] = {}
  })

  return {
    resultKeys: getPathDisplayName(key),
    mappings
  }
}

const jsonContent = computed(() => {
  if (isEmpty(context.selectedExpression)) { return {} }

  switch (type.value) {
    case Type.PullerJsonata:
      return getPullerJsonataContent()
    case Type.TableColumns:
      return getTableColumnsContent()
    case Type.ObjectMappings:
      return getObjectMappingsContent()
  }
})

const yamlContent = computed(() => yaml.stringify(jsonContent.value))
</script>