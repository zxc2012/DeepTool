import React from 'react';
import ReactEcharts from 'echarts-for-react';
import './index.less';
import moment from 'moment';

class Dashboard extends React.Component {

  componentWillMount() {
  }

  render() {
    const now = moment(new Date()).format('YYYY-MM-DD')
    const option01 = {
      title: {
        text: '待初诊患者数',
        left: 'center',
        textStyle: {
          color: '#666'
        }
      },
      angleAxis: {
        max: 100,
        show: false,
      },
      tooltip: {
        trigger: 'item',
        formatter: '{c}%'
      },
      graphic: { //图形中间文字
        type: "text",
        left: "center",
        top: "center",
        style: {
          text: "6",
          textAlign: "center",
          fill: "#666",
          fontSize: 14,
          fontWeight: 'bold'
        }
      },
      radiusAxis: {
        type: 'category',
        show: true,
        axisLabel: {
          show: false,
        },
        axisLine: {
          show: false,

        },
        axisTick: {
          show: false
        },
      },
      polar: {
        radius: ['50%', '65%'],
        center: ['50%', '50%'],
      },
      series: [{
        type: 'bar',
        roundCap: true,
        barWidth: 40,
        showBackground: true,
        backgroundStyle: {
          color: "#ccc"
        },
        itemStyle: {
          normal: {
            opacity: 1,
            color: '#orange',
          },

        },
        data: [{
          value: 20,
          itemStyle: {
            color: 'orange',
          },

        },],
        coordinateSystem: 'polar',
        name: 'A',
        label: {
          show: true,
        },

      }],
    }
    const option02 = {
      title: {
        text: '待复诊患者数',
        left: 'center',
        textStyle: {
          color: '#666'
        }
      },
      angleAxis: {
        max: 100,
        show: false,
      },
      tooltip: {
        trigger: 'item',
        formatter: '{c}%'
      },
      graphic: { //图形中间文字
        type: "text",
        left: "center",
        top: "center",
        style: {
          text: "3",
          textAlign: "center",
          fill: "#666",
          fontSize: 14,
          fontWeight: 'bold'
        }
      },
      radiusAxis: {
        type: 'category',
        show: true,
        axisLabel: {
          show: false,
        },
        axisLine: {
          show: false,

        },
        axisTick: {
          show: false
        },
      },
      polar: {
        radius: ['50%', '65%'],
        center: ['50%', '50%'],
      },
      series: [{
        type: 'bar',
        roundCap: true,
        barWidth: 40,
        showBackground: true,
        backgroundStyle: {
          color: "#ccc"
        },
        itemStyle: {
          normal: {
            opacity: 1,
            color: '#2d82ff',
          },

        },
        data: [{
          value: 40,
          itemStyle: {
            color: '#2d82ff',
          },

        },],
        coordinateSystem: 'polar',
        name: 'A',
        label: {
          show: true,
        },

      }],
    }
    const option03 = {
      title: {
        text: '已完成患者数',
        left: 'center',
        textStyle: {
          color: '#666'
        }
      },
      angleAxis: {
        max: 100,
        show: false,
      },
      tooltip: {
        trigger: 'item',
        formatter: '{c}%'
      },
      graphic: { //图形中间文字
        type: "text",
        left: "center",
        top: "center",
        style: {
          text: "21",
          textAlign: "center",
          fill: "#666",
          fontSize: 14,
          fontWeight: 'bold'
        }
      },
      radiusAxis: {
        type: 'category',
        show: true,
        axisLabel: {
          show: false,
        },
        axisLine: {
          show: false,

        },
        axisTick: {
          show: false
        },
      },
      polar: {
        radius: ['50%', '65%'],
        center: ['50%', '50%'],
      },
      series: [{
        type: 'bar',
        roundCap: true,
        barWidth: 40,
        showBackground: true,
        backgroundStyle: {
          color: "#ccc"
        },
        itemStyle: {
          normal: {
            opacity: 1,
            color: 'pink',
          },

        },
        data: [{
          value: 55,
          itemStyle: {
            color: 'pink',
          },

        },],
        coordinateSystem: 'polar',
        name: 'A',
        label: {
          show: true,
        },

      }],
    }
    const option04 = {
      title: {
        text: '所有患者数',
        left: 'center',
        textStyle: {
          color: '#666'
        }
      },
      angleAxis: {
        max: 100,
        show: false,
      },
      tooltip: {
        trigger: 'item',
        formatter: '{c}%'
      },
      graphic: { //图形中间文字
        type: "text",
        left: "center",
        top: "center",
        style: {
          text: "30",
          textAlign: "center",
          fill: "#666",
          fontSize: 14,
          fontWeight: 'bold'
        }
      },
      radiusAxis: {
        type: 'category',
        show: true,
        axisLabel: {
          show: false,
        },
        axisLine: {
          show: false,

        },
        axisTick: {
          show: false
        },
      },
      polar: {
        radius: ['50%', '65%'],
        center: ['50%', '50%'],
      },
      series: [{
        type: 'bar',
        roundCap: true,
        barWidth: 40,
        showBackground: true,
        backgroundStyle: {
          color: "#ccc"
        },
        itemStyle: {
          normal: {
            opacity: 1,
            color: 'red',
          },

        },
        data: [{
          value: 80,
          itemStyle: {
            color: 'red',
          },

        },],
        coordinateSystem: 'polar',
        name: 'A',
        label: {
          show: true,
        },
      }],
    }

    const option05 = {
      color: ['#2d82ff'],
      title: {
        text: '最近一周新增患者数',
        left: 'center',
        textStyle: {
          color: '#666'
        }
      },
      xAxis: {
        type: 'category',
        data: ['2020/04/04', '2020/04/05', '2020/04/06', '2020/04/07', '2020/04/08', '2020/04/09', '2020/04/10']
      },
      yAxis: {
        type: 'value'
      },
      series: [{
        data: [150, 230, 224, 218, 135, 147, 260],
        type: 'line'
      }]
    }
    const option06 = {
      color: ['#2d82ff'],
      title: {
        text: '最近一周新增CT数量',
        left: 'center',
        textStyle: {
          color: '#666'
        }
      },
      xAxis: {
        type: 'category',
        data: ['2020/04/04', '2020/04/05', '2020/04/06', '2020/04/07', '2020/04/08', '2020/04/09', '2020/04/10']
      },
      yAxis: {
        type: 'value'
      },
      series: [{
        data: [820, 932, 901, 934, 1290, 1330, 1320],
        type: 'line'
      }]
    }

    return (
      <div>
        <p className="tip">Hi, 马医生,早上好!</p>
        <p className="tip">今天是: {now}</p>
        <div className="pieList">
          <div className="pie">
            <ReactEcharts
              option={option01}
              style={{ height: '200px', width: '100%' }}
              className={'react_for_echarts'}
            />
          </div>
          <div className="pie">
            <ReactEcharts
              option={option02}
              style={{ height: '200px', width: '100%' }}
              className={'react_for_echarts'}
            />
          </div>
          <div className="pie">
            <ReactEcharts
              option={option03}
              style={{ height: '200px', width: '100%' }}
              className={'react_for_echarts'}
            />
          </div>
          <div className="pie">
            <ReactEcharts
              option={option04}
              style={{ height: '200px', width: '100%' }}
              className={'react_for_echarts'}
            />
          </div>
        </div>
        <div className="lineList">
          <div className="line">
            <ReactEcharts
              option={option05}
              style={{ height: '300px', width: '100%' }}
              className={'react_for_echarts'}
            />
          </div>
          <div className="line">
            <ReactEcharts
              option={option06}
              style={{ height: '300px', width: '100%' }}
              className={'react_for_echarts'}
            />
          </div>
        </div>
      </div>
    );
  }
}

// Dashboard = Form.create({})(Dashboard);

export default Dashboard;