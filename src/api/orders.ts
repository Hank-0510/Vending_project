
import request from '../utils/request'

// 获取超级管理员的所有订单列表
export async function getSuperAdminOrders() {
  try {
    const res = await request({
      url: '/api/orders/super',
      method: 'get',
      // 添加重试配置，提高请求成功率
      retry: 2,
      retryDelay: 1000
    })

    if (res.data && Array.isArray(res.data)) {
      return {
        status: 'success',
        data: res.data.map((item: any) => ({
          id: item.id,
          serialNumber: String(item.id), // 使用id作为编号
          merchantName: `User ${item.user_id}`, // 用户ID作为商家名称
          orderNumber: `ORD-${item.id}`, // 订单编号
          deviceQuantity: item.quantity, // 购买设备数量
          totalPrice: item.total_price, // 订单总价
          paymentMethod: '', // 支付方式（API中没有）
          paymentStatus: item.status, // 支付状态
          machineNumber: `MACH-${item.machine_id}`, // 机器编号
          cargoNumber: `PROD-${item.product_id}`, // 货物编号
          updateTime: '', // 更新时间（API中没有）
          creationTime: '' // 创建时间（API中没有）
        }))
      }
    }
    return {
      status: 'error',
      message: '无效的数据格式'
    }
  } catch (error: any) {
    console.error('Error fetching orders:', error)
    return {
      status: 'error',
      message: error.response?.data?.message || '获取订单列表失败重试'
    }
  }
}

// 删除订单
export function deleteOrder(id: number) {
  return request({
    url: `/api/orders/${id}`,
    method: 'delete'
  })
}

// 更新订单
export function updateOrder(data: any) {
  return request({
    url: `/api/orders/${data.id}`,
    method: 'put',
    data
  })
}