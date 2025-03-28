<template>
    <div class="data-dashboard">
      <!-- 头部盒子 -->
      <header>
        <h1>自动售货机系统信息可视化终端</h1>
        <div class="showTime">{{ currentTime }}</div>
      </header>
  
      <section class="mainbox">
        <div class="column">
          <div class="panel bar">
            <h2>品类销售数据</h2>
            <div ref="barChart1" class="chart"></div>
            <div class="panel-footer"></div>
          </div>
  
          <div class="panel bar3">
            <h2>产品利率信息</h2>
            <div ref="radarChart" class="chart"></div>
            <div class="panel-footer"></div>
          </div>
  
          <div class="panel bar5">
            <h2>终端信息统计</h2>
            <div ref="funnelChart" class="chart"></div>
            <div class="panel-footer"></div>
          </div>
        </div>
    
  
        <div class="column">
          <div class="panel bar2">
            <h2>系统注册人数</h2>
            <div ref="barChart2" class="chart"></div>
            <div class="panel-footer"></div>
          </div>
  
          <div class="panel bar4">
            <h2>样机销售详情</h2>
            <div ref="sunburstChart" class="chart"></div>
            <div class="panel-footer"></div>
          </div>
  
          <div class="panel bar6">
            <h2>盈利状态趋势</h2>
            <div ref="lineChart" class="chart"></div>
            <div class="panel-footer"></div>
          </div>
        </div>
      </section>
    </div>
  </template>
  
  <script setup>
  import { onMounted, onBeforeUnmount, ref } from 'vue';
  import * as echarts from 'echarts';
  
  const currentTime = ref('');
  let timer = null;
  
 // 图表引用
const barChart1 = ref(null);  // 商品品类销售排行
const barChart2 = ref(null);  // 月度销售趋势
const radarChart = ref(null); // 商品属性雷达图
const funnelChart = ref(null);// 用户购买漏斗
const sunburstChart = ref(null); // 商品类目分布
const lineChart = ref(null);  // 周销售趋势

// 销售数据
const salesData = {
  // 品类销售数据
  categories: [
    { name: '其它品类', value: 987 },
    { name: '碳酸饮料', value: 1890 },
    { name: '生鲜果蔬', value: 1567 },
    { name: '休闲食品', value: 1321 },
    { name: '咖啡茶饮', value: 987 },
    { name: '日用品类', value: 345 }
  ],
  
  // 月度趋势
  monthlyTrend: {
    months: ['1月', '2月', '3月', '4月', '5月', '6月'],
    sales: [125, 234, 345, 278, 419, 502]
  },
  
  // 商品属性雷达
  productAttributes: {
    indicators: [
      { name: '利润率', max: 100 },
      { name: '复购率', max: 100 },
      { name: '好评率', max: 100 },
      { name: '退货率', max: 10 },
      { name: '库存周转', max: 10 }
    ],
    values: [85, 78, 92, 2.3, 6.7]
  },
  
  // 用户转化漏斗
  userFunnel: [
    { value: 1000, name: '访问量' },
    { value: 800, name: '加购量' },
    { value: 600, name: '下单量' },
    { value: 550, name: '支付量' },
    { value: 520, name: '复购量' }
  ],
  
  // 类目分布
  categoryDistribution: {
    data: [
  {
    name: "饮料",
    value:3120,
    children: [
      { name: "碳酸饮料", value: 890},
      { name: "矿泉水", value: 1560},
      { name: "功能饮料", value: 670, stock: 45 }
    ]
  },
  {
    name: "零食",
    value:2120,
    children: [
      { name: "膨化食品", value: 1230},
      { name: "巧克力", value: 890}
    ]
  }
]
  },
  
  // 周销售趋势
  weeklyTrend: {
    weeks: ['第1周', '第2周', '第3周', '第4周'],
    sales: [12, 35, 87, 157]
  }
};

