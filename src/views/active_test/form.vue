<template>
  <div class="input" v-loading="loading">
    <div class="form">
      <el-form label-width="150px" size="small">
        <el-form-item label="统计周期">
          <template>
            <el-radio v-model="filter.cycle" label="4">日统计</el-radio>
            <el-radio v-model="filter.cycle" label="3">周统计</el-radio>
            <el-radio v-model="filter.cycle" label="2">月统计</el-radio>
            <el-radio v-model="filter.cycle" label="1">年统计</el-radio>
          </template>
        </el-form-item>
        <el-form-item label="测量业务">
          <el-select
          @change='businessChecked()'
          v-model="filter.business_name" style="width:80%" clearable placeholder="请选择测量业务">
            <el-option
              size="medium"
              v-for="item in businessList"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="源探针">
          <el-select v-model="filter.cpe_ip" :disabled='cpe_ip_list.length==0'  style="width:80%" placeholder="请选择源探针">
            <el-option
              size="medium"
              v-for="item in cpe_ip_list"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="目的地址">
          <el-select v-model="filter.business_ser_ip" :disabled='business_ser_ip_list.length==0' style="width:80%" placeholder="请选择目的地址">
            <el-option
              size="medium"
              v-for="item in business_ser_ip_list"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="查询测量指标">
          <template>
            <el-radio v-model="filter.measure_type" label="bandwidth">带宽测量</el-radio>
            <el-radio v-model="filter.measure_type" label="jitter">抖动测量</el-radio>
            <el-radio v-model="filter.measure_type" label="delay">时延测量</el-radio>
            <el-radio v-model="filter.measure_type" label="traffic">流量测量</el-radio>
          </template>
        </el-form-item>
        <el-form-item label="开始时间">
          <el-date-picker
            v-model="filter.time"
            type="datetime"
            placeholder="选择日期时间"
            size="small"
            style="width:80%;">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div class="footer" style="margin-bottom:20px">
        <el-button type="success" @click="goSearch" size="mini">查 询</el-button>
      </div>
      <div class="chart">
        <el-row :gutter="20">
          <el-col :span="24">
            <div v-if="hasRes==1" id="echarts" style="width: 50%; margin: 0 auto; height: 42vh;"></div>
            <el-empty v-else-if="hasRes==0" description="查询无果"></el-empty>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
  import {getForm,getBusinessList,getIPList} from '@/network/active_test.js'
  export default {
    name: "FormVue",
    data () {
      return {
        isSearch: false,
        filter: {
          cycle: '',
          business_name: '',
          cpe_ip: '',
          business_ser_ip: '',
          measure_type: '',
          time: ''
        },
        hasRes: -1,
        loading: true,
        newItems: [],
        fileList: [],
        businessList: [],
        cpe_ip_list: [],
        business_ser_ip_list: [],
      }
    },
    methods:{
      businessChecked() {
        if(this.filter.business_name=='') {
          this.cpe_ip_list = [];
          this.business_ser_ip_list = [];
          this.filter.cpe_ip = '';
          this.filter.business_ser_ip = '';
        } else {
          getIPList(this.filter.business_name).then(res=>{
            this.cpe_ip_list = res.data.cpe_ips;
            this.business_ser_ip_list = res.data.business_ser_ips;

            this.filter.cpe_ip = this.cpe_ip_list[0];
            this.filter.business_ser_ip = this.business_ser_ip_list[0];
          })
        }
      },
      goSearch() {
        if(this.filter.cycle=='') {
          this.$message.error('请选择统计周期')
        } else if(this.filter.business_name=='') {
          this.$message.error('请输入查询业务')
        } else if(this.filter.cpe_ip=='') {
          this.$message.error('请输入源探针')
        } else if(this.filter.business_ser_ip=='') {
          this.$message.error('请输入目的地址')
        } else if(this.filter.measure_type=='') {
          this.$message.error('请输入查询测量指标')
        } else if(this.filter.time=='') {
          this.$message.error('请输入开始时间')
        } else {
          this.loading = true;
          getForm(this.filter).then(res=>{
            let name = '';
            let series = [];
            let resData = res.data.result;
            let resCount = res.data.count;
            console.log(res.data);
            if(resCount==0) {
              this.hasRes = 0;
            } else {
              this.hasRes = 1;
              if(this.filter.measure_type=='bandwidth') {
                name = '带宽';
                series = [
                  {type: 'bar', name: '上行', data: [resData.max_receiver_bandwidth,resData.avg_receiver_bandwidth,resData.min_receiver_bandwidth]},
                  {type: 'bar', name: '下行', data: [resData.max_sender_bandwidth,resData.avg_sender_bandwidth,resData.min_sender_bandwidth]},
                ]
              } else if(this.filter.measure_type=='delay') {
                name = '时延';
                series = [
                  {type: 'bar', barWidth: '30%', data: [resData.max_delay,resData.avg_delay,resData.min_delay]},
                ]
              } else if(this.filter.measure_type=='jitter') {
                name = '抖动';
                series = [
                  {type: 'bar', barWidth: '30%', data: [resData.max_network_jitter,resData.avg_network_jitter,resData.min_network_jitter]},
                ]
              } else if(this.filter.measure_type=='traffic') {
                name = '流量';
                series = [
                  {type: 'bar', name: '入境',data: [resData.max_input,resData.avg_input,resData.min_input]},
                  {type: 'bar', name: '出境',data: [resData.max_output,resData.avg_output,resData.min_output]},
                ]
              }
              this.$nextTick(() => {
                let option = {
                  xAxis: {
                    type: 'category',
                    data: ['最大'+name, '平均'+name, '最小'+name]
                  },
                  tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                      type: 'shadow'
                    }
                  },
                  yAxis: {
                    type: 'value'
                  },
                  grid: {
                    top: '5%',
                    left: '5%',
                    bottom: '6%',
                    right: '0%'
                  },
                  series: series
                };
                if(document.getElementById('echarts')!=null) {
                  document.getElementById('echarts').removeAttribute("_echarts_instance_");
                  this.$echarts.init(document.getElementById('echarts')).setOption(option);
                }
              })
            }
          this.loading = false;
          }).catch(e=>{
            console.log(e);
          })
        }
      },
      clearChart() {
      },
    },
    mounted() {
      this.loading = true;
      getBusinessList().then(res=>{
        this.businessList = res.data;
        this.loading = false;
      })
    }
  }
</script>

<style scoped>
  .input {
    margin: 0 auto;
    width: 80%;
    height: 100%;
  }
  .footer {
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
