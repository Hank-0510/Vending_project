import request from '../utils/request'
import axios from 'axios'
// 获取设备列表
export async function getDeviceList(params: any) {
  // Filter out empty parameters
  const filteredParams = Object.fromEntries(
    Object.entries(params || {}).filter(([_, value]) => value !== '')
  )

  try {
    console.log("getDeviceList")
    const res = await request({
      url: '/api/machines/',
      method: 'get',
      params: filteredParams
    })

    if (res.data && Array.isArray(res.data)) {
      return {
        status: 'success',
        data: res.data.map((item: any) => ({
          id: item.id,
          deviceNumber: item.deviceNumber || '',
          deviceModel: item.deviceModel || '',
          deviceCardNumber: item.name || '',
          deviceAddress: item.location || '',
          deviceRemark: item.remark || '',
          enableStatus: item.status || ''
        }))
      }
    }
    return {
      status: 'error',
      message: '无效的数据格式'
    }
  } catch (error: any) {
    console.error('Error fetching devices:', error)
    return {
      status: 'error',
      message: error.response?.data?.message || '获取设备列表失败'
    }
  }
}

// 新增设备
export async function addDevice(data: any) {

  
  return request({
    url: '/api/machines/',
    method: 'post',
    data
  })
}

// 更新设备信息
export function updateDevice(data: any) {
  return request({
    url: `/api/machines/${data.id}`,
    method: 'put',
    data
  })
}

// 删除设备
export function deleteDevice(id: number) {
  return request({
    url: `/api/machines/${id}`,
    method: 'delete'
  })
}
