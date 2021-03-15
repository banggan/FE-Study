- 虚拟dom?vdom 的如何应用，核心 API 是什么？diff算法？

  >- 定义：用js模拟dom结构，dom变化的对比放在js层来做,优点：提升重绘性能；
  >
  >- Snabbdom：一个 vdom 实现库。
  >
  >- 核心api
  >
  >  - h函数：是生成虚拟 DOM 的函数
  >
  >    >h（'<标签名>'，{ ... 属性 ... }，[... 子元素 ...]） 
  >    >
  >    >h（'<标签名>'，{ ... 属性 ... }，[ ‘....’]）
  >
  >  - patch函数：使用 diff 算法来比较旧 VNode 及新的 VNode 之间的差异然后执行 Patch Operation 或者叫 Patch 函数来高效更新 Dom 节点。
  >
  >    >patch（container，vnode）
  >    >
  >    >patch（vnode，newVnode）
  >
  >- vue中的diff算法
  >
  >  - DOM 操作是 “昂贵”的，因此尽量减少DOM 操作，找出本次 DOM 必须更新的节点来更新，其它的不更新，找出的过程就是diff算法；
  >
  >- diff算法的过程
  >
  >  ```javascript
  >  //>>>>>>>>>>patch(container,vnode)
  >  //核心逻辑 createElment
  >  function createElement(vnode) {
  >      let tag = vnode.tag
  >      let attrs = vnode.attr || {}
  >      let children = vnode.children || []
  >      let elem = document.createElement(tag)
  >      for (let attrName in attrs) {
  >          if (attr.hasOwnProperty(attrName)) {
  >              elem.setAttribute(attrName, attrs[attrName])
  >          }
  >      }
  >      children.forEach((childVnode) => {
  >          elem.append(createElement(childVnode))
  >      })
  >      return elem
  >  }
  >  //>>>>>>>>>>patch(vnode，newVnode）
  >  //核心逻辑 updateChildren
  >  function updateChildren(vnode, newVnode) {
  >      let children = vnode.children || []
  >      let newChildren = newVnode.children || []
  >      children.forEach((child, index) => {
  >          let newChild = newChildren[index]
  >          if (newChild == null) {
  >              return
  >          }
  >          if (child.tag === newChild.tag) {
  >              updateChildren(child, newChild)
  >          } else {
  >              replaceNode(child, newChild)
  >          }
  >      })
  >  }
  >  ```

