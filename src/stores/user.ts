import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface UserInfo {
  username: string
  role: string
  token: string
  // 移除refreshToken字段，因为不再需要刷新token功能
}

export const useUserStore = defineStore('user', () => {
  const userInfo = ref<UserInfo | null>(null)
  const token = ref<string>('')
  
  // 初始化用户信息（不再自动登录）
  const initUserInfo = () => {
    // 清除之前的登录状态，确保每次打开网站都需要重新登录
    clearUserInfo()
    
    // 不再从localStorage获取token和用户信息进行自动登录
    // 即使localStorage中有token和userInfo，也不会自动登录
  }
  
  // 设置用户信息和token
  const setUserInfo = (info: UserInfo) => {
    userInfo.value = info
    token.value = info.token
    
    // 保存到localStorage
    localStorage.setItem('token', info.token)
    localStorage.setItem('userInfo', JSON.stringify(info))
    
    // 不再处理refreshToken，因为后端没有实现刷新token的接口
  }
  
  // 更新token（用于token刷新）
  const updateToken = (newToken: string) => {
    if (userInfo.value) {
      userInfo.value.token = newToken
      token.value = newToken
      
      // 更新localStorage中的token
      localStorage.setItem('token', newToken)
      localStorage.setItem('userInfo', JSON.stringify(userInfo.value))
    }
  }
  
  // 清除用户信息
  const clearUserInfo = () => {
    userInfo.value = null
    token.value = ''
    
    // 从localStorage移除
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
    localStorage.removeItem('refreshToken') // 仍然移除refreshToken以确保兼容性
  }
  
  // 判断用户是否已登录
  const isLoggedIn = () => {
    console.log('登录状态:',!!token.value);
    return !!token.value
  }
  
  // 获取用户角色
  const getUserRole = () => {
    return userInfo.value?.role || ''
  }
  
  return {
    userInfo,
    token,
    initUserInfo,
    setUserInfo,
    updateToken,
    clearUserInfo,
    isLoggedIn,
    getUserRole
  }
})