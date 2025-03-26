<template>
  <div class="app-container">
    <!-- 根据路由判断是否显示侧边栏，登录页面不显示侧边栏 -->
    <Sidebar v-if="!isLoginPage" class="sidebar" />
    <div class="main-content" :class="{ 'full-width': isLoginPage }">
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from './stores/user'  
import Login from './views/Login/index.vue'
import Home from './views/Home/index.vue'
import Sidebar from './components/Sidebar.vue'

// 获取当前路由和用户存储
const route = useRoute()
const userStore = useUserStore()

// 在应用挂载时初始化用户状态
onMounted(() => {
  // 检查localStorage中是否有token
  const token = localStorage.getItem('token')
  if (token && !userStore.token) {
    try {
      // 尝试从localStorage恢复用户信息
      const storedUserInfo = localStorage.getItem('userInfo')
      if (storedUserInfo) {
        const userInfo = JSON.parse(storedUserInfo)
        userStore.setUserInfo(userInfo)
        console.log('[App] 从本地存储恢复了用户登录状态')
      } else {
        // 如果只有token没有用户信息，至少更新token
        userStore.updateToken(token)
        console.log('[App] 从本地存储恢复了token')
      }
    } catch (error) {
      console.error('[App] 恢复用户状态失败:', error)
    }
  }
})

// 判断当前是否为登录页面
const isLoginPage = computed(() => {
  return route.path === '/login'
})
</script>

<style lang="scss">
body {
  margin: 0;
  padding: 0;
}

.app-container {
  display: flex;
  height: 100vh;
  width: 100%;
}

.sidebar {
  flex-shrink: 0;
}

.main-content {
  flex-grow: 1;
  overflow: auto;
}

.full-width {
  width: 100%;
}
</style>
