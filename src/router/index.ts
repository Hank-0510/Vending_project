import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/Home/index.vue'
import LoginView from '../views/Login/index.vue'
import DeviceManager from "@/views/DeviceManager/DeviceManager.vue";
import OrderEmployer from "@/views/OrderManager/OrderEmployer.vue";
import OrderUser from "@/views/OrderManager/OrderUser.vue";
import contractSystem from "@/views/ContractSystem/ContractSystem.vue";

// 定义路由元数据类型
declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
    roles?: string[]
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        requiresAuth: true
      }
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
      meta: {
        requiresAuth: true,
        roles: ['super', 'admin']
      }
    },
    {
      path: '/orderEmployer',
      name: 'orderEmployer',
      component: OrderEmployer,
      meta: {
        requiresAuth: true,
        roles: ['super', 'admin', 'normal']
      }
    },
    {
      path: '/orderUser',
      name: 'orderUser',
      component: OrderUser,
      meta: {
        requiresAuth: true,
        roles: ['super', 'admin']
      }
    },
    {
      path: '/contract',
      name: 'contractSystem',
      component: contractSystem,
      meta: {
        requiresAuth: true,
        roles: ['super', 'admin']
      }
    },


    {
      path: '/usermanager',
      name: 'usermanager',
      component: () => import('@/views/UserManager/index.vue'),
      meta: {
        requiresAuth: true,
        roles: ['super']
      }
    },

    {
      path: '/chargemanager',
      name: 'chargemanager',
      component: () => import('@/views/ChargeManager/index.vue'),
      meta: {
        requiresAuth: true,
        roles: ['super', 'admin']
      }
    },
    {
      path: '/403',
      name: 'forbidden',
      component: () => import('@/views/Error/403.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/Error/404.vue')
    },
  ]

  
})

// 路由守卫
import { useUserStore } from '@/stores/user'

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  
  // 如果已登录且要访问登录页，则重定向到首页
  if (to.path === '/login' && userStore.isLoggedIn()) {
    next({ path: '/' })
    return
  }
  
  // 检查用户是否已登录，除了登录页面外，其他页面都需要登录
  if (to.path !== '/login' && !userStore.isLoggedIn()) {
    // 未登录则重定向到登录页面
    next({
      path: '/login',
      query: { redirect: to.fullPath } // 保存重定向地址
    })
    return
  }
  // 增强token检验
  const token = localStorage.getItem('token')
  if (to.meta.requiresAuth && !token) {
    return '/login'
  }



  // 如果路由需要特定角色权限，检查用户是否有权限访问
  if (to.meta.roles) {
    const userRole = userStore.getUserRole()
    const routeRoles = to.meta.roles as string[] | undefined
    
    if (routeRoles && !routeRoles.includes(userRole)) {
      // 无权限则重定向到403页面
      next({ name: 'forbidden' })
      return
    }
  }
  
  next()
})

export default router
