##### 变量类型和计算
###### 变量类型
- 值类型和引用类型

  - 值类型（基本数据类型） `string、number、boolean、undefined、null、symbol`
  - 引用类型：`object、array、function`

- 区别

  - 内存的配置不同：基本类型存储在栈中，复杂类型存储在堆中，栈中存储的变量，是指向堆中的引用地址

    栈：存放的是基本类型；由操作系统自动分配释放 ，存放函数的参数值和局部变量的值等。

    堆：存放的是引用类型和闭包变量。 一般由程序员分配释放， 若程序员不释放，程序结束时可能由OS回收，分配方式倒是类似于链表se其实在堆中一般存放变量是一些对象类型

    闭包变量：函数A返回流函数B,函数B使用了函数A中的变量，函数B被称为闭包。

    注意：函数A弹出调用栈后，函数A的变量这时候是存储在堆上的，所有函数B还可以访问函数A中的变量。

  - 访问机制不同：值类型按照值访问；引用类型按照引用访问

  - 复变量时不同（a=b）

    基本数据类型：a=b;是将b中保存的原始值的副本赋值给新变量a，a和b完全独立，互不影响

    复杂数据类型：a=b;将b保存的对象内存的引用地址赋值给了新变量a;a和b指向了同一个堆内存地址，其中一个值发生了改变，另一个也会改变。

  - 参数传递的不同（实参/形参）：函数传参都是按值传递(栈中的存储的内容)：

    基本数据类型，拷贝的是值；复杂数据类型，拷贝的是引用地址
    
    ``` javascript
    var a = {n:1}
    var b = a;
    a.x = a = {n:2}
    //
    //1 .的优先级高于=： >>>>>>        a={n:1,x:{n:1}}   b={n:1,x:{n:1}}
    //2 赋值操作从右到左 先执行a={n:2}>>>>>>>>>>a={n:2}   b={n:1,x:{n:2}}
    console.log(a.x);>>>>>>>undefined
    console.log(b.x)>>>>>>>>{n:2}
    ```
    
    

- 判断数据类型

  - typeof 

    typeof 运算符 只能区分值类型的类型，对于引用类型的对象、数组 区分不出来

    注意 typeof new Function(); // function 有效

  - instanceof

    instanceof 运算符返回一个布尔值，表示对象是否为某个构造函数的实例

    缺点：instanceof运算符只能用于对象（纯对象和数组），不适用原始类型Undefined、Null、Boolean、Number 和 String的值。

  - Object.prototype.toString.call()

    可以通过Object.prototype.toString方法准确判断某个对象值属于哪种内置类型。

  - constructor

    constructor属性的作用是，可以得知某个实例对象，到底是哪一个构造函数产生的。

    `var f = new F();  f.constructor === F;// true`

###### 变量计算（强制类型转换）

- 显示强制类型转换

  - 字符串和数字之间的显示转换

    - string()

    - number()

    - 日期转换为数字（+）一元运算符+的另一个用途将日期对象强制转换为数字，返回结果为Unix时间戳

       `var time = new Date()`

      `+time`

    - 奇特的～运算符

      ～x相当于-(x+1)

      ~和indexOf()一起可以将结果强制类型转换为真/假值，如果indexOf()返回-1，~将其转换为假值0，其他情况一律转换为真值。

    - ~~字位截除

    - 显示解析数字字符串：`Number()、parseInt()、parseFloat()`

  - 显示转换为布尔值

    - boolearn()
    - (!!)显示强制类型转换为布尔值最常用的方法

  - 抽象值操作：`toString()、toNumber()、toBoolean()`

- 隐式强制类型转换

  - 转换成字符串

    - 字符串拼接：

      ```javascript
      var a = [1,2]
      var b = [3,4]
      a + b   //"1,23,4"
      ```

    - 因为数组的valueOf()操作无法得到简单基本类型值，于是调用toString()，因此两个数组变成了"1,2"和"3,4"，+将它们拼接后返回

  - 隐式强制类型转换成布尔值

    - if()语句中的条件判断表达式
    - for(..; ..; ..)语句中的条件判断表达式
    - while()和do .. while()
    - ? : 中的条件判断表达式
    - 逻辑运算符||和&&左边的操作数

  - 布尔值到数字

  - ||和&&(选择器运算符)

    - ES5规范中说到：&&和||运算符的返回值并不一定是布尔类型，而是两个操作数其中一个的值。
      - 对于||来说，如果条件判断结果为true就返回第一个操作数的值，如果为false就返回第二个操作数的值。
      - 对于&&来说，如果条件判断结果为true就返回第二个操作数的值，如果为false就返回第一个操作数的值。

- == 和 ===(宽松相等和严格相等)

  - 区别：==允许在相等比较中进行强制类型转换，而===不允许。

  - 经典问题`if(a == 1 && a == 2 && a == 3) `

    > 思考方向 --- 【**利用隐式转换规则**】
    >
    > `==`操作符在左右数据类型不一致时，会先进行隐式转换。
    >
    > `a == 1 && a == 2 && a == 3`的值意味着其不可能是基本数据类型。因为如果 a 是 null 或者是 undefined bool类型，都不可能返回true。
    >
    > 因此可以推测 a 是复杂数据类型，JS 中复杂数据类型只有 `object`，回忆一下，Object 转换为原始类型会调用什么方法？
    >
    > - 如果部署了 `[Symbol.toPrimitive]`接口，那么调用此接口，若返回的不是基本数据类型，抛出错误。
    > - 如果没有部署[Symbol.toPrimitive]接口，那么根据要转换的类型，先调用valueOf/toString
    >   1. 非Date类型对象，`hint`是 `default`时，调用顺序为：`valueOf`>>> `toString`，即`valueOf`返回的不是基本数据类型，才会继续调用 `toString`，如果`toString`返回的还不是基本数据类型，那么抛出错误。
    >   2. 如果 `hint`是 `string`(Date对象的hint默认是string) ，调用顺序为：`toString`>>> `valueOf`，即`toString`返回的不是基本数据类型，才会继续调用 `valueOf`，如果`valueOf`返回的还不是基本数据类型，那么抛出错误。
    >   3. 如果 `hint`是 `number`，调用顺序为： `valueOf`>>> `toString`
    >
    > 解决方案：
    >
    > - 利用 [Symbol.toPrimitive] 接口
    >
    >   ```javascript
    >   let a = {
    >       [Symbol.toPrimitive]: (function(hint) {
    >               let i = 1;
    >               return function() {
    >                   return i++;
    >               }
    >       })()
    >   }
    >   console.log(a == 1 && a == 2 && a == 3); //true
    >   ```
    >
    > - 利用valueof接口
    >
    >   ```javascript
    >   let a = {
    >       valueOf: (function() {
    >           let i = 1;
    >           return function() {
    >               return i++;
    >           }
    >       })()
    >   }
    >   console.log(a == 1 && a == 2 && a == 3); //true
    >   ```
    >
    > - 利用正则
    >
    >   ```javascript
    >   let a ={
    >   	reg:/\d/g,
    >   	valueOf(){
    >   		return this.reg.exec(123)[0]
    >   	}
    >   }
    >   console.log(a == 1 && a == 2 && a == 3); //true
    >   ```
    >
    > - 利用数据劫持
    >
    >   ```javascript
    >   //使用 Object.defineProperty 定义的属性，在获取属性的时候调用get方法，
    >   let i = 1;
    >   Object.defineProperty(window, 'a', {
    >       get: function() {
    >           return i++;
    >       }
    >   });
    >   console.log(a == 1 && a == 2 && a == 3); //true
    >   ```
    >
    > - 利用ES6 Proxy
    >
    >   ```javascript
    >   let a = new Proxy({}, {
    >       i: 1,
    >       get: function () {
    >           return () => this.i++;
    >       }
    >   });
    >   console.log(a == 1 && a == 2 && a == 3); // true
    >   ```
    >
    > - 重写数组的join
    >
    >   ```javascript
    >   let a = [1, 2, 3];
    >   a.join = a.shift;
    >   console.log(a == 1 && a == 2 && a == 3); //true
    >   ```
    >
    > - with关键字：注意：0 == '\n' //true

###### 其他经典题目

- JS 中使用 typeof 能得到的哪些类型

  只能区分值类型，对于引用类型的对象、数组区分不出来。如果是对象，则返回object,如果的function,则返回的是function 

  可以返回的数据类型`number\string\boolean\undefined\null\object\function`

- 何时使用 === 何时使用 ==

  - 除了判断 **对象属性是否为空**和 **看是否函数的参数为空**的情况 ，其余的都用 === 。

- JS 中有哪些 内置函数`object、Array、bollean、number、string、function、date、regexp、error`

- JS 变量按照 存储方式 分为哪些类型，并描述其特点

- 如何理解 JSON：JSON 既是一个JS 内置对象，也是一种 数据格式。

##### 构造函数、原型和原形链    

- 构造函数

  >- 什么是构造函数？ constructor返回创建实例对象是构造函数的引用，构造函数本身是一个函数，与普通函数的区别在于使用new生成实例的函数就是构造函数。
  >- symbol是构造函数吗？是基本数据类型，不支持new语法；
  >- constructor 值只读吗？对于引用类型的constructor属性值是可以修改的，而基本类型是只读的

  

- 原型和原型定义

>- 背景
>
>  JavaScript 中除了基础类型外的数据类型，都是对象（引用类型）。但是由于其没有 类（class，ES6 引入了 class，但其只是语法糖）的概念，如何将所有对象联系起来就成立一个问题，于是就有了原型和原型链的概念。
>
>- 原型是什么？
>
>  原型是一个prototype对象，用于表示对象之间的关系。
>
>- 原型链
>
>  每个实例对象（ object ）都有一个私有属性（称之为 __proto__ ）指向它的构造函数的原型对象（prototype ）。该原型对象也有一个自己的原型对象( __proto__ ) ，层层向上直到一个对象的原型对象为 null。根据定义，null 没有原型，并作为这个原型链中的最后一个环节。以上一整个原型与原型层层相链接的过程即为原型链
>
>- 公式
>
>  ```javascript
>  var 对象 = new 函数()
>  对象.__proto__ === 对象的构造函数.prototype
>  ```

