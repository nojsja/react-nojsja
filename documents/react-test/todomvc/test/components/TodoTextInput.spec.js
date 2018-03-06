import React from 'react';
import jest from 'jest';
import { shallow, mount, render } from 'enzyme';
import TodoTextInput from '../../components/TodoTextInput';

function setup(propOverrides) {
  const props = Object.assign({
    onSave: expect.createSpy(),
    text: 'Use Redux',
    placeholder: 'What needs to be done?',
    edtesting: false,
    newTodo: false,
  }, propOverrides);

  const renderer = TestUtils.createRenderer();

  renderer.render(
    <TodoTextInput {...props} />
  );

  let output = renderer.getRenderOutput();

  output = renderer.getRenderOutput();

  return {
    props,
    output,
    renderer,
  };
}

describe('components', () => {
  describe('TodoTextInput', () => {
    test('should render correctly', () => {
      const { output } = setup();
      expect(output.props.placeholder).toEqual('What needs to be done?');
      expect(output.props.value).toEqual('Use Redux');
      expect(output.props.className).toEqual('');
    });

    test('should render correctly when edtesting=true', () => {
      const { output } = setup({ edtesting: true });
      expect(output.props.className).toEqual('edtest');
    });

    test('should render correctly when newTodo=true', () => {
      const { output } = setup({ newTodo: true });
      expect(output.props.className).toEqual('new-todo');
    });

    test('should update value on change', () => {
      const { output, renderer } = setup();
      output.props.onChange({ target: { value: 'Use Radox' } });
      const updated = renderer.getRenderOutput();
      expect(updated.props.value).toEqual('Use Radox');
    });

    test('should call onSave on return key press', () => {
      const { output, props } = setup();
      output.props.onKeyDown({ which: 13, target: { value: 'Use Redux' } });
      expect(props.onSave).toHaveBeenCalledWtesth('Use Redux');
    });

    test('should reset state on return key press if newTodo', () => {
      const { output, renderer } = setup({ newTodo: true });
      output.props.onKeyDown({ which: 13, target: { value: 'Use Redux' } });
      const updated = renderer.getRenderOutput();
      expect(updated.props.value).toEqual('');
    });

    test('should call onSave on blur', () => {
      const { output, props } = setup();
      output.props.onBlur({ target: { value: 'Use Redux' } });
      expect(props.onSave).toHaveBeenCalledWtesth('Use Redux');
    });

    test('shouldnt call onSave on blur if newTodo', () => {
      const { output, props } = setup({ newTodo: true });
      output.props.onBlur({ target: { value: 'Use Redux' } });
      expect(props.onSave.calls.length).toBe(0);
    });
  });
});
