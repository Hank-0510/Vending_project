<template>
  <el-dialog
    v-model="dialogVisible"
    title="商品详情"
    width="60%"
    :before-close="handleClose"
    center
  >
    <div class="product-container">
      <el-table :data="productList" style="width: 100%" height="400px" border v-loading="loading" element-loading-text="正在加载商品数据...">
        <template #empty>
          <div class="empty-data">
            <el-icon><box /></el-icon>
            <span>暂无商品数据</span>
          </div>
        </template>
        <el-table-column label="商品图片" width="120">
          <template #default="scope">
            <el-image
              style="width: 80px; height: 80px"
              :src="scope.row.image_url"
              fit="cover"
              :preview-src-list="[scope.row.image_url]"
              :initial-index="0"
              :z-index="3000"
              :hide-on-click-modal="true"
              fallback="https://via.placeholder.com/80x80?text=No+Image"
              loading="lazy"
            >
              <template #error>
                <div class="image-error">
                  <el-icon><picture-filled /></el-icon>
                  <span>加载失败</span>
                </div>
              </template>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="商品名称" width="180" />
        <el-table-column prop="price" label="价格" width="100">
          <template #default="scope">
            <span>¥{{ scope.row.price.toFixed(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="120">
          <template #default="scope">
            <el-tag :type="scope.row.status === 'available' ? 'success' : 'danger'">
              {{ scope.row.status === 'available' ? '可用' : '不可用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="stock" label="库存" width="100" />
        <!-- <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button type="primary" size="small" @click="editProduct(scope.row)">编辑</el-button>
            <el-button type="danger" size="small" @click="deleteProduct(scope.row)">删除</el-button>
          </template>
        </el-table-column> -->
      </el-table>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">关闭</el-button>
        <el-button type="primary" @click="fetchProducts" :loading="loading">刷新数据</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { PictureFilled, Box } from '@element-plus/icons-vue'
import { getMachineProducts } from '@/api/product'

const props = defineProps<{
  machineId: number
}>()

const dialogVisible = ref(false)
const productList = ref([])
const loading = ref(false)
const retryCount = ref(0)
const maxRetries = 3

const fetchProducts = async () => {
  if (!props.machineId) {
    ElMessage.warning('设备ID不存在，无法获取商品数据')
    return
  }
  
  loading.value = true
  productList.value = [] // 清空之前的数据
  
  // 生成唯一请求ID，用于跟踪整个请求生命周期
  const requestId = Math.random().toString(36).substring(2, 10)
  console.log(`[${new Date().toISOString()}] [请求ID: ${requestId}] 开始获取设备ID: ${props.machineId} 的商品数据`)
  
  try {
    // 设置请求超时时间，避免长时间等待
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('请求超时')), 30000) // 30秒超时
    })
    
    // 使用Promise.race竞争，谁先完成就返回谁的结果
    const response = await Promise.race([
      getMachineProducts(props.machineId),
      timeoutPromise
    ])
    
    console.log(`[请求ID: ${requestId}] 收到API响应:`, response)
    
    // 处理API返回的数据
    if (response && response.data) {
      // 数据获取成功
      productList.value = Array.isArray(response.data) ? response.data : []
      retryCount.value = 0 // 重置重试计数
      
      console.log(`[请求ID: ${requestId}] 成功获取到 ${productList.value.length} 条商品数据`)
      
      if (productList.value.length === 0) {
        console.warn(`[请求ID: ${requestId}] API返回成功但数据为空数组，这是正常现象，表示该设备没有商品`)
        // 不再重试，因为空数组是有效的业务结果
      }
    } else {
      // API返回了响应但格式不符合预期
      console.warn(`[请求ID: ${requestId}] API返回格式异常:`, response)
      
      // 确保显示空列表
      productList.value = []
      
      // 如果返回格式不符合预期且未超过最大重试次数，进行重试
      if (retryCount.value < maxRetries) {
        retryCount.value++
        const retryDelay = 2000 * retryCount.value // 递增重试延迟
        console.log(`[请求ID: ${requestId}] 数据格式异常，第 ${retryCount.value}/${maxRetries} 次重试，延迟 ${retryDelay}ms...`)
        setTimeout(() => fetchProducts(), retryDelay)
        return
      } else {
        console.warn(`[请求ID: ${requestId}] 已达到最大重试次数(${maxRetries})，不再重试`)
        // 显示友好提示
        ElMessage.info('暂无商品数据，请稍后再试')
      }
    }
  } catch (error) {
    console.error(`[请求ID: ${requestId}] 获取商品列表失败:`, error)
    
    // 记录更详细的错误信息
    if (error.response) {
      // 服务器返回了错误状态码
      console.error(`[请求ID: ${requestId}] 服务器错误: ${error.response.status}`, error.response.data)
    } else if (error.request) {
      // 请求已发送但没有收到响应
      console.error(`[请求ID: ${requestId}] 未收到服务器响应，可能是网络问题或服务器超时`)
    } else if (error.message === '请求超时') {
      // 我们自己设置的超时
      console.error(`[请求ID: ${requestId}] 请求超时，超过30秒未收到响应`)
    } else {
      // 请求设置时发生错误
      console.error(`[请求ID: ${requestId}] 请求错误: ${error.message}`)
    }
    
    // 如果失败且未超过最大重试次数，则重试
    if (retryCount.value < maxRetries) {
      retryCount.value++
      const retryDelay = 2000 * retryCount.value // 递增重试延迟
      console.log(`[请求ID: ${requestId}] 第 ${retryCount.value}/${maxRetries} 次重试获取商品数据，延迟 ${retryDelay}ms...`)
      setTimeout(() => fetchProducts(), retryDelay) 
      return
    }
    
    // 所有重试都失败，显示错误信息
    ElMessage.error(`获取商品数据失败，已重试 ${retryCount.value} 次`)
    productList.value = [] // 确保失败时显示空列表
  } finally {
    loading.value = false
  }
}

const handleClose = (done: () => void) => {
  done()
}

const show = () => {
  dialogVisible.value = true
  retryCount.value = 0 // 重置重试计数
  fetchProducts()
}

const editProduct = (product: any) => {
  // 编辑商品的逻辑，可以在这里实现或者调用另一个组件
  ElMessage.info('编辑商品功能待实现')
}

const deleteProduct = (product: any) => {
  ElMessageBox.confirm('确定要删除该商品吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 删除商品的逻辑
    ElMessage.success('删除成功')
  }).catch(() => {
    ElMessage.info('已取消删除')
  })
}

const addProduct = () => {
  // 添加商品的逻辑
  ElMessage.info('添加商品功能待实现')
}

defineExpose({
  show
})
</script>

<style scoped>
.product-container {
  max-height: 500px;
  overflow-y: auto;
}

.image-error {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 80px;
  height: 80px;
  background-color: #f5f7fa;
  color: #909399;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.empty-data {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: #909399;
}

.empty-data .el-icon {
  font-size: 48px;
  margin-bottom: 10px;
}
</style>