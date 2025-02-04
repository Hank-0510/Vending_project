import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/Home/index.vue'
import LoginView from '../views/Login/index.vue'
import DeviceManager from "@/views/DeviceManager/DeviceManager.vue";
import OrderEmployer from "@/views/OrderManager/orderEmployer.vue";
import OrderUser from "@/views/OrderManager/orderUser.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/deviceMan',
      name: 'deviceMan',
      component: DeviceManager,
    },
    {
      path: '/orderEmployer',
      name: 'orderEmployer',
      component: OrderEmployer,
    },
    {
      path: '/orderUser',
      name: 'orderUser',
      component: OrderUser,
    },
  ]

  
})

export default router
