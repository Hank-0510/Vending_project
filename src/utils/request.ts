import axios from 'axios'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'
import router from '@/router'
import { AxiosHeaders } from 'axios'

// 创建 axios 实例
const service = axios.create({
  timeout: 15000, // 增加超时时间到15秒
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache, no-store, must-revalidate', // 禁用缓存
    'Pragma': 'no-cache',
    'Expires': '0'
  }
})

// 添加请求重试功能
service.interceptors.response.use(undefined, async (err) => {
  const config = err.config;
  
  // 如果配置了重试选项且请求失败，进行重试
  if (config && config.retry && config.retry > 0) {
    config.__retryCount = config.__retryCount || 0;
    
    // 检查是否已经达到最大重试次数
    if (config.__retryCount < config.retry) {
      config.__retryCount += 1;
      console.log(`[请求重试] 第 ${config.__retryCount}/${config.retry} 次重试请求: ${config.url}`);
      
      // 延迟指定时间后重试
      const delayRetry = new Promise(resolve => {
        setTimeout(() => {
          console.log(`[请求重试] 延迟 ${config.retryDelay || 1000}ms 后重试`);
          resolve(null);
        }, config.retryDelay || 1000);
      });
      
      await delayRetry;
      return service(config);
    }
  }
  
  return Promise.reject(err);
})

// 不需要 token 的白名单接口列表
const NO_AUTH_URLS = [
  '/api/auth/login',    // 登录接口
  '/api/captcha'        // 验证码接口
]

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    console.log('[请求拦截器] 处理请求:', `${config.method?.toUpperCase()} ${config.url}`)

    // 白名单请求直接放行
    if (NO_AUTH_URLS.some(url => config.url?.includes(url))) {
      console.log('[白名单] 跳过Token验证')
      return config
    }

    // 获取 Token
    const userStore = useUserStore()
    const token = userStore.token || localStorage.getItem('token')
    console.log('[Token状态]', token ? '有效Token存在' : '未检测到Token')

    // Token 严格校验
    if (!token) {
      console.error('[拦截器] Token缺失，终止请求')
      ElMessage.warning('登录凭证已失效，请重新登录')
      router.push('/login')
      return Promise.reject(new Error('Authorization token missing'))
    }

    // 确保 headers 存在，并统一设置 Authorization 头，格式为 Bearer token
    if (!config.headers) {
      config.headers = new AxiosHeaders()
    }
    config.headers.set("Authorization", `Bearer ${token.trim()}`)

    console.log("拦截器最终设置的 headers:", config.headers)

    return config
  },
  (error) => {
    console.error('[请求拦截器错误]', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    console.log('[响应成功]', response.config.url)

    // 特殊处理登录响应
    if (response.config.url?.includes('/api/auth/login')) {
      console.log('[登录响应处理]', response.data)
      return response.data // 直接返回数据，不进行状态码检查
    }

    // 统一处理正常响应
    if (!response.data) {
      ElMessage.error('服务器返回数据异常')
      return Promise.reject(new Error('Empty response data'))
    }

    const res = response.data


    const isSuccess = res.success === true || res.status === 'success' || res.code === 200


    if (!isSuccess) {
      const msg = res.message?.trim() || '业务逻辑错误'
      console.error('[业务错误]', msg, res)
      ElMessage.error(msg)

      return Promise.reject(new Error(msg))
    }
    // if (res.status !== 'success') {
    //   const msg = res.message || '业务逻辑错误'
    //   ElMessage.error(msg)
      
    //   return Promise.reject(new Error(msg))
      
    // }

    return res
  },
  async (error) => {
    console.error('[响应错误]', {
      url: error.config?.url,
      status: error.response?.status,
      error: error.message
    })

    const { response } = error

    // 处理网络错误（无响应）
    if (!response) {
      ElMessage.error('网络连接异常，请检查网络设置')
      return Promise.reject(error)
    }

    const status = response.status
    const message = response.data?.message || `服务器错误 (${status})`

    // 只在认证错误(401/403)时清除用户凭证并跳转登录页
    // 其他错误类型保留用户凭证，允许用户继续操作
    if ([401, 403].includes(status)) {
      ElMessage.error(`访问被拒绝 (${status})`)
      // clearUserSession()
      router.push('/login')
    }

    // HTTP 状态码细化处理 - 保留用户凭证，只显示错误信息
    // 注意：这里不再清除用户凭证，允许用户继续尝试其他操作
    switch (status) {
      case 400:
        ElMessage.error(`请求参数错误: ${message}`)
        break
      case 404:
        ElMessage.error(`资源不存在: ${message}`)
        break
      case 500:
      case 502:
      case 503:
        ElMessage.error(`服务器错误: ${message}`)
        break
      default:
        ElMessage.error(message)
    }

    return Promise.reject(error)
  }
)

