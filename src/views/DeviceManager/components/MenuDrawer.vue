<template>
    <div>
      <el-drawer v-model="dialogVisible" :title="title" size="50%">
        <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="120px">
         
          <el-form-item label="编号" prop="menuName">
    <el-input v-model="ruleForm.deviceNumber" placeholder="请输入设备编号" />
  </el-form-item>
  <el-form-item label="设备型号" prop="menuName">
    <el-input v-model="ruleForm.deviceModel" placeholder="请输入设备型号" />
  </el-form-item>
  <el-form-item label="设备卡号" prop="menuName">
    <el-input v-model="ruleForm.deviceCardNumber" placeholder="请输入设备卡号" />
  </el-form-item>
  
  <el-form-item label="设备容量" prop="deviceCapacity">
    <el-input v-model="ruleForm.deviceCapacity" placeholder="请输入设备容量" />
  </el-form-item>
  <el-form-item label="库存" prop="inventory">
    <el-input v-model="ruleForm.inventory" placeholder="请输入库存" />
  </el-form-item>
  <el-form-item label="缺货阈值" prop="stockThreshold">
    <el-input v-model="ruleForm.stockThreshold" placeholder="请输入缺货阈值" />
  </el-form-item>
  <el-form-item label="佣金分成" prop="commissionSharing">
    <el-input v-model="ruleForm.commissionSharing" placeholder="请输入佣金分成" />
  </el-form-item>
  <el-form-item label="价格" prop="price">
    <el-input v-model="ruleForm.price" placeholder="请输入价格" />
  </el-form-item>
  <el-form-item label="广告链接" prop="advertisement">
    <el-input v-model="ruleForm.advertisement" placeholder="请输入广告链接" />
  </el-form-item>
  <el-form-item label="启用状态" prop="enableStatus">
    <el-input v-model="ruleForm.enableStatus" placeholder="请输入启用状态" />
  </el-form-item>

  <!-- new -->
  <el-form-item label="绑定二维码" prop="boundQrCode">
      <el-input v-model="ruleForm.boundQrCode" placeholder="请输入绑定二维码" />
    </el-form-item>
    <el-form-item label="下单码" prop="orderCode">
      <el-input v-model="ruleForm.orderCode" placeholder="请输入下单码" />
    </el-form-item>
    <el-form-item label="绑定人员" prop="boundPersonnel">
      <el-input v-model="ruleForm.boundPersonnel" placeholder="请输入绑定人员" />
    </el-form-item>
    <el-form-item label="设备地址" prop="deviceAddress">
      <el-input v-model="ruleForm.deviceAddress" placeholder="请输入设备地址" />
    </el-form-item>
    
    <el-form-item label="备注" prop="deviceRemark">
      <el-input v-model="ruleForm.deviceRemark" placeholder="请输入设备备注" />
    </el-form-item>
          
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="handleClose(() => {})">确定</el-button>
          </span>
        </template>
      </el-drawer>
    </div>
  </template>
  <script lang="ts" setup>
    import { reactive, ref } from 'vue'
    import { ElMessage } from 'element-plus'
    import type { FormInstance } from 'element-plus'
    import { deviceData } from '@/mock/deviceData'
    const tableData = ref(deviceData)
    const ruleFormRef = ref<FormInstance>()
    const dialogVisible = ref()
    //表单校验规则
    const rules = reactive({
      roleName: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
      roleIdentification: [{ required: true, message: '请输入角色标识', trigger: 'blur' }],
    })
    const title = ref('新增菜单')
    const ruleForm: { [key: string]: string | boolean | number } = reactive({
        deviceNumber: '',
    deviceModel: '',
    deviceCardNumber: '',
    deviceCapacity: '',
    inventory: '',
    stockThreshold: '',
    commissionSharing: '',
    price: '',
    advertisement: '',
    enableStatus: true, // 默认启用
    boundQrCode: '',
    orderCode: '',
    boundPersonnel: '',
    deviceAddress: '',
    deviceRemark: '',
    creationTime: ''
  
    })

 


    const cascaderProps = {
      value: 'deviceCardNumber',
      label: 'deviceCardNumber',
      checkStrictly: true,
    }
  
    const show = (item = {}) => {

   

        if (Object.keys(item).length === 0) {
        // 清空表单数据，确保 "添加设备" 时为空
         title.value = '新增菜单'
        Object.keys(ruleForm).forEach((key) => {
            ruleForm[key] = ''
        })
        } else {
        title.value = '编辑菜单'
        // Object.keys(item).forEach((key) => {
        //     ruleForm[key] = item[key]
        // })
        Object.assign(ruleForm, item) // 直接拷贝已有数据
        }
    
      dialogVisible.value = true

    }

    const handleClose = async (done: () => void) => {
      await ruleFormRef.value?.validate((valid, fields) => {
        if (valid) {
            const newDevice = { ...ruleForm } as typeof tableData.value[0]; // Ensure correct type

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
      }else if (title.value === '编辑菜单') {
        // 编辑设备时，根据 deviceNumber 更新对应设备
        const index = tableData.value.findIndex(device => device.deviceNumber === newDevice.deviceNumber)
        if (index !== -1) {
          tableData.value[index] = newDevice as typeof tableData.value[0]; // 确保类型匹配
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
  