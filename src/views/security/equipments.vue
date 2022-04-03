<template>
  <div class="post-container">
    <el-select v-model="filter" size="small" @change='filterChange' style="width:8vw;margin-right:10px" placeholder="请选择">
      <el-option label="MAC地址" value="source"></el-option>
      <el-option label="IP地址" value="target"></el-option>
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
      <el-table-column label="MAC地址" prop="source"></el-table-column>
      <el-table-column label="IP地址" prop="business_name"></el-table-column>
      <el-table-column label="CPU物理核心数" prop="performance"></el-table-column>
      <el-table-column label="指令信息集" prop="target"></el-table-column>
      <el-table-column label="CPU速度" prop="internal"></el-table-column>
      <el-table-column label="CPU寄存器信息" prop="test_time"></el-table-column>
      <el-table-column label="系统内存大小" prop="performance"></el-table-column>
      <el-table-column label="SIM卡IMEI信息" prop="target"></el-table-column>
      <el-table-column label="SIM卡IMSI信息" prop="target"></el-table-column>
      <el-table-column label="SIM卡ICCID信息" prop="target"></el-table-column>
      <el-table-column label="电信业务端口" prop="internal"></el-table-column>
      <el-table-column label="设备注册时间" prop="test_time"></el-table-column>
      <el-table-column label="设备流量阻隔" prop="test_time"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="showDetail(scope.row)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="dialogName" :visible.sync="dialogStatusVisible" :modal-append-to-body="false">
      123123
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
          'source': {name:'MAC地址'},
          'target': {name:'IP地址'},
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
        { source: '1231', business_name: 'wqdqwd', performance: '4', target: 'qwdqwdqwqvvv', internal: 'qwdqw222e', test_time: 'qwd2e2e2', status: '0'},
        { source: '1231', business_name: 'wqdqwd', performance: '3', target: 'qwdqwdqwqvvv', internal: 'qwdqw222e', test_time: 'qwd2e2e2', status: '1'},
      ];
      this.loading = false;
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
        } else if(row.performance=='2') {
          this.dialogName = '流量测量';
        } else if(row.performance=='3') {
          this.dialogName = '抖动测量';
        } else if(row.performance=='4') {
          this.dialogName = '带宽测量';
        }
      },
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


  .el-row {
    margin-bottom: 20px;
  }
  .el-row:last-child {
    margin-bottom: 0;
  }
  .el-col {
    border-radius: 4px;
    /* border: 1px solid #000; */
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
</style>