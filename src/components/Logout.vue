<template>
  <el-dropdown @command="handleCommand">
    <span class="user-dropdown">
      {{ username }}
      <el-icon class="el-icon--right"><arrow-down /></el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command="logout">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ArrowDown } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

// 获取用户名
const username = computed(() => userStore.userInfo?.username || '用户')

// 处理下拉菜单命令
const handleCommand = (command: string) => {
  if (command === 'logout') {
    userStore.clearUserInfo()
    ElMessage.success('已退出登录')
    router.push('/login')
  }
}
</script>

<style lang="scss" scoped>
.user-dropdown {
  display: flex;
  align-items: center;
  cursor: pointer;
  color: #333;
  font-size: 14px;
  
  .el-icon {
    margin-left: 4px;
  }
}
</style>