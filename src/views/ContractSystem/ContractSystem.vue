<template>
  <div class="app-container">
    <div class="header">
      <el-form ref="ruleFormRef" :inline="true" :model="formInline">
       
        <!-- 搜索处 -->
        <div class="fiveSerach">
         
          <el-input class="space input-field" v-model="formInline.contractSearch" placeholder="请输入搜索内容" />
          <el-form-item class="operation">
            <el-button type="primary" @click="onSearch">查询</el-button>
            <el-button @click="reset(ruleFormRef)">重置</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="footer">
      <!-- <i>每个合同是通过按钮点击查看的还是第三列的合同名称设计跳转，将合同放到服务器吗？</i>

      <i>哒哒</i> -->
      <div class="table-wrap">
        <el-table :data="tableData" style="width: 100%" border row-key="id" class="table" empty-text="无对应内容">
          <el-table-column class="table-child" prop="serialNumber" label="编号" />
          <el-table-column class="table-child" prop="contractNumber" label="合同编号" />
          <el-table-column class="table-child" prop="contractContent" label="合同具体内容(PDF)" />
          <el-table-column class="table-child" prop="contractParties" label="合同签订方" />
          <el-table-column class="table-child" prop="contractSigningDate" label="合同签订日期" />
          <el-table-column class="table-child" prop="contractExpiryDate" label="合同截至日期" />
          <el-table-column class="table-child" prop="creationTime" label="创建时间" />
          <el-table-column class="table-child" prop="status" label="操作">
            <template #default="scope">
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
<script lang="ts" setup  >
  import { ElMessageBox,ElMessage } from 'element-plus'
  import type { FormInstance } from 'element-plus'
import { ref, reactive } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { ContractData } from '@/mock/ContractData.ts'
//表单数据来自mock
const tableData = ref(ContractData)
const menuDrawer = ref()
const menuDrawerRef = ref()
// const formInline = reactive({})
const ruleFormRef = ref<FormInstance>()
// const reset = (formEl: FormInstance | undefined) => {}

interface FormInline {
  serialNumber:string
contractNumber:string
contractContent:string
contractParties:string
contractSigningDate:string
contractExpiryDate:string
creationTime:string
contractSearch:string
 
}

const formInline = reactive<FormInline>({
  serialNumber:'',
contractNumber:'',
contractContent:'',
contractParties:'',
contractSigningDate:'',
contractExpiryDate:'',
creationTime:'',
contractSearch:''

});

const reset = (formEl: FormInstance | undefined) => {
  // 重置表单数据
  formInline.contractSearch = '';
 

  // 如果有表单实例对象，也可以调用表单的resetFields方法
  if (formEl) {
    formEl.resetFields();
  }

  // 重置table数据为初始数据
  tableData.value = ContractData;
};


const onSearch = () => {
  console.log('submit!', formInline);

  const searchValue = formInline.contractSearch.trim().toLowerCase();
  tableData.value = ContractData.filter(item => 
    // 判断输入框是否为空，且在表单的任何数据项中找到匹配
    [item.serialNumber, item.contractNumber, item.contractContent, item.contractParties, item.contractSigningDate, item.contractExpiryDate, item.creationTime]
      .some(field => field && typeof field === 'string' && field.toLowerCase().includes(searchValue))
  );
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
.app-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
}

.header {
  width: 100%;
  padding: 16px;
  border-radius: 4px;
  background: rgb(20, 202, 235);
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
  background: white;
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