- 7大继承写法

  >```javascript
  >// 1.原型链继承
  >//其基本思想：利用原型让一个引用类型继承另一个引用类型的属性和方法
  >// 如SubType.prototype = new SuperType();
  >//--------缺点
  >//1；通过原型来实现继承时，原型会变成另一个类型的实例，原先的实例属性变成了现在的原型属性，该原型的引用类型属性会被所有的实例共享
  >//2: 在创建子类型的实例时，不能向超类型的构造函数中传递参数
  >function SuperType() {
  >this.name = 'Yvette';
  >}
  >function SubType() {
  >this.age = 22;
  >}
  >SubType.prototype = new SuperType();
  >SubType.prototype.constructor = SubType;
  >// 2.借用构造函数
  >//其基本思想为:在子类型的构造函数中调用超类型构造函数。
  >//--------优点
  >//1. 可以向超类传递参数
  >//2. 解决了原型中包含引用类型值被所有实例共享的问题
  >//--------缺点
  >//1；方法都在构造函数中定义，函数复用无从谈起
  >//2. 另外超类型原型中定义的方法对于子类型而言都是不可见的
  >function SuperType(name) {
  >this.name = name
  >}
  >function SubType(name) {
  >SuperType.call(this,name)
  >}
  >
  >//3.组合继承
  >//组合继承指的是将原型链和借用构造函数技术组合到一块，从而发挥二者之长的一种继承模式。
  >//基本思路：使用原型链实现对原型属性和方法的继承，通过借用构造函数来实现对实例属性的继承，既通过在原型上定义方法来实现了函数复用，又保证了每个实例都有自己的属性。
  >//--------优点
  >//1. 可以向超类传递参数
  >//2. 每个实例都有自己的属性
  >//3. 实现了函数复用
  >//--------缺点
  >//无论什么情况下，都会调用两次超类型构造函数：一次是在创建子类型原型的时候，另一次是在子类型构造函数内部。
  >function SuperType() {
  >this.name = 'zc'
  >this.colors = ['pink', 'blue', 'green'];
  >}
  >function SubType() {
  >SuperType.call(this)   // 第一次调用SuperType
  >}
  >SubType.prototype = new SuperType   //第一次调用SuperType
  >SubType.prototype.constructor = SubType  
  >let a = new SubType()
  >let b = new SubType()
  >
  >a.colors.push('red')
  >console.log(a.colors)//[ 'pink', 'blue', 'green', 'red' ]
  >console.log(b.colors)//[ 'pink', 'blue', 'green' ]
  >
  >//4.原型式继承
  >//基本思想：在 object() 函数内部，先创建一个临时性的构造函数，然后将传入的对象作为这个构造函数的原型，最后返回了这个临时类型的一个新实例，从本质上讲，object() 对传入的对象执行了一次浅拷贝。
  >//ECMAScript5通过新增 Object.create()方法规范了原型式继承。这个方法接收两个参数：一个用作新对象原型的对象和（可选的）一个为新对象定义额外属性的对象(可以覆盖原型对象上的同名属性)，在传入一个参数的情况下，Object.create() 和 object() 方法的行为相同。
  >//--------缺点
  >//同原型链实现继承一样，包含引用类型值的属性会被所有实例共享
  >function object(o) {
  >function F() { }
  >F.prototype = o;
  >return new F();
  >}
  >var person = {
  >name:   "Nicholas"  ,
  >friends: ["Shelby", "Court", "Van"]
  >};
  >var anotherPerson = object(person);
  >anotherPerson.name = "Greg";
  >anotherPerson.friends.push("Rob");
  >var yetAnotherPerson = object(person);
  >yetAnotherPerson.name = "Linda";
  >yetAnotherPerson.friends.push("Barbie");
  >alert(person.friends);   //"Shelby,Court,Van,Rob,Barbie"
  >
  >var yetAnotherPerson = object(person); 
  >var yetAnotherPerson = Object.create(person);
  >
  >//5. 寄生式继承
  >//使用原型式继承获得一个目标对象的浅复制，然后增强这个浅复制的能力。
  >//--------优点
  >//基于 person 返回了一个新对象 -—— person2，新对象不仅具有 person 的所有属性和方法，而且还有自己的 sayHi() 方法。在考虑对象而不是自定义类型和构造函数的情况下，寄生式继承也是一种有用的模式。
  >//--------缺点
  >//1.使用寄生式继承来为对象添加函数，会由于不能做到函数复用而效率低下。
  >//2.同原型链实现继承一样，包含引用类型值的属性会被所有实例共享。
  >function object(o) {
  >function F() { }
  >F.prototype = o;
  >return new F();
  >}
  >function createAnother(original) {
  >var clone = object(original);  //通过调用函数创建一个新对象
  >clone.sayHi = function () {  //以某种方式增强这个对象
  >   console.log('hi');
  >};
  >return clone;   //返回这个对象
  >}
  >
  >//6. 寄生组合式继承
  >//所谓寄生组合式继承，即通过借用构造函数来继承属性，通过原型链的混成形式来继承方法，基本思路：不必为了指定子类型的原型而调用超类型的构造函数，我们需要的仅是超类型原型的一个副本，本质上就是使用寄生式继承来继承超类型的原型，然后再将结果指定给子类型的原型
  >//--------优点
  >//只调用了一次超类构造函数，效率更高。避免在SuberType.prototype上面创建不必要的、多余的属性，与其同时，原型链还能保持不变。因此寄生组合继承是引用类型最理性的继承范式
  >function inheritPrototype(subType, superType) {
  >var prototype = object(superType.prototype); //创建对象    创建了父类原型的浅复制
  >prototype.constructor = subType;//增强对象   修正原型的构造函数
  >subType.prototype = prototype;//指定对象     将子类的原型替换为这个原型
  >}
  >
  >function SuperType(name) {
  >this.name = name;
  >this.colors = ['pink', 'blue', 'green'];
  >}
  >function SuberType(name, age) {
  >SuperType.call(this, name);
  >this.age = age;
  >}
  >inheritPrototype(SuberType, SuperType);
  >
  >//7.ES6 继承
  >// ES6继承的结果和寄生组合继承相似，本质上，ES6继承是一种语法糖。但是，寄生组合继承是先创建子类实例this对象，然后再对其增强；而ES6先将父类实例对象的属性和方法，加到this上面（所以必须先调用super方法），然后再用子类的构造函数修改this。
  >class SuperType {
  >constructor(age) {
  >   this.age = age;
  >}
  >getAge() {
  >   console.log(this.age);
  >}
  >}
  >class SubType extends SuperType {
  >constructor(age, name) {
  >   super(age); // 调用父类的constructor(x, y)
  >   this.name = name;
  >}
  >getName() {
  >   console.log(this.name);
  >}
  >}
  >//实现原理
  >class A {}
  >class B {}
  >Object.setPrototypeOf = function (obj, proto) {
  >obj.__proto__ = proto;
  >return obj;
  >}      // B 的实例继承 A 的实例
  >
  >Object.setPrototypeOf(B.prototype, A.prototype);// B 继承 A 的静态属性
  >Object.setPrototypeOf(B, A);
  >
  >//对于ES6的 class 需要做以下几点说明
  >
  >//1. class 声明会提升，但不会初始化赋值。Foo 进入暂时性死区，类似于 let、const 声明变量。
  >//2. class 声明内部会启用严格模式。
  >//3. class 的所有方法（包括静态方法和实例方法）都是不可枚举的。
  >//4. class 的所有方法（包括静态方法和实例方法）都没有原型对象 prototype，所以也没有[[construct]]，不能使用 new 来调用。
  >//5. 必须使用 new 调用 class
  >//6. class 内部无法重写类名
  >
  >//使用 extends 关键字实现继承，有几点需要特别说明
  >
  >//1. 子类必须在 constructor 中调用 super 方法，否则新建实例时会报错。如果没有子类没有定义 constructor 方法，那么这个方法会被默认添加。在子类的构造函数中，只有调用 super 之后，才能使用 this关键字，否则报错。这是因为子类实例的构建，基于父类实例，只有super方法才能调用父类实例。
  >//2. ES5 的继承，实质是先创造子类的实例对象this，然后再将父类的方法添加到this上面（Parent.apply(this)）。ES6 的继承机制完全不同，实质是先将父类实例对象的属性和方法，加到this上面（所以必须先调用super方法），然后再用子类的构造函数修改this
  >//ES6继承中子类的构造函数的原型链指向父类的构造函数，ES5中使用的是构造函数复制，没有原型链指向。ES6子类实例的构建，基于父类实例，ES5中不是。
  >```

- 浅拷贝和深拷贝

  - 深拷贝和浅拷贝是只针对Object和Array这样的引用数据类型的。

  - 深拷贝和浅拷贝区别

    - 浅拷贝只复制某个对象的指针，而不是复制对象本身，新旧对象还是共享同一快内存，补充：浅拷贝是按位拷贝对象，它会创建一个新对象，这个对象有着原始对象属性值的一份精确拷贝。如果属性是基本类型，拷贝的就是基本类型的值；如果属性是内存地址（引用类型），拷贝的就是内存地址
    - 深拷贝会另外创造一个一模一样的对象，新对象跟原对象不共享内存，修改新对象不会改到原对象。

  - 浅拷贝的实现方式

    - Object.assign()

      - ES6新函数，可以把任意多个的源对象自身的可枚举属性拷贝给目标对象，然后返回目标对象`Object.assign(target, ...sources)`
    - 注意：当object只有一成的时候，是深拷贝
      
    - {...} [...]

    - Array.prototype.concat()

    - Array.prototype.slice() 

      关于Array的slice和concat方法的补充说明：Array的slice和concat方法不修改原数组，只会返回一个浅复

      制了原数组中的元素的一个新数组。

  - 深拷贝的实现方式

    - JSON.parse(JSON.stringify())

      - 原理： 用JSON.stringify将对象转成JSON字符串，再用JSON.parse()把字符串解析成对象，一去一来，新的对象产生了，而且对象会开辟新的栈，实现深拷贝。
      - 这种方法虽然可以实现数组或对象深拷贝,但是会忽略值为undefined项，忽略key为symbol；忽略函数；不能解决循环引用的对象（报错）不能正确处理 new date；

    - 手写递归

      ```
      //递归
      const deepcopy = function(obj){
      	if(typeof obj !== 'object') return
      	const newObj = obj instanceof Array ? []:{};
      	obj.getOwnPropertySymbols
      	for(let key in obj){
      		if(obj.hasOwnProperty(key)){
      			newObj[key] = typeof obj[key] == 'object' ? deepcopy(obj[key]):obj[key]
      		}
      	}
      	return newObj
      }
      //reduce 深拷贝对象
       obj.reduce((acc,[key,value])=>{
              typeof value === 'object' ? {...acc,[key]:deepCopy(value)}:{...acc,[key]:value}
       },{})
       //reduce 深拷贝数组
       obj.reduce((acc,cur)=>{
       	cur instanceof Array ? [...acc,deepcopy(cur)]:[...acc,cur]
       },[])
    ```
    
  - 函数库lodash: 该函数库也有提供_.cloneDeep用来做 Deep Copy
    
    - Jquery.extend()

