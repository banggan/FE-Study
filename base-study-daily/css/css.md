##### 盒模型

- 是什么？
> 网页设计中css技术所使用的一种思维模型
- 为什么会出现？
>当年微软的IE浏览器占据超过80%市场份额的时候，想自己独立制定一套浏览器标准，其就包括IE的盒模型，但是有很多公司不同意IE的做法，他们遵循的是W3C的标准来定制浏览器，也就造成了在浏览器不同的CSS盒模型，但是仍有很多老网站采用的是老IE的标准(怪异模式)，因此很多浏览器保留了IE的怪异模式。
- 盒模型的两种标准？

  - 标准模型： 元素的宽高 = 内容content的宽高
  - IE模型： 元素的宽高 = 内容content宽高+padding+margin

- 组成

  > content+padding+margin+border

- css3标准和怪异模式的切换？

  > Box-sizing: content-box指定为标准模型；border-box:才采用IE模型，inherit 继承父元素 `box-sizing` 属性的值；
##### IFC和BFC(FFC)

- BFC：`块级格式化上下文（block formatting context）`

  - 布局规则：
    - 内部的box会在垂直方向一个一个的放置
    - box在垂直方向的距离由margin决定，属于同一个bFC的两个相邻box的margin产生重叠
    - 每个box的margin-left,与包含块的左边（contain box left）接触，存在浮动也是如此，除非这个元素自己也是一个新的BFC 
    - BFC的区域不与float box重叠
    - BFC就是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面的元素。反之也如此
    - 计算BFC的高度，浮动元素也参与计算
  - 使用场景
    - 外边距的折叠
    - 清除浮动

  - 触发条件
    - float的属性不为none;
    - position为absolute或者fixed；
    - display = inline block\flex\table-cell\table-caption;
    - overflow 不为visible

- IFC：`行内格式化上下文（inline formatting context ）`

  - IFC的形成条件非常简单，块级元素中仅包含内联级别元素，需要注意的是当IFC中有块级元素插入时，会产生两个匿名块将父元素分割开来，产生两个IFC。
  
  - 布局规则：
    
    - 子元素水平方向横向排列，并且垂直方向起点为元素顶部。
    - 子元素只会计算横向样式空间，【padding、border、margin】，垂直方向样式空间不会被计算，【padding、border、margin】。
    - 在垂直方向上，子元素会以不同形式来对齐（vertical-align）
    - 能把在一行上的框都完全包含进去的一个矩形区域，被称为该行的行框（line box）。行框的宽度是由包含块（containing box）和与其中的浮动来决定。
    - IFC中的“line box”一般左右边贴紧其包含块，但float元素会优先排列。
    - IFC中的“line box”高度由 CSS 行高计算规则来确定，同个IFC下的多个line box高度可能会不同。
    - 当 inline-level boxes的总宽度少于包含它们的line box时，其水平渲染规则由 text-align 属性值来决定。
    - 当一个“inline box”超过父元素的宽度时，它会被分割成多个boxes，这些 boxes 分布在多个“line box”中。如果子元素未设置强制换行的情况下，“inline box”将不可被分割，将会溢出父元素。
    
  - 使用场景
  
    >水平居中：当一个块要在环境中水平居中时，设置其为inline-block则会在外层产生IFC，通过text-align则可以使其水平居中。
    >
    >垂直居中：创建一个IFC，用其中一个元素撑开父元素的高度，然后设置其vertical-align:middle，其他行内元素则可以在此父元素下垂直居中。
  
- FFC:`(Flex formatting contexts)，弹性盒模型`。

  - 生成条件：父级元素设置`display:flex`或者`display:inline-flex`
  - 渲染规则
    - 生成FFC后，其子元素的float、clear和vertical-align属性将失效
  - 使用场景
    - 自动撑开页面高度，底栏总是出现在页面的底部
    - 经典的圣杯布局

##### margin塌陷及合并问题（都只对垂直方向有效）

