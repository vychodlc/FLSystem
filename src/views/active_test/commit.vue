<template>
  <div class="input" v-loading="loading">
    <div class="form">
      <el-form label-width="150px" size="medium">
        <el-form-item label="测量工具">
          <template>
            <el-radio v-model="inputInfo.performance" label="1">时延测量</el-radio>
            <el-radio v-model="inputInfo.performance" label="2">流量测量</el-radio>
            <el-radio v-model="inputInfo.performance" label="3">抖动测量</el-radio>
            <el-radio v-model="inputInfo.performance" label="4">带宽测量</el-radio>
          </template>
        </el-form-item>
        <el-form-item label="测量业务">
          <el-input v-model="inputInfo.business_name"></el-input>
        </el-form-item>
        <el-form-item label="源探针">
          <el-input v-model="inputInfo.source"></el-input>
        </el-form-item>
        <el-form-item label="目的地址">
          <el-input v-model="inputInfo.target"></el-input>
        </el-form-item>
        <el-form-item label="测量周期">
          <template>
            <el-row>
              <el-col :span="4"><el-input v-model="inputInfo.internal"></el-input></el-col>
              <el-col :span="2" :offset="1"><el-radio v-model="inputInfo.internal" label="0">立即</el-radio></el-col>
              <el-col :span="2"><el-radio v-model="inputInfo.internal" label="300">5分钟</el-radio></el-col>
              <el-col :span="2"><el-radio v-model="inputInfo.internal" label="600">10分钟</el-radio></el-col>
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
        height='300'
        style="width: 100%;overflow:hidden;"
        :row-style="{height: '30px'}"
        :data="newItems">
        <el-table-column label="测量工具" prop="performance"></el-table-column>
        <el-table-column label="测量业务" prop="business_name"></el-table-column>
        <el-table-column label="源探针" prop="source"></el-table-column>
        <el-table-column label="目的地址" prop="target"></el-table-column>
        <el-table-column label="测量周期" prop="internal"></el-table-column>
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
        <el-button type="primary" @click="goCommit" size="medium">确 定</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  var XLSX = require("xlsx");
  export default {
    name: "Input",
    data () {
      return {
        search: '',
        isSearch: false,
        inputInfo: {
          performance: '',
          business_name: '',
          source: '',
          target: '',
          internal: '',
        },
        loading: true,
        newItems: [],
        fileList: [],
        performanceList: ['时延测量','流量测量','抖动测量','带宽测量']
      }
    },
    methods:{
      goAdd() {
        if(this.inputInfo.performance=='') {
          this.$message.error('请选择测量工具')
        } else if(this.inputInfo.business_name=='') {
          this.$message.error('请输入测量业务')
        } else if(this.inputInfo.source=='') {
          this.$message.error('请输入源探针')
        } else if(this.inputInfo.target=='') {
          this.$message.error('请输入目的地址')
        } else if(this.inputInfo.internal=='') {
          this.$message.error('请输入测量周期')
        } else if(this.inputInfo.internal!=parseInt(this.inputInfo.internal)) {
          this.$message.error('请确认测量周期为非负整数')
        } else {
          let newItem = this.inputInfo;
          newItem.performance = this.performanceList[parseInt(newItem.performance)]
          this.newItems.push(newItem);
          this.inputInfo = {
            performance: '',
            business_name: '',
            source: '',
            target: '',
            internal: '',
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
              let newItem = {performance: '',business_name: '',source: '',target: '',internal: ''}
              newItem.performance = item['测量工具']
              newItem.business_name = item['测试业务']
              newItem.source = item['源探针']
              newItem.target = item['主站ip']
              newItem.internal = item['测量周期']
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
        console.log(this.newItems);
      }
    },
    mounted() {
      this.loading = false;
      this.newItems = [
        // {performance: 'test2',business_name: '22',source: 'wq',target: 'fq',internal: 'right_now'},
        // {performance: 'test3',business_name: 'efq',source: 'fq',target: 'qfw',internal: 'five_min'},
        // {performance: 'test2',business_name: 'wqf',source: 'fqw',target: 'fqw',internal: 'five_min'},
        // {performance: 'test1',business_name: 'fqw',source: 'fwq',target: 'qqf',internal: 'right_now'},
        // {performance: 'test4',business_name: 'fq',source: 'fwq',target: 'wffwq',internal: 'ten_min'},
      ]
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