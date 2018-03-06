import React from 'react';
import jest from 'jest';
import { shallow, mount, render } from 'enzyme';
import Footer from '../../components/Footer';
import { SHOW_ALL, SHOW_COMPLETED, SHOW_ACTIVE } from '../constants/TodoFilters';

// 模拟 props
const setup = (completedCount=0, activeCount=0, selectedFilter=SHOW_ALL) => {
  const props = {
     onAddClick: jest.fn(), // Jest 提供的mock 函数
     completedCount,
     onClearCompleted: jest.fn(),
     selectedFilter,
     onShow: jest.fn()
  }
  // 通过 enzyme 提供的 shallow(浅渲染) 创建组件
  const wrapper = shallow(<Footer {...props} />) ;
  return { props, wrapper };
}

describe('components', () => {
  describe('Footer', () => {

    // 渲染整个组件结构
    test('should render container', () => {
      const { wrapper, props } = setup();
      expect( wrapper.find('.footer') ).toHaveLength(1) ;
    });

    test('should display active count when 0', () => {
      const { wrapper } = setup();
      expect( wrapper.find('.todo-count').text() ).toBe('No items left');
    });

    test('should display active count when above 0', () => {
      const { wrapper } = setup(0, 1);
      expect( wrapper.find('.todo-count').text() ).toBe('1 item left');
    });

    test('should render filters', () => {
      const { wrapper } = setup();

      expect( wrapper.find('.filters').name() ).toBe('ul');
      expect( wrapper.find('.filters > li') ).toHaveLength(3);

      wrapper.find('.filters > li').forEach((node, index) => {

        expect( node.childAt(0).hasClass(i === 0 ? 'selected' : '') ).toBe(true);
        expect( node.childAt(0).text() ).toBe({
          0: 'All',
          1: 'Active',
          2: 'Completed',
        }[i]);

      });
    });

    test('should call onShow when a filter is clicked', () => {
      const { wrapper, props } = setup();
      const [, filters] = output.props.children;
      const filterLink = filters.props.children[1].props.children;
      filterLink.props.onClick({});
      expect(props.onShow).toHaveBeenCalledWith(SHOW_ACTIVE);
    });

    test('shouldnt show clear button when no completed todos', () => {
      const { output } = setup({ completedCount: 0 });
      const [, , clear] = output.props.children;
      expect(clear).toBe(null);
    });

    test('should render clear button when completed todos', () => {
      const { output } = setup({ completedCount: 1 });
      const [, , clear] = output.props.children;
      expect(clear.type).toBe('button');
      expect(clear.props.children).toBe('Clear completed');
    });

    test('should call onClearCompleted on clear button click', () => {
      const { output, props } = setup({ completedCount: 1 });
      const [, , clear] = output.props.children;
      clear.props.onClick({});
      expect(props.onClearCompleted).toHaveBeenCalled();
    });
  });
});
