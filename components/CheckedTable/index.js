import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Icon, Input, Table, Checkbox, Form } from 'antd';
import { set } from 'mobx';

import { arrayRemove } from 'utils/utils';

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    sm: { span: 4 },
  },
  wrapperCol: {
    sm: { span: 20 },
  },
};

function PermissionRenderBody({
  attr, setChecked,
  getChecked, title,
  keyAttr, setCheckedUser,
  disableMulti, action,
  onDelete,
}) {
  const body = (disableMulti && title) ?
    <span>{title ? keyAttr : ''}</span> : (
      <Checkbox
        onClick={(e) => {
            if (title) {
              setCheckedUser(keyAttr, e.target.checked);
            } else {
              setChecked(attr, keyAttr, e.target.checked);
            }
          }
        }
        checked={getChecked(attr, keyAttr)}
      ><span title={title ? keyAttr : ''} className="bucket-ap-grid">{title ? keyAttr : ''}</span>
      </Checkbox>
    );

  return action ? <i onClick={() => onDelete && onDelete(keyAttr)} style={{ cursor: 'pointer' }} className="iconfont icon-shanchu1" /> : (body);
}

function PermissionRenderTitle({
  attr,
  setCheckedAll,
  getCheckedAllStatus,
  setCheckedUserAll,
  title,
  disableMulti,
}) {
  return (disableMulti) ?
    <span>{title}</span> : (
      <Checkbox
        onClick={e =>
        (attr === 'userChecked' ?
        setCheckedUserAll(e.target.checked)
        :
        setCheckedAll(attr, e.target.checked))
      }
        checked={getCheckedAllStatus(attr)}
      >
        {title}
      </Checkbox>
    );
}

@inject('lang')
@observer
class CheckedTable extends Component {
  state = {
    searchKey: '',
    userChecked: [],
    accessChecked: [],
    listChecked: [],
    uploadChecked: [],
    downloadChecked: [],
    deleteChecked: [],
    wipeChecked: [],
  }

  userCount = 0
  selected = {};
  permissions = {};
  users = []

  aclNumberMap = {
    32: 'accessChecked',
    16: 'listChecked',
    8: 'uploadChecked',
    4: 'downloadChecked',
    2: 'deleteChecked',
    1: 'wipeChecked',
  }

  attrsMap = {
    accessChecked: 'access',
    listChecked: 'list',
    uploadChecked: 'upload',
    downloadChecked: 'download',
    deleteChecked: 'delete',
    wipeChecked: 'wipe',
  }

  searchUser = (e) => {
    const user = e.target.value;
    this.setState({
      searchKey: user,
    });
  }

  componentWillReceiveProps(nextProps) {
    const pLength = Object.keys(this.permissions).length;
    const { disableMulti } = this.props;
    if (nextProps.users.length !== pLength && pLength) {
      this.onChange();
    }
    const { users } = nextProps;
    const state = JSON.parse(JSON.stringify(this.state));

    const allAcl = [1, 2, 4, 8, 16, 32];
    let index;
    users.forEach((user) => {
      if (user.permission && user.permission.length) {
        !state.userChecked.includes(user.name) && state.userChecked.push(user.name);
        user.permission.forEach((perm) => {
          !state[this.aclNumberMap[perm]].includes(user.name) && state[this.aclNumberMap[perm]].push(user.name);
        });
        allAcl.forEach((acl) => {
          if (!user.permission.includes(acl)) {
            index = state[this.aclNumberMap[acl]].indexOf(user.name);
            index >= 0 && state[this.aclNumberMap[acl]].splice(index, 1);
          }
        });
        if (!user.permission.length && disableMulti) {
          index = state.userChecked.indexOf(user.name);
          index >= 0 && state.userChecked.splice(index, 1);
        }
      }
    });
    this.setState(state);
  }

  /* -------------- 真实数据操作单元 -------------- */

  /* 用户筛选 */
  userFilter = users =>
    users.filter(user => user.name.includes(this.state.searchKey));

  /* 单行获取选择 */
  getChecked = (attr, user) => this.state[attr].includes(user)

  /* 获取单列所有选择 */
  getCheckedAllStatus = attr => (this.state[attr].length === this.userCount && this.userCount)

  /* 设置所有用户是否选择 */
  setCheckedUserAll = (status) => {
    const keys = Object.keys(this.attrsMap);
    const localState = JSON.parse(JSON.stringify(this.state));
    if (status) {
      localState.userChecked = this.users;
    } else {
      localState.userChecked = [];
    }

    for (let i = 0; i < keys.length; i += 1) {
      if (status) {
        localState[keys[i]] = this.users;
      } else {
        localState[keys[i]] = [];
      }
    }
    this.setState(localState, () => {
      this.onChange(localState);
    });
  }

