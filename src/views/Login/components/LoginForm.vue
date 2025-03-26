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
  
      <!-- 角色选择已移除，将从后端返回的数据中获取角色 -->
  
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
    password: ''
    // 角色字段已移除，将从后端返回的数据中获取
  })

  // 在组件挂载时检查localStorage中的登录信息

onMounted(() => {
    const rememberedUsername = localStorage.getItem('rememberedUsername')
    const rememberedPassword = localStorage.getItem('rememberedPassword')
    
    if (rememberedUsername && rememberedPassword) {
      loginForm.username = rememberedUsername
      loginForm.password = rememberedPassword
      rememberMe.value = true
    }
  })

  const loginRules = {
    username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
    password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
    // 角色验证已移除
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
          } else {
            // 清除之前可能保存的登录信息
            localStorage.removeItem('rememberedUsername')
            localStorage.removeItem('rememberedPassword')
            localStorage.removeItem('rememberedRole') // 仍然移除可能存在的旧数据
          }
          
          // 从响应中获取用户角色
          const userRole = res.data.role || res.data.data?.role
          if (!userRole) {
            throw new Error('服务器未返回用户角色信息')
          }
          
          // 保存用户信息、token和角色
          userStore.setUserInfo({
            username: loginForm.username,
            role: userRole, // 使用后端返回的角色
            token: token
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
          ElMessage.error(error.message || '登录失败，请检查用户名和密码')
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