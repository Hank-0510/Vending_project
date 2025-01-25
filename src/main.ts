import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import router from './router'
import 'element-plus/dist/index.css';
// import SvgIcon from 'vue3-svgicon';



const app = createApp(App)
// app.component('svg-icon', SvgIcon);
app.use(ElementPlus)
app.use(router)
app.mount('#app')
