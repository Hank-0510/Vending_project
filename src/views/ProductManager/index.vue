<template>
  <div class="product-manager">
    
    <div class="product-container">
      <!-- 左侧商品列表 -->
      <div class="product-list-section">
        <div class="section-header">
          <h2>商品列表</h2>
          <div class="header-actions">
            <el-button type="primary" size="small" @click="openCreateProductDialog">新建</el-button>
            <el-button type="danger" size="small" :disabled="!hasSelectedProducts" @click="deleteSelectedProducts">删除</el-button>
          </div>
        </div>
        
        <div class="product-list">
          <el-table
            v-loading="loading"
            :data="sortedProducts"
            style="width: 100%"
            @selection-change="handleSelectionChange">
            <el-table-column
              type="selection"
              width="55">
            </el-table-column>
            <el-table-column
              prop="name"
              label="商品名称">
            </el-table-column>
            <el-table-column
              prop="image_url"
              label="图片链接"
              width="120">
              <template #default="scope">
                <el-tooltip :content="scope.row.image_url" placement="top">
                  <span class="image-url-text">{{ scope.row.image_url }}</span>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column
              prop="price"
              label="价格">
              <template #default="scope">
                ¥{{ scope.row.price.toFixed(2) }}
              </template>
            </el-table-column>
            <el-table-column
              prop="stock"
              label="库存">
            </el-table-column>
            <el-table-column
              label="操作"
              width="100">
              <template #default="scope">
                <el-button type="primary" size="small" @click="openProductDetail(scope.row)">修改</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      
      <!-- 右侧机器商品管理 -->
      <div class="machine-products-section">
        <div class="section-header">
          <h2>机器商品管理</h2>
        </div>
        
        <div class="machine-search">
          <el-input 
            v-model="machineId" 
            placeholder="输入机器编号" 
            clearable>
          </el-input>
          <el-button type="primary" @click="searchMachineProducts">查询</el-button>
        </div>
        
        <div class="machine-products">
          <div class="machine-actions">
            <el-button type="primary" size="small" :disabled="!hasSelectedProducts || hasSelectedMachineProducts" @click="addProductsToSelectedMachine">新增</el-button>
            <el-button type="danger" size="small" :disabled="!hasSelectedMachineProducts" @click="deleteMachineProducts">删除</el-button>
          </div>
          
          <el-empty v-if="machineProducts.length === 0 && machineProductsLoaded" description="该机器暂无商品"></el-empty>
          
          <div class="machine-product-list" v-else>
            <!-- 表头 -->
            <div class="machine-product-header">
              <div class="header-checkbox" v-if="!isDeleteMode">
                <el-checkbox 
                  v-model="allMachineProductsSelected"
                  :indeterminate="isIndeterminateState"
                  @change="handleSelectAllMachineProducts"
                ></el-checkbox>
              </div>
              <div class="header-name">名称</div>
              <div class="header-stock">库存</div>
              <div class="header-status">状态</div>
            </div>
            <!-- 商品列表 -->
            <div 
              v-for="product in machineProducts" 
              :key="product.id"
              class="machine-product-item">
              <div class="product-checkbox" v-if="!isDeleteMode">
                <el-checkbox 
                  v-model="product.selected" 
                  @change="handleMachineProductSelection"
                ></el-checkbox>
              </div>
              <div class="product-name">{{ product.name }}</div>
              <div class="product-stock">{{ product.stock }}</div>
              <div class="product-status">
                <el-tag :type="product.status === 'available' ? 'success' : 'danger'">
                  {{ product.status === 'available' ? '可用' : '不可用' }}
                </el-tag>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 商品详情弹窗 -->
    <el-dialog
      title="商品详情"
      v-model="productDetailVisible"
      width="500px">
      <el-form :model="currentProduct" label-width="100px" v-if="currentProduct">
        <el-form-item label="商品名称">
          <el-input v-model="currentProduct.name"></el-input>
        </el-form-item>
        <el-form-item label="价格">
          <el-input-number v-model="currentProduct.price" :precision="2" :step="0.1" :min="0"></el-input-number>
        </el-form-item>
        <el-form-item label="库存">
          <el-input-number v-model="currentProduct.stock" :min="0" :step="1"></el-input-number>
        </el-form-item>
        <el-form-item label="图片URL">
          <el-input v-model="currentProduct.image_url"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="productDetailVisible = false">取消</el-button>
          <el-button type="primary" @click="updateProductInfo">修改</el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 新建商品弹窗 -->
    <el-dialog
      title="新建商品"
      v-model="createProductVisible"
      width="500px">
      <el-form :model="newProduct" label-width="100px" :rules="productRules" ref="productFormRef">
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="newProduct.name"></el-input>
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input-number v-model="newProduct.price" :precision="2" :step="0.1" :min="0"></el-input-number>
        </el-form-item>
        <el-form-item label="库存" prop="stock">
          <el-input-number v-model="newProduct.stock" :min="0" :step="1"></el-input-number>
        </el-form-item>
        <el-form-item label="图片URL" prop="image_url">
          <el-input v-model="newProduct.image_url"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="createProductVisible = false">取消</el-button>
          <el-button type="primary" @click="createNewProduct">完成</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { fetchProducts, updateProduct, createProduct, deleteProduct, addProductsToMachine, removeProductsFromMachine } from '@/api/productManager'
