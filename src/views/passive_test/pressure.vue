<template>
  <div class="input" id="container" v-loading="loading">
    <div class="form" id="form" v-show="!resShow">
      <el-form label-width="150px" size="medium">
        <el-form-item label="源地址">
          <el-select v-model="inputInfo.cpe_ip" :disabled='cpe_ip_list.length==0'  style="width:80%" placeholder="请选择源地址">
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
          <el-select v-model="inputInfo.business_ser_ip" :disabled='business_ser_ip_list.length==0' style="width:80%" placeholder="请选择目的地址">
            <el-option
              size="medium"
              v-for="item in business_ser_ip_list"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div class="footer" style="margin-bottom:20px">
        <el-button type="success" @click="goAdd" size="mini">确 定</el-button>
      </div>
      <el-table
        height='350'
        style="width: 100%;overflow:hidden;"
        :row-style="{height: '30px'}"
        :data="newItems">
        <el-table-column label="源地址" prop="cpe_ip"></el-table-column>
        <el-table-column label="目的地址" prop="business_ser_ip"></el-table-column>
        <el-table-column
          prop="right"
          label=""
          width="50">
          <template slot-scope="scope">
            <el-button type="danger" icon="el-icon-delete" size="mini" circle @click="newItems.splice(scope.$index,1)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="footer" style="margin-top:20px">
        <el-button type="primary" :disabled='newItems.length==0' @click="goCommit" size="mini">开始测试</el-button>
      </div>
    </div>
    <div class="chart" id="echart" v-show="resShow" style="width: 100%; height:100%;"></div>
    <div class="footer" v-show="resShow">
      <el-button type="primary" @click="goBack" size="mini">重新测试</el-button>
    </div>
  </div>
</template>

<script>
  // import {sendTask} from '@/network/active_test.js'
  import { getIPList} from '@/network/active_test.js'
  import { delay } from '@/network/traffic.js'
  export default {
    name: "PressurE",
    data () {
      return {
        resShow: false,
        search: '',
        isSearch: false,
        inputInfo: {
          cpe_ip: '',
          business_ser_ip: '',
        },
        businessList: [],
        cpe_ip_list: [],
        business_ser_ip_list: [],
        loading: true,
        newItems: [],
        fileList: [],
        measure_typeList: ['delay','traffic','jitter','bandwidth']
      }
    },
    methods:{
      goAdd() {
        if(this.inputInfo.cpe_ip=='') {
          this.$message.error('请选择源地址')
        } else if(this.inputInfo.business_ser_ip=='') {
          this.$message.error('请选择目的地址')
        } else {
          let existFlag = false;
          for(let i=0; i<this.newItems.length; i++) {
            let item = this.newItems[i];
            if(this.inputInfo.cpe_ip==item.cpe_ip && this.inputInfo.business_ser_ip==item.business_ser_ip) {
              existFlag = true;
              this.$message.error('重复添加');
            }
          }
          if(!existFlag) {
            let newItem = this.inputInfo;
            this.newItems.push(newItem);
            this.inputInfo = {
              cpe_ip: '',
              business_ser_ip: '',
            };
          }
        }
      },
      goCommit() {
        this.loading = true;
        let query = '';
        for(let i=0; i<this.newItems.length; i++) {
          query = query+';'+this.newItems[i].cpe_ip+'-'+this.newItems[i].business_ser_ip;
        }
        query = query.slice(1);
        delay({
          'ip_list': query
        }).then(res => {
          console.log(res);
          this.showRes(res.data);
          this.loading = false;
          this.newItems = [];
        })
      },
      showRes(res) {
        let xlist = [];
        let ylist = [];
        for(let key in res) {
          xlist.push(key);
        }
        for(let key in res[xlist[0]]) {
          ylist.push({
            name: key.replace('\\','').replace('"',''),
            value: []
          })
        }
        for(let i=0; i<xlist.length; i++) {
          let item = res[xlist[i]];
          for(let key in item) {
            for(let j=0; j<ylist.length; j++) {
              if(ylist[j].name.indexOf(key)!=-1||key.indexOf(ylist[j].name)!=-1) {
                ylist[j].value.push(parseInt(item[key]))
              }
            }
          }
        }
        let series = [];
        let legends = [];
        for(let i=0; i<ylist.length; i++) {
          legends.push(ylist[i].name)
          series.push({
            name: ylist[i].name,
            data: ylist[i].value,
            type: 'line',
            smooth: true
          })
        }
        this.resShow = true;

        let vh = document.documentElement.offsetHeight/100;
        let width = document.getElementById('container').offsetWidth;

        document.getElementById("echart").style.width=width+"px";
        document.getElementById("echart").style.height=(100*vh-160)+"px";

        let option = {
          title: {
            text: '压力测试结果',
            left: 'center'
          },
          legend: {
            data: legends,
            top: '6%'
          },
          tooltip: {
            trigger: 'axis',
            formatter(params) {
              let s = '当前带宽为: <b>' + params[0].name+'</b><br/>';
              s+=params[0].marker+' '+params[0].seriesName+': <b>'+params[0].data+'</b><br/>';
              s+=params[1].marker+' '+params[1].seriesName+': <b>'+params[1].data+'</b>';
              return s;
            }
          },
          grid: {
            top: '14%'
          },
          xAxis: {
            type: 'category',
            data: xlist
          },
          yAxis: {
            type: 'value'
          },
          series: series
        };
        if(document.getElementById('echart')!=null) {
          document.getElementById('echart').removeAttribute("_echarts_instance_");
          this.$echarts.init(document.getElementById('echart')).setOption(option);
        }
      },
      goBack() {
        this.resShow = false;
      }
    },
    mounted() {
      this.loading = true;
      getIPList('').then(res=>{
        this.cpe_ip_list = res.data.cpe_ips;
        this.business_ser_ip_list = res.data.business_ser_ips;
        this.newItems = []
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
