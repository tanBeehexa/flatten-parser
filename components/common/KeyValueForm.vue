<template>
    <a-table :columns="columns" :data-source="dataSource" bordered :pagination="false" size="middle" row-key="id"
        @input="handleAddNewCol">
        <template #bodyCell="{ text, record, index, column }">
            <!-- {{ column }} - {{ dataSource[index][column.dataIndex] }} - {{ column.dataIndex }} -->

            <a-input v-model:value="dataSource[index][column.dataIndex]" @input="handleAddNewCol(index)" @mouseover="handleHoverInput(true)"
                @mouseleave="handleHoverInput(false)">
                <template #suffix>
                    <DeleteOutlined v-show="getDeleteVisible(column.dataIndex)" @click="handleDelete" />
                </template>
            </a-input>
        </template>
    </a-table>
</template>

<script lang="ts">
import { v4 } from 'uuid'
export class KeyValueDataSource {
    id = v4()

    constructor(
        public key = '',
        public value = ''
    ) { }
}
</script>

<script lang="ts" setup>
import { DeleteOutlined } from '@ant-design/icons-vue';

const props = defineProps({
    modelValue: { type: Array<KeyValueDataSource>, required: true, default: () => [] },
})
const emit = defineEmits(["update:modelValue"])

const dataSource = ref<Array<KeyValueDataSource>>([])

watch(dataSource, () => {
    emit("update:modelValue", dataSource.value)
}, {
    deep: true,
    immediate: true
})

const getDeleteVisible = (dataIndex: string) => dataIndex === 'value' && dataSource.value.length > 1

const columns = [
    {
        title: 'Key',
        dataIndex: 'key',
        scopedSlots: { customRender: 'key' } // provide extra info for render
    },
    {
        title: 'Value',
        dataIndex: 'value',
        scopedSlots: { customRender: 'value' }
    }
]

const columnIndex = computed(() => columns.map(el => el.dataIndex))

const visible = reactive({
    removeIcon: false
})

function handleAddNewCol(idx: number) {
    if (idx === dataSource.value.length - 1) {
        dataSource.value.push(new KeyValueDataSource())
    }
}

function handleHoverInput(mouseOver: boolean) {
    if (mouseOver) {
        visible.removeIcon = true
    } else {
        visible.removeIcon = false
    }
}

onBeforeMount(() => {
    if (props.modelValue.length === 0) {
        dataSource.value.push(new KeyValueDataSource())
    } else {
        dataSource.value = props.modelValue
    }
})

function handleDelete() {
    dataSource.value.pop()
}
</script>


