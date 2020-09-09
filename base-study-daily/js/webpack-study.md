####  webpack与构建发展史
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
 零配置：entry和output
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
⼊。作⽤于整个构建过程
> 1. CommonsChunkPlugin：将chunks相同的模块代码提取成公共js
> 2. CleanWebpackPlugin：清理构建⽬录
> 3. ExtractTextWebpackPlugin：将css从bundle⽂件⾥提取成⼀个独⽴的css⽂件
> 4. CopyWebpackPlugin：将⽂件或者⽂件夹拷⻉到构建的输出⽬录
> 5. HtmlWebpackPlugin：创建html⽂件去承载输出的bundle
> 6. UglifyjsWebpackPlugin：压缩js
> 7. ZipWebpackPlugin：将打包出的资源⽣成⼀个zip包
- mode
> mode⽤于指定当前的构建环境是：production（默认）/development/none
> 设置mode触发webpack内置的函数
1.mode = development：开启NameChuncksPlugin 和NameModulesPlugin
2.mode = production：开启FlagDependencyUsagePlugin，FlagIncludedChunksPlugin, ModuleConcatenationPlugin, NoEmitOnErrorsPlugin, OccurrenceOrderPlugin, SideEffectsFlagPlugin 和 UglifyJsPlugin
3.mode = none:不开启任何优化选项
- 解析es6和React jsx
>解析ES6:使⽤babel-loader
>babel的配置⽂件：.babelrc 
babel plugins:⼀个插件对应⼀个功能
babel preset:⼀个集合 @babel/preset-env 
安装 npm i @babel/core @babel/preset-env babel-loader -D    （-D:--save dev的简称）

> 解析React JSX :增加React的babel preset配置:使⽤@babel/preset-react
- 解析css、less和sass
>css-loader：⽤于加载.css⽂件，并且转换成commonjs对象
>style-loader：⽤于将样式通过<style>标签插⼊到head中
>less-loader：⽤于将less转换为css
- 解析图⽚和字体
> file-loader：⽤于处理⽂件
> url-loader：⽤于处理图⽚和字体 （可以设置较⼩资源⾃动base64）
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
> ​	**Contenthash**：根据⽂件内容定义**hash**，⽂件内容不变，则**contenthash**不变（⼀般针对**css**）
>
> 如何设置⽂件指纹？（主要⽤于发布环境）
>
> ​	设置**output**的**filename**，使⽤[chunkhash].js (js⽂件)
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
>
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
>#####source map类型
>
>可以根据前面的关键字排列组合得到。
>
>#####本地开发时使用 sourcemap 进行代码调试
>
>在webpack.dev.js devtool 中加入 sourcemap

- 提取⻚⾯公共资源

>- 基础库分离
>
>思路：将react/react-dom/vue基础包通过cdn引⼊，不打⼊**bundle**中
>
>⽅法：使⽤html-webpack-externals-plugin
>
>- 利⽤SplitChunksPlugin进⾏公共脚本分离：webpack4内置，替代CommonsChunkPlugin插件
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
>
>

- demo

```javascript
//babelrc 
{
    "presets":[
        "@babel/preset-env"
        "@babel/preset-react"//解析react的jsx语法
    ]
}
//webpack.config.js
const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const HtmlWebpackPlugin= require('html-webpack-plugin')
const HTMLInlineCSSWebpackPlugin = require("html-inline-css-webpack-plugin");
module.exports ={
  entry:{
  	index:'./src/index.js',
  	search:'./src/search.js'
	},
	output:{
  	path:path.join(_dirname,'dist'),
  	filename:'[name]_[chunkhash:8].js' //文件指纹
	}
	module:{
    rules:[
        {// js jsx解析 
            test:/.js$/,
            use:'babel-loader' //babel编译es6
        },
        {//css less 解析
            test:/.css$/,
            //按照顺序写
            use:[
                //'style-loader', 和MiniCssExtractPlugin插件冲突， 需要删掉style-loader
                MiniCssExtractPlugin.loader,//生成一个独立的css文件
                'css-loader',
                'less-loader',
                 {
            			loader: 'postcss-loader',   // css3补齐：autoprefixer和postcss-loader
            			options: {
              			plugins: () => {
                      // 指定autoprefixer所需要兼容的浏览器的版本 最近两个版本 使用人数
                			require('autoprefixer')({ overrideBrowserslist: ["last 2 version", ">1%", "IOS 7"] })
                    }
            			}
          			 }，
              	{
            		loader: 'px2rem-loader',    //css px---rem 转换 
            		options: {
              		remUnit: 75, //rem相对于px转换单位，1rem=75px，这个比较适合750的设计稿，750个像素对应着10个rem。
              		remPrecision: 8 // px转成rem，后面小数点的位数。
            		}
          		}
            ]
        },
        {//图片解析
            test:/.(png|svg|jpg|gif|jpeg)$/,
            //use:'url-loader' //可以设置较⼩资源⾃动base64
         	 	use:'file-loader'
            opt:{
                limit:10240//图片大小 小于10k,转为base64引入
                name:'[name]_[hash:8].[ext]'
            }
        },
        {//字体解析
            test:/.(woff|woff2|eot|ttf|otf)$/,
      			 name:'[name]_[hash:8].[ext]',
            use:'file-loader'
        }
    ]
	}
	plugins:[
  	new MiniCssExtractPlugin({
      filename:'[name]_[contenthash:8].css' //css 压缩  contenthash
    }),
    new HTMLInlineCSSWebpackPlugin({}) // css资源内联
    new OptimizeCssAssetsPlugin({
      assetNameRegExp:/\.css$/g,
      cssProcessor: require('cssnano')
    }),
    new HtmlWebpackPlugin({//一个html对应一个插件
      template: path.join(_dirname,'src/search.html'),
      filename: 'search.html',
      chunks:['search'],
      inject:true,
      minify:{
        html5:true,
        minifyJS:true,
        minifyCSS:true
        removeComments:false
      }
    }),
     new HtmlWebpackPlugin({
      template: path.join(_dirname,'src/index.html'),
      filename: 'index.html',
      chunks:['index'],
      inject:true,
      minify:{
        html5:true,
        minifyJS:true,
        minifyCSS:true
        removeComments:false
      }
    })
	]
}
```



#### 编写可维护的webpack构建配置
#### webpack构建速度、体积优化策略
#### 通过源码掌握webpack打包原理