<template>
  <div class="post-container">
    <el-form>
      <el-form-item>
        <el-row>
          <el-col :span="1" style="text-align:center">源探针</el-col>
          <el-col :span="2"><el-input size="small"></el-input></el-col>
          <el-col :span="1" style="text-align:center">目的地址</el-col>
          <el-col :span="2"><el-input size="small"></el-input></el-col>
          <el-col :span="1" style="text-align:center">开始时间</el-col>
          <el-col :span="2"><el-input size="small"></el-input></el-col>
          <el-col :span="1" style="text-align:center">结束时间</el-col>
          <el-col :span="2"><el-input size="small"></el-input></el-col>
          <el-col :span="2" :offset="1"><el-button size="small" type="" @click="goSearch">搜索</el-button></el-col>
        </el-row>
      </el-form-item>
    </el-form>
    <!-- <el-select v-model="filter" size="small" @change='filterChange' style="width:8vw;margin-right:10px" placeholder="请选择">
      <el-option label="源探针" value="source"></el-option>
      <el-option label="目的地址" value="target"></el-option>
      <el-option label="开始时间" value="start_time"></el-option>
      <el-option label="结束时间" value="end_time"></el-option>
    </el-select>
    <el-input placeholder="请输入内容" size="small" style="width:30vw;margin-right:10px" v-model="search" class="input-with-select"></el-input>
    <el-button size="small" type="" @click="goSearch">搜索</el-button>
    <el-button size="small" v-if="isSearch==true" type="primary" @click="goBack">返回</el-button>
    <el-tag size="small" closable v-if="isSearch==true" style="margin-left:10px" @close="goBack">{{filterWord}} : {{searchWord}}</el-tag> -->
    <el-table
      v-loading="loading"
      :data="tableData"
      style="width: 100%;height: calc(100vh - 142px);overflow-y:scroll"
      class="elTable">
      <el-table-column label="源探针" prop="source"></el-table-column>
      <el-table-column label="测量业务" prop="business_name"></el-table-column>
      <el-table-column label="测量工具" prop="performance"></el-table-column>
      <el-table-column label="目的地址" prop="target"></el-table-column>
      <el-table-column label="测量方式" prop="internal"></el-table-column>
      <el-table-column label="测量时间" prop="test_time"></el-table-column>
      <el-table-column label="状态" prop="status" width="100">
        <template slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.status==0" type="warning">异常</el-tag>
          <el-tag size="mini" v-if="scope.row.status==1" type="success">完成</el-tag>
          <el-tag size="mini" v-if="scope.row.status==2" type="info">等待</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="right" width="200">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="showDetail(scope.row)">查看</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
      <!-- <div id="echarts_box" style="width: 40vw; height: 30vh;position:absolute;top:0;left:0;z-index:-100;opacity:1"></div> -->
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
            <div style="width:100%;text-align:center">82728 kbps</div>
          </el-col>
          <el-col :span="6">
            <div style="width:100%;text-align:center">上行带宽</div>
            <div style="width:100%;text-align:center">82728 kbps</div>
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
  import { getList } from '@/network/active_test.js'
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
      // getList(1).then(res=>{
      //   console.log(res);
      // }).catch(e=>{
      //   console.log(e);
      // })
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
          this.$nextTick(() => {        
            this.showChart1();
          })
        } else if(row.performance=='2') {
          this.dialogName = '流量测量';
          this.$nextTick(() => {        
            this.showChart2();
          })
        } else if(row.performance=='3') {
          this.dialogName = '抖动测量';
          this.$nextTick(() => {        
            this.showChart3();
          })
        } else if(row.performance=='4') {
          this.dialogName = '带宽测量';
          this.$nextTick(() => {        
            this.showChart4();
          })
        }
      },

      showChart1() {
        let colorList = {
          good: ["#22C55E","#a9d8a9","#cee9ce"],
          error: ["#22C55E","#a9d8a9","#cee9ce"],
          warning: ["#22C55E","#a9d8a9","#cee9ce"],
        }
        let option_pie_1 = {
          title: {
              text: '良好',
              subtext: '网络连通性',
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
              itemStyle: { normal: { color: colorList.good[0] }},
              data: [{ value: 3235 }],
              label: {normal: {show: false}},
            },
            {
              type: "pie",
              silent: true,
              radius: ["60%", "75%"],
              center: ["50%", "50%"],
              itemStyle: { normal: { color: colorList.good[1] }},
              data: [{ value: 3235 }],
              label: {normal: {show: false}},
            },
            {
              type: "pie",
              silent: true, 
              radius: ["75%", "90%"],
              center: ["50%", "50%"],
              itemStyle: { normal: { color: colorList.good[2] }},
              data: [{ value: 3235 }],
              label: {normal: {show: false}},
            }
          ]
        };
        let value_loss = 70
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
        let value_delay = 0.49;
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
        let value_shake = 0.17;
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
        let data1 = ['101', '80', '58'];
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
      showChart2() {
        let data1 = ['101', '80', '58'];
        let data2 = ['200', '100', '111'];
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
      showChart3() {
        let colorList = {
          good: ["#22C55E","#a9d8a9","#cee9ce"],
          error: ["#22C55E","#a9d8a9","#cee9ce"],
          warning: ["#22C55E","#a9d8a9","#cee9ce"],
        }
        let option_pie_1 = {
          title: {
              text: '良好',
              subtext: '网络连通性',
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
              itemStyle: { normal: { color: colorList.good[0] }},
              data: [{ value: 3235 }],
              label: {normal: {show: false}},
            },
            {
              type: "pie",
              silent: true,
              radius: ["60%", "75%"],
              center: ["50%", "50%"],
              itemStyle: { normal: { color: colorList.good[1] }},
              data: [{ value: 3235 }],
              label: {normal: {show: false}},
            },
            {
              type: "pie",
              silent: true, 
              radius: ["75%", "90%"],
              center: ["50%", "50%"],
              itemStyle: { normal: { color: colorList.good[2] }},
              data: [{ value: 3235 }],
              label: {normal: {show: false}},
            }
          ]
        };
        let value_shake = 0.17;
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
      showChart4() {
        let option = {
          series: [{
            name: '带宽测量',
            type: 'gauge',
            radius: '100%',
            detail: {formatter:'{value} kbps'},
            data: [{value: 120}],
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


  /* .el-row {
    margin-bottom: 20px;
  }
  .el-row:last-child {
    margin-bottom: 0;
  }
  .el-col {
    border-radius: 4px;
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
  } */
</style>