- margin 塌陷问题：

  - 描述：这个问题是一个经典的浏览器内核问题。具体表现是当两个元素的margin紧挨着，中间没有border或者padding
    margin直接接触嵌套到一起时，外层盒模型的margin-top取两个元素中margin-top较大的值。因为在正常的情况下内层元素是相对于外层元素进行移动，但是这时内层元素却相对于整个文档进行移动，好像外层元素没有“棚顶”一样，因此叫margin塌陷问题。

  - 父子嵌套元素在垂直方向的margin,父子元素是结合在一起的,他们两个的margin会取其中最大的值;父级元素应该相对浏览器进行定位,子级相对父级定位.但由于margin的塌陷,父级相对浏览器定位.而子级没有相对父级定位,子级相对父级,就像坍塌了一样

  - 解决方法

    1. 给父级设置边框或内边距,这种方法虽然能够解决问题，但是在日常开发中我们不使用它，因为他在外观上对元素进行了改变。

    2. 触发BFC：
      
       - 根元素`html`；
       
       - float的属性不为none;
       - position为absolute或者fixed；
       - display = inline block\flex\table-cell\teble-caption;
       - overflow 不为visible

- margin 合并问题：

  - 描述：两个兄弟结构的元素在垂直方向上的margin是合并,具体表现为两个元素并列时，两者相隔的外边距取的是两者所设置margin的最大值。
  - 解决方法：我们仍然用bfc来解决。可以给其中一个元素包起来，在外层元素中设置bfc渲染规则。此时这个元素的渲染规则就改变了，就能够解决这个问题。

##### float

- 浮动模型

  - 块状元素这么霸道都是独占一行，如果现在我们想让两个块状元素并排显示，怎么办呢？不要着急，设置元素浮动就可以实现这一愿望。
  - 任何元素在默认情况下是不能浮动的，但可以通过float属性将元素定义为浮动，如div、p、table、img等元素都可以被定义为浮动。

- 清除浮动

  - 浮动元素的后面同级标签加：clear:both属性 float:left right 

  - 触发BFC

  - 推荐使用

    ```css
    //推荐使用：：after伪类：伪类原理：相当于在父元素里添加一个子元素（默认内联元素），用来清除容器内的浮动元素。
    .clearfix:after{/*伪元素是行内元素 正常浏览器清除浮动方法*/
            content: "";
            display: block;
            clear:both;
       			height: 0;
            visibility: hidden;
    }
    .clearfix{
            *zoom: 1;/*ie6清除浮动的方式 *号只有IE6-IE7执行，其他浏览器不执行*/
        }
    
    //缺点：ie6-7不支持伪元素：after，使用zoom:1触发hasLayout.
    设置元素浮动后，display 为block
    ```
  ```
  
  ```
  
- 清除浮动的原理

  >`clear:both`:`clear`是CSS中的定位属性，规定元素的哪一侧不允许其他浮动元素。那么`clear:both`就是规定在左右两侧均不允许浮动元素。
  >
  >`clear`属性只能在块级元素上其作用，这就是清除浮动样式中`display:block`的作用。
  >
  >另外`visibility: hidden;height: 0;`只要`content`的值为空。写不写都无所谓。

##### flex
- 描述

> 2009年，W3C 提出了一种新的方案----Flex 布局，可以简便、完整、响应式地实现各种页面布局。目前，它已经得到了所有浏览器的支持，这意味着，现在就能很安全地使用这项功能。Flex 布局将成为未来布局的首选方案。Flex 是 Flexible Box 的缩写，意为"弹性布局"，用来为盒状模型提供最大的灵活。任何一个容器都可以指定为 Flex 布局.

  - 容器属性
    - flex-direction:   row | row-reverse | column | column-reverse
    
    - flex-wrap:   nowrap | wrap | wrap-reverse;
    
    - Flex-flow: 是 flex-direction 和 flex-wrap 的简写
    
    - justify-content:   flex-start | flex-end | center | space-between | space-around;
    
    - align-items:       flex-start | flex-end | center | baseline | stretch;
    
    - align-content:    flex-start | flex-end | center | space-between | space-around | stretch;
    
    - flex: 1; === flex: 1 1 任意数字+任意长度单位;   initial (0 1 auto)和 none (0 0 auto)
    
      > auto 为表示项目本身的大小, 如果设置为 auto, 那么这三个盒子就会按照自己内容的多少来等比例的放大和缩小, 所以出现了上图中三个盒子不一样大的情况
      >
      > 那我们如果随便设置一个其他带有长度单位的数字呢, 那么他就不会按项目本身来计算, 所以它不关心内容, 只是把空间等比收缩和放大
      >
      > flex其他两个完整的值：initial (0 1 auto)和 none (0 0 auto)
      >
      > - 第一个参数表示: flex-grow 定义项目的放大比例，默认为0，即如果存在剩余空间，也不放大
      > - 第二个参数表示: flex-shrink 定义了项目的缩小比例，默认为1，即如果空间不足，该项目将缩小
      > - 第三个参数表示: flex-basis 给上面两个属性分配多余空间之前, 计算项目是否有多余空间, 默认值为 auto, 即项目本身的大小