// 初始化图表
const initCharts = () => {
  // 品类销售排行（横向柱状图）
  if(barChart1.value) {
    const chart = echarts.init(barChart1.value);
    chart.setOption({
      tooltip: { trigger: 'axis' },
      xAxis: { type: 'value' },
      yAxis: {
        type: 'category',
        data: salesData.categories.map(item => item.name)
      },
      series: [{
        data: salesData.categories.map(item => item.value),
        type: 'bar',
        color: ['#3498db', '#9b59b6', '#2ecc71', '#f1c40f', '#e74c3c'], 
        itemStyle: { color: '#5470c6' }
      }]
    });
  }

  // 月度销售趋势（折线图）
  if(lineChart.value) {
    const chart = echarts.init(lineChart.value);
    chart.setOption({
      xAxis: {
        type: 'category',
        data: salesData.monthlyTrend.months
      },
      yAxis: { type: 'value' },
      series: [{
        data: salesData.monthlyTrend.sales,
        type: 'line',
        smooth: true,
        areaStyle: {}
      }]
    });
  }

  // 商品属性雷达图
  if(radarChart.value) {
    const chart = echarts.init(radarChart.value);
    chart.setOption({
      radar: {
        indicator: salesData.productAttributes.indicators
      },
      series: [{
        type: 'radar',
        data: [{ value: salesData.productAttributes.values }]
      }]
    });
  }

  // 用户购买漏斗
  if(funnelChart.value) {
    const chart = echarts.init(funnelChart.value);
    chart.setOption({
      series: [{
        type: 'funnel',
        data: salesData.userFunnel,
        label: { show: true }
      }]
    });
  }

  // 商品类目分布（旭日图）
  if(sunburstChart.value) {
    const chart = echarts.init(sunburstChart.value);
    chart.setOption({
      series: [{
        type: 'sunburst',
        data: salesData.categoryDistribution.data,
        radius: [0, '90%']
      }]
    });
  }

  // 周销售趋势（柱状图）
  if(barChart2.value) {
    const chart = echarts.init(barChart2.value);
    chart.setOption({
      xAxis: {
        type: 'category',
        data: salesData.weeklyTrend.weeks
      },
      yAxis: { type: 'value' },
      series: [{
        data: salesData.weeklyTrend.sales,
        type: 'bar',
        itemStyle: { color: '#91cc75' }
        
      }]
    });
  }
};

// 生命周期
onMounted(() => {
  initCharts();
  window.addEventListener('resize', initCharts);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', initCharts);
});
  
  // 更新时间
  const updateTime = () => {
    const dt = new Date();
    currentTime.value = `当前时间：${dt.getFullYear()}年${dt.getMonth()+1}月${dt.getDate()}日-${dt.getHours()}时${dt.getMinutes()}分${dt.getSeconds()}秒`;
  };
  
  
  onMounted(() => {
    updateTime();
    timer = setInterval(updateTime, 1000);
    initCharts();
  });
  
  onBeforeUnmount(() => {
    clearInterval(timer);
  });
  </script>
  
  <style scoped>

  .data-dashboard {
    width: 100%;
    min-height: 100vh;
    background: #f8faff;
    padding: 20px 40px 20px 20px; 
    box-sizing: border-box;
  }
  
  header {
    height: 80px;
    line-height: 80px;
    text-align: left;
    padding-left: 30px;
    background: #2c3e50;
    box-shadow: 0 2px 12px rgba(0,0,0,0.05);
    border-radius: 8px;
    margin: 0 0 20px 0;
  }
  
  header h1 {
    color: #fff;
    font-size: 24px;
    margin: 0;
    display: inline-block;
  }
  
  .showTime {
    float: right;
    margin-right: 30px;
    color: #f8faff;
    font-size: 14px;
    font-weight: 400;
  }
  
  .mainbox {
    display: flex;
    gap: 15px;
    margin-left: -15px; /* 整体左移 */
  }
  
  .column {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
  
  .center-column {
    flex: 1.2;
  }
  
  /* 统一图表容器样式 */
  .panel {
    background: #ffffff;
    border-radius: 10px;
    padding: 15px;
    box-shadow: 0 4px 6px rgba(50,50,93,0.1);
    border: 1px solid #ebf0f5;
    position: relative;
    transition: transform 0.2s;
  }
  
  .panel:hover {
    transform: translateY(-3px);
  }
  
  .panel h2 {
    color: #3498db;
    font-size: 16px;
    margin: 0 0 10px 0;
    padding-bottom: 10px;
    border-bottom: 2px solid #3498db;
  }
  
  .chart {
    width: 100%;
    height: 280px; /* 统一高度 */
    min-width: 300px; /* 最小宽度 */
    position: relative;
  }
  
  /* 调整中间列位置 */
  .center-column .panel {
    margin-right: -30px; /* 右移留出空白 */
  }
  
  /* 图表颜色覆盖 */
  .echarts {
    width: 100% !important;
    height: 100% !important;
  }
  
  /* 统一坐标轴样式 */
  .echarts text {
    fill: #7f8c8d !important;
  }
  
  /* 滚动条样式统一 */
  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  
  ::-webkit-scrollbar-track {
    background: #f5f7fa;
  }
  
  ::-webkit-scrollbar-thumb {
    background: #bdc3c7;
    border-radius: 4px;
  }
  
  /* 响应式调整 */
  @media (max-width: 1600px) {
    .chart {
      height: 240px;
    }
    
    .mainbox {
      gap: 10px;
    }
  }
  </style>