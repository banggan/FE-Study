##### webpack 生命周期

>- Options 初始化
>
>  从配置文件和shell语句中读取合并初始化参数
>
>- new webpack（） webpack初始化、构建compiler
>
>  用上一步得到的参数初始化compiler对象，加载所有配置的插件
>
>- run
>
>  Run编译的入口方法，compiler具体分为两个对象：compiler：存放输入输出相关配置和编译器parser对象；watcher:监听文件变化的方法；
>
>- complie（）
>
>  run 触发complier，构建options中的模块，构建compilation对象：该对象负责组织整个编译过程，包含了每个构建环节的方法；对象内部保留了对complier对象的引用，并且存放所有的modules\chunks\生成的assets以及最后用来生成js的template。
>
>- addEntry
>
>  complie触发mark事件，调用addEntry找到入口文件
>
>- 构建模块
>
>  解析入口文件，对module 进行build：包括调用loader处理文件，使用acorn生成AST并且遍历AST。遇到require等依赖时，创建依赖dependency加入依赖数组。当module build完成，开始处理依赖的module,异步的对模块进行build，如果依赖中还有依赖就递归处理，直到所有的入口依赖的文件都进行了构建；
>
>- 完成模块编译
>
>  使用loader翻译完所有的模块后，得到每个模块编译后的内容，以及他们之间的依赖关系
>
>- 输出资源
>
>  利用seal方法封装，对每个module和chunk进行整理，生成编译后的源码，合并、拆分，每个chunk对应一个入口文件，开始处理最后生成的js
>
>  所有的module 和chunk 保存的事一个个通过require聚合起来的代码，需要通过template产生最后带有一个_webpack_require()的格式，生产好的js保存在compilation的assets中。
>
>- 输出完成
>
>  通过emitAssets将最终的js输出到output的path中

##### **webpack的构建流程是什么?从读取配置到输出文件这个过程尽量说全**

>webpack 的入口文件其实就实例了`Compiler`并调用了`run`方法开启了编译，webpack的编译都按照下面的钩子调用顺序执行。
>
>- before-run 清除缓存
>- run 注册缓存数据钩子
>- before-compile
>- compile 开始编译
>- make 从入口分析依赖以及间接依赖模块，创建模块对象
>- build-module 模块构建
>- seal 构建结果封装， 不可再更改
>- after-compile 完成构建，缓存数据
>- emit 输出到dist目录
>
> 从启动构建到输出结果一系列过程：
>
>（1）初始化参数：解析webpack配置参数，合并shell传入和webpack.config.js文件配置的参数，形成最后的配置结果。
>
>（2）开始编译：上一步得到的参数初始化compiler对象，注册所有配置的插件，插件监听webpack构建生命周期的事件节点，做出相应的反应，执行对象的 run 方法开始执行编译。
>
>（3）确定入口：从配置的entry入口，开始解析文件构建AST语法树，找出依赖，递归下去。
>
>（4）编译模块：递归中根据文件类型和loader配置，调用所有配置的loader对文件进行转换，再找出该模块依赖的模块，再递归本步骤直到所有入口依赖的文件都经过了本步骤的处理。
>
>（5）完成模块编译并输出：递归完事后，得到每个文件结果，包含每个模块以及他们之间的依赖关系，根据entry配置生成代码块chunk。
>
>（6）输出完成：输出所有的chunk到文件系统。
>
>注意：在构建生命周期中有一系列插件在做合适的时机做合适事情，比如UglifyPlugin会在loader转换递归完对结果使用UglifyJs压缩覆盖之前的结果

##### Tapable

