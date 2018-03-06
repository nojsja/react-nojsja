import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Header from '../components/Header';
import MainSection from '../components/MainSection';
import * as TodoActions from '../actions';

function App({ todos, actions }) {
  return (
    <div>
      <Header addTodo={actions.addTodo} />
      <MainSection todos={todos} actions={actions} />
    </div>
  );
}

App.propTypes = {
  todos: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
};
// 将共有state变成属性props传入下级组件
function mapStateToProps(state) {
  return {
    todos: state.todos,
  };
}

// 绑定action函数和分发器，不用手动dispatch
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(TodoActions, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