  /* 设置单个用户是否选择 */
  setCheckedUser = (user, status) => {
    const keys = Object.keys(this.attrsMap);
    const localState = JSON.parse(JSON.stringify(this.state));
    if (status) {
      localState.userChecked.push(user);
    } else {
      localState.userChecked.splice(localState.userChecked.indexOf(user), 1);
    }

    for (let i = 0; i < keys.length; i += 1) {
      if (status) {
        if (!localState[keys[i]].includes(user)) {
          localState[keys[i]].push(user);
        }
      } else if (localState[keys[i]].includes(user)) {
        localState[keys[i]].splice(localState[keys[i]].indexOf(user), 1);
      }
    }
    this.setState(localState, () => {
      this.onChange(localState, user);
    });
  }

  /* 设置单个属性选择 */
  setChecked = (attr, user, status) => {
    if (!status) {
      if (this.state[attr].includes(user)) {
        this.setState({
          [attr]: this.state[attr].filter(_user => _user !== user),
        }, () => {
          this.onChange(this.state, user);
        });
      }
    } else if (!this.state[attr].includes(user)) {
      this.setState({
        [attr]: this.state[attr].concat([user]),
      }, () => {
        this.onChange(this.state, user);
      });
    }
  }

  /* 设置单列所有选择 */
  setCheckedAll = (attr, status) => {
    this.setState({
      [attr]: status ? this.users : [],
    }, () => {
      this.onChange(this.state);
    });
  }

  /* -------------- 逻辑数据操作单元 -------------- */

  /**
   * 设置原则：
   * 1. 低级属性的取消影响依赖它的所有高级属性
   * 2. 高级属性的取消和选择影响它所依赖的所有低级属性
   * 3. 相互依赖的同级属性的选择和取消状态同步
   */

  /* 逻辑上设置单个选择 */
  setCheckedLogic = (attr, user, status) => {
    switch (attr) {
      case 'accessChecked':
        this.setChecked(attr, user, status);
        !status && (this.setChecked('deleteChecked', user, status));
        !status && (this.setChecked('wipeChecked', user, status));
        !status && (this.setChecked('listChecked', user, status));
        !status && (this.setChecked('uploadChecked', user, status));
        !status && (this.setChecked('downloadChecked', user, status));
        break;
      case 'listChecked':
        status && this.setChecked('accessChecked', user, status);
        this.setChecked(attr, user, status);
        !status && (this.setChecked('deleteChecked', user, status));
        !status && (this.setChecked('wipeChecked', user, status));
        !status && (this.setChecked('uploadChecked', user, status));
        !status && (this.setChecked('downloadChecked', user, status));
        break;

      case 'uploadChecked':
        status && this.setChecked('accessChecked', user, status);
        status && this.setChecked('listChecked', user, status);
        this.setChecked(attr, user, status);
        break;

      case 'downloadChecked':
        status && this.setChecked('accessChecked', user, status);
        status && this.setChecked('listChecked', user, status);
        this.setChecked(attr, user, status);
        break;

      case 'deleteChecked':
        status && this.setChecked('accessChecked', user, status);
        status && this.setChecked('listChecked', user, status);
        this.setChecked(attr, user, status);
        !status && (this.setChecked('wipeChecked', user, status));
        break;

      case 'wipeChecked':
        status && this.setChecked('accessChecked', user, status);
        status && this.setChecked('listChecked', user, status);
        status && this.setChecked('deleteChecked', user, status);
        this.setChecked(attr, user, status);
        break;
      default:
        break;
    }
  }

  /* 逻辑上设置单列所有选择 */
  setCheckedAllLogic = (attr, status) => {
    switch (attr) {
      case 'accessChecked':
        this.setCheckedAll(attr, status);
        !status && (this.setCheckedAll('deleteChecked', status));
        !status && (this.setCheckedAll('wipeChecked', status));
        !status && (this.setCheckedAll('listChecked', status));
        !status && (this.setCheckedAll('uploadChecked', status));
        !status && (this.setCheckedAll('downloadChecked', status));
        break;
      case 'listChecked':
        status && this.setCheckedAll('accessChecked', status);
        this.setCheckedAll(attr, status);
        !status && (this.setCheckedAll('deleteChecked', status));
        !status && (this.setCheckedAll('wipeChecked', status));
        !status && (this.setCheckedAll('uploadChecked', status));
        !status && (this.setCheckedAll('downloadChecked', status));
        break;

      case 'uploadChecked':
        status && this.setCheckedAll('accessChecked', status);
        status && this.setCheckedAll('listChecked', status);
        this.setCheckedAll(attr, status);
        break;

      case 'downloadChecked':
        status && this.setCheckedAll('accessChecked', status);
        status && this.setCheckedAll('listChecked', status);
        this.setCheckedAll(attr, status);
        break;

      case 'deleteChecked':
        status && this.setCheckedAll('accessChecked', status);
        status && this.setCheckedAll('listChecked', status);
        this.setCheckedAll(attr, status);
        !status && (this.setCheckedAll('wipeChecked', status));
        break;

      case 'wipeChecked':
        status && this.setCheckedAll('accessChecked', status);
        status && this.setCheckedAll('listChecked', status);
        status && this.setCheckedAll('deleteChecked', status);
        this.setCheckedAll(attr, status);
        break;
      default:
        break;
    }
  }

