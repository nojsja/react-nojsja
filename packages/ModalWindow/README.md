#### ModalWindow
_________________
>模态弹窗组件

##### How To Use ?
```js
// import
import ModalWindow from 'ModalWindow/'

// instantiation
<Modal
  label={'自定义模态窗'}
  trigger={
    <span>触发元素</span>
  }
> 
  <span>本span标签为自定义children内容</span>

</Modal>

```

##### Instruction
```js

ModelWindow.propTypes = {
  // 弹窗时显示的文字标题需要作为属性label传入
  label: PropTypes.string.isRequired,

  // 触发弹窗的元素需要被作为trigger属性传入
  trigger: PropTypes.element.isRequired,

  // 弹窗的内容需要放在Model标签内部
  // children 属性不用显式声明
  children: PropTypes.Array.isRequired  
};


ModelWindow.defaultProps = {

};
```

#### Attention
1. 注意children属性的使用
