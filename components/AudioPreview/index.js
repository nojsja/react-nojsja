import ProgressBar from '../ProgressBar/';
import React, { PropTypes, Component } from 'react';
import { Icon } from 'semantic-ui-react';

class AudioPreview extends Component {
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
      FnDelay(  // 每隔4秒更新一次，更新频繁了会卡顿
        updateProgress, 4000
      );
    }

    // 更新播放时间
    this.refs.audioDom.onloadedmetadata = () => {
      this.setState({
        total: secondToTime(this.refs.audioDom.duration)
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
      now: secondToTime(this.refs.audioDom.currentTime)
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
              <ProgressBar
                percent={progress}
                color='#41a7f1' size='mini'
                now={now}
                total={total}
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

AudioPreview.PropTypes = {
  dataUrl: PropTypes.string.isRequired  // 媒体数据地址，可以是url地址、二进制本地数据、base64字符串
};

AudioPreview.defaultProps = {

};
