/**
* @name: AudioPlayer
* @description: audio player
* @author: nojsja
*/

import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { Icon } from 'semantic-ui-react';

// components
import ProgressBar from 'components/ProgressBar/';
// style
import './index.less';
// libs
import { fnThrottle, secondsToTime } from 'utils/utils';

const throttler = fnThrottle();

/* -----------------------------------------------------------------------------
  说明:
    该组件使用了ProgressBar组件，支持点击进度条选择播放进度

  组件属性说明:
    组件需要传入的唯一参数 - dataUrl - 音频文件地址 - 数据类型支持以下:
      1. base64-url (base64数据-参考HTML5 FileReader API)
      2. remote-url (常规的远程地址-http://xxx.xxx.mp3)
      3. blob-data (音频文件的二进制数据-参考HTML5 FileReader API)
----------------------------------------------------------------------------- */

export default class AudioPlayer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: 'pending',  // 当前播放状态 - pending(未播放) -
                          // stop(停止) - pause(暂停) - playing(正在播放)
      progress: null,  // 播放进度
      volume: true,  // 非静音
      dataUrl: null,  // 数据

      now: '00:00',  // 当前播放时长
      total: '00:00',  // 总时长
    };
  }

  /*   初始化音频组件   */
  audioInit = (props) => {
    const self = this;

    this.setState({
      dataUrl: props.dataUrl
    });

    // 更新播放进度
    const updateProgress = (value) => {
      if (!self || !self.refs.audioDom) return;

      if (self.refs.audioDom.currentTime === self.refs.audioDom.duration) {
        self.stop();
        return self.progress(100);
      }

      if (self.state.status !== 'playing') return;

      self.progress(
        (self.refs.audioDom.currentTime / self.refs.audioDom.duration) * 100
      );

    };

    // 绑定播放进度事件
    this.refs.audioDom.ontimeupdate = () => {
      throttler(  // 每隔2秒更新一次，更新频繁了会卡顿
        updateProgress, 2000, false, null
      );
    }

    // 更新播放时间
    this.refs.audioDom.onloadedmetadata = () => {
      this.setState({
        total: secondsToTime(this.refs.audioDom.duration)
      });
    }
  }

  /*   生命周期   */
  componentDidMount() {

    this.audioInit(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.dataUrl != this.state.dataUrl) {
      this.wipeData();
      this.audioInit(nextProps);
    }
  }

  /*   音频播放控制   */

  /**
   * [wipeData 清除状态信息]
   */
  wipeData = () => {
    this.setState({
      status: 'pending',  // 当前播放状态 - pending(未播放) -
                          // stop(停止) - pause(暂停) - playing(正在播放)
      progress: null,  // 播放进度
      volume: true
    });
  }

  /**
   * [progress 播放进度]
   */
  progress = (value) => {
    this.setState({
      progress: value,
      now: secondsToTime(this.refs.audioDom.currentTime)
    });
  }

  /**
   * [volume 更新音量]
   */
  volume = (ev) => {
    this.refs.audioDom.volume = (ev.target.value) / 100;
  }

  /**
   * [mute 静音]
   */
  mute = () => {
    const { volume } = this.state;
    this.setState({
      volume: !volume
    }, () => {
      this.refs.audioDom.muted = !this.refs.audioDom.muted;
    });
  }

  /**
   * [play 播放]
   */
  play = () => {
    let { status } = this.state;
    if (status === 'stop') {
      this.progress(
        (this.refs.audioDom.currentTime / this.refs.audioDom.duration) * 100
      );
    }

    this.setState({
      status: status === 'playing' ? 'pause' : 'playing'
    });
    if (status === 'playing') return this.refs.audioDom.pause();
    this.refs.audioDom.play();
  }

  /**
   * [stop 停止播放]
   */
  stop = () => {
    this.setState({
      status: 'stop'
    });
  }


  /**
   * [backward 后退]
   */
  backward = () => {
    const currentTime = this.refs.audioDom.currentTime;
    const duration = this.refs.audioDom.duration;
    this.refs.audioDom.currentTime = currentTime - duration / 10;

    this.progress(
      (this.refs.audioDom.currentTime / this.refs.audioDom.duration) * 100
    );
  }

  /**
   * [forward 前进]
   */
  forward = () => {
    const currentTime = this.refs.audioDom.currentTime;
    const duration = this.refs.audioDom.duration;
    this.refs.audioDom.currentTime = currentTime + duration / 10;

    this.progress(
      (this.refs.audioDom.currentTime / this.refs.audioDom.duration) * 100
    );
    if (this.refs.audioDom.currentTime === this.refs.audioDom.duration)
      this.stop();
  }

  /**
   * [setProgress 进度跳转]
   */
  setProgress = (value) => {
    const duration = this.refs.audioDom.duration;
    this.refs.audioDom.currentTime = duration * (value / 100);

    this.progress(
      (this.refs.audioDom.currentTime / this.refs.audioDom.duration) * 100
    );
    if (this.refs.audioDom.currentTime === this.refs.audioDom.duration)
      this.stop();
  }

  render() {
    const { dataUrl } = this.props;
    let { progress, status, volume, now, total } = this.state;

    const statusIcon = status === 'playing' ? 'pause' : 'play';
    const volumeIcon = volume ? 'volume up' : 'volume off';

    return (
      <div className='audio-preview-wrapper'>
        <div className='audio-preview-icon'>
          <span>
            <Icon name='music'/>
          </span>
        </div>
        <div className='progress-function-wrapper'>

          <div className='audio-preview-function'>
            <span>
              <Icon name='backward' onClick={this.backward}/>
              <Icon name={statusIcon} onClick={this.play}/>
              <Icon name='forward' onClick={this.forward}/>
            </span>
            <span className='volume'>
              <Icon name={volumeIcon} onClick={this.mute}/>
              <input type='range' onChange={this.volume} defaultValue={100}></input>
            </span>
          </div>

          <div className='progress-wrapper'>
            <span className='time-now'>{now}</span>
            <span className='time-total'>{total}</span>

            <ProgressBar
              percent={progress}
              color='#41a7f1' size='mini'
              setProgress={this.setProgress}
            />

          </div>
        </div>


        <audio
          controls="controls"
          style={{display: 'none'}}
          ref='audioDom'
        >
          <source src={dataUrl} type="audio/mpeg"></source>
          <source src={dataUrl} type="audio/mp3"></source>
          <source src={dataUrl} type="audio/wav"></source>
          <source src={dataUrl} type="audio/ogg"></source>
          你的浏览器不支持此格式音频文件预览
        </audio>
      </div>
    )
  }
}

AudioPlayer.propTypes = {
    dataUrl: PropTypes.string.isRequired  // 音频文件地址, 支持:
                                          // 1.base64-url (base64数据-参考FileReader API)
                                          // 2.remote-url (常规的远程地址-http://xxx.xxx.mp3)
                                          // 3.blob-data (音频文件的二进制数据-参考FileReader API)
};

AudioPlayer.defaultProps = {

};
