<template>
    <!-- 顶部导航栏 -->
    <header class="app-header">
      <el-row class="navbar" type="flex">
        <!-- 左侧功能区 -->
        <el-col :span="12" class="nav-left">
          <h2 class="brand">智能售货机管理系统</h2>
        </el-col>
  
        <!-- 右侧功能区 -->
        <el-col :span="12" class="nav-right">
          <!-- 搜索框 -->
          <el-input
            v-model="searchKey"
            placeholder="搜索商品/设备..."
            class="search-input"
            @keyup.enter="handleSearch"
          >
            <template #prefix>
              <i class="el-icon-search"></i>
            </template>
          </el-input>
  
          <!-- 用户菜单 -->
          <div class="logout-container">
                    <Logout />
                </div>
        </el-col>
      </el-row>
    </header>
  </template>
  
  <script lang="ts" setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { ElMessage } from 'element-plus'
  import Logout from './Logout.vue'

  
  
  const router = useRouter()

  
  // 搜索功能
  const searchKey = ref('')
  const handleSearch = () => {
    if (searchKey.value.trim()) {
      // 执行搜索逻辑
      router.push(`/search?key=${encodeURIComponent(searchKey.value)}`)
    }
  }
  
  </script>
  
  <style lang="scss" scoped>
.app-header {
  position: sticky;
  top: 0;
  width: 100%;
  height: 80px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  background: #fff;
  z-index: 1000;

  .navbar {
    height: 100%;
    padding: 0 20px;

  
      .nav-left {
        display: flex;
        align-items: center;
        
        .sidebar-toggler {
          font-size: 24px;
          cursor: pointer;
          margin-right: 20px;
          color: #666;
          
          &:hover {
            color: #409EFF;
          }
        }
  
        .brand {
          font-size: 32px;
          font-weight: bold;
          color: #EE1D52;
        }
      }
  
      .nav-right {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        gap: 30px;
  
        .search-input {
          width: 300px;
          
          :deep(.el-input__inner) {
            border-radius: 20px;
          }
        }
  
        .user-panel {
          display: flex;
          align-items: center;
          cursor: pointer;
          padding: 5px 10px;
          transition: all 0.3s;
          
          &:hover {
            background: #f5f7fa;
            border-radius: 20px;
          }
  
          .user-info {
            margin-left: 10px;
            display: flex;
            flex-direction: column;
            
            .user-name {
              font-weight: 500;
              color: #303133;
            }
  
            .user-role {
              font-size: 12px;
              color: #909399;
            }
          }
        }
      }
    }
  }
  
  @media (max-width: 768px) {
  .app-header {
    height: 60px; // 移动端减小高度
    
    .nav-left .brand {
      font-size: 24px; // 调整文字大小
    }
    
    .nav-right .search-input {
      width: 180px; // 缩小搜索框
    }
  }
  
  body {
    padding-top: 60px; // 同步调整body padding
  }
}
  </style>