##### CSS浏览器兼容性的4个解决方案

  - 浏览器css样式初始化

    >因为浏览器的兼容问题，不同浏览器对标签的默认值是不同的，如果没有对浏览器的`CSS`初始化，会造成相同页面在不同浏览器的显示存在差异。

  - 浏览器私有属性：

    > 我们经常会在某个CSS的属性前添加一些前缀，比如-webkit- ，-moz- ，-ms-，这些就是浏览器的私有属性。
    >
    > -webkit- (谷歌, Safari, 新版Opera浏览器, 以及几乎所有iOS系统中的浏览器(包括iOS 系统中的火狐浏览器); 简单的说，所有基于WebKit 内核的浏览器)
    >
    > -moz- (火狐浏览器)
    >
    > -o- (旧版Opera浏览器)
    >
    > -ms- (IE浏览器 和 Edge浏览器)
    >
    > -ms 代表IE浏览器私有属性
    >
    > -webkit代表chrome、safari私有属性
    >
    > -o代表opera私有属性
    >
    > 对于私有属性的顺序要注意，把标准写法放到最后，兼容性写法放到前面

  - Css hack语法

    > 有时我们需要针对不同的浏览器或不同版本写特定的CSS样式，这种针对不同的浏览器/不同版本写相应的CSS code的过程，叫做CSS hack!
    >
    > 例如IE：
    >
    > ​			[if <keywords>? IE <version>?]
    >
    > ​				代码块，可以是html，css，js
    >
    > ​          [endif]

  - 自动化插件

    > Autoprefixer是一款自动管理浏览器前缀的插件，它可以解析CSS文件并且添加浏览器前缀到CSS内容里，使用Can I Use（caniuse网站）的数据来决定哪些前缀是需要的。
    >
    > 目前webpack、gulp、grunt都有相应的插件，如果还没有使用，那就赶紧应用到我们的项目中吧，别再让CSS兼容性浪费你的时间！
    
- 怎么让chrome支持小于12px的字体？

  ```css
  .shrink {
      -webkit-transform: scale(0.8);
      -o-transform: scale(1);
      display: inilne-block;
  }
  ```

- 文字在水平或者垂直方向上重叠的属性

  >- 垂直方向： `line-height`；
  >- 水平方向： `letter-spacing`；
  >
  >**注意**： `letter-spacing`还可以用来消除`inline-block`元素间的换行符空格间隙等问题。

##### css优化？

>多个`css`可合并，并尽量减少`http`请求
>
>属性值为0时，不加单位
>
>将`css`文件放在页面最上面
>
>避免后代选择符，过度约束和链式选择符
>
>使用紧凑的语法
>
>避免不必要的重复
>
>使用语义化命名，便于维护
>
>尽量少的使用`!impotrant`，可以选择其他选择器
>
>精简规则，尽可能合并不同类的重复规则
>
>遵守盒子模型规则

##### 重排和重绘

>- 回流（重排），`reflow`:当`render tree`中的一部分（或全部）因为元素的规模尺寸，布局，隐藏等改变时而需要重新构建；
>
>- 重绘`（repaint`）:当`render tree`中的一些元素需要更新属性，而这些属性只影响元素的外观，风格，而不会影响布局时，称其为**重绘**，例如颜色改变等。
>
>  **每个页面至少需要引发一次重排+重绘，而且重排（回流）一定会引发重绘**
>
>  触发重排（回流）的条件：
>
>  - 增加或者删除可见的`dom`元素；
>  - 元素的位置发生了改变；
>  - 元素的尺寸发生了改变，例如边距，宽高等几何属性改变；
>  - 内容改变，例如图片大小，字体大小改变等；
>  - 页面渲染初始化；
>  - 浏览器窗口尺寸改变，例如`resize`事件发生时等；

