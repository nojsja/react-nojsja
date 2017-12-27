#### RightClickMenu
_________________
>右键菜单组件

##### How To Use ?
```js
// import
import RightClickMenu from 'RightClickMenu/'

// instantiation
<RightClickMenu
  menuItems={menuItems}
  menuHandler={menuHandler}
>
  <div>自定义DOM元素内容</div>
</RightClickMenu>

```

##### Instruction
```js

RightClickMenu.propTypes = {
  // 右键菜单选项
  menuItems: PropTypes.arrayOf(
    PropTypes.shape({
      name: 'xxx',  // 菜单显示的文字
      title: 'xxx'  // 鼠标滑动的提示文字
    })
  ),

  // 右键菜单点击菜单项处理函数 - [回调函数]
  menuHandler: PropTypes.func.isRequired
};


AudioPreview.defaultProps = {
  
};
```

#### Attention
1. 组件依赖semantic-ui-react库，需要npm安装
