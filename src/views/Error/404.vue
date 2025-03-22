<template>
  <div class="error-page">
    <div class="error-code">404</div>
    <div class="error-desc">抱歉，页面不存在</div>
    <el-button type="primary" @click="goHome">返回首页</el-button>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push('/')
}
</script>

<style lang="scss" scoped>
.error-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 20px;
  
  .error-code {
    font-size: 120px;
    font-weight: bold;
    color: #f56c6c;
    margin-bottom: 20px;
  }
  
  .error-desc {
    font-size: 24px;
    color: #606266;
    margin-bottom: 30px;
  }
}
</style>