##### 什么是critical CSS？

>`Critical CSS`是一种提取首屏中 `CSS`的技术，以便尽快将内容呈现给用户。这是快速加载网页首屏的好方法。
>
>核心思路：
>
>（1）、抽取出首页的`CSS`；
>
>（2）、用行内css样式，加载这部分的`css(critical CSS)`;
>
>（3）、等到页面加载完之后，再加载整个`css`，会有一部分`css`与`critical css`重叠；

##### position

- 文档流

  >简单说就是元素按照其在 HTML 中的位置顺序决定排布的过程。HTML的布局机制就是用文档流模型的，即块元素（block）独占一行，内联元素（inline），不独占一行。
  >
  >一般使用margin是用来隔开元素与元素的间距；padding是用来隔开元素与内容的间隔。margin用于布局分开元素使元素与元素互不相干；padding用于元素与内容之间的间隔，让内容（文字）与（包裹）元素之间有一段“距离”。只要不是float和绝对定位方式布局的，都在文档流里面。float和绝对定位方式会脱离文档流。

- 定位

  - static：默认值。没有定位，元素出现在正常的流中（忽略 `top`, `bottom`, `left`, `right`、`z-index` 声明）。
  - relative： 生成相对定位的元素，定位原点是元素本身所在的位置；
  - absolute：定位原点是离自己这一级元素最近的一级`position`设置为`absolute`或者`relative`的父元素的左上角为原点的

  - fixed：生成绝对定位的元素，相对于浏览器窗口进行定位

  - Inherit: 规定从父元素继承 `position` 属性的值。

  - Z-index

    > z-index指定了一个元素及其子元素的 z-order，元素之间有重叠的时候，z-index可以决定让哪一个元素在上方。通常来说 z-index 较大的元素会覆盖较小的一个。
    >
    > 仅对定位的元素有效。 元素之间重叠默认的顺序是后面的元素会盖住前面的元素。如果设置了z-index可以改变这个顺序。但只对同级的元素有效。父元素永远在子元素后面。

  - `sticky`: (新增元素，目前兼容性可能不是那么的好)，可以设置 position:sticky 同时给一个 (top,bottom,right,left) 之一即可。

    >- 使用`sticky`时，必须指定top、bottom、left、right4个值之一，不然只会处于相对定位；
    >- `sticky`只在其父元素内其效果，且保证父元素的高度要高于`sticky`的高度；
    >- 父元素不能`overflow:hidden`或者`overflow:auto`等属性


​    

##### display

- 取值说明

| None               | 使用后元素将不会显示                                         |
| ------------------ | ------------------------------------------------------------ |
| grid               | 定义一个容器属性为网格布局                                   |
| flex               | 定义一个弹性布局                                             |
| block              | 使用后元素将变为块级元素显示，元素前后带有换行符             |
| inline             | **display默认值**。使用后原色变为行内元素显示，前后无换行符  |
| list-item          | 使用后元素作为列表显示                                       |
| run-in             | 使用后元素会根据上下文作为块级元素或行内元素显示             |
| table              | 使用后将作为块级表格来显示（类似`<table>`），前后带有换行符  |
| inline-table       | 使用后元素将作为内联表格显示（类似`<table>`），前后没有换行符 |
| table-row-group    | 元素将作为一个或多个行的分组来显示（类似`<tbody>`）          |
| table-hewder-group | 元素将作为一个或多个行的分组来表示（类似`<thead>`）          |
| table-footer-group | 元素将作为一个或多个行分组显示（类似`<tfoot>`）              |
| table-row          | 元素将作为一个表格行显示（类似`<tr>`）                       |
| table-column-group | 元素将作为一个或多个列的分组显示（类似`<colgroup>`）         |
| table-column       | 元素将作为一个单元格列显示（类似`<col>`）                    |
| table-cell         | 元素将作为一个表格单元格显示（类似`<td>和<th>`）             |
| table-caption      | 元素将作为一个表格标题显示（类似`<caption>`）                |
| inherit            | 规定应该从父元素集成display属性的值                          |

