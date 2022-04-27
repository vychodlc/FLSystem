<template>
  <div class="post-container" v-loading="loading">
    <el-form style="height: 30px;line-height:30px">
      <el-form-item>
        <el-row>
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
          <el-col :span="1"><el-button size="mini" type="" style="margin-left:5px" @click="currentPage=1;loading=true;getData(1)">搜索</el-button></el-col>
          <el-col :span="1"><el-button size="mini" v-if="isSearch==true" type="primary" style="margin-left:10px" @click="goBack">返回</el-button></el-col>
        </el-row>
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      style="width: 100%;height: calc(100vh - 145px);overflow-y:scroll"
      class="elTable">
      <el-table-column label="源探针" prop="cpe_ip"></el-table-column>
      <el-table-column label="测量业务" prop="business_name"></el-table-column>
      <el-table-column label="测量工具" prop="mea_type"></el-table-column>
      <el-table-column label="目的地址" prop="ser_ip"></el-table-column>
      <el-table-column label="测量方式" prop="internal"></el-table-column>
      <el-table-column label="测量时间" prop="time"></el-table-column>
      <el-table-column label="状态" prop="mea_status" width="100">
        <template slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.mea_status=='异常'" type="warning">异常</el-tag>
          <el-tag size="mini" v-if="scope.row.mea_status=='完成'" type="success">完成</el-tag>
          <el-tag size="mini" v-if="scope.row.mea_status=='等待'" type="info">等待</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="right" width="200">
        <template slot-scope="scope">
          <el-button
            v-if='scope.row.mea_status=="完成"'
            size="mini"
            @click="showDetail(scope.row)">查看</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="dialogName" :visible.sync="dialogStatusVisible" :modal-append-to-body="false">
      <div v-if="dialogName=='时延测量'">
        <el-row :gutter="20">
          <el-col :span="6">
            <div id="echarts_1_pie_1" style="width: 100%; height: 30vh;"></div>
          </el-col>
          <el-col :span="6">
            <div id="echarts_1_pie_2" style="width: 100%; height: 30vh;"></div>
          </el-col>
          <el-col :span="6">
            <div id="echarts_1_pie_3" style="width: 100%; height: 30vh;"></div>
          </el-col>
          <el-col :span="6">
            <div id="echarts_1_pie_4" style="width: 100%; height: 30vh;"></div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <div style="width:100%;text-align:center;font-size:20px">探针测试值</div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <div id="echarts_1_line_1" style="width: 100%; height: 20vh;"></div>
          </el-col>
          <el-col :span="12">
            <div id="echarts_1_line_2" style="width: 100%; height: 20vh;"></div>
          </el-col>
        </el-row>
      </div>
      <div v-if="dialogName=='流量测量'">
        <el-row :gutter="20">
          <el-col :span="12">
            <div id="echarts_2_line_1" style="width: 100%; height: 30vh;"></div>
          </el-col>
          <el-col :span="12">
            <div id="echarts_2_line_2" style="width: 100%; height: 30vh;"></div>
          </el-col>
        </el-row>
      </div>
      <div v-if="dialogName=='抖动测量'">
        <el-row :gutter="20">
          <el-col :span="12">
            <div id="echarts_3_pie_1" style="width: 100%; height: 30vh;"></div>
          </el-col>
          <el-col :span="12">
            <div id="echarts_3_pie_2" style="width: 100%; height: 30vh;"></div>
          </el-col>
        </el-row>
      </div>
      <div v-if="dialogName=='带宽测量'">
        <el-row :gutter="20">
          <el-col :span="24">
            <div id="echarts_4_pie_1" style="width: 100%; height: 40vh;"></div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6" :offset="6">
            <div style="width:100%;text-align:center">下行带宽</div>
            <div style="width:100%;text-align:center">{{bandwidth.receiver_bandwidth}} kbps</div>
          </el-col>
          <el-col :span="6">
            <div style="width:100%;text-align:center">上行带宽</div>
            <div style="width:100%;text-align:center">{{bandwidth.sender_bandwidth}} kbps</div>
          </el-col>
        </el-row>
      </div>
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
  import { getList,getFilterList,getDetail,getIPList,deleteItem } from '@/network/active_test.js'
  export default {
    name: "Post",
    data () {
      return {
        search: null,
        searchWord: null,
        filter: 'cpe_ip',
        filterWord: null,
        isSearch: false,
        queryData: {
          cpe_ip: '',
          ser_ip: '',
          start_time: '',
          end_time: ''
        },

        loading: true,
        tableData: [],
        tags: null,
        dialogStatusVisible: false,
        dialogStatus: null,
        oldPost: null,
        pageNum: 100,
        currentPage: 1,
        interpret: {
          'cpe_ip': {name:'源探针'},
          'ser_ip': {name:'目的地址'},
          'start_time': {name:'开始时间'},
          'end_time': {name:'结束时间'}
        },
        dialogName: '',
        bandwidth: {
          sender_bandwidth: 0,
          receiver_bandwidth: 0
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
      this.currentPage = 1;
      this.loading = true;
      getIPList('').then(res=>{
        this.cpe_ip_list = res.data.cpe_ips;
        this.business_ser_ip_list = res.data.business_ser_ips;
        this.getData(0);
      })
    },
    methods:{
      getData(method) {
        if(method == 0) {
          getList(this.currentPage).then(res=>{
            this.pageNum = res.data.count;
            this.tableData = res.data.items;
            this.tableData.map(item=>{
              let d = new Date(item.time);
              item.time = d.toISOString().replace('T', ' ').replace('.000Z', '')
            });
            this.loading = false;
          }).catch(e=>{
            console.log(e);
          })
        } else if(method == 1) {
          if(this.queryData.cpe_ip==''&&this.queryData.ser_ip==''&&this.queryData.start_time==''&&this.queryData.end_time=='') {
            this.$message.error('请确保输入检索信息')
            this.loading = false;
          } else {
            let params = {
              cpe_ip: this.queryData.cpe_ip,
              ser_ip: this.queryData.ser_ip,
              start_time: this.queryData.start_time==''?0:parseInt((new Date(this.queryData.start_time)).valueOf()/1000),
              end_time: this.queryData.end_time==''?parseInt((new Date()).valueOf()/1000):parseInt((new Date(this.queryData.end_time)).valueOf()/1000),
              p: this.currentPage
            }
            if(params.start_time>params.end_time) {
              this.$message.error('请确保开始时间早于当前时间')
              this.loading = false;
            } else {
              getFilterList(params).then(res=>{
                this.pageNum = res.data.count;
                this.tableData = res.data.items;
                this.isSearch = true;
                this.tableData.map(item=>{
                  let d = new Date(item.time);
                  item.time = d.toISOString().replace('T', ' ').replace('.000Z', '')  
                });
                this.loading = false;
              }).catch(e=>{
                console.log(e);
              })
            }
          }
        }
      },
      filterChange() {
        this.search = ''
      },
      goBack() {
        this.queryData = {
          cpe_ip: '',
          ser_ip: '',
          start_time: '',
          end_time: ''
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
      handleDelete(index, row) {
        this.$confirm('此操作将永久删除该测试结果, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true;
          deleteItem(row.mea_id).then(res => {
            if(res.data=="delete_measure success!") {
              this.$message.success('测量结果删除成功')
              this.loading = true;
              this.getData(this.isSearch?1:0)
            } else {
              this.$message.error('测量结果删除失败')
            }
            this.loading = false;
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      },
      
      showDetail(row) {
        getDetail(row.mea_id).then(res=>{
          this.dialogStatusVisible = true;
          this.dialogName = row.mea_type;
          if(row.mea_type=='delay') {
            this.dialogName = '时延测量';
            this.$nextTick(() => {
              this.showChart1(res.data);
            })
          } else if(row.mea_type=='traffic') {
            this.dialogName = '流量测量';
            this.$nextTick(() => {        
              this.showChart2(res.data);
            })
          } else if(row.mea_type=='jitter') {
            this.dialogName = '抖动测量';
            this.$nextTick(() => {        
              this.showChart3(res.data);
            })
          } else if(row.mea_type=='bandwidth') {
            this.dialogName = '带宽测量';
            this.$nextTick(() => {        
              this.showChart4(res.data);
            })
          }
        })        
      },

      showChart1(chartData) {
        let colorList = [];
        let status = '';
        if(chartData.performance=='abnormal') {
          colorList = ["#FDE047","#FEF08A","#FEF9C3"];
          status = '异常';
        } else {
          colorList = ["#22C55E","#a9d8a9","#cee9ce"]
          status = '良好';
        }
        let option_pie_1 = {
          title: {
              text: status,
              subtext: '网络性能',
              left: 'center',
              top: 'center',
              textStyle: {
                  color: '#fff',
                  fontFamily: 'DINAlternate-Bold',
              },
              subtextStyle: {
                  color: '#fff',
                  fontFamily: 'PingFangSC-Regular',
                  top: 'center'
              },
              itemGap: 0 //主副标题间距
          },
          series: [
            {
              type: "pie",
              silent: true,
              radius: ["0%", "60%"],
              center: ["50%", "50%"],
              itemStyle: { normal: { color: colorList[0] }},
              data: [{ value: 3235 }],
              label: {normal: {show: false}},
            },
            {
              type: "pie",
              silent: true,
              radius: ["60%", "75%"],
              center: ["50%", "50%"],
              itemStyle: { normal: { color: colorList[1] }},
              data: [{ value: 3235 }],
              label: {normal: {show: false}},
            },
            {
              type: "pie",
              silent: true, 
              radius: ["75%", "90%"],
              center: ["50%", "50%"],
              itemStyle: { normal: { color: colorList[2] }},
              data: [{ value: 3235 }],
              label: {normal: {show: false}},
            }
          ]
        };
        let value_loss = chartData.loss;
        let option_pie_2 = {
          title: {
              text: value_loss+'%',
              subtext: '丢包率',
              left: 'center',
              top: 'center',
              textStyle: {
                  color: '#fb7a53',
                  fontFamily: 'DINAlternate-Bold',
              },
              subtextStyle: {
                  color: '#fb7a53',
                  fontFamily: 'PingFangSC-Regular',
                  top: 'center'
              },
              itemGap: 0 //主副标题间距
          },
          series: [
            {
              type: "pie",
              silent: true, 
              radius: ["60%", "90%"],
              center: ["50%", "50%"],
              label: {normal: {show: false}},
              data: [
                {
                  value: value_loss,
                  itemStyle: {
                    normal: {
                      label: {
                        show: false
                      },
                      labelLine: {
                        show: false
                      },
                      color: '#fb7a53',
                    }
                  },
                },
                {
                  name: 'gap',
                  value: 100 - value_loss,
                  itemStyle: {
                    normal: {
                      label: {
                        show: false
                      },
                      labelLine: {
                        show: false
                      },
                      color: '#dcdcdc',
                      borderColor: '#dcdcdc',
                      borderWidth: 0,
                    }
                  },
                }
              ]
            }
          ]
        };
        let value_delay = chartData.avg_delay;
        let option_pie_3 = {
          title: {
              text: value_delay+'ms',
              subtext: '时延值',
              left: 'center',
              top: 'center',
              textStyle: {
                  color: '#0397d5',
                  fontFamily: 'DINAlternate-Bold',
              },
              subtextStyle: {
                  color: '#0397d5',
                  fontFamily: 'PingFangSC-Regular',
                  top: 'center'
              },
              itemGap: 0 //主副标题间距
          },
          series: [
            {
              type: "pie",
              silent: true, 
              radius: ["60%", "90%"],
              center: ["50%", "50%"],
              label: {normal: {show: false}},
              data: [
                {
                  value: value_delay,
                  itemStyle: {
                    normal: {
                      label: {
                        show: false
                      },
                      labelLine: {
                        show: false
                      },
                      color: '#0397d5',
                    }
                  },
                },
                {
                  name: 'gap',
                  value: 1 - value_delay,
                  itemStyle: {
                    normal: {
                      label: {
                        show: false
                      },
                      labelLine: {
                        show: false
                      },
                      color: '#dcdcdc',
                      borderColor: '#dcdcdc',
                      borderWidth: 0,
                    }
                  },
                }
              ]
            }
          ]
        };
        let value_shake = chartData.jitter;
        let option_pie_4 = {
          backgroundColor: '#fff',
          graphic: [{
              type: 'group',
              left: 'center',
              top: '55%',
              children: [{
                type: 'text',
                z: 100,
                left: 'center',
                style: {
                  fill: '#12bffe',
                  text: '抖动',
                  font: '12px Microsoft YaHei'
                }
              }]
          }],
          series: [{
            type: 'liquidFill',
            silent: true, 
            animationDuration: 1000,   
            color: ['#12bffe'],
            data: [value_shake],
            waveAnimation: false,
            radius: "90%",
            center: ['50%','50%'],
            outline: {
              show: true,
              borderDistance: 4,
              itemStyle: {
                color: 'none',
                borderColor: '#12bffe',
                borderWidth: 4,
                shadowBlur: 0,
                shadowColor: 'rgb(0, 0, 0)'
              }
            },
            backgroundStyle: {
              color: '#ffffff'
            },
            label: {
              show: true,
              insideColor: '#fff',
              fontWeight: 'bold',
              align: 'center',
              baseline: 'middle',
              position: 'inside',
              normal: {
                formatter: '{c}',
                fontSize: 20,
                color: '#12bffe',
              }
            },
            itemStyle: {
              opacity: 1,
              shadowBlur: 0,
              shadowColor: 'rgba(0, 0, 0)'
            },
          }],
        }
        let option_pie = {
          series: [
            {
              name: 'Access From',
              type: 'pie',
              radius: '100%',
              label: {
                show: false,
              },
              data: [
                { value: 1048, name: 'Search Engine' },
                { value: 735, name: 'Direct' },
                { value: 580, name: 'Email' },
                { value: 484, name: 'Union Ads' },
                { value: 300, name: 'Video Ads' }
              ],
            }
          ]
        };
        let data1 = [chartData.max_delay, chartData.min_delay, chartData.avg_delay];
        let data2 = ['200', '100', '111'];
        let className = ['MAX', 'MIN', 'AVG'];
        let colorBar = ['#34accf', '#3188fd', '#12288e'];
        let option_bar = {
            grid: {
                left: '0px',
                right: '0px',
                bottom: '0px',
                top: '0px',
                containLabel: true
            },
            xAxis: {
                show: false,
                type: 'value',
                max: chartData.max_delay*1.002,
                min: chartData.min_delay*0.999,
            },
            yAxis: [{
                type: 'category',
                inverse: true,
                axisLabel: {
                    show: true,
                    textStyle: {
                        color: '#000'
                    },
                },
                splitLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                axisLine: {
                    show: false
                },
                data: className
            }],
            series: [{
              name: '探针测试值',
              silent: true, 
              type: 'bar',
              zlevel: 1,
              itemStyle: {
                normal: {
                  barBorderRadius: 0,
                  color: (params) => {
                    return colorBar[params.dataIndex]
                  }
                },
              },
              label: {
                show: true,
                position: 'right', // 位置
                color: '#000',
                fontSize: 14,
                distance: 8,// 距离
                formatter: '{c}',
              }, // 柱子上方的数值
              barWidth: 20,
              data: data1
            }]
        };
        let option_line = {
          xAxis: {
            type: 'category',
            data: [
              '1', '2', '3', '4', '5'
            ],
            boundaryGap: false
          },
          yAxis: {
            type: 'value',
            max: 1,
          },
          tooltip: {
            trigger: 'axis'
          },
          grid: {
            containLabel: true,
            top: '10px',
            bottom: '0px',
            left: '20px',
            right: '20px',
          },
          color:['#5a72e0'],
          series: [{
            data: [0.8, 0.5, 0.2, 0.5,0.2],
            type: 'line',
            smooth: true,
              areaStyle: {
                color: this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: 'rgba(32,128,247,.4)'
                  },
                  {
                    offset: 1,
                    color: 'rgba(32,128,247,0)'
                  }
                ])
            },
          }]
        };
        if(document.getElementById('echarts_1_pie_1')!=null) {
          this.clearChart();
          this.$echarts.init(document.getElementById('echarts_1_pie_1')).setOption(option_pie_1);
        }
        if(document.getElementById('echarts_1_pie_2')!=null) {
          this.clearChart();
          this.$echarts.init(document.getElementById('echarts_1_pie_2')).setOption(option_pie_2);
        }
        if(document.getElementById('echarts_1_pie_3')!=null) {
          this.clearChart();
          this.$echarts.init(document.getElementById('echarts_1_pie_3')).setOption(option_pie_3);
        }
        if(document.getElementById('echarts_1_pie_4')!=null) {
          this.clearChart();
          this.$echarts.init(document.getElementById('echarts_1_pie_4')).setOption(option_pie_4);
        }
        if(document.getElementById('echarts_1_line_1')!=null) {
          this.clearChart();
          this.$echarts.init(document.getElementById('echarts_1_line_1')).setOption(option_bar);
        }
        if(document.getElementById('echarts_1_line_2')!=null) {
          this.clearChart();
          this.$echarts.init(document.getElementById('echarts_1_line_2')).setOption(option_line);
        }
      },
      showChart2(chartData) {
        let data1 = [chartData.max_input, chartData.min_input, chartData.avg_input];
        let data2 = [chartData.max_output, chartData.min_output, chartData.avg_output];
        let className = ['max', 'min', 'avg'];
        let colorBar = ['#34accf', '#3188fd', '#12288e'];
        let option = {
            grid: {
                left: '5%',
                right: '5%',
                bottom: '5%',
                top: '20%',
                containLabel: true
            },
            title: {
                text: '出境流量',
                x: 'center',
                y: 'top',
                textalign: 'center',
                textStyle: {
                    color: 'black',
                    fontSize: 15,
                },
            },
            xAxis: {
                show: false,
                type: 'value'
            },
            yAxis: [{
                type: 'category',
                inverse: true,
                axisLabel: {
                    show: true,
                    textStyle: {
                        color: '#000'
                    },
                },
                splitLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                axisLine: {
                    show: false
                },
                data: className
            }],
            series: [{
                name: '攻击次数',
                type: 'bar',
                zlevel: 1,
                itemStyle: {
                    normal: {
                        barBorderRadius: 0,
                        color: (params) => {
                            return colorBar[params.dataIndex]
                        }
                    },
                },
                label: {
                    show: true,
                    position: 'top', // 位置
                    color: '#000',
                    fontSize: 14,
                    distance: 2,// 距离
                    formatter: '{c}',
                }, // 柱子上方的数值
                barWidth: 20,
                data: data1
            }]
        };
        if(document.getElementById('echarts_2_line_1')!=null) {
          option.title.text = '入境流量';
          option.series[0].data = data1;
          this.clearChart();
          this.$echarts.init(document.getElementById('echarts_2_line_1')).setOption(option);
        } 
        if(document.getElementById('echarts_2_line_2')!=null) {
          option.title.text = '出境流量';
          option.series[0].data = data2;
          this.clearChart();
          this.$echarts.init(document.getElementById('echarts_2_line_2')).setOption(option);
        } 
      },
      showChart3(chartData) {
        let colorList = [];
        let status = '';
        if(chartData.performance=='abnormal') {
          colorList = ["#FDE047","#FEF08A","#FEF9C3"];
          status = '异常';
        } else {
          colorList = ["#22C55E","#a9d8a9","#cee9ce"]
          status = '良好';
        }
        let option_pie_1 = {
          title: {
              text: status,
              subtext: '网络性能',
              left: 'center',
              top: 'center',
              textStyle: {
                  color: '#fff',
                  fontFamily: 'DINAlternate-Bold',
              },
              subtextStyle: {
                  color: '#fff',
                  fontFamily: 'PingFangSC-Regular',
                  top: 'center'
              },
              itemGap: 0 //主副标题间距
          },
          series: [
            {
              type: "pie",
              silent: true,
              radius: ["0%", "60%"],
              center: ["50%", "50%"],
              itemStyle: { normal: { color: colorList[0] }},
              data: [{ value: 3235 }],
              label: {normal: {show: false}},
            },
            {
              type: "pie",
              silent: true,
              radius: ["60%", "75%"],
              center: ["50%", "50%"],
              itemStyle: { normal: { color: colorList[1] }},
              data: [{ value: 3235 }],
              label: {normal: {show: false}},
            },
            {
              type: "pie",
              silent: true, 
              radius: ["75%", "90%"],
              center: ["50%", "50%"],
              itemStyle: { normal: { color: colorList[2] }},
              data: [{ value: 3235 }],
              label: {normal: {show: false}},
            }
          ]
        };
        let value_shake = chartData.jitter;
        let option_pie_2 = {
          backgroundColor: '#fff',
          graphic: [{
              type: 'group',
              left: 'center',
              top: '55%',
              children: [{
                type: 'text',
                z: 100,
                left: 'center',
                style: {
                  fill: '#12bffe',
                  text: '抖动',
                  font: '12px Microsoft YaHei'
                }
              }]
          }],
          series: [{
            type: 'liquidFill',
            silent: true, 
            animationDuration: 1000,   
            color: ['#12bffe'],
            data: [value_shake],
            waveAnimation: false,
            radius: "90%",
            center: ['50%','50%'],
            outline: {
              show: true,
              borderDistance: 4,
              itemStyle: {
                color: 'none',
                borderColor: '#12bffe',
                borderWidth: 4,
                shadowBlur: 0,
                shadowColor: 'rgb(0, 0, 0)'
              }
            },
            backgroundStyle: {
              color: '#ffffff'
            },
            label: {
              show: true,
              insideColor: '#fff',
              fontWeight: 'bold',
              align: 'center',
              baseline: 'middle',
              position: 'inside',
              normal: {
                formatter: '{c}',
                fontSize: 20,
                color: '#12bffe',
              }
            },
            itemStyle: {
              opacity: 1,
              shadowBlur: 0,
              shadowColor: 'rgba(0, 0, 0)'
            },
          }],
        }
        if(document.getElementById('echarts_3_pie_1')!=null) {
          this.clearChart();
          this.$echarts.init(document.getElementById('echarts_3_pie_1')).setOption(option_pie_1);
        }
        if(document.getElementById('echarts_3_pie_2')!=null) {
          this.clearChart();
          this.$echarts.init(document.getElementById('echarts_3_pie_2')).setOption(option_pie_2);
        }
      },
      showChart4(chartData) {
        this.bandwidth = chartData
        let option = {
          series: [{
            name: '带宽测量',
            type: 'gauge',
            radius: '100%',
            detail: {formatter:'{value} kbps'},
            data: [{value: chartData.sender_bandwidth}],
            axisLine: {
              lineStyle: {
                length: 18,
                color: [
                  [0.8, '#66b8ff'],
                  [1, '#f56a27'],
                ]
              }
            },
            grid: {
              top: '0%',
              left: '0%',
              right: '0%',
              bottom: '0%',
            }
          }]
        };
        if(document.getElementById('echarts_4_pie_1')!=null) {
          this.clearChart();
          this.$echarts.init(document.getElementById('echarts_4_pie_1')).setOption(option);
        } 
      },
      clearChart() {
        let chartList = [
          'echarts_1_pie_1','echarts_1_pie_2','echarts_1_pie_3','echarts_1_pie_4','echarts_1_line_1','echarts_1_line_2',
          'echarts_2_line_1','echarts_2_line_2',
          'echarts_3_pie_1','echarts_3_pie_2',
          'echarts_4_pie_1',
        ]
        for(let i=0; i<chartList.length; i++) {
          if(document.getElementById(chartList[i])!=null) {
            document.getElementById(chartList[i]).removeAttribute("_echarts_instance_");
          }
        }
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