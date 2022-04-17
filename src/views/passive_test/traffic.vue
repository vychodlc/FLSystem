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
        <el-button type="primary" @click="refreshBtn" :disabled="disable">{{btnText}}</el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import {overview} from '@/network/traffic.js'
export default({
  name: '',
  data() {
    return {
      resData: null,
      cooling: 5,
      disable: false,
      btnText: '刷新',
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      overview().then(res=>{
        if(res.statusText=='OK') {
          this.resData = res.data;
          let data_traffic = [[],[]];
          res.data.traffic_total.map(item=>{
            data_traffic[0].push(item[0]);
            data_traffic[1].push(item[1]);
          })
          let data_business = [[],[]];
          res.data.business.map(item=>{
            data_business[0].push(item[0]);
            data_business[1].push(item[1]);
          })
          this.showChart(data_traffic,data_business);
        }
      }).catch(e=>{
        console.log(e);
      })
    },
    showChart(data_traffic,data_business) {
      let option_line = {
        title: {
          text: '流量概况'
        },
        tooltip: {
          trigger: 'axis'
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
          data: data_traffic[0]
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: 'Email',
            type: 'line',
            stack: 'Total',
            data: data_traffic[1]
          }
        ]
      };
      let option_bar = {
        title: {
          text: '业务分析 (Top10)'
        },
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'category',
          data: data_business[0]
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
            data: data_business[1],
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
    },
    refreshBtn() {
      this.disable = true;
      this.getData();
      let countDown =  setInterval(() => {
        if (this.cooling < 1) {
          this.disable = false
          this.btnText = '刷新'
          this.cooling = 5
          clearInterval(countDown)
        } else {
          this.disable = true
          this.btnText = this.cooling-- + 's后可刷新'
        }
      }, 1000)
    }
  },
});
</script>
<style scoped>

</style>