- 经典题目

  - 写一个原型链继承的例子

  - 描述new一个对象的过程

    >1. 创建一个新对象obj
    >2. 把obj的__proto__指向 构造函数.prototype 实现继承
    >3. 执行构造函数，传递参数，改变this指向
    >4. 最后把obj返回
    >
    >```javascript
    >function _new(fn,...arg) {
    >    let obj = {}
    >    obj.__proto__ = fn.prototype
    >    let ret= fn.apply(obj,arg)
    >    return  ret instanceof Object ? ret:obj
    >}
    >function _new(){
    >  let obj = {}
    >  let Con = Array.prototype.slice(arguments);
    >  obj.__proto__ = Con.prototype;
    >  let res = Con.apply(obj,arguments);
    >  return res instanceof object ? res:obj;
    >}
    >//为什么 return ret instanceof Object ? ret : obj; 需要存在这一步骤？
    >//这是因为new一个实例的时候，如果没有return，就会根据构造函数内部this绑定的值生成对象，如果有返回值，就会根据返回值生成对象，为了模拟这一效果，就需要判断apply后是否有返回值。 
    >```

##### 执行上下文

>- 概念：执行上下文指当前js代码被解析和执行所在的环境的抽象概念
>
>- 分类
>
>  - 全局上下文：只有一个，浏览器的全局对象就是window,this指向这个对象
>  - 函数上下文：无数个，函数被调用时才创建，每次调用函数都会创建一个新的执行上下文；
>  - eval函数执行上下文：指的是运行在eval函数中的代码
>
>- 创建
>
>  - 创建阶段
>
>    - 确定this的值，即`this Binding`
>      1. 全局执行上下文中，this执行全局对象，浏览器的全局对象就是window，而node中this指向这个文件的module对象
>      2. 函数上下文中，this的值取决于函数的调用
>    - 词法环境 组件被创建
>      - 环境类型
>        - 全局环境：是一个没有外部环境的词法环境，其外部环境引用为null，拥有一个全局对象和关联的属性和方法，this指向该对象。
>        - 函数环境：用户在函数中定义的变量被存储在环境记录中，包含arguments对象。对外部环境的引用可以是全局环境也可以是包含内部函数的外部函数环境
>      - 环境组成
>        - 环境记录：存储变量和函数声明的实际位置
>        - 对外部环境的引用：可以访问其外部词法环境
>    - 变量环境 
>      - 变量环境也是一个词法环境，具有上面的属性
>      - 和词法的区别：
>        - 词法：存储函数声明和变量（let const)绑定
>        - 变量：用于存储var的绑定
>      - 变量提升的原因：在创建阶段，函数声明存储在词法环境中，而变量会被设置为undefined(var变量环境中)或者保持未初始化(let const词法环境中)，所以这就是为什么在声明之前访问var变量，而访问let的会出现引用错误。
>
>  - 执行阶段
>
>    - 进入执行上下文
>
>      - 函数的所有形参初始化
>
>      - 函数声明：如果变量对象已经存在相同名称的属性，覆盖
>
>      - 变量声明：如果变量名跟已经声明的形参和函数相同，则变量声明不会干扰该类属性
>
>      - 函数上下文
>
>        - 在函数上下文，用活动对象表示变量对象
>        - 活动对象 VS变量对象：1.变量对象是规范或者js引擎实现的，不能在js环境中直接访问   2.当进入一个执行上下文中，变量才会被激活，叫活动对象，该对象上的属性才能被访问。
>
>        ```javascript
>        function foo(a){
>          var b =2;
>          function c(){}
>          var d = function(){};
>          b=3
>        }
>        foo(1)
>        //进入执行上下文活动对象
>        AO={
>          arguments:{
>            0:1,
>            length:1
>          },
>          a: 1,
>          b: undefined,
>          c: reference to function c(){},
>          d: undefined
>        }
>        //代码执行
>        AO={
>          arguments:{
>            0:1,
>            length:1
>          },
>          a: 1,
>          b: 3,
>          c: reference to function c(){},
>          d: function(){}
>        }
>        ```
>
>    - 代码执行
>
>      - 顺序执行代码，修改变量对象的值
>
>- 总结
>
>  - 全局上下文的变量对象初始化是全局对象
>  - 函数上下文的变量对象初始化只包括arguments对象
>  - 在进入执行上下文时会给变量对象添加形参、函数声明、变量定义等初始的属性值
>  - 在代码执行阶段，会再次修改变量对象的属性值

##### 作用域和闭包

- 作用域和作用域链

  >作用域
  >
  >- 是什么？
  >
  >  作用域本质就是程序源代码中定义变量的区域，它可以解释为一套规则，是关于JS引擎如何寻找变量以及会在何处找到变量的规则。
  >
  >- 作用域分为哪些？
  >
  >  - 词法作用域： 词法作用域是在写代码时就确定了作用域，即静态作用域
  >  - 动态作用域： 动态作用域是代码运行时确定的
  >
  >作用域链
  >
  >- 作用域链是什么？
  >
  >  作用域链实际上是指向变量对象的指针列表，它只引用但不实际包含变量对象，它的用途是保证对执行环境有权访问的所有变量和函数的有序访问。
  >
  >  简单来说：作用域链就是从当前作用域开始一层一层向上寻找某个变量，直到找到全局作用域还是没找到，就宣布放弃。这种一层一层的关系，就是作用域链
  >
  >- 两个重要概念
  >
  >  - 变量对象
  >
  >    每个执行环境都有一个与之关联的变量对象，环境中定义的所有变量和函数都保存在这个对象中（变量对象其实就是作用域这个抽象概念的具体值），比如一个函数中包含的局部变量，它的参数，它里面声明的函数都存在变量对象中。（一个当前执行函数的变量对象最开始时就包含一个arguments对象，这个对象用来装函数括号内的参数，所以全局环境的变量对象没有这个）
  >
  >  - 执行环境
  >
  >    也可以叫执行上下文，这里定义了变量或函数有权访问的其他数据，当一个函数被执行时，他的执行环境会被推入环境栈，执行之后才会被弹出，把控制权返回给之前的执行环境。

- 闭包

  >- 闭包是什么？
  >
  >  闭包是指有权访问另一个函数作用域中的变量的函数，创建闭包最常用的方式就是在一个函数内部创建另一个函数
  >
  >- 闭包的作用？
  >
  >  - 能够访问函数定义时所在的词法作用域(阻止其被回收)。
  >
  >  - 私有化变量
  >
  >  - 模拟块级作用域
  >
  >  - 创建模块
  >
  >    - 两个必备的条件(来自《你不知道的JavaScript》)
  >      - 必须有外部的封闭函数，该函数必须至少被调用一次(每次调用都会创建一个新的模块实例)
  >      - 封闭函数必须返回至少一个内部函数，这样内部函数才能在私有作用域中形成闭包，并且可以访问或者修改私有的状态。
  >
  >    ```javascript
  >    function coolModule() {
  >        let name = 'Yvette';
  >        let age = 20;
  >        function sayName() {
  >            console.log(name);
  >        }
  >        function sayAge() {
  >            console.log(age);
  >        }
  >        return {
  >            sayName,
  >            sayAge
  >        }
  >    }
  >    let info = coolModule();
  >    info.sayName(); //'Yvette'
  >    ```
  >
  >- 闭包特性
  >
  >  ```javascript
  >  //特性1:闭包可以访问当前函数外的变量
  >  function getOuter(){
  >  	var date = '1101'
  >    function getDate(str){
  >      console.log(str+date) //访问外部的date
  >    }
  >    return getDate('今天是：') //今天是：1101
  >  }
  >  getOuter()
  >  //特性2:即使外部函数已经返回，闭包任可以访问外部函数定义的变量
  >  function getOuter(){
  >  	var date = '1101'
  >    function getDate(str){
  >      console.log(str+date) //访问外部的date
  >    }
  >    return getDate 
  >  }
  >  var today = getOuter()
  >  today('今天是：') //今天是：1101
  >  today('昨天不是：')//昨天不是：1101
  >  //特性3:闭包可以更新外部函数的值
  >  function updatedata(){
  >    var data = 0;
  >    function newdata(val){
  >      data = val
  >      console.log(data)
  >    }
  >    return newdata 
  >  }
  >  var count = updatedata();
  >  count(1101) //1101
  >  count(1102)//1102
  >  ```
  >
  >  
  >
  >- 闭包的缺点？闭包会导致函数的变量一直保存在内存中，过多的闭包可能会导致内存泄漏
  >
  >- 经典题目
  >
  >  - 函数自增
  >
  >    ```javascript
  >    var fn =(function () {
  >        let i=0
  >        return function () {
  >            return i++
  >        }
  >    })()
  >    console.log(fn()) //0
  >    console.log(fn()) //1
  >    console.log(fn()) //2
  >    console.log(fn()) //3
  >    ```
  >
  >  - 结合作用域练和AO分析
  >
  >    ```javascript
  >    var scope = 'global scope'
  >    function checkscope(){
  >      var scope = 'local scope'
  >      function f(){
  >        return scope
  >      }
  >      return f
  >    }
  >    var foo = checkscope()
  >    foo()
  >    //作用域练和AO分析
  >    //1. 进入全局代码，创建全局上下文，全局上下文压入执行上下文栈；
  >    //2. 全局执行上下文初始化；
  >    //3. 执行checkscope函数，创建checkscope函数上下文，checkscope函数上下文压入执行上下文栈；
  >    //4. checkscope执行上下文初始化，创建变量对象、作用域链等
  >    //5. checkscope函数执行完毕，从执行上下文栈弹出；
  >    //6. 执行f函数，创建f函数上下文栈，f函数上下文压入执行上下文栈
  >    //7. f执行上下文初始化，创建变量对象
  >    //8. f函数执行完毕，从执行上下文栈中弹出
  >    //重点：f执行的时候，checkscope函数上下文弹出，f如何获取scope变量？
  >    //函数上下文维护了一个作用域链，会指向checkscope作用域链，
  >    fContext={
  >      Scope:[AO，checkscopeContext.AO,globalContext.AO]
  >    }
  >    //当前的执行关系：当前作用域>>>checkscope作用域>>>>全局作用域，即使checkscope被销毁，但checkscopeContext.AO还在内存中，f可以通过f的作用域链找到scope
  >    ```
  >
  >  - 循环
  >
  >    ```javascript
  >    var data = []
  >    for(var i = 0;i<3;i++){
  >    	data[i] = (function(i){
  >        return function(){
  >          console.log(i)
  >        }
  >      })(i)
  >    }
  >    data[0]()
  >    data[1]()
  >    data[2]()
  >    ```
  >
  >    