import { getMachineProducts } from '@/api/product' // 使用更健壮的API实现
import type { Product, ApiResponse, ProductListResponse } from '@/types/product'

// 商品列表数据
const loading = ref(false)
const products = ref<Product[]>([])
const selectedProducts = ref<Product[]>([])
const hasSelectedProducts = computed(() => selectedProducts.value.length > 0)

// 商品排序 - 按名称字母顺序
const sortedProducts = computed(() => {
  return [...products.value].sort((a, b) => {
    return a.name.localeCompare(b.name, 'zh-CN')
  })
})

// 机器商品管理
const machineId = ref('')
const machineProducts = ref<Product[]>([])
const allMachineProductsSelected = ref(false)

// 控制全选框的部分选中状态
const isIndeterminateState = computed(() => {
  if (machineProducts.value.length === 0) return false
  
  const selectedCount = machineProducts.value.filter(product => product.selected).length
  return selectedCount > 0 && selectedCount < machineProducts.value.length
})
const machineProductsLoaded = ref(false)
const isDeleteMode = ref(false)
const productsToDelete = ref<number[]>([])

// 机器商品选择状态
const hasSelectedMachineProducts = computed(() => {
  return machineProducts.value.some(product => product.selected)
})

// 商品详情弹窗
const productDetailVisible = ref(false)
const currentProduct = ref<Product | null>(null)

// 新建商品弹窗
const createProductVisible = ref(false)
const productFormRef = ref<any>(null)
const newProduct = reactive<Product>({
  id: 0,
  name: '',
  price: 0,
  stock: 0,
  image_url: ''
})

