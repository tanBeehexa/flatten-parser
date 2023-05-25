<template>
    <a-layout>
        <a-layout-sider collapsible>
            <a-menu theme="dark" mode="inline">
                <a-menu-item key="1">
                    <pie-chart-outlined />
                    <span>Profiles</span>
                </a-menu-item>
                <a-sub-menu key="sub1">
                    <template #title>
                        <span>
                            <user-outlined />
                            <span>User</span>
                        </span>
                    </template>
                    <a-menu-item key="3">Tom</a-menu-item>
                    <a-menu-item key="4">Bill</a-menu-item>
                    <a-menu-item key="5">Alex</a-menu-item>
                </a-sub-menu>
            </a-menu>
        </a-layout-sider>
        <a-layout>
            <a-layout-header style="background: #fff;">
                Header
            </a-layout-header>
            <a-layout-content style="margin: 16px">
                <slot />
            </a-layout-content>
            <a-layout-footer style="text-align: center">
                Footer
            </a-layout-footer>
        </a-layout>
    </a-layout>
</template>

<script lang="ts">

</script>