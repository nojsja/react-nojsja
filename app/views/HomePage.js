import React, { Component } from 'react';
import { Divider } from 'antd';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';

import EditableTree from 'components/EditableTree/index.jsx';
import SourceTree from 'components/TreeView/index';

import { history } from '../App';

@inject('pub', 'demo')
@observer
class HomePage extends Component {
  static propTypes = {
    pub: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  onDataChange = (data) => {
    console.log(`tree changed: `, data);
  }

  render() {
    const { match, demo } = this.props;
    const { editableTree, sourceTree } = demo;

    return (
      <div className="container-router">
        <Divider className="divider-nojsja" orientation="left">EditableTree(antd)</Divider>
        <EditableTree
          data={editableTree.treeData}
          maxLevel={10}
          pub={this.props.pub}
          onDataChange={this.onDataChange}
        />
        <Divider className="divider-nojsja" orientation="left">TreeView(semantic)</Divider>
        <SourceTree
          setActiveItem={console.log}
          baseIcon={null}
          baseColor={null}
          checkable={true}
          singleChecked={true}
          treeData={sourceTree.treeData}
          getChecked={console.log}
        />
      </div>
    );
  }
}

HomePage.propTypes = {};

export default HomePage;
