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
- 实现bind
    ```javascript

    ```
- 实现bind
    ```javascript

    ```
- 实现bind
    ```javascript

    ```
- 实现bind
    ```javascript

    ```
- 实现bind
    ```javascript

    ```
- 实现bind
    ```javascript

    ```
- 实现bind
    ```javascript

    ```
- 实现bind
    ```javascript

    ```
- 实现bind
    ```javascript

    ```
- 实现bind
    ```javascript

    ```