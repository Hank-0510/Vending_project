<template>
    <div class="login-title">
      <h2 class="title">自动售货机管理系统</h2>
    </div>
    
    <el-form :model="loginForm" :rules="loginRules" ref="loginFormRef">
      <el-form-item label="" prop="username" class="form-item">
        <el-input
          v-model="loginForm.username"
          placeholder="请输入用户名"
          auto-complete="on"
          style="position: relative"
        >
        <template #prefix>
          <el-icon class="el-input__icon"><UserFilled /></el-icon>
        </template>
        </el-input>
      </el-form-item>
  
      <el-form-item label="" prop="password" class="form-item">
        <el-input
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="请输入密码"
          auto-complete="on"
        >
        <template #prefix>
          <el-icon class="el-input__icon"><GoodsFilled /></el-icon>
        </template>
        <template #suffix>
          <div class="show-pwd" @click="showPwd">
            <el-icon class="el-input__icon">
              <View v-if="passwordType === ''" />
              <Hide v-else />
            </el-icon>
          </div>
        </template>

        </el-input>
      </el-form-item>
  
      <el-form-item label="" prop="role" class="form-item">
        <el-select v-model="loginForm.role" placeholder="请选择角色" class="role-select">
          <el-option label="超级管理员" value="super" />
          <el-option label="商家管理员" value="admin" />
          <el-option label="补货员" value="normal" />
        </el-select>
      </el-form-item>
  
      <el-form-item>
        <div class="remember-me">
          <el-checkbox v-model="rememberMe">记住账号密码</el-checkbox>
        </div>
      </el-form-item>

      <el-form-item style="width: 100%">
        <el-button class="login-btn" type="primary" :loading="loading" @click="handleLogin">登录</el-button>
      </el-form-item>
      
    </el-form>
  </template>
  <script lang="ts" setup>
  // import { someFunction, type FormInstance } from 'some-library';
  import { ref, reactive } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import { ElMessage, FormInstance } from 'element-plus'
  import { UserFilled, GoodsFilled, View, Hide } from '@element-plus/icons-vue'
  import { mockLogin } from '@/api/auth'
  import { useUserStore } from '@/stores/user'
  import { onMounted } from 'vue'


  const router = useRouter()
  const route = useRoute()
  const userStore = useUserStore()
  const loginFormRef = ref<FormInstance>()
  const passwordType = ref('password')
  const loading = ref(false)
  const rememberMe = ref(false)

  const loginForm = reactive({
    username: '',
    password: '',
    role: ''
  })

  // 在组件挂载时检查localStorage中的登录信息

onMounted(() => {
    const rememberedUsername = localStorage.getItem('rememberedUsername')
    const rememberedPassword = localStorage.getItem('rememberedPassword')
    const rememberedRole = localStorage.getItem('rememberedRole')
    
    if (rememberedUsername && rememberedPassword && rememberedRole) {
      loginForm.username = rememberedUsername
      loginForm.password = rememberedPassword
      loginForm.role = rememberedRole
      rememberMe.value = true
    }
  })

  const loginRules = {
    username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
    password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
    role: [{ required: true, message: '请选择角色', trigger: 'change' }]
  }

  function showPwd() {
    passwordType.value = passwordType.value === 'password' ? '' : 'password'
  }

  const handleLogin = async () => {
    if (!loginFormRef.value) return
    
    await loginFormRef.value.validate(async (valid) => {
      if (valid) {
        try {
          loading.value = true
          // 使用真实登录接口
          const res = await mockLogin(loginForm)
          console.log('登录响应数据:', res)
          if (!res || !res.data || !res.data.access_token) {
            throw new Error('登录响应数据格式错误')
          }
          const token = res.data.access_token || res.data.data.access_token
          if(!token){
            throw new Error('服务器未返回有效token')
          }
          localStorage.setItem('token', token)
          console.log('获取到token:', token)
          
          // 根据"记住账号密码"选项保存或清除登录信息
          if (rememberMe.value) {
            // 保存登录信息到localStorage
            localStorage.setItem('rememberedUsername', loginForm.username)
            localStorage.setItem('rememberedPassword', loginForm.password)
            localStorage.setItem('rememberedRole', loginForm.role)
          } else {
            // 清除之前可能保存的登录信息
            localStorage.removeItem('rememberedUsername')
            localStorage.removeItem('rememberedPassword')
            localStorage.removeItem('rememberedRole')
          }
          
          // 保存用户信息、token和角色
          // 添加模拟的刷新令牌（实际项目中应该从后端获取）
          // const refreshToken = `refresh-token-${Date.now()}`
          
          userStore.setUserInfo({
            username: loginForm.username,
            role: loginForm.role, // 保存用户选择的角色
            token: token,
           
          })
          userStore.updateToken(token)
          
          ElMessage.success('登录成功')
          // 登录成功后跳转，优先使用redirect参数指定的路径
          const redirect = route.query.redirect as string
          // 根据用户角色重定向到相应的页面
          if (redirect && redirect !== '/') {
            router.push(redirect)
          } else {
            // 如果没有重定向地址，根据角色跳转到默认页面
            router.push('/')
          }
        } catch (error: any) {
          console.error('登录失败:', error)
          ElMessage.error(error.message || '登录失败，请检查用户名、密码和角色')
        } finally {
          loading.value = false
        }
      }
    })
  }
  </script>
  
  <style lang="scss" scoped>
    @use '../index' as *;
    
    .remember-me {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
    }
  </style>