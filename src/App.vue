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
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Login from './views/Login/index.vue'
import Home from './views/Home/index.vue'
import Sidebar from './components/Sidebar.vue'

// 获取当前路由
const route = useRoute()

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