// 表单验证规则
const productRules = {
  name: [
    { required: true, message: '请输入商品名称', trigger: 'blur' },
    { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
  ],
  price: [
    { required: true, message: '请输入价格', trigger: 'blur' }
  ],
  stock: [
    { required: true, message: '请输入库存', trigger: 'blur' }
  ],
  image_url: [
    { required: true, message: '请输入图片URL', trigger: 'blur' }
  ]
}

// 初始化加载商品列表
onMounted(async () => {
  await loadProducts()
})

// 获取所有商品
async function loadProducts() {
  loading.value = true
  try {
    const response = await fetchProducts()
    console.log('fetchdata', response);
    
    // 检查响应数据结构并正确赋值
    if (response.data) {
      // 如果response.data是数组，直接赋值
      if (Array.isArray(response.data)) {
        products.value = response.data
      } 
      // 如果response.data.data是数组，使用嵌套结构
      else if (response.data.data && Array.isArray(response.data.data)) {
        products.value = response.data.data
      }
      // 其他情况，尝试使用response.data
      else {
        products.value = Array.isArray(response.data) ? response.data : []
        console.warn('API返回的数据结构不符合预期，已进行适配处理')
      }
    } else {
      products.value = []
      console.error('API返回的数据为空')
    }
  } catch (error) {
    console.error('获取商品列表失败:', error)
    ElMessage.error('获取商品列表失败')
    products.value = []
  } finally {
    loading.value = false
  }
}

// 表格选择变化
function handleSelectionChange(selection: Product[]) {
  selectedProducts.value = selection
}

// 打开商品详情
function openProductDetail(product: Product) {
  currentProduct.value = { ...product }
  productDetailVisible.value = true
}

// 更新商品
async function updateProductInfo() {
  if (!currentProduct.value) return
  
  try {
    const response = await updateProduct(currentProduct.value.id, currentProduct.value)
    
    if (response.data.status === 'success') {
      ElMessage.success('商品更新成功')
      productDetailVisible.value = false
      await loadProducts()
      
      // 如果当前有查询机器商品，也需要刷新
      if (machineId.value) {
        await searchMachineProducts()
      }
    }
  } catch (error) {
    console.error('更新商品失败:', error)
    ElMessage.error('更新商品失败')
  }
}

// 打开创建商品弹窗
function openCreateProductDialog() {
  // 重置表单
  Object.assign(newProduct, {
    name: '',
    price: 0,
    stock: 0,
    image_url: ''
  })
  createProductVisible.value = true
}

// 创建商品
async function createNewProduct() {
  if (!productFormRef.value) return
  
  await productFormRef.value.validate(async (valid: boolean) => {
    if (!valid) return
    
    try {
      const response = await createProduct(newProduct)
      
      if (response.data.status === 'success') {
        ElMessage.success('商品创建成功')
        createProductVisible.value = false
        await loadProducts()
      }
    } catch (error) {
      console.error('创建商品失败:', error)
      ElMessage.error('创建商品失败')
    }
  })
}

// 删除选中的商品
async function deleteSelectedProducts() {
  if (selectedProducts.value.length === 0) return
  
  try {
    await ElMessageBox.confirm('确定要删除选中的商品吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    const deletePromises = selectedProducts.value.map(product => {
      return deleteProduct(product.id)
    })
    
    await Promise.all(deletePromises)
    ElMessage.success('商品删除成功')
    await loadProducts()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除商品失败:', error)
      ElMessage.error('删除商品失败')
    }
  }
}

// 查询机器商品
async function searchMachineProducts() {
  if (!machineId.value) {
    ElMessage.warning('请输入机器编号')
    return
  }
  
  try {
    const response = await getMachineProducts(machineId.value)
    console.log('Machine products response:', response)
    
    // 确保正确处理响应数据结构
    if (response && response.data) {
      if (Array.isArray(response.data)) {
        machineProducts.value = response.data.map(product => ({
          ...product,
          selected: false
        }))
      } else if (response.data.data && Array.isArray(response.data.data)) {
        machineProducts.value = response.data.data.map((product: Product) => ({
          ...product,
          selected: false
        }))
      } else {
        machineProducts.value = []
        console.error('API返回的数据结构不符合预期')
      }
    } else {
      machineProducts.value = []
      console.error('API返回的数据为空')
    }
    
    machineProductsLoaded.value = true
    // 重置删除模式和全选状态
    isDeleteMode.value = false
    productsToDelete.value = []
    allMachineProductsSelected.value = false
  } catch (error) {
    console.error('获取机器商品失败:', error)
    ElMessage.error('获取机器商品失败')
    machineProducts.value = []
    machineProductsLoaded.value = true
  }
}

