<template>
    <div class="login-container">
      <div class="login-box">
        <div class="login-left">
          <img src="@/assets/image/login/background.png" />
        </div>
        <div class="login-form">
          <!-- <div class="info-qrcode">{{ accountLogin ? '扫码登录' : '账号登录' }}</div> -->
          <!-- <img src="@/assets/image/login/qrcode-icon.png" class="qrcode" @click="handleClick" /> -->
  
          <LoginForm v-if="accountLogin" />
        </div>
      </div>
    </div>
  </template>
  <script lang="ts" setup>
  import { ref } from 'vue'
  import LoginForm from './components/LoginForm.vue'

  const accountLogin = ref<boolean>(true)

  const handleClick = () => {
    console.log('=======', accountLogin)
    accountLogin.value = !accountLogin.value
  }
</script>

<style lang="scss" scoped>
  @use './index' as *;
</style>