  /* onChange回调函数 - 获取所有选择的用户权限 */

  onChange = (selected, owner) => {
    const { onChange, disableMulti } = this.props;
    this.selected = selected || this.selected;
    this.permissions = {};
    this.users.forEach((user) => {
      this.permissions[user] = {
        access: false,
        list: false,
        upload: false,
        download: false,
        delete: false,
        wipe: false,
      };
    });
    Object.keys(this.selected)
      .forEach((access) => {
        if (this.attrsMap[access]) {
          this.selected[access].forEach((user) => {
            if (this.permissions[user]) {
              this.permissions[user][this.attrsMap[access]] = true;
              if (disableMulti && selected && !selected.userChecked.includes(user)) {
                selected.userChecked.push(user);
              }
            }
          });
        }
      });
    const permissions =
      Object.keys(this.permissions)
        .filter(user => this.selected.userChecked.includes(user))
        .filter(user => this.users.includes(user))
        .map(user => ({
          user,
          permissions: this.permissions[user],
        }));

    if (onChange) {
      onChange(permissions, owner);
    }
  }

  /* table数据格式化 */

  formatData = () => {
    const {
      lang, users, disableMulti, onDelete,
    } = this.props;
    this.userCount = users.length;
    this.users = this.userFilter(users).map(user => user.name);
    const dataSource = this.userFilter(users).map((user, i) => ({
      key: `bucket_modal_access_user_${user.name}_${i}`,
      user: user.name,
      action: user.name,
      access: false,
      list: false,
      upload: false,
      download: false,
      delete: false,
      wipe: false,
    }));

    const columnsData = [
      {
        title1: lang.userName,
        attr: 'userChecked',
        key: '',
        keyAttr: 'user',
        title2: 'user',
      },
      {
        title1: lang.accessBucket,
        attr: 'accessChecked',
        key: 'access',
        keyAttr: 'user',
      },
      {
        title1: lang.listBucketObject,
        attr: 'listChecked',
        key: 'list',
        keyAttr: 'user',
      },
      {
        title1: lang.uploadBucketObject,
        attr: 'uploadChecked',
        key: 'upload',
        keyAttr: 'user',
      },
      {
        title1: lang.downloadBucketObject,
        attr: 'downloadChecked',
        key: 'download',
        keyAttr: 'user',
      },
      {
        title1: lang.deleteBucketObject,
        attr: 'deleteChecked',
        key: 'delete',
        keyAttr: 'user',
      },
      {
        title1: lang.deleteBucket,
        attr: 'wipeChecked',
        key: 'wipe',
        keyAttr: 'user',
      },
      {
        title1: lang.options,
        key: 'action',
        attr: 'userChecked',
        keyAttr: 'action',
      },
    ];

    if (!disableMulti) {
      columnsData.pop();
    }

    const columns = columnsData.map(cdata => ({
      title: (
        <PermissionRenderTitle
          disableMulti={disableMulti}
          attr={cdata.attr}
          setCheckedAll={this.setCheckedAllLogic}
          setCheckedUser={this.setCheckedUser}
          setCheckedUserAll={this.setCheckedUserAll}
          getCheckedAllStatus={this.getCheckedAllStatus}
          title={cdata.title1}
        />),
      dataIndex: cdata.key,
      key: cdata.key,
      render: (text, record) =>
        (<PermissionRenderBody
          disableMulti={disableMulti}
          attr={cdata.attr}
          setChecked={this.setCheckedLogic}
          getChecked={this.getChecked}
          title={cdata.title2}
          setCheckedUser={this.setCheckedUser}
          action={cdata.keyAttr === 'action'}
          keyAttr={record[cdata.keyAttr]}
          onDelete={onDelete}
        />),
    }));

    return { data: dataSource, columns };
  }


  render() {
    const { lang, disableMulti } = this.props;
    const { data, columns } = this.formatData();
    return (
      <div className="bucket-modalitem-wrapper">
        <FormItem
          {...formItemLayout}
          label={
            !disableMulti ?
              <span className="dtModalGroupTitle">{lang.accessPermission}</span>
              : null
          }
        >
          <span />
        </FormItem>
        <FormItem
          {...formItemLayout}
          label={
            !disableMulti ?
              lang.userList
              : null
          }
        >
          {
          !disableMulti ?
            <Input.Search
              title={lang.searchUser}
              placeholder={lang.searchUser}
              onPressEnter={this.searchUser}
            />
          : null
        }
        </FormItem>
        <div className="modal-access-wrapper selfScrollbar">
          <Table pagination={false} dataSource={data} columns={columns} className="dt-table-no-border" />
        </div>
      </div>
    );
  }
}

export default CheckedTable;
