<template>
  <el-menu
    :default-active="activeIndex"
    class="sidebar-menu"
    :collapse="isCollapse"
    :router="true"
    background-color="#fff"
    text-color="#4b4f5d"
    active-text-color="#bb2649"
    
      >
    <div class="logo-container" @click="toggleCollapse">
      <h2 v-if="!isCollapse"> --------点击缩小导航栏----------</h2>
      <h2 v-else> -----展开-----</h2>
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
  
    </template>
  </el-menu>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
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


</script>

<style scoped lang="scss">
.sidebar-menu {
  border-right: solid 1px #cccccc;
  width: auto;
  background-color: #fff;
  position: sticky;
  top: 80px; // header高度
  height: calc(100vh - 80px); // 自动计算剩余高度

  &:not(.el-menu--collapse) {
    width: 200px;
  }
}

.logo-container {
  h2 {
    margin: 10px;
    font-size: 12px;
    color: #cccccc;
  }
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
  

}
</style>
