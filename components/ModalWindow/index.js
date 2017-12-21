/**
* @name: Model
* @description: 模态弹窗公共组件
* @author: 杨伟(yang.wei@datatom.com)
*/

import React, { PropTypes, Component } from 'react';
import './index.scss';

/* -----------------------------------------------------------------------------
  模态弹窗公用组件：
  弹窗的内容需要放在Model标签内，触发弹窗的元素需要被作为trigger属性传入，弹窗时显示的文字标题
  需要作为属性label传入，使用例子如下：

  <Modal
    label={'自定义模态窗'}
    trigger={
      <span>触发元素</span>
    }
  >
    <span>本span标签为自定义内容</span>

  </Modal>

----------------------------------------------------------------------------- */


/* ************************* 模态弹窗组件 ************************* */
export default class Model extends Component {
  constructor(props){
    super(props);
    this.state = {
      isAvailable: false  // 是否显示
    };
  }
  componentDidMount() {
  }

  componentWillReceiveProps(nextProps) {
  }

  /**
   * [buildTrigger 通过克隆组件为组件添加属性]
   * @param  {Element} trigger [被处理的组件]
   * @return {Element} [新创建的组件]
   */
  buildTrigger = (trigger) => {
    return React.cloneElement(trigger, {
      onClick: this.handleOpen
    });
  }

  /**
   * [handleOpen 开启]
   */
  handleOpen = () => {
    this.setState({
      isAvailable: true
    });
  }

  /**
   * [handleClose 关闭]
   */
  handleClose = () => {
    this.setState({
      isAvailable: false
    });
  }

  /**
   * [stopClick 拦截页面关闭事件]
   */
  stopClick = (e) => {
    if (e.stopPropagation)
      e.stopPropagation();
    if (e.cancelBubble)
      e.cancelBubble = true;
  }

  render() {
    const { label, trigger } = this.props;
    const { isAvailable } = this.state;
    const modalStyle = isAvailable ? {display: 'block'} : {display: 'none'};

    return (
      <span>
        {/*页面显示的触发元素*/}
        <span>
          {this.buildTrigger(trigger)}
        </span>

        {/*模态dom*/}
        <div
          className='modal-self-container'
          style={modalStyle}
          onClick={this.handleClose}
        >
          <div className='modal-content' onClick={this.stopClick}>
            <div className='modal-header'>{label}</div>
            <span
              className='modal-button'
              onClick={this.handleClose}
            >x 关闭</span>

            <div className='modal-body'>
              { this.props.children }
            </div>

          </div>
        </div>

      </span>
    );
  }
}

Model.propTypes = {
  label: PropTypes.string.isRequired,
  trigger: PropTypes.element.isRequired
};
