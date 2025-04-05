<template>
  <div class="app-container">
    <div class="header">
      <el-form ref="ruleFormRef" :inline="true" :model="formInline">
        <div class="util">
          <el-button type="primary" @click="add">
            添加设备
          </el-button>
        </div>
        <!-- 搜索处 -->
        <div class="fiveSerach">
          <el-input class="space input-field" v-model="formInline.deviceNumber" placeholder="请输入设备编号" />
          <el-input class="space input-field" v-model="formInline.deviceModel" placeholder="请输入设备型号" />
          <el-input class="space input-field" v-model="formInline.deviceCardNumber" placeholder="请输入设备卡号" />
          <el-input class="space input-field" v-model="formInline.deviceAddress" placeholder="请输入设备地址" />
          <el-input class="space input-field" v-model="formInline.deviceRemark" placeholder="请输入设备备注" />
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
          <el-table-column class="table-child" prop="deviceNumber" label="设备编号" width="90px"/>
          <el-table-column class="table-child" prop="deviceModel" label="设备型号"  width="90px"/>
          <el-table-column class="table-child" prop="deviceCardNumber" label="设备卡号" width="90px" />
          <el-table-column class="table-child" prop="price" label="价格" />
          <el-table-column class="table-child" prop="commissionSharing" label="佣金分成"  width="90px"/>
          <el-table-column class="table-child" prop="inventory" label="库存" />
          <el-table-column class="table-child" prop="boundQrCode" label="绑定二维码" width="110px"/>
          <el-table-column class="table-child" prop="deviceCapacity" label="设备容量"width="90px" />
          <el-table-column class="table-child" prop="stockThreshold" label="缺货阈值"  width="90px"/>
          <el-table-column class="table-child" prop="orderCode" label="下单码" />
          <el-table-column class="table-child" prop="admin_username" label="绑定人员" width="90px"/>
          <el-table-column class="table-child" prop="enableStatus" label="启用状态" width="90px"/>
          <el-table-column class="table-child" prop="deviceAddress" label="设备地址" width="90px"/>
          <el-table-column class="table-child" prop="creationTime" label="创建时间" width="90px"/>
          <el-table-column class="table-child" prop="deviceRemark" label="备注框" />
          <el-table-column class="table-child" prop="advertisement" label="广告链接" width="90px"/>
          <el-table-column class="table-child" prop="dispensingButton" label="出货按钮" width="90px"/>
          <el-table-column class="table-child" prop="status" label="操作" width="190px">
            <template #default="scope">
              <el-button type="primary" size="small" icon="Edit" @click="edit(scope.row)"> 编辑 </el-button>
              <el-button type="danger" size="small" icon="Delete" @click="del(scope.row)"> 删除 </el-button>
            </template>
          </el-table-column>
          <el-table-column prop="commodity" label="商品详情">
            <template #default="scope">
              <el-button type="primary" size="small" icon="Edit" @click="showProductDialog(scope.row)"> 查看 </el-button>
            </template>
          </el-table-column>
          <el-table-column prop="costAllocation" label="分账管理">
            <template #default="scope">
              <el-button type="primary" size="small" icon="Edit"> 进入 </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <MenuDrawer ref="menuDrawerRef" />
    <ProductDialog ref="productDialogRef" :machine-id="currentMachineId" />
  </div>
</template>
<!--设备管理-->
<script lang="ts" setup name="DeviceManager">
  import { ElMessageBox,ElMessage } from 'element-plus'
  import type { FormInstance } from 'element-plus'
import { ref, reactive, onMounted } from 'vue'
import { Search } from '@element-plus/icons-vue'
import MenuDrawer from './components/MenuDrawer.vue'
import ProductDialog from './components/ProductDialog.vue'
// import { deviceData } from '@/mock/deviceData.ts'
import { getDeviceList, addDevice, updateDevice, deleteDevice } from '@/api/device'
//import type internal from 'stream'

//表单数据来自mock
// const tableData = ref(deviceData)
interface DeviceData {
  id: number;
  deviceNumber: string;
  deviceModel: string;
  deviceCardNumber: string;
  deviceAddress: string;
  deviceRemark: string;
  price?: number;
  commissionSharing?: string;
  inventory?: number;
  boundQrCode?: string;
  deviceCapacity?: number;
  stockThreshold?: number;
  orderCode?: string;
  boundPersonnel?: string;
  enableStatus: string;
  creationTime?: string;
  advertisement?: string;
  dispensingButton?: string;
}

const tableData = ref<DeviceData[]>([])
const menuDrawer = ref()
const menuDrawerRef = ref()
const productDialogRef = ref()
const currentMachineId = ref(0)
// const formInline = reactive({})
const ruleFormRef = ref<FormInstance>()
// const reset = (formEl: FormInstance | undefined) => {}