// 增强型会话清理
function clearUserSession() {
  console.log('[清理会话] 开始清除用户凭证')

  const STORAGE_KEYS = [
    'token', 'userInfo', 'refreshToken',
    'sessionToken', 'tempToken'
  ]

  // 清理所有存储位置
  STORAGE_KEYS.forEach(key => {
    localStorage.removeItem(key)
    sessionStorage.removeItem(key)
  })

  // 清理 Pinia 状态
  const userStore = useUserStore()
  // 使用 clearUserInfo 方法替代 $reset()
  userStore.clearUserInfo()

  // 清理 Cookies（如果使用）
  if (navigator.cookieEnabled) {
    document.cookie.split(';').forEach(cookie => {
      const [name] = cookie.split('=')
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
    })
  }
}

export default service
















// import axios from 'axios'
// import { ElMessage } from 'element-plus'
// import { useUserStore } from '@/stores/user'
// import router from '@/router'
// import { AxiosHeaders } from "axios";

// // 创建 axios 实例
// const service = axios.create({
//   timeout: 10000,
//   headers: {
//     'Content-Type': 'application/json'
//   }
// })

// // 不需要 token 的白名单接口列表
// const NO_AUTH_URLS = [
//   '/api/auth/login',    // 登录接口
//   '/api/captcha'        // 验证码接口
// ]

// // 请求拦截器
// service.interceptors.request.use(
//   (config) => {
//     console.log('[请求拦截器] 处理请求:', `${config.method?.toUpperCase()} ${config.url}`)

//     // 白名单请求直接放行
//     if (NO_AUTH_URLS.some(url => config.url?.includes(url))) {
//       console.log('[白名单] 跳过Token验证')
//       return config
//     }

//     if (!config.headers) {
//       config.headers = new AxiosHeaders();
//     }
//     config.headers.set("AUTHORIZED", localStorage.getItem("token") || "");


//       // 检查请求是否携带了 AUTHORIZED 头
//     const authorizedHeader = config.headers?.AUTHORIZED;
//     if (!authorizedHeader) {
//       console.warn('[拦截器警告] 请求未携带 AUTHORIZED 头');
//     } else {
//       console.log('[拦截器检查] AUTHORIZED 头:', authorizedHeader);
//     }



//     // 获取 Token 逻辑
//     const userStore = useUserStore()
//     const token = userStore.token || localStorage.getItem('token')
//     console.log('[Token状态]', token ? '有效Token存在' : '未检测到Token')
    
//     // 严格 Token 校验
//     if (!token) {
//       console.error('[拦截器] Token缺失，终止请求')
//       ElMessage.warning('登录凭证已失效，请重新登录')
//       router.push('/login')
//       return Promise.reject(new Error('Authorization token missing'))
//     }

