<template>
  <div class="post-container" v-loading="loading">
    <el-form style="height: 30px;line-height:30px">
      <el-form-item>
        <el-row>
          <el-col :span="1" style="text-align:center">统计周期</el-col>
          <el-col :span="1">
            <el-input size="mini" v-model="queryData.Interval" placeholder="10"></el-input>
          </el-col>
          <el-col :span="1" style="text-align:center">源探针</el-col>
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
      :data="tableData"
      style="width: 100%;height: calc(100vh - 142px);overflow-y:scroll"
      class="elTable">
      <el-table-column label="时间" prop="source"></el-table-column>
      <el-table-column label="业务类别" prop="business_name"></el-table-column>
      <el-table-column label="业务名称" prop="performance"></el-table-column>
      <el-table-column label="优先级" prop="target"></el-table-column>
      <el-table-column label="源地址" prop="internal"></el-table-column>
      <el-table-column label="目的地址" prop="test_time"></el-table-column>
      <el-table-column label="平均时延" prop="avg_delay"></el-table-column>
      <el-table-column label="占比" prop="test_time"></el-table-column>
      <el-table-column label="流量" prop="internal"></el-table-column>
      <el-table-column label="占比" prop="test_time"></el-table-column>
      <el-table-column label="总流量" prop="business_flow"></el-table-column>
      <el-table-column label="目的地址" prop="test_time"></el-table-column>
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
  import { getIPList } from '@/network/active_test.js'
  export default {
    name: "Post",
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
        pageNum: 100,
        currentPage: 1,
        dialogName: '',
        queryData: {
          interval: '',
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
      this.tableData = [
        { source: '1231', business_name: 'wqdqwd', performance: '1', target: 'qwdqwdqwqvvv', internal: 'qwdqw222e', test_time: 'qwd2e2e2', status: '0'},
        { source: '1231', business_name: 'wqdqwd', performance: '1', target: 'qwdqwdqwqvvv', internal: 'qwdqw222e', test_time: 'qwd2e2e2', status: '1'},
        { source: '1231', business_name: 'wqdqwd', performance: '2', target: 'qwdqwdqwqvvv', internal: 'qwdqw222e', test_time: 'qwd2e2e2', status: '1'},
        { source: '1231', business_name: 'wqdqwd', performance: '2', target: 'qwdqwdqwqvvv', internal: 'qwdqw222e', test_time: 'qwd2e2e2', status: '2'},
        { source: '1231', business_name: 'wqdqwd', performance: '3', target: 'qwdqwdqwqvvv', internal: 'qwdqw222e', test_time: 'qwd2e2e2', status: '0'},
        { source: '1231', business_name: 'wqdqwd', performance: '3', target: 'qwdqwdqwqvvv', internal: 'qwdqw222e', test_time: 'qwd2e2e2', status: '1'},
      ];

      this.currentPage = 1;
      getIPList('').then(res=>{
        this.cpe_ip_list = res.data.cpe_ips;
        this.business_ser_ip_list = res.data.business_ser_ips;
        this.loading = true;
        this.getData(0);
        this.showChart1();
      })
    },
    methods:{
      filterChange() {},
      goSearch() {},
      goBack() {},
      handleCurrentChange() {},
      getData(method) {
        if(method==0) {
          console.log('0000+++'+this.currentPage);
        } else if(method==1) {
          console.log('1111+++'+this.currentPage);
        }
        this.loading = false;
      },
      showDetail(row) {
        this.dialogStatusVisible = true;
        this.dialogName = row.performance;
        if(row.performance=='1') {
          this.dialogName = '时延测量';
          this.$nextTick(() => {        
            this.showChart1();
          })
        } else if(row.performance=='2') {
          this.dialogName = '流量测量';
          this.$nextTick(() => {        
            this.showChart1();
          })
        } else if(row.performance=='3') {
          this.dialogName = '抖动测量';
          this.$nextTick(() => {        
            this.showChart1();
          })
        } else if(row.performance=='4') {
          this.dialogName = '带宽测量';
          this.$nextTick(() => {        
            this.showChart1();
          })
        }
      },

      showChart1() {
        let option = {
          xAxis: {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              data: [150, 230, 224, 218, 135, 147, 260],
              type: 'line'
            }
          ]
        };
        if(document.getElementById('echarts_box')!=null) {
          this.$echarts.init(document.getElementById('echarts_box')).setOption(option);
        } 
      }
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