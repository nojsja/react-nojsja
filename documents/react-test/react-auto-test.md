#### 文档结构    
-----------

__1. 几种测试方案的对比__  
__2. 测试环境 Jest 和 Enzyme[ˈenzaɪm]的基本介绍__  
__3. 组件测试的要点分析__  
__4. 测试注意事项__  
__5. Enzyme中各种组件渲染方法的介绍__  
__6. 测试实例讲解(快照测试和Dom测试)__  

#### 目前存在的测试解决方案  
-----------------------

1. __karma + Jasmine__  
2. __Mocha + Chai + Sinon__  
3. __Jest + Enzyme__  

##### 几种方案的对比  

>__1.__ karma+Jasmine虽然很流行，但是在react体系中不推荐，不适用于React的组件结构和  Jsx语法，它更适用于Angular。  

>__2.__ Mocha + Chai + Sinon，Mocha是一个非常流行功能丰富的的单元测试框架，Chai是一个断言框架(判断执行结果是否同于预期),Sinon是一个mock框架，可以对任何对象进行mock操作(测试代码之间的链接，捕获对函数的调用)。  

>__3.__ Jest + Enzyme，Jest 是 Facebook 官方发布的一个开源的JS单元测试工具，提供了包括内置的测试环境 DOM API 支持、断言库、Mock 库等，非常强大；Enzyme则是对React自己的测试工具的封装，通过jQeury式的代码风格进行DOM处理，简洁强大的API对开发者非常友好。这两个框架在开源社区都具有极高的人气，github的star数量都是10k+。  

#### 组件测试时的要点分析  
---------------------

>__1.__ 测试Dom结构是否正常解析，UI是否完全加载。不涉及对Dom交互的测试，只是对测试Dom渲染结果是否符合预期。  

>__2.__ 测试功能函数，主要是Redux的Action和Reducer的测试。功能函数除了普通的工具处理类函数，直接引入函数，传入特定参数调用，判断函数返回值是否符合预期。要注意全面性，保证函数的每个逻辑判断都被覆盖到。  

>__3.__ 测试组件的交互情况，使用simulate接口来模拟各种Dom事件，比如点击事件。模拟事件触发后，需要去判断特定函数是否被调用，传参是否正确；组件状态是否发生预料之中的修改；dom节点是否存在是否符合期望等等。  

#### 测试注意事项  
---------------

>__[1]__ 拆分单元，关注输入输出，忽略中间过程。dom测试时只用确保正确调用了action函数，传参正确，而不用关注函数调用结果，单元测试需要保证的当前单元正常，对于每个单元模块输入输出都正确，理论串联后一起使用闭环时也会正确。  

>__[2]__ 多种情况的测试覆盖，如果不能保证测试的全面性，每种情况都覆盖到，那么这个测试就是个不敢依靠的不全面的测试。当然在实际项目中，可能因为时间、资源等问题，无法保证每种情况都测试到，而只测试主要的内容。  

>__[3]__ 关注该关注的，无关紧要的mock掉。css、图片这种mock掉，http请求mock掉。  

>__[4]__ 原本不利于测试的代码还是需要修改的，并不能为了原代码稳定不变，在测试时不敢动原代码。譬如函数不纯，没有返回值等。  

#### Enzyme中组件渲染方法的介绍和使用  
--------------------------------

>__1.__ Shallow ----> 将一个组件渲染成虚拟的React对象树，但是只渲染第一层，不渲染所有子组件，所以处理速度非常快。它不需要DOM环境，因为根本没有加载进DOM。  

>__2.__ Render ----> 将React组件渲染成静态的HTML字符串，然后分析这段HTML代码的结构，返回一个Dom树对象。它跟shallow方法非常像，主要的不同是采用了第三方HTML解析库Cheerio，它返回的是一个Cheerio实例对象，Render和Shallow的API基本一致。  

