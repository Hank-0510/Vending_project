<template>
  <div class="home-container">
    <el-row class="row-bg" :gutter="10">
      <el-col :xs="24" :sm="12" :lg="8">
        <el-card class="box-card" style="height: 100%">
          <div class="personal">
            <!-- <div>
              <el-avatar :size="50" :src="AvatarLogo" />
            </div> -->
            <div class="name">欢迎您！<br>{{ userrole }}</div>
            <div class="list">
              <div>账号ID：{{ username }}</div>
            </div>
            <el-divider></el-divider>
            <div style="margin-bottom: 15px"><h3>单个商品热销名单</h3></div>
            <div>
              <el-tag style="margin-right: 10px">康师傅冰红茶</el-tag>
              <el-tag style="margin-right: 10px">补水了</el-tag>
              <el-tag style="margin-right: 10px">红烧牛肉面</el-tag>
              <el-tag style="margin-right: 10px">农夫山泉</el-tag>
              <el-tag>美汁源果粒橙</el-tag>
            </div>
            <el-divider></el-divider>
            <div style="margin-bottom: 15px"><h3>销售数据排行</h3></div>
            <div>
              <el-tag style="margin-right: 10px">康师傅冰红茶</el-tag>
              <el-tag style="margin-right: 10px">补水了</el-tag>
            </div>
            <el-divider></el-divider>
            <div style="margin-bottom: 15px"
              ><h3>补货记录</h3></div
            >
            补货：1箱今麦郎凉白开（550ml）<br>
            补货：2箱今麦郎冰红茶（500ml）<br>
            补货：3瓶百事可乐（300ml）<br>
            补货：1箱康师傅冰红茶（1L）<br>
          </div>
          <el-divider></el-divider>
            <div style="margin-bottom: 15px"><h3>销售建议</h3></div>
            暂无信息
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="16">
        <el-row class="custom" :gutter="10">
          <el-col :xs="24" :sm="12" :lg="8">
            <el-card style="margin-bottom: 10px">
              <div class="grid-content">
                <div class="left"
                  ><el-icon style="font-size: 24px; color: white"><user /></el-icon
                ></div>
                <div class="right">
                  <div class="h2" style="color: #2d8cf0"
                    ><count-to :start-val="0" :end-val="5268" :duration="2000" :autoplay="true"></count-to
                  ></div>
                  <div>用户访问量 </div>4563
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :xs="24" :sm="12" :lg="8">
            <el-card style="margin-bottom: 10px">
              <div class="grid-content">
                <div class="left" style="background: #64d572"
                  ><el-icon style="font-size: 24px; color: white"><user /></el-icon
                ></div>
                <div class="right">
                  <div class="h2" style="color: #64d572"
                    ><count-to :start-val="0" :end-val="9599" :duration="2000" :autoplay="true"></count-to
                  ></div>
                  <div>销售金额 </div>14500
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :xs="24" :sm="12" :lg="8">
            <el-card style="margin-bottom: 10px">
              <div class="grid-content">
                <div class="left" style="background: #f25e43"
                  ><el-icon style="font-size: 24px; color: white"><user /></el-icon
                ></div>
                <div class="right">
                  <div class="h2" style="color: #f25e43"
                    ><count-to :start-val="0" :end-val="595453" :duration="2000" :autoplay="true"></count-to
                  ></div>
                  <div>销售数量 </div>938
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              <span>销售数据榜单</span>
            </div>
          </template>
          <div style="display: flex">
            <el-card
              style="flex: 1; margin-right: 20px; cursor: pointer"
              class="card-item"           
            >
              <div style="color: white; margin-bottom: 10px"><h3>资金提现情况</h3></div>
              <div style="font-size: 12px; color: white"
                >对接到提现记录表</div
              >
            </el-card>

            <el-card style="flex: 1; cursor: pointer" class="card-item">
              <div style="color: white; margin-bottom: 10px"><h3>品牌销售情况</h3></div>
              <div style="font-size: 12px; color: white">对接到销售数据表中、康师傅，今麦郎</div>
            </el-card>
          </div>
        </el-card>
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              <span>每周用户活跃量</span>
            </div>
          </template>
          <div>
            <bar-charts id="bar1" height="300px" width="100%"></bar-charts>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script setup lang="ts">
import { User } from '@element-plus/icons-vue'
import { ref, computed } from 'vue'
import CountTo from '@/components/CountTo/index.vue'
import BarCharts from '@/views/echarts/simple/components/bar.vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

// 获取用户名
const username = computed(() => userStore.userInfo?.username || '用户')

// 处理角色显示
const userrole = computed(() => {
const roleMap: Record<string, string> = { // 明确类型定义
  'super': '超级管理员',
  'admin': '商家',
  'normal': '补货员'
}
return roleMap[userStore.userInfo?.role as string] || '未知角色' // 添加类型断言
})
</script>

<style scoped lang="scss">
  @use './index' as *;
</style>
