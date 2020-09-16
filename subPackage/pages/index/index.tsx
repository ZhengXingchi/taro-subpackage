import { ComponentClass } from 'react';
import Taro, { Component, Config } from '@tarojs/taro';
import { View, Button, Text } from '@tarojs/components';
import { connect } from '@tarojs/redux';

import { add, minus, asyncAdd } from '@/app/actions/counter';
import debounce from 'lodash/debounce';
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import * as echarts from '@/app/subPackage/components/ec-canvas/echarts';
import './index.scss';

// #region 书写注意
//
// 目前 typescript 版本还无法在装饰器模式下将 Props 注入到 Taro.Component 中的 props 属性
// 需要显示声明 connect 的参数类型并通过 interface 的方式指定 Taro.Component 子类的 props
// 这样才能完成类型检查和 IDE 的自动提示
// 使用函数模式则无此限制
// ref: https://github.com/DefinitelyTyped/DefinitelyTyped/issues/20796
//
// #endregion

type PageStateProps = {
  counter: {
    num: number;
  };
};

type PageDispatchProps = {
  add: () => void;
  dec: () => void;
  asyncAdd: () => any;
};

type PageOwnProps = {};

type PageState = {};

type IProps = PageStateProps & PageDispatchProps & PageOwnProps;

interface Index {
  props: IProps;
}

function initChart(canvas, width, height) {

  const chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);

  var option = {
    title: {
      text: '测试下面legend的红色区域不应被裁剪',
      left: 'center'
    },
    color: ["#37A2DA", "#67E0E3", "#9FE6B8"],
    legend: {
      data: ['A', 'B', 'C'],
      top: 150,
      left: 'center',
      backgroundColor: 'red',
      z: 100
    },
    grid: {
      containLabel: true
    },
    tooltip: {
      show: true,
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      // show: false
    },
    yAxis: {
      x: 'center',
      type: 'value',
      splitLine: {
        lineStyle: {
          type: 'dashed'
        }
      }
      // show: false
    },
    series: [{
      name: 'A',
      type: 'line',
      smooth: true,
      data: [18, 36, 65, 30, 78, 40, 33]
    }, {
      name: 'B',
      type: 'line',
      smooth: true,
      data: [12, 50, 51, 35, 70, 30, 20]
    }, {
      name: 'C',
      type: 'line',
      smooth: true,
      data: [10, 30, 31, 50, 40, 20, 10]
    }]
  };
  chart.setOption(option);
  return chart;
}


@connect(({counter}) => ({
  counter
}), (dispatch) => ({
  add() {
    dispatch(add());
  },
  dec() {
    dispatch(minus());
  },
  asyncAdd() {
    dispatch(asyncAdd());
  }
}))
class Index extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '首页',
    // 定义需要引入的第三方组件
    usingComponents: {
      'ec-canvas': '../../components/ec-canvas/ec-canvas' // 书写第三方组件的相对路径
    }
  };

  constructor (props) {
    super(props)
    this.state = {
      ec: {
        onInit: initChart
      }
    };
  }

  // state = {
  //   ec: {
  //     lazyload: true
  //     // onInit: initChart
  //   }
  // };

  chart;

  getSearchResult = debounce(async (text: string) => {
    console.log('debounce');
  });

  componentWillReceiveProps(nextProps) {
    console.log(this.props, nextProps);
  }

  componentDidMount(): void {
    // this.initChart2();
  }

  componentWillUnmount() {
  }

  componentDidShow() {
  }

  componentDidHide() {
  }

  // initChart2 = () => {
  //   this.chart.init((canvas, width, height) => {
  //     const chart = echarts.init(canvas, null, {
  //       width: width,
  //       height: height
  //     });
  //     canvas.setChart(chart);
  //
  //     var option = {
  //       title: {
  //         text: '测试下面legend的红色区域不应被裁剪',
  //         left: 'center'
  //       },
  //       color: ["#37A2DA", "#67E0E3", "#9FE6B8"],
  //       legend: {
  //         data: ['A', 'B', 'C'],
  //         top: 50,
  //         left: 'center',
  //         backgroundColor: 'red',
  //         z: 100
  //       },
  //       grid: {
  //         containLabel: true
  //       },
  //       tooltip: {
  //         show: true,
  //         trigger: 'axis'
  //       },
  //       xAxis: {
  //         type: 'category',
  //         boundaryGap: false,
  //         data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
  //         // show: false
  //       },
  //       yAxis: {
  //         x: 'center',
  //         type: 'value',
  //         splitLine: {
  //           lineStyle: {
  //             type: 'dashed'
  //           }
  //         }
  //         // show: false
  //       },
  //       series: [{
  //         name: 'A',
  //         type: 'line',
  //         smooth: true,
  //         data: [18, 36, 65, 30, 78, 40, 33]
  //       }, {
  //         name: 'B',
  //         type: 'line',
  //         smooth: true,
  //         data: [12, 50, 51, 35, 70, 30, 20]
  //       }, {
  //         name: 'C',
  //         type: 'line',
  //         smooth: true,
  //         data: [10, 30, 31, 50, 40, 20, 10]
  //       }]
  //     };
  //     chart.setOption(option);
  //     return chart;
  //   });
  //
  // }

  onClickTest = () => {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  refChart = node => (this.chart = node)

  render() {
    return (
      <View className='index'>
        <Button className='add_btn' onClick={this.props.add}>+</Button>
        <Button className='dec_btn' onClick={this.props.dec}>-</Button>
        <Button className='dec_btn' onClick={this.props.asyncAdd}>async</Button>
        <Button className='dec_btn' onClick={this.onClickTest}>子包</Button>
        <View><Text>{this.props.counter.num}</Text></View>
        <View><Text>Hello, World</Text></View>
        <View className='container2'>
          <ec-canvas ref={this.refChart} id='mychart-dom-area' canvas-id='mychart' ec={this.state.ec}/>
        </View>
      </View>
    );
  }
}

// #region 导出注意
//
// 经过上面的声明后需要将导出的 Taro.Component 子类修改为子类本身的 props 属性
// 这样在使用这个子类时 Ts 才不会提示缺少 JSX 类型参数错误
//
// #endregion
export default Index as ComponentClass<PageOwnProps>;