//     // // 强制设置 Authorization 头
//     // config.headers = {
//     //   ...config.headers,  // 保留原有headers
//     //   Authorization: `Bearer ${token.trim()}`
//     // }
//     config.headers = AxiosHeaders.from({
//       ...config.headers,  // 先转换为 AxiosHeaders 实例
//       Authorization: `Bearer ${token.trim()}`
//     });
//     console.log("请求头:", config.headers);
//     console.log(config.headers instanceof AxiosHeaders); // 应该为 true


//     console.log('[请求头设置]', {
//       url: config.url,
//       headers: config.headers
//     })

//     // 附加 Token 到请求头
//     config.headers.Authorization = `Bearer ${token.trim()}`
//     console.log("拦截器请求头:", config.headers);
//     console.log("拦截器请求前的 headers:", config.headers);

//     // 确保 headers 存在
//     if (!config.headers) {
//       config.headers = new AxiosHeaders();
//     }

//     // 追加 Authorization 头部
//     config.headers.set("Authorization", `Bearer ${token.trim()}`);

//     console.log("拦截器修改后的 headers:", config.headers);
//     console.log("拦截器中的 token:", token);

// //设置token中
// if (!config.headers) {
//   config.headers = new AxiosHeaders();
// }
// config.headers.set("Authorization", `Bearer ${token.trim()}`);

//     return config
//   },
//   (error) => {
//     console.error('[请求拦截器错误]', error)
//     return Promise.reject(error)
//   }
// )

// // 响应拦截器
// service.interceptors.response.use(
//   (response) => {
//     console.log('[响应成功]', response.config.url)
    
//     // 特殊处理登录响应
//     if (response.config.url?.includes('/api/auth/login')) {
//       console.log('[登录响应处理]', response.data)
//       return response.data // 直接返回数据，不进行状态码检查
//     }

//     // 统一处理正常响应
//     if (!response.data) {
//       ElMessage.error('服务器返回数据异常')
//       return Promise.reject(new Error('Empty response data'))
//     }

//     const res = response.data
    
//     if (res.status !== 'success') {
//       const msg = res.message || '业务逻辑错误'
//       ElMessage.error(msg)
//       return Promise.reject(new Error(msg))
//     }

//     return res
//   },
//   async (error) => {
//     console.error('[响应错误]', {
//       url: error.config?.url,
//       status: error.response?.status,
//       error: error.message
//     })

//     const { response } = error
    
//     // 处理网络错误（无响应）
//     if (!response) {
//       ElMessage.error('网络连接异常，请检查网络设置')
//       return Promise.reject(error)
//     }

//     const status = response.status
//     const message = response.data?.message || `服务器错误 (${status})`

//     // 统一认证错误处理
//     if ([401, 403].includes(status)) {
//       ElMessage.error(`访问被拒绝 (${status})`)
//       clearUserSession()
//       router.push('/login')
//     }

//     // HTTP 状态码细化处理
//     switch (status) {
//       case 400:
//         ElMessage.error(`请求参数错误: ${message}`)
//         break
//       case 404:
//         ElMessage.error(`资源不存在: ${message}`)
//         break
//       case 500:
//       case 502:
//       case 503:
//         ElMessage.error(`服务器错误: ${message}`)
//         break
//       default:
//         ElMessage.error(message)
//     }

//     return Promise.reject(error)
//   }
// )

// // 增强型会话清理
// function clearUserSession() {
//   console.log('[清理会话] 开始清除用户凭证')
  
//   // 清理存储
//   const STORAGE_KEYS = [
//     'token', 'userInfo', 'refreshToken',
//     'sessionToken', 'tempToken'
//   ]

//   // 清理所有存储位置
//   STORAGE_KEYS.forEach(key => {
//     localStorage.removeItem(key)
//     sessionStorage.removeItem(key)
//   })

//   // 清理 Pinia 状态
//   const userStore = useUserStore()
//   userStore.$reset()

//   // 清理 Cookies（如果使用）
//   if (navigator.cookieEnabled) {
//     document.cookie.split(';').forEach(cookie => {
//       const [name] = cookie.split('=')
//       document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
//     })
//   }
// }

// export default service









