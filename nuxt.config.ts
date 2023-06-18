import Components from 'unplugin-vue-components/vite';
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    // tim.nguyen 2023/05/25 - Cause cannot pnpm run build: Could not load raw:../../style/default.css ant-design-vue
    // css: ['ant-design-vue/dist/antd.min.css'],
    // vite: {
    //     plugins: [
    //         Components({
    //             resolvers: [AntDesignVueResolver()],
    //         }),
    //     ],
    // }
})
