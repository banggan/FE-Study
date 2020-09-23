- 实现new
    ```javascript
    //1. 创建空对象
    //2. 链接到原型
    //3. 绑定this
    //4. 返回新对象
    const new = function(ctor,...args){
        let obj = {};  // 1
        if(ctor.prototype !== null){
            obj.__proto__ = ctor.prototype; // 2
        }
        const res = ctor.apply(obj,args);  // 3使用apply，将构造函数中的this指向新对象，这样新对象就可以访问构造函数中的属性和方法
        // 4 如果返回值是一个对象就返回该对象，否则返回构造函数的一个实例对象
        if((typeof ctor === 'object' || typeof ctor === 'function') && ctor !==null){
            return res
        }
        //if(res instanceOf Object) return res
        return obj;
    }
    ```
- 实现call/apply
    ```javascript
    //call() 方法在使用一个指定的 this 值和若干个指定的参数值的前提下调用某个函数或方法
    //call 改变了this指向，调用函数
    // 1.将函数设为对象的属性   2. 执行该函数   3. 删除该函数
    Function.prototype.call = function(ctx){
        var ctx = ctx || window; // ctx为空 指向window
        ctx.fn = this;// 1.  this s是指调用call的函数
        var args = []
        for(let i =0;i<arguments.length;i++){
            args.push('arguments['+i+']')
        }
        //参数数组放到要执行的函数的参数里面去    eval 方法拼成一个函数
        var res = eval('ctx.fn('+args+')')  //2
        delete ctx.fn;//3. fn 是对象的属性名，反正最后也要删除它
        return res
    }
    //apply的区别在于call是传参数列表，apply传的是数组
    Function.prototype.apply = function(ctx,arr){
        var ctx = ctx || window;
        ctx.fn = this;
        var res;
        if(!arr){
            res = ctx.fn()
        }else{
            var args = []
            for(let i =0;i<arr.length;i++){
                args.push('arr['+i+']')
            }
            res = eval('ctx.fn('+args+')')
        }
        delete ctx.fn
        return res
    }
    ```
