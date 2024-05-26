<template>
  <div>
    <h3>Select Fields</h3>
    <a-tabs @change="handleChangeTab">
      <template #rightExtra>
        <a-button type="link" @click="handleUncheckAll">
          Uncheck All
        </a-button>
      </template>

      <template v-for="(data) in jsonataPathAndPathKeysList" :key="data.id">
        <a-tab-pane :tab="data.path || 'root'">
          <div style="overflow-y: scroll; height: 150px;">
            <a-checkbox-group v-model:value="currentSelectKey" :options="data.pathKeys" />
          </div>
        </a-tab-pane>
      </template>
    </a-tabs>
  </div>
</template>

<script lang="ts" setup>
import { v4 } from 'uuid'
import { CONTEXT_KEY, type ContextState } from './context';
import { type CheckboxOptionType } from 'ant-design-vue'

type JsonataPathAndPathKeys = {
  id: string
  path: string
  pathKeys: Array<CheckboxOptionType>
}

const context = inject<ContextState>(CONTEXT_KEY)!

const currentSelectKey = ref<Array<CheckboxOptionType["value"]>>([])
const jsonataPathAndPathKeysList = ref<Array<JsonataPathAndPathKeys>>([])

function parseJsonataExpressionToGetPathAndPathKeys(expr: string) {
  const [_, _prefix, path, pathKeysStringify] = expr.match(JSONATA_SINGLE_KEY_EXPRESSION_REGEX)

  const pathKeys: Array<CheckboxOptionType> = (pathKeysStringify as string)
    .split(',')
    .map((pathKey) => {
      const res = pathKey.split(':')

      return { value: pathKey, label: res[1] }
    })

  return { path, pathKeys }
}

function getCheckboxAll(pathKeys: Array<CheckboxOptionType>) {
  return pathKeys.map(opt => opt.value)
}

function handleChangeTab(activeKey: string) {
  const pathAndPathKeys = jsonataPathAndPathKeysList.value.find((data) => data.id === activeKey)
  if (!pathAndPathKeys) { return }

  currentSelectKey.value = getCheckboxAll(pathAndPathKeys.pathKeys)
  context.selectedExpression = {
    key: pathAndPathKeys.path,
    mappingKeys: currentSelectKey.value
  }
}

watch(() => context.jsonataExpressions, () => {
  const pathAndPathKeys = context.jsonataExpressions.map(expression => {
    const parsed = parseJsonataExpressionToGetPathAndPathKeys(expression)

    return {
      id: v4(),
      ...parsed
    } as JsonataPathAndPathKeys
  })

  if (pathAndPathKeys?.length > 0) {
    jsonataPathAndPathKeysList.value = pathAndPathKeys
    handleChangeTab(jsonataPathAndPathKeysList.value[0].id)
  }
}, {
  deep: true,
  immediate: true
})

watch(currentSelectKey, () => {
  context.selectedExpression.mappingKeys = currentSelectKey.value
})

function handleUncheckAll() {
  currentSelectKey.value = []
}
</script>