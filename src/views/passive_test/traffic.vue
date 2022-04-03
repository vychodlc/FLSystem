<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="24">
        <div id="echarts_line" style="width: 100%; height: 36vh;margin-bottom:5vh"></div>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="24">
        <div id="echarts_bar" style="width: 100%; height: 36vh;margin-bottom:5vh"></div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12" :offset="11">
        <el-button type="primary">刷新</el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default({
  name: '',
  data() {
    return {

    };
  },
  mounted() {
    this.showChart();
  },
  methods: {
    showChart() {
      let option_line = {
        title: {
          text: '流量概况'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['Email', 'Union Ads']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: 'Email',
            type: 'line',
            stack: 'Total',
            data: [120, 132, 101, 134, 90, 230, 210]
          },
          {
            name: 'Union Ads',
            type: 'line',
            stack: 'Total',
            data: [220, 182, 191, 234, 290, 330, 310]
          }
        ]
      };
      let option_bar = {
        title: {
          text: '业务分析（Top10）'
        },
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        yAxis: {
          type: 'value',
          max: 600,
        },
        series: [
          {
            data: [120, 200, 150, 80, 70, 110, 130],
            type: 'bar'
          }
        ]
      };
      if(document.getElementById('echarts_line')!=null) {
        this.clearChart();
        this.$echarts.init(document.getElementById('echarts_line')).setOption(option_line);
      }
      if(document.getElementById('echarts_bar')!=null) {
        this.clearChart();
        this.$echarts.init(document.getElementById('echarts_bar')).setOption(option_bar);
      }
    },
    clearChart() {
      let chartList = ['echarts_line','echarts_bar']
      for(let i=0; i<chartList.length; i++) {
        if(document.getElementById(chartList[i])!=null) {
          document.getElementById(chartList[i]).removeAttribute("_echarts_instance_");
        }
      }
    }
  },
});
</script>
<style scoped>

</style>