interface FormInline {
  deviceNumber: string;
  deviceModel: string;
  deviceCardNumber: string;
  commissionSharing:string;


  deviceAddress: string;
  inventory: string;

  deviceRemark: string;
}

const formInline = reactive<FormInline>({
  deviceNumber: '',
  deviceModel: '',
  deviceCardNumber: '',
  commissionSharing:'',
  inventory:'',
  deviceAddress: '',
  deviceRemark: ''
});
// 捕获数据
const fetchData = async () => {
  try {
    const { data } = await getDeviceList(formInline)
    tableData.value = data as DeviceData[]
  } catch (error) {
    console.error('获取设备列表失败', error)
  }
}

const reset = (formEl: FormInstance | undefined) => {
  // 重置表单数据
  formInline.deviceNumber = '';
  formInline.deviceModel = '';
  formInline.deviceCardNumber = '';
  formInline.deviceAddress = '';
  formInline.deviceRemark = '';

  // 如果有表单实例对象，也可以调用表单的resetFields方法
  if (formEl) {
    formEl.resetFields();
  }

  // 重置table数据为初始数据
  // tableData.value = deviceData;
  fetchData();
};


const onSearch = () => {
  // console.log('submit!', formInline);
  fetchData();

  // // 使用过滤条件筛选数据
  // tableData.value = deviceData.filter(item => 
  //   // 判断各个输入框是否填写了内容，只有填写了内容的条件才进行匹配
  //   (!formInline.deviceNumber || item.deviceNumber.includes(formInline.deviceNumber)) &&
  //   (!formInline.deviceModel || item.deviceModel.includes(formInline.deviceModel)) &&
  //   (!formInline.deviceCardNumber || item.deviceCardNumber.includes(formInline.deviceCardNumber)) &&
  //   (!formInline.deviceAddress || item.deviceAddress.includes(formInline.deviceAddress)) &&
  //   (!formInline.deviceRemark || item.deviceRemark.includes(formInline.deviceRemark))
  // );
};

  // const add = () => {
  //   menuDrawerRef.value.show()
  // }
  const add = async () => {
  try {
    await addDevice(formInline)
    ElMessage.success('设备添加成功')
    fetchData()
  } catch (error) {
    console.error('添加设备失败', error)
  }
}


//   const edit = (row: any) => {
//   menuDrawerRef.value.show(row)
//   if (!row) {
//   console.error('Row data is missing');
//   return;
// }
  
// }
const edit = async (row: any) => {
  try {
    await updateDevice(row)
    ElMessage.success('设备修改成功')
    fetchData()
  } catch (error) {
    console.error('修改设备失败', error)
  }
}



//   const del = (row: any) => {
//   // 确认删除操作
//   ElMessageBox.confirm('你确定要删除当前项吗?', '温馨提示', {
//     confirmButtonText: '确定',
//     cancelButtonText: '取消',
//     type: 'warning',
//     draggable: true,
//   })
//     .then(() => {
//       // 找到要删除的记录的索引
//       const index = tableData.value.findIndex(item => item.id === row.id);
//       if (index !== -1) {
//         // 删除选中的记录
//         tableData.value.splice(index, 1);
//         // 显示删除成功提示
//         ElMessage.success('删除成功');
//       }
//     })
//     .catch(() => {
//       // 用户取消删除操作时的处理
//       ElMessage.info('取消删除');
//     });
// };

const del = async (row: any) => {
  ElMessageBox.confirm('你确定要删除当前项吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      try {
        await deleteDevice(row.id)
        ElMessage.success('删除成功')
        fetchData()
      } catch (error) {
        console.error('删除设备失败', error)
      }
    })
    .catch(() => {
      ElMessage.info('取消删除')
    })
}

// 显示商品管理弹窗
const showProductDialog = (row: any) => {
  if (row && row.id) {
    currentMachineId.value = row.id
    productDialogRef.value.show()
  } else {
    ElMessage.warning('设备ID不存在')
  }
}

// 页面加载时获取数据
onMounted(() => {
  fetchData()
})

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
  width: 98%;
  padding: 10px ;
  border-radius: 4px;
  background:#bb2649;
  box-shadow: 0 0 12px rgb(0 0 0 / 5%);
  margin-bottom: 10px;
  
  .util {
    margin-bottom: 10px;
  }
  
  .fiveSerach {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    width: 100%;
    
    .space {
      flex: 1;
      margin-right: 10px;
      margin-bottom: 10px;
      min-width: 200px;
    }
    
    .input-field {
      height: 50%;
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
  padding: 10px;
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
    max-height: calc(100vh - 220px); /* Adjust table height to fill available space, accounting for larger header */
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