- vue相关

  >- 框架和库的区别
  >
  >>小而巧的库，只提供特定的API；优点就是 船小好调头。可以很方便的从一个库切换到另外的库；但是代码几乎不会改变; 大而全的是框架；框架提供了一整套的解决方案；所以，如果在项目中间，想切换到另外的框架，是比较困难的
  >>
  >>数据 和 视图 的分离，解耦（ 开放封闭原则 ）
  >>
  >>VUE 以数据驱动视图，只关心数据变化，DOM 操作被封装
  >
  >- Vue和其他框架的区别
  >
  >- Vue vs angluar
  >
  >AngularJS的学习成本高，比如增加了Dependency Injection特性，而Vue.js本身提供的API都比较简单、直观；在性能上，AngularJS依赖对数据做脏检查，所以Watcher越多越慢；Vue.js使用基于依赖追踪的观察并且使用异步队列更新，所有的数据都是独立触发的。
  >
  >- Vue vs react
  >
  >React采用的Virtual DOM会对渲染出来的结果做脏检查；Vue.js在模板中提供了指令，过滤器等，可以非常方便，快捷地操作Virtual DOM
  >
  >- MVVM框架模式
  >
  >- 是Model-View-ViewModel的简写。是一个软件架构设计模式，是一种简化用户界面的事件驱动编程方式
  >- Model 代表数据模型
  >- View 代表视图，它负责将数据模型转化成UI 展现出来
  >- 连接 Model 和 View,简单理解就是一个同步View 和 Model的对象，连接Model和View
  >
  >- vue三要素
  >
  >- 响应式：vue 如何监听到 data 的每个属性变化？【observe类】【dep对象】【wather 执行者】
  >
  > >- data 属性被代理到 vm 上
  > >
  > >- Object.defineProperty(双向数据绑定)
  > >
  > >  - 定义：Object.defineProperty() 方法会直接在一个对象上定义一个新属性，或者修改一
  > >
  > >    个对象的现有属性， 并返回这个对象
  > >
  > >  - 缺点
  > >
  > >    - Object.defineProperty无法监控到数组下标的变化，导致通过数组下标添加元素，不能实时响应；
  > >    - Object.defineProperty只能劫持对象的属性，从而需要对每个对象，每个属性进行遍历，如果，属性值是对象，还需要深度遍历。Proxy可以劫持整个对象，并返回一个新的对象。
  > >    - Proxy不仅可以代理对象，还可以代理数组。还可以代理动态增加的属性。
  > >
  > >- data 属性变化
  > >
  > >  - 修改属性，被响应式 的 set 监听到
  > >  - set 中执行 updataComponent （ 异步 ）
  > >  - updataComponent 重新执行 vm.render()
  > >  - 生成的 vnode 和 prevVnode，通过 patch 进行比较
  > >  - 渲染到html中
  >
  >- 模板引擎: vue 的模板如何被解析，指令如何处理？
  >
  > >- 模版是什么？
  > >
  > >  本质：字符串，有逻辑v-if、最终还是以html的形式展示
  > >
  > >- vue 中如何解析模板？
  > >
  > >  模板必须转换成 render 函数 (编译的第一步是将模板通过 parse 函数解析成 AST（抽象语法树），第二步优化AST（检测出不需要更改的DOM的纯静态子树），第三步根据优化后的抽象语法树生成包含渲染函数字符串的对象。)
  > >
  > >  - 第一步：是将模板通过 parse 函数解析成 AST（抽象语法树），在解析模版的过程中，不断触发各种钩子函数，将节点信息通过 start， end 和 chars ，comment方法传递给 Vue.js 的 ast 构建程序，边解析边同时构建模版的 ast
  > >  - 第二步：优化AST（检测出不需要更改的DOM的纯静态子树）optimize 函数
  > >  - 第三步：根据优化后的抽象语法树生成包含渲染函数字符串的对象。generate 函数
  >
  >- 渲染： vue的模版如何被渲染成html?以及渲染过程？
  >
  > >- render 函数 与 vdom
  > >  - updataComponent 中实现了生成 vdom 的 patch
  > >  - 页面首次渲染执行 updataComponent
  > >  - render 函数 - with 的用法
  > >  - data 中每次修改属性，执行 updataComponent
  >
  >- vue的整个实现流程
  >
  > >1. 第一步：解析模板成 render 函数
  > >2. 第二步：响应式开始监听
  > >3. 第三步：首次渲染，显示页面，且绑定依赖
  > >4. 第四步：data 属性变化，触发 rerender
  >
  >- vue的生命周期
  >
  > >- Vue 实例从创建到销毁的过程，就是生命周期。也就是从开始创建、初始化数据、编译模板、挂载Dom→渲染、更新→渲染、卸载等一系列过程，我们称这是 Vue 的生命周期
  > >  - 可以总共分为8个阶段：创建前/后, 载入前/后,更新前/后,销毁前/销毁后
  > >  - 每个生命周期适合的场景
  > >    - beforecreate：可以在这加个loading事件，在加载实例时触发
  > >    - created：初始化完成时的事件写在这里，如在这结束loading事件，异步请求也适宜在这里调用
  > >    - mounted：挂载元素，获取到DOM节点
  > >    - updated：如果对数据统一处理，在这里写上相应函数
  > >    - beforeDestroy：可以做一个确认停止事件的确认框 
  > >    - nextTick : 更新数据后立即操作dom
  > >- 钩子函数
  > >  1. beforeCreate ：组件实例刚创建，data和methods 中的数据未被初始化
  > >  2. created：组件实例创建完成，data 和 methods 都已经被初始化好了！但DOM还未生成
  > >  3. beforeMount：模板编译/挂载之前
  > >  4. mounted：模板编译/挂载之后
  > >  5. beforeUpdate：组件更新之前
  > >  6. updated：组件更新之后
  > >  7. beforeDestroy：组件销毁前调用
  > >  8. destroyed：组件销毁后调用
  >
  >- vue组件之间的通信
  >
  > - 六种方式
  >
  > >- Props/$emit
  > >
  > >  - 父A通过props的方式向子B传递，B to A 通过在 B 组件中 $emit, A 组件中 v-on 的方式实现
  > >  - 适用范围：父子组件
  > >
  > >- Emit/on
  > >
  > >  - 这种方法通过一个空的Vue实例作为中央事件总线（事件中心），用它来触发事件和监听事件,巧妙而轻量地实现了任何组件间的通信，包括父子、兄弟、跨级。当我们的项目比较大时，可以选择更好的状态管理解决方案vuex
  > >  - `var Event=new Vue();Event.$emit(事件名,数据); Event.$on(事件名,data => {})`
  > >  - 适用范围： 父子、兄弟跨级
  > >
  > >- vuex
  > >
  > >  - Vuex 是一个专为 Vue.js 应用程序开发的状态管理模式。它采用集中式存储管理应用的所有组件的状态，并以相应的规则保证状态以一种可预测的方式发生变化
  > >
  > >- inheritAttrs/Attrs/listeners
  > >
  > >  - 多级组件嵌套需要传递数据时，通常使用的方法是通过vuex。但如果仅仅是传递数据，而不做中间处理，使用 vuex 处理，未免有点大材小用。为此Vue2.4 版本提供了另一种方法----![attrs/](https://juejin.im/equation?tex=attrs%2F)listeners
  > >  - `inheritAttrs` 默认情况下父作用域的不被认作 props 的特性绑定 (attribute bindings) 将会“回退”且作为普通的 HTML 特性应用在子组件的根元素上.通过设置 `inheritAttrs:false` ，这些默认行为将会被去掉。而通过 (同样是 2.4 新增的) 实例属性 $attrs 可以让这些特性生效，且可以通过 v-bind 显性的绑定到非根元素上
  > >  - `$attrs` 是一个内置属性，指父组件传递的、除了自己定义的 props 属性之外的所有属性
  > >  - ``$listeners` 包含了作用在这个组件上所有的监听器，即父组件绑定的全部监听事件，通过 `v-on="$listeners"`，可以将这些事件绑定给它自己的子组件
  > >  - 适用范围：父组件传递数据给子组件或者孙组件
  > >
  > >- Provide/inject
  > >
  > >  以允许一个祖先组件向其所有子孙后代注入一个依赖，不论组件层次有多深，并在起上下游关系成立的时间里始终生效
  > >
  > >- Parent/children 和ref
  > >
  > >  - 缺点：无法在跨级或者兄弟间通信
  >
  > - 常见的适用场景
  >
  > >- 父子通信
  > >  - 父向子传递数据是通过 props，子向父是通过 events（emit）；通过父链 / 子链也可以通信（parent /children）；ref 也可以访问组件实例；provide / inject; attrs/$listeners
  > >- 兄弟通信
  > >  - Bus、vuex
  > >- 跨级通信：
  > >  - Bus 、vuex、provide / inject、 attrs/$listeners
  >
  >- vuex
  >
  >>- 定义： Vuex 是一个专为 Vue.js 应用程序开发的状态管理模式。它采用集中式存储管理应用的所有组件的状态，并以相应的规则保证状态以一种可预测的方式发生变化
  >>- 思想： 把组件的共享状态抽取出来，以一个全局单例模式管理，在这种模式下，我们的组件树构成了一个巨大的“视图”，不管在树的哪个位置，任何组件都能获取状态或者触发行为
  >>- vuex和单纯的全局对象的不同？
  >>  - Vuex 的状态存储是响应式的。
  >>  - 你不能直接改变 store 中的状态。该变 store 中的状态的唯一途径就是显式地提交 (commit) mutation。是因为我们想要更明确地追踪到状态的变化
  >>- vuex的组成
  >>  - state
  >>    - Vuex 使用 state来存储应用中需要共享的状态。为了能让 Vue 组件在 state更改后也随着更改，需要基于state创建计算属性
  >>  - getters
  >>    - 可以认为是 store 的计算属性，getter 的返回值会根据它的依赖被缓存起来，且只有当它的依赖值发生了改变才会被重新计算
  >>  - Mutations（同步）
  >>    - 改变状态的执行者，mutations用于同步的更改状态
  >>  - actions (异步)
  >>    - 异步的改变状态，actions不直接更改state，而是发起mutations
  >>  - Module: 模块化store
  >>    - 出现的问题：由于使用单一状态树，应用的所有状态会集中到一个比较大的对象。当应用变得非常复杂时，store 对象就有可能变得相当臃肿
  >>    - Vuex 允许我们将 store 分割成模块（module）。每个模块拥有自己的 state、mutation、action、getter、甚至是嵌套子模块
  >>- vuex的工作原理
  >>  - 数据从state中渲染到页面
  >>  - 在页面通过dispatch来触发action
  >>  - action通过调用commit,来触发mutation
  >>  - mutation来更改数据，数据变更之后会触发dep对象的notify，通知所有Watcher对象去修改对应视图（vue的双向数据绑定原理）
  >>- 运用场景
  >>  - 多个视图依赖于同一状态
  >>  - 来自不同视图的行为需要改变同一个状态
  >
  >- vue路由（vue-router）
  >
  >>- 前端路由
  >>
  >>- hash模式
  >> - 匹配不同的 url 路径，进行解析，然后动态的渲染出区域 html 内容。但是这样存在一个问题，就是 url 每次变化的时候，都会造成页面的刷新。那解决问题的思路便是在改变 url 的情况下，保证页面的不刷新
  >> - `http://www.xxx.com/#/login`; 这种 #。后面 hash 值的变化，并不会导致浏览器向服务器发出请求，浏览器不发出请求，也就不会刷新页面。另外每次 hash 值的变化，还会触发`hashchange`这个事件，通过这个事件我们就可以知道 hash 值发生了哪些变化。然后我们便可以监听`hashchange`来实现更新页面部分内容的操作
  >>- history模式
  >> - 14年后，因为HTML5标准发布。多了两个 API，`pushState`和 `replaceState`，通过这两个 API 可以改变 url 地址且不会发送请求。同时还有`popstate`事件。
  >> - 两个api相同之处是两个API都会操作浏览器的历史记录，而不会引起页面的刷新。不同之处在于pushState会增加一条新的历史记录，而replaceState则会替换当前的历史记录
  >> - 通过这些就能用另一种方式来实现前端路由了，但原理都是跟 hash 实现相同的。用了 HTML5 的实现，单页路由的 url 就不会多出一个#，变得更加美观。但因为没有 # 号，所以当用户刷新页面之类的操作时，浏览器还是会给服务器发送请求，为了避免出现这种情况，所以这个实现需要服务器的支持，需要把所有路由都重定向到根页面。
  >>
  >>- Vue-router:的实现
  >>
  >>- 定义
  >>
  >>```javascript
  >>import VueRouter from 'vue-router'
  >>Vue.use(VueRouter)
  >>
  >>const router = new VueRouter({
  >>mode: 'history',
  >>routes: [...]
  >>})
  >>
  >>new Vue({
  >>router
  >>...
  >>})
  >>//可以看出来vue-router是通过 Vue.use的方法被注入进 Vue 实例中，在使用的时候我们需要全局用到 vue-router的router-view和router-link组件，以及this.$router/$route这样的实例对象
  >>```
  >>
  >>- Vue-router实现--install
  >>
  >> - Vue 通过 use 方法，加载`VueRouter`中的 install 方法。install 完成 Vue 实例对 VueRouter 的挂载过程。下面我们来分析一下具体的执行过程
  >>
  >>```javascript
  >>//1. 在构造Vue实例的时候，我们会传入router对象
  >>//2. 此时的router会被挂载到 Vue 的跟组件this.$options选项中。在 option 上面存在 router 则代表是根组件。如果存在this.$options，则对_routerRoot 和 _router进行赋值操作，之后执行 _router.init() 方法。
  >>//3. 为了让 _router 的变化能及时响应页面的更新，所以又接着又调Vue.util.defineReactive方法来进行get和set的响应式数据定义
  >>//4. 然后通过 registerInstance(this, this)这个方法来实现对router-view的挂载操作：
  >>//5. 后续步骤便是为Vue全局实例注册2个属性$router和$route；以及组件RouterView和RouterLink。
  >>
  >>```
  >>
  >>- Vue-router实现--new VueRouter(options)
  >>
  >> - 为了构造出 `router` 对象，我们还需要对`VueRouter`进行实例化的操作，比如这样：
  >>
  >>```javascript
  >>//constructor实例化的时候将会做的处理：通过new VueRouter({...})我们创建了一个 VueRouter 的实例。VueRouter中通过参数mode来指定路由模式，前面已经简单的了解了一下前端路由的2种模式。通过上面的代码，我们可以看出来 VueRouter对不同模式的实现大致是这样的：
  >>
  >>//1. 首先根据mode来确定所选的模式，如果当前环境不支持history模式，会强制切换到hash模式；
  >>//2. 如果当前环境不是浏览器环境，会切换到abstract模式下。然后再根据不同模式来生成不同的history操作对象
  >>
  >>//init 方法内的 app变量便是存储的当前的vue实例的this。然后将 app 存入数组apps中。通过this.app判断是实例否已经被初始化。然后通过history来确定不同路由的切换动作动作 history.transitionTo。最后通过 history.listen来注册路由变化的响应回调。
  >>//接下来我们就要了解一下 history.transitionTo的主要流程以及 history.listen的实现。当然最基础的是先明白history是个什么东西。接下来我们会分别介绍不同mode下的 history 的实现。
  >>```
  >>
  >>- vue-router实现--hashhistory
  >>
  >> - 因为我们用的比较多的是 vue 的 HashHistory。下面我们首先来介绍一下 HashHistory。我们知道，通过`mode`来确定使用 `history`的方式，如果当前`mode = 'hash'`，则会执行
  >>
  >>- 组件
  >>
  >>- `<router-link>`
  >>- `<router-view>`
  >>- `<keep-alive>`
  >> - keepalive 是 Vue 内置的一个组件，可以使被包含的组件保留状态，或避免重新渲染 。也就是所谓的-----组件缓存
  >> - 使用 include/exclude
  >> - 增加router.meta属性 //keepAlive:true//需要缓存
  >> - activated 当 keepalive 包含的组件再次渲染的时候触发
  >> - deactivated 当 keepalive 包含的组件销毁的时候触发
  >>
  >>- 动态路由
  >>
  >>- 主要是适用path属性过程中，使用动态路径参数，以冒号开头
  >>- 响应路由参数的变化
  >> - `this.$route.params`
  >> - `watch $route对象`
  >> - 使用2.2中引入的beforeRouteUpdate导航守卫
  >>
  >>- 嵌套路由
  >>
  >>- 在VueRouter的参数中使用children配置
  >>
  >>- 导航
  >>
  >>- 声明式：`<router-link :to='...'>`
  >>- 编程式：`router.push(...)`
  >>
  >>- 重定向和别名
  >>
  >>- 重定向
  >>
  >>```javascript
  >>routes:[
  >>	{path:'/a',redirect:'./b'}
  >>]
  >>```
  >>
  >>- 别名
  >>
  >>```javascript
  >>routes:[
  >>	{path:'/a', component: A, alias: '/b'}
  >>]
  >>```
  >>
  >>- Vue-router两种模式
  >>
  >>- hash模式
  >> - 原理：原理是onhashchage事件，可以在window对象上监听这个事件
  >> - 描述：即通过在链接后添加 # + 路由名字，根据匹配这个字段的变化，触发 hashchange 事件，动态的渲染出页面
  >>- history模式
  >> - 利用了HTML5 History Interface 中新增的pushState()和replaceState()方法。
  >> - 缺点：1.需要后台配置支持。2. 如果刷新，服务器没有响应的资源，刷出404
  >>
  >>- 导航钩子函数（导航守卫）
  >>
  >>- '导航'表示路由正在发生改变
  >>
  >>- 作用：vue-router提供的导航守卫主要是通过跳转或者取消的方式守卫导航，有多重机会植入路由导航过程中；全局的、单个路由独享的或者组件级别的
  >>
  >>- 导航守卫有哪些
  >>
  >> - 全局导航钩子
  >>
  >>   - 全局前置守卫：`router.beforeEach`
  >>
  >>```javascript
  >>const router = new VueRouter({ ... });
  >>router.beforeEach((to, from, next) => {
  >>// do someting
  >>});
  >>//to:route 代表要进入的目标，是一个路由对象
  >>//from: route 代表当前正要离开的路由，也是个路由对象
  >>//next: 必须需要调用的方法，而具体的执行效果则依赖 next 方法调用的参数
  >>//1.next()：进入管道中的下一个钩子，如果全部的钩子执行完了，则导航的状态就是 confirmed（确认的）
  >>//2.next(false)：这代表中断掉当前的导航，即 to 代表的路由对象不会进入，被中断，此时该表 URL 地址会被重置到 from 路由对应的地址
  >>//3.next(‘/’) 和 next({path: ‘/’})：在中断掉当前导航的同时，跳转到一个不同的地址
  >>//4.next(error)：如果传入参数是一个 Error 实例，那么导航被终止的同时会将错误传递给 router.onError() 注册过的回调
  >>next 方法必须要调用，否则钩子函数无法 resolved
  >>```
  >>
  >>   - 全局解析守卫： 2.5.0增加：`router.beforeResolve`
  >>
  >>   - 全局后置钩子：`afterEach`，和前置钩子不同的是，这些钩子不会接受 next 函数也不会改变导航本身
  >>
  >> - 路由独享的钩子
  >>
  >>   - 单个路由独享的导航钩子，它是在路由配置上直接进行定义的：beforeEnter 
  >>
  >>```javascript
  >>cont router = new VueRouter({
  >>routes: [
  >> {
  >>     path: '/file',
  >>     component: File,
  >>     beforeEnter: (to, from ,next) => {
  >>         // do someting
  >>     }
  >> }
  >>]
  >>});
  >>```
  >>
  >> - 组件内的导航钩子
  >>
  >>   - `beforeRouteEnter`、`beforeRouteUpdate`、`beforeRouteLeave`他们是直接在路由组件内部直接进行定义的
  >>
  >>```javascript
  >>const File = {
  >>template: `<div>This is file</div>`,
  >>beforeRouteEnter(to, from, next) {
  >> // 在渲染该组件的对应路由被 confirm 前调用
  >>next(vm=>{
  >> //这里通过vm来访问组件实例，解决没有this的问题
  >>})
  >>},
  >>beforeRouteUpdate(to, from, next) {
  >> // 在当前路由改变，但是依然渲染该组件是调用
  >>},
  >>beforeRouteLeave(to, from ,next) {
  >> // 导航离开该组件的对应路由时被调用
  >>}
  >>}
  >>```
  >>
  >>   - beforeRouteEnter 不能获取组件实例 this，因为当守卫执行前，组件实例被没有被创建出来，剩下两个钩子则可以正常获取组件实例 this
  >>
  >>   - 但是并不意味着在 beforeRouteEnter 中无法访问组件实例，我们可以通过给 next 传入一个回调来访问组件实例。在导航被确认是，会执行这个回调，这时就可以访问组件实例
  >>
  >>   - 仅仅是 beforRouteEnter 支持给 next 传递回调，其他两个并不支持。因为归根结底，支持回调是为了解决 this 问题，而其他两个钩子的 this 可以正确访问到组件实例，所有没有必要使用回调
  >>
  >>- 完整的导航解析过程
  >>
  >> 1. ```ruby
  >>  1、导航被触发
  >>  2、在失活的组件里调用离开守卫
  >>  3、调用全局的 beforeEach 守卫
  >>  4、在重用的组件里调用 beforeRouteUpdate 守卫
  >>  5、在路由配置里调用 beforEnter
  >>  6、解析异步路由组件
  >>  7、在被激活的组件里调用 beforeRouteEnter
  >>  8、调用全局的 beforeResolve 守卫
  >>  9、导航被确认
  >>  10、调用全局的 afterEach 钩子
  >>  11、触发 DOM 更新
  >>  12、在创建好的实例调用 beforeRouteEnter 守卫中传给 next 的回调函数
  >>  ```
  >>```
  >>
  >>```
  >>
  >>```
  >>
  >>- 相关问题
  >>
  >> 1. vue-router是什么？有哪些组件？
  >> 2. active-class 是哪个组件的属性？
  >>    - active-class是router-link终端属性，用来做选中样式的切换，当router-link标签被点击时将会应用这个样式
  >> 3. 怎么定义vue-router的动态路由？怎么获取传过来的值？
  >> 4. vue-router有哪几种导航钩子？
  >> 5. route和router的区别是什么？
  >>    - router为VueRouter的实例，是一个全局路由对象，包含了路由跳转的方法、钩子函数等
  >>    - route 是路由信息对象||跳转的路由对象，每一个路由都会有一个route对象，是一个局部对象，包含path,params,hash,query,fullPath,matched,name等路由信息参数。
  >>    - 传参是this.router,接收参数是this.route
  >> 6. vue-router响应路由参数的变化
  >> 7. vue-router 传参
  >> 8. vue-router的两种模式
  >> 9. vue-router实现路由懒加载（动态加载路由）
  >>    - 把不同路由对应的组件分割成不同的代码块，然后当路由被访问时才加载对应的组件即为路由的懒加载，可以加快项目的加载速度，提高效率
  >>```
  >>
  >>```
  >>
  >>```
  >
  >- mixin
  >
  >- 一种分发Vue组件中可复用功能的非常灵活的一种方式
  >- 页面的风格不同，但是执行的方法和需要的数据类似
  >
  >- vue指令
  >
  >- 自定义指令：Vue.directive
  >- 自定义一个过滤器：Vue.filter('过滤器名称',function(){})
  >
  >- 面试
  >
  >1. css只在当前组件起作用
  >  - 在style标签中写入scoped即可 例如：<*style scoped></style*>
  >2. v-if 和 v-show 区别
  >  - v-if按照条件是否渲染，v-show是display的block或none；
  >3. vue.js的两个核心是什么？
  >  - 数据驱动、组件系统
  >4. vue几种常用的指令
  >  - v-for 、 v-if 、v-bind、v-on、v-show、v-else
  >5. vue常用的修饰符？
  >  - prevent: 提交事件不再重载页面；.stop: 阻止单击事件冒泡；.self: 当事件发生在该元素本身而不是子元素的时候会触发；.capture: 事件侦听，事件发生的时候会调用
  >6. v-on 可以绑定多个方法吗？
  >  - 可以
  >7. vue中 key 值的作用？
  >  1. 更准确
  >     - 当 Vue.js 用 v-for 正在更新已渲染过的元素列表时，它默认用“就地复用”策略。使用key可以避免就地复用的情况。所以会更加准确
  >  2. 更快
  >     - 利用key的唯一性生成map对象来获取对应节点，比遍历方式更快
  >8. 什么是vue的计算属性？
  >  - 在模板中放入太多的逻辑会让模板过重且难以维护，在需要对数据进行复杂处理，且可能多次使用的情况下，尽量采取计算属性的方式。
  >  - 好处
  >    1. 使得数据处理结构清晰
  >    2. 依赖于数据，数据更新，处理结果自动更新
  >    3. 计算属性内部this指向vm实例
  >    4. 在template调用时，直接写计算属性名即可
  >    5. 常用的是getter方法，获取数据，也可以使用set方法改变数据
  >    6. 较于methods，不管依赖的数据变不变，methods都会重新计算，但是依赖数据不变的时候computed从缓存中获取，不会重新计算
  >9. vue等单页面应用（ SPA）及其优缺点
  >  - 优点
  >    1. 用户体验好、快，内容的改变不需要重新加载整个页面，避免了不必要的跳转和重复渲染；
  >    2. 基于上面一点，SPA 相对对服务器压力小
  >    3. 前后端职责分离，架构清晰，前端进行交互逻辑，后端负责数据处理；
  >  - 缺点
  >    1. 不支持低版本的浏览器，最低只支持到IE9；
  >    2. 第一次加载首页耗时相对长一些
  >    3. 不可以使用浏览器的导航按钮需要自行实现前进、后退。
  >    4. 不利于SEO的优化（如果要支持SEO，建议通过服务端来进行渲染组件）
  >10. Vue 的父组件和子组件生命周期钩子函数执行顺序
  >   - 加载渲染过程
  >     - 父 beforeCreate -> 父 created -> 父 beforeMount -> 子 beforeCreate -> 子 created -> 子 beforeMount -> 子 mounted -> 父 mounted
  >   - 子组件更新过程
  >     - 父 beforeUpdate -> 子 beforeUpdate -> 子 updated -> 父 updated
  >   - 父组件更新过程
  >     - 父 beforeUpdate -> 父 updated
  >   - 销毁过程
  >     - 父 beforeDestroy -> 子 beforeDestroy -> 子 destroyed -> 父 destroyed
  >11. Vue组件中 data 为什么是一个函数？
  >   - 因为组件是可以复用的，而且js的对象是引用的关系，如果data是一个对象，那作用域没有被隔离，自组件的data属性值会相互影响，而如果data是一个函数，那每个实例都可以维护一个被返回对象的独立拷贝，组件之前的data属性不会被相互影响；而new Vue的实例，是不会被复用的，因此不存在引用对象的问题。

- 对Vue.js框架的理解

  - Vue.js 概述

    - Vue是用于构建用户界面的渐进式MVVM框架》〉》〉渐进式：强制主张最少
    - Vue.js包含了声明式渲染、组件化系统、客户端路由、大规模状态管理、构建工具、数据持久化、跨平台支持等，但在实际开发中，并没有强制要求开发者之后某一特定功能，而是根据需求逐渐扩展
    - Vue.js的核心库只关心视图渲染，且由于渐进式的特性，Vue.js便于与第三方库或既有项目整合

  - 组件机制

    - 组件就是对一个功能和样式进行独立的封装，让HTML元素得到扩展，从而使得代码得到复用，使得开发灵活，更加高效
    - 与HTML元素一样，Vue.js的组件拥有外部传入的属性（prop）和事件，除此之外，组件还拥有自己的状态（data）和通过数据和状态计算出来的计算属性（computed），各个维度组合起来决定组件最终呈现的样子与交互的逻辑。
    - 数据的传递：vue通信方式
    - 事件传递：Vue内部实现了一个事件总线系统，即`EventBus`。在Vue中可以使用 EventBus 来作为沟通桥梁的概念，每一个Vue的组件实例都继承了 `EventBus`，都可以接受事件`$on`和发送事件`$emit`
    - 内容分发：Vue实现了一套遵循 [`Web Components 规范草案`](https://github.com/w3c/webcomponents/blob/gh-pages/proposals/Slots-Proposal.md) 的内容分发系统，即将`<slot>`元素作为承载分发内容的出口
    - 模版渲染：Vue.js 的核心是声明式渲染；Vue.js 实现了if、for、事件、数据绑定等指令，允许采用简洁的模板语法来声明式地将数据渲染出视图
    - 模版编译：模板编译分三个阶段，`parse`、`optimize`、`generate`，最终生成`render`函数。
      - `parse`阶段：使用正在表达式将`template`进行字符串解析，得到指令、class、style等数据，生成抽象语法树 AST
      - `optimize`阶段：寻找 AST 中的静态节点进行标记，为后面 VNode 的 patch 过程中对比做优化。被标记为 static 的节点在后面的 diff 算法中会被直接忽略，不做详细的比较
      - `generate`阶段：根据 AST 结构拼接生成 render 函数的字符串
    - 预编译
      - 对于 Vue 组件来说，模板编译只会在组件实例化的时候编译一次，生成渲染函数之后在也不会进行编译。因此，编译对组件的 runtime 是一种性能损耗。而模板编译的目的仅仅是将`template`转化为`render function`，而这个过程，正好可以在项目构建的过程中完成。
      - 比如`webpack`的`vue-loader`依赖了[`vue-template-compiler`](https://www.npmjs.com/package/vue-template-compiler)模块，在 webpack 构建过程中，将`template`预编译成 render 函数，在 runtime 可直接跳过模板编译过程
      - runtime 需要是仅仅是 render 函数，而我们有了预编译之后，我们只需要保证构建过程中生成 render 函数就可以
    - Vue 组件通过 prop 进行数据传递，并实现了数据总线系统`EventBus`，组件集成了`EventBus`进行事件注册监听、事件触发，使用`slot`进行内容分发。除此以外，实现了一套声明式模板系统，在`runtime`或者预编译是对模板进行编译，生成渲染函数，供组件渲染视图使用

  - 响应式系统

    Vue.js 是一款 MVVM 的JS框架，当对数据模型`data`进行修改时，视图会自动得到更新，即框架帮我们完成了更新DOM的操作，而不需要我们手动的操作DOM。可以这么理解，当我们对数据进行赋值的时候，Vue 告诉了所有依赖该数据模型的组件，你依赖的数据有更新，你需要进行重渲染了，这个时候，组件就会重渲染，完成了视图的更新

    - 数据模型 && 计算属性 && 监听器

      - 数据模型：Vue 实例在创建过程中，对数据模型`data`的每一个属性加入到响应式系统中，当数据被更改时，视图将得到响应，同步更新。`data`必须采用函数的方式 return，不使用 return 包裹的数据会在项目的全局可见，会造成变量污染；使用return包裹后数据中变量只在当前组件中生效，不会影响其他组件
      - 计算属性：`computed`基于组件响应式依赖进行计算得到结果并缓存起来。只在相关响应式依赖发生改变时它们才会重新求值，也就是说，只有它依赖的响应式数据（data、prop、computed本身）发生变化了才会重新计算。那什么时候应该使用计算属性呢？模板内的表达式非常便利，但是设计它们的初衷是用于简单运算的。在模板中放入太多的逻辑会让模板过重且难以维护。对于任何复杂逻辑，你都应当使用计算属性
      - 监听器：监听器`watch`作用如其名，它可以监听响应式数据的变化，响应式数据包括 data、prop、computed，当响应式数据发生变化时，可以做出相应的处理。当需要在数据变化时执行异步或开销较大的操作时，这个方式是最有用的

    - 响应式原理

      在 Vue 中，数据模型下的所有属性，会被 Vue 使用`Object.defineProperty`（Vue3.0 使用 Proxy）进行数据劫持代理。响应式的核心机制是观察者模式，数据是被观察的一方，一旦发生变化，通知所有观察者，这样观察者可以做出响应，比如当观察者为视图时，视图可以做出视图的更新。

      Vue.js 的响应式系统以来三个重要的概念，`Observer`、`Dep`、`Watcher`

      - 发布者-Observer

        - Observe 扮演的角色是发布者，主要作用是在组件`vm`初始化的时，调用`defineReactive`函数，使用`Object.defineProperty`方法对对象的每一个子属性进行数据劫持/监听，即为每个属性添加`getter`和`setter`，将对应的属性值变成响应式
        - 在组件初始化时，调用`initState`函数，内部执行`initState`、`initProps`、`initComputed`方法，分别对`data`、`prop`、`computed`进行初始化，让其变成响应式
        - 初始化`props`时，对所有`props`进行遍历，调用`defineReactive`函数，将每个 prop 属性值变成响应式，然后将其挂载到`_props`中，然后通过代理，把`vm.xxx`代理到`vm._props.xxx`中
        - 同理，初始化`data`时，与`prop`相同，对所有`data`进行遍历，调用`defineReactive`函数，将每个 data 属性值变成响应式，然后将其挂载到`_data`中，然后通过代理，把`vm.xxx`代理到`vm._data.xxx`中
        - 初始化`computed`，首先创建一个观察者对象`computed-watcher`，然后遍历`computed`的每一个属性，对每一个属性值调用`defineComputed`方法，使用`Object.defineProperty`将其变成响应式的同时，将其代理到组件实例上，即可通过`vm.xxx`访问到`xxx`计算属性

      - 调度中心/订阅器-Dep

        - Dep 扮演的角色是调度中心/订阅器，在调用`defineReactive`将属性值变成响应式的过程中，也为每个属性值实例化了一个`Dep`，主要作用是对观察者（Watcher）进行管理，收集观察者和通知观察者目标更新，即当属性值数据发生改变时，会遍历观察者列表（dep.subs），通知所有的 watcher，让订阅者执行自己的update逻辑
        - 其`dep`的任务是，在属性的`getter`方法中，调用`dep.depend()`方法，将观察者（即 Watcher，可能是组件的render function，可能是 computed，也可能是属性监听 watch）保存在内部，完成其依赖收集。在属性的`setter`方法中，调用`dep.notify()`方法，通知所有观察者执行更新，完成派发更新

      - 观察者-Watcher

        Watcher 扮演的角色是订阅者/观察者，他的主要作用是为观察属性提供回调函数以及收集依赖，当被观察的值发生变化时，会接收到来自调度中心`Dep`的通知，从而触发回调函数。

        而`Watcher`又分为三类，`normal-watcher`、 `computed-watcher`、 `render-watcher`

        - normal-watcher：在组件钩子函数`watch`中定义，即监听的属性改变了，都会触发定义好的回调函数
        - computed-watcher：在组件钩子函数`computed`中定义的，每一个`computed`属性，最后都会生成一个对应的`Watcher`对象，但是这类`Watcher`有个特点：当计算属性依赖于其他数据时，属性并不会立即重新计算，只有之后其他地方需要读取属性的时候，它才会真正计算，即具备`lazy`（懒计算）特性
        - render-watcher：每一个组件都会有一个`render-watcher`, 当`data/computed`中的属性改变的时候，会调用该`Watcher`来更新组件的视图

        这三种`Watcher`也有固定的执行顺序，分别是：computed-render -> normal-watcher -> render-watcher。这样就能尽可能的保证，在更新组件视图的时候，computed 属性已经是最新值了，如果 render-watcher 排在 computed-render 前面，就会导致页面更新的时候 computed 值为旧数据。

      - 总结

        ![image-20201110195505138](/Users/banggan/Library/Application Support/typora-user-images/image-20201110195505138.png)

        Observer 负责将数据进行拦截，Watcher 负责订阅，观察数据变化， Dep 负责接收订阅并通知 Observer 和接收发布并通知所有 Watcher

  - Virtual DOM

    在 Vue 中，`template`被编译成浏览器可执行的`render function`，然后配合响应式系统，将`render function`挂载在`render-watcher`中，当有数据更改的时候，调度中心`Dep`通知该`render-watcher`执行`render function`，完成视图的渲染与更新

    ![image-20201110195837220](/Users/banggan/Library/Application Support/typora-user-images/image-20201110195837220.png)

    Vue 使用 JS 对象将浏览器的 DOM 进行的抽象，这个抽象被称为 Virtual DOM。Virtual DOM 的每个节点被定义为`VNode`，当每次执行`render function`时，Vue 对更新前后的`VNode`进行`Diff`对比，找出尽可能少的我们需要更新的真实 DOM 节点，然后只更新需要更新的节点，从而解决频繁更新 DOM 产生的性能问题

    - VNode

      VNode，全称`virtual node`，即虚拟节点，对真实 DOM 节点的虚拟描述，在 Vue 的每一个组件实例中，会挂载一个`$createElement`函数，所有的`VNode`都是由这个函数创建的

      ```javascript
      // 声明 render function
      render: function (createElement) {
          // 也可以使用 this.$createElement 创建 VNode
          return createElement('div', 'hellow world');
      }
      // 以上 render 方法返回html片段 <div>hellow world</div>
      ```

      render 函数执行后，会根据`VNode Tree`将 VNode 映射生成真实 DOM，从而完成视图的渲染

    - Diff: Diff 将新老 VNode 节点进行比对，然后将根据两者的比较结果进行最小单位地修改视图，而不是将整个视图根据新的 VNode 重绘，进而达到提升性能的目的

    - Patch：Vue.js 内部的 diff 被称为`patch`。其 diff 算法的是通过同层的树节点进行比较，而非对树进行逐层搜索遍历的方式，所以时间复杂度只有O(n)，是一种相当高效的算法

      - 首先定义新老节点是否相同判定函数`sameVnode`：满足键值`key`和标签名`tag`必须一致等条件，返回`true`，否则`false`。
      - 在进行`patch`之前，新老 VNode 是否满足条件`sameVnode(oldVnode, newVnode)`，满足条件之后，进入流程`patchVnode`，否则被判定为不相同节点，此时会移除老节点，创建新节点

    - patchNode: 判定如何对子节点进行更新

      - 如果新旧VNode都是静态的，同时它们的key相同（代表同一节点），并且新的 VNode 是 clone 或者是标记了 once（标记v-once属性，只渲染一次），那么只需要替换 DOM 以及 VNode 即可
      - 新老节点均有子节点，则对子节点进行 diff 操作，进行`updateChildren`， updateChildren是 diff 的核心
      - 如果老节点没有子节点而新节点存在子节点，先清空老节点 DOM 的文本内容，然后为当前 DOM 节点加入子节点
      - 当新节点没有子节点而老节点有子节点的时候，则移除该 DOM 节点的所有子节点
      - 当新老节点都无子节点的时候，只是文本的替换

    - updateChildren

      - Diff 的核心，对比新老子节点数据，判定如何对子节点进行操作，在对比过程中，由于老的子节点存在对当前真实 DOM 的引用，新的子节点只是一个 VNode 数组，所以在进行遍历的过程中，若发现需要更新真实 DOM 的地方，则会直接在老的子节点上进行真实 DOM 的操作，等到遍历结束，新老子节点则已同步结束
      - `updateChildren`内部定义了4个变量，分别是`oldStartIdx`、`oldEndIdx`、`newStartIdx`、`newEndIdx`，分别表示正在 Diff 对比的新老子节点的左右边界点索引，在老子节点数组中，索引在`oldStartIdx`与`oldEndIdx`中间的节点，表示老子节点中为被遍历处理的节点，所以小于`oldStartIdx`或大于`oldEndIdx`的表示未被遍历处理的节点。同理，在新的子节点数组中，索引在`newStartIdx`与`newEndIdx`中间的节点，表示老子节点中为被遍历处理的节点，所以小于`newStartIdx`或大于`newEndIdx`的表示未被遍历处理的节点
      - 每一次遍历，`oldStartIdx`和`oldEndIdx`与`newStartIdx`和`newEndIdx`之间的距离会向中间靠拢。当 oldStartIdx > oldEndIdx 或者 newStartIdx > newEndIdx 时结束循环

  - 总结

    

    ![image-20201110201530565](/Users/banggan/Library/Application Support/typora-user-images/image-20201110201530565.png)

    Vue.js 实现了一套声明式渲染引擎，并在`runtime`或者预编译时将声明式的模板编译成渲染函数，挂载在观察者 Watcher 中，在渲染函数中（touch），响应式系统使用响应式数据的`getter`方法对观察者进行依赖收集（Collect as Dependency），使用响应式数据的`setter`方法通知（notify）所有观察者进行更新，此时观察者 Watcher 会触发组件的渲染函数（Trigger re-render），组件执行的 render 函数，生成一个新的 Virtual DOM Tree，此时 Vue 会对新老 Virtual DOM Tree 进行 Diff，查找出需要操作的真实 DOM 并对其进行更新。

  - 虚拟dom和key属性的作用

    - Vue2的虚拟dom借鉴了开源库snabbdom的实现；
    - 虚拟dom产生的原因：在浏览器中操作dom是很昂贵的并且会带来一定的性能问题；
    - 虚拟dom的本质：用js对象去描述dom节点,对dom进行抽象；虚拟dom到真实dom的映射需要经历VNode的create、diff、patch等阶段
    - Key的作用是尽可能的复用DOM元素，新旧 children 中的节点只有顺序是不同的时候，最佳的操作应该是通过移动元素的位置来达到更新的目的。需要在新旧 children 的节点中保存映射关系，以便能够在旧 children 的节点中找到可复用的节点。key也就是children中节点的唯一标识

  - Vue2和Vue3渲染器的diff算法的区别

    - 首先diff算法的过程：1，同级比较，再比较子节点；2. 先判断一方有子节点一方没有子节点的情况； 3. 比较都有子节点的情况（diff核心updateChildren）4. 递归比较子节点
    - Vue2的核心diff算法采用了双端比较，同时从新旧children的两端开始比较，借助key值找到可复用的节点再进行相关操作。
    - Vue3借鉴了ivi和inferno算法：在创建VNode的时候确定其类型，以及在mount/patch的过程中采用位运算来判断一个VNode的类型，在这个基础上配合diff,使得性能得到提升，该算法中还运用了`动态规划`的思想求解最长递归子序列.  根据 newIndexToOldIndexMap 新老节点索引列表找到最长稳定序列，通过最长增长子序列的算法比对，找出新旧节点中不需要移动的节点，原地复用，仅对需要移动或已经patch的节点进行操作，最大限度地提升替换效率，相比于Vue2版本是质的提升！

  - Vue模版编译原理？

    - 简单来说，其编译过程是将template转化为render 函数的过程，模板编译分三个阶段，`parse`、`optimize`、`generate`，最终生成`render`函数。
    - 首先是解析模板，使用正在表达式将`template`进行字符串解析，得到指令、class、style等数据，生成抽象语法树 AST。
    - `optimize`阶段：寻找 AST 中的静态节点进行标记，为后面 VNode 的 patch 过程中对比做优化。被标记为 static 的节点在后面的 diff 算法中会被直接忽略，不做详细的比较
    - 最后一步是将优化后的语法树转化为可执行的render函数
    - 对于 Vue 组件来说，模板编译只会在组件实例化的时候编译一次，生成渲染函数之后在也不会进行编译。因此，编译对组件的 runtime 是一种性能损耗。而模板编译的目的仅仅是将`template`转化为`render function`，而这个过程，正好可以在项目构建的过程中完成。

  - MVVM的理解

    MVVM是Modal-View-View-ViewModel的缩写

    - Modal: 代表数据模型，也可以在Modal层定义数据的修改和操作的业务逻辑，只关心数据 

    - View: 用户操作界面，负责将数据模型转换为ui展示出来，当ViewModel对modal进行更新的时候，会通过数据绑定更新到view。

    - ViewModel： 业务逻辑层，监听模型的数据改变和控制视图的行为，处理用户交互，链接view和modal的桥梁

    - 总结：MVVM模式简化了界面与业务的依赖，解决了数据频繁更新，在MVVM的使用中，利用双向绑定，使得Modal变化时，ViewModel自动更新，从而更新view

      ![image-20201111195946049](/Users/banggan/Library/Application Support/typora-user-images/image-20201111195946049.png)

    - 优缺点

      - 分离视图和模型，降低代码耦合，提高视图或者逻辑的重用
      - 自动更新dom
      - 缺点：Bug很难被调试：难以定位到原始问题的出处
      - 缺点：对于大型的图形应用程序，视图状态较多，ViewModel的构建和维护的成本都会比较高

  - SPA页面的理解？优缺点？

    >SPA（ single-page application ）仅在 Web 页面初始化时加载相应的 HTML、JavaScript 和 CSS。一旦页面加载完成，SPA 不会因为用户的操作而进行页面的重新加载或跳转；取而代之的是利用路由机制实现 HTML 内容的变换，UI 与用户的交互，避免页面的重新加载
    >
    >- 优点
    >  - 用户体验好，内容的改变不需要重新加载整个页面，避免不必要的跳转和重复渲染
    >  - 前后端职责分离
    >- 缺点
    >  - 初次加载耗时多，
    >  - 前进后退路由难以管理：由于单页应用在一个页面中显示所有的内容，所以不能使用浏览器的前进后退功能，所有的页面切换需要自己建立堆栈管理；
    >  - SEO难度大：由于所有的内容都在一个页面中动态替换显示，所以在 SEO 上其有着天然的弱势

  - 怎么理解Vue的单向数据流？

    >所有的 prop 都使得其父子 prop 之间形成了一个**单向下行绑定**：父级 prop 的更新会向下流动到子组件中，但是反过来则不行。这样会防止从子组件意外改变父级组件的状态，从而导致你的应用的数据流向难以理解。
    >
    >额外的，每次父级组件发生更新时，子组件中所有的 prop 都将会刷新为最新的值。这意味着你不应该在一个子组件内部改变 prop。如果你这样做了，Vue 会在浏览器的控制台中发出警告。子组件想修改时，只能通过 $emit 派发一个自定义事件，父组件接收到后，由父组件修改

  - Vue 的生命周期相关？

    Vue 实例有一个完整的生命周期，也就是从开始创建、初始化数据、编译模版、挂载 Dom -> 渲染、更新 -> 渲染、卸载等一系列过程，我们称这是 Vue 的生命周期

    >1. beforeCreate ：组件实例刚创建，data和methods 中的数据未被初始化
    >2. created：组件实例创建完成，当前阶段已经完成了数据观测，也就是可以使用数据，更改数据，在这里更改数据不会触发updated函数。可以做一些初始数据的获取，在当前阶段无法与Dom进行交互，如果非要想，可以通过vm.$nextTick来访问Dom
    >3. beforeMount：模板编译/挂载之前，在这之前template模板已导入渲染函数编译。而当前阶段虚拟Dom已经创建完成，即将开始渲染。在此时也可以对数据进行更改，不会触发updated。
    >4. mounted：模板编译/挂载之后，在当前阶段，真实的Dom挂载完毕，数据完成双向绑定，可以访问到Dom节点，使用$refs属性对Dom进行操作
    >5. beforeUpdate：组件更新之前，也就是响应式数据发生更新，虚拟dom重新渲染之前被触发，你可以在当前阶段进行更改数据，不会造成重渲染
    >6. updated：组件更新之后，当前阶段组件Dom已完成更新。要注意的是避免在此期间更改数据，因为这可能会导致无限循环的更新。
    >7. beforeDestroy：组件销毁前调用，在当前阶段实例完全可以被使用，我们可以在这时进行善后收尾工作，比如清除计时器。
    >8. destroyed：组件销毁后调用，这个时候只剩下了dom空壳。组件已被拆解，数据绑定被卸除，监听被移出，子实例也统统被销毁。
    >
    >- 第一次加载会触发1-4的生命周期
    >
    >- DOM 渲染在 mounted 中就已经完成了,既可以在mounted中访问dom元素
    >
    >- 组件生命周期调用顺序
    >
    >  - 组件的调用顺序都是先父后子，渲染完成的顺序是先子后父
    >
    >  - 组件的销毁操作是先父后子，销毁完成顺序是先子后父
    >
    >  - 加载渲染的过程：父beforeCreate---父created----父beforeMount---子beforeCreate---子created---子beforeMount---子mounted---父mounted
    >
    >  - 子组件更新过程； 父beforeUpdate---子beforeUpdate---子updated---父updated
    >
    >  - 父组件更新过程：父beforeUpdate---父updated
    >
    >  - 销毁过程： 父beforeDestroy->子beforeDestroy->子destroyed->父destroyed
    >
    >  - 父组件监听子组件的生命周期
    >
    >    ```javascript
    >    // Parent.vue
    >    <Child @mounted="doSomething"/> 
    >    // Child.vue
    >    mounted() {
    >      this.$emit("mounted");
    >    }
    >    //需要手动通过 $emit 触发父组件的事件，更简单的方式可以在父组件引用子组件时通过 @hook 来监听即可
    >    //  Parent.vue
    >    <Child @hook:mounted="doSomething" ></Child>
    >    doSomething() {
    >       console.log('父组件监听到 mounted 钩子函数 ...');
    >    },    
    >    //Child.vue
    >    mounted(){
    >       console.log('子组件触发 mounted 钩子函数 ...');
    >    },       
    >    // 以上输出顺序为：
    >    // 子组件触发 mounted 钩子函数 ...
    >    // 父组件监听到 mounted 钩子函数 ... 
    >      //@hook不仅仅可以监听到mounted,其它的生命周期事件，例如：created，updated 等都可以监听。
    >    ```
    >
    >  - 异步请求一般在哪个生命周期
    >
    >    可以在钩子函数 created、beforeMount、mounted 中进行调用，因为在这三个钩子函数中，data 已经创建，可以将服务端端返回的数据进行赋值。但是本人推荐在 created 钩子函数中调用异步请求，因为在 created 钩子函数中调用异步请求有以下优点：
    >
    >    - 能更快获取到服务端数据，减少页面 loading 时间；
    >    - ssr 不支持 beforeMount 、mounted 钩子函数，所以放在 created 中有助于一致性

  - 对keep-alive的理解？

    >keep-alive 是 Vue 内置的一个组件，可以使被包含的组件保留状态，避免重新渲染 ，其有以下特性：
    >
    >- 一般结合路由和动态组件一起使用，用于缓存组件；
    >- 提供 include 和 exclude 属性，两者都支持字符串或正则表达式， include 表示只有名称匹配的组件会被缓存，exclude 表示任何名称匹配的组件都不会被缓存 ，其中 exclude 的优先级比 include 高；
    >- 对应两个钩子函数 activated 和 deactivated ，当组件被激活时，触发钩子函数 activated，当组件被移除时，触发钩子函数 deactivated
    >
    >```javascript
    >//逗号分隔字符串，只有组件a与b被缓存。
    ><keep-alive include="a,b">
    >  <component></component>
    ></keep-alive>
    >// 正则表达式 (需要使用 v-bind，符合匹配规则的都会被缓存) 
    ><keep-alive :include="/a|b/">
    >  <component></component>
    ></keep-alive>
    >//Array (需要使用 v-bind，被包含的都会被缓存) 
    ><keep-alive :include="['a', 'b']">
    >  <component></component>
    ></keep-alive>
    >```

  - 路由

    >- hash模式
    >
    >  在浏览器中符号“#”，#以及#后面的字符称之为hash，用window.location.hash读取； 特点：hash虽然在URL中，但不被包括在HTTP请求中；用来指导浏览器动作，对服务端安全无用，hash不会重加载页面。 hash 模式下，仅 hash 符号之前的内容会被包含在请求中，如 `http://www.xiaogangzai.com`，因此对于后端来说，即使没有做到对路由的全覆盖，也不会返回 404 错误
    >
    >  - URL 中 hash 值只是客户端的一种状态，也就是说当向服务器端发出请求时，hash 部分不会被发送；
    >  - hash 值的改变，都会在浏览器的访问历史中增加一个记录。因此我们能通过浏览器的回退、前进按钮控制hash 的切换；
    >  - 可以通过 a 标签，并设置 href 属性，当用户点击这个标签后，URL 的 hash 值会发生改变；或者使用  JavaScript 来对 loaction.hash 进行赋值，改变 URL 的 hash 值；
    >  - 我们可以使用 hashchange 事件来监听 hash 值的变化，从而对页面进行跳转（渲染）。
    >
    >- history模式
    >
    >  history采用HTML5的新特性；且提供了两个新方法：pushState（），replaceState（）可以对浏览器历史记录栈进行修改，以及popState事件的监听到状态变更。 history 模式下，前端的 URL 必须和实际向后端发起请求的 URL 一致，如 `http://www.xxx.com/items/id`。后端如果缺少对 /items/id 的路由处理，将返回 404 错误。Vue-Router 官网里如此描述：“不过这种模式要玩好，还需要后台配置支持……所以呢，你要在服务端增加一个覆盖所有情况的候选资源：如果 URL 匹配不到任何静态资源，则应该返回同一个 index.html 页面，这个页面就是你 app 依赖的页面
    >
    >  - pushState 和 repalceState 两个 API 来操作实现 URL 的变化 ；
    >  - 我们可以使用 popstate  事件来监听 url 的变化，从而对页面进行跳转（渲染）；
    >  - history.pushState() 或 history.replaceState() 不会触发 popstate 事件，这时我们需要手动触发页面跳转（渲染

  - 组件通信机制

    >Vue 组件间通信只要指以下 3 类通信：父子组件通信、隔代组件通信、兄弟组件通信
    >
    >- props / $emit 适用 父子组件通信
    >
    >- Ref  / $parent / children适用于父子组件通信
    >
    >  - ref如果在普通dom元素上引用指向dom元素，如果用在子组件上，则指向子组件
    >  - / $parent / children访问父子实例
    >
    >- Events（$emit/$on）使用于父子、隔代、兄弟组件通信
    >
    >  这种方法通过一个空的 Vue 实例作为中央事件总线（事件中心），用它来触发事件和监听事件，从而实现任何组件间的通信，包括父子、隔代、兄弟组件
    >
    >- $attrs  $/Listeners 适用于隔代组件通信
    >
    >  - attrs: 包含了父作用域中不被 prop 所识别 (且获取) 的特性绑定 ( class 和 style 除外 )。当一个组件没有声明任何 prop 时，这里会包含所有父作用域的绑定 ( class 和 style 除外 )，并且可以通过 `v-bind="$attrs"`传入内部组件。通常配合 inheritAttrs 选项一起使用
    >  - Listeners: 包含了父作用域中的 (不含 .native 修饰器的)  v-on 事件监听器。它可以通过 `v-on="$listeners"`传入内部组件
    >
    >- Provide / inject 适用于隔代组件通信
    >
    >  祖先组件中通过 provider 来提供变量，然后在子孙组件中通过 inject 来注入变量。 provide / inject API 主要解决了跨级组件间的通信问题，不过它的使用场景，主要是子组件获取上级组件的状态，跨级组件间建立了一种主动提供与依赖注入的关系
    >
    >- Vuex 适用于父子、隔代、兄弟组件通信
    >
    >  Vuex 是一个专为 Vue.js 应用程序开发的状态管理模式。每一个 Vuex 应用的核心就是 store（仓库）。“store” 基本上就是一个容器，它包含着你的应用中大部分的状态 ( state )。
    >
    >  

  - 双向绑定

    >Vue 数据双向绑定主要是指：数据变化更新视图，视图变化更新数据
    >
    >Vue主要通过一下四步来实现：
    >
    >1. 实现一个监听器 Observer：对数据对象进行遍历，包括子属性对象的属性，利用 Object.defineProperty() 对属性都加上 setter 和 getter。这样的话，给这个对象的某个值赋值，就会触发 setter，那么就能监听到了数据变化。
    >
    >2. 实现一个解析器 Compile：解析 Vue 模板指令，将模板中的变量都替换成数据，然后初始化渲染页面视图，并将每个指令对应的节点绑定更新函数，添加监听数据的订阅者，一旦数据有变动，收到通知，调用更新函数进行数据更新。
    >
    >3. 实现一个订阅者 Watcher：Watcher 订阅者是 Observer 和 Compile 之间通信的桥梁 ，主要的任务是订阅 Observer 中的属性值变化的消息，当收到属性值变化的消息时，触发解析器 Compile 中对应的更新函数。
    >
    >4. 实现一个订阅器 Dep：订阅器采用 发布-订阅 设计模式，用来收集订阅者 Watcher，对监听器 Observer 和 订阅者 Watcher 进行统一管理
    >
    >vue实现数据双向绑定主要是：采**用数据劫持结合发布者-订阅者模式**的方式，通过**Object.defineProperty（）**来劫持各个属性的setter，getter，在数据变动时发布消息给订阅者，触发相应监听回调。当把一个普通 Javascript 对象传给 Vue 实例来作为它的 data 选项时，Vue 将遍历它的属性，用 Object.defineProperty 将它们转为 getter/setter。用户看不到 getter/setter，但是在内部它们让 Vue 追踪依赖，在属性被访问和修改时通知变化。
    >
    >vue的数据双向绑定 将MVVM作为数据绑定的入口，整合Observer，Compile和Watcher三者，通过Observer来监听自己的model的数据变化，通过Compile来解析编译模板指令（vue中是用来解析 {{}}），最终利用watcher搭起observer和Compile之间的通信桥梁，达到数据变化 —>视图更新；视图交互变化（input）—>数据model变更双向绑定效果

  - Vue对对象和数组的限制

    >```javascript
    >/**
    >   * Observe a list of Array items.
    >   */
    >  observeArray (items: Array<any>) {
    >    for (let i = 0, l = items.length; i < l; i++) {
    >      observe(items[i])  // observe 功能为监测数据的变化
    >    }
    >  }
    >  /**
    >   * 对属性进行递归遍历
    >   */
    >  let childOb = !shallow && observe(val) // observe 功能为监测数据的变化
    >```
    >
    >使用了函数劫持的方式，重写了数组的方法，Vue将data中的数组进行了原型链重写，指向了自己定义的数组原型方法。这样当调用数组api时，可以通知依赖更新。如果数组中包含着引用类型，会对数组中的引用类型再次递归遍历进行监控。这样就实现了监测数组变化
    >
    >
    >
    >通过以上 Vue 源码部分查看，我们就能知道 Vue 框架是通过遍历数组 和递归遍历对象，从而达到利用  Object.defineProperty() 也能对对象和数组（部分方法的操作）进行监听
    >
    >- 对数组的某些操作不能监听到变化
    >
    >  - 直接给一个数组项赋值：`vm.items[indexOfItem] = newvalue;`
    >  - 解决办法：`Vue.set(vm.items,indexOfItem,newvalue),vm.$set(vm.items, indexOfItem, newValue),vm.items.splice(indexOfItem, 1, newValue)`
    >  - 修改数组的长度:`vm.items.length = newlength`
    >  - 解决办法：`vm.items.splice(newLength)`
    >
    >- Vue无法检测到对对象属性的新增和删除
    >
    >  由于 Vue 会在初始化实例时对属性执行 getter/setter 转化，所以属性必须在 data 对象上存在才能让 Vue 将它转换为响应式的。但是 Vue 提供了 `Vue.set (object, propertyName, value) / vm.$set (object, propertyName, value)` 来实现为对象添加响应式属性，那框架本身是如何实现的呢？
    >
    >  ```javascript
    >  export function set (target: Array<any> | Object, key: any, val: any): any {
    >    // target 为数组  
    >    if (Array.isArray(target) && isValidArrayIndex(key)) {
    >      // 修改数组的长度, 避免索引>数组长度导致splcie()执行有误
    >      target.length = Math.max(target.length, key)
    >      // 利用数组的splice变异方法触发响应式  
    >      target.splice(key, 1, val)
    >      return val
    >    }
    >    // key 已经存在，直接修改属性值  
    >    if (key in target && !(key in Object.prototype)) {
    >      target[key] = val
    >      return val
    >    }
    >    const ob = (target: any).__ob__
    >    // target 本身就不是响应式数据, 直接赋值
    >    if (!ob) {
    >      target[key] = val
    >      return val
    >    }
    >    // 对属性进行响应式处理
    >    defineReactive(ob.value, key, val)
    >    ob.dep.notify()
    >    return val
    >  }
    >  ```
    >
    >  如果目标是数组，直接使用数组的 splice 方法触发相应式；
    >
    >  如果目标是对象，会先判读属性是否存在、对象是否是响应式，最终如果要对属性进行响应式处理，则是通过调用   defineReactive 方法进行响应式处理（ defineReactive 方法就是  Vue 在初始化对象时，给对象属性采用 Object.defineProperty 动态添加 getter 和 setter 的功能所调用的方法）

  - proxy相比于 Object.defineProperty() 的优势

    >Object.defineProperty() 的问题主要有三个:
    >
    >- 不能监听数组的变化
    >- 必须遍历对象的每个属性
    >- 必须深层遍历嵌套的对象
    >
    >Proxy 在 ES2015 规范中被正式加入，它有以下几个特点：
    >
    >- 针对对象：针对整个对象，而不是对象的某个属性，所以也就不需要对 keys 进行遍历。这解决了上述 Object.defineProperty() 第二个问题
    >- 支持数组：Proxy 不需要对数组的方法进行重载，省去了众多 hack，减少代码量等于减少了维护成本，而且标准的就是最好的
    >- Proxy 的第二个参数可以有 13 种拦截方法，这比起 Object.defineProperty() 要更加丰富
    >- Proxy 返回的是一个新对象,我们可以只操作新的对象达到目的,而 Object.defineProperty 只能遍历对象属性直接修改

  - computed和watch的区别？

    >**Computed**: 是计算属性，依赖其它属性值，并且 computed 的值有缓存，只有它依赖的属性值发生改变，下一次获取 computed 的值时才会重新计算 computed  的值
    >
    >- 是计算属性,也就是计算值,它更多用于计算值的场景
    >- 具有缓存性,computed的值在getter执行后是会缓存的，只有在它依赖的属性值改变之后，下一次获取computed的值时才会重新调用对应的getter来计算
    >- 适用于计算比较消耗性能的计算场景
    >
    >**watch：**更多的是「观察」的作用，类似于某些数据的监听回调 ，每当监听的数据变化时都会执行回调进行后续操作
    >
    >- 无缓存性，页面重新渲染时值不变化也会执行

  - 事件绑定

    >原生事件绑定是通过`addEventListener`绑定给真实元素的，组件事件绑定是通过Vue自定义的`$on`实现的

  - 响应式

    >- Vue2.x的响应式
    >
    >  Vue在初始化数据时，会使用`Object.defineProperty`重新定义data中的所有属性，当页面使用对应属性时，首先会进行依赖收集(收集当前组件的`watcher`)如果属性发生变化会通知相关依赖进行更新操作(`发布订阅`)
    >
    >- Vue3的响应式
    >
    >  Vue3.x改用`Proxy`替代Object.defineProperty。因为Proxy可以直接监听对象和数组的变化，并且有多达13种拦截方法。并且作为新标准将受到浏览器厂商重点持续的性能优化
    >
    >- Proxy只会代理对象的第一层，那么Vue3又是怎样处理这个问题的呢？
    >
    >  判断当前Reflect.get的返回值是否为Object，如果是则再通过`reactive`方法做代理， 这样就实现了深度观测
    >
    >- 监测数组的时候可能触发多次get/set，那么如何防止触发多次呢？
    >
    >  我们可以判断key是否为当前被代理对象target自身属性，也可以判断旧值与新值是否相等，只有满足以上两个条件之一时，才有可能执行trigger

  - nextTick的理解

    >在下次`dom`更新循环结束之后执行延迟回调，可用于获取更新后的`dom`状态
    >
    >- 新版本中默认是microtasks`, `v-on`中会使用`macrotasks
    >- macrotasks的实现：setImmediate / MessageChannel / setTimeout
    >
    >在下次 DOM 更新循环结束之后执行延迟回调。nextTick主要使用了宏任务和微任务。根据执行环境分别尝试采用p romise\MutationObserver\setImmediate\setTimeout
    >
    >定义了一个异步方法，多次调用nextTick会将方法存入队列中，通过这个异步方法清空当前队列

  - Vuex

    >- 定义： Vuex 是一个专为 Vue.js 应用程序开发的状态管理模式。它采用集中式存储管理应用的所有组件的状态，并以相应的规则保证状态以一种可预测的方式发生变化
    >- 思想： 把组件的共享状态抽取出来，以一个全局单例模式管理，在这种模式下，我们的组件树构成了一个巨大的“视图”，不管在树的哪个位置，任何组件都能获取状态或者触发行为
    >- vuex和单纯的全局对象的不同？
    >  - Vuex 的状态存储是响应式的。
    >  - 你不能直接改变 store 中的状态。该变 store 中的状态的唯一途径就是显式地提交 (commit) mutation。是因为我们想要更明确地追踪到状态的变化
    >- vuex的组成
    >  - state
    >    - Vuex 使用 state来存储应用中需要共享的状态。为了能让 Vue 组件在 state更改后也随着更改，需要基于state创建计算属性
    >  - getters
    >    - 可以认为是 store 的计算属性，getter 的返回值会根据它的依赖被缓存起来，且只有当它的依赖值发生了改变才会被重新计算
    >  - Mutations（同步）
    >    - 改变状态的执行者，mutations用于同步的更改状态
    >  - actions (异步)
    >    - 异步的改变状态，actions不直接更改state，而是发起mutations,view 层通过 store.dispath 来分发 action。
    >  - Module: 模块化store
    >    - 出现的问题：由于使用单一状态树，应用的所有状态会集中到一个比较大的对象。当应用变得非常复杂时，store 对象就有可能变得相当臃肿
    >    - Vuex 允许我们将 store 分割成模块（module）。每个模块拥有自己的 state、mutation、action、getter、甚至是嵌套子模块
    >- vuex的工作原理
    >  - 数据从state中渲染到页面
    >  - 在页面通过dispatch来触发action
    >  - action通过调用commit,来触发mutation
    >  - mutation来更改数据，数据变更之后会触发dep对象的notify，通知所有Watcher对象去修改对应视图（vue的双向数据绑定原理）
    >- 运用场景
    >  - 多个视图依赖于同一状态
    >  - 来自不同视图的行为需要改变同一个状态

  - Vue SSR

    >SSR大致的意思就是vue在客户端将标签渲染成的整个 html 片段的工作在服务端完成，服务端形成的html 片段直接返回给客户端这个过程就叫做服务端渲染
    >
    >- 服务端渲染的优点
    >  - 更好的 SEO： 因为 SPA 页面的内容是通过 Ajax 获取，而搜索引擎爬取工具并不会等待 Ajax 异步完成后再抓取页面内容，所以在 SPA 中是抓取不到页面通过 Ajax 获取到的内容；而 SSR 是直接由服务端返回已经渲染好的页面（数据已经包含在页面中），所以搜索引擎爬取工具可以抓取渲染好的页面；
    >  - 更快的内容到达时间（首屏加载更快）： SPA 会等待所有 Vue 编译后的 js 文件都下载完成后，才开始进行页面的渲染，文件下载等需要一定的时间等，所以首屏渲染需要一定的时间；SSR 直接由服务端渲染好页面直接返回显示，无需等待下载 js 文件及再去渲染等，所以 SSR 有更快的内容到达时间
    >- 服务端渲染的缺点
    >  - 多的开发条件限制： 例如服务端渲染只支持 beforCreate 和 created 两个钩子函数，这会导致一些外部扩展库需要特殊处理，才能在服务端渲染应用程序中运行；并且与可以部署在任何静态文件服务器上的完全静态单页面应用程序 SPA 不同，服务端渲染应用程序，需要处于 Node.js server 运行环境；
    >  - 更多的服务器负载：在 Node.js  中渲染完整的应用程序，显然会比仅仅提供静态文件的  server 更加大量占用CPU 资源 (CPU-intensive - CPU 密集)，因此如果你预料在高流量环境 ( high traffic ) 下使用，请准备相应的服务器负载，并明智地采用缓存策略

  - 性能优化

    >- 编码阶段
    >
    >  - 尽量减少data中的数据，data中的数据都会增加getter和setter，会收集对应的watcher
    >
    >  - v-if v-for不能连用
    >  - 如果需要给v-for的每一项元素绑定事件采用事件代理
    >  - computed 和 watch  区分使用场景
    >  - SPA页面采用keep-alive缓存组件
    >  - 在更多情况下，v-if代替v-show
    >  - key值保证唯一
    >  - 使用路由懒加载、异步组件
    >  - 防抖、节流
    >  - 第三方模块按需导入
    >  - 图片懒加载
    >
    >- SEO优化
    >
    >  - 预渲染
    >  - 服务端渲染
    >
    >- 打包优化
    >
    >  - 压缩代码
    >  - Webpack 对图片进行压缩
    >  - Tree Shaking/Scope Hoisting
    >  - 使用cdn加载第三方模块
    >  - 多线程打包happypack
    >  - splitChunks抽离公共文件
    >  - 模版预渲染
    >  - 构建结果输出分析
    >  - sourceMap优化
    >
    >- 用户体验
    >
    >  - 骨架屏
    >  - PWA
    >
    >还可以使用缓存(客户端缓存、服务端缓存)优化、服务端开启gzip压缩等。

  - 对Vue3的了解

    >- Vue3中的响应式
    >
    >Vue3对整个响应式系统做了重新的设计，同时暴露了几个新的API:`ref\reactive\computed\effect`,把原本Vue2 `object.defineProperty` 的实现改成了用`proxy`的实现方式：
    >
    >- reactive
    >
    >```javascript
    >const reactive = (target)=> new Proxy(target,{
    >	get(target,prop,receiver){
    >track(target,prop)
    >return Reflect.get(...arguments)
    >},
    >set(target,key,value,receiver){
    >trigger(target,key)
    >return Reflect.set(...arguments)
    >}
    >})
    >const obj = reactive({
    >hello:'word'
    >})
    >console.log(obj.hello) // `track()` get called
    >obj.hello = 'vue' // `trigger()` get called
    >```
    >
    >我们可以通过 `get`和 `set`这两个 handler 去追踪每一个属性的访问和修改，在这个例子中我们在 `get`里注入了 `track`这个函数，在 `set`里注入了`trigger`这个函数。那么在对 `reactive`这个对象的 `hello`属性进行访问的时候 `track`就会被执行，在对 `obj.hello`进行赋值的时候，`trigger`就会被执行。通过 `track`和 `trigger`我们就可以进行一些响应式的追踪
    >
    >- effect
    >
    >`effect`是在 Vue 3 里面新引入的一个API，它的作用就是去结合 `track`和 `trigger`这两个能，`track`的作用是追踪调用他的函数，`trigger`是去触发绑定的依赖更新
    >
    >```javascript
    >const targetMap = new WeakMap()
    >
    >export const track = (target, key) => {
    >if (tacking && activeEffect)
    >targetMap.get(target).key(key).push(activeEffect)
    >}
    >
    >export const trigger = (target, key) => {
    >targetMap.get(target).key(key).forEach(effect => effect())
    >}
    >
    >export const effect = (fn) => {
    >let effect = function() { fn() }
    >enableTracking()
    >activeEffect = effect
    >fn()
    >resetTracking()
    >activeEffect = undefined
    >}
    >```
    >
    >在 `effect`里面我们会接受一个函数作为参数，在执行这个函数之前的我们会开启 tracking，然后把当前的函数设置在一个全局变量 `activeEffect`，然后再去执行这个函数。那么在这个函数的调用时间里面我们有任何的 reactive 的调用就会触发 `track`这个函数。`track`的主要功能就是说我们把当前的 `activeEffect`绑定到所触发它的这个属性调用上。然后在数据更新的时候，我们再去找到这个依赖上面所绑定的所有 `effect`把他们一一调用。这样就完成了一个最基本的响应式的功能
    >
    >- Computed & watch
    >
    >在 Vue 3.0 里面，`computed`和 `watch`都是基于 `effect`的包装，我们这边可以看到一个简单的 `computed`的实现
    >
    >```javascript
    >const computed = (getter) => {
    >let value
    >let dirty = true
    >
    >const runner = effect(getter, {
    >lazy: true,
    >scheduler() {
    >dirty = true // deps changed
    >}
    >})
    >return {
    >get value() {
    >if (dirty) {
    >value = runner() // re-evaluate
    >dirty = false
    >}
    >return value
    >}
    >}
    >```
    >
    >`computed`接受一个 getter 函数，这个函数我们把它直接传给 `effect`，`effect`会在先执行一次进行依赖收集，在收集完了之后，如果里面其中的依赖发生了变动，他就会触发这个 `scheduler`将 `dirty`设置为 `true`。在最后我们在对 `computed`进行求值的时候，如果 `dirty`为 `true`，我们就会重新进行一次运算得到新的 `value`后再把 `value`传出去。在第二次调用时，如果里面的依赖没有更新，我们就可以直接用上一次计算的结果，这件可以避免掉多余重复的计算。
    >
    >- 组合式composition API
    >
    >组合式其实是基于响应式延伸出来的一套和 Vue 生命周期绑定的一套工具。它提供了 Vue 生命周期的钩子像是 `onMounted``onUpdate`和 `onUnmounted`等等。还有个非常重要的功能就是说在 Vue 的 `setup()`里面，所建立的类似 `computed`或者 `watch`的 `effect`会在组件销毁的时候自动跟随这个组件一并销毁。那么组合是最重要的作用就是它可以提供可复用的逻辑，我们可以把很多的逻辑拆分出来，做成一个一个的工具。然后可以跨组件的进行复用或甚至是把它做成一个第三方库，跨应用地进行复用。这个我们会在之后进行详细的介绍:
    >
    >>- 概念
    >>
    >>在Vue2.x中，我们的代码通过Vue给定的options，将代码写人到各个options中，比如我们的data定义必须要放在data中，计算属性要放在computed中以及methods等，这些我们叫做options API,配置型API,而在Vue3中，composition API也就是组合式API,其实就是基于响应式延伸出来的一套和Vue生命周期绑定的一套工具。一组低侵入式的、函数式的 API，使得我们能够更灵活地「**组合**」组件的逻辑。
    >>
    >>```javascript
    >><template>
    >><button @click="increment">
    >> Count is: {{ state.count }}, double is: {{ state.double }}
    >></button>
    >></template>
    >><script>
    >>import { reactive, computed } from 'vue'
    >>
    >>export default {
    >> setup() {
    >>   const state = reactive({
    >>     count: 0,
    >>     double: computed(() => state.count * 2),
    >>   })
    >>
    >>   function increment() {
    >>     state.count++
    >>   }
    >>
    >>   return {
    >>     state,
    >>     increment,
    >>   }
    >> },
    >>}
    >></script>
    >>```
    >>
    >> - 响应式状态和副作用	
    >>
    >>```javascript
    >>//创建一个响应式状态
    >> import { reactive,watchEffect} from 'vue'
    >> const state = reactive({
    >> 	count:0
    >> })
    >>// 使用watchEffect API应用基于响应式状态的副作用（在dom中渲染内容被视作副作用）
    >>watchEffect(() => {
    >> document.body.innerHTML = `count is ${state.count}`
    >>})
    >>//watchEffect 应该接收一个应用预期副作用 (这里即设置 innerHTML) 的函数。它会立即执行该函数，重新运行该函数。并将该执行过程中用到的所有响应式状态的 property 作为依赖进行追踪。
>>```
    
    >>    ```
    >>
    >>  - 计算状态和ref
    >>
    >>    有时候，我们会需要一个依赖于其他状态的状态，在 Vue 中这是通过*计算属性*来处理的。我们可以使用 `computed` API 直接创建一个计算值
    >>
    >>    ​```javascript
    >>    import { reactive, computed } from 'vue'
    >>    const state = reactive({
    >>      count: 0,
    >>    })
    >>    const double = computed(() => state.count * 2)
    >>    ```
    >>
    >>    在把值作为 property 赋值给某个对象时也会出现同样的问题。一个响应式的值一旦作为 property 被赋值或从一个函数返回，而失去了响应性之后，也就失去了用途。为了确保始终可以读取到最新的计算结果，我们需要将这个值上包裹到一个对象中再返回
    >>
    >>    ```javascript
    >>    // 简化的伪代码
    >>    function computed(getter) {
    >>      const ref = {
    >>        value: null,
    >>      }
    >>      watchEffect(() => {
    >>        ref.value = getter()
    >>      })
    >>      return ref
    >>    }
    >>    ```
    >
    >例子：给网页实现dark mode。我希望整个页面在默认的情况下会随着我系统的系统的偏好改变。然后我可能希望一个用户有一个手动可以修改的功能，比如说我有一个按钮一个直接改变 Dark Mode。
    >
    >然后又希望这个这个功能是一个可持久化的，我可以保存下用户的偏好，在网页刷新后还可以还可以继续存留用户的上一次的修改。最后可能会希望说在两个模式切换的时候去执行一些代码，比如说通知用户或者是通知组件进行一些操作之类的
    >
    >```html
    ><template>
    ><div :class='{dark}'>
    ><button @click='toggleDark'>Toggle</button>
    ></div>
    ></template>
    >```
    >
    >Vue2.x的写法：
    >
    >```javascript
    ><script>
    >export default{
    >	data(){
    >return{
    >dark:false,
    >media:window.matchMedia('(prefers-color-scheme: dark)')
    >}
    >},
    >methods:{
    >toggleDark(){
    >this.dark = !this.dark;
    >},
    >updateDark(){
    >this.dark = this.media.matches;
    >}
    >},
    >```
>created(){
>this.media.addEventListener('change', this.updateDark)
>this.updateDark()
>},
>destoryed(){
>this.media.removeEventListener('change', this.updateDark)
>}
>}
></script>
>```
>
>Vue3.x的写法：composition API
>
>因为在 Composition API 中，`setup()`相当于 Options API 的 `created`，我们直接可以把 `addEventListener`的直接写在 `setup()`里面，对应的我们再通过一个生命周期的钩子 `OnUnmounted`注销事件监听
>
>```
>import {onUnmounted,ref} from 'Vue'
>export default{
>setup(){
>const media = window.matchMedia('(prefers-color-scheme: dark)');
>const dark = ref(media.matches);
>const updateDark = ()=> dark.value = media.matches;
>
>media.addEventListener('change', updateDark);
>onUnmounted(() => {
>		media.removeEventListener('change', update)
>	})
>	return{
>		dark,
>		toggleDark(){
>			dark.value = !dark.value;
>		}
>	}
>}
>}
>```
>
>
>
>- 监测机制的改变
>
>3.0 将带来基于代理 Proxy 的 observer 实现，提供全语言覆盖的反应性跟踪。这消除了 Vue 2 当中基于 Object.defineProperty 的实现所存在的很多限制：
>
>- 只能监测属性，不能监测对象
>- 检测属性的添加和删除；
>- 检测数组索引和长度的变更；
>- 支持 Map、Set、WeakMap 和 WeakSet
>
>新的observer还提供了以下特性：
>
>- 用于创建 observable 的公开 API。这为中小规模场景提供了简单轻量级的跨组件状态管理解决方案。
>- 默认采用惰性观察。在 2.x 中，不管反应式数据有多大，都会在启动时被观察到。如果你的数据集很大，这可能会在应用启动时带来明显的开销。在 3.x 中，只观察用于渲染应用程序最初可见部分的数据。
>- 更精确的变更通知。在 2.x 中，通过 Vue.set 强制添加新属性将导致依赖于该对象的 watcher 收到变更通知。在 3.x 中，只有依赖于特定属性的 watcher 才会收到通知。
>- 不可变的 observable：我们可以创建值的“不可变”版本（即使是嵌套属性），除非系统在内部暂时将其“解禁”。这个机制可用于冻结 prop 传递或 Vuex 状态树以外的变化。
>- 更好的调试功能：我们可以使用新的 renderTracked 和 renderTriggered 钩子精确地跟踪组件在什么时候以及为什么重新渲染
>
>- 模板
>
>模板方面没有大的变更，只改了作用域插槽，2.x 的机制导致作用域插槽变了，父组件会重新渲染，而 3.0 把作用域插槽改成了函数的方式，这样只会影响子组件的重新渲染，提升了渲染的性能。
>
>同时，对于 render 函数的方面，vue3.0 也会进行一系列更改来方便习惯直接使用 api 来生成 vdom
>
>- 对象式组件声明方式
>
>vue2.x 中的组件是通过声明的方式传入一系列 option，和 TypeScript 的结合需要通过一些装饰器的方式来做，虽然能实现功能，但是比较麻烦。3.0 修改了组件的声明方式，改成了类式的写法，这样使得和 TypeScript 的结合变得很容易。
>
>此外，vue 的源码也改用了 TypeScript 来写。其实当代码的功能复杂之后，必须有一个静态类型系统来做一些辅助管理。现在 vue3.0 也全面改用 TypeScript 来重写了，更是使得对外暴露的 api 更容易结合 TypeScript。静态类型系统对于复杂代码的维护确实很有必要
>
>- 其他方面
>
>vue3.0 的改变是全面的，上面只涉及到主要的 3 个方面，还有一些其他的更改：
>
>- 支持自定义渲染器，从而使得 weex 可以通过自定义渲染器的方式来扩展，而不是直接 fork 源码来改的方式。
>- 支持 Fragment（多个根节点）和 Protal（在 dom 其他部分渲染组建内容）组件，针对一些特殊的场景做了处理。
>- 基于 treeshaking 优化，提供了更多的内置功能
>
>/** * 判断括号匹配 * 说明：给定一个只包含 '() {} []' 6种字符的字符串， *   实现一个方法来检测该字符串是否合法，其规则为'()'、'{}'、'[]'必须互相匹配，可嵌套。 * 示例： *   isValid('(');          // false *   isValid('()');         // true *   isValid('()[]{}');     // true *   isValid('{()[]}');     // true *   isValid('(]');         // false *   isValid('([)]');       // false *   isValid('({}[]([]))'); // true */
>```


   