- 实现bind

    ```javascript
    //bind方法创建一个新的函数，在 bind() 被调用时，这个新函数的 this 被指定为 bind() 的第一个参数，而其余参数将作为新函数的参数，供调用时使用。说的通俗一点，bind与apply/call一样都能改变函数this指向，但bind并不会立即执行函数，而是返回一个绑定了this的新函数，你需要再次调用此函数才能达到最终执行。

    // bind函数 1.可以修改函数的this指向，2 bind返回一个绑定this的新函数 3. 支持函数科里化 4.this无法再被修改
    //版本一
    Function.prototype.bind1 = function(obj){
        var fn = this;
        return function(){
            fn.apply(obj)
        }
    }
    //满足里this的修改和函数的返回，但不支持函数传参
    //版本二
    Function.prototype.bind2 = function(obj){
        var args = Array.prototype.slice.call(arguments, 1); // 第0位是this
        var fn = this;
        return function(){
            fn.apply(obj,args)
        }
    }
    //bind支持函数科里化，再调用bind可以先传部分参数，再调用返回的bound的时候补全剩余参数
    //版本三
    Function.prototype.bind3 = function(obj){
        var args = Array.prototype.slice.call(arguments, 1); // 第0位是this
        var fn = this;
        return function(){
            //二次调用的时候抓取args对象
            var params =  Array.prototype.slice.call(arguments); 
            //注意concat顺序：args在前，因为只有这样才能让先传递的参数和fn的形参按顺序对应。
            fn.apply(obj,args.concat(params))
        }
    }
    //通过bind返回的boundFunction函数也能通过new运算符构造，只是在构造过程中，boundFunction已经确定的this会被忽略，且返回的实例还是会继承构造函数的构造器属性与原型属性，并且能正常接收参数。
    //在模拟bind方法时，返沪的bound函数在调用的时候需要考虑new调用和普通调用
    //如果是new调用，bound函数中的this指向实例自身，而如果是普通调用this指向obj，怎么区分呢
     Function.prototype.bind4 = function(obj){
        var args = Array.prototype.slice.call(arguments, 1); // 第0位是this
        var fn = this;
        var bound =  function(){
            //二次调用的时候抓取args对象
            var params =  Array.prototype.slice.call(arguments); 
            //注意concat顺序：args在前，因为只有这样才能让先传递的参数和fn的形参按顺序对应。
            //通过constructor判断调用方式，为true this指向实例，否则为obj
            fn.apply(this.constructor === fn ? this: obj,args.concat(params))
        }
        bound.prototype = fn.prototype;//原型链继承
        return bound;
    }
    //虽然构造函数产生的实例都是独立的存在，实例继承而来的构造器属性随便你怎么修改都不会影响构造函数本身
    //在创建实例时，我们可以抽象的理解成实例深拷贝了一份，这是属于实例自身的属性，后面再改都与构造函数不相关。而实例要用prototype属性时都是顺着原型链往上找，构造函数有便借给实例用了，一共就这一份，谁要是改了那就都得变。
    //借助空白函数作为中介

    Function.prototype.bind4 = function (obj){
        if(typeof this !== 'function'){ //非函数处理
            throw new Error("Function.prototype.bind - what is trying to b e bound is not callable");
        }
        var args = Array.prototype.slice.call(arguments, 1); // 第0位是this
        var fn = this;
        var fn_ = function(){}; //创建一个空白函数
        var bound = function(){
            var params =  Array.prototype.slice.call(arguments); 
            fn.apply(this.constructor === fn ? this : obj, args.concat(params));
        }
        fn_.prototype =  fn.prototype;
        bound.prototype = new fn_()
        return bound;
    }
    ```
- Object.create()
    ```javascript
    function create(proto){
        F = function(){};
        F.prototype = proto
        return new F
    }

    ```
- 实现 instanceOf
    ```javascript
    //instanceof 运算符用来检测 constructor.prototype 是否存在于参数 object 的原型链上
    function instanceof(L,R){
        var proR = R.prototype;//获取P的显示原型
        var proL = L.__proto__;//获取L的隐式原型
        while(true){
            if(proL === null) return false;
            if(proR === proL) return true;
            proL = L.__proto__;
        }
    }

    ```
- 防抖函数
    ```javascript
    //所谓防抖，就是指在触发事件后在n秒内函数只能执行一次，如果在n秒内又触发了事件，则会重新计算函数执行时间
    //对于短时间内连续触发的事件，防抖在于让某个时间内，事件函数只执行一次
    //按钮点击 服务端验证
    //立即执行
    const debounce = function(fn,delay){
        let timer = null;
        return (...args)=>{
            clearTimeout(timer)
            timer = setTimeout(()=>{
                fn.apply(this,args)
            },delay)
        }
    }
    //非立即执行
    const debounce = function(fn,delay){
        let timer = null ;
        return (...args) =>{
            var context = this;
            if(timer) clearTimeout(timer)

            let callNow = !timer;
            timer = setTimeout(()=>{
                timer = null
            },delay)
            if(callNow) fn.apply(context,args)
        }
    }

    ```
- 节流函数
    ```javascript
    //所谓节流，就是指连续触发事件但是在 n 秒中只执行一次函数
    //1. 拖拽场景 2. 缩放场景 3. 动画场景
    const throttle = function(fn,delay){
        let flag  = true ;
        return (...args)=>{
            let context = this;
            if(!flag) return 
            flag = false;
            setTimeout(()=>{
                fn.apply(context.args);
                flag = true;
            })     
        }
    }

    ```
- ⽤setTimeout实现setInterval
    ```javascript
    function myInterval(fn, delay) { 
        const interval = () => {
            setTimeout(interval ,delay)
            fn() 
        }
        setTimeout(interval, delay)
    }
    ```
