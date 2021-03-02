webpack与构建发展史

- 为什么需要构建工具？
> 转换ES6(浏览器版本不支持ES6语法)、转换JSX(不支持主流框架的语法)、css前缀补全和预处理器、压缩混淆、图片压缩
- 前端构建的演变历史？
> ant+YUL tool(2007)-----grunt(构建过程分成很多任务)-----fis3(百度，不再维护）/gulp(文件流)-----rollup、webpack、parcel
- 为什么选择webpack？
> 社区活跃度丰富、配置灵活和插件化扩展、官方更新迭代速度快
- 初识webpack？
> 配置⽂件：（默认）webpack.config.js ,可以通过webpack --config指定配置⽂件
> 配置组成：
    1.entry：打包⼊⼝⽂件
    2.output：打包输出
    3.mode：环境
    4.module-rules:Loader配置
    5.plugins：插件配置
 零配置：只设置entry和output
- 安装webpack
> 1. 安装nvm(nvm list）、nodejs(node -v)、npm (npm -v)    
> 2. webpack、webpack-cli
- 通过npm script 运行webpack：在package.json增加scripts增加：build:'webpack'  npm run build执行
#### webpack基础用法
- entry：打包⼊⼝⽂件
> 单入口：entry为字符串
> 多入口: entry为对象（key-value）
- output：打包输出
> 编译后的文件输出到磁盘的位置，单入口指定filename和path 
> 多⼊⼝：filename:[name].js  通过占位符确保⽂件名称的唯⼀
- module-rules:Loader配置
> webpack开箱即⽤只有⽀持js和json两种⽂件类型，通过loaders去⽀持其他⽂件类型并且把它们转化成有效的模块，并且添加到依赖图中。
> 本身是⼀个函数，接受源⽂件作为参数，返回转换的结果
>
> 1. babel-loader:转换ES6/7等js新特性语法
> 2. css-loader:⽀持.css⽂件的加载和解析
> 3. less-loader:将less⽂件转换为css
> 4. ts-loader:将ts转换为js
> 5. file-loader:进⾏图⽚、字体等的打包
> 6. raw-loader:将⽂件以字符串的形式导⼊
> 7. thread-loader:多进程打包css和js

> loaders的用法:
 test：指定匹配规则          use：指定使⽤的loader名称
- plugins：插件配置
>插件⽤于bundle⽂件的优化，资源管理和环境变量注
>⼊。作⽤于整个构建过程
>
>1. CommonsChunkPlugin：将chunks相同的模块代码提取成公共js
>2. CleanWebpackPlugin：清理构建⽬录
>3. ExtractTextWebpackPlugin：将css从bundle⽂件⾥提取成⼀个独⽴的css⽂件
>4. CopyWebpackPlugin：将⽂件或者⽂件夹拷⻉到构建的输出⽬录
>5. HtmlWebpackPlugin：创建html⽂件去承载输出的bundle
>6. UglifyjsWebpackPlugin：压缩js
>7. ZipWebpackPlugin：将打包出的资源⽣成⼀个zip包
- mode
> mode⽤于指定当前的构建环境是：production（默认）/development/none
> 设置mode触发webpack内置的函数
1.mode = development：开启NameChuncksPlugin 和NameModulesPlugin
2.mode = production：开启FlagDependencyUsagePlugin，FlagIncludedChunksPlugin, ModuleConcatenationPlugin, NoEmitOnErrorsPlugin, OccurrenceOrderPlugin, SideEffectsFlagPlugin 和 UglifyJsPlugin
3.mode = none:不开启任何优化选项
- 解析es6和React jsx
>解析ES6:使⽤babel-loader
>babel的配置⽂件：.babelrc 
babel plugins:⼀个插件对应⼀个功能:插件是从前往后执行
babel preset:⼀个集合 @babel/preset-env ： 从后往前执行。且晚于插件执行
安装 npm i @babel/core @babel/preset-env babel-loader -D    （-D:--save-dev的简称）

> 解析React JSX :增加React的babel preset配置:使⽤@babel/preset-react
- 解析css、less和sass
>css-loader：⽤于加载.css⽂件，并且转换成commonjs对象
>style-loader：⽤于将样式通过<style>标签插⼊到head中
>less-loader：⽤于将less转换为css
>
>**npm i style-loader css-leader -D**
- 解析图⽚和字体
> file-loader：⽤于处理⽂件
> url-loader：⽤于处理图⽚和字体 （可以设置较⼩资源⾃动base64）
>
> npm i file-loader url-loader -D
- webpack中的⽂件监听
> ⽂件监听是在发现源码变化时，⾃动重新构建输出新的构建⽂件
> webpack开启监听模式，有两种⽅式（唯⼀缺陷：每次都要⼿动刷新浏览器）
> 1.启动weboack命令时，带上--watch参数
> 2.在配置webpack.config.js中设置 watch:true
>
> ⽂件监听的原理分析：
>
> 轮询判断⽂件的最后编辑时间是否发⽣变化。某个⽂件发⽣了变化，并不会⽴刻告诉监听者,⽽是先缓存起来，等aggregateTimeout

```javascript
module.export = {
 watch:true,                  // 默认false，不开启
 watchOptions:{               // 只有开启监听时，watchOptions才⽣效
 	ignored:/node_modules/,     // 默认为空，不监听的⽂件或者⽂件夹，⽀持正则匹配
 	aggregateTimeout:300,       // 监听到变化发⽣后会300ms再去执⾏，默认300ms 缓存等待时间
 	poll:1000                   // 判断⽂件是否变化是通过不停询问系统指定⽂件有没有变化实现的，默认每秒1000次
 }
}
```

- webpack的热更新及原理（webpack-dev-server)

> wds不刷新浏览器，不输出⽂件，⽽是放在内存中。使⽤HotModuleReplacementPlugin插件

```javascript
//第一种方式
"dev":"webpack-dev-server --open"
plugins:[
	new webpack.HotModuleReplacementPlugin()
],
devServer:{
 contentBase:'./dist', //服务的基础⽬录
 hot:true
}
//第二种方式
//wdm(webpack-dev-middeware)将webpack输出的⽂件传输给服务器,适⽤于灵活的定制场景
```

> 热更新的原理：
>
> Webpack Compiler：将js编译成bundle.js
>
> HMR Server：将热更新的⽂件输出给HMR Runtime 
>
> Bundle Server：提供⽂件在浏览器的访问
>
> HMR Runtime：会被注⼊到浏览器，websocket连接更新⽂件的变化
>
> bundle.js：构建输出的⽂件
>
> 两个过程
>
> 启动阶段：⽂件系统提供给webpack compiler进⾏编译，把编译好的⽂件传输给bundle server，bundle server其实就是⼀个服务器，以服务器的形式让bundle⽂件在浏览器进⾏访问
>
> 更新阶段：⽂件系统提供给webpack compiler进⾏编译，编译好的代码发送给hmr server，hmr server将更新的模块告诉hmr runtime哪些⽂件发⽣变化（通常以json形式进⾏传输），hmr runtime就是更新代码模块，并且不需要刷新浏览器

- ⽂件指纹策略：chunkhash

> ⽂件指纹：打包后输出的⽂件名的后缀（用来做版本管理）
>
> 文件指纹如何生成？
>
> ​	**Hash**：和整个项⽬的构建有关，只要项⽬⽂件有修改，整个项⽬的**hash**值有更改
>
> ​	**Chunkhash**：和**webpack**打包的**chunk**有关，不同**entry**会⽣成不同的**chunkhash**值
>
> ​	**Contenthash**：根据⽂件内容定义**hash**，⽂件内容不变，则**contenthash**不变（⼀般针对css)
>
> 如何设置⽂件指纹？（主要⽤于发布环境）
>
> ​	设置**output**的**filename**，使⽤[name]_[chunkhash].js (js⽂件)
>
> ​	设置**MiniCssExtractPlugin**的**filename**，使⽤[contenthash].css (css⽂件)（注意:它与**style-loader**互斥，⽤的话使⽤插件的**loader**代替它）
>
> ​	设置**file-loader**的**name**，使⽤[hash] （图⽚⽂件）,hash指文件内容的hash,由md5生成
>
> 占位符
>
> [ext]：资源后缀名
>
> [name]：⽂件名称
>
> [path]：⽂件相对路径
>
> [folder]：⽂件所在的⽂件夹
>
> [contenthash]：⽂件的内容**hash**，默认**md5**⽣成
>
> [hash]：⽂件的内容**hash**，默认**md5**⽣成
>
> [emoji]：⼀个随机的指代⽂件内容的**emoji**

- HTML/CSS/JS代码压缩

> js压缩:      webpack内置uglifyjs-webpack-plugin 
>
> css压缩:   **optimize**-css-assets-webpack-**plugin** 同时使⽤cssnano
>
> html压缩:  html-webpack-plugin 设置压缩参数

#### webpack进阶用法

- ⾃动清理构建⽬录产物

>通过npm scripts清理构建⽬录：rm -rf ./dist && webpack      rimraf ./dist && webpack
>
>使⽤clean-webpack-plugin：它会默认删除 output 指定的输出⽬录。

- ⾃动补⻬css3前缀

