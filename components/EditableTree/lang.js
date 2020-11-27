
export default function lang(env) {
  const langConf = {
    zh_CN: {
      template_tree_max_level_tips: '已经限制树的最大深度为：',
      pleaseCompleteTheNodeBeingEdited: '请完善当前正在编辑的节点数据！',
      extendedMetadata_same_level_name_cannot_be_added: '同层级已经有同名节点被添加！',
      pleaseInputKeyOrValue: '请至少输入键名或键值！',
      pleaseInputKey: '请至少输入键名！',
      json_format_invalid: '导入的数据不合法！',
      KeyAndValueIsNotAllEmpty: '键名和键值不能都为空！',
      confirm: '确认',
      cancel: '取消',
      addSisterNode: '添加同级节点',
      addSubNode: '添加子节点',
      addYamlNode: 'Yaml输入',
      deleteLevel: '删除层级',
    },
    en_US: {
      template_tree_max_level_tips: 'The maximum depth of the tree has been limited to: ',
      pleaseCompleteTheNodeBeingEdited: 'Please complete the node data currently being edited!',
      extendedMetadata_same_level_name_cannot_be_added: 'A node with the same name has been added at the same level!',
      pleaseInputKeyOrValue: 'Please input key or value!',
      pleaseInputKey: 'Please input key!',
      json_format_invalid: 'The imported data is illegal!',
      KeyAndValueIsNotAllEmpty: 'The key and value can not be all empty!',
      confirm: 'Confirm',
      cancel: 'Cancel',
      addSisterNode: 'Add Sister Node',
      addSubNode: 'Add Sub Node',
      addYamlNode: 'Yaml Input',
      deleteLevel: 'Delete Level',
    }
  };
  
  return langConf[env] || langConf['zh_CN'];
}