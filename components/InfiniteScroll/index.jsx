import React, { Component } from 'react';
import { Spin } from 'antd';
import { inject } from 'mobx-react';

import PropTypes from 'prop-types';

import { LoadingOutlined } from '@ant-design/icons';

import { fnDebounce } from '../utils';
import './index.less';

const fnDebounceObject = fnDebounce();

@inject('lang')
class InfiniteScroll extends Component {
  state = {
    count: 0,
  };
  scrollRef = React.createRef();
  minHeight='50px'
  maxHeight='200px'

  componentDidMount() {
    const { initialLoad = true, scrollTrigger, hasMore = true } = this.props;
    const { count } = this.state;
    if (initialLoad && hasMore && scrollTrigger) {
      scrollTrigger(count);
      this.setState({
        count: count + 1,
      });
    }
  }

  /* 滚动监听函数去抖 */
  onScrollCaller = () => {
    fnDebounceObject(this.onScroll, 500, false, null);
  }

  /* 滚动监听 */
  onScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } = this.scrollRef.current;
    const { onScroll } = this.props;
    if (scrollTop + clientHeight === scrollHeight) {
      this.scrollToBottom();
    }
    if (onScroll) {
      onScroll({
        scrollTop,
        clientHeight,
        scrollHeight,
      });
    }
  }

  /* 滚动到底部后进行函数触发 */
  scrollToBottom = () => {
    const {
      scrollTrigger,
      hasMore,
      loading,
    } = this.props;
    const { count } = this.state;

    if (!loading && hasMore && scrollTrigger) {
      scrollTrigger(count);
      this.setState({
        count: count + 1,
      });
    }
  }


  render() {
    const {
      loading,
      minHeight,
      maxHeight,
    } = this.props;
    const { lang } = this.props;
    return (
      <Spin
        spinning={loading}
        wrapperClassName="dtSpinLoading"
        tip={lang.loading}
        indicator={<LoadingOutlined style={{ fontSize: 24 }} />}
      >
        <div
          className="infinite-scroll-wrapper"
          ref={this.scrollRef}
          style={{
            minHeight: minHeight || this.minHeight,
            maxHeight: maxHeight || this.maxHeight,
          }}
          onScroll={this.onScrollCaller}
        >
          {
            this.props.children
          }
        </div>
      </Spin>
    );
  }
}

InfiniteScroll.propTypes = {
  scrollTrigger: PropTypes.func.isRequired, // 滚动触底后的回调函数 [必要]
  initialLoad: PropTypes.bool, // 组件初始化时是否自动请求一次回调函数 [非必要]
  loading: PropTypes.bool, // 组件loading状态 [非必要]
  hasMore: PropTypes.bool, // 是否有更多数据-主动禁止组件滚动触底调用 [非必要]
  minHeight: PropTypes.string, // 自定义滚动视图最小高度(default 50px) [非必要]
  maxHeight: PropTypes.string, // 自定义滚动视图最大高度(default 200px) [非必要]
};

export default InfiniteScroll;
