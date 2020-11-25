import { observable, action } from 'mobx';
class Public {

  @observable lang = {
    template_tree_max_level_tips: 'The maximum depth of the template tree has been limited to: ',
    pleaseCompleteTheNodeBeingEdited: 'Please complete the node data currently being edited!',
    extendedMetadata_same_level_name_cannot_be_added: 'A node with the same name has been added at the same level!',
    pleaseInputKeyOrValue: 'Please input key or value!',
    json_format_invalid: 'The imported data is illegal!',
    KeyAndValueIsNotAllEmpty: 'The key and value can not be all empty!',
    confirm: 'Confirm',
    cancel: 'Cancel',
    addSisterNode: 'Add Sister Node',
    addSubNode: 'Add Sub Node',
    addYamlNode: 'Yaml Input',
    deleteLevel: 'Delete Level',
  }
}
export default Public;
