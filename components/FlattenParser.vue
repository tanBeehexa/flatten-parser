<template>
    <!-- TODO: Refactor to composables -->
</template>

<script lang="ts" setup>
import { CONTEXT_KEY, ContextState } from './context';
const context = inject<ContextState>(CONTEXT_KEY)!

const regexMatchJsonata = /^(\$)(?:\.(.*))?{([^{}]+)}\[\]$/

/**
 * BUG (1): When value is array type --> The algorithm will pushing all the array elements to --> Duplicate field
 */
function generateJsonataLogic(obj, prefix = '$') {
    const stack = [{ obj, prefix }]
    const result = []

    while (stack.length > 0) {
        const { obj, prefix } = stack.pop()

        Object.entries(obj).forEach(([key, value]) => {
            // FIX - BUG (1): Detect array element --> Not assign newPrefix
            let newPrefix = ''
            if (key.match(/^[0-9]*$/)) {
                newPrefix = `${prefix}`
            } else {
                newPrefix = `${prefix}.${key}`
            }

            if (value && typeof value === 'object') {
                stack.push({ obj: value, prefix: newPrefix })
            } else {
                const snakeCaseKey = key
                    .replace(/\W+/g, " ")
                    .split(/ |\B(?=[A-Z])/)
                    .map(word => word.toLowerCase())
                    .join('_');
                result.push(`${prefix}.{ "${snakeCaseKey}": ${key} }[]`)
            }
        })
    }

    // FIX - BUG (1): Remove duplicate elements
    const deduplicate = [...new Set(result)]
    return deduplicate
}

function joinElements(arr) {
    const joined = {}
    for (const item of arr) {
        const [_, $, path, filterKey] = item.match(regexMatchJsonata)
        // console.log(_, path)
        const _path = `${$}.${path}`
        if (!joined[_path]) {
            joined[_path] = [filterKey]
        } else {
            joined[_path].push(filterKey)
        }
    }
    return Object.entries(joined).map(([key, items]) => `${key}{${items.join(', ')
        }}[]`)
}

watch(() => context.response, () => {
    if (!context.response) { return }

    context.jsonataExpr = joinElements(generateJsonataLogic(context.response))
}, {
    immediate: true,
    deep: true
})
</script>