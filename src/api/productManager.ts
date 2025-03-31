import request from '../utils/request'

// 获取所有商品列表
export function fetchProducts() {
  return request({
    url: '/api/products/',
    method: 'get'
  })
}

// 获取指定机器的商品列表
export function getMachineProducts(machineId: string | number) {
  return request({
    url: `/api/products/machine/${machineId}`,
    method: 'get'
  })
}

// 更新商品信息
export function updateProduct(productId: number, productData: any) {
  // Ensure required fields are present
  const requiredFields = ['name', 'price', 'stock', 'image_url'];
  const missingFields = requiredFields.filter(field => !productData[field]);
  
  if (missingFields.length > 0) {
    return Promise.reject(new Error(`Missing required fields: ${missingFields.join(', ')}`));
  }
  
  // Format data to match backend expectations
  const formattedData = {
    ...productData,
    price: Number(productData.price).toFixed(2),
    stock: Number(productData.stock)
  };
  
  return request({
    url: `/api/products/${productId}`,
    method: 'put',
    data: formattedData
  })
}

// 创建新商品
export function createProduct(productData: any) {
  return request({
    url: '/api/products/',
    method: 'post',
    data: productData
  })
}

// 删除商品
export function deleteProduct(productId: number) {
  return request({
    url: `/api/products/${productId}`,
    method: 'delete'
  })
}

// 批量更新商品的机器ID（添加商品到机器）
export function addProductsToMachine(products: any[], machineId: number | string) {
  const updatePromises = products.map(product => {
    const updatedProduct = { ...product, machine_id: parseInt(machineId.toString()) }
    return updateProduct(product.id, updatedProduct)
  })
  
  return Promise.all(updatePromises)
}

// 从机器中移除商品（将商品的machine_id设为0）
export function removeProductsFromMachine(productIds: number[], products: any[]) {
  const deletePromises = productIds.map(productId => {
    // 找到对应的商品
    const product = products.find(p => p.id === productId)
    if (!product) return Promise.resolve()
    
    // 将商品的machine_id设为0，表示从机器中移除
    const updatedProduct = { ...product, machine_id: 0 }
    return updateProduct(productId, updatedProduct)
  })
  
  return Promise.all(deletePromises)
}