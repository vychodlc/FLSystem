<template>
  <div class="post-container">
    <el-form style="height: 30px;line-height:30px">
      <el-form-item>
        <el-row>
          <el-col :span="1" style="text-align:center">MAC地址</el-col>
          <el-col :span="2">
            <el-select 
            size="mini"
            v-model="queryData.macAddress" clearable placeholder="请选择">
              <el-option
                v-for="item in macAddress_list"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="1" style="text-align:center">IP地址</el-col>
          <el-col :span="2">
            <el-select 
            size="mini"
            v-model="queryData.ipAddress" clearable placeholder="请选择">
              <el-option
                v-for="item in ipAddress_list"
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
          <el-col :span="1"><el-button size="mini" v-if="isSearch==true" type="primary" style="margin-left:10px" @click="goBack">返回</el-button></el-col>
        </el-row>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="loading"
      :data="tableData"
      style="width: 100%;height: calc(100vh - 142px);overflow-y:scroll"
      class="elTable">
      <el-table-column label="告警时间" prop="warningTime"></el-table-column>
      <el-table-column label="MAC地址" prop="macAddress"></el-table-column>
      <el-table-column label="告警IP" prop="ipAddress"></el-table-column>
      <el-table-column label="告警描述" prop="warningDetail"></el-table-column>
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
  import { getWarningList } from '@/network/security.js'
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
        pageNum: 1,
        currentPage: 1,
        interpret: {
          'source': {name:'MAC地址'},
          'target': {name:'IP地址'},
          'start_time': {name:'开始时间'},
          'end_time': {name:'结束时间'}
        },
        dialogName: '',
        queryData: {
          interval: '',
          macAddress: '',
          ipAddress: '',
          start_time: '',
          end_time: '',
        },
        macAddress_list: [],
        ipAddress_list: [],
        startPickerOptions: {
          disabledDate: (time) => {
            return (new Date(time)).valueOf() > (new Date()).valueOf();
          }
        }
      }
    },
    mounted() {
      this.currentPage = 1;
      this.loading = true;
      this.getData(0);
    },
    methods:{
      getData(method) {
        if(method == 0) {
          getWarningList(this.currentPage).then(res=>{
            console.log(res);
            this.pageNum = res.data.count;
            this.tableData = res.data.data;
            this.loading = false;
          }).catch(e=>{
            console.log(e);
          })
        } else if(method == 1) {
          console.log('搜索还没做好');
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
      handleDelete(index, row) {},
      
      showDetail(row) {
        console.log(row);
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