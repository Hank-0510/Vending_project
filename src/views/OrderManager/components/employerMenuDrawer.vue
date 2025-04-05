<template>
    <div>
      <el-drawer v-model="dialogVisible" :title="title" size="50%">
        <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="120px">
         
          <el-form-item label="编号" prop="serialNumber">
  <el-input v-model="ruleForm.serialNumber" readonly />
</el-form-item>
          <el-form-item label="商家名称" prop="merchantName">
  <el-input v-model="ruleForm.merchantName" />
</el-form-item>
<el-form-item label="订单编号" prop="orderNumber">
  <el-input v-model="ruleForm.orderNumber" />
</el-form-item>
<el-form-item label="购买设备数量" prop="deviceQuantity">
  <el-input v-model="ruleForm.deviceQuantity" />
</el-form-item>
<el-form-item label="订单总价" prop="totalPrice">
  <el-input v-model="ruleForm.totalPrice" />
</el-form-item>
<el-form-item label="支付方式" prop="paymentMethod">
  <el-input v-model="ruleForm.paymentMethod" />
</el-form-item>
<el-form-item label="支付状态" prop="paymentStatus">
  <el-input v-model="ruleForm.paymentStatus" />
</el-form-item>
<el-form-item label="机器编号" prop="machineNumber">
  <el-input v-model="ruleForm.machineNumber" />
</el-form-item>
<el-form-item label="货物编号" prop="cargoNumber">
  <el-input v-model="ruleForm.cargoNumber" />
</el-form-item>

          
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="handleClose()">确定</el-button>
          </span>
        </template>
      </el-drawer>
    </div>
  </template>
  <script lang="ts" setup>
    import { defineEmits } from 'vue'
    const emit = defineEmits(['refresh'])
    import { reactive, ref } from 'vue'
    import { ElMessage } from 'element-plus'
    import type { FormInstance } from 'element-plus'
    import { updateOrder } from '@/api/orders'
    const ruleFormRef = ref<FormInstance>()
    const dialogVisible = ref()
    //表单校验规则
    const rules = reactive({
      roleName: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
      roleIdentification: [{ required: true, message: '请输入角色标识', trigger: 'blur' }],
    })
    const title = ref('新增菜单')
    const ruleForm: { [key: string]: string | boolean | number } = reactive({
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
  
    })

 


    const cascaderProps = {
      value: 'deviceCardNumber',
      label: 'deviceCardNumber',
      checkStrictly: true,
    }
  
    const show = (item = {}) => {

   

        if (Object.keys(item).length === 0) {
        // 清空表单数据，确保 "添加设备" 时为空
         title.value = '新增'
        Object.keys(ruleForm).forEach((key) => {
            ruleForm[key] = ''
        })
        } else {
        title.value = '编辑'
        // Object.keys(item).forEach((key) => {
        //     ruleForm[key] = item[key]
        // })
        Object.assign(ruleForm, item) // 直接拷贝已有数据
        }
    
      dialogVisible.value = true

    }

    const handleClose = async () => {
      await ruleFormRef.value?.validate(async (valid, fields) => {
        if (valid) {
          dialogVisible.value = false
          
          try {
            // 如果是编辑模式，调用API更新订单
            if (title.value === '编辑') {
              await updateOrder({
                id: ruleForm.id,
                // 转换前端字段到后端字段
                user_id: String(ruleForm.merchantName).replace('User ', ''), // 从 "User X" 提取用户ID
                machine_id: String(ruleForm.machineNumber).replace('MACH-', ''), // 从 "MACH-X" 提取机器ID
                product_id: String(ruleForm.cargoNumber).replace('PROD-', ''), // 从 "PROD-X" 提取产品ID
                quantity: Number(ruleForm.deviceQuantity),
                total_price: Number(ruleForm.totalPrice),
                status: ruleForm.paymentStatus
              });
              ElMessage.success('更新成功');
              // 通知父组件刷新数据
              emit('refresh');
            } else {
              // 新增功能暂不实现，因为API中没有提供
              ElMessage.warning('新增功能暂未实现');
            }
          } catch (error) {
            console.error('操作失败:', error);
            ElMessage.error('操作失败');
          }

          console.log('submit!');
        } else {
          console.log('error submit!', fields);
        }
      });
    }


  
    defineExpose({
      show,
    })
  </script>
  <style></style>
  