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
            <el-table-column class="table-child" prop="merchantName" label="用户名称" />
            <el-table-column class="table-child" prop="orderNumber" label="订单编号" />
            <el-table-column class="table-child" prop="deviceQuantity" label="购买设备数量" />
            <el-table-column class="table-child" prop="totalPrice" label="订单总价" />
            <el-table-column class="table-child" prop="paymentMethod" label="支付方式" />
            <el-table-column class="table-child" prop="paymentStatus" label="支付状态" />
            <el-table-column class="table-child" prop="machineNumber" label="机器编号" />
            <el-table-column class="table-child" prop="cargoNumber" label="货物编号" />
        
            <el-table-column class="table-child" prop="updateTime" label="更新时间" />
            <el-table-column class="table-child" prop="creationTime" label="创建时间" />
  
  
            <el-table-column class="table-child" prop="status" label="操作">
              <template #default="scope">
                <el-button type="primary" size="small" icon="Edit" @click="edit(scope.row)"> 编辑 </el-button>
                <el-button type="danger" size="small" icon="Delete" @click="del(scope.row)"> 删除 </el-button>
              </template>
            </el-table-column>
          
          </el-table>
        </div>
      </div>
      <MenuDrawer ref="menuDrawerRef" />
    </div>
  </template>
  <!--设备管理-->
  <script lang="ts" setup name="orderEmployee" >
    import { ElMessageBox,ElMessage } from 'element-plus'
    import type { FormInstance } from 'element-plus'
  import { ref, reactive } from 'vue'
  import { Search } from '@element-plus/icons-vue'
  import MenuDrawer from './components/employerMenuDrawer.vue'
  import { orderUserData } from '@/mock/orderUserData.ts'
  //表单数据来自mock
  const tableData = ref(orderUserData)
  const menuDrawer = ref()
  const menuDrawerRef = ref()
  // const formInline = reactive({})
  const ruleFormRef = ref<FormInstance>()
  // const reset = (formEl: FormInstance | undefined) => {}
  
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
  
    // 重置table数据为初始数据
    tableData.value = orderEmployerData;
  };
  
  
  const onSearch = () => {
    console.log('submit!', formInline);
  
    // // 使用过滤条件筛选数据
    // tableData.value = orderEmployerData.filter(item => 
    //   // 判断各个输入框是否填写了内容，只有填写了内容的条件才进行匹配
    //   (!formInline.orderSearch || item.deviceNumber.includes(formInline.deviceNumber)) &&
    //   (!formInline.deviceModel || item.deviceModel.includes(formInline.deviceModel)) &&
    //   (!formInline.deviceCardNumber || item.deviceCardNumber.includes(formInline.deviceCardNumber)) &&
    //   (!formInline.deviceAddress || item.deviceAddress.includes(formInline.deviceAddress)) &&
    //   (!formInline.deviceRemark || item.deviceRemark.includes(formInline.deviceRemark))
    // );
    const searchValue = formInline.orderSearch.trim().toLowerCase();
    tableData.value = orderEmployerData.filter(item => 
      // 判断输入框是否为空，且在表单的任何数据项中找到匹配
      [item.serialNumber, item.merchantName, item.orderNumber, item.deviceQuantity,item.totalPrice,item.paymentMethod,item.machineNumber,item.cargoNumber]
        .some(field => field && field.toLowerCase().includes(searchValue))
    );
  
  };
  
   
  
    const edit = (row) => {
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
      .then(() => {
        // 找到要删除的记录的索引
        const index = tableData.value.findIndex(item => item.serialNumber  === row.serialNumber );
        console.log('找到的索引:', index); // 确保 index 不是 0 或 -1（如果不是首行）
  
        if (index !== -1) {
          // 删除选中的记录
          tableData.value.splice(index, 1);
          // 显示删除成功提示
          ElMessage.success('删除成功');
        }
      })
      .catch(() => {
        // 用户取消删除操作时的处理
        ElMessage.info('取消删除');
      });
  };
  
  
  </script>
  
  <style scoped lang="scss">
  .header {
    display: flex;
    padding: 16px 16px 0px 16px;
    // margin-bottom: 16px;
    border-radius: 4px;
    flex-shrink: 0; /* Prevent header from shrinking */
    position: sticky;
  
    background: rgb(20, 202, 235);
    box-shadow: 0 0 12px rgb(0 0 0 / 5%);
    .fiveSerach {
      display: flex;
      margin-top: 1%;
      justify-content: space-evenly;
      .space {
        // padding-left: 10%;
        justify-content: space-evenly;
      }
      .input-field {
        flex: 1; /* 使每个输入框可以扩展并均匀分布 */
        height: 50%;
        margin: 0 5px; /* 给每个输入框之间添加5px的间距 */
        min-width: 200px; /* 设置最小宽度，防止输入框过小 */
      }
      .operation {
        margin-left: 1%;
        width: 200px;
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
    background: white;
    box-shadow: 0 0 12px rgb(0 0 0 / 5%);
    position: relative;
    box-sizing: border-box;
    
    .table-wrap {
      width: 100%;
      overflow-x: auto; /* Enable horizontal scrolling */
      max-height: 500px; /* Set the maximum height for the table container */
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
        min-width: 300px;
      }
    }
  }
  </style>
  