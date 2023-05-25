<template>
  <div>
    <h3>Select Fields</h3>
    <a-tabs @change="handleChangeTab">
      <template #rightExtra>
        <a-button type="link" @click="handleUncheckAll">
          Uncheck All
        </a-button>
      </template>

      <template v-for="(data) in exprList" :key="data.id">
          <a-tab-pane :tab="data.key || 'undefined'">
            <div style="overflow-y: scroll; height: 150px;">
              <a-checkbox-group
                v-model:value="currentSelectKey"
                :options="data.fieldOpts"
              />
            </div>
          </a-tab-pane>
      </template>
    </a-tabs>
  </div>
</template>

<script lang="ts" setup>
import { v4 } from 'uuid'
import { CONTEXT_KEY, ContextState } from './context';

type FieldOpts = Array<{value: string, label: string}>

const context = inject<ContextState>(CONTEXT_KEY)!

const regex = /^(\$)(?:\.(.*))?{([^{}]+)}\[\]$/

const currentSelectKey = ref<string[]>([])
const exprList = ref([])

function getKeyAndFields (expr: string) {
  const [_, _$, key, fieldString] = expr.match(regex)

  const fieldOpts: FieldOpts = fieldString
    .split(',')
    .map((field) => {
      const res = field.split(':')

      return { value: field, label: res[1] }
    })

  return { key, fieldOpts }
}

function getCheckboxAll(fieldOpts: FieldOpts) {
  return fieldOpts.map(opt => opt.value )
}

watch(() => context.jsonataExpr, () => {
  const res = context.jsonataExpr.map(el => {
      const data = getKeyAndFields(el)

      return {
          id: v4(),
          ...data
      }
  })
  if (res?.length > 0) {
    exprList.value = res
    handleChangeTab(exprList.value[0].id)
  }
}, {
  deep: true,
  immediate: true
})

function handleChangeTab(activeKey: string) {
  const expr = exprList.value.find((data) => data.id === activeKey)
  currentSelectKey.value = getCheckboxAll(expr.fieldOpts)
  context.currentExpr = {
    key: expr.key,
    mappingKeys: currentSelectKey.value
  }
}

watch(currentSelectKey, () => {
  context.currentExpr.mappingKeys = currentSelectKey.value
})

function handleUncheckAll() {
  currentSelectKey.value = []
}
</script>