其中，常用的有：`block`， `inline-block`， `none`， `table`， `line`

- 和display:none 和 visibility: hidden的联系和区别？

  >联系： 这两个属性的值都可以让元素变得不可见；
  >
  >区别： 
  >
  >- **从占据空间角度看**：`display: none;`会让元素完全从渲染树中消失，渲染的时候不占据任何空间；`visibility: hidden;`不会让元素从渲染树消失，渲染师元素继续占据空间，只是内容不可见；
  >- **从继承方面角度看**：`display: none;`是非继承属性，子孙节点消失由于元素从渲染树消失造成，通过修改子孙节点属性无法显示；`visibility:hidden;`是继承属性，子孙节点消失由于继承了`hidden`，通过设置`visibility: visible;`可以让子孙节点显式；
  >- **从重绘和重排角度看**：修改常规流中元素的`display`通常会造成文档重排。修改`visibility`属性只会造成本元素的重绘 读屏器不会读取`display: none;`元素内容；会读取`visibility: hidden`元素内容

##### 隐藏元素的方法

>`visibility: hidden;`这个属性只是简单的隐藏某个元素，但是元素占用的空间任然存在；
>
>`opacity: 0;`CSS3`属性，设置0可以使一个元素完全透明；
>
>`position: absolute;` 设置一个很大的 left 负值定位，使元素定位在可见区域之外；
>
>`display: none;`元素会变得不可见，并且不会再占用文档的空间；
>
>`transform: scale(0);`将一个元素设置为缩放无限小，元素将不可见，元素原来所在的位置将被保留；
>
>`<div hidden="hidden">` HTML5属性,效果和display:none;相同，但这个属性用于记录一个元素的状态；
>
>`height: 0;`将元素高度设为 0 ，并消除边框；
>
>`filter: blur(0);``CSS3`属性，括号内的数值越大，图像高斯模糊的程度越大，到达一定程度可使图像消失`（此处感谢小伙伴支持）`；

##### 行内元素和块级元素

- 区别

  >块元素：总是早新行开始；行内元素：和其他元素在一行
  >
  >块元素，能容纳其他块元素或者内联元素；内联元素，只能容纳文本或其他内联元素
  >
  >块元素中高度，行高以及顶和底边距都可以控制；内联元素中高，行高及顶和底边距不可改变。

##### css预处理器和后处理器

- css预处理器

  - 概念：CSS预处理器用一种专门的编程语言，进行Web页面样式设计，然后再编译成正常的CSS文件，以供项目使用
  - 优点：虽然各种预处理器功能强大，但使用最多的，还是以下特性：变量（variables），代码混合（ mixins），嵌套（nested rules）以及 代码模块化(Modules)。

- css 后处理器：

  -  `postCss`,通常被视为在完成的样式表中根据`css`规范处理`css`，让其更加有效。目前最常做的是给`css`属性添加浏览器私有前缀，实现跨浏览器兼容性的问题。

- 区别

  - 编译环境不一样

    > Sass的安装需要Ruby环境，是在服务端处理的，而Less是需要引入less.js来处理Less代码输出css到浏览器，也可以在开发环节使用Less，然后编译成css文件，直接放到项目中，也有 Less.app、SimpleLess、CodeKit.app这样的工具，也有在线编译地址。Stylus需要安装node，然后安装最新的stylus包即可使用

  - 变量符不一样

    > Less是@，而Scss是$， Stylus样式中声明变量没有任何限定，你可以使用“$”符号开始。

  - 输出设置

  - 处理条件语句

  - 引用外部css

  - sass less的工具库不同

##### 动画

- 常用特效和变换 transform

  - 2D缩放：scale
  - 2D旋转：rotate
  - 2D位移：translate
  - 2D倾斜：skew

- Animation:

  - 属性

    >animation-name 规定需要绑定到选择器的 keyframe 名称。
    >
    >animation-duration 规定完成动画所花费的时间，以秒或毫秒计。
    >
    >animation-timing-function 规定动画的速度曲线。
    >
    >animation-delay 规定在动画开始之前的延迟。
    >
    >animation-iteration-count 规定动画应该播放的次数。
    >
    >animation-direction 规定是否应该轮流反向播放动画。
    >
    >animation-fill-mode 规定动画在播放之前或之后，其动画效果是否可见
    >
    >简写：animation: name duration timing-function delay iteration-count direction fill-mode;
    >
    >举例：.dom {. animation: wang 3s linear 1s infinite alternate forwards ;}

  - Keyframes

    >这个属性用来定义一系列关键帧。也就是在动画运行的全过程中的一个个中间点。
    >
    >@keyframes zoomIn {
    >
    >​	0%{ transform: scale(0);}
    >
    >​	60%{ transform: scale(1.1);}
    >
    >​	100% { transform: scale(1);}
    >
    >}

- 手写动画最小时间间隔

  - 多数显示器默认频率是`60Hz`，即1秒刷新60次，所以理论上最小间隔为`1/60＊1000ms ＝ 16.7ms`。

##### png、jpg、 jpeg、 bmp、gif 这些图片格式解释一下，分别什么时候用。有没有了解过webp？

- `png`-便携式网络图片`（Portable Network Graphics）`,是一种无损数据压缩位图文件格式。优点是：压缩比高，色彩好。 大多数地方都可以用。它可以细分为三种格式： `PNG8`，`PNG24`，`PNG32`。后面的数字代表这种`PNG`格式最多可以索引和存储的颜色值；
- `jpg`是一种针对相片使用的一种失真压缩方法，是一种破坏性的压缩，在色调及颜色平滑变化做的不错。在`www`上，被用来储存和传输照片的格式。一种大小与质量相对平衡的压缩图片格式。适用于允许轻微失真的色彩丰富的照片，不适用于色彩简单（色调少）的图片，比如图标啊，`logo`等；
- `gif`是一种位图文件格式，以8位色重现真色彩的图像。可以实现动画效果。一种无损的，8位图片格式。具有支持动画，索引透明，压缩等特性。使用色彩简单的图片。
- `bmp`的优点： 高质量图片；缺点： 体积太大； 适用场景： `windows`桌面壁纸；
- `webp`格式是谷歌在2010年推出的图片格式，压缩率只有`jpg`的2/3，大小比`png`小了45%。缺点是压缩的时间更久了，兼容性不好，目前谷歌和`opera`支持。

##### css实现一个三角形？

- 隐藏上左右三条边，颜色设置为透明

  ```
  .content {
          width: 0;
          height: 0;
          margin: 0 auto;
          border-width: 20px;
          border-style: solid;
          border-color: transparent transparent pink transparent;  // 对应上右下左，此处为 下 粉色
  }
  ```

- 均分实现

  ```
  // 1.首先保证元素是块级元素；2.设置元素的边框；3.不需要显示的边框使用透明色。
  .content {
          width:0;
          height:0;
          margin:0 auto;
          border:50px solid transparent;
          border-top: 50px solid pink;
  }
  ```

- 等边三角形

  ```css
  //显示部分的宽度 = transparent部分的宽度 * √3    
  .content {
          width:0;
          height:0;
          margin:0 auto;
    			border: 100px solid transparent;
    			border-top: 173px solid pink;
  }
  ```

- 直角三角形

  ```
  //设置两边的宽度为0。
  .content{
  		  width:0;
        height:0;
        margin:0 auto;
    		border: 0px solid transparent;
    		border-left: 100px solid transparent;
    		border-bottom: 100px solid #343434
  }
  ```

  

##### CSS选择符有哪些？哪些属性可以继承？

- 常见的选择符

  >`id`选择器（`#content`），类选择器（`.content`）, 标签选择器（`div`, `p`, `span`等）, 相邻选择器（`h1+p`）, 子选择器（`ul>li`）, 后代选择器（`li a`）， 通配符选择器（`*`）, 属性选择器（`a[rel = "external"]`）， 伪类选择器（`a:hover`, `li:nth-child`）

