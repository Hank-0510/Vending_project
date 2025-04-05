import request from '../utils/request'

// 获取指定机器的商品列表
export function getMachineProducts(machineId: string | number) {
  // 添加时间戳和随机数参数，确保每次请求都是新的
  const timestamp = new Date().getTime()
  const randomStr = Math.random().toString(36).substring(2, 10)
  
  return request({
    url: `/products/machine/${machineId}`,
    method: 'get',
    params: {
      _t: timestamp, // 添加时间戳参数避免缓存
      _r: randomStr  // 添加随机字符串进一步确保不使用缓存
    },
    // 增加超时时间到30秒，给服务器更多处理时间
    timeout: 30000,
    // 添加额外的请求头，禁用缓存
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
      'Pragma': 'no-cache',
      'Expires': '0'
    },
    // 允许跨站点请求
    withCredentials: true,
    // 最多重试1次
    retry: 1,
    retryDelay: 1000
  })
}