>Css3的属性为什么要增加前缀？因为由于浏览器的标准并没有完全的统一，四种浏览器内核：
>
>​						IE:Trident(-ms) / Geko(-moz) / Webkit(-webkit) / Presto(-o)
>
>使⽤autoprefixer插件（后置处理器）,和less 和 sass 不同，less 和 sass 是 css 的预处理器，预处理器一般是在打包前置去处理，autoprefixer 是在样式处理好之后，代码生成完之后，再对 css 进行后置处理。通过postcss去优化css代码。优化的过程就是通过一系列的组件去优化。
>
>使用autoprefixer： autoprefixer插件通常是和 postcss-loader 一起使用的。postcss-loader 的功能是比较强大的，除了做 css 样式补全之外，它还可以做支持 css module，style lint 等。

- 移动端css px⾃动转换为rem

>浏览器分辨率:  移动设备流行之后，不同机型的分辨率是不一样的，这对前端开发来说，就会造成比较大的问题，需要不断的对页面进行适配
>
>解决方法：1.css媒体查询实现响应式布局（缺陷：需要写多套适配样式代码，影响开发效率）

```css
@media screen and (max-width: 980px) {
  .header {
  	width: 900px;
  } 
}
@media screen and (max-width: 480px) {
  .header {
  	height: 400px;
  } 
}
@media screen and (max-width: 350px) {
  .header {
  	height: 300px;
  } 
}
```

>rem:  css3 里面提出了一个 rem 的单位 根元素 font-size 的大小；
>
> rem 是一个相对的单位。px 是绝对单位
>
>使用： 编写代码的时候，按照 px 的单位去写，通过构建工具，自动的将 px 转换成 rem，这个工具就是 px2rem-loader。
>
>在页面渲染时计算跟元素的font-size大小：利用⼿淘的lib-flexible库
>
>npm i px2rem-loader -D
>
>npm i lib-fiexible -S  动态计算跟元素的大小
>
>在html中引入：页面打开的时候就需要马上的计算这个值，所以它的位置需要前置放在前面的位置。
>
><script type='text/javascript'></script>

- 静态资源内联

>资源内联的意义：
>
>代码层面：
>
>- ⻚⾯框架的初始化脚本：如上节中 rem 计算的 js 库，要在打开页面的时候就要去计算。
>- 上报相关打点：page start，css 初始化，css 加载完成，js 初始化和 js 加载完成等代码，这些都是需要内联到 html 里面去，而不能直接放到最终打包的 js 脚本中去。
>- css 内联避免⻚⾯闪动 
>
>请求层⾯：减少 HTTP ⽹络请求数,如⼩图⽚或者字体内联 (url-loader)
>
>html和js的内联：raw-loader的功能是读取一个文件，把这个文件的内容返回成一个string，把这个string插入到对应的位置。
>
>raw-loader内联html ： <script>${require('raw-loader!babel-loader!./meta.html')}</script>
>
>raw-loader内联js：
>
><script>${require('raw-loader!babel-loader!../node_modules/lib-flexible/fiexible.js')}</script>
>css内联：
>
>方案一：借助style-loader

```javascript
{
loader:'style-loader',
options:{
	insertAt:'top', //样式插⼊到<head>
	singleton:true, //将所有的style标签合并成⼀个
 }
}
```



>方案二：html-inline-css-webpack-plugin

- 多⻚⾯应⽤打包通⽤⽅案

>##### 多页面应用（MPA）概念:
>
>多页面发布上线之后，它有很多个入口。
>
>每一次页面跳转的时候，后台服务器都会返回一个新的 html 文档。
>
>多页面优势:1.每个页面之间是解偶的.   2.对 seo 更友好
>
>#####  多页面打包基本思路
>
>每个页面对应一个 entry，一个 html-webpack-plugin。
>
>缺点：每次新增或删除页面需要手动修改 webpack 配置构建脚本
>
>##### 多⻚⾯打包通⽤⽅案
>
>动态获取 entry 和设置 html-webpack-plugin 数量。利⽤glob.sync获取当前构建目录下面所有的一级目录   entry:glob.sync(path.join(__dirname,'./src/*/index.js'))
>
>通过程序的思维动态获取某个目录下面指定的入口文件，需要有一个约定，把所有的页面都放在 src 的目录下面，每个页面的入口文件都约定为 index.js，这样我们就可以通过 js 脚本去获取src里面所有的目录，就可以知道入口文件的数量，打包的时候动态的设置 html-webpack-plugin。相比于自己写这个脚本，webpack 里面有一个更通用的做法是通过 glob 这个库，glob 的原理类似 linux 操作系统下面文件通配匹配的概念，根据匹配信息返回匹配到的目录内容，我们根据这个目录内容进行操作就可以了

```javascript
const glob = require('glob');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const setMPA = () => { //多页面打包的函数
	const entry = {};
	const htmlWebpackPlugins = [];
	const entryFiles = glob.sync(path.join(__dirname,'./src/*/index.js')); //获取src目录下的所有入口文件
  console.log('========entryFiles',entryFiles)
	Object.keys(entryFiles).map((index) => {
		const entryFile = entryFiles[index];     // '/Users/cpselvis/my-project/src/index/index.js'
		const match = entryFile.match(/src\/(.*)\/index\.js/);//匹配src开头 末尾是index.js 
		const pageName = match && match[1];  //取index. search 
 		entry[pageName] = entryFile;
 		htmlWebpackPlugins.push(
			new HtmlWebpackPlugin({
				inlineSource: '.css$',
				template: path.join(__dirname,`src/${pageName}/index.html`),
				filename: `${pageName}.html`,
				chunks: ['vendors', pageName],
				inject: true,
				minify: {
					html5: true,
					collapseWhitespace: true,
					preserveLineBreaks: false,
					minifyCSS: true,
					minifyJS: true,
					removeComments: false
 				}
 			})
 		);
 	});
	return { //返回
	 	entry,
 		htmlWebpackPlugins
 	}
}
const { entry, htmlWebpackPlugins } = setMPA();
```

- 使⽤sourcemap

>作⽤：通过 source map 定位到源代码
>
>开发环境开启，线上环境关闭
>
>- 如果线上不关闭，会把我们的业务逻辑暴露出来，线上排查问题的时候可以将 sourcemap 上传到错误监控系统。
>
>#####source map 关键字
>
>eval: 使⽤ eval 包裹模块代码
>
>source map: 产⽣ .map ⽂件
>
>cheap: 不包含列信息，只包含行信息
>
>inline: 将 .map 作为 DataURI 嵌⼊，不单独⽣成 .map ⽂件
>
>module:包含 loader 的 sourcemap
>
>#####source map类型 m
>
>可以根据前面的关键字排列组合得到。
>
>#####本地开发时使用 sourcemap 进行代码调试
>
>在webpack.dev.js devtool 中加入 sourcemap

- 提取⻚⾯公共资源

>- 基础库分离
>
>思路：将 react/react-dom/vue 基础包通过cdn引⼊，不打⼊**bundle**中
>
>⽅法：使⽤ html-webpack-externals-plugin
>
>- 利⽤ SplitChunksPlugin 进⾏公共脚本分离：webpack4内置，替代CommonsChunkPlugin插件
>
>  chunks参数说明：
>
>  - async 异步引⼊的库进⾏分离（默认）
>
>  - initial  同步引⼊的库进⾏分离
>
>  - all      所有引⼊的库进⾏分离（推荐）
>
>```javascript
>module.exports = {
>  optimization: {
>    splitChunks: {
>      chunks: 'async',
>      minSize: 30000, // 抽离的公共包最小的大小，单位是字节
>      maxSize: 0,			// 抽离的公共包最大的大小，单位是字节
>      minChunks: 1,   // 使用的次数超过这个就提取成公共的文件
>      maxAsyncRequests: 5,
>      maxInitialRequests: 3, // 同时请求的异步资源的次数
>      automaticNameDelimiter: '~',
>      name: true,
>      cacheGroups: {
>        vendors: {
>          test: /[\\/]node_modules[\\/]/, /（react | react-dom)/  // 匹配出需要分离的包
>          priority: -10
>        },
>        default: {
>          minChunks: 2,
>          priority: -20,
>          reuseExistingChunk: true
>        }
>      }
>    }
>  }
>}
>```

- treeshaking的使⽤和原理分析

>tree shaking（摇树优化）
>
>- 概念：⼀个模块可能有多个⽅法，只要其中的某个⽅法使⽤到了，则整个⽂件都会被打到bundle⾥⾯去，tree shaking就是只把⽤到的⽅法打⼊bundle，没⽤到的地⽅会在uglify阶段被擦除掉
>
>- 使⽤：webpack⽀持，在.babelrc⾥⾯设置modules:false即可（mode为production的情况下默认打开）
>
>要求：必须是ES6的语法，CJS的⽅式不⽀持
>
>原理
>
>- DCE(Dead Code Elimination)：代码不会被执⾏，不可到达； 代码执⾏的结果不会被⽤到；代码只会影响死变量（只写不读）
>- tree-shaking原理：
>
>>利⽤ES6模块的特点：
>>
>>\- 只能作为模块顶层的语句出现
>>
>>\- **import**的模块名只能是字符串常量
>>
>>\- **import**binding是immutable的
>>
>>代码擦除：uglify阶段删除⽆⽤代码
>>
>>（注意：你编写的代码不能含有副作⽤，不然**tree**-shaking也会失效）