>__3.__ Mount ----> 用于将React组件加载为真实DOM节点，它会渲染当前组件和所有子组件，耗时更久。当我们编写的React组件需要与人进行交互测试或是需要测试React生命周期的时候就需要使用这种完全渲染了。  

#### 测试实例讲解  
---------------
1. __Snapshot快照测试__  
2. __Dom组件测试__  

##### Snapshot快照测试  

>__1.__ 定义和用途  
snapshot即为快照测试，是属于一种快速测试方法；可以测试组件的渲染结果是否符合预期，预期就是指你上一次录入保存的结果，toMatchSnapshot方法会去帮你对比本次组件生成的结构和上一次组件生成的结构的区别，如果两次的组件结构完全相同就表示测试成功。  

>__2.__ 测试用例编写  

    // -------------- 组件demo -------------- //
    class LinkButton extends Component {
      constructor() {
        super();
        this.state = {liked: false};
      }
      handleClick = () => {
        this.setState({
          liked: !this.state.liked
        });
      }
      render() {
        const text = this.state.liked ? 'like' : 'haven\'t liked';
        return (<p onClick={this.handleClick}>
          You {text} this.Click to toggle.
        </p>);
      }
    }

    // -------------- 编写测试 -------------- //
    import { render } from 'enzyme';
    import toJson from 'enzyme-to-json';

    describe('<LinkButton/>', () => {
      test('Snapshot', () => {
        const component = render(<LinkButton/>);

        expect( toJson(component) ).toMatchSnapshot();

        // 模拟第一次点击
        component.simulate('click');
        expect( toJson(component) ).toMatchSnapshot();

        // 模拟第二次点击，组件状态回复
        component.simulate('click');
        expect( toJson(component) ).toMatchSnapshot();
      });
    });

>__3.__ 测试分析  

    // 首先运行
    npm test

>运行后就会生成__tests__\__snapshots__\LinkButton.snapshot-test.js.snap快照文件，打开文件，可以看到文件内容，里面包含组件的三种状态。  

    exports[`<LinkButton/> Snapshot 1`] = `
    <p
      onClick={[Function bound handleClick]}>
      You
      haven\'t liked
      this.Click to toggle.
    </p>
    `;

    exports[`<LinkButton/> Snapshot 2`] = `
    <p
      onClick={[Function bound handleClick]}>
      You
      like
      this.Click to toggle.
    </p>
    `;

    exports[`<LinkButton/> Snapshot 3`] = `
    <p
      onClick={[Function bound handleClick]}>
      You
      haven\'t liked
      this.Click to toggle.
    </p>
    `;

>此时，如果我们修改LinkButton.js文件，比如将p标签中的文件修改为Me {text} this.Click to toggle,然后我们再次运行测试,控制台显示测试未通过，并将两次快照不核匹配的位置标记出来。这可以防止无意间修改组件的某些部分。  
>如果确实需要更新快照文件，需要使用命令更新快照文件：  

    npm run test -- -u

##### Dom组件测试

1. UI渲染测试   
2. 功能函数测试  
3. DOM交互测试  

