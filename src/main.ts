import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import router from './router'
import { createPinia } from 'pinia'
import 'element-plus/dist/index.css';
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
// import SvgIcon from 'vue3-svgicon';



const app = createApp(App)
// app.component('svg-icon', SvgIcon);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
// 创建Pinia实例
const pinia = createPinia()

app.use(ElementPlus)
app.use(router)
app.use(pinia) // 注册Pinia
app.mount('#app')
