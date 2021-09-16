import React, { Component } from 'react';
import { Divider, Button } from 'antd';
import { inject, observer } from 'mobx-react';
import { toJS } from 'mobx';
import PropTypes from 'prop-types';

import EditableTree from '@nojsja/editable-tree-antd';
import SourceTree from '@nojsja/semantic-tree-view';
import AudioPreview from '@nojsja/audio-preview';
import InfiniteScroll from '@nojsja/infinite-scroll';
import ModalWindow from '@nojsja/modal-window';

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
    const { match, demo, pub } = this.props;
    const {
      editableTree,
      sourceTree,
      audioPlayer,
      infiniteScroll,
    } = demo;

    return (
      <div className="container-router">
        {/* EditableTree */}
        <Divider className="divider-nojsja" orientation="right">EditableTree(antd)</Divider>
        <div className="content-wrapper">
          <EditableTree
            data={toJS(editableTree.treeData['zh_CN'])}
            maxLevel={10}
            enableYaml={true}
            lang="zh_CN"
            onDataChange={this.onDataChange}
          />
        </div>
        {/* TreeView */}
        <Divider className="divider-nojsja" orientation="right">TreeView(semantic)</Divider>
        <div className="content-wrapper">
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
        {/* AudioPreview */}
        <Divider className="divider-nojsja" orientation="right">AudioPreview(semantic)</Divider>
        <div className="content-wrapper">
          <AudioPreview
            dataUrl={audioPlayer.src}
          />
        </div>
        {/* InfiniteScroll */}
        <Divider className="divider-nojsja" orientation="right">InfiniteScroll</Divider>
        <div className="content-wrapper">
          <InfiniteScroll
            lang={pub.lang} // [*] lang injection
            scrollTrigger={demo.infiniteScroll_loadMore} // [*] function will be called when scroll to bottom
            initialLoad // auto call scrollTrigger when dom mounted
            loading={infiniteScroll.loading} // loading indicator
            onScroll={console.log} // function will be called when user scroll on the component
            hasMore={infiniteScroll.hasMore} // [*] Set this attr to let component know when to stop call scrollTrigger
            minHeight="50px" // min height of content
            maxHeight="200px" // max height of content 
          >
            {
              infiniteScroll.data.map((item) => <p>{item}</p>)
            }
          </InfiniteScroll>
        </div>
        {/* ModalWindow */}
        {/* <Divider className="divider-nojsja" orientation="right">ModalWindow</Divider>
        <div className="content-wrapper">
          <ModalWindow
            trigger={
              <Button>trigger</Button>
            }
            label={'Modal Window'}
          >
            <p>Modal Window Content</p>
          </ModalWindow>
        </div> */}
      </div>
    );
  }
}

HomePage.propTypes = {};

export default HomePage;