- 字符串全排列
    ```javascript
    var fullpermutate = function(str){
        var res = []
        if(str.length>1){
            for(let i=0;i<str.length;i++){
                var curr = str[i];
                var reset = str.slice(0,i) + str.slice(i+1,str.length)
                var resetRes = fullpermutate(reset)
                for(let j=0;j<resetRes.length;j++){
                    var temp = curr + resetRes[j]
                    res.push(temp);
                }
            }
        }else if(str.length===1){
            res.push(str)
        }
        return res;
    }

    ```
- 深拷⻉
    ```javascript
    const deepCopy = function(obj){
        if(typeof obj !=='object') return  
        const newObj = obj instanceof Array ? []:{};
        for(let key in obj){
            if(obj.hasOwnProperty(key)){
                newObj[key] = typeof obj[key] =='object'? deepCopy(obj[key]) : obj[key];
            }
        }
        return newObj
    }
    //reduce版本 拷贝对象
    obj.reduce((acc,[key,value])=>{
        typeof value === 'object' ? {...acc,[key]:deepCopy(value)}:{...acc,[key]:value}
    },{})
    //数组
    obj.reduce((acc,cur)=>{
        cur instanceof Array ? [...acc,deepCopy(cur)]:[...acc,cur]
    },[])

    ```
- promise all 和 race
    ```javascript
    const myAll = function(promises){
        return new Promise((resolve,reject)=>{
            const len = promises.length;
            const res = [];
            let index = 0;
            for(let i =0;i<len;i++){
                Promise.resolve(promise[i]).then(data=>{
                    res[i] = data;
                    index++;
                    if(index === len) resolve(res)
                })
            }.catch(err=>{
                reject(err)
            })
        })
    }

    ```
- 一个整数是不是回文
    ```javascript
    const isPalindrome = function(str){
        var str = str+'';
        var left =0 ,right = str.length-1;
        while(left <= right){
            if(str[left] === str[right]){
                left ++;
                right --
            }else{
                return false
            }
        }
        return true
    }

    ```
- JSON.stringify
    ```javascript
    //非数组对象的属性不能保证以特定的顺序出现在序列化后的字符串中
    //布尔值、数字、字符串的包装对象在序列化过程中会自动转换成对应的原始值
    //undefined、任意的函数以及 symbol 值，在序列化过程中会被忽略（出现在非数组对象的属性值中时）或者被转换成 null（出现在数组中时）
    //所有以 symbol 为属性键的属性都会被完全忽略掉，即便 replacer 参数中强制指定包含了它们
    //不可枚举的属性会被忽略
    //如果一个对象的属性值通过某种间接的方式指回该对象本身，即循环引用，属性也会被忽略
    const myJsonStringify = function(obj){
        let type = typeof obj;
        if(type !=='object' || type === null){
            // undefind 等忽略
            if(/string | undefined | function/.text(type)){
                obj = '""'+obj+'""';
            }
            return String(obj);
        }else{
            let json = [];
            let isArr = (obj && obj.constructor === Arary);
            for(k in obj){
                let curr = obj[k];
                let currTypr = typeof curr;
                if(/string | undefined | function/.test(currType)){ // undefind 等忽略
                    curr = '""'+ curr +'""';
                }else if(currType === 'object'){ // 属性还是对象 则递归调用转换
                    curr = myJsonStringify(curr);
                }
                let currJson= isArr ? '':'""' + k + '":"' + String(curr);
                json.push(currJson)
            }
            let returnjson = isArr ? '[' :'{' + String(json) + isArr ? ']' :'}'
            return returnjson
        }
    }
    ```