- 可继承和不可继承的属性

  >可继承的样式属性： `font-size`, `font-family`, `color`, `ul`, `li`, `dl`, `dd`, `dt`，`text-indent、text-align;visibility;`
  >
  >不可继承的样式属性： `border`, `padding`, `margin`, `width`, `height`；
  >
  >大致理解为**字体相关的样式、字体相关的属性，font-size和font-weight等。文本相关的属性，color和text-align等。表格的一些布局属性、列表属性如list-style等。还有光标属性cursor、元素可见性visibility。可以继承，与尺寸相关的样式不可继承**。
  >
  >当一个属性是不可继承的时候，可以使用`inherit`来制定继承父元素的属性

- 样式优先级计算

  >同权重情况下： 内联样式表（标签内部）> 嵌入样式表（当前文件中）> 外部样式表（外部文件中）
  >
  >```
  >!important > # > . > tag
  >```
  >
  >注意： `!important` 比 内联优先级高

- css3新增的伪类有哪些？

  >`:root`选择文档的根元素，等同于`html`元素
  >
  >`:empty`选择没有子元素的元素
  >
  >`:target`选取当前活动的目标元素
  >
  >`:not(selector)`选择除 `selector`元素意外的元素
  >
  >`:enabled`选择可用的表单元素
  >
  >`:disabled`选择禁用的表单元素
  >
  >`:checked`选择被选中的表单元素
  >
  >```
  >:nth-child(n)`匹配父元素下指定子元素，在所有子元素中排序第`n
  >```
  >
  >`nth-last-child(n)`匹配父元素下指定子元素，在所有子元素中排序第`n`，从后向前数
  >
  >```
  >:nth-child(odd)
  >:nth-child(even)
  >:nth-child(3n+1)
  >:first-child
  >:last-child
  >:only-child
  >:nth-of-type(n)`匹配父元素下指定子元素，在同类子元素中排序第`n
  >```
  >
  >`:nth-last-of-type(n)`匹配父元素下指定子元素，在同类子元素中排序第`n`，从后向前数
  >
  >```
  >:nth-of-type(odd)
  >:nth-of-type(even)
  >:nth-of-type(3n+1)
  >:first-of-type
  >:last-of-type
  >:only-of-type
  >```
  >
  >`::selection`选择被用户选取的元素部分（伪元素）
  >
  >`:first-line`选择元素中的第一行（伪元素）
  >
  >`:first-letter`选择元素中的第一个字符（伪元素）
  >
  >`:after`在元素在该元素之后添加内容（伪元素）
  >
  >`:before`在元素在该元素之前添加内容（伪元素）