- ScopeHoisting的使⽤和原理分析

>- 场景：构建后的代码存在⼤量闭包代码
>
>![img](https://upload-images.jianshu.io/upload_images/3357098-f441b0cd115b5868.png?imageMogr2/auto-orient/strip|imageView2/2/w/933/format/webp)
>
>- 存在问题：
>  - ⼤量函数闭包包裹代码，导致体积增⼤（模块越多越明显）
>  - 运⾏代码时创建的函数作⽤域变多，内存开销变⼤
>
>- 为什么webpack打包会产生这么多的闭包呢?
>
>  模块转换
>
>  - 转换原理：将模块转换为模块初始化函数（主要考虑浏览器兼容性问题）
>  - 转换处理⽅法:
>    1. 被webpack转换后的模块带上⼀层包裹
>    2. **import**会被转换成__webpack_require,**export**也会有相应的转换
>
>- webpack模块机制
>
>  - \- 打包出来的是⼀个IIFE（匿名函数）
>  - modules是⼀个数组，每⼀项是⼀个模块初始化函数
>  - __webpack_require⽤来加载模块，返回**module**.**exports**
>  -  通过WEBPACK_REQUIRE_METHOD(0)启动程序
>
>- scope hoisting原理
>
>  - 原理：将所有模块的代码按照引⽤顺序放在⼀个函数作⽤域⾥，然后适当的重命名⼀些变量以防⽌变量名冲突。
>
>  - 对⽐：通过scope hoisting可以减少函数声明代码和内存开销
>
>  - 使⽤：webpack mode为production默认开启。必须是ES6语法，CJS语法不⽀持
>
>    ```javascript
>    //webpack3：
>    plugins:[
>    	new webpack.optimize.ModuleConcatenationPlugin()
>    ]
>    //webpack4,mode 为production 自动开启ModuleConcatenationPlugin
>    ```

- 代码分割 和 动态import

>- 代码分割的意义
>
>对于⼤的web应⽤来说，将所有的代码放在⼀个⽂件中显然是不够有效的，特别是当你的某些代码块再特殊的时候才会被使⽤到。webpack有⼀个功能就是将你的代码库分割成chunks（语块），当代码运⾏到需要它们的时候再进⾏加载。
>
>- 适⽤的场景：
>
>  	- 抽离相同代码到⼀个共享块
>  	- 脚本懒加载，使得初始下载的代码更⼩
>
>- 懒加载js脚本的⽅式:   
>
>  	- CommonJS: require.ensure.     
>  	- ES6：动态import（⽬前还没有原⽣⽀持，需要babel转换）
>
>- 如何使⽤动态import
>
>   - 安装babel插件 :npm install @babel/plugin-syntax-dynamic-import--save-dev
>
>   - ES6:      动态import(⽬前还没有原⽣⽀持，需要babel转换)
>
>     ```javascript
>     //.babelrc
>     {"plugins":["@babel/plugin-syntax-dynamic-import"] 
>     ```
>

- webpack和ESLint结合

>- ESLint规范实践
>
>Airbnb：eslint-config-airbnb / eslint-config-airbnb-base 
>
>腾讯：alloyteam - eslint-config-alloy / ivweb - eslint-config-ivweb 
>
>- 制定团队的ESLint规范
>
>不重复造轮⼦，基于eslint：recommend配置并改进
>
>能够帮助发现代码错误的规则，全部开启
>
>帮助保持团队的代码⻛格统⼀，⽽不是限制开发体验
>
>- ESLint 如何落地
>
>  - 和CI/CD系统集成
>
>    - 本地开发阶段增加precommit钩子：安装husky：npm install husky -D
>
>    - 增加 npm script,通过lint-staged增量检查修改的文件
>
>      ```javascript
>      "script":{
>      	"precommit":"lint-staged"
>       },
>      "lint-staged":{
>      	"linters":{
>      		"*.{js,scss}":["eslint --fix","git add"]
>       	}
>       }
>      ```
>
>  - 和webpack集成
>
>    - 使用⽤ eslint-loader，构建时检查js规范
>
>      ```javascript
>      module.exports = {
>      	module:{
>      	 rules:[
>       		{
>       			test:/\.js$/,
>      	 		exclude:/node_modules/,
>      			use:[
>      				"babel-loader",
>      				"eslint-loader"
>      			]
>       		}
>       	]
>       }
>      }
>      //包：babel-eslint,babel-loader,eslint-config-airbnb
>       //.eslintrc.js⽂件
>      module.exports = {
>      	"parser":"babel-eslint",
>      	"extends":"airbnb",
>      	"env":{
>      		"browser":true,
>      		"node":true
>       	}
>       }
>      ```
>

- webpack打包组件和基础库

>- webpack打包库和组件
>
>  webpack除了可以⽤来打包应⽤，也可以⽤来打包js库
>
>  - 实现⼀个⼤整数加法库的打包
>
>   - 需要打包压缩版(适应于开发阶段)和⾮压缩版（发布上线）
>  - ⽀持AMD/**CMD**/ESM模块引⼊
>   - 库的⽬录结构和打包要求
>  - 打包输出的库名称：
>    - 未压缩版：large-number.js
>    - 压缩版：large-number.min.js
> 
>  - 目录结构：
> 
>    - ​	/dist
> 
>      ​	-- /large-number.js
> 
>      ​	-- /large-number.min.js
> 
>      ​	--/webpack.config.js
>    
>      ​	- package.json
>    
>      ​	- index.js
>    
>         -src
>    
>        -- index.js
>    
>      - 支持的使用方式
>    
>  - ESModule: import * as largeNumber from 'large-number'; 
>      - COMMONJS: const largeNumber = require('large-number');
>  - AMD: require(['large-number'],function(largeNumber){})
>   - script标签引⼊：<script src="https://unpkg.com/large-number"> </script>
>
>  - 如何将库暴露出去？
> 
> library:指定库的全局变量
> 
>libraryTarget:⽀持库引⼊的⽅式
> 
>```javascript
>    module.exports = {
>	mode:"production",
>    	entry:{
>		"large-number":"./src/index.js",
>    		"large-number.min":"./src/index.js"
>    	},
>    	output:{
>    		filename:"[name].js", *//*⽂件名
>    		library:"largeNumber", *//*库名
>    		libraryExport:"default",
>    		libraryTarget:"umd" *//*引⼊的形式指定
>    	}
>    }
>    ```
>    
>     - 如何只针对.min文件压缩
>    
>       通过include设置只压缩.min.js结尾的文件，区别uglifyPlugin的好处是：如果碰到es6代码不能解析他不会报错
>    
>   安装：cnpm install terser-webpack-plugin -D
> 
>```javascript
>    const TerserPlugin = require('terser-webpack-plugin');
>optimization:{
>    	minimize: true,
>	minimizer:[
>    		new TerserPlugin({
>    			inslude: /\.min\.js$/, 
>    		})
>    	]
>    }
>    ```
>    
>     - 设置入口文件
>    
>    ```javascript
>    //package.json的main字段为index.js
>if(process.env.NODE_ENV === "production"){
> module.exports = require('./dist/large-number.min.js')
>} else {
>    module.exports = require('./dist/large-number.js') }
>    ```
>    
>     

- webpack实现SSR

>- 服务端渲染（SSR）
>
>  渲染：HTML + CSS + JS + Data -> 渲染的HTML
>
>  服务端：
>
>  - 所有模版等资源都存储在服务端
>
>  - 内⽹机器拉取数据更快
>
>  - ⼀个HTML返回所有数据
>
>- 浏览器和服务器交互流程
>
>  请求开始=>server => HTML template/data =>server render => 浏览器解析并渲染（⽤户层⾯）=> 加载并执⾏js和其他资源=> ⻚⾯完全可交互
>
>- 客户端渲染和服务端渲染
>
>  客户端：多个请求，串行加载，图⽚等静态资源加载完成，js逻辑执⾏完成可交互
>
>  服务端：1个请求，并行加载，图⽚等静态资源加载完成，js逻辑执⾏完成可交互
>
>- SSR优势：  减少⽩屏时间/ 对于SEO友好
>
>- SSR代码实现思路
>
>  - 服务端：使⽤react-dom/server的renderToString⽅法将其React组件渲染成字符串，服务端路由返回对应的模版
>  - 客服端：打包出针对服务端的组件
>
>- webpack SSR 打包存在的问题
>
>  浏览器的全局变量（**Node**.**js**中没有document，window）
>
>  - 组件适配：将不兼容的组件根据打包环境进⾏适配
>
>  - 请求适配：将fetch或者ajax发送请求的⽅法改成isomorphic-fetch或者axios
>
>  样式问题（**Node**.**js**⽆法解析css）
>
>  - ⽅案⼀：服务端打包通过ignore-loader忽略掉css的解析
>
>  -  ⽅案⼆：将style-loader替换成isomorphic-style-loader
>
>  如何解决样式不显示的问题？
>
>  ​	使⽤打包出来的浏览器端html为模板/ 设置占位符，动态插⼊组件
>
>  ⾸屏数据如何处理？
>
>  ​	服务端获取数据-> 替换占位符

- 优化构建时命令⾏的⽇志显示

>场景问题:当前构建时的⽇志显示：展示⼀⼤堆⽇志，很多并不需要开发者关注
>
>- 统计信息stats 
>
>![image-20200914194234725](/Users/banggan/Library/Application Support/typora-user-images/image-20200914194234725.png)
>
>- 如何优化命令⾏的构建⽇志
>
>  使⽤ friendly-errors-webpack-plugin
>
>  - success:构建成功的⽇志提示
>  - warning:构建警告的⽇志提示
>  - error:构建报错的⽇志提示
>  - stats设置成errors-**only**
>
>  ```javascript
>  plugins:[
>    new FriendlyErrorsWebpackPlugin()
>  ],
>  stats:'errors-only'
>  ```

- 构建异常和中断处理

>- 如何判断构建是否成功？
>
>  在**CI**/**CD**的pipline或者发布系统需要知道当前构建状态
>
>  每次构建完成后输⼊echo $?获取错误码
>
>  webpack4之前的版本构建失败不会抛出错误码（**error**code）
>
>  Node.js中的process.exit规范
>
>  - 0表示成功完成，回调函数中，err为null 
>  - ⾮0表示执⾏失败，回调函数中，err不为null，err.code就是传给exit的数字
>
>- 如何主动捕获并处理构建错误？
>
>  compiler在每次构建结束后会出发done这个hook process.exit主动处理构建报错 ,process.exit主动处理构建报错
>
>  ```javascript
>  plugins:[
>  	function(){
>  		this.hooks.done.tap('done',(stats)=>{
>  			if(stats.compilation.errors && stats.compilation.errors.length&&process.argv.indexOf('--watch')==-1){
>  				console.log('builderror');
>  				process.exit(1);
>  			}
>  		})
>  	}
>  ]
>  ```
>
>  

#### 编写可维护的webpack构建配置

- 构建配置包设计

>- 构建配置抽离成npm包的意义
>
>  - 通用性：业务发无关构配、统一队建本构配合的分RAM文、
>  - 可维护性：构建配置合理的拆分、README文档、ChangeLog文档等
>  - 质量：冒烟测试、单元测试、测试覆盖率、持续集成
>
>- 构建配置管理的可选方案
>
>  - 通过多个配置文件管理不同环境的构建，webpack--config参数进行控制
>  - 将构建配置设计成一个库，比如：hjs-webpack、Neutrino、webpack-blocks
>  - 抽成一个工具进行管理，比如：create-react-app,kyt,nwb
>  - 将所有的配置放在一个文件，通过--env参数控制分支选择
>
>- 构建配置包设计
>
>  - 通过多个配置文件管理不同环境的webpack配置
>
>    - 基础配置：webpack.base.js
>    - 开发配置：webpack.dev.js
>    - 生产配置：webpack.prod.js
>    - Sir配置：webpack.ssr.js
>
>  - 抽离成一个npm包统一管理
>
>    - 规范：Gitcommit日志、README、ESLint规范、Semver规范
>    - 质量：冒烟测试、单元测试、测试覆盖率和CI
>
>  - 通过webpack-merge组合配置
>
>    ```javascript
>    merge = require("webpack-merge")
>    merge(
>      ...{a:[1],b:5,c:20},
>      ...{a:[2],b:10,d:421}
>      ...)
>    {a:[1,2],b:10,c:20,d:421}
>    合并配置：module.exports = merge(baseConfig,devConfig);
>    ```

- 功能模块设计和目录结构

>- 功能模块设计
>
>  ![image-20200915192229297](/Users/banggan/Library/Application Support/typora-user-images/image-20200915192229297.png)
>
>- 目录结构设计
>
>  ![image-20200915192354248](/Users/banggan/Library/Application Support/typora-user-images/image-20200915192354248.png)

- 使用eslint 规范构建脚本

>  使用eslint-config-airbnb-base
>
>  Eslint --fix可以自动处理空格
>
>```javascript
>module.exports={
>"parser":"babel-eslint",
>"extends":"airbnb-base",
>"env":{"browser":true,"node":true}
>};
>
>```
>
>

- 冒烟测试和实际运用

>- 冒烟测试
>  - 是指对提交测试的软件在进行详细深入的测试之前而进行的预测试，这种预测试的主要目的是暴露导致软件需重新发布的基本功能失效等严重问题
>- 冒烟测试执行
>  - 构建是否成功
>  - 每次构建完成build目录是否有内容输出：是否有JS、CSS等静态资源文件
>- 判断构建是否成功：在示例项目里面运行构建，看看是否有报错
>- 判断基本功能是否正常：编写mocha测试用例

#### webpack构建速度、体积优化策略

- 初级分析：使用webpack内置的stats

> - stats:构建的统计信息
>
>   - package.json中使用stats
>
>   ```javascript
>   "scripts":{
>   	"build:stats":"webpack --env production --json > stats.json"
>   }
>   ```
>
>   - Node.js中使⽤
>
>   ```javascript
>   const webpack = require('webpack');
>   const config = require('./webpack.config.js')("production");
>   webpakc(config,(err,stats) => {
>   	if(err){
>   		return console.error(err);
>     }
>     if (stats.hasErrors()){
>   		return  console.error(stats.toString('errors-only'));
>    	}
>   	console.log(stats);
>   })
>   
>   //两个⽅法的缺陷：(颗粒度太粗，看不出问题所在)
>   ```

- 速度分析：使用speed-measure-webpack-plugin

  ```javascript
  // 引⼊
  const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
  	// 初始化
  	const smp = new SpeedMeasurePlugin();
  	// 将webpack配置包⼀下
  	const webpackConfig = smp.wrap({
  	plugins:[
  		new MyPlugin();
  		new MyOhterPlugin();
   ]
  });
  //可以看到每个loader和插件执⾏耗时
  ```

  速度分析插件的作⽤：分析整个打包总耗时、每个插件和loader的耗时情况

- webpack-bundle-analyzer分析体积

  >- 代码示例
  >
  >```javascript
  >const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
  >module.exports= {
  >	plugins:[
  >		newBundleAnalyzerPlugin();
  >	]
  >}
  >//构建完成后在8888端⼝展示⼤⼩
  >```
  >
  >- 通过该插件可以分析出来哪些问题？
  >
  >  依赖的第三方模块文件大小、业务里面的组件代码大小。

- 使用高版本的webpack和nodejs

>- 使用webpack4:优化原因
>
>  - v8带来的优化（for of 替代forEach、Map和Set替代Object、includes替代indexOf）
>
>  - 默认使⽤更快的md4 hash算法
>
>  - webpacks AST可以从loader传递给AST，减少解析时间
>
>  - 使⽤字符串⽅法替代正则表达式

- 多进程/多实例构建

  - 资源并行解析可选方案:  thread-loader -> (可选⽅案) parallel-webpack / HappyPack

  - 多进程/多实际例： 使⽤HappyPack解析资源

    原理：每次webpack解析⼀个模块，HappyPack会将它及它的依赖分配给worker线程中。

    ```javascript
    exports.plugins = [
    	new HappyPack({
     		id:'jsx',
     		threads:4,
     		loaders:['babel-loader']
     	}),
    	new HappyPack({
     		id:'styles',
     		threads:2,
     		loaders:['style-loader','css-loader','less-loader']
     })
    ]
    ```

  - 多进程/多实例：使⽤thread-loader解析资源

    原理：每次webpack解析⼀个模块，thread-loader会将它和它的依赖分配给worker线程中

    ```javascript
    module.exports = swp.wrap({
    	entry:entry,
    	output:{
    		path:path.join(__dirname,'dist'),
    		filename:'[name].[chunkhash:8].js'
    	},
    	mode:'production',
    	module:{
    		rules:[{
    			test:/.js$/,
    			use:[{
    				loader:'thread-loader',
    				options:{
    					workers:3 }
    				},
    				'babel-loader'
    			]} 
       ]}
    })
    ```

- 多进程多实例并行压缩

>- ⽅法⼀：使⽤parallel-uglify-plugin插件, 支持压缩ES6
>
>  ```javascript
>  const ParallUglifyPlugin = require('webpack-parallel-uglify-plugin');
>  module.exports = {
>   plugins:[
>  	new ParallUglifyPlugin({
>   		uglifyJS: {
>   			output:{
>   				beautify:false,
>   				comments:false
>  			},
>   			compress:{
>   				warning:false,
>   				drop_console:true,
>      		collapse_vars:true,
>   				reduce_vars:true
>  			} 
>     }
>  })
>  ]}
>  ```
>
>- 方案二：uglifyjs-webpack-plugin开启parallel参数，不支持压缩ES6
>
>  ```javascript
>  module.exports = {
>   plugins:[
>  	new UglifyJsPlugin({
>   		uglifyOptions:{
>   			warnings:false,
>   			parse:{},
>   			compress:{},
>   			mangle:true,
>   			output:null,
>   			toplevel:false,
>   			nameCache:null,
>   			ie8:false,
>   			keep_frames:false
>  		},
>   		parallel:true
>  	})
>  ]}
>  ```
>
>- 方案三：terser-webpack-plugin开启parallel参数
>
>  ```javascript
>  const TerserPlugin = require('terser-webpack-plugin');
>  module.exports = {
>   optimization:{
>   	minimizer:[
>  		new TerserPlugin({
>   			parallel:4
>  		})
>  	]
>   }
>  }
>  ```

- 进一步分包：预编译资源模块

  >- 分包：设置Externals
  >
  >  - 思路：将react、react-dom基础包cdn引⼊，不打⼊bundle中
  >
  >  - ⽅法：使⽤html-webpack-externals-plugin
  >
  >- 进⼀步分包：预编译资源模块
  >
  >  - 思路：将react、react-dom、redux、react-redux基础包和业务基础包打包成⼀个⽂件
  >  - ⽅法：使⽤DLLPlugin进⾏分包，DllReferencePlugin对manifest.json引⽤
  >
  >  ```javascript
  >  const path = require('path');
  >  const webpack = require('webpack');
  >  module.exports = {
  >   context:process.cwd(),
  >   resolve:{
  >   	extensions:['.js','.json','.jsx','.less','.css'],
  >   	modules:[__dirname,'node_modules']
  >   },
  >   entry:{//设置需要分离的包，把这些包大包成基础的文件
  >   	library:[
  >  		'react',
  >  		'react-dom',
  >  		'redux',
  >  		'react-redux'
  >  	 ]
  >   },
  >  output:{//指定library
  >   	filename:'[name].dll.js',
  >  	path:path.resolve(__dirname,'./build/library'),
  >   	library:'[name]'
  >  },
  >  plugins:[
  >   new webpack.DllPlugin({ //指定包存放的位置
  >   	name:'[name]',
  >  	path:'./build/library/[name].json'
  >   })
  >  ]
  >  }
  >  ```
  >
  >- 使⽤DllReferencePlugin引⽤manifest.json
  >
  >  ```javascript
  >  //在webpack.config.js引⼊
  >  module.exports = {
  >   plugins:[
  >   	new webpack.DllReferencePlugin({ //指定manifest
  >   		manifest:require('./build/library/manifest.json')
  >   	})
  >   ]
  >  }
  >  ```
  >
  >  

- 充分利⽤缓存提升⼆次构建速度

  >- 缓存目的：提升二次构建速度
  >
  >- 缓存思路
  >
  >  - babel-loader开启缓存
  >  - terser-webpack-plugin开启缓存
  >  - 使⽤cache-loader或者hard-source-webpack-plugin
  >
  >  ```javascript
  >  //缓存思路：(在node_module/.cache可以看到缓存的⽂件)
  >  //babel-loader开启缓存
  >  new HappyPack({
  >  		loaders: [ 'babel-loader?cacheDirectory=true' ]
  >   })
  >  //terser-webpack-plugin开启缓存
  >   optimization: {
  >  		minimizer: [
  >  			new TerserPlugin({
  >  				parallel: true,
  >  				cache: true
  >  			})
  >   		]
  >   }
  >  //使⽤cache-loader或者hard-source-webpack-plugin 提升模块转换阶段的缓存
  >  const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
  >  new HardSourceWebpackPlugin()
  >  ```
  >
  >  

- 缩小构建目标

  >⽬的：尽可能的少构建模块
  >
  >案例：babel-loader不解析node_modules
  >
  >```javascript
  >module.exports = {
  > rules:{
  > 	test:/\.js$/,
  > 	loader:'happypack/loader',
  >	exclude:'node_modules' //这⼀句
  > }
  >}
  >```
  >
  >- 减少文件搜索范围
  >
  >  - 优化resolve.modules配置（减少模块搜索层级）
  >
  >  - 优化resolve.mainFields配置
  >
  >  - 优化resolve.extensions配置.   设置只查找某个类型的文件
  >
  >  - 合理使⽤alias   配置指定路径
  >
  >  ```javascript
  >  module.exports = {
  >  	resolve:{
  >  	//配置路径别名
  >  	alias:{
  >  		react:path.resolve(__dirname,'./node_modules/react/react.min.js')
  >    },
  >  	//告诉webpack哪些⽂件夹要搜索
  >  	modules:[path.resolve(__dirname,'node_modules')],
  >  	extensions:['.js'], //后缀扩展名
  >  	//当引⼊⼀个package.json中的包时，mianField字段决定了check这个包的package.json的哪个字段
  >  	mainFields:['main'] //主查找⼊⼝
  >  }
  >  }
  >  ```

- 使⽤webpack进⾏图⽚压缩

  >- 图片压缩
  >
  >  要求：基于node库的imagemin或者tinypng API 
  >
  >  使⽤：配置image-webpack-loader
  >
  >  ```javascript
  >  return {
  >   	test:/\.(png|svg|jpg|gif|blob)$/,
  >   	use:[
  >     {
  >   		loader:'file-loader',
  >   		options:{
  >   			name:`${filename}img/[name]${hash}.[ext]`
  >  		}
  >  	 },
  >  	{
  >  	 loader:'image-webpack-loader',
  >  	 options:{
  >  		 mozjpeg:{
  >   				progressive:true,
  >   				quality:65
  >  			},
  >   		optipng:{ //针对png
  >   			enabled:false
  >  		},
  >   		pngquant:{
  >   			quality:'65-90',
  >   			speed:4
  >  		},
  >   		gifsicle:{
  >   			interlaced:false
  >  		},
  >   		webp:{
  >   			quelity:75
  >  		} 
  >     } 
  >    } 
  >    ] 
  >  }
  >  ```
  >
  >- Imagemin的压缩原理
  >
  >  - 定制选项
  >  - 可以映入更多的第三方优化插件。如pngquant
  >  - 处理多种图片格式
  >
  >- Imagemin的压缩原理
  >
  >  pngquant :  ⼀款png压缩器，通过将图像转换为具有alpha通道（通常⽐24/32位png⽂件⼩60%-80&）的更⾼效的8位png格式，可显著减⼩⽂件⼤⼩
  >
  >  pngcrush ：主要⽬的是通过尝试不同的压缩级别和png过滤⽅法来降低PNG IDAT数据流的⼤⼩
  >
  >  optipng ： 设计灵感来⾃于pngcrush。optipng可将图像⽂件重新压缩为更⼩尺⼨，⽽不会丢失任何信息
  >
  >  tinypng ： 将24位png⽂件转化为更⼩有索引的8位图⽚，同时所有⾮必要的metadata也会被剥离掉

- 使⽤tree-shaking擦掉⽆⽤的css

  > - tree-shaking（摇树优化）复习
  >
  >   - 概念：⼀个模块可能有多个⽅法，只有其中的某个⽅法使⽤到了，则整个⽂件都会被打到bundle⾥⾯去，tree-shaking就是只要⽤到的⽅法打到bundle，没⽤到的⽅法会在uglify阶段被擦除掉
  >   - 使⽤：webpack默认⽀持。在.babelrc⾥设置modules:false即可  mode**为**production的情况下默认开启
  >   - 要求：必须是**es6**语法，**cjs**⽅式不⽀持
  >
  > - ⽆⽤的CSS如何删除掉？
  >
  >   - PurifyCSS:遍历代码，识别已经⽤到的CSS class
  >
  >   - uncss：HTML需要通过jsdom加载，所有的样式通过PostCSS解析，通过document.querySelector来识别在html⽂件⾥不存在的选择器
  >
  > - 在webpack中如何使⽤PurifyCSS？
  >
  >   - 使⽤**purgecss-webpack-plugin**
  >
  >   - 和**mini-css-extract-plugin**配合使⽤
  >
  >     ```javascript
  >     new PurgecssPlugin({
  >     	paths: glob.sync(`${PATHS.src}/**/*`, { nodir: true })
  >     })
  >     ```
  >
  >     

- 动态polyfill服务

  > - 构建体积优化：动态polyfill
  >
  >   ![image-20200917152309313](/Users/banggan/Library/Application Support/typora-user-images/image-20200917152309313.png)
  >
  > - polyfill service原理
  >
  >   识别user agent，下发不同的polyfill（polyfill.io）
  >
  > - 如何使⽤动态polyfill service
  >
  >   - polyfill.io官⽅提供的服务
  >
  >   <script src="https://cdn.polyfill.io/v2/polyfill.min.js"></script>
  >  - 基于官⽅⾃建polyfill服务
  > 
  >```javascript
  >   //huayang.qq.com/polyfill_service/v2/polyfill.min.js?unknown=polyfill&features=Promise,Map,Set
  >   ```
  
- 体积优化策略总结

  - Scope hoisting
  - Tree-shaking 
  - 公共资源分离
  - 图片压缩
  - 动态polypill

#### 通过源码掌握webpack打包原理

- webpack启动过程分析

  >- 开始：从webpack命令⾏说起
  >
  >  - 通过npm scripts运⾏webpack
  >    - 开发环境：npm run dev
  >    - ⽣产环境：npm run build
  >
  >  - 通过webpack直接运⾏:     webpack entry.js bundle.js
  >
  >- 查找webpack⼊⼝⽂件
  >
  >  在命令⾏运⾏以上命令后，npm会让命令⾏⼯具进⼊node_modules/.bin⽬录查找是否存在webpack.sh或者webpack.cmd⽂件，如果存在就执⾏，不存在就抛出错误。
  >
  >  实际的⼊⼝⽂件：node_modules/webpack/bin/webpack.js
  >
  >- 分析webpack的⼊⼝⽂件：webpack.js
  >
  >  ```javascript
  >  process.exitCode = 0; //1.正常执⾏返回
  >  const runCommand = (command,args) => {...}; //2.运⾏某个命令
  >  const isInstalled = packageName => {...}; //3.判断某个包是否安装
  >  const CLIs = [...]; //4.webpack可⽤的cli：webpack-cli和webpack command
  >  const installedClis = CLIs.filter(cli => cli.installed); //5.判断是否两个cli是否安装了
  >  if(installedClis.length == 0){...}else if(installedClis.length ==
  >  1){...}else{...}
  >  //6.根据安装的数量进⾏处理
  >  ```
  >
  >  webpack启动后的结果：webpack最终找到webpack-cli（webpack command）这个npm包，并且执⾏CLI。

- webpack-cli源码阅读

  >- webpack-cli做的事情
  >
  >  - 引⼊yargs，对命令⾏进⾏定制
  >  - 分析命令⾏参数，对各个参数进⾏转换，组成编译配置项
  >  - 引⽤webpack，根据配置项进⾏编译和构建
  >
  >- 从NON_COMPLATION_CMD分析出不需要编译的命令
  >
  >  - webpack-cli处理不需要经过编译的命令
  >
  >    ```javascript
  >    const { NON_COMPILATION_ARGS } = require("./utils/constants");
  >    const NON_COMPILATION_CMD = process.argv.find(arg => { 
  >    	if (arg === "serve") { 
  >     		global.process.argv = global.process.argv.filter(a => a !=="serve"); 
  >    		process.argv = global.process.argv; 
  >     	}
  >    	return NON_COMPILATION_ARGS.find(a => a === arg); 
  >    });
  >    if (NON_COMPILATION_CMD) { 
  >    	return require("./utils/prompt-command")(NON_COMPILATION_CMD,...process.argv); 
  >    }
  >    ```
  >
  >- NON_COMPILATION_ARGS的内容
  >
  >  - webpack-cli  提供的不需要编译的命令
  >
  >    ```javascript
  >    const NON_COMPILATION_ARGS = [ 
  >    "init", //创建⼀份 webpack 配置⽂件
  >    "migrate", //进⾏ webpack 版本迁移
  >    "add", //往 webpack 配置⽂件中增加属性
  >    "remove", //往 webpack 配置⽂件中删除属性
  >    "serve", //运⾏ webpack-serve 
  >    "generate-loader", //⽣成 webpack loader 代码
  >    "generate-plugin", //⽣成 webpack plugin 代码
  >    "info" //返回与本地环境相关的⼀些信息
  >    ];
  >    ```
  >
  >- 命令⾏⼯具包yargs介绍:  提供命令和分组参数/ 动态⽣成help帮助信息
  >
  >- webpack-cli使⽤yargs分析
  >
  >  - 参数分组（config/config-args.js），将命令划分为9类：
  >    - Config **options**：配置相关参数（⽂件名称、运⾏环境等）
  >    -  Basic **options**：基础参数（entry设置、debug模式设置、watch监听设置、devtool设置）
  >    - Module **options**: 模块参数，给loader 设置扩展
  >    - Output **options**: 输出参数(输出路径、输出⽂件名称)
  >    - Advanced **options**: ⾼级⽤法(记录设置、缓存设置、监听频率、bail等)
  >    -  Resolving **options**: 解析参数(**alias** 和 解析的⽂件后缀设置)
  >    - Optimizing **options**: 优化参数
  >    -  Stats **options**: 统计参数
  >    - **options**: 通⽤参数(帮助命令、版本信息等)
  >
  >- webpack-cli执⾏的结果
  >
  >  webpack-**cli**对配置⽂件和命令⾏参数进⾏转换最终⽣成配置选项参数options
  >
  >  最终会根据配置参数实例化webpack对象，然后执⾏构建流程

- Tapable插件架构与Hooks设计

  >- webpack的本质
  >
  >  webpack可以将其理解是⼀种基于事件流的编程范例，⼀系列插件运⾏
  >
  >- 核⼼对象Compiler和Compilation继承Tapable
  >
  >  Tapable是⼀个类似于node.js的eventEmitter的库，主要是控制钩⼦函数的发布与订阅，控制着weboack的插件系统
  >
  >  Tapable库暴露了很多Hook(钩⼦)类，为插件提供挂载的钩⼦
  >
  >  ```javascript
  >  const { 
  >   SyncHook, //同步钩⼦
  >   SyncBailHook, //同步熔断钩⼦
  >   SyncWaterfallHook, //同步流⽔钩⼦,执行结果传递给下一个插件
  >   SyncLoopHook, //同步循环钩⼦
  >   AsyncParallelHook, //异步并发钩⼦
  >   AsyncParallelBailHook, //异步并发熔断钩⼦
  >   AsyncSeriesHook, //异步串⾏钩⼦
  >   AsyncSeriesBailHook, //异步串⾏熔断钩⼦
  >   AsyncSeriesWaterfallHook //异步串⾏流⽔钩⼦
  >  } = require("tapable");
  >  ```
  >
  >- Tapable hooks类型
  >
  >  - Hook : 所有钩⼦的后缀
  >
  >  - Waterfall : 同步⽅法，但是它会传值给下⼀个函数
  >
  >  - Bail : 熔断，当函数有任何返回值，就会在当前执⾏函数停⽌
  >
  >  - Loop: 监听函数返回true表示继续循环，返回undefined表示结束循环
  >
  >  - Sync : 同步⽅法
  >
  >  - AsyncSeries : 异步串⾏钩⼦
  >
  >  - AsyncParallel : 异步并⾏执⾏钩⼦
  >
  >- Tapable的使⽤：   new Hook新建钩⼦
  >
  >  Tapable暴露出来的都是类⽅法，new ⼀个类⽅法获得我们需要的钩⼦
  >
  >  class 接受数组参数options，⾮必传。类⽅法会根据传参，接受同样数量的参数。
  >
  >  const hook1= new SyncHook(['arg1','arg2','arg3']) 
  >
  >- Tapable的使⽤-钩⼦的绑定与执⾏
  >
  >  Tapable提供了同步和异步绑定钩⼦的⽅法，并且他们都有绑定事件和执⾏事件对应的⽅法。
  >
  >  - Async：
  >
  >    绑定：tapAsync/tapPromise/tap                  执⾏:   callAsync/promise 
  >
  >  - Sync
  >
  >    绑定: tap                                                  执⾏:  call
  >
  >- Tapable的使⽤-hook基本⽤法示例
  >
  >  ```javascript
  >  const hook1 = new SyncHook(["arg1", "arg2", "arg3"]);
  >  //绑定事件到webapck事件流
  >  hook1.tap('hook1', (arg1, arg2, arg3) => console.log(arg1, arg2,arg3)) //1,2,3 
  >  //执⾏绑定的事件
  >  hook1.call(1,2,3)
  >  ```
  >
  >- Tapable的使⽤:      实际例⼦演示
  >
  >  定义⼀个Car ⽅法，在内部hooks 上新建钩⼦。分别是同步钩⼦accelerate、 brake（ accelerate 接受⼀个参数）、异步钩⼦calculateRoutes
  >
  >  使⽤钩⼦对应的绑定和执⾏⽅法
  >
  >  calculateRoutes 使⽤tapPromise 可以返回⼀个promise 对象

- Tapable是如何和webpack关联起来的？

  >```javascript
  >if (Array.isArray(options)) { 
  > compiler = new MultiCompiler(options.map(options => webpack(options)));
  >} else if (typeof options === "object") {
  >//初始化webpack配置
  >options = new WebpackOptionsDefaulter().process(options); //初始化
  >compiler = new Compiler(options.context); //compiler对象
  >compiler.options = options; 
  >new NodeEnvironmentPlugin().apply(compiler); //webpack 插件：要用apply方法
  >if (options.plugins && Array.isArray(options.plugins)) {// options上是否有插件
  > for (const plugin of options.plugins) { 
  >		if (typeof plugin === "function") { 
  > 			plugin.call(compiler, compiler); 
  > 		}else{ 
  > 			plugin.apply(compiler); 
  > 		} 
  >	} 
  >}
  >compiler.hooks.environment.call();
  >compiler.hooks.afterEnvironment.call();
  >//将webpack内部插件进⾏注⼊
  >compiler.options = new WebpackOptionsApply().process(options,compiler);
  >}
  >//插件有apply方法 接收一个compiler参数
  >```
  >
  >- 模拟Compiler.js
  >
  >  ```javascript
  >  module.exports = class Compiler { 
  >  	constructor() { 
  >  		this.hooks = { //三个hook 两个同步 一个一步
  >   			accelerate: new SyncHook(['newspeed']), //加速
  >   			brake: new SyncHook(), //减速
  >   			calculateRoutes: new AsyncSeriesHook(["source","target", "routesList"]) 
  >  		} 
  >  	 }
  >   run(){ //入口 run方法 触发三个hook
  >  		this.accelerate(10) 
  >  		this.break() 
  >  		this.calculateRoutes('Async', 'hook', 'demo') 
  >   }
  >   accelerate(speed) { 
  >  		this.hooks.accelerate.call(speed); //同步执行
  >   }
  >  break() { 
  >  		this.hooks.brake.call(); //同步执行
  >  }
  >  calculateRoutes() {//一步执行
  >  		this.hooks.calculateRoutes.promise(...arguments).then(() =>
  >  				{}, err => { 
  >  				 console.error(err); 
  >   		}); 
  >   } 
  >  }
  >  ```
  >
  >- 模拟编写 插件my-plugin.js
  >
  >  ```javascript
  >  const Compiler = require('./Compiler') 
  >  class MyPlugin{ 
  >  	constructor() { 
  >   }
  >   apply(compiler){ //插件的apply方法 接收compiler对象
  >   		compiler.hooks.brake.tap("WarningLampPlugin", () => //监听compiler里面的hook
  >  			console.log('WarningLampPlugin'));
  >   			compiler.hooks.accelerate.tap("LoggerPlugin", newSpeed =>
  >  				console.log(`Accelerating to ${newSpeed}`));
  >   				compiler.hooks.calculateRoutes.tapPromise("calculateRoutes tapAsync", (source, target, routesList) => { 
  >  					return new Promise((resolve,reject)=>{ 
  >   						setTimeout(()=>{ 
  >  							console.log(`tapPromise to ${source} ${target} ${routesList}`) 
  >   							resolve(); 
  >  					 },1000) 
  >   				}); 
  >   		}); 
  >   } 
  >  }
  >  ```
  >
  >- 模拟插件执⾏
  >
  >  ```javascript
  >  const myPlugin = new MyPlugin(); 
  >  const options = { //模拟options
  >   plugins: [myPlugin] 
  >  }
  >  const compiler = new Compiler(); //穿件compiler对象
  >  for (const plugin of options.plugins) { 
  >  	if (typeof plugin === "function") { 
  >  		plugin.call(compiler, compiler); 
  >   	} else { 
  >  		plugin.apply(compiler); //调用插件的apply方法
  >   } 
  >  }
  >  compiler.run();//运行
  >  ```

- webpack流程篇：准备阶段

  > - webpack编译都按照下⾯的钩⼦调⽤顺序执⾏
  >
  >   ![image-20200918143303444](/Users/banggan/Library/Application Support/typora-user-images/image-20200918143303444.png)
  >
  >   - entry-option 初始化option
  >
  >   - run 开始编译
  >
  >   - make 从entry开始递归的分析依赖，对每个依赖模块进⾏build
  >
  >   - before-resolve 对模块位置进⾏解析
  >
  >   - build-module 开始构建某个模块
  >
  >   - normal-module-loader 将loader加载完成的module进⾏编译，⽣成AST树
  >
  >   - program  遍历AST，当遇到require等⼀些调⽤表达式时，收集依赖
  >
  >   - seal 所有依赖build完成，开始优化
  >
  >   - emit 输出到dist⽬录
  >
  > - compiler.js           beforerun-run-oncompiled -shouldEmit
  >
  >   -  compilation：compiler对象上有⼀个compilation的钩⼦
  >   -  thisCompilation：某些plugin内部独⽴的构建的流程，⾛的就是这个钩⼦
  >
  > - compilation.js
  >
  >   - compilation的作⽤：模块编译、构建和打包的过程
  >
  > - webpackOptionsApply
  >
  >   - 将所有的配置options参数转换成webpack内部插件（使⽤默认插件列表）
  >
  >   - 举例
  >
  >     \- output.library -> LibraryTemplatePlugin
  >
  >     \- externals-> ExternalsPlugin
  >
  >     \- devtool-> EvalDevtoolModulePlugin, SourceMapDevToolPlugin
  >
  >     \- AMDPlugin, CommonJsPlugin
  >
  >     \- RemoveEmptyChunksPlugin

- webpack流程篇：模块构建和chunk⽣成阶段

  > - Compiler hooks
  >
  >   流程相关：
  >
  >   - (**before**-)run
  >
  >   -  (**before**-/**after**-)compile。
  >
  >   - make
  >
  >   - (**after**-)emit
  >
  >   -  done
  >
  >   监听相关：
  >
  >   -  watch-run
  >
  >   - watch-close
  >
  > - Compilation
  >
  >   创建Compilation对象，Compiler调⽤Compilation⽣命周期⽅法
  >
  >   -  addEntry -> addModuleChain
  >
  >   -  finish(上报模块错误)
  >
  >   -  seal 优化 输出
  >
  > - ModuleFactory
  >
  >   NormalModuleFactory / ContextModuleFactory 继承ModuleFactory
  >
  >   NormalModuleFactory：module.export ={}.....
  >
  >   ContextModuleFactory: import/ require模块名：   路径
  >
  > - Module
  >
  >   - NormalModule ： 普通模块
  >
  >   - ContextModule ：./src/a ./src/b
  >
  >   - ExternalModule :module.exports = jQuery
  >
  >   - DelegatedModule :manifest
  >
  >   - MultiModule : entry:['a','b']
  >
  > - NormalModule
  >
  >   - Build: 
  >     - 使⽤loader-runner运⾏loaders
  >     - 通过Parser解析（内部是acorn） 解析出require的依赖
  >     - ParserPlugins添加依赖
  >
  > - Compilation hooks
  >
  >   - 模块相关：
  >
  >     - build-module: loader解析模块。parse解析loader的依赖，arserPlugins添加依赖
  >
  >     - failed-module
  >
  >     - succeed-module
  >
  >   - 资源⽣成相关：
  >
  >     - module**-**asset：
  >
  >     - chunk-asset
  >
  >   - 优化和seal相关：
  >
  >     - (after-)seal
  >
  >     - optimize
  >
  >     - optimize-modules(-basic/advanced)
  >
  >     - after-optimize-modules
  >
  >     - after-optimize-chunks
  >
  >     - after-optimize-tree
  >
  >     - optimize-chunk-modules(-basic/advanced)
  >
  >     -  after-optimize-chunk-modules
  >
  >     -  optimize-**module**/**chunk**-**order**
  >
  >     - before-**module**/**chunk**-**ids**
  >
  >     - (after-)optimize-**module**/**chunk**-**ids**
  >
  >     -  before/after-hash
  >
  > - Chunk⽣成算法
  >
  >   1. webpack先将entey中对应的module都⽣成⼀个新的chunk
  >
  >   2. 遍历module的依赖列表，将依赖的module也加⼊到chunk中 
  >
  >   3. 如果⼀个依赖module是动态引⼊的模块，那么就会根据这个module创建⼀个新的chunk，继续遍历依赖
  >
  >   4. 重复上⾯的过程，直⾄得到所有的chunks

- webpack流程篇：⽂件⽣成

  >```javascript
  >this.hooks.emit.callAsync(compilation, err => {
  >	if(err) creturn callback(err);
  >	outputPath = compilation.getPath(this.outputPath);
  >	this.outputFileSystem.mkdirp(outputPath, emitFiles);
  >});
  >```

- 动⼿编写⼀个简易的webpack

  >- 模块化：增强代码可读性和维护性
  >
  >  1.传统的⽹⻚开发转换成web apps开发;  2.代码复杂度在逐步增⾼;  3. 分离的js⽂件/模块，便于后续代码的维护. 4.部署时希望把代码优化成⼏个**http**请求
  >
  >- 常⻅的⼏种模块化⽅式
  >
  >  ```javascript
  >  //ES module:(静态分析) 
  >  import * as largeNumber from 'large-number'
  >  largeNumber.add('999','1');
  >  //CJS:（动态，运⾏时）nodejs默认使用规范，可以在运行的时候动态require
  >  const largeNumbers = require('large-number');
  >  largeNumber.add('999','1');
  >  //AMD:浏览器端
  >  require(['large-number'],function(large-number){
  >   largeNumber.add('999','1')
  >  })
  >  ```
  >
  >- AST基础知识
  >
  >  >抽象语法树（abstract syntax tree 或者缩写为AST），或者语法树（syntax tree），是 源代码的抽象语法结构的树状表现形式，这⾥特指编程语⾔的源代码。树上的每个节点都 表示源代码中的⼀种结构。
  >  >
  >  >在线demo: https://esprima.org/demo/parse.html
  >
  >  使用场景：1.模板引擎            2.编程语⾔转换
  >
  >- webpack模块机制
  >
  >  - 打包出来的是⼀个IIFE (匿名闭包) 
  >
  >  - modules 是⼀个数组，每⼀项是⼀个模块初始化函数
  >
  >  - __webpack_require ⽤来加载模块，返回 **module**.**exports**
  >
  >  - 通过WEBPACK_REQUIRE_METHOD(0) 启动程序
  >
  >- 简易webpack要求
  >
  >  - 可以将es6语法转换成es5语法
  >
  >    - 通过**babylon**⽣成**AST**
  >
  >    - 通过**babel-core**将**AST**重新⽣成源码
  >
  >  - 可以分析模块之间的依赖关系
  >    - 通过**babel-traverse**的ImportDeclaration⽅法获取依赖属性
  >  - ⽣成的**js**⽂件可以再浏览器运⾏

- loader的链式调⽤与执⾏顺序

  >- ⼀个最简单的loader代码结构
  >
  >  定义：loader只是⼀个导出为函数的JavaScript模块
  >
  >  ```javascript
  >  module.exports = function(source){
  >  	return  source;
  >  }
  >  ```
  >
  >- 多Loader时的执⾏顺序:  串行执行，顺序从到前
  >
  >- 函数组合的两种情况
  >
  >  - Unix中的pipline (从左到右)
  >  - Compose(webpack采⽤这种,从右到左)
  >
  >  `compost = (f,g) => (...args) => f(g(..args))*;*`

- 使⽤loader-runner⾼效进⾏loader的调试

  >- loader-runner介绍
  >
  >  - 定义：loader-runner允许你在不安装webpack的情况下运⾏loaders 
  >
  >  - 作⽤：1.作为webpack的依赖，webpack中使⽤它执⾏loader / 2.进⾏loader的开发和调试
  >
  >- loader-runner使⽤
  >
  >  ```javascript
  >  import { runLoaders } from 'loader-runner';
  >  runLoaders({
  >  	// String:资源的绝对路径（可以增加查询字符串）
  >   	resource:'/abs/path/to/file.txt?query',
  >  	// String[]:loader的绝对路径（可以增加查询字符串）
  >   	loaders:['/abs/path/to/loader.js?query'],
  >  	// 基础上下⽂之外的额外loader上下⽂
  >   	context:{minimize:true},
  >  	// 读取资源的函数
  >   	readResource:fs.readFile.bind(fs)
  >  },function(err,result) => {
  >  	//err:Error?
  >  	//result.result:Buffer | String
  >  })
  >  ```
  >
  >- 开发⼀个raw-loader
  >
  >  ```javascript
  >  // src/raw-loader.js  文件转换为string
  >  module.exports = function(source){
  >  const json = JSON.stringify(source)
  >  //为了安全起⻅，ES6模板字符串的问题
  >   .replace(/\u2028/g,'\\u2028')
  >   .replace(/\u2029/g,'\\u2029');
  >  return `export default ${json}`;
  >  };
  >  // src/demo.txt
  >  foobar
  >  // run-loader.js
  >  const path = require("path"); 
  >  const { runLoaders } = require("loader-runner"); 
  >  runLoaders( 
  >   { 
  >   	resource: "./demo.txt", 
  >   	loaders: [path.resolve(__dirname, "./loaders/raw-loader")],
  >   	readResource: fs.readFile.bind(fs), 
  >   },(err, result) => (
  >   	err ? console.error(err) : console.log(result)
  >   ) 
  >  );
  >  ```

- 更复杂的loader开发

  >- loader的参数传递获取
  >
  >  ```javascript
  >  // 通过loader-utils的getOptions⽅法获取
  >  const loaderUtils = require('loader-utils');
  >  module.exports = function(content){
  >  	const { name } = loaderUtils.getOptions(this) 
  >  }
  >  ```
  >
  >- loader异常处理
  >
  >  - ⽅式⼀：
  >
  >    loader内直接通过**throw**抛出
  >
  >  - ⽅式⼆：
  >
  >    通过**this**.callback传递错误
  >
  >    ```javascript\
  >    this.callback(
  >    	err:Error| null,
  >    	content:string| Buffer,
  >    	sourceMap?:SourceMap,
  >    	meta?:any
  >    )
  >    ```
  >
  >- Loader异步处理
  >
  >  通过this.async来返回⼀个异步函数：   第⼀个参数是error，第⼆个参数是处理的结果
  >
  >  ```javascript
  >  module.exports = function(input){
  >  	const callback = this.async();
  >  	// no callback -> **return**synchronous result
  >  	// **if**(callback)**{...}**
  >  	callback(null,input+input);
  >  }
  >  ```
  >
  >- loader使⽤缓存
  >
  >  在webpack中默认开启loader缓存：      可以使⽤this.cacheable(false)关掉缓存
  >
  >  缓存条件：loader的结果在相同的输⼊下有确定的输出        有依赖的loader⽆法使⽤缓存
  >
  >- loader文件输出
  >
  >  通过this.emitFile进⾏⽂件写⼊
  >
  >  ```javascript
  >  const loaderUtils = require("loader-utils");
  >  module.exports = function(content) { 
  >  	const url= loaderUtils.interpolateName(this, "[hash].[ext]", {content}); 
  >  	this.emitFile(url, content); 
  >  	constpath = `__webpack_public_path__ +${JSON.stringify(url)};`;
  >  	return `export default ${path}`; 
  >  };
  >  ```

- 实战开发⼀个⾃动合成雪碧图的loader

  >- ⽀持的语法
  >
  >  background:url('a.png?_sprite');
  >
  >  background:url('b.png?_sprite');
  >
  >  合成：background:url('sprite.png');
  >
  >- 准备知识：如何将两张图⽚合成⼀张图⽚？
  >
  >  ```javascript
  >  //使⽤ spritesmith ()
  >  const sprites = ['./images/1.jpg', './images/2.jpg'];
  >  Spritesmith.run({src: sprites}, function handleResult (err, result) {
  >   result.image; 
  >   result.coordinates; 
  >   result.properties; 
  >  });
  >  ```

- 插件基本结构介绍

  - 插件的运行环境

    插件没有像loader那样的独⽴环境，只能在webpack⾥运⾏

  - 插件的基本结构

    ```javascript
    class MyPlugin { // 插件名称
     apply(compiler) { // 插件上的apply⽅法
     	compiler.hooks.done.tap(' My Plugin', (  // 插件的hooks
     		stats /* stats is passed as argument when done hook is tapped. */
    	 ) => {
     	console.log('Hello World!');  // 插件处理逻辑
     	}); 
     } 
    }
    module.exports = MyPlugin;
    plugins:[new MyPlugin()]；  //插件使⽤：
    ```

  - 搭建插件的运行环境

    ```javascript
    const DemoPlugin = require("./plugins/demo-plugin.js"); 
    const PATHS = { 
     lib: path.join(__dirname, "app", "shake.js"), 
     build: path.join(__dirname, "build"), 
    };
    module.exports = { 
     entry: { lib: PATHS.lib, },
     output: { path: PATHS.build, filename: "[name].js", },
     plugins: [new DemoPlugin()], 
    };
    ```

  - 开发一个简单的插件

    ```javascript
    //src/demo-plugin.js 
    module.exports = class DemoPlugin { 
    	constructor(options) { 
    		this.options = options; 
    	}
     apply() { 
    	console.log("apply", this.options); 
     } 
    };
    //加⼊到 webpack 配置中
    module.exports = { 
     ... 
     plugins: [new DemoPlugin({ name: "demo" })] 
    };
    ```

- 更复杂的插件开发

  - 如何获取传递的参数

    ```javascript
    //通过插件的构造函数进⾏获取
    module.exports = class MyPlugin {
    	constructor(options){
    		this.options = options;
     	}
     apply(){
    	console.log("apply",this.options);
     }
    }
    ```

  - 插件的错误处理

    - 参数校验阶段可以直接 throw 的⽅式抛出. `throw newError(“Error Message”)`

    - 通过compilation 对象的 warnings 和 errors 接收

      `compilation.warnings.push("warning"); `

      `compilation.errors.push("error");`

  - 通过Compilation 进⾏⽂件写⼊

    ```javascript
    //Compilation 上的 assets 可以⽤于⽂件写⼊
     //可以将 zip 资源包设置到 compilation.assets 对象上
    //⽂件写⼊需要使⽤ webpack-sources  (https://www.npmjs.com/package/webpack-sources)
    const { RawSource } = require("webpack-sources"); 
    module.exports = class DemoPlugin { 
    	constructor(options) { 
    		this.options = options; 
      }
     apply(compiler) { 
     const { name } = this.options; 
     compiler.plugin("emit", (compilation, cb) => {
     	compilation.assets[name] = new RawSource("demo"); 
    	 cb(); 
     }); 
     } 
    };
    ```

  - 插件扩展：编写插件的插件

    ```javascript
    插件⾃身也可以通过暴露 hooks 的⽅式进⾏⾃身扩展，以 html- webpack-plugin 为例：
    ·html-webpack-plugin-alter-chunks (Sync) ·html-webpack-plugin-before-html-generation (Async)
    ·html-webpack-plugin-alter-asset-tags (Async)
    ·html-webpack-plugin-after-html-processing (Async)
    ·html-webpack-plugin-after-emit (Async)
    ```

- 实战开发⼀个压缩构建资源为zip包的插件

  - 要求

    - ⽣成的**zip**包⽂件名称可以通过插件传⼊

    - 需要使⽤compiler对象上的特定hooks进⾏资源的⽣成

  - 准备知识：Node.js⾥⾯将⽂件压缩为zip包

    ```javascript
    //使⽤ jszip (https://www.npmjs.com/package/jszip)
    var zip = new JSZip(); 
    zip.file("Hello.txt", "Hello World\n"); //添加文件
    var img = zip.folder("images"); 
    img.file("smile.gif", imgData, {base64: true});
    zip.generateAsync({type:"blob"}).then(function(content) { 
    // see FileSaver.js 
     saveAs(content, "example.zip"); 
    });
    ```

  - 复习：Compiler 上负责⽂件⽣成的hooks

    Hooks 是emit，是⼀个异步的hook (AsyncSeriesHook)

    emit ⽣成⽂件阶段，读取的是compilation.assets 对象的值

    - 可以将zip 资源包设置到compilation.assets 对象上

- 商城技术栈选型和整体架构