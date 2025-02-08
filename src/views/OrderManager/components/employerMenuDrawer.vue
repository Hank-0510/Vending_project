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
    import { reactive, ref } from 'vue'
    import { ElMessage } from 'element-plus'
    import type { FormInstance } from 'element-plus'
    import { orderEmployerData } from '@/mock/orderEmployerData'
    const tableData = ref(orderEmployerData)
    const ruleFormRef = ref<FormInstance>()
    const dialogVisible = ref()
    //表单校验规则
    const rules = reactive({
      roleName: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
      roleIdentification: [{ required: true, message: '请输入角色标识', trigger: 'blur' }],
    })
    const title = ref('新增菜单')
    const ruleForm = reactive({
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

    const handleClose = async (done: () => void) => {
      await ruleFormRef.value.validate((valid, fields) => {
        if (valid) {
            const newDevice = { ...ruleForm } // 复制当前表单数据

         // 获取当前时间，格式化为 "yyyy-MM-dd HH:mm:ss"
         const currentTime = new Date().toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
             hour: '2-digit',
           minute: '2-digit',
           second: '2-digit',
           hour12: false, // 24小时制
         }).replace(/\//g, '-').replace(',', ''); // 将日期格式调整为 "yyyy-MM-dd HH:mm:ss"
         newDevice.creationTime = currentTime; 

            const lateobj={
              boundQrCode: '',
              orderCode: '',
              boundPersonnel: '',
              deviceAddress: '',
              creationTime: currentTime,
              remarks: '',
              dispensingButton: '',
              status: ''
            }
            if (title.value === '新增菜单') {
        tableData.value.unshift(newDevice) // 直接插入到表格数据
        ElMessage.success('添加成功')
      }else if (title.value === '编辑') {
        // 编辑设备时，根据 deviceNumber 更新对应设备
        const index = tableData.value.findIndex(device => device.serialNumber === newDevice.serialNumber)
        if (index !== -1) {
          tableData.value[index] = newDevice // 更新对应的设备
          ElMessage.success('编辑成功')
        } 
        else {
          ElMessage.error('编辑错误')
        }
      }


          
          dialogVisible.value = false

            console.log('submit!')



        } else {
          console.log('error submit!', fields)
        }
      })
    }


  
    defineExpose({
      show,
    })
  </script>
  <style></style>
  