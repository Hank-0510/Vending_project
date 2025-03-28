<template>
  <el-menu
    :default-active="activeIndex"
    class="sidebar-menu"
    :collapse="isCollapse"
    :router="true"
    background-color="#f5f5f5"
    text-color="#333333"
    active-text-color="#59a5f5"
      >
    <div class="logo-container" @click="toggleCollapse">
      <h2 v-if="!isCollapse">自动售货系统</h2>
      <h2 v-else>展开</h2>
    </div>
    
    <!-- 已登录状态显示的菜单项 -->
    <template v-if="isLoggedIn">
      <el-menu-item index="/">
        <el-icon><el-icon-house /></el-icon>
        <template #title><h3>首页</h3></template>
      </el-menu-item>
      
      <el-menu-item v-if="visibleMenus.includes('/deviceMan')" index="/deviceMan">
        <el-icon><el-icon-box /></el-icon>
        <template #title><h3>设备管理</h3></template>
      </el-menu-item>

      <el-menu-item v-if="visibleMenus.includes('/productmanager')" index="/productmanager">
        <el-icon><el-icon-shopping-bag /></el-icon>
        <template #title><h3>商品管理</h3></template>
      </el-menu-item>
      
      <el-sub-menu index="orders" v-if="visibleMenus.includes('/orderEmployer') || visibleMenus.includes('/orderUser')">
        <template #title>
          <el-icon><el-icon-shopping-cart /></el-icon>
          <span><h3>订单管理</h3></span>
        </template>
        <el-menu-item v-if="visibleMenus.includes('/orderEmployer')" index="/orderEmployer">雇主订单</el-menu-item>
        <el-menu-item v-if="visibleMenus.includes('/orderUser')" index="/orderUser">用户订单</el-menu-item>
      </el-sub-menu>
      
      <el-menu-item v-if="visibleMenus.includes('/contract')" index="/contract">
        <el-icon><el-icon-document /></el-icon>
        <template #title><h3>合同系统</h3></template>
      </el-menu-item>
      
      <el-menu-item v-if="visibleMenus.includes('/usermanager')" index="/usermanager">
        <el-icon><el-icon-user /></el-icon>
        <template #title><h3>用户管理</h3></template>
      </el-menu-item>
      
      <el-menu-item v-if="visibleMenus.includes('/chargemanager')" index="/chargemanager">
        <el-icon><el-icon-money /></el-icon>
        <template #title><h3>充值管理</h3></template>
      </el-menu-item>

      <el-menu-item v-if="visibleMenus.includes('/usercockpit')" index="/usercockpit">
        <el-icon><el-icon-money /></el-icon>
        <template #title><h3>在线驾驶舱</h3></template>
      </el-menu-item>
      
      <!-- 登录后显示退出登录组件 -->
      <div class="logout-container">
        <Logout />
      </div>
    </template>
    
    <!-- 未登录状态只显示登录菜单 -->
    <template v-else>
      <el-menu-item index="/login" class="login-item">
        <el-icon><el-icon-key /></el-icon>
        <template #title>登录</template>
      </el-menu-item>
    </template>
  </el-menu>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import Logout from './Logout.vue'
import router from '@/router'

// 控制菜单是否折叠
const isCollapse = ref(false)

// 获取当前路由和用户状态
const route = useRoute()
const userStore = useUserStore()

// 计算当前活跃菜单项
const activeIndex = computed(() => {
  return route.path
})

// 计算用户是否已登录
const isLoggedIn = computed(() => {
  return userStore.isLoggedIn()
})

// 检查用户是否有特定权限
const hasPermission = (roles: string[]) => {
  console.log('Checking permission:', roles)
  const userRole = userStore.getUserRole()
  return roles.includes(userRole)
}

// 计算当前用户可见的菜单项
const visibleMenus = computed(() => {
  const userRole = userStore.getUserRole()
  const routes = router.getRoutes()
  const accessiblePaths: string[] = []
  
  // 遍历所有路由，检查用户是否有权限访问
  routes.forEach(route => {
    // 如果路由没有设置roles或者用户角色在允许的roles中，则添加到可见菜单
    if (!route.meta.roles || (route.meta.roles as string[])?.includes(userRole)) {
      accessiblePaths.push(route.path)
    }
  })
  
  console.log('Visible menus for role', userRole, ':', accessiblePaths)
  return accessiblePaths
})

// 切换折叠状态
const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value
}

// 当路由变化时保持激活状态
onMounted(() => {
  // 不再在这里初始化用户信息，避免清除登录状态
})

// 监听登录状态变化
watch(() => userStore.isLoggedIn(), (isLoggedIn) => {
  if (!isLoggedIn && route.path !== '/login') {
    // 如果用户登出且不在登录页，则重定向到登录页
    router.push('/login')
  }
})
</script>

<style scoped lang="scss">
.sidebar-menu {
  height: 100vh;
  border-right: solid 1px #e6e6e6;
  width: auto;
  
  &:not(.el-menu--collapse) {
    width: 200px;
  }
}

.logo-container {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #0077c2;
  padding: 0 15px;
  box-sizing: border-box;
  margin-bottom: 10px;

  h2 {
    margin: 10px;
    font-size: 22px;
  }
}

.login-item {
  position: absolute;
  bottom: 60px;
  width: 100%;
}

.logout-container {
  position: absolute;
  bottom: 60px;
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 10px 0;
  color: #fff;
}

.collapse-btn {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  cursor: pointer;
  background-color: #c8ffff;
  color: #fff;
  padding: 5px;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background-color: #c8ffff;
  }
}
</style>
