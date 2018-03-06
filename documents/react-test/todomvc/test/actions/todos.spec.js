import * as types from '../../constants/ActionTypes';
import * as actions from '../../actions';
import jest from 'jest';

describe('todo actions', () => {
  test('addTodo should create ADD_TODO action', () => {
    expect(actions.addTodo('Use Redux')).toEqual({
      type: types.ADD_TODO,
      text: 'Use Redux',
    });
  });

  test('deleteTodo should create DELETE_TODO action', () => {
    expect(actions.deleteTodo(1)).toEqual({
      type: types.DELETE_TODO,
      id: 1,
    });
  });

  test('editTodo should create EDIT_TODO action', () => {
    expect(actions.editTodo(1, 'Use Redux everywhere')).toEqual({
      type: types.EDIT_TODO,
      id: 1,
      text: 'Use Redux everywhere',
    });
  });

  test('completeTodo should create COMPLETE_TODO action', () => {
    expect(actions.completeTodo(1)).toEqual({
      type: types.COMPLETE_TODO,
      id: 1,
    });
  });

  test('completeAll should create COMPLETE_ALL action', () => {
    expect(actions.completeAll()).toEqual({
      type: types.COMPLETE_ALL,
    });
  });

  test('clearCompleted should create CLEAR_COMPLETED action', () => {
    expect(actions.clearCompleted()).toEqual({
      type: types.CLEAR_COMPLETED,
    });
  });
});
