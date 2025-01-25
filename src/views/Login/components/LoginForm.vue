<template>
    <div class="login-title">
      <h2 class="title">自动售货机管理系统</h2>
    </div>
    
    <el-form >
      <el-form-item label="" prop="username" class="form-item">
        <el-input
          placeholder="请输入用户名"
          auto-complete="on"
          style="position: relative"
        >
        <template #prefix>
          <el-icon class="el-input__icon"><UserFilled /></el-icon>
        </template>
        </el-input>
      </el-form-item>
  
      <el-form-item label="" prop="password" class="form-item">
        <el-input
          placeholder="请输入密码"
          auto-complete="on"
        >
        <template #prefix>
          <el-icon class="el-input__icon"><GoodsFilled /></el-icon>
        </template>
        <template #suffix>
          <div class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </div>
        </template>

        </el-input>
      </el-form-item>
  
      <select class="xuanze">
        <option value="admin">超级管理员</option>
        <option value="user">商家管理员</option>
        <option value="user">补货员</option>
      </select>
  
      <el-form-item style="width: 100%">
        <el-button class="login-btn" type="primary">登录</el-button>
      </el-form-item>
      
    </el-form>
  </template>
  <script lang="ts" setup>
  import { ref } from 'vue'
import { UserFilled, GoodsFilled } from '@element-plus/icons-vue'

const username = ref('admin')
const passwordType = ref('password')
const password = ref('123456')
const role = ref('超级管理员')

function showPwd() {
    passwordType.value = passwordType.value === 'password' ? '' : 'password'
}
  </script>
  
  <style lang="scss" scoped>
    @import '../index.scss';
  </style>