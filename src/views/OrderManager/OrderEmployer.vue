<template>
  <div class="app-container">
    <div class="header">
      <el-form ref="ruleFormRef" :inline="true" :model="formInline">
       
        <!-- 搜索处 -->
        <div class="fiveSerach">
         
          <el-input class="space input-field" v-model="formInline.orderSearch" placeholder="请输入搜索内容" />
          <el-form-item class="operation">
            <el-button type="primary" @click="onSearch">查询</el-button>
            <el-button @click="reset(ruleFormRef)">重置</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="footer">
      <div class="table-wrap">
        <el-table :data="tableData" style="width: 100%" border row-key="id" class="table" empty-text="无对应内容">
          <el-table-column class="table-child" prop="serialNumber" label="编号" />
          <el-table-column class="table-child" prop="merchantName" label="商家名称" />
          <el-table-column class="table-child" prop="orderNumber" label="订单编号" />
          <el-table-column class="table-child" prop="deviceQuantity" label="购买设备数量" width="110px"/>
          <el-table-column class="table-child" prop="totalPrice" label="订单总价" />
          <el-table-column class="table-child" prop="paymentMethod" label="支付方式" />
          <el-table-column class="table-child" prop="paymentStatus" label="支付状态" />
          <el-table-column class="table-child" prop="machineNumber" label="机器编号" />
          <el-table-column class="table-child" prop="cargoNumber" label="货物编号" />
          <el-table-column class="table-child" prop="updateTime" label="更新时间" />
          <el-table-column class="table-child" prop="creationTime" label="创建时间" />


          <el-table-column class="table-child" prop="status" label="操作" width="190px">
            <template #default="scope">
              <el-button type="primary" size="small" icon="Edit" @click="edit(scope.row)"> 编辑 </el-button>
              <el-button type="danger" size="small" icon="Delete" @click="del(scope.row)"> 删除 </el-button>
            </template>
          </el-table-column>
        
        </el-table>
      </div>
    </div>
    <MenuDrawer ref="menuDrawerRef" @refresh="fetchData" />
  </div>
</template>
<!--设备管理-->
<script lang="ts" setup name="orderEmployee" >
  import { ElMessageBox,ElMessage } from 'element-plus'
  import type { FormInstance } from 'element-plus'
import { ref, reactive, onMounted } from 'vue'
import { Search } from '@element-plus/icons-vue'
import MenuDrawer from './components/employerMenuDrawer.vue'
import { getSuperAdminOrders, deleteOrder, updateOrder } from '@/api/orders'
//表单数据来自API
const tableData = ref([])
const menuDrawer = ref()
const menuDrawerRef = ref()
// const formInline = reactive({})
const ruleFormRef = ref<FormInstance>()

// 获取订单数据
const fetchData = async () => {
  try {
    const response = await getSuperAdminOrders();
    if (response.status === 'success') {
      tableData.value = response.data;
    } else {
      ElMessage.error(response.message || '获取订单列表失败');
    }
  } catch (error) {
    console.error('获取订单列表失败:', error);
    ElMessage.error('获取订单列表失败');
  }
}

interface FormInline {
  serialNumber: string;
merchantName: string;
orderNumber: string;
deviceQuantity: string;
totalPrice: string;
paymentMethod: string;
paymentStatus: string;
updateTime: string;
machineNumber: string;
cargoNumber: string;
creationTime: string;
orderSearch:string
 
}

const formInline = reactive<FormInline>({
  serialNumber: '',
merchantName: '',
orderNumber: '',
deviceQuantity: '',
totalPrice: '',
paymentMethod: '',
paymentStatus: '',
updateTime: '',
machineNumber: '',
cargoNumber: '',
creationTime: '',
orderSearch:''

});

const reset = (formEl: FormInstance | undefined) => {
  // 重置表单数据
  formInline.orderSearch = '';
 

  // 如果有表单实例对象，也可以调用表单的resetFields方法
  if (formEl) {
    formEl.resetFields();
  }

  // 重置table数据为初始数据并重新获取数据
  fetchData();
};


const onSearch = () => {
  console.log('submit!', formInline);

  // 如果搜索框为空，则获取所有数据
  if (!formInline.orderSearch.trim()) {
    fetchData();
    return;
  }

  // 如果有搜索内容，则在已获取的数据中筛选
  const searchValue = formInline.orderSearch.trim().toLowerCase();
  tableData.value = tableData.value.filter(item => 
    // 判断输入框是否为空，且在表单的任何数据项中找到匹配
    [item.serialNumber, item.merchantName, item.orderNumber, 
     String(item.deviceQuantity), String(item.totalPrice), 
     item.paymentMethod, item.paymentStatus, item.machineNumber, item.cargoNumber]
      .some(field => field && String(field).toLowerCase().includes(searchValue))
  );
};

 

  const edit = (row: any) => {
    // 打开编辑抽屉
    menuDrawerRef.value.show(row)
    if (!row) {
      console.error('Row data is missing');
      return;
    }
  }

  const del = (row: any) => {
  // 确认删除操作
  console.log('删除的 row:', row); // 确保 row 传递正确
  ElMessageBox.confirm('你确定要删除当前项吗?', '温馨提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    draggable: true,
  })
    .then(async () => {
      try {
        // 调用API删除订单
        await deleteOrder(row.id);
        // 显示删除成功提示
        ElMessage.success('删除成功');
        // 重新获取数据
        fetchData();
      } catch (error) {
        console.error('删除订单失败:', error);
        ElMessage.error('删除失败');
      }
    })
    .catch(() => {
      // 用户取消删除操作时的处理
      ElMessage.info('取消删除');
    });
};

// 页面加载时获取数据
onMounted(() => {
  fetchData();
});


</script>

<style scoped lang="scss">
.app-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  background-color: #f5f5f5;
}

.header {
  width: 97%;
  padding: 16px;
  border-radius: 4px;
  background: #bb2649;
  box-shadow: 0 0 12px rgb(0 0 0 / 5%);
  margin-bottom: 16px;
  
  .fiveSerach {
    display: flex;
    align-items: center;
    width: 100%;
    
    .space {
      flex: 1;
    }
    
    .input-field {
      max-width: 500px;
      margin-right: 16px;
    }
    
    .operation {
      display: flex;
      gap: 8px;
    }
  }
}

.footer {
  flex: 1;
  display: flex;
  padding: 16px;
  flex-direction: column;
  border-radius: 4px;
  overflow: hidden;
  background-color: #f5f5f5;
  box-shadow: 0 0 12px rgb(0 0 0 / 5%);
  position: relative;
  box-sizing: border-box;
  
  .table-wrap {
    width: 100%;
    overflow-x: auto; /* Enable horizontal scrolling */
    max-height: calc(100vh - 150px); /* Adjust table height to fill available space */
    .table {
      width: 100%;
      min-width: 1200px; /* Ensure the table has a minimum width to trigger horizontal scrolling */
      table-layout: auto; /* Allow dynamic width adjustment */
    }
  }
  
  .table-inner {
    width: 100%;
    height: 100%;
    position: relative;
  }
  
  .table {
    position: relative;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    
    .table-child {
      min-width: 120px;
    }
  }
}
</style>
