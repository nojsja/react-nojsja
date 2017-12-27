#### AudioPreview
_________________
>HTML5 音频播放组件

##### How To Use ?
```js
// import
import AudioPreview from 'AudioPreview/'

// instantiation
<AudioPreview dataUrl={'your audio media data'}/>

```

##### Instruction
```js
AudioPreview.PropTypes = {
  // 媒体数据地址，可以是url地址、二进制本地数据、base64字符串
  dataUrl: PropTypes.string.isRequired  
};

AudioPreview.defaultProps = {

};
```

#### Attention
1. 组件依赖semantic-ui-react库，需要npm安装
