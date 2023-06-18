import 'ant-design-vue/dist/antd.min.css';
import Antd from 'ant-design-vue';

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(Antd)
})