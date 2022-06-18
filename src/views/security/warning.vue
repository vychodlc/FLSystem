<template>
  <div class="post-container">
    <el-form style="height: 30px;line-height:30px">
      <el-form-item>
        <el-row>
          <el-col :span="2" style="text-align:center">MAC地址</el-col>
          <el-col :span="2">
            <el-select
            size="mini"
            v-model="queryData.mac" clearable placeholder="请选择">
              <el-option
                v-for="item in mac_list"
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
            v-model="queryData.ip" clearable placeholder="请选择">
              <el-option
                v-for="item in ip_list"
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
          <el-col :span="1"><el-button size="mini" type="" style="margin-left:5px" @click="currentPage=1;loading=true;getData(1)">搜索</el-button></el-col>
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
  import { getWarningList, queryWarning, wariningDropList } from '@/network/security.js'
  export default {
    name: "vueLC",
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
        dialogName: '',
        queryData: {
          mac: '',
          ip: '',
          start_time: '',
          end_time: '',
        },
        mac_list: [],
        ip_list: [],
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
      wariningDropList('').then(res=>{
        this.ip_list = res.data.ips;
        this.mac_list = res.data.macs;
        this.getData(0);
      })
    },
    methods:{
      getData(method) {
        if(method == 0) {
          getWarningList(this.currentPage).then(res=>{
            // console.log(res);
            this.pageNum = res.data.count;
            this.tableData = res.data.data;
            this.loading = false;
          }).catch(e=>{
            console.log(e);
            this.$message.error('请联系后端询问服务器是否出现问题')
          })
        } else if(method == 1) {
          if(this.queryData.mac==''&&this.queryData.ip==''&&this.queryData.start_time==''&&this.queryData.end_time=='') {
            this.$message.error('请输入搜索信息');
            this.loading = false;
          } else {
            let params = {
              mac: this.queryData.mac,
              ip: this.queryData.ip,
              start_time: this.queryData.start_time==''?0:parseInt((new Date(this.queryData.start_time)).valueOf()/1000),
              end_time: this.queryData.end_time==''?parseInt((new Date()).valueOf()/1000):parseInt((new Date(this.queryData.end_time)).valueOf()/1000),
              p: this.currentPage
            }
            if(params.start_time>params.end_time) {
              this.$message.error('请确保开始时间早于当前时间')
            } else {
              queryWarning(params).then(res=>{
                this.pageNum = res.data.count;
                this.tableData = res.data.data;
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
