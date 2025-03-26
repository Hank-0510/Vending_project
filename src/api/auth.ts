import request from '@/utils/request'

// 登录接口
export function login(data: {
  username: string
  password: string
}) {
  return request({
    url: '/api/auth/login',
    method: 'post',
    data,
    // 添加重试机制
    retry: 1,
    retryDelay: 1000
  })
}

// 模拟登录接口（当后端接口不可用时使用）
/* 注释掉模拟登录接口，使用真实后端接口
export function mockLogin(data: {
  username: string
  password: string
  role: string
}) {
  // 模拟后端验证逻辑
  const validUsers = [
    { username: 'admin', password: '123456', role: 'super' },
    { username: 'merchant', password: '123456', role: 'admin' },
    { username: 'employee', password: '123456', role: 'normal' }
  ]
  
  const user = validUsers.find(
    u => u.username === data.username && 
    u.password === data.password && 
    u.role === data.role
  )
  
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (user) {
        resolve({
          data: {
            access_token: `mock-token-${data.username}-${data.role}-${Date.now()}`
          },
          message: '登录成功',
          status: 'success'
        })
      } else {
        reject({
          message: '用户名、密码或角色不正确',
          status: 'error'
        })
      }
    }, 500) // 模拟网络延迟
  })
}
*/

// 使用真实登录接口替代模拟登录
export function mockLogin(data: {
  username: string
  password: string
}) {
  return login(data)
}