// 添加商品到机器
async function addProductsToSelectedMachine() {
  if (selectedProducts.value.length === 0 || !machineId.value) {
    ElMessage.warning('请选择商品并输入机器编号')
    return
  }
  
  try {
    await addProductsToMachine(selectedProducts.value, machineId.value)
    ElMessage.success('商品添加到机器成功')
    await searchMachineProducts()
  } catch (error) {
    console.error('添加商品到机器失败:', error)
    ElMessage.error('添加商品到机器失败')
  }
}

// 处理机器商品选择变化
function handleMachineProductSelection() {
  // 这个函数会在每次复选框状态变化时调用
  // 更新全选框的部分选中状态
  const selectedCount = machineProducts.value.filter(product => product.selected).length
  
  // 只有当所有商品都被选中时，全选框才被勾选
  allMachineProductsSelected.value = machineProducts.value.length > 0 && 
                                    selectedCount === machineProducts.value.length
}

// 处理全选/取消全选
function handleSelectAllMachineProducts(val: boolean) {
  // 将所有商品的选中状态设置为全选框的状态
  machineProducts.value.forEach(product => {
    product.selected = val
  })
}

// 删除选中的机器商品
async function deleteMachineProducts() {
  const selectedProductIds = machineProducts.value
    .filter(product => product.selected)
    .map(product => product.id)
  
  if (selectedProductIds.length === 0) {
    ElMessage.warning('请选择要删除的商品')
    return
  }
  
  try {
    await ElMessageBox.confirm('确定要从机器中移除选中的商品吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    await removeProductsFromMachine(selectedProductIds, machineProducts.value)
    ElMessage.success('从机器中移除商品成功')
    await searchMachineProducts()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('从机器中移除商品失败:', error)
      ElMessage.error('从机器中移除商品失败')
    }
  }
}
</script>

<style scoped>
.product-manager {
  padding: 20px;
  height: 100%;
  background-color:#f5f5f5;
}

.page-title {
  margin-bottom: 20px;
  font-size: 24px;
  color: #303133;
}

.product-container {
  display: flex;
  gap: 20px;
  height: calc(100vh - 150px);
}

.product-list-section {
  flex: 3;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.machine-products-section {
  flex: 2;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #ebeef5;
}

.section-header h2 {
  margin: 0;
  font-size: 18px;
  color: #303133;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.product-list {
  flex: 1;
  overflow-y: auto;
}

.machine-search {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.machine-actions {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.machine-product-list {
  flex: 1;
  overflow-y: auto;
}

.machine-product-header {
  display: grid;
  grid-template-columns: 0.7fr 1.3fr 1fr 1fr;
  padding: 10px 15px;
  background-color: #f5f7fa;
  font-weight: bold;
  border-bottom: 2px solid #dcdfe6;
  align-items: center;
}

.machine-product-item {
  display: grid;
  grid-template-columns: 0.7fr 1.3fr 1fr 1fr;
  padding: 15px 15px;
  border-bottom: 1px solid #ebeef5;
  align-items: center;
}

.product-checkbox {
  display: flex;
  justify-content: center;
  align-items: center;
}

.header-checkbox {
  display: flex;
  justify-content: center;
}

.machine-product-item:last-child {
  border-bottom: none;
}

.machine-product-item:hover {
  background-color: #f5f7fa;
}

.product-name {
  /* font-weight: bold; */
  font-size: 16px;
  color: #606266;
  display: flex;
  align-items: center;
}

.product-stock {
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-name, .header-status {
  font-size: 14px;
  color: #606266;
  display: flex;
  align-items: center;
}

.header-stock {
  font-size: 14px;
  color: #606266;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-price {
  color: #f56c6c;
  font-weight: bold;
}

.product-stock {
  color: #909399;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-url-text {
  display: inline-block;
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
}

/* 响应式调整 */
@media (max-width: 1200px) {
  .product-container {
    flex-direction: column;
    height: auto;
  }
  
  .product-list-section,
  .machine-products-section {
    height: 500px;
  }
}
</style>