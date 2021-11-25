# FragmentHeader 组件说明

## I. 功能说明

JSON 化配置列表组件的头部筛选条件区域，可根据传入的单个 JSON 对象的`type` 属性生成各种组件，比如：Input、Select、DatePicker 等。

## II. 组件配置说明

### 一、使用示例

JSX：

```html
<FragmentHeader form={formRef} // 使用 Form.useForm() 生成的表单实例，用于外部反向控制内部表单
fragments={formConf} // JSON 配置数据 onChange={onSearchHeaderChange} // 捕获所有组件的 onChange
事件 />
```

JSON：

```js
// fragmetns
[
  {
    type: 'input',
    defaultValue: '1',
    name: 'companyName',
    key: 'companyName',
    placeholder: '保险公司简称',
    col: 6,
    sort: 1,
    _formItemProps: {
      ...
    },
  },
  ...
]
```

### 二、数据格式

- form: `Form`
- fragments: `[{type...}, ...]`
- onChange: `Function({ name, value })`

### 三、各类型组件通用 JSON 字段说明

> @ 为必填项

- @ **type**: 组件类型，可选值：`input`、`select`、`dateRangePicker`、`button`、`buttonGroup`、`date`、`switch`、`typedInput`。
- @ **name**: 表单字段名，用于 Antd Form 表单属性
- @ **key**: 使用数组生成的组件需要的同级内唯一键值
- **defaultValue**: 默认值
- **placeholder**：Input 类组件的默认填充提示
- **disabled**: 是否禁用组件
- **col**: 组件占用格栅列数
- **sort**: 序号值，影响组件在界面的渲染顺序，数字小的组件优先占位
- **options**：可用于 `select`、`typedInput`和 `buttonGroup` 等组件，作用各不相同，请参考以下关于组件的单独说明
- **rules**: 用于该表单字段校验的规则，也可将规则写在 `_formItemProps` 对象中传入
- **width**: 用于设置某些组件的默认占用宽度，包括：`input`、`date`、`number` 等组件
- **label**：设置组件的左侧文字说明区域，如果不设置此属性，会默认读取 `_formItemProps.label`、`placeholder` 和 `name` 属性的配置
- **\_formItemProps**：专门作用于被渲染组件父级 `Form.Item` 的属性对象，示例如下：

```json
{
  ...
  _formItemProps: {
    rules: [{...}, ...],
    wrapperCol: { span: 17 },
    labelCol: { span: 7 },
    validateFirst: true,
    label: '...'
  }
}
```

### 四、组件单独说明

### 1. Input 输入组件

```json
[
  {
      type: 'input',
      defaultValue: '1',
      name: 'companyName',
      key: 'companyName',
      placeholder: '保险公司简称',
      disabled: false,
      col: 6,
      sort: 1, // 字段显示位置排序
      _formItemProps: { // Form.Item组件属性

      },
  },
  ...
]
```

### 2. Button 按钮组件

```json
[
  {
    label: '按钮1',
    type: 'primary',
    size: 'small',
    key: 'gb1',
    ghost: false, // Antd 原生自带属性均支持
    name: 'groupB1',
    onClick: () => { // 按钮点击事件
      console.log('b1');
    },
  },
  ...
]
```

### 3. ButtonGroup 按钮组组件

```json
[
  {
    type: 'buttonGroup',
    col: 6,
    sort: 5,
    options: [ // 配置所有按钮
      {
        label: '按钮1',
        type: 'primary',
        size: 'small',
        key: 'gb1',
        ghost: false,
        name: 'groupB1',
        onClick: () => {
          console.log('b1');
        },
      },
      ...
    ],
  },
  ...
]
```

### 4. Date 日期组件

```json
[
  {
    type: 'date',
    defaultValue: '1995-06-07',
    width: '100%',
    name: 'date',
    key: 'date',
    disabled: false,
    sort: 4,
  },
  ...
]
```

### 5. DateRangePicker 日期范围选择组件

```json
[
  {
    type: 'dateRangePicker',
    defaultValue: ['1995-06-07', '1995-06-08'],
    picker: 'date', // date | week | month | quarter | year
    disabled: false,
    name: 'dateRange',
    key: 'dateRange',
    sort: 4,
    onChange: date => { // 范围选择捕获事件
      console.log(date);
    },
  },
  ...
]
```

### 6. Number 数字组件

```json
[
   {
    type: 'number',
    defaultValue: 22,
    disabled: false,
    width: '100%',
    sort: 2,
    name: 'testNumber',
    key: 'testNumber',
  },
  ...
]
```

### 7. Select 选择组件

```json
[
   {
    type: 'select',
    name: 'status',
    key: 'status',
    placeholder: '合作状态',
    defaultValue: '',
    sort: 2,
    col: 6,
    options: [
      {
        name: 'select1',
        value: '1',
        label: '合作中',
      },
      {
        name: 'select1',
        value: '2',
        label: '暂停合作',
      },
    ],
  },
  ...
]
```

### 8. Switch 开关组件

```json
[
    {
    type: 'switch',
    defaultValue: true,
    disabled: false,
    size: 'small',
    label: 'testLabel',
    name: 'submit',
    key: 'submit',
    sort: 1,
  },
  ...
]
```

### 9. 组合选择组件

```json
[
  {
    type: 'typedInput',
    defaultValue: '1',
    defaultType: 'a',
    selectorWidth: '30%', // 选择框占用宽度
    inputWidth: '70%', // 输入框占用宽度
    name: 'typedInput',
    key: 'typedInput',
    disabled: false,
    sort: 1,
    options: [
      { value: 'a', label: 'a-lllll' },
      { value: 'b', label: 'b' },
    ],
  },
  ...
]
```
