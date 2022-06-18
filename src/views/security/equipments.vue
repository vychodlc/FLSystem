<template>
  <div class="post-container" v-loading="loading">
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
      :data="tableData"
      style="width: 100%;height: calc(100vh - 142px);overflow-y:scroll"
      class="elTable">
      <el-table-column label="MAC地址" prop="macAddress"></el-table-column>
      <el-table-column label="IP地址" prop="ipAddress"></el-table-column>
      <el-table-column label="CPU物理核心数" prop="cpuPhysicalCores"></el-table-column>
      <el-table-column label="指令信息集" prop="instructionSet"></el-table-column>
      <el-table-column label="CPU速度" prop="cpuSpeed"></el-table-column>
      <el-table-column label="CPU架构版本" prop="cpuVersion"></el-table-column>
      <el-table-column label="CPU寄存器信息" prop="cpuRegisterInfo"></el-table-column>
      <el-table-column label="系统内存大小" prop="systemMemorySize"></el-table-column>
      <el-table-column label="系统硬盘大小" prop="systemHardDiskSize"></el-table-column>
      <el-table-column label="SIM卡IMEI信息" prop="imei"></el-table-column>
      <el-table-column label="SIM卡IMSI信息" prop="imsi"></el-table-column>
      <el-table-column label="SIM卡ICCID信息" prop="iccid"></el-table-column>
      <el-table-column label="电信业务端口" prop="businessPort"></el-table-column>
      <el-table-column label="设备注册时间" prop="registrationTime"></el-table-column>
      <el-table-column label="设备流量阻隔" prop="blockStatus">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.blockStatus"
            @change="blockChange(scope.row)">
          </el-switch>
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
  import { getDeviceList,queryDevice,block,deviceDropList } from '@/network/security.js'
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
      deviceDropList('').then(res=>{
        this.ip_list = res.data.ips;
        this.mac_list = res.data.macs;
        this.getData(0);
      })
    },
    methods:{
      getData(method) {
        if(method == 0) {
          getDeviceList(this.currentPage).then(res=>{
            this.pageNum = res.data.count;
            this.tableData = res.data.data;
            this.tableData.forEach((item,index)=>{
              this.tableData[index].blockStatus = item.blockStatus=='DROP';
            });
            console.log(this.tableData);
            this.loading = false;
          }).catch(e=>{
            console.log(e);
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
              queryDevice(params).then(res=>{
                this.pageNum = res.data.count;
                this.tableData = res.data.data;
                this.tableData.forEach((item,index)=>{
                  this.tableData[index].blockStatus = item.blockStatus=='DROP';
                });
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
        this.queryData = {
          mac: '',
          ip: '',
          start_time: '',
          end_time: '',
        };
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
      blockChange(row) {
        this.loading = true;
        let params = {
          ip: row.ipAddress,
          mac: row.macAddress,
          block_action: row.blockStatus?'DROP':'ACCEPT',
        };
        console.log("当前状态：",row.blockStatus,params.block_action);
        let oldStatus = row.blockStatus;
        block(params).then(res=>{
          let status = res.data.request_status;
          let text1 = row.blockStatus?'阻隔':'连通';
          console.log("改变后状态：",res.data.block_status);
          let text2 = '';
          let text3 = '';
          if(res.data.block_status=='ACCEPT'){
            text2 = '连通';
            text3 = res.data.request_status=='0'?'连通失败！':'连通成功！';
          }
          else{
            text2 = '阻隔';
            text3 = res.data.request_status=='0'?'阻隔失败！':'阻隔成功！';
          }
          // let text2 = res.data.block_status=='ACCEPT'?'连通':'阻隔';
          // let text3 = res.data.request_status=='0'?'不好意思阻隔失败咯！':'恭喜你！阻隔成功啦！';
          this.loading = false;
          this.$alert(
            '用户请求修改为：'+text1+' <br/>'+'当前阻隔状态：'+text2+' <br/>'+'详情：'+text3+' <br/>',
            '阻隔切换结果',
            {confirmButtonText: '确定', dangerouslyUseHTMLString: true}
          );
          row.blockStatus = status=='0'?(!oldStatus):(oldStatus);
        })
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
