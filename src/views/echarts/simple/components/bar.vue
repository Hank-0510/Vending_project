<template>
  <div :id="id" :style="{ height: height, width: width }"></div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'

interface Props {
  id: string
  height: string
  width: string
}

const props = defineProps<Props>()

let myChart: echarts.ECharts | null = null

const initChart = () => {
  const chartDom = document.getElementById(props.id)
  if (!chartDom) return

  myChart = echarts.init(chartDom)
  const option = {
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: [120, 200, 150, 80, 70, 110, 130],
        type: 'bar'
      }
    ]
  }

  myChart.setOption(option)
}

onMounted(() => {
  initChart()
  window.addEventListener('resize', () => {
    myChart?.resize()
  })
})

onUnmounted(() => {
  myChart?.dispose()
  window.removeEventListener('resize', () => {
    myChart?.resize()
  })
})
</script>