<template>
  <el-menu
    :default-active="activeIndex"
    class="sidebar-menu"
    :collapse="isCollapse"
    :router="true"
    background-color="#545c64"
    text-color="#fff"
    active-text-color="#ffd04b"
  >
    <div class="logo-container">
      <h3 v-if="!isCollapse">自动售货系统</h3>
      <h3 v-else>系统</h3>
    </div>
    
    <!-- 已登录状态显示的菜单项 -->
    <template v-if="isLoggedIn">
      <el-menu-item index="/">
        <el-icon><el-icon-house /></el-icon>
        <template #title>首页</template>
      </el-menu-item>
      
      <el-menu-item index="/deviceMan" v-if="hasPermission(['super', 'admin'])">
        <el-icon><el-icon-box /></el-icon>
        <template #title>设备管理</template>
      </el-menu-item>
      
      <el-sub-menu index="orders" v-if="hasPermission(['super', 'admin', 'normal'])">
        <template #title>
          <el-icon><el-icon-shopping-cart /></el-icon>
          <span>订单管理</span>
        </template>
        <el-menu-item index="/orderEmployer">雇主订单</el-menu-item>
        <el-menu-item index="/orderUser" v-if="hasPermission(['super', 'admin'])">用户订单</el-menu-item>
      </el-sub-menu>
      
      <el-menu-item index="/contract" v-if="hasPermission(['super', 'admin'])">
        <el-icon><el-icon-document /></el-icon>
        <template #title>合同系统</template>
      </el-menu-item>
      
      <el-menu-item index="/usermanager" v-if="hasPermission(['super'])">
        <el-icon><el-icon-user /></el-icon>
        <template #title>用户管理</template>
      </el-menu-item>
      
      <el-menu-item index="/chargemanager" v-if="hasPermission(['super', 'admin'])">
        <el-icon><el-icon-money /></el-icon>
        <template #title>充值管理</template>
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
    
    <div class="collapse-btn" @click="toggleCollapse">
      <el-icon v-if="isCollapse"><el-icon-arrow-right /></el-icon>
      <el-icon v-else><el-icon-arrow-left /></el-icon>
    </div>
  </el-menu>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import Logout from './Logout.vue'

// 控制菜单是否折叠
const isCollapse = ref(false)

// 获取当前路由和用户状态
const route = useRoute()
const router = useRouter()
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
  const userRole = userStore.getUserRole()
  return roles.includes(userRole)
}

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
  color: #ffd04b;
  padding: 0 15px;
  box-sizing: border-box;
  margin-bottom: 10px;

  h3 {
    margin: 0;
    font-size: 18px;
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
  background-color: #4a5056;
  color: #fff;
  padding: 5px;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background-color: #606366;
  }
}
</style>