>[测试用例地址-->](https://github.com/NoJsJa/work/tree/master/react-test/todomvc)  
>[1] Enzyme提供了很多的Dom选择器，完全跟css的选择器用法相同，比如 wrapper.find('.father > child').text()，但是不支持复杂的css3选择器，使用Dom选择器可以让我们对Enzyme渲染出的组件的各个组成部分进行检查，看渲染结果是否符合预期。[具体用法-->](http://airbnb.io/enzyme/docs/api/shallow.html)  
>[2] Jest则提供了断言判断器，拥有类似自然语言的语法结构，比如 expect(array).toHaveLength(3)，使用断然判断器一般是在使用Enzyme的Dom选择器之后，对Dom选择的结果进行真值判断和匹配判断，比如 expect(wrapper.find('.kind').text()).toBe('kind')；Jest还提供了很多特性，比如Mock函数(模拟函数)，Mock功能可以轻松地通过擦除函数的实际实现来测试代码之间的链接，捕获对函数的调用，在使用new实例化时捕获构造函数的实例，并允许测试时间配置返回值。[具体用法-->](http://facebook.github.io/jest/docs/zh-Hans/mock-functions.html#content)

>__1.__ UI渲染测试  
>UI的渲染需要使用Enzyme的shallow或是render方法进行虚拟渲染，具体适用场景上文有提及，[官方用法介绍-->](http://airbnb.io/enzyme/docs/api/index.html)  


    import jest from 'jest';
    import { shallow, mount, render } from 'enzyme';
    import Footer from '../../components/Footer';

    // -------------- 模拟组件渲染 -------------- //

    // 封装成setup方法，测试时可以自行传递就需要的参数
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


    // -------------- 测试编写 -------------- //
    describe('components', () => {
      describe('Footer', () => {

        // 测试渲染整个组件结构
        test('should render container', () => {
          const { wrapper, props } = setup();
          expect( wrapper.find('.footer') ).toHaveLength(1) ;
        });

        // 测试特殊值情况
        test('should display active count when 0', () => {
          const { wrapper } = setup();
          expect( wrapper.find('.todo-count').text() ).toBe('No items left');
        });

        // 测试特殊值情况
        test('should display active count when above 0', () => {
          const { wrapper } = setup(0, 1);
          expect( wrapper.find('.todo-count').text() ).toBe('1 item left');
        });

        // 测试循环生成的标签
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

      });
>__2.__ 功能函数测试  
>由于功能函数都是纯函数，所以测试只需要试用Jest进行简单的输出匹配测试就可以了  

    // -------------- Action测试 -------------- //
    import * as types from '../../constants/ActionTypes';
    import * as actions from '../../actions';
    import jest from 'jest';

    // 模拟分发action
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

    });


    // -------------- Reducer测试 -------------- //
    import todos from '../../reducers/todos';
    import jest from 'jest';
    import * as types from '../../constants/ActionTypes';

    // 模拟reducer初始输入值和指令
    describe('todos reducer', () => {
      test('should handle DELETE_TODO', () => {
        expect(
          todos([
            {
              text: 'Run the tests',
              completed: false,
              id: 1,
            }
          ], {
            type: types.DELETE_TODO,
            id: 1,
          })
        ).toEqual([

        ]);
      });

      test('should handle EDIT_TODO', () => {
        expect(
          todos([
            {
              text: 'Run the tests',
              completed: false,
              id: 1,
            }
          ], {
            type: types.EDIT_TODO,
            text: 'Fix the tests',
            id: 1,
          })
        ).toEqual([
          {
            text: 'Fix the tests',
            completed: false,
            id: 1,
          },
        ]);
      });
    });

>__3.__ DOM交互测试  
>Dom交互测试与前两个测试的复杂度相比是最高的，因为需要完整的模拟出组件的运行状态和并检查组件与人的交互操作结果，需要注意的是测试编写者应该尽量将各种交互情况考虑完全。  

    // -------------- 测试组件结构 -------------- //
    class CheckboxWithLabel extends React.Component {

      constructor(props) {
        super(props);
        this.state = {isChecked: false};
      }

      onChange = () => {
        this.setState({isChecked: !this.state.isChecked});
      }

      render() {
        return (
          <label>
            <input
              type="checkbox"
              checked={this.state.isChecked}
              onChange={this.onChange}
            />
            {this.state.isChecked ? this.props.labelOn : this.props.labelOff}
          </label>
        );
      }
    }

    // -------------- 模拟测试组件交互 -------------- //
    import React from 'react';
    import {shallow} from 'enzyme';

    describe('components', () => {
      describe('CheckboxWithLabel', () => {

        test('CheckboxWithLabel changes the text after click', () => {

          const checkbox = shallow(
            <CheckboxWithLabel labelOn="On" labelOff="Off" />
          );

          expect(checkbox.text()).toEqual('Off');
          // 事件模拟
          checkbox.find('input').simulate('change');

          expect(checkbox.text()).toEqual('On');
        });

      });

    });
