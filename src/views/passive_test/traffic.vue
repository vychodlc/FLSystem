<template>
  <div v-loading='loading'>
    <el-row :gutter="20">
      <el-col :span="24">
        <div id="echarts_line" style="width: 100%; height: 40vh;margin-bottom:5vh"></div>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12">
        <div id="echarts_bar" style="width: 100%; height: 40vh;"></div>
      </el-col>
      <el-col :span="12">
        <div id="echarts_bar2" style="width: 100%; height: 40vh;"></div>
      </el-col>
    </el-row>
    <!-- <el-row>
      <el-col :span="12" :offset="11">
        <el-button type="primary" @click="refreshBtn" :disabled="disable">{{btnText}}</el-button>
      </el-col>
    </el-row> -->
  </div>
</template>
<script>
import {overview} from '@/network/traffic.js'
export default({
  name: 'TrafficVue',
  data() {
    return {
      loading: true,
      resData: null,
      cooling: 5,
      disable: false,
      btnText: '刷新',
      loadTimes: 0,
      chart1: null,
      chart2: null,
    };
  },
  mounted() {
    setInterval(() => {
      this.getData();      
    }, 2000);
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
          let data_delay = [[],[]];
          res.data.delay.map(item=>{
            data_delay[0].push(item[0]);
            data_delay[1].push(item[1]);
          })
          this.showChart(data_traffic,data_business,data_delay);
          this.loading = false;
        }
      }).catch(e=>{
        console.log(e);
      })
    },
    showChart(data_traffic,data_business,data_delay) {
      let option_line = {
        animation: false,
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
          name: '时间',
          boundaryGap: false,
          data: data_traffic[0]
        },
        yAxis: {
          name: '数据量/MB',
          type: 'value'
        },
        series: [
          {
            name: '数据量',
            type: 'line',
            stack: 'Total',
            data: data_traffic[1]
          }
        ]
      };
      let option_bar = {
        animation: false,
        title: {
          text: '业务分析'
        },
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          name: '业务类型',
          type: 'category',
          data: data_business[0]
        },
        grid: {
          left: '0%',
          right: '10%',
          bottom: '10%',
        },
        yAxis: {
          name: '数据量/MB',
          type: 'value',
          max: Math.max.apply(Math,data_business[1]),
          show: false,
        },
        series: [
          {
            name: '数据量',
            data: data_business[1],
            type: 'bar',
            itemStyle: {
              normal: {
                label: {
                  formatter: (params) => {
                    return params.value==0?0:params.value+" MB"
                  },
                  show: true,
                  position: "top",
                  textStyle: {
                    fontWeight: "bolder",
                    fontSize: "12",
                    color: "#000"
                  }
                }
              }
            }
          }
        ]
      };
      let option_bar2 = {
        animation: false,
        title: {
          text: '时延分析'
        },
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          name: '业务类型',
          type: 'category',
          data: data_delay[0]
        },
        grid: {
          left: '0%',
          right: '10%',
          bottom: '10%',
        },
        yAxis: {
          name: '时延/ms',
          type: 'value',
          max: Math.max.apply(Math,data_delay[1]),
          show: false
        },
        series: [
          {
            name: '时延',
            data: data_delay[1],
            type: 'bar',
            itemStyle: {
              normal: {
                label: {
                  formatter: (params) => {
                    return params.value==0?0:params.value.toFixed(8)+" ms"
                  },
                  show: true,
                  position: "top",
                  textStyle: {
                    fontWeight: "bolder",
                    fontSize: "12",
                    color: "#000"
                  }
                }
              }
            }
          }
        ]
      };
      if(document.getElementById('echarts_line')!=null) {
        if(this.chart1==null) {
          this.clearChart();
          this.chart1 = this.$echarts.init(document.getElementById('echarts_line'))
        }
        this.chart1.setOption(option_line);
      }
      if(document.getElementById('echarts_bar')!=null) {
        if(this.chart2==null) {
          this.clearChart();
          this.chart2 = this.$echarts.init(document.getElementById('echarts_bar'))
        }
        this.chart2.setOption(option_bar);
      }
      if(document.getElementById('echarts_bar2')!=null) {
        if(this.chart3==null) {
          this.clearChart();
          this.chart3 = this.$echarts.init(document.getElementById('echarts_bar2'))
        }
        this.chart3.setOption(option_bar2);
      }
    },
    clearChart() {
      let chartList = ['echarts_line','echarts_bar','echarts_bar2']
      for(let i=0; i<chartList.length; i++) {
        if(document.getElementById(chartList[i])!=null) {
          document.getElementById(chartList[i]).removeAttribute("_echarts_instance_");
        }
      }
    },
    refreshBtn() {
      this.disable = true;
      this.loading = true;
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