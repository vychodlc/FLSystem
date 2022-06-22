<template>
  <div class="post-container" v-loading="loading">
    <el-form style="height: 30px;line-height:30px">
      <el-form-item>
        <el-row>
          <el-col :span="1" style="text-align:center">源地址</el-col>
          <el-col :span="2">
            <el-select
            size="mini"
            v-model="queryData.cpe_ip" clearable placeholder="请选择">
              <el-option
                v-for="item in cpe_ip_list"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="1" style="text-align:center">目的地址</el-col>
          <el-col :span="2">
            <el-select
            size="mini"
            v-model="queryData.ser_ip" clearable placeholder="请选择">
              <el-option
                v-for="item in business_ser_ip_list"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="1" style="text-align:center">开始时间</el-col>
          <el-col :span="4">
            <el-date-picker
              v-model="queryData.start_time"
              :picker-options="startPickerOptions"
              type="datetime"
              style="width:100%"
              placeholder="选择日期时间"
              size="mini">
            </el-date-picker>
          </el-col>
          <el-col :span="1" style="text-align:center">结束时间</el-col>
          <el-col :span="4">
            <el-date-picker
              v-model="queryData.end_time"
              :picker-options="startPickerOptions"
              type="datetime"
              style="width:100%"
              placeholder="选择日期时间"
              size="mini">
            </el-date-picker>
          </el-col>
          <el-col :span="1"><el-button size="mini" type="" style="margin-left:5px" @click="currentPage=1;getData(1)">搜索</el-button></el-col>
          <el-col :span="1"><el-button size="mini" v-if="isSearch==true" type="primary" style="margin-left:5px" @click="goBack">返回</el-button></el-col>
        </el-row>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="loading"
      :data="tableData"
      style="width: 100%;height: calc(100vh - 142px);overflow-y:scroll"
      class="elTable">
      <el-table-column label="起始时间" prop="start_time"></el-table-column>
      <el-table-column label="结束时间" prop="end_time"></el-table-column>
      <el-table-column label="业务类别" prop="business_type"></el-table-column>
      <el-table-column label="业务名称" prop="business_name"></el-table-column>
      <el-table-column label="优先级" prop="prio"></el-table-column>
      <el-table-column label="源地址" prop="source"></el-table-column>
      <el-table-column label="目的地址" prop="dest"></el-table-column>
      <el-table-column label="流量/MB" prop="data_flow"></el-table-column>
      <el-table-column label="总流量/MB" prop="business_flow"></el-table-column>
      <el-table-column label="平均时延/ms" prop="avg_delay"></el-table-column>
      <el-table-column label="速率趋势图" align="right">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="showDetail(scope.row)">查看</el-button>
        </template>
      </el-table-column>
      <!-- <div id="echarts_box" style="width: 40vw; height: 30vh;position:absolute;top:0;left:0;z-index:-100;opacity:1"></div> -->
    </el-table>
    <el-dialog title="速率趋势图" :visible.sync="dialogStatusVisible" :modal-append-to-body="false">
      <div id="echarts_box" style="width: 100%; height: 30vh;"></div>
    </el-dialog>
    <div class="pagination">
      <el-pagination
        small
        layout="prev, pager, next, total"
        :total="pageNum"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { getIPList} from '@/network/active_test.js'