- this

  >- this的四条绑定规则
  >
  >  - 默认绑定
  >
  >    独立函数调用时，this 指向全局对象（window），如果使用严格模式，那么全局对象无法使用默认绑定， this绑定至 undefined。
  >
  >  - 隐式绑定
  >
  >    - 函数this是指向调用者
  >
  >      ```javascript
  >      function foo() {
  >        console.log( this.a);
  >      }
  >      var obj = {
  >        a: 2,
  >        foo: foo
  >      };
  >      obj.foo();  // 2
  >      //obj1.obj2.foo(); // foo 中的 this 与 obj2 绑定
  >      ```
  >
  >    - 问题：隐式丢失
  >
  >      - 描述：隐式丢失指的是函数中的 this 丢失绑定对象，即它会应用第 1 条的默认绑定规则，从而将 this 绑定到全局对象或者 undefined 上，取决于是否在严格模式下运行。
  >      - 以下情况会发生隐式丢失
  >        1. 绑定至上下文对象的函数被赋值给一个新的函数，然后调用这个新的函数时
  >        2. 传入回调函数时
  >
  >  - 显示绑定
  >
  >    - 显式绑定的核心是 JavaScript 内置的 call(..) 和 apply(..) 方法，call 和 apply bind的this第一个参数 （显示指向）
  >
  >  - new 绑定： 构造函数的this 是new 之后的新对象 （构造器）
  >
  >- call bind apply： 改变函数执行时的上下文（改变函数运行时的this指向）
  >
  >  - apply
  >
  >    ```javascript
  >    //第二个参数为数组
  >    //1.将函数设为对象的属性
  >    //2.执行该函数
  >    //3.删除该函数
  >    Function.prototype.apply = function(ctx,arr){
  >    	//context 为null或者undefined 设置默认值
  >      var ctx = ctx || window;
  >      ctx.fn = this; 
  >      let res;
  >       if (!arr) {
  >         res = ctx.fn(arg)
  >       }else{
  >         //res = ctx.fn(...arr)
  >         //正常传参 通过eval方法拼接成一个函数
  >         var args=[];
  >         for(let i=0;i<arr.length;i++){
  >           args.push('arr['+i+']')
  >         }
  >         res = eval('ctx.fn('+args+')')
  >       }
  >      delete ctx.fn
  >      return res;
  >    }
  >    ```
  >
  >  - call
  >
  >    ```js
  >    Function.prototype.call = function(ctx){
  >      var  ctx = ctx || window;
  >      ctx.fn = this;
  >      var args = [];
  >      for(let i=0;i<arguments.length;i++){
  >        args.push('arguments['+i+']')
  >      }
  >      var res = eval('ctx.fn('+args+')')
  >      delete ctx.fn
  >      return res;
  >    }
  >    ```
  >
  >  - Bind
  >
  >    ```javascript
  >    //返回一个函数
  >    //可以传入参数（使用bind时和bind新生成的函数都可以传参）
  >    //当 bind 返回的函数作为构造函数的时候，bind 时指定的 this 值会失效，但传入的参数依然生效
  >    Function.prototype.bind = function(ctx){
  >       if(typeof this !== 'function'){ //非函数处理
  >          throw new Error("Function.prototype.bind ---");
  >       }
  >      var args = Array.prototype.slice.call(arguments,1)
  >      var fn = this;
  >      var _fn = function(){}
  >      var bound = function(){
  >        let params =[...args,...arguments]  
  >        let _this = this instanceof _fn ? this : ctx;
  >        fn.apply(_this,args.concat(params))
  >      }
  >      _fn.prototype = fn.prototype;
  >      bound.prototype = new _fn();
  >      return bound;
  >    }
  >    ```
  >
  >  - 区别
  >
  >    call和apply改变了函数的this上下文后便执行该函数,而bind则是返回改变了上下文后的一个函数。
  >
  >- 经典题目
  >
  >  - 怎么利用call、apply来求一个数组中最大或者最小值
  >
  >    ```javascript
  >    let arr = [1, 2, 19, 6];
  >    Math.max.call(null, ...arr)
  >    Math.max.apply(null, arr)
  >    var fn=Math.max.bind(null,...arr)
  >    fn()
  >    ```
  >
  >    
  >
  >  - 如何利用call、apply来做继承
  >
  >  - apply、call、bind的区别和主要应用场景
  >
  >    - 将类数组/含有length属性的对象转化为数组
  >    - 求数组中的最大和最小值
  >    - 数组追加
  >    - 利用call和apply做继承
  >    - 判断变量类型

##### ES6ES7

