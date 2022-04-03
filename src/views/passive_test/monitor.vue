<template>
  <div class="post-container">
    <el-select v-model="filter" size="small" @change='filterChange' style="width:8vw;margin-right:10px" placeholder="请选择">
      <el-option label="源探针" value="source"></el-option>
      <el-option label="目的地址" value="target"></el-option>
      <el-option label="开始时间" value="start_time"></el-option>
      <el-option label="结束时间" value="end_time"></el-option>
    </el-select>
    <el-input placeholder="请输入内容" size="small" style="width:30vw;margin-right:10px" v-model="search" class="input-with-select"></el-input>
    <el-button size="small" type="" @click="goSearch">搜索</el-button>
    <el-button size="small" v-if="isSearch==true" type="primary" @click="goBack">返回</el-button>
    <el-tag size="small" closable v-if="isSearch==true" style="margin-left:10px" @close="goBack">{{filterWord}} : {{searchWord}}</el-tag>
    <el-table
      v-loading="loading"
      :data="tableData"
      style="width: 100%;height: calc(100vh - 142px);overflow-y:scroll"
      class="elTable">
      <el-table-column label="时间" prop="source"></el-table-column>
      <el-table-column label="业务类别" prop="business_name"></el-table-column>
      <el-table-column label="业务名称" prop="performance"></el-table-column>
      <el-table-column label="优先级" prop="target"></el-table-column>
      <el-table-column label="源地址" prop="internal"></el-table-column>
      <el-table-column label="目的地址" prop="test_time"></el-table-column>
      <el-table-column label="平均时延" prop="internal"></el-table-column>
      <el-table-column label="占比" prop="test_time"></el-table-column>
      <el-table-column label="流量" prop="internal"></el-table-column>
      <el-table-column label="占比" prop="test_time"></el-table-column>
      <el-table-column label="总流量" prop="internal"></el-table-column>
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
        oldPost: null,
        pageNum: 100,
        currentPage: 1,
        interpret: {
          'source': {name:'源探针'},
          'target': {name:'目的地址'},
          'start_time': {name:'开始时间'},
          'end_time': {name:'结束时间'}
        },
        dialogName: '',
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
      this.loading = false;
      this.showChart1();
    },
    methods:{
      filterChange() {},
      goSearch() {},
      goBack() {},
      handleCurrentChange() {},
      handleDelete(index, row) {},
      
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

<style scoped>
  .post-container {
    position: relative;
  }
  .pagination {
    position: absolute;
    right: 20px;
  }
</style>