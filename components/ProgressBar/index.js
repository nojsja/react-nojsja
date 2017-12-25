class ProgressBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

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

  render() {
    const { percent, color, size } = this.props;
    const { now, total } = this.props;
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
        style={wrapperStyle}
      >
        <span className='time-now'>{now}</span>
        <span className='time-total'>{total}</span>

        <div className='bar' style={barStyle}>
          <span draggable='true'></span>
        </div>
      </div>
    )
  }

}