import { performance,rate } from '@/network/traffic.js'

  export default {
    name: "PosT",
    data () {
      return {
        search: null,
        searchWord: null,
        filter: 'source',
        filterWord: null,
        isSearch: false,
        loading: true,
        tableData: [],
        tags: null,
        dialogStatusVisible: false,
        dialogStatus: null,
        pageNum: 1,
        currentPage: 1,
        dialogName: '',
        queryData: {
          cpe_ip: '',
          ser_ip: '',
          start_time: '',
          end_time: '',
        },
        cpe_ip_list: [],
        business_ser_ip_list: [],
        startPickerOptions: {
          disabledDate: (time) => {
            return (new Date(time)).valueOf() > (new Date()).valueOf();
          }
        }
      }
    },
    mounted() {
      this.formatDate(new Date().getTime())
      this.currentPage = 1;
      this.loading = true;

      getIPList('').then(res=>{
        this.cpe_ip_list = res.data.cpe_ips;
        this.business_ser_ip_list = res.data.business_ser_ips;
        this.loading = true;
        this.getData(0);
        // this.showChart1();
      })

    },
    methods:{
      getData(method) {
        if(method == 0) {
          let parmas = {
            p:this.currentPage
          }
          performance(parmas).then(res=>{
            // console.log("res",res);
            this.pageNum = res.data.count;
            this.tableData = res.data.items;
            this.loading = false;
          }).catch(e=>{
            console.log(e);
            this.$message.error('请联系后端询问服务器是否出现问题')
          })
        } else if(method == 1) {
          if(this.queryData.cpe_ip==''&&this.queryData.ser_ip==''&&this.queryData.start_time==''&&this.queryData.end_time=='') {
            this.$message.error('请输入搜索信息');
            this.loading = false;
          } else {
            let params = {
              src_ip: this.queryData.cpe_ip,
              dst_ip: this.queryData.ser_ip,
              start_time: this.queryData.start_time==''?0:parseInt((new Date(this.queryData.start_time)).valueOf()/1000),
              end_time: this.queryData.end_time==''?parseInt((new Date()).valueOf()/1000):parseInt((new Date(this.queryData.end_time)).valueOf()/1000),
              p: this.currentPage
            }

            if(params.start_time>params.end_time) {
              this.$message.error('请确保开始时间早于当前时间')
            } else {
              performance(params).then(res=>{
                this.pageNum = res.data.count;
                this.tableData = res.data.items;
                this.isSearch = true;
                this.loading = false;
              }).catch(e=>{
                console.log(e);
              })
            }
          }
        }
      },
      filterChange() {},
      goSearch() {},
      goBack() {
        this.currentPage = 1;
        this.loading = true;
        this.getData(0);
        this.isSearch = false;
        this.search = '';
      },
      handleCurrentChange() {
        this.loading = true;
        this.getData(this.isSearch?1:0)
      },
      showDetail(row) {
        // console.log(row);
        let params = {
          start_time: parseInt((new Date(row.start_time)).valueOf()/1000),
          end_time: parseInt((new Date(row.end_time)).valueOf()/1000),
          src_ip: row.source,
          dst_ip: row.dest,
          src_port:8000,
          dst_port:8028
        }
        // let params = {
        //   src_ip: '192.168.0.111',
        //   dst_ip: '192.168.123.51',
        // }
        rate(params).then(res=>{
          this.dialogStatusVisible = true;
          this.$nextTick(() => {
            this.showChart1(res.data);

          })
        })
      },
      showChart1(chartData) {
        let dataX = [];
        let dataY = [];
        chartData.map((value)=>{
          dataX.push(this.formatDate(new Date(value[0]).getTime()))
          dataY.push(value[1]);
        });
        let option = {
          grid: {
            top: '15%',
            left: '10%',
            right: '10%',
            bottom: '10%',
          },
          xAxis: {
            name: '时间',
            type: 'category',
            data: dataX,
          },
          yAxis: {
            name: '速率/Mbps',
            type: 'value'
          },
          series: [
            {
              data: dataY,
              type: 'line'
            }
          ]
        };
        if(document.getElementById('echarts_box')!=null) {
          this.$echarts.init(document.getElementById('echarts_box')).setOption(option);
        }
      },
      formatDate(time){
        var date = new Date(time);
        var year = date.getFullYear(),
          month = date.getMonth() + 1,//月份是从0开始的
          day = date.getDate(),
          hour = date.getHours(),
          min = date.getMinutes(),
          sec = date.getSeconds();
        var newTime = year.toString().slice(2) + '/' +
              month + '/' +
              day + ' ' +
              hour + ':' +
              min + ':' +
              sec;
        return newTime;
      },
    }
  }
</script>

<style>
  .el-main {
    padding: 10px 20px;
  }
</style>

<style scoped>
  .post-container {
    position: relative;
  }
  .pagination {
    position: absolute;
    right: 20px;
  }
</style>