##### 居中布局

>对于宽高固定的元素
>
>（1）我们可以利用margin:0auto来实现元素的水平居中。
>
>（2）利用绝对定位，设置四个方向的值都为0，并将margin设置为auto，由于宽高固定，因此对应方向实现平分，可以实现水平和垂直方向上的居中。
>
>（3）利用绝对定位，先将元素的左上角通过top:50%和left:50%定位到页面的中心，然后再通过margin负值来调整元素的中心点到页面的中心。
>
>（4）利用绝对定位，先将元素的左上角通过top:50%和left:50%定位到页面的中心，然后再通过translate来调整元素的中心点到页面的中心。
>
>（5）使用flex布局，通过align-items:center和justify-content:center设置容器的垂直和水平方向上为居中对齐，然后它的子元素也可以实现垂直和水平的居中。
>
>对于宽高不定的元素，上面的后面两种方法，可以实现元素的垂直和水平的居中。

- flex布局

  ```css
  div.parent{
  	display:flex;
    justify-content:center;
    align-items:center;
  }
  ```

- 绝对定位

```css
  div.parent{
  position:relative
}
  div.child{
    position:absolute;
    top:50%;
    left:50%;
    transform: translate(-50%, -50%); 
}
```

- inline-block

  ```css
  .parent2{
   text-align: center;
  }
  .parent2 span{
   display: inline-block;
   height:50%
  }
  .parent2 .child{
   display: inline-block;
   color: #fff;
  }
   <div class="parent2">
   <span></span>
   <div class="child">hello world-2</div>
   </div>
  ```

- 使用 table 和 table-cell

  ```css
  .parent1{ 
  	display: table;
  }
  .parent1 .child{
  	 display: table-cell;
  }
  ```

##### 等高布局

- flex布局

- 使用负margin-bottom和正padding-bottom对冲实现

  ```css
   .Article>li {
   	float: left;
   	margin: 0 10px -9999px 0;
   	padding-bottom: 9999px;
   }
  ```

