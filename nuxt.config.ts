import Components from 'unplugin-vue-components/vite';
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    css: ['ant-design-vue/dist/antd.css'],
    vite: {
        plugins: [
            Components({
                resolvers: [AntDesignVueResolver()],
            }),
        ],
    }
})
