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
          <el-table-column class="table-child" prop="deviceNumber" label="设备编号" />
          <el-table-column class="table-child" prop="deviceModel" label="设备型号" />
          <el-table-column class="table-child" prop="deviceCardNumber" label="设备卡号" />
          <el-table-column class="table-child" prop="price" label="价格" />
          <el-table-column class="table-child" prop="commissionSharing" label="佣金分成" />
          <el-table-column class="table-child" prop="inventory" label="库存" />
          <el-table-column class="table-child" prop="boundQrCode" label="绑定二维码" />
          <el-table-column class="table-child" prop="deviceCapacity" label="设备容量" />
          <el-table-column class="table-child" prop="stockThreshold" label="缺货阈值" />
          <el-table-column class="table-child" prop="orderCode" label="下单码" />
          <el-table-column class="table-child" prop="boundPersonnel" label="绑定人员" />
          <el-table-column class="table-child" prop="enableStatus" label="启用状态" />
          <el-table-column class="table-child" prop="deviceAddress" label="设备地址" />
          <el-table-column class="table-child" prop="creationTime" label="创建时间" />
          <el-table-column class="table-child" prop="deviceRemark" label="备注框" />
          <el-table-column class="table-child" prop="advertisement" label="广告链接" />
          <el-table-column class="table-child" prop="dispensingButton" label="出货按钮" />
          <el-table-column class="table-child" prop="status" label="操作">
            <template #default="scope">
              <el-button type="primary" size="small" icon="Edit" @click="edit(scope.row)"> 编辑 </el-button>
              <el-button type="danger" size="small" icon="Delete" @click="del(scope.row)"> 删除 </el-button>
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
  </div>
</template>
<!--设备管理-->
<script lang="ts" setup name="DeviceManager">
  import { ElMessageBox,ElMessage } from 'element-plus'
  import type { FormInstance } from 'element-plus'
import { ref, reactive } from 'vue'
import { Search } from '@element-plus/icons-vue'
import MenuDrawer from './components/MenuDrawer.vue'
import { deviceData } from '@/mock/deviceData.ts'
//表单数据来自mock
const tableData = ref(deviceData)
const menuDrawer = ref()
const menuDrawerRef = ref()
// const formInline = reactive({})
const ruleFormRef = ref<FormInstance>()
// const reset = (formEl: FormInstance | undefined) => {}

interface FormInline {
  deviceNumber: string;
  deviceModel: string;
  deviceCardNumber: string;
  deviceAddress: string;
  deviceRemark: string;
}

const formInline = reactive<FormInline>({
  deviceNumber: '',
  deviceModel: '',
  deviceCardNumber: '',
  deviceAddress: '',
  deviceRemark: ''
});

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
  tableData.value = deviceData;
};


const onSearch = () => {
  console.log('submit!', formInline);

  // 使用过滤条件筛选数据
  tableData.value = deviceData.filter(item => 
    // 判断各个输入框是否填写了内容，只有填写了内容的条件才进行匹配
    (!formInline.deviceNumber || item.deviceNumber.includes(formInline.deviceNumber)) &&
    (!formInline.deviceModel || item.deviceModel.includes(formInline.deviceModel)) &&
    (!formInline.deviceCardNumber || item.deviceCardNumber.includes(formInline.deviceCardNumber)) &&
    (!formInline.deviceAddress || item.deviceAddress.includes(formInline.deviceAddress)) &&
    (!formInline.deviceRemark || item.deviceRemark.includes(formInline.deviceRemark))
  );
};

  const add = () => {
    menuDrawerRef.value.show()
  }

  const edit = (row) => {
    menuDrawerRef.value.show(row)
    if (!row) {
    console.error('Row data is missing');
    return;
  }
    
  }

  const del = (row: any) => {
  // 确认删除操作
  ElMessageBox.confirm('你确定要删除当前项吗?', '温馨提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    draggable: true,
  })
    .then(() => {
      // 找到要删除的记录的索引
      const index = tableData.value.findIndex(item => item.id === row.id);
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
  .util {
    margin-bottom: 15px;
    display: flex;
    justify-content: flex-end;
    flex-shrink: 0;
  }
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
