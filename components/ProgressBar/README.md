#### ProgressBar
_________________
>进度条组件

##### How To Use ?
```js
// import
import ProgressBar from 'ProgressBar/'

// instantiation
<ProgressBar
  percent={progress}
  color='#41a7f1' 
  size='mini'
  now={now}
  total={total}
/>

```

##### Instruction
```js

ProgressBar.propTypes = {
  // 百分比 0~100 的数字
  percent: PropTypes.string.isRequired,

  // 自定义进度条颜色
  color: PropTypes.string,
  
  // 自定义进度条大小 normal | mini | big | very
  size: PropTypes.string,

  // 当前播放进度 - 比如 01:23
  now: PropTypes.string,

  // 总的播放时间 - 比如 04:21
  total: PropTypes.string,

};


ProgressBar.defaultProps = {
  color: 'blue',
  percent: 0,
  size: 'mini'
};
```

#### Attention
1. 组件依赖semantic-ui-react库，需要npm安装