- table布局

- grid布局

  ```
  display: grid;
  grid-auto-flow: column;
  grid-gap: 20px
  ```

##### 三栏布局

- float实现

  ```css
  //特点：使用了浮动，注意需要清除浮动
  <div class="main">
      <div class="left">left</div>
      <div class="right">right</div>
  		<div class="center">center</div>
  </div>
  .left{
    float:left;
    width:100px;
    height:100px;
    background:red;
  }
  .right{
    float:right;
    width:100px;
    height:100px;
    background:red;
  }
  .center{
    background:blue;
    margin-left:100px;
    margin-right:100px;
  }
  .main ::after{ // 清除浮动
    display:block;
    clear:both;
    content:''
  }
  
  ```

- 绝对定位

  ```
  <div class="main">
      <div class="left">left</div>
      <div class="right">right</div>
  		<div class="center">center</div>
  </div>
  .main{
      position:relative;
  }
  .left{
      position:absolute;
      left:0;
      width:100px;
    	height:100px;
    	background:red;
  }
  .right{
    	position:absolute;
      right:0;
      width:100px;
    	height:100px;
    	background:red;
  }
  .center{
    background: blue;
    position:absolute;
    left:100px;
    right:100px;
  }
  ```

- table布局

  ```
  <div class="main">
      <div class="left">left</div>
      <div class="center">center</div>
      <div class="right">right</div>
  </div>
  .main{
      width:100%;
      display:table;
  }
  .left,right,.center{
      display: table-cell;
  }
  .right,.left{
    	width:100px;
    	background: red;
  }
  .center{
    background: blue;
  }
  ```

- flex布局

  ```
  <div class="main">
      <div class="left">left</div>
      <div class="center">center</div>
      <div class="right">right</div>
  </div>
  .main{
      width:100%;
      display:flex;
  }
  .right,.left{
    	width:100px;
    	background: red;
  }
  .center{
    background: blue;
    flex:1;
  }
  ```

- grid布局

  ```
  .main{
      width: 100%;
      display: grid;
      grid-template-rows: 100px;//行高
      grid-template-columns: 100px auto 100px; //列宽
  }
  ```

##### 多栏布局

- 栅格系统（grid systems）

  - 特点：利用浮动实的多栏布局
  - 表示：Bootstrap

- 多列布局

  - 特点：将内容按照指定的列数排列

  - 表现：报纸排版

  - 使用方式：css3的column

    - IE10及以上和其它现代浏览器
    - 但 -webkit- 以及 -moz- 前缀不能省略
    - 比flex弹性布局更稳定、更兼容

  - 语法

    >columns: <'column-width'> || <'column-count'>设置对象的列数和每列的宽度。复合属性。
    >
    >column-width ：设置对象的宽度
    >
    >column-count ：用来定义对象中的列数，使用数字 1-10表示
    >
    >column-gap ：设置列与列之间的间距
    >
    >column-rule：<' column-rule-width '> || <' column-rule-style '> || <' column-rule-color '>
    >
    >- 设置对象的列与列之间的边框。复合属性
    >- column-rule: 10px solid #090;
    >
    >column-fill：auto | balance
    >
    >- 设置对象所有列的高度是否统一

##### 弹性布局

- CSS3引入的新模式

  - 用来为盒装模型提供的最大的灵活性

  - 目前已经得到了所有现代浏览器的支持

- 优势

  - 轻松实现视图大小变化时对元素的相对位置的大小的保持
  - 减少了对浮动布局的依赖以及重置元素的大小

- 注意

  - Webkit 内核的浏览器，必须加上 -webkit前缀 display：-webkit-flex
  - 子元素的float、clear和vertical-align 属性失效

##### 流式布局

- 主要靠百分比进行排版
- 对应布局
  - 瀑布流布局
    - 表现 ：参差不齐的多栏布局
    - 实现方式 ： 同样可以用column实现

##### 响应式布局

- 特点
  - 一个网站能够兼容多个终端
  - 解决不用设备之间分辨率之间的兼容问题
- 实现方式
  - css3的媒体查询
  - 检测设备屏幕大小，通过css媒体查询来有针对性的更改页面的布局