>- 1.ES6是什么？
>
>  ECMAScript 6.0（以下简称 ES6）是 JavaScript 语言的下一代标准，已经在 2015 年 6 月正式发布了。 ECMA是标准，Javascript是ECMA 的实现。因为js也是一种语言，但凡语言都有一套标准，而ECMA就是javascript的标准。在2015年正式发布了ECMAscript6.0，简称ES6，又称为ECMAscript2015。
>
>- 2.var、let、const（声明方式）
>
>  - 类别
>    - 变量提升
>    - 暂时性死区
>    - 重复声明
>    - 块作用域有效
>    - 初始值
>    - 重新赋值
>  - 区别
>    - let/const 定义的变量不会出现变量提升（词法环境），而 var 定义的变量会提升（变量环境）。
>    - 相同作用域中，let 和 const 不允许重复声明，var 允许重复声明。
>    - const 声明变量时必须设置初始值
>    - const 声明一个只读的常量，这个常量不可改变
>    - let/const 声明的变量仅在块级作用域中有效。而 var 声明的变量在块级作用域外仍能访问到。
>    - 顶层作用域中 var 声明的变量挂在window上(浏览器环境)
>    - let/const有暂时性死区的问题，即let/const 声明的变量，在定义之前都是不可用的。如果使用会抛出错误。
>
>- 3.变量的解构赋值
>
>  - 数组的解构赋值
>
>    `let [aa,bb,cc]=[0,1,2]`
>
>  - 对象的解构赋值
>
>    ```javascript
>    let { cnName, enName } = {
>      id: '151521574',
>      cnName: '张生',
>      enName: 'Ronnie'
>    };
>    console.log(cnName, enName); //'张生'，'Ronnie'
>    ```
>
>- 4.箭头函数
>
>  -  es6之前的函数的this指向调用函数时所在的对象，而箭头函数的this指向函数定义时所在的对象
>
>  - 箭头函数及其this问题
>
>  1. this对象的指向是可变的，但是在箭头函数中，它是固定的。
>  2. this指向的固定化，并不是因为箭头函数内部有绑定this的机制，实际原因是箭头函数根本没有自己的this，导致内部的this就是外层代码块的this。正是因为它没有this，所以也就不能用作构造函数。
>  3. 箭头函数里面根本没有自己的this，而是引用外层的this。
>  4. 由于箭头函数没有自己的this，所以当然也就不能用call()、apply()、bind()这些方法去改变this的指向
>
>- 5.symbol
>
>  - 是什么？
>
>    symbols 是一种无法被重建的基本类型。这时 symbols 有点类似与对象创建的实例互相不相等的情况，但同时 symbols 又是一种无法被改变的基本类型数据。
>
>    ```javascript
>    const s1 = Symbol();
>    const s2 = Symbol();
>    console.log(s1 === s2); // false
>    ```
>
>  - 作用？
>
>    1. symbols 作为对象的属性
>    2. 阻止对象属性名冲突 （扩展对象属性很有用）
>    3. 模拟私有属性
>
>- 6.module模块
>
>  - 模块化发展历程
>    1. LIFE ：使用自执行函数来实现模块化，其特点是在一个单独的函数作用域中执行代码，避免变量冲突；
>    2. AMD：使用requireJS来编写模块化，其特点是依赖必须提前声明好
>    3. CMD:  使用seaJS 来编写模块化，其特点是可以动态引入依赖文件
>    4. CommonJS： nodejs中自带的模块化，`var fs = require('fs')`
>    5. UMD: 兼容AMD commonjs模块化语法
>    6. wecpack(require.ensure):  webpack2.x中的代码分割
>    7. ES modules: es6引入的模块化，支持import 引入其他的js
>  - 模块化加载方案比较
>    - AMD 和CMD
>      - 定义：AMD 和 CMD 都是用于浏览器端的模块规范
>      - AMD: 是requirejs在推广中对模块化定义的产出，其主要是定义了define函数如何书写
>      - CMD: 是seajs在推广中对模块化定义的产出,描述该如何定义模块，如何引入模块，如何导出模块
>      - 区别：AMD推崇依赖前置，提前执行、CMD推崇依赖就近，延迟执行
>    - Commonjs 和AMD
>      - CommonJS 规范加载模块是同步的，也就是说，只有加载完成，才能执行后面的操作
>      - AMD规范则是非同步加载模块，允许指定回调函数
>      - 但是，如果是浏览器环境，要从服务器端加载模块，这时就必须采用非同步模式，因此浏览器端一般采用 AMD 规范
>    - ES6和commonjs
>      - 注意！浏览器加载 ES6 模块，也使用 <script> 标签，但是要加入type="module" 属性。
>      - CommonJS 模块输出的是一个值的拷贝，ES6 模块输出的是值的引用。
>      - CommonJS 模块是运行时加载，ES6 模块是编译时输出接口
>
>- 8.class
>
>  - 语法
>
>    - super关键字的使用
>    - static关键字
>
>  - ES5/ES6 的继承除了写法以外还有什么区别？
>
>    1. class 声明会提升，但不会初始化赋值。Foo 进入暂时性死区，类似于 let、const 声明变量。
>
>    2. class 声明内部会启用严格模式
>
>    3. class 的所有方法（包括静态方法和实例方法）都是不可枚举的
>
>    4. class 的所有方法（包括静态方法和实例方法）都没有原型对象 prototype，所以也没有[[construct]]，不能使用 new 来调用
>
>    5. 必须使用 new 调用 class
>
>    6. class 内部无法重写类名
>
>       ES5 的继承，实质是先创造子类的实例对象this，然后再将父类的方法添加到this上面。ES6 的继承机制完全不同，实质是先将父类实例对象的属性和方法，加到this上面（所以必须先调用super方法），然后再用子类的构造函数修改this
>
>- 9.set 和 map
>
>  - set
>    - 是什么？
>      - Set是一种叫做集合的数据结构
>      - Set是ES6引入的一种类似Array的新的数据结构，Set实例的成员类似于数组item成员，区别是Set实例的成员都是唯一，不重复的。这个特性可以轻松地实现数组去重
>    - 应用场景：数组的去重
>    - 特点
>      1. 成员唯一，，唯一且不重复
>      2. [value, value]，键值与键名是一致的（或者说只有键值，没有键名）
>      3. 可以遍历，方法有：add、delete、has
>  - Weakset 
>    - 特点
>      1. 成员都是对象
>      2. 成员都是弱引用，可以被垃圾回收机制收回，可以用来保存dom节点，不易造成内存泄露；
>      3. 不能遍历，方法有：add、delete、has
>  - map 
>    - 是什么？
>      - Map是一种叫做字典的数据结构
>      - Map是ES6引入的一种类似Object的新的数据结构，Map可以理解为是Object的超集，打破了以传统键值对形式定义对象，对象的key不再局限于字符串，也可以是Object。可以更加全面的描述对象的属性
>    - 应用场景：数据存储
>    - 特点；
>      1. 本质上是键值对的集合，类似集合
>      2. 可以遍历，方法很多可以跟各种数据格式转换
>  - weakMap
>    - 特点
>      1. 只接受对象作为键名（null除外），不接受其他类型的值作为键名
>      2. 键名是弱引用，键值可以是任意的，键名所指向的对象可以被垃圾回收，此时键名是无效的
>      3. 不能遍历，方法有get、set、has、delete
>  - Set 和 Map
>    - Set和Map主要的应用场景在于数组去重和数据存储
>    - Set是一种叫做集合的数据结构，Map是一种叫做字典的数据结构
>  - Set与WeakSet区别
>    1. WeakSet只能存放对象
>    2. WeakSet不支持遍历, 没有size属性
>    3. WeakSet存放的对象不会计入到对象的引用技术, 因此不会影响GC的回收
>    4. WeakSet存在的对象如果在外界消失了, 那么在WeakSet里面也会不存在
>  - Map与WeakMap区别
>    1. WeakMap只能接受对象作为键名字(null除外)
>    2. WeakMap键名指向对象不会计入对象的引用数
>
>- 10.proxy
>
>  - 概念
>
>    Proxy是ES6新增的一个构造函数，这个词的原意是代理，用在这里表示由它来“代理”某些操作，可以译为“代理器”。Proxy 可以理解成，在目标对象之前架设一层“拦截”，外界对该对象的访问，都必须先通过这层拦截，因此提供了一种机制，可以对外界的访问进行过滤和改写
>
>  - 语法：`let pro = new Proxy(target,handler); `
>
>    target参数表示所要拦截的目标对象
>
>    handler参数也是一个对象，用来定制拦截行为。一共有十三种
>
>- 11.reflect
>
>  - 是什么
>    - Reflect对象与Proxy对象一样，也是 ES6 为了操作对象而提供的新 API
>  - 设计目的
>    1. 一是将原生的一些零散分布在Object、Function或者全局函数里的方法(如apply、delete、get、set等等)，统一整合到Reflect上，这样可以更加方便更加统一的管理一些原生API。
>    2. 修改某些Object方法的返回结果，让其变得更合理。
>    3. Reflect对象的方法与Proxy对象的方法一一对应，只要是Proxy对象的方法，就能在Reflect对象上找到对应的方法。
>
>- 12.相关问题
>
>  1. ES6是什么，为什么要学习它，不学习ES6会怎么样?
>
>     ES6是新一代的JS语言标准，对JS语言核心内容做了升级优化，规范了JS使用标准，新增了JS原生方法，使得JS使用更加规范，更加优雅，更适合大型应用的开发
>
>  2. ES5、ES6和ES2015有什么区别?
>
>     ES2015特指在2015年发布的新一代JS语言标准，ES6泛指下一代JS语言标准，包含ES2015、ES2016、ES2017、ES2018等。现阶段在绝大部分场景下，ES2015默认等同ES6。ES5泛指上一代语言标准。ES2015可以理解为ES5和ES6的时间分界线。
>
>  3. babel是什么？有什么用？
>
>     babel是一个 ES6 转码器，可以将 ES6 代码转为 ES5 代码，以便兼容那些还没支持ES6的平台。
>
>  4. let有什么用？和var的区别？
>
>     没有块级作用域回来带很多难以理解的问题，比如for循环var变量泄露，变量覆盖等问题。let 声明的变量拥有自己的块级作用域，且修复了var声明变量带来的变量提升问题。
>
>  5. ES6对String字符串类型做的常用升级优化？
>
>     - 优化部分
>
>       ES6新增了字符串模板，在拼接大段字符串时，用反斜杠(`)取代以往的字符串相加的形式，能保留所有空格和换行，使得字符串拼接看起来更加直观，更加优雅
>
>     - 升级部分
>
>       ES6在String原型上新增了includes()方法，用于取代传统的只能用indexOf查找包含字符的方法(indexOf返回-1表示没查到不如includes方法返回false更明确，语义更清晰), 此外还新增了startsWith(), endsWith(), padStart(),padEnd(),repeat()等方法，可方便的用于查找，补全字符串
>
>  6. 举一些ES6对Number数字类型做的常用升级优化?
>
>     - 优化部分
>
>       ES6在Number原型上新增了isFinite(), isNaN()方法，用来取代传统的全局isFinite(), isNaN()方法检测数值是否有限、是否是NaN。ES5的isFinite(), isNaN()方法都会先将非数值类型的参数转化为Number类型再做判断，这其实是不合理的，最造成isNaN('NaN') === true的奇怪行为--'NaN'是一个字符串，但是isNaN却说这就是NaN。而Number.isFinite()和Number.isNaN()则不会有此类问题(Number.isNaN('NaN') === false)。
>
>     - 升级部分
>
>       ES6在Math对象上新增了Math.cbrt()，trunc()，hypot()等等较多的科学计数法运算方法，可以更加全面的进行立方根、求和立方根等等科学计算。
>
>  7. 举一些ES6对Array数组类型做的常用升级优化?
>
>     - 优化部分
>
>       - 数组解构赋值。ES6可以直接以let [a,b,c] = [1,2,3]形式进行变量赋值，在声明较多变量时，不用再写很多let(var),且映射关系清晰，且支持赋默认值
>       - 扩展运算符。ES6新增的扩展运算符(...)(重要),可以轻松的实现数组和松散序列的相互转化，可以取代arguments对象和apply方法，轻松获取未知参数个数情况下的参数集合。（尤其是在ES5中，arguments并不是一个真正的数组，而是一个类数组的对象，但是扩展运算符的逆运算却可以返回一个真正的数组）。扩展运算符还可以轻松方便的实现数组的复制和解构赋值（let a = [2,3,4]; let b = [...a]）
>
>     - 升级部分
>
>       ES6在Array原型上新增了find()方法，用于取代传统的只能用indexOf查找包含数组项目的方法,且修复了indexOf查找不到NaN的bug([NaN].indexOf(NaN) === -1).此外还新增了copyWithin(), includes(), fill(),flat()等方法，可方便的用于字符串的查找，补全,转换等
>
>  8. 举一些ES6对Object对象类型做的常用升级优化?
>
>     - 优化部分
>       - 对象属性变量式声明。ES6可以直接以变量形式声明对象属性或者方法。比传统的键值对形式声明更加简洁，更加方便，语义更加清晰。
>       - 对象的解构赋值
>       - 对象的扩展运算符(...)
>       - super 关键字。ES6在Class类里新增了类似this的关键字super。同this总是指向当前函数所在的对象不同，super关键字总是指向当前函数所在对象的原型对象
>     - 升级部分
>       - ES6在Object原型上新增了is()方法，做两个目标对象的相等比较，用来完善'==='方法。'==='方法中NaN === NaN //false其实是不合理的，Object.is修复了这个小bug。(Object.is(NaN, NaN) // true)
>       - ES6在Object原型上新增了assign()方法，用于对象新增属性或者多个对象合并  前拷贝
>       - ES6在Object原型上新增了getOwnPropertyDescriptors()方法，此方法增强了ES5中getOwnPropertyDescriptor()方法，可以获取指定对象所有自身属性的描述对象。结合defineProperties()方法，可以完美复制对象，包括复制get和set属性
>       - ES6在Object原型上新增了getPrototypeOf()和setPrototypeOf()方法，用来获取或设置当前对象的prototype对象。获取或设置当前对象的prototype对象时，都应该采用ES6新增的标准用法
>       - ES6在Object原型上还新增了Object.keys()，Object.values()，Object.entries()方法，用来获取对象的所有键、所有值和所有键值对数组
>
>  9. 举一些ES6对Function函数类型做的常用升级优化?
>
>     - 优化部分
>
>       - 箭头函数，解决了this的运行机制
>         - 箭头函数内的this指向的是函数定义时所在的对象，而不是函数执行时所在的对象。
>         - 箭头函数不能用作构造函数，因为它没有自己的this，无法实例化。
>         - 也是因为箭头函数没有自己的this,所以箭头函数 内也不存在arguments对象。（可以用扩展运算符代替
>
>     - 升级部分
>
>       - 双冒号运算符，用来取代以往的bind，call,和apply(浏览器暂不支持，Babel已经支持转码)
>
>         ```javascript
>         foo::bar;
>         // 等同于
>         bar.bind(foo);
>         
>         foo::bar(...arguments);
>         // 等同于
>         bar.apply(foo, arguments);
>         ```
>
>  10. symbol是什么？有什么用？
>
>      - symbol是一种无法被重建的基本类型，这时 symbols 有点类似与对象创建的实例互相不相等的情况，但同时 symbols 又是一种无法被改变的基本类型数据。
>      - 作用
>        - symbols作为对象的属性，防止属性名冲突；模拟私有属性
>
>  11. set是什么？有什么用？
>
>      - Set是一种类似array的数据结构，区别是每个成员都是唯一的不重复的，可轻松实现数组去重；
>
>  12. map是什么？有什么用？
>
>      - map是类似object的数据结构，对象的key不再局限于字符串，也可以是对象，更全面的描述对象的属性；
>
>  13. proxy是什么？有什么用？
>
>      - proxy是新增的一个构造函数，代理某些操作，简称代理器，可以理解为，，在目标对象之前有一层拦截，外界对对象的访问，都先通过该拦截
>
>  14. Reflect是什么，有什么作用？
>
>      - Reflect对象与Proxy对象一样，也是 ES6 为了操作对象而提供的新 API
>      - 作用
>        - 一是将原生的一些零散分布在Object、Function或者全局函数里的方法(如apply、delete、get、set等等)，统一整合到Reflect上，这样可以更加方便更加统一的管理一些原生API。
>        - 其次就是因为Proxy可以改写默认的原生API，如果一旦原生API别改写可能就找不到了，所以Reflect也可以起到备份原生API的作用，使得即使原生API被改写了之后，也可以在被改写之后的API用上默认的API。
>
>  15. promise是什么，有什么作用？
>
>      Promise是ES6引入的一个新的对象，他的主要作用是用来解决JS异步机制里，回调机制产生的“回调地狱”。它并不是什么突破性的API，只是封装了异步回调形式，使得异步回调可以写的更加优雅，可读性更高，而且可以链式调用。
>
>  16. Iterator是什么，有什么作用？
>
>      - 一种设计标准，来统一所有可遍历类型的遍历方式。Iterator正是这样一种标准。或者说是一种规范理念
>      - Set、Map都不能用for循环遍历，解决这个问题有两种方案，一种是为Set、Map单独新增一个用来遍历的API，另一种是为Set、Map、Array、Object新增一个统一的遍历API，显然，第二种更好，ES6也就顺其自然的需要一种设计标准，来统一所有可遍历类型的遍历方式
>      - Iterator标准的具体实现是Iterator遍历器。Iterator标准规定，所有部署了key值为[Symbol.iterator]，且[Symbol.iterator]的value是标准的Iterator接口函数(标准的Iterator接口函数: 该函数必须返回一个对象，且对象中包含next方法，且执行next()能返回包含value/done属性的Iterator对象)的对象，都称之为可遍历对象，next()后返回的Iterator对象也就是Iterator遍历器
>
>  17. for...in 和for...of有什么区别？
>
>      - ES6规定，有所部署了载了Iterator接口的对象(可遍历对象)都可以通过for...of去遍历，而for..in仅仅可以遍历对象。
>      - 这也就意味着，数组也可以用for...of遍历，这极大地方便了数组的取值，且避免了很多程序用for..in去遍历数组的恶习。上面提到的扩展运算符本质上也就是for..of循环的一种实现
>
>  18. Generator函数是什么，有什么作用？
>
>  19. async函数是什么，有什么作用？
>
>  20. Class、extends是什么，有什么作用？
>
>  21. module、export、import是什么，有什么作用？
>
>  22. 常前端代码开发中，有哪些值得用ES6去改进的编程优化或者规范？
>
>  23.  Iterator和for...of（Iterator遍历器的实现）
>
>  24. 循环语法比较及使用场景（for、forEach、for...in、for...of）
>
>  25. Generator及其异步方面的应用
>
>  26. async函数
>
>  27. 几种异步方式的比较
>
>  28. class基本语法和继承

##### 高阶函数

>- 概念：至少满足下列一个条件的函数
>
>  - 接受一个或者多个函数作为输入
>  - 输出一个函数
>
>- 详解条件
>
>  - 函数作为参数传递
>
>    - Array.prototype.map
>    - Array.prototype.filter
>    - Array.prototype.reduce
>
>  - 函数作为返回值输出
>
>    ```javascript
>    let isType = type=>obj=>{
>    	return Object.prototype.toString.call(obj) === '[object '+type+']';
>    }
>    isType('String')('123')
>    isType('Array')('[1,2,3]')
>    isType('Number')(123)
>    //
>    function add(a){
>      function sum(b){//使用闭包
>        a = a+b;//累加
>        return sum
>    	}
>      sum.toString = function(){//重写to s t ri n g
>        return a;
>      }
>      return sum //返回一个函数
>    }
>    ```
>
>- 柯里化
>
>  - 概念： 将多个参数的函数转换为一系列使用一个参数的函数，并且返回接受剩余参数而且返回结果的新函数
>
>  - 延迟计算
>
>    ```javascript
>    const add = (...args)=>args.reduce((a,b)=>a+b);
>    function currying(func){
>      const args =[];
>      return function result(...reset){
>        if(reset.length === 0){
>          return func(...args)
>        }else{
>          args.push(...reset);
>          return result
>        }
>      }
>    }
>    const sum = currying(add);
>    sum(1,2)(3) //未真正求值
>    sum(4) // 未真正求值
>    sum() //10
>    ```
>
>  - 动态创建函数
>
>    ```javascript
>    const addEvent = (function(){
>      if(window.addEventListener){
>        return function(type,el,fn,capture){
>          el.addEventListener(type,fn,capture)
>        }
>      }else if(window.attachEvent){
>        return function(type,el,fn){
>          el.attachEvent(type,fn)
>        }
>      }
>    })()
>    ```
>
>  - 参数复用
>
>    ```javascript
>    //改造前
>    [1,2,3].toString();//"1,2,3"
>    '123'.toString(); //"123"
>    123.toString(); //invaild or unexpected token
>    Object(123).toString();//"123"
>    //改造后
>    const toStr = Function.prototype.call.bind(Object.prototype.toString)
>    toStr([1,2,3])  //"[object Array]"
>    toStr('123')  //"[object String]"
>    //首先使用 Function.prototype.call函数置顶一个this值，然后.bind返回一个新函数，始终将Object.prototype.toString设置为传入参数，其实等价于(Object.prototype.toString.call()
>    ```
>
>- 实现curring
>
>  - 只传递函数一部分参数类调用他，让他返回一个函数去处理剩余的参数
>
>  - 核心思想：比较多次接受的参数总数和函数定义的入参数量，当接受参数的数量大于等于被currying函数的传入参数数量的时候，返回计算结果，否则返回一个继续接受参数的函数
>
>    ```javascript
>    const currying = function (fn,...args) {
>      if(args.length < fn.length){
>         return function () {
>            return currying(fn, ...args, ...arguments)
>         }
>      }else{
>         return fn(...args)
>      }
>    }
>    ```
>
>  - 拓展：fn.length 表示函数参数的个数，获取的是形参的个数，形参的个数不包括剩余参数的个数，仅仅包括第一个具有默认值之前的参数的个数
>
>    ```
>    ((a,b,c)=>{}).length     // 3
>    ((a,b,c=3)=>{}).length     // 2
>    ((a,b=1,c)=>{}).length     // 1
>    ((a=1,b,c)=>{}).length     // 0
>    ((...args)=>{}).length     // 0
>    ```
>
>    
>
>  

##### 异步

>- Vs 同步
>  - 指某段程序执行时不会阻塞其它程序执行，其表现形式为程序的执行顺序不依赖程序本身的书写顺序
>  - 通过event loop实现
>- 异步和单线程
>  - 单线程：单线程就是同时只做一件事，两段 JS 不能同时执行
>  - 为什么是单线程？避免DOM 渲染的冲突：1.浏览器需要渲染DOM  2.JS 可以修改DOM 结构  3.JS 执行的时候，浏览器DOM 渲染会暂停   .两段JS 也不能同时执行（都修改DOM 就冲突了） 5 .webworker支持多线程，但是不能访问DOM
>- Web Worker： 就是为 JavaScript 创造多线程环境，允许主线程创建 Worker 线程，将一些任务分配给后者运行。在主线程运行的同时，Worker 线程在后台运行，两者互不干扰。等到 Worker 线程完成计算任务，再把结果返回给主线程。这样的好处是，一些计算密集型或高延迟的任务，被 Worker 线程负担了，主线程（通常负责 UI 交互）就会很流畅，不会被阻塞或拖慢
>
>- 异步编程六种解决方案
>
>  - 回调函数
>
>    - 回调函数是异步操作最基本的方法
>    - 缺点：回调地狱；不能使用try catch 普获错误，不能直接return
>    - 优点：解决同步问题（只要有一个任务耗时长，后面的任务都必须排队，拖延整个程序的执行）
>
>  - 事件监听: `f1.on('done',f2);`
>
>  - 发布订阅：`jQuery.subscribe('done', f2);`
>
>  - Promise
>
>    - promise 是目前 JS 异步编程的主流解决方案，遵循 Promises/A+ 方案。Promise 用于异步操作，表示一个还未完成但是预期会完成的操作。
>
>    - Promise是ES6引入的一个新的对象，他的主要作用是用来解决JS异步机制里，回调机制产生的“回调地狱”。它并不是什么突破性的API，只是封装了异步回调形式，使得异步回调可以写的更加优雅，可读性更高，而且可以链式调用。
>
>    - 如何使用？
>
>      构造一个 promise 对象，并将要执行的异步函数传入到 promise 的参数中执行，并且在异步执行结束后调用 resolve( ) 函数，就可以在 promise 的 then 方法中获取到异步函数的执行结果
>
>    - promise原型上的方法
>
>      - Promise.prototype.then(onFulfilled, onRejected)
>      - Promise.prototype.catch(onRejected)
>      - Promise.prototype.finally(onFinally)
>
>    - promise 静态方法
>
>      - Promise.all()：接收一个 promise 对象数组,只有全部 promise 都已经变为 fulfilled 状态后才会继续后面的处理
>      - Promise.race():会在 promises 中第一个 promise 的状态扭转后就开始后面的处理（fulfilled、rejected 均可）
>      - Promise.resolve()
>      - Promise.reject()
>
>    - 优点： 将异步操作以同步操作的流程表达出来，promise链式调用，更好地解决了层层嵌套的回调地狱
>
>    - 缺点：不能取消执行，无法获取当前执行的进度信息；错误需要通过回调函数来普获，外部无法普获promise内部抛出的错误；
>
>  - generator函数
>
>    - 优点：可以控制函数的执行
>    - 缺点：使用较为复杂
>
>    - 是什么
>
>      - Generator 函数是 ES6 提供的一种异步编程解决方案，语法行为与传统函数完全不同。
>      - 如果说JavaScript是ECMAScript标准的一种具体实现、Iterator遍历器是Iterator的具体实现，那么Generator函数可以说是Iterator接口的具体实现方式。
>      - Generator函数可以通过配合Thunk 函数更轻松更优雅的实现异步编程和控制流管理
>
>    - 描述
>
>      - 执行Generator函数会返回一个遍历器对象，每一次Generator函数里面的yield都相当一次遍历器对象的next()方法，并且可以通过next(value)方法传入自定义的value,来改变Generator函数的行为。
>
>    - 能封装异步任务的根本原因
>
>      - 最大特点就是可以交出函数的执行权（即暂停执行）。Generator 函数可以暂停执行和恢复执行
>
>    - 两个特征
>
>      - function关键字与函数名之间有个星号；
>      - 函数内部使用yield表达式，定义不同的内部状态
>
>    - 过程
>
>      调用 Generator 函数，返回一个遍历器对象，代表 Generator 函数的内部指针。以后，每次调用遍历器对象的next方法，就会返回一个有着value和done两个属性的对象。value属性表示当前的内部状态的值，是yield表达式后面那个表达式的值；done属性是一个布尔值，表示是否遍历结束
>
>      ```javascript
>      var fetch = require('node-fetch');
>      function* gen(){
>        var url = 'https://api.github.com/users/github';
>        var result = yield fetch(url);
>        console.log(result.bio);
>      }
>      ```
>
>  - Async 和 await
>
>    - 含义：ES2017 标准引入了 async 函数，使得异步操作变得更加方便
>
>    - 是什么？
>
>      - 一句话，它就是 Generator 函数的语法糖。
>      - 一比较会发现，async函数就是将 Generator 函数的星号（*）替换成async，将yield替换成await，仅此而已。
>      - async函数可以理解为内置自动执行器的Generator函数语法糖，它配合ES6的Promise近乎完美的实现了异步编程解决方案。
>
>    - 相对于promise,优势在哪里？
>
>      - 处理 then 的调用链，能够更清晰准确的写出代码
>      - 并且也能优雅地解决回调地狱问题
>
>    - 相对Generator 函数，体现在以下4点
>
>      1. 内置执行器。 Generator 函数的执行必须靠执行器，所以才有了 co 函数库，而 async 函数自带执行器。也就是说，async 函数的执行，与普通函数一模一样，只要一行
>      2. 更好的语义。 async 和 await，比起星号和 yield，语义更清楚了。async 表示函数里有异步操作，await 表示紧跟在后面的表达式需要等待结果
>      3. 更广的适用性。 co 函数库约定，yield 命令后面只能是 Thunk 函数或 Promise 对象，而 async 函数的 await 命令后面，可以跟 Promise 对象和原始类型的值（数值、字符串和布尔值，但这时等同于同步操作）
>      4. 返回值是 Promise。async函数的返回值是 Promise 对象，这比 Generator 函数的返回值是 Iterator 对象方便多了。你可以用then方法指定下一步的操作。
>
>    - 缺点
>
>      当然async/await函数也存在一些缺点，因为 await 将异步代码改造成了同步代码，如果多个异步代码没有依赖性却使用了 await 会导致性能上的降低，代码没有依赖性的话，完全可以使用 Promise.all 的方式
>
>    - 实现
>
>      ```javascript
>      //定义一个promise,模拟异步请求，作用是传入的参数++
>      function getNum(num){
>        return new Promise((resolve,reject)=>{
>          setTimeout(()=>{
>            resolve(num++)
>          },1000)
>        })
>      }
>      //自动执行器，如果一个generator函数没有执行完，则递归调用
>      function asyncFun(func){
>        var gen = func();
>        function next(data){
>            var res = gen.next(data);
>        		if(res.done) return res.value;
>        		res.value.then((data)=>{
>          		next(data)
>        		})
>      	}
>        next();
>       }
>      //需要执行的generator函数，内部的数据在执行完成一步的promise后，再调用下一步
>      var func = function *(){
>        var f1 = yeild getNum(1);
>        var f2 = yeild getNum(f1);
>        console.log(f2)
>      }
>      asyncFun(func)
>      ```
>
>  - 总结
>
>    1. JS 异步编程进化史：callback -> promise -> generator -> async + await
>    2. async/await 函数的实现，就是将 Generator 函数和自动执行器，包装在一个函数里
>    3. async/await可以说是异步终极解决方案了
>
>- 相关问题
>
>  - 什么是单线程，和异步有什么关系？
>
>    单线程就是同时只做一件事，两段 JS 不能同时 执行，为了避免渲染dom的冲突，
>
>  - 什么是`event loop`?
>
>    事件轮询，实现异步的方案，具体：同步代码先执行，异步代码先放在异步队列中，待同步函数执行完毕，轮询执行 异步队列 的函数。
>
>  - 是否用过 jQuery 的 Deferred？
>
>    - 可以 jQuery 1.5 对ajax的改变举例
>
>      ```javascript
>      var ajax = $.ajax('data.json')
>      ajax.done(function () {
>       	console.log('success 1')
>       })
>       .fail(function () {
>       		console.log('error')
>       })
>       .done(function () {
>       		console.log('success 2')
>       })
>      console.log(ajax) //返回一个 deferred 对象
>      ```
>
>    - 说明如何简单的封装，使用 Deferred
>
>      ```javascript
>      function waitHandle() {
>       var dtd = $.Deferred() //创建一个 Deferred 对象
>       var wait = function (dtd) { //要求传入一个 Deferred 对象
>       	var task = function () {
>       		console.log('执行完成')
>       		dtd.resolve() //表示异步任务已经完成
>       		// dtd.reject() //表示异步任务失败或出错
>         }
>       	setTimeout(task, 2000)
>       		return dtd // 要求返回 Deferred 对象
>      	 }
>       		// 注意，这里一定要有返回值
>       		return wait(dtd)
>      }
>      ```
>
>    - 说明 ES6 promise 和 Deferred 的区别

##### API

>- 数组
>
>  - 改变原数组的API: `push、unshift、pop、shift、reverse、splice、sort`
>  - 不改变原数组的API: `join、slice、indexof、toString、concat、map、foreach、filter、every、some、reduce`
>  - 类数组转换为数组
>    - 类数组：可以通过索引访问元素，并且拥有 length 属性；没有数组的其他方法，例如 push ， forEach ， indexOf 
>    - ES5: Array.prototype.slice.call() 等同于 [].slice.call(arguments)
>    - ES6: Array.from()；...运算符、for of 直接遍历类数组（iterator接口）
>  - 稀疏数组和密集数组
>    - 稀疏数组：具有不连续索引的数组，其 length 属性值大于元素的个数
>    - 造成原因
>      - delete操作符
>      - 构造函数
>      - 在数组字面量中省略值
>      - 指定数组索引大于数组长度
>      - 指定数组长度大于当前数组长度
>    - 缺点：操作不统一
>  - 密集数组：具有连续索引的数组，其 length 属性值等于元素的个数
>  - 造成原因
>    - Array.apply(null, Array(3)) || Array.apply(null, {length: 3})
>    - Array.from({length: 3})
>    - [...Array(4)]
>
>- window全局对象(BOM)
>
>  - navigator导航器对象
>    - Navigator 对象包含有关浏览器的信息
>    - appCodeName 返回浏览器的代码名
>    - appName 返回浏览器的名称
>    - appVersion 返回浏览器的平台和版本信息
>    - cookieEnabled 返回指明浏览器中是否启用cookie的布尔值
>    - platform 返回运行浏览器的操作系统平台
>    - userAgent 返回由客户机发送服务器的user-agent头部的值
>  - screen显示器对象
>  - history对象
>    - back() 返回前一个URL
>    - forward() 返回下一个URL
>    - go() 返回某个具体页面
>  - location位置对象
>    - 属性
>      - hash 设置或返回从井号 (#) 开始的 URL（锚）。
>      - host 设置或返回主机名和当前 URL 的端口号。
>      - hostname 设置或返回当前 URL 的主机名
>      - href 设置或返回完整的 URL
>      - pathname 设置或返回当前 URL 的路径部分。
>      - port 设置或返回当前 URL 的端口号。
>      - protocol 设置或返回当前 URL 的协议。
>      - search 设置或返回从问号 (?) 开始的 URL（查询部分）
>    - 方法
>      - assign(URL) 加载新的文档
>      - reload() 重新加载当前页面
>      - replace(newURL) 用新的文档替换当前文档
>
>- ajax和 fetch
>
>  - ajax本质：是在 HTTP 协议的基础上以异步的方式与服务器进行通信
>
>  - 实现
>
>    ```javascript
>    function myAjax(url,callback){
>    	var xhr = new XMLHttpRequest();
>      xhr.open('GET'，url,true);
>      xhr.send();
>      xhr.onreadystagechange = function(){
>        if(xhr.readyState == 4 && xhr.status == 200){
>          callback(xhr.reponseText)
>        }
>      }
>    }
>    ```
>
>  - Fetch: Fetch 是浏览器提供的原生 AJAX 接口
>
>  - 为何出现？
>
>    - 由于原来的XMLHttpRequest不符合关注分离原则，且基于事件的模型在处理异步上已经没有现代的Promise等那么有优势。因此Fetch出现来解决这种问题
>    - Fetch API 提供了能够用于操作一部分 HTTP 的 JavaScript 接口，比如 requests 和 responses。它同时也提供了一个全局的 fetch() 方法——能够简单的异步的获取资源
>    - 使用 window.fetch 函数可以代替以前的 ![. ajax、](https://juejin.im/equation?tex=.%20ajax%E3%80%81).get 和 $.post
>
>  - 实现
>
>    ```javascript
>    fetch('http://example.com/movies.json')
>      .then(function(response) {
>        return response.json();
>      })
>      .then(function(myJson) {
>        console.log(myJson);
>      });
>    ```
>
>  - readyState状态值
>
>    - readyState是XMLHttpRequest对象的一个属性，标识当前XMLHttpRequest对象处于什么状态
>    - 5个状态值：
>      - 0: 请求未初始化
>      - 1: 载入，XMLHttpRequest对象开始发送请求
>      - 2: 载入完成，XMLHttpRequest对象的请求发送完成
>      - 3: 解析，XMLHttpRequest对象开始读取服务器的响应
>      - 4: 完成，XMLHttpRequest对象读取服务器响应结束
>
>  - status状态码
>
>    - status是XMLHttpRequest对象的一个属性，表示响应的http状态码
>    - http状态码
>      - 1xx：信息响应类，表示接收到请求并且继续处理
>      - 2xx：处理成功响应类，表示动作被成功接收、理解和接受
>      - 3xx：重定向响应类，为了完成指定的动作，必须接受进一步处理
>      - 4xx：客户端错误，客户请求包含语法错误或者是不能正确执行
>      - 5xx：服务端错误，服务器不能正确执行一个正确的请求
>    - 常见的状态码
>      - 200 OK：成功，很棒。
>      - 301永久移动：已永久移动到新位置。
>      - 302（临时移动）：暂时移到新位置。
>      - 304未修改：东西跟之前长一样，可以从快取拿就好。
>      - 400错误的请求：明显的用户端错误，伺服器无法处理这个请求。
>      - 401未经授权：未认证，可能需要登录或Token。
>      - 403 Forbidden：没有权限。
>      - 404未找到：找不到资源。
>      - 500内部服务器错误：伺服器端错误。
>      - 502错误的网关：通常是伺服器的某个服务没有正确执行。
>      - 503服务不可用：伺服器临时维护或快挂了，暂时无法处理请求。
>      - 504网关超时：伺服器上的服务没有回应
>
>- Web端即时通讯技术
>
>  即时通讯技术简单的说就是实现这样一种功能：服务器端可以即时地将数据的更新或变化反应到客户端，例如消息即时推送等功能都是通过这种技术实现的。但是在Web中，由于浏览器的限制，实现即时通讯需要借助一些方法。这种限制出现的主要原因是，一般的Web通信都是浏览器先发送请求到服务器，服务器再进行响应完成数据的现实更新
>
>  - 分类
>    - 一种是在HTTP基础上实现的：短轮训、comet
>    - 一种是不在HTTP基础上实现的：websocket
>  - 如何模拟双向通信（四种方式）
>    - 短l轮巡
>      - 客户端定时向服务器发送Ajax请求，服务器接到请求后马上返回响应信息并关闭连接。
>      - 优点 ： 后端编写容易
>      - 缺点 ： 请求中大半是无用，浪费宽带和服务器资源
>      - 适用 ： 小型应用
>    - 长轮询
>      - 客户端向服务器发送Ajax请求，服务器接到请求后 hold住连接，直到有新消息才返回响应信息并关闭连接，客户端处理完响应信息后再向服务器发送新的请求
>      - 优点 ：在无消息的情况下不会频繁的请求，耗费资源小
>      - 缺点: 服务器hold连接会消耗资源; 返回数据顺序无保证，难于管理维护
>    - 长链接
>      - 在页面嵌入一个隐藏iframe，将这个隐藏iframe的src属性设为对一个长连接的请求或是采用 xhr请求，服务器端就能源源不断的往客户端输入数据
>      - 优点:  消息及时到达，不发无用请求; 管理起来也相对方便
>      - 缺点：服务器维护一个长连接会增加开销
>    - Web socket
>      - WebSocket是Html5定义的一个新协议，与传统的http协议不同，该协议可以实现服务器与客户端之间全双工通信。简单来说，首先需要在客户端和服务器端建立起一个连接，这部分需要http。连接一旦建立，客户端和服务器端就处于平等的地位，可以相互发送数据，不存在请求和响应的区别
>      - 优点：实现了双向通信
>      - 缺点：服务器端的逻辑非常复杂

跨域

>- 定义
>
>  - 跨域是指从一个域名的网页去请求另一个域名的资源
>  - 跨域的严格一点的定义是：只要 协议，域名，端口有任何一个的不同，就被当作是跨域
>
>- 解决方案
>
>  - 跨域资源共享（CORS）
>
>    - 定义：必须在访问跨域资源时，浏览器与服务器应该如何沟通
>    - 思想：使用自定义的HTTP头部让浏览器与服务器进行沟通，从而决定请求或响应是应该成功还是失败
>    - 两种请求
>      - 简单请求： 就是在头信息之中，增加一个Origin字段
>      - 复杂请求：会在正式通信之前，增加一次HTTP查询请求，称为"预检"请求（preflight）
>    - 服务端
>      - 服务器端对于CORS的支持，主要就是通过设置Access-Control-Allow-Origin来进行的。如果浏览器检测到相应的设置，就可以允许Ajax进行跨域的访问
>
>  - JSONP
>
>    - 定义：JSONP是JSON的一种“使用模式”，可用于解决主流浏览器的跨域数据访问的问题
>
>    - 组成
>
>      - 回调函数：回调函数是当响应到来时应该在页面中调用的函数
>      - 数据： 而数据就是传入回调函数中的JSON数据。
>
>    - 原理
>
>      - 通过script标签引入一个js文件，这个js文件载入成功后会执行我们在url参数中指定的函数，并且会把我们需要的json数据作为参数传入。所以jsonp是需要服务器端的页面进行相应的配合的。（即用javascript动态加载一个script文件，同时定义一个callback函数给script执行而已。）
>
>        ```javascript
>        <script type="text/javascript">
>            function dosomething(jsondata){
>                //处理获得的json数据
>            }
>        </script>
>        <script src="http://example.com/data.php?callback=dosomething"></script>
>        
>        ```
>
>    - 缺点：可以实现解决get跨域请求，不支持post
>
>  - document.domain
>
>    - 方法：修改document.domain来跨子域
>
>    - 注意： 域必须相同，我们只能把document.domain设置成自身或更高一级的父域，且主同
>
>    - 作用域： 修改document.domain的方法只适用于不同子域的框架间的交互。
>
>      ```javascript
>      <iframe id = "iframe" src="http://example.com/b.html" onload = "test()"></iframe>
>      <script type="text/javascript">
>          document.domain = 'example.com';//设置成主域
>          function test(){
>          }
>      </script>
>      ```
>
>  - window.name
>
>    - 是一个可读可写的属性，有个很有意思的跨页面特性
>    - 页面如果设置了window.name，即使进行了页面跳转到了其他页面，这个window.name还是会保留
>
>  - postmessage
>
>    - postMessage是html5引入的API,postMessage()方法允许来自不同源的脚本采用异步方式进行有效的通信,可以实现跨文本文档,多窗口,跨域消息传递.多用于窗口间数据通信,这也使它成为跨域通信的一种有效的解决方案
>
>    - 使用
>
>      - 发送数据
>
>        - otherWindow.postMessage(message, targetOrigin, [transfer]);
>        - otherWindow 【窗口的一个引用,比如iframe的contentWindow属性
>
>      - 接收数据
>
>        ```javascript
>        window.addEventListener("message", receiveMessage, false) ;
>        function receiveMessage(event) {
>             var origin= event.origin;
>             console.log(event);
>        }
>        ```
>
>      - 使用场景
>
>        - 跨域通信(包括GET请求和POST请求)
>        - WebWorker： 用于收集埋点数据,可以用于大量复杂的数据计算,复杂的图像处理,大数据的处理.因为它不会阻碍主线程的正常执行和页面UI的渲染.
>        - Service Worker： 离线存储的一个最佳的解决方案
>
>  - 代理服务器
>
>    - 代理，也称正向代理，是指一个位于客户端和目标服务器(target server)之间的服务器，为了从目标服务器取得内容，客户端向代理发送一个请求并指定目标(目标服务器)，然后代理向目标服务器转交请求并将获得的内容返回给客户端
>    - 代理服务器需要做：
>      - 接受客户端 请求 。
>      - 将 请求 转发给服务器
>      - 拿到服务器 响应 数据
>      - 将 响应 转发给客户端
>
>  - CORS VS JSONP
>
>    - JSONP只能实现GET请求，而CORS支持所有类型的HTTP请求。
>    - 使用CORS，开发者可以使用普通的XMLHttpRequest发起请求和获得数据，比起JSONP有更好的错误处理。
>    - JSONP主要被老的浏览器支持，它们往往不支持CORS，而绝大多数现代浏览器都已经支持了CORS）

##### 动画

>- setTimeOut
>  - setTimeout 其实就是通过设置一个间隔时间来不断的改变图像的位置，从而达到动画效果的。但利用seTimeout实现的动画在某些低端机上会出现卡顿、抖动的现象。导致setTimeout的执行步调和屏幕的刷新步调不一致，从而引起丢帧现象
>  - 原因
>    - setTimeout的执行时间并不是确定的。setTimeout 任务被放进了异步队列中，只有当主线程上的任务执行完以后，才会去检查该队列里的任务是否需要开始执行，因此 setTimeout 的实际执行时间一般要比其设定的时间晚一些。
>    - 刷新频率受屏幕分辨率和屏幕尺寸的影响，因此不同设备的屏幕刷新频率可能会不同，而 setTimeout只能设置一个固定的时间间隔，这个时间不一定和屏幕的刷新时间相同。
>- requestanimationframe：html5 为了满足高性能动画的需求而提供的API，表意是请求动画帧
>- VS
>  - 与setTimeout相比，requestAnimationFrame最大的优势是由系统来决定回调函数的执行时机
>  - 它能保证回调函数在屏幕每一次的刷新间隔中只被执行一次，这样就不会引起丢帧现象，也不会导致动画出现卡顿的问题。

##### 事件

>- 事件流
>  - 事件流描述的是从页面中接收事件的顺序，IE和Netscape提出来差不多完全相反的事件流的概念，IE事件流是事件冒泡流，Netscape事件流是事件捕获流
>- DOM事件级别
>  - DOM0事件
>    - 定义： 通过文档对象（document）获取元素引用，使用DOM0级方法指定的事件处理程序被认为是元素的方法，处理程序是在元素的作用域进行的，程序中this是引用的是当前元素
>    - 三个特点
>      - 触发时机：DOM0级的事件处理程式只能在事件冒泡阶段触发。
>      - 每个属性只能绑定一个事件
>      - this指针的指向：用DOM0级的方式绑定事件是在元素对象的作用域内运行，因此在事件函数内的this属性不是引用全局对象，而是引用当前元素对象
>  - DOM2事件
>    - 定义： DOM2级事件’定义了两个方法，用于处理指定和删除事件处理程序的操作：addEventListener()和removeEventListener();所有的DOM节点都包含这两种方法
>    - DOM2级事件规定的事件流包括三个阶段
>      - 事件捕获阶段
>      - 处于目标阶段
>      - 事件冒泡阶段
>    - 优点： 可以添加多个事件处理程序
>  - DOM3事件：DOM3级事件就是在DOM2基础上增加了更多的事件类型
>    - 焦点事件，当元素获得或失去焦点时触发，如：blur、focus
>    - 鼠标事件，当用户通过鼠标在页面执行操作时触发如：dbclick、mouseup
>    - 滚轮事件，当使用鼠标滚轮或类似设备时触发，如：mousewheel
>    - 文本事件，当在文档中输入文本时触发，如：textInput
>    - 键盘事件，当用户通过键盘在页面上执行操作时触发，如：keydown、keypress
>    - 合成事件，当为IME（输入法编辑器）输入字符时触发，如：compositionstart
>    - 变动事件，当底层DOM结构发生变化时触发，如：DOMsubtreeModified
>- 事件机制
>  - 冒泡机制：事件会从最内层的元素开始发生，一直向上传播，直到document对象
>  - 捕获机制：与事件冒泡相反，事件会从最外层开始发生，直到最具体的元素
>- 事件代理
>  - JavaScript高级程序设计上讲：事件委托就是利用事件冒泡，只指定一个事件处理程序，就可以管理某一类型的所有事件
>  - 关键：Event对象提供了一个属性叫target，可以返回事件的目标节点，我们成为事件源
>  - 适合委托的事件
>    - click，mousedown，mouseup，keydown，keyup，keypress
>  - 不适合：mousemove，每次都要计算它的位置，非常不好把控，在不如说focus，blur之类的，本身就没用冒泡的特性，自然就不能用事件委托了

##### Array原型方法

>- Object.prototype.toString.call()
>- [].prototype.shift.call()
>- Array.prototype.slice.apply(arguments) 将参数（Arguments对象）转为一个数组