- 返回字符串中连续出现的最多的字符
    ```javascript
    const maxSubStr = function(str){
        let len = srt.length,count = 1,max = 0,res = null;
        for(let i=0;i<len;i++){
            if(str[i] === str[i+1]){
                count ++
            }else{
                if(count >max){
                    res = str[i];
                    max = count;
                    count = 1;
                }
            }
        }
        if(count > max){
            res = str[len-1]
        }
        return res;
    }
    ```
- 实现继承
    ```javascript
    //寄生组合继承
    function Parent(name){
        this.name = name;
    }
    function Child(name){
        Parent.call(this.name);
    }
    Child.prototype = Object.create(Parent.prototype)
    Child.prototype.constructor = Child;
    class Parent{
        constructor(name){
            this.name = name
        }
    }
    class Child extends Parent{
        constructor(name){
            super(name)
        }
    }
    ```
- 实现大数相加
    ```javascript
    //大数相加 考虑到进位的情况和首位需要进位的情况   .padStart用于头部补全
    const myAdd = function(a,b){
        let maxLen = Math.max(a.length,b.length);//取两者的最大长度
        a = a.padStart(maxLen,0) // 按照最大长度进行头部补全
        b = b.padStart(maxLen,0);
        let t = 0 ,f = 0,sum = ''; //f 表示需要进位
        for(let i = maxLen -1 ;i>=0;i--){
            t = parseInt(a[i]) + parseInt(b[i])  + f;//求和
            f = Math.floor(t/10);  // 取进位 ,整除10 向下取整
            sum = t % 10 + sum;  //当前位相加
        }
        if(f == 1 ){//需要首位进位
            sum = '1' + sum
        }
        return sum;
    }
    ```
- 函数柯⾥化add
    ```javascript
    const add = function(){
        let args,chain;
        args = Array.prototype.slice.call(arguments);
        console.log('进入add --- args',args)
        chain = function(){
            var sub_arg = Array.prototype.slice.call(arguments);
            console.log('进入chain --- sub_arg',sub_arg)
            return add.apply(null,args.concat(sub_arg));//args.concat(sub_arg)把全部参数聚集到参数的入口为一个参数
        }
        chain.valueOf = function(){
            console.log('valueOf --- args',args)
            return args.reduce((a,b)=>{
                return a+b;
            },0)
        }
        return chain;
    }
    ```
#### 数组相关
- 数组展平
    - 数组扁平化
    ```javascript
    //普通递归
    const flat = function(arr){
        let res =[];
        for(let i=0;i<arr.length;i++){
            if(Array.isArray(arr[i])){
                flat(arr[i])
            }else{
                res.push(arr[i])
            }
        }
        return res
    }
    //使⽤reduce 函数迭代
    const flat = function(arr){
        return arr.reduce((pre,cur)=>{
            return pre.concat(Array.isArray(cur) ? flat(cur):cur)
        },[])
    }
    //利用es6的flat
    arr = arr.flat(Infinity);
    //扩展运算符
    while(arr.some(Array.isArray())){
        arr = [].concat(...arr)
    }
    ```
- 数组求交集
    ```javascript
    const common = function(nums1,nums2){
        var res = [],dict=[];
        for(let i=0;i<nums1.length;i++){
            if(dict[nums1[i]]){
                dict[nums1[i]] +=1
            }else{
                dict[nums1[i]] = 1;
            }
        }
        for(let j=0;j<nums2.length;j++){
            if(dict[nums2[j]]){
                res.push(nums2[j])
                dict[nums2[j]] -=1
            }
        }
        return res;
    }

    ```
- map ⽅法
    ```javascript
    //map的参数:
    //1.currentValue  必须。当前元素的值   
    //2.index  可选。当期元素的索引值  
    //3.arr  可选。当期元素属于的数组对象
    const map = function(fn,context){
        let len = this.length; //调用者的长度 
        let res = new Array(len);
        for(let i =0 ;i<len;i++){
            res[i] = fn.apply(this,[this[i],i,this])
        }
        return res;
    }
    ```