>webpack本质上是一种事件流的机制，它的工作流程就是将各个插件串联起来，而实现这一切的核心就是[Tapable](https://github.com/webpack/tapable)，webpack中最核心的负责编译的`Compiler`和负责创建bundles的`Compilation`都是Tapable的实例。在Tapable1.0之前，也就是webpack3及其以前使用的Tapable，提供了包括
>
>- `plugin(name:string, handler:function)`注册插件到Tapable对象中
>- `apply(…pluginInstances: (AnyPlugin|function)[])`调用插件的定义，将事件监听器注册到Tapable实例注册表中
>- `applyPlugins*(name:string, …)`多种策略细致地控制事件的触发，包括`applyPluginsAsync`、`applyPluginsParallel`等方法实现对事件触发的控制，实现
>
>（1）多个事件连续顺序执行
>（2）并行执行
>（3）异步执行
>（4）一个接一个地执行插件，前面的输出是后一个插件的输入的瀑布流执行顺序
>（5）在允许时停止执行插件，即某个插件返回了一个`undefined`的值，即退出执行
>我们可以看到，Tapable就像nodejs中`EventEmitter`,提供对事件的注册`on`和触发`emit`
>
>对于一个 `SyncHook`,我们通过`tap`来添加消费者，通过`call`来触发钩子的顺序执行。
>
>对于一个`async*`类型的钩子，支持`tap\tappromise\tapasync,通过调用call、callAsync 、promise方式调用。`

##### **webpack与grunt、gulp的不同？**

>三者都是前端构建工具，grunt和gulp在早期比较流行，现在webpack相对来说比较主流，不过一些轻量化的任务还是会用gulp来处理，比如单独打包CSS文件等。
>
>grunt和gulp是基于任务和流（Task、Stream）的。类似jQuery，找到一个（或一类）文件，对其做一系列链式操作，更新流上的数据， 整条链式操作构成了一个任务，多个任务就构成了整个web的构建流程。
>
>webpack是基于入口的。webpack会自动地递归解析入口所需要加载的所有资源文件，然后用不同的Loader来处理不同的文件，用Plugin来扩展webpack功能。
>
>总结：（1）从构建思路来说：gulp和grunt需要开发者将整个前端构建过程拆分成多个`Task`，并合理控制所有`Task`的调用关系 webpack需要开发者找到入口，并需要清楚对于不同的资源应该使用什么Loader做何种解析和加工；
>
>（2）对于知识背景：gulp更像后端开发者的思路，需要对于整个流程了如指掌 webpack更倾向于前端开发者的思路

##### Plugin loader的区别

>作用不同：（1）loader让webpack有加载和解析非js的能力；（2）plugin可以扩展webpack功能，在webpack运行周期中会广播很多事件，Plugin可以监听一些事件，通过webpack的api改变结果。
>
>用法不同：（1）loader在module.rule中配置。类型为数组，每一项都是Object；（2）plugin是单独配置的，类型为数组，每一项都是plugin实例，参数通过构造函数传入
>
>loader遵循单一原则，每个Loader只做一种"转义"工作。 每个Loader的拿到的是源文件内容（source），可以通过返回值的方式将处理后的内容输出，也可以调用this.callback()方法，将内容返回给webpack。 还可以通过 this.async()生成一个callback函数，再用这个callback将处理后的内容输出出去。
>
>plugin的编写：webpack在运行的生命周期中会广播出许多事件，Plugin 可以监听这些事件，在合适的时机通过 Webpack 提供的 API 改变输出结果。

##### webpack热更新原理

>基础概念：
>
>- Webpack compiler: 将js 编译成bundle
>- bundle server: 提供文件在浏览器的访问，实际上就是一个服务器
>- HMR server: 将热更新的文件输出给 HMR Runtime
>- HMR Runtime:会被注入到bundle中，和HMR server通过websocket连接，接收文件变化并更新对应的文件
>
>（1）第一步，在 webpack 的 watch 模式下，文件系统中某一个文件发生修改，webpack 监听到文件变化，根据配置文件对模块重新编译打包，并将打包后的代码通过简单的 JavaScript 对象保存在内存中。
>
>（2）第二步是 webpack-dev-server 和 webpack 之间的接口交互，而在这一步，主要是 dev-server 的中间件 webpack-dev-middleware 和 webpack 之间的交互，webpack-dev-middleware 调用 webpack 暴露的 API对代码变化进行监控，并且告诉 webpack，将代码打包到内存中。
>
>（3）第三步是 webpack-dev-server 对文件变化的一个监控，这一步不同于第一步，并不是监控代码变化重新打包。当我们在配置文件中配置了devServer.watchContentBase 为 true 的时候，Server 会监听这些配置文件夹中静态文件的变化，变化后会通知浏览器端对应用进行 live reload。注意，这儿是浏览器刷新，和 HMR 是两个概念。
>
>（4）第四步也是 webpack-dev-server 代码的工作，该步骤主要是通过 sockjs（webpack-dev-server 的依赖）在**浏览器端和服务端之间建立一个 websocket 长连接，将 webpack 编译打包的各个阶段的状态信息告知浏览器端**，同时也包括第三步中 Server 监听静态文件变化的信息。浏览器端根据这些 socket 消息进行不同的操作。当然服务端传递的最主要信息还是新模块的 hash 值，后面的步骤根据这一 hash 值来进行模块热替换。
>
>（5）webpack-dev-server/client 端并不能够请求更新的代码，也不会执行热更模块操作，而把这些工作又交回给了 webpack，**webpack/hot/dev-server 的工作就是根据 webpack-dev-server/client 传给它的信息以及 dev-server 的配置决定是刷新浏览器呢还是进行模块热更新**。当然如果仅仅是刷新浏览器，也就没有后面那些步骤了。
>
>（6）HotModuleReplacement.runtime 是客户端 HMR 的中枢，它接收到上一步传递给他的新模块的 hash 值，它通过 JsonpMainTemplate.runtime 向 server 端发送 Ajax 请求，服务端返回一个 json，该 json 包含了所有要更新的模块的 hash 值，获取到更新列表后，该模块再次通过 jsonp 请求，获取到最新的模块代码。这就是上图中 7、8、9 步骤。
>
>（7）而第 10 步是决定 HMR 成功与否的关键步骤，在该步骤中，HotModulePlugin 将会对新旧模块进行对比，决定是否更新模块，在决定更新模块后，检查模块之间的依赖关系，更新模块的同时更新模块间的依赖引用。
>
>（8）最后一步，当 HMR 失败后，回退到 live reload 操作，也就是进行浏览器刷新来获取最新打包代码

##### **如何在vue项目中实现按需加载？**

>经常会引入现成的UI组件库如ElementUI、iView等，但是他们的体积和他们所提供的功能一样，是很庞大的。
>
>不过很多组件库已经提供了现成的解决方案，如Element出品的babel-plugin-component和AntDesign出品的babel-plugin-import 安装以上插件后，**在.babelrc配置中或babel-loader的参数中进行设置，即可实现组件按需加载了**

##### 如何在webpack优化？

>- 优化构建速度
>
>  `speed-measure-webpack-plugin` SMP 分析打包过程中loader 和plugin的耗时
>
>  - 多线程、多实例：thread-loader
>  - 减少打包作用域：exclude\include确定loader规则的范围；noParse对完全不需要解析的库进行忽略；如jquery
>  - 利用缓存提升二次构建速度： `babel-loader 、terser-webpack-plugin、cache-loader`
>  - DLL：使用dllplugin分包，使用dllreferencePlugin(索引链接)对mainfest.json引用，让基本不会动的资源打包成静态资源，编译反复编译
>  - 使用Webpack4：v8带来的优化 默认更快的md4 hash算法
>
>- 优化打包体积
>
>  `webpack-bundle-analyzer`体积分析，输出html可直观的看到每个js的体积大小
>
>  - 压缩代码： webpack-paralle-uglify-plugin、terser-webpack-plugin、mini-css-extract-plugin 提取chunk中的css代码到单独文件，optimize-css-assets-webpck-plugin 开启压缩
>
>  - 提取页面公共资源
>
>    - Html-webpack-externals-plugin 基础包cdn引入，不打入bundle
>    - splitChunksPlugin进行公共组件分离
>    - 基础包分离：将一些基础库放在cdn 配置external不打入bundle
>
>  - Tree-Shaking
>
>    - 打包过程中检测工程中没有引用过的模块并进行标记，在资源压缩中将它们从最终的bundle中去掉
>
>    - 禁用babel-loader的模块依赖解析，否则webpack接收的事转换过的commonjs形式的模块，无法进行
>    - 使用uncss取出无用的css代码
>
>  - Scope hoisting
>
>    构建后的代码存在大量闭包，将所有模块的代码按照引用顺序放在一个函数作用域
>
>  - 图片压缩
>
>  - 动态polyfill
>
>    - Ball-preset-env中通过useBuiltlns：usage来动态加载polyfill
>
>  