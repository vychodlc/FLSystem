<template>
  <div class="input" v-loading="loading">
    <div class="form">
      <el-form label-width="150px" size="medium">
        <el-form-item label="测量工具">
          <template>
            <el-radio v-model="inputInfo.measure_type" label="0">时延测量</el-radio>
            <el-radio v-model="inputInfo.measure_type" label="1">流量测量</el-radio>
            <el-radio v-model="inputInfo.measure_type" label="2">抖动测量</el-radio>
            <el-radio v-model="inputInfo.measure_type" label="3">带宽测量</el-radio>
          </template>
        </el-form-item>
        <el-form-item label="测量业务">
          <el-select 
          @change='businessChecked()'
          v-model="inputInfo.business_name" style="width:80%" clearable placeholder="请选择测量业务">
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
          <el-select v-model="inputInfo.cpe_ip" :disabled='cpe_ip_list.length==0'  style="width:80%" placeholder="请选择源探针">
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
        <el-form-item label="测量周期">
          <template>
            <el-row>
              <el-col :span="4"><el-input v-model="inputInfo.interval" size="medium"></el-input></el-col>
              <el-col :span="2" :offset="1"><el-radio v-model="inputInfo.interval" label="0">立即</el-radio></el-col>
              <el-col :span="2"><el-radio v-model="inputInfo.interval" label="300">5分钟</el-radio></el-col>
              <el-col :span="2"><el-radio v-model="inputInfo.interval" label="600">10分钟</el-radio></el-col>
            </el-row>            
          </template>
        </el-form-item>
      </el-form>
      <div class="footer" style="margin-bottom:20px">
        <el-button type="success" @click="goAdd" size="mini">确 定</el-button>
        <el-upload
          ref="upload"
          class="upload"
          action=""
          accept=".xlsx"
          :show-file-list="false"
          :http-request="httpRequest"
          :limit="1"
          :file-list="fileList">
          <el-button size="mini" style="margin-left:10px" type="primary">点击上传</el-button>
        </el-upload>
      </div>
      <el-table
        height='250'
        style="width: 100%;overflow:hidden;"
        :row-style="{height: '30px'}"
        :data="newItems">
        <el-table-column label="测量工具" prop="measure_type"></el-table-column>
        <el-table-column label="测量业务" prop="business_name"></el-table-column>
        <el-table-column label="源探针" prop="cpe_ip"></el-table-column>
        <el-table-column label="目的地址" prop="business_ser_ip"></el-table-column>
        <el-table-column label="测量周期" prop="interval"></el-table-column>
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
        <el-button type="primary" :disabled='newItems.length==0' @click="goCommit" size="mini">确 定</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import {sendTask,getBusinessList,getIPList} from '@/network/active_test.js'
  var XLSX = require("xlsx");
  export default {
    name: "Input",
    data () {
      return {
        search: '',
        isSearch: false,
        inputInfo: {
          measure_type: '',
          business_name: '',
          cpe_ip: '',
          business_ser_ip: '',
          interval: '',
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
      businessChecked() {
        if(this.inputInfo.business_name=='') {
          this.cpe_ip_list = [];
          this.business_ser_ip_list = [];
          this.inputInfo.cpe_ip = '';
          this.inputInfo.business_ser_ip = '';
        } else {
          getIPList(this.inputInfo.business_name).then(res=>{
            this.cpe_ip_list = res.data.cpe_ips;
            this.business_ser_ip_list = res.data.business_ser_ips;
            
            this.inputInfo.cpe_ip = this.cpe_ip_list[0];
            this.inputInfo.business_ser_ip = this.business_ser_ip_list[0];
          })
        }        
      },
      goAdd() {
        if(this.inputInfo.measure_type=='') {
          this.$message.error('请选择测量工具')
        } else if(this.inputInfo.business_name=='') {
          this.$message.error('请输入测量业务')
        } else if(this.inputInfo.cpe_ip=='') {
          this.$message.error('请输入源探针')
        } else if(this.inputInfo.business_ser_ip=='') {
          this.$message.error('请输入目的地址')
        } else if(this.inputInfo.interval=='') {
          this.$message.error('请输入测量周期')
        } else if(this.inputInfo.interval!=parseInt(this.inputInfo.interval)) {
          this.$message.error('请确认测量周期为非负整数')
        } else {
          let newItem = this.inputInfo;
          newItem.measure_type = this.measure_typeList[parseInt(newItem.measure_type)]
          this.newItems.push(newItem);
          this.cpe_ip_list = [];
          this.business_ser_ip_list = [];
          this.inputInfo = {
            measure_type: '',
            business_name: '',
            cpe_ip: '',
            business_ser_ip: '',
            interval: '',
          };
        }
      },
      httpRequest(e) {
        let file = e.file;
        if (!file) {
          return false
        } else if (!/\.(xls|xlsx)$/.test(file.name.toLowerCase())) {
          this.$message.error('上传格式不正确，请上传xls或者xlsx格式')
          return false
        }
        const fileReader = new FileReader()
        fileReader.onload = (ev) => {
          try {
            const data = ev.target.result
            const workbook = XLSX.read(data, {type: 'binary'})
            const exlname = workbook.SheetNames[0]
            const exl = XLSX.utils.sheet_to_json(workbook.Sheets[exlname])
            this.$refs.upload.clearFiles();
            exl.forEach(item => {
              let newItem = {measure_type: '',business_name: '',cpe_ip: '',business_ser_ip: '',interval: ''}
              newItem.measure_type = item['测量工具']
              newItem.business_name = item['测试业务']
              newItem.cpe_ip = item['源探针']
              newItem.business_ser_ip = item['主站ip']
              newItem.interval = item['测量周期']
              this.newItems.push(newItem)
            })
          } catch (e) {
            return false
          }
        }
        fileReader.readAsBinaryString(file)
      },
      handleExceed() {
        this.$message({
          type: "warning",
          message: "超出最大上传文件数量的限制！"
        });
        return;
      },
      goCommit() {
        let newItems = this.newItems
        this.newItems = [];
        let string = JSON.stringify(newItems);
        sendTask(string).then(res=>{
          if(res.data == 'request success') {
            this.$message({
              message: '测试任务下发成功',
              type: 'success'
            });
          }
        })
      }
    },
    mounted() {
      getBusinessList().then(res=>{
        this.businessList = res.data;
        this.loading = false;
      })
      this.newItems = []
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