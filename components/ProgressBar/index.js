/**
* @name: ProgressBar
* @description: 进度条公共组件
* @author: 杨伟(yang.wei@datatom.com)
*/

import React, { PropTypes, Component } from 'react';
import { Icon } from 'semantic-ui-react';

// style
import './index.scss';

/* -----------------------------------------------------------------------------
  说明:
    项目所用的semantic库已经提供了Progress组件，但是组件默认进度条显示不为0，看着挺别扭，
    而且不支持点击进度条设置进度，所以配合编写AudioPlayer顺便编写了ProgressBar, 支持点击进度条
    选择进度。

  属性说明:
    ProgressBar.propTypes = {
      percent: PropTypes.number,  // 进度-0到100的数字 - 必要参数
      color: PropTypes.string,  // 自定义进度颜色 - 非必要参数
      size: PropTypes.string,  // 自定义进度条大小 - 非必要参数
      setProgress: PropTypes.func  // 点击进度条调用的设置进度函数 - [回调函数]
    }
----------------------------------------------------------------------------- */

export default class ProgressBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  /*   静态属性   */
  sizeMap = {  // progress 大小自定义
    normal: '0.9rem',
    mini: '0.5rem',
    big: '1.5rem',
    very: '2rem'
  }

  colorMap = {  // 进度默认显示浅蓝色
    blue: '#41a7f1',
  }

  /*   事件处理   */

  /**
   * [getMousePosition 获取鼠标的位置]
   * @param  {Object} event [事件对象]
   */
  getMousePosition = (event) => {
    const e = event || window.event;

    const x = (e.pageX || e.clientX);
    const y = (e.pageY || e.clientY);

    return { left: x, top: y };
  }

  /**
   * [getElementPosition 获取被点击元素的位置]
   * @param  {Object} event [事件对象]
   */
  getElementPosition = (event) => {

    //获取元素的纵坐标
    const getTop = (target) => {
      let offset = target.offsetTop;
      if(target.offsetParent != null)
        offset += getTop(target.offsetParent);

      return offset;
    }
    //获取元素的横坐标
    const getLeft = (target) => {
      let offset = target.offsetLeft;
      if(target.offsetParent != null)
        offset += getLeft(target.offsetParent);

      return offset;
    }

    // 获取进度条元素
    const getTarget = (_target) => {
      const getClickControl = (target) => {
        if (!target) return target;

        if (target.getAttribute('data-flag') == 'clickControl') {
          return target;
        }else {
          return getClickControl(target.offsetParent);
        }
      }

      return getClickControl(_target);
    }

    return {
      left: getLeft( getTarget(event.target) ),
      top: getTop( getTarget(event.target) )
    };
  }

  /**
   * [getElementWidth 获取进度条元素的宽度]
   * @param  {Object} event [事件对象]
   */
  getElementWidth = (event) => {
    const getClickControl = (target) => {
      if (!target) return 0;

      if (target.getAttribute('data-flag') == 'clickControl') {
        return target.clientWidth;
      }else {
        return getClickControl(target.offsetParent);
      }
    }

    return getClickControl(event.target);
  }

  /**
   * [progressHandler 设置进度回调函数]
   * @param  {Object} e [事件对象]
   */
  progressHandler = (e) => {
    const { setProgress } = this.props;

    if (typeof setProgress === 'function') {
      const total = this.getElementWidth(e);
      const x1 = this.getElementPosition(e).left;
      const x2 = this.getMousePosition(e).left;
      const now = (x2 - x1 >= 0) ? x2 - x1 : 0;

      setProgress((now / total).toFixed(2) * 100);
    }

  }

  render() {
    const { percent, color, size } = this.props;
    const width = percent + '%';
    const barStyle= {
      backgroundColor: color || this.colorMap['blue'],
      width: percent ? width : 0,
      height: this.sizeMap[size] || this.sizeMap['normal']
    };
    const wrapperStyle = {
      height: this.sizeMap[size] || this.sizeMap['normal']
    };

    return (
      <div
        className='progress-self'
        onClick={this.progressHandler}
        data-flag='clickControl'
        style={wrapperStyle}
      >

        <div className='bar' style={barStyle}>
          <span></span>
        </div>
      </div>
    )
  }
}

ProgressBar.propTypes = {
  percent: PropTypes.number,  // 进度-0到100的数字
  color: PropTypes.string,  // 自定义进度颜色
  size: PropTypes.string,  // 自定义进度条大小
  setProgress: PropTypes.func  // 返回当前进度条点击位置相对于进度条长度的百分比(设置进度) - [回调函数]
}

ProgressBar.defaultProps = {
  color: 'blue',
  size: 'normal'
}
