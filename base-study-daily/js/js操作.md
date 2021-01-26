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
- 实现call/apply/bind
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
        //var res = ctx.fn(...args)
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
    Function.prototype.bind = function(obj){
        if(typeof this !==function){
            throw new Error('error')
        }
        let args = Array.prototype.slice.call(arguments,1)//获取参数
        let that = this;
        let fn = function(){}//中转函数
        let bound = function(){
            let _params = Array.prototype.slice.call(arguments)
            let params = [...args,..._params]
            //this 调用时候的上下文,如果是new，需要绑定new之后的作用域
            let obj = this instanceof fn ? this:obj;
            that.apply(obj,params)
        }
        fn.prototype = that.prototype
        bound.prototype = new fn();
        return bound;
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
    function instanceof(L,ctor){
        var proR = ctor.prototype;//获取P的显示原型
        var proL = L.__proto__;//获取L的隐式原型
        while(true){
            if(proL === null) return false;
            if(proR === proL) return true;
            proL = L.__proto__; // 否则，继续向原型链上游移动
        }
    }
    function instanceof(obj,ctor){
        while(obj === obj && obj.__proto__){
            if(obj.constructor === ctor) return true
        }
        return false
    }

    ```
- 防抖函数
    ```javascript
    //所谓防抖，某个函数在某段时间内，无论触发多少次回调，都只执行最后一次，可以理解为司机等待最后一个人进入后关门，每次新进一个，就把定时器清空重新挤时
    //对于短时间内连续触发的事件，防抖在于让某个时间内，事件函数只执行一次
    //按钮点击 服务端验证
    //立即执行
    const debounce = function(fn,delay){
        let timer = null; //闭包缓存一个定时器id
        return (...args)=>{
            if(timer) clearTimeout(timer)
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
    //某个函数在3s内只执行一次，在3s内无视后来产生的函数调用请求，理解为水龙头防水，3s一滴
    //应用场景：1. 拖拽场景 2. 缩放场景 3. 动画场景
    
    //前沿节流：利用时间戳来判断是否已经到执行的时间，记录上次执行的时间戳，然后每次触发事件执行回调，回调中判断当前时间戳和上次执行时间戳的间隔是否到达时间差，是就执行并且更新上次的时间戳，循环
    const throttle = (fn,delay)=>{
        let previous = 0;//记录上次执行的时间戳
        return (...args)=>{
            let now += new Date();//获取当前时间
            if(now - previous > delay){//大于等于就把previous更新并执行fn
                previous = now；
                fn.apply(this,args)
            }
        }
    }
    //延迟节流：利用定时器，当事件触发的时候，设置延迟的定时器，每次触发事件的时候，如果存在定时器，则回调不执行方法，知道定时器触发，handler被清除，重新设置定时器
    const throttle = (fn,delay)=>{
        let canRun = true;
        return (...args)=>{
          if(!canRun) return 
          canRun = false;
          setTimeout(()=>{
             fn.apply(this,args);
             canRun = true;
          },delay)
        }
    }
    
    ```
- setTimeout--setInterval
    - ⽤setTimeout实现setInterval
        ```javascript
        //setTimeout实现setInterval
        function myInterval(fn, delay,isPause) { 
            const interval = () => {
                setTimeout(interval ,delay)
                fn() 
            }
            setTimeout(interval, delay)
        }
        //setInterval实现 setTimeout
        function mySetTimeOut(fn,delay)=>{
            let timer = setInterVal(()=>{
                clearInterval(timer)
                fn()
            },delay)
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
    obj.reduce((acc,cur)=>'{
        cur instanceof Array ? [...acc,deepCopy(cur)]:[...acc,cur]
    },[])
    //版本3:考虑symbol属性
    const deepCopy = (obj,hash = new WeakMap())=>{
        //判断是否合法
        if(typeof obj !== 'object' || obj === null) return
        //存在直接返回
        if(hash.has(obj)) return hash.get(obj);
        
        const cloneObj = Array.isArray(obj) ? []:{};
        hash.set(obj,cloneObj);

        const symKeys = Object.getOwnPropertySymbols(obj);
        if(symKeys.length){
            symKeys.forEach((symKey)=>{
                if(typeof obj[symKey] === 'object' && obj[symKey] !== null){
                    cloneObj[symKey] = deepCopy(obj[symKey],hash)
                }else{
                    cloneObj[symKey] = obj[symKey]
                }
            })
        }
        
        for(let i in obj){
            if(Object.prototype.hasOwnProperty.call(obj,i)){
                cloneObj[i] = typeof obj[i] === 'object' && obj[i] !== null ? deepCopy(obj[i],hash):obj[i];
            }
        }
        return cloneObj;

    }

    ```
- promise、promise all 和 race
    ```javascript
    //excutor 执行构造器 Promise：构造promise函数对象
    function Promise(excutor){
        const _that = this;
        _that.status = 'pending'; //promise绑定status属性，初始值pending
        _that.data = undefined;  //promise绑定data指定一个存储结果的属性
        _that.callbacks = [];    //每个元素的结构：{ onFulfilled(){}, onRejected(){}}

        function resolve(value){
            if(_that.status !== 'pending') return    //如果当前状态不是pending直接结束
            _that.status = 'resolved' //改状态
            _that.data = value;    //保存数据
            if(value instanceof promise){
              return value.then(resolve,reject)
    		}
             // 为什么resolve 加setTimeout?
            // 2.2.4规范 onFulfilled 和 onRejected 只允许在 execution context 栈仅包含平台代码时运行.
            // 注1 这里的平台代码指的是引擎、环境以及 promise 的实施代码。实践中要确保 onFulfilled 和 onRejected 方法异步执行，且应该在 then 方法被调用的那一轮事件循环之后的新执行栈中执行。
            if(_that.callbacks.length >0){ // 如果有待执行callback 函数，立刻异步执行回调函数
                setTimeout(()=>{
                    _that.callbacks.forEach(callbackobj =>{
                        callbackobj.onFulfilled(value)
                    })
                })
            }
        }
        function reject(reason){
            if(_that.status !== 'pending') return    //如果当前状态不是pending直接结束
            _that.status = 'rejected' //改状态
            _that.data = reason;    //保存数据
            if(_that.callbacks.length >0){ // 如果有待执行callback 函数，立刻异步执行回调函数
                setTimeout(()=>{
                    _that.callbacks.forEach(callbackobj =>{
                        callbackobj.onRejected(reason)
                    })
                })
            }
        }
        //立刻同步执行 excutor
        try{
            excutor(resolve,reject)
        }.catch(error){  //如果执行器抛出异常，promise对象变为 rejected 状态
            reject(error)
        }
    }
    /*
        Promise原型对象的 then() --- *思路  注册fulfilled状态/rejected状态对应的回调函数
          1、指定成功和失败的回调函数
          2、返回一个新的 promise 对象
          3、返回promise的结果由 onFulfilled/onRejected执行结果决定
          4、指定 onFulfilled/onRejected的默认值
         注意的点： then里面的FULFILLED/REJECTED状态时 为什么要加setTimeout ?
         原因:
         其一 2.2.4规范 要确保 onFulfilled 和 onRejected 方法异步执行(且应该在 then 方法被调用的那一轮事件循环之后的新执行栈中执行) 所以要在resolve里加上setTimeout
         其二 2.2.6规范 对于一个promise，它的then方法可以调用多次.（当在其他程序中多次调用同一个promise的then时 由于之前状态已经为FULFILLED/REJECTED状态，则会走的下面逻辑),所以要确保为FULFILLED/REJECTED状态后 也要异步执行onFulfilled/onRejected
    
        // 其二 2.2.6规范 也是resolve函数里加setTimeout的原因
        // 总之都是 让then方法异步执行 也就是确保onFulfilled/onRejected异步执行
    */
    Promise.prototype.then = function(onFulfilled,onRejected){
       // 处理参数默认值 保证参数后续能够继续执行
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : reason => reason //向后传递成功的value
        //指定默认的失败的回调（实现错误/异常穿透的关键点）
        onRejected = typeof onRejected === 'function' ? onRejected : reason => { //向后传递失败的reason
            throw reason
        }
        const _that = this;
        return new Promise((resolve,reject)=>{
            //调用指定的回调函数处理，根据执行结果，改变return的promise的状态
            function handle(callback){
                //1. 如果抛出异常，return 的promise就会失败，reason 就是 error
                //2. 如果回调函数返回的不是promise，return的promise就会成功，value就是返回的值
                //3.如果回调函数返回的是promise，return的promise的结果就是这个promise的结果
                try{
                    const result = callback(_that.data)
                    if(result instanceof Promise){
                        result.then(resolve,reject)
                    }else{
                        resolve(result)
                    }
                }catch(error){
                    reject(error)
                }
            }
          
            if(_that.status === 'pending'){//假设当前状态还是 pending 状态，将回调函数 保存起来
              // 当异步调用resolve/rejected时 将onFulfilled/onRejected收集暂存到集合中
                _that.callbacks.push({
                    onFulfilled(value){
                        handle(onFulfilled)//改promise的状态为 onFulfilled状态
                    },
                    onRejected(reason) {
                        handle(onRejected)  //改promise的状态为 onRejected状态
                    }
                })
            }else if(_that.status === 'resolved'){//如果当前是resolved状态，异步执行onresolved并改变return的promise状态
                setTimeOut(()=>{
                    handle(onFulfilled)
                })
            }else{//如果当前是rejected状态，异步执行onRejected并改变return的promise状态
                setTimeOut(()=>{
                    handle(onRejected)
                })
            }
        })
    }
    /*
        Promise原型对象的 catch()
        指定失败的回调函数
        返回一个新的 promise 对象
    */
    Promise.prototype.catch = function(onRejected){
        return this.then(undefined,onRejected)
    }
    /*
        Promise原型对象的 finally()
    */
    Promise.prototype.finally = function(callback){
        return this.then(value=>{
            Promise.resolve(callback(value))
        },reason=>{
            Promise.reject(callback(reason))
        })
    }
    /*
        Promise原型对象的 resolve()
        返回指定结果成功的promise对象
    */
    Promise.prototype.resolve = function(value){
        return new Promise((resolve,reject)=>{
            if(value instanceof Promise){ // 使用value的结果作为promise的结果
                value.then(resolve,reject)
            }else{
                resolve(value)
            }
        })
    }
    /*
        Promise原型对象的 reject()
        返回指定结果失败的promise对象
    */
    Promise.prototype.resolve = function(reason){
        return new Promise((resolve,reject)=>{
            reject(reason)
        })
    }
    /*
        Promise函数对象的all()
        返回了一个Promise实例，只有当所有的promise成功时才成功，否则一个失败就失败
    */
    Promise.all=(promises)=>{
      return new Promise((resolve,reject)=>{
        const len = promises.length;
        const res =[];
        let index = 0;
        for(let i=0;i<len;i++){
          Promise.resolve(promises[i]).then(data=>{
            res[i] = data;
            index ++;
            if(index ===len){
              resolve(res)
            }
          },error=>{
            reject(error)
          })
    	}
      })
    }
    /*
        Promise函数对象的race()
        返回了一个Promise实例，其结果由第一个完成的promise来决定
    */
    Promise.race = function(promises){
        return new Promise((resolve,reject)=>{
            promises.forEach(promise=>{
                Promise.resolve(promise).then(data=>{
                    resolve(date)
                },error=>{
                    reject(error)
                })
            })
        })
    }
    ```
- Promise 封装Ajax方法
    ```javascript
    //
    function myajax(methods,url,data){
        return new Promise((resolve,reject)=>{
            let xhr = new XMLHttpRequest()
            xhr.open(methods,url,true)
            xhr.send(data);
            xhr.onreadystatechange = ()=>{
                if(xhr.status === 200 && xhr.readystate === 4){
                    resolve(xhr.reponseText)
                }else{
                    reject(xhr.status)
                }
            }
        })
    }
    ```
- 异步加载图片
    ```javascript
    function loadImageAsync(url){
        return new Promise((resolve,reject){
            const image = new Image()
            image.onload = ()=>{
                resolve(image)
            }
            image.onerror = ()=>{
                reject(new Error('error url'+url))
            }
            image.src = url;
        })
    }
    ```
- 利用fetch api实现请求超时或者错误的时候做处理
    ```javascript
    //利用promise.race()
    //封装两个promise 1个fetch请求。1个超时的promise
    //AbortController 用于手动终止一个或多个DOM请求，通过该对象的AbortSignal注入的Fetch的请求中。所以需要完美实现timeout功能加上这个就对了
    let controller = new AbortController();
    let signal = controller.signal;
    let timeoutPromise = (timeout)=>{
        return new Promise((resolve,reject)=>{
            setTimeout(()=>{
                //请求超时
                resolve(new Response("timeout", { status: 504, statusText: "timeout " }));
                controller.abort();//终止请求
            },timeout)
        })
    }
    let fetchPromise = (url){
        return fetch(url,{
            signal:signal
        })
    }
    Promise.race([timeoutPromise(3000),fetchPromise("https://www.baidu.com")])
        .then(resp=>{
            console.log('resp')
            if(resp.status === 504){
                fetchPromise("https://www.baidu.com")
            }
        })
        .catch(err=>{
            console.log(err);
            fetchPromise("https://www.baidu.com")
        })
    ```
- 实现一个lazyman。链死调用
    ```javascript
    class Man {
        constructor(){
            this.task = []
            setTimeout(()=>{
                this.next()
            },0)
        }
        sleepFirst(time){
            const fn = ()=>{
                setTimeout(()=>{
                    console.log('sleepfirst',time)
                    this.next()
                },time)
            }
            this.task.unshift(fn);
            return this;
        }
        sleep(time){
            const fn = ()=>{
                setTimeout(()=>{
                    console.log('sleep',time)
                    this.next()
                },time)
            }
            this.task.push(fn);
            return this;
        }
        eat(food){
            const fn = ()=>{
                console.log('eat',food)
                this.next()
            }
            this.task.unshift(fn);
            return this;
        }
        next(){
            let fn = this.task.shift()
            fn && fn()
        }
    }
    let person = new Man()
    person.eat('11').sleep(2000).sleepFirst(3000)
    ```
- 实现10个串行的请求
    ```javascript
    //async await实现
    let fn = async functions(promises){
        let len = promises.length
        for(let i =0;i<len;i++){
            let currentPromise = (promises[i] instanceof Promise) ? promises[i]:Promise.resolve(promises[i]);
            let res = await currentPromise;
            console.log(res)
        }
    }
    let arr = [()=>console.log(1),()=>console.log(2),()=>console.log(3)]
    //promise 
    function serpromise(arr) {
      arr.reduce((pre, next, index, carr)=>{
       return pre.then(next)
      }, Promise.resolve())
     }
    var createPromise = function(time) {
      return (resolve, reject)=> {
       return new Promise((resolve, reject)=>{
        setTimeout(()=>{
         console.log('timein'+time)
         resolve();
        }, time*1000)
       })
      }
     }
    let arr = [createPromise(1),createPromise(3),createPromise(2),createPromise(4)]
    serpromise(arr)
    ```
- 实现一个repeat函数，使一个函数每间隔固定时间执行一次，共执行N次
    ```javascript
    const repeat= (fn, interval, n) =>{
        let count = 0;
        return ()=>{
          let timer = setInterval(()=>{
              count++;
              fn();
              if(count === n){    
                clearTimeout(timer)
                count = null
              }
          }, interval);
        }
    }
    let repeatFun = repeat(()=>console.log(1),3000,5)
    repeatFun()
    ```

- 实现有并行限制的Promise调度器
    ```javascript
    //
    addTask(1000, '1');
    addTask(500, '2');
    addTask(300, '3');
    addTask(400, '4');
    // output: 2 3 1 4
    //执行流程：
    //1.其实1、2两个任务开始执行
    //2.500ms时，2任务执行完毕，输出2，任务3开始执行
    //3.800ms时，3任务执行完毕，输出3，任务4开始执行
    //4.1000ms时，1任务执行完毕，输出1，此时只剩下4任务在执行
    //5.1200ms时，4任务执行完毕，输出4
    //分析：最多时存在两个并行的Promise，并且一个Promise执行完成之后，执行新的Promise，并且新执行的Promise不会影响到另一个正在执行的Promise
    //其实从Promise依序进行执行，可以使用队列先进先出的特性，add操作知识每次用队列中插入Promise Creator，判断当前执行数量是否小于2，如果小于2就从队列中弹出Promise Creator执行并给执行的Promise绑定then函数，then函数被调用就说明当前Promise已经执行完成，重复当前操作，可以看出是一个递归的操作
    class Scheduler {
      constructor() {
        this.queue = [];
        this.maxCount = 2;
        this.runCounts = 0;
      }
      add(promiseCreator) {
        this.queue.push(promiseCreator);
      }
      taskStart() {
        for (let i = 0; i < this.maxCount; i++) {
          this.request();
        }
      }
      request() {
        if (!this.queue || !this.queue.length || this.runCounts >= this.maxCount) {
          return;
        }
        this.runCounts++;
    
        this.queue.shift()().then(() => {
          this.runCounts--;
          this.request();
        });
      }
    }
       
    const timeout = time => new Promise(resolve => {
      setTimeout(resolve, time);
    })
      
    const scheduler = new Scheduler();
      
    const addTask = (time,order) => {
      scheduler.add(() => timeout(time).then(()=>console.log(order)))
    }    
    addTask(1000, '1');
    addTask(500, '2');
    addTask(300, '3');
    addTask(400, '4');
      
    scheduler.taskStart()
    
    ```
- 渲染几万条数据不卡住页面
    ```javascript
    //渲染大数据时，合理使用 createDocumentFragment 和 requestAnimationFrame ，将操作切分为一小段一小段执行
    setTimeout(()=>{
        //插入10万数据
        const total = 100000;
        //一次插入的数据
        const once = 20;
        //插入数据需要的次数
        const loopCount = Math.ceil(total/once);
        let countOfRender = 0;
        const ul = document.querySelector('ul');
        //添加数据
        function add(){
            const fragment =  document.createDocumentFragment();
            for(let i=0;i<once;i++){
                const li = document.createElement('li');
                li.innerText = Math.floor(Math.random() * total);
                fragment.appendChild(li)
            }
            ul.appendChild(fragment);
            countOfRender ++;
            loop();
        }
        function loop(){
            if(countOfRender <loopCount){
                window.requestAnimationFrame(add);
            }
        }
        loop();
    },0)
    ```
- 双向绑定
    ```javascript
    //Object.defineProperty 写法
    let vm = {}
    let obj={
        age:'12'.
        name:'luncy'
    }
    for(let key in obj){
        if(obj.hasOwnProperty(key)){
            Object.defineProperty(vm,key,{
                get:()=>{
                     console.log(`getting ${key}!`);
                     return obj[key]
                },
                set:()=>{
                     console.log(`setting ${key}!`);
                     obj[key] = value
                },
            })
        }
    }
    obj.age='111';
    vm.age = '112'
    //proxy
    let vm = new Proxy(obj,{
        get:(target,propKey,receiver)=>{
            console.log(`getting ${propKey}!`);
            return Reflect.get(target, propKey, receiver);
        },
        set:(target,propKey,value,receiver)=>{
            console.log(`setting ${propKey}!`);
            return Reflect.set(target, propKey,value,receiver);
        }
    })
    ```
- JS发布订阅模式
    ```javascript
    let pubSub={
        list:{},// 存放事件和对应的处理方法
        on:(key,fn)=>{//订阅
            if(!this.list[key]){
                this.list[key] = []
            }
            this.list[key].push(fn);
        },
        emit:()=>{
            var key = Array.prototype.shift.call(arguments);
            if(! this.list[key]) return false;
            for(let i=0;i<this.list[key].length;i++){
                var handle = this.list[key][i]
                handle.apply(this,argargumentss)
            }
        },
        off:(key,fn)=>{
            let fnLists = this.list[key];
            if(!fnLists) return
            if(!fn){
                fnLists.length =0
            }else{
                fnLists.forEach((item,index)=>{
                    if(item === fn){
                        fnLists.splice(index,1)
                    }
                })
            }
        }
    }
    ```
- JS获取url
    ```javascript
    let test='?ie=utf-8&f=8&rsv_bp=1&rsv_idx=1&tn=baidu&wd=21331&rsv_pq=b8627e62001efbb9&rsv_t=eef5sqIQ98s66yOwueYH5BWlFUARj0PkHBdCA4ahbSVYQA5qO9MBoZPC0mU&rqlang=cn&rsv_enter=1&rsv_dl=tb&rsv_sug3=5&rsv_sug1=1&rsv_sug7=100&rsv_sug2=0&inputT=509&rsv_sug4=509'
    function f(str){
        let str1 = str.slice(1);
        let arr = str1.split('&');
        let map = new Map();
        arr.map(item =>{
            const [key,value] = item.split('=');
            map.set(key,decodeURIComponent(value))
        })
        return map
    }]
    ```
- 将VirtualDom转化为真实DOM结构 
    ```javascript
    //vnode的结构{ tag,attrs,children}
    function render(vnode,container){
        container.appendChild(_render(vnode))
    }
    function _render(vnode){
        //数字类型转为字符串类型
        if(typeof vnode === 'number'){
            vnode = String(vnode)
        }
        //字符串类型直接就是文本节点
        if(typeof vnode === 'string'){
            return document.createTextNode(vnode)
        }
        //普通的dom
        const dom = document.createElement(vnode.tag);
        if(vnode.attrs){//遍历dom的属性
            Object.keys(vnode.attrs).forEach(key =>{
                const value = vnode.attrs[key];
                dom.setAttribute(key,value)
            })
        }
        //子dom进行递归处理
        vnode.children.forEach(child =>{
            render(child,dom)
        })
        return dom
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
    //ES6
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

    function add() {
        const _args = [...arguments];
        function fn() {
            _args.push(...arguments);
            return fn;
        }
        fn.toString = function() {
            return _args.reduce((sum, cur) => sum + cur);
        }
        return fn;
    }
    //箭头函数
    const currying =(fn,...args)=>
        args.length < fn.length?(...argmentxss)=>currying(fn,...args,...argments):fn(...args)
    ```



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
    //利用es6的flat，默认只拉平一层，需要拉平多层需要传递整数，
    arr = arr.flat(Infinity);
    //扩展运算符
    while(arr.some(Array.isArray())){
        arr = [].concat(...arr)
    }
    //some,concat 递归
    function flattenDeep(arr) {
      const isDeep = arr.some(item => item instanceof Array)  // 验证arr中，还有没有深层数组
      if (!isDeep) {   // 已经是flaten [1, 2, 3, 4] 直接返回
        return arr 
      }
      const res = Array.prototype.concat.apply([], arr)
      return flattenDeep(res)  // 递归
    }
    
    const arr = flat([[1, 2], 3, [4, 5, [6, 7, [8, 9, [10, 11]]]]])
    // [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
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
- 找到到数组中第一个非重复的数，[ 1, 1, 2, 2, 3, 4, 4, 5 ] 。=> 第一个非重复的数为 3
    ```javascript
    //1.使用map去重；创建一个空map，遍历原始数组，把数组的每一个元素作为key存到map中，因为map不会出现相同的key,所有最后得到的所有的key就是去重后的结果
    function uniq(arr){
        let hashmap = new Map();
        let res = [];
        for(let i=0;i<arr.length;i++){
            if(hashmap.has(arr[i])){ // 判断hashmap中是否存在该值
                hashmap.set(arr[i],true)
            }else{ //没有key值 添加
                hashmap.set[arr[i],false]
                res.push(arr[i])
            }
            //简化
            hashmap.set(arr[i],hashmap.has(arr[i]))
        }
        return res;
    }
    //2.找到数组中重复的数，上面的hashmap记录了每个元素的重复情况，遍历即可，值为true的key就是重复的数
    for(let [key,value] of hashmap.entries()){
        if(value === true) res.push(key)
    }
    //3. 第一个非重复的数，上面的hashmap记录了每个元素的重复情况，遍历即可
    for(let [key,value] of hashmap.entries()){
        if(value === false) return key
    }
    ```
- 两个纯数字的数组a,b 去重后排序
    ```javascript
    function sort1(a,b){
        let hashset = new Set();
        for(let value of a){
            hashset.add(value)
        }
        for(let value of b){
            hashset.add(value)
        }
        return [].concat(...hashset).sort((a,b)=>a-b) //升序
    }
    function sort2(a,b){
        let res = [...a,...b]
        return [...new Set(res)].sort((a,b)=>a-b)
    }
    //sort 不传递参数会怎么样
    //compareFunction用来指定按某种顺序进行排列的函数。如果省略，元素按照转换为的字符串的各个字符的Unicode位点进行排序
    ```
- sort 方法
    ```javascript
    Array.prototype.mySort = function() {
        for (var i=0; i<this.length; i++) {
            for(var j=0;j<this.length-i; j++) {
                if(this[j] >this[j+1] ){  /*改成<就是降序*/
                    var transferDate=this[j];
                    this[j]=this[j+1];
                    this[j+1]=transferDate;
                }
            }
        }
        return this;
    }
    ```
- reduce​ vs ​map​ vs ​forEach​
    ```javascript
    //foreach
    //1. forEach() 方法用于调用数组的每个元素，并将元素传递给回调函数:foreach对于空数组是不会执行回调函数
    //2. array.forEach(function(currentValue, index, arr), thisValue)
    //map
    //1. 返回的是一个新数组，数组的元素是原始数组元素调用函数处理后的结果：map不会对空数组进行检测。不改变原始数组
    //2. array.map(function(currentValue,index,arr), thisValue)
    //reduce
    //1. reduce() 方法接收一个函数作为累加器，数组中的每个值（从左到右）开始缩减，最终计算为一个值并返回,对于空数组是不会执行回调函数
    //2. array.reduce(function(total, currentValue, currentIndex, arr), initialValue)

    ```
- for in vs for of
    ```javascript
    //for in :用for in不仅可以对数组,也可以对enumerable对象操作

    //1. index索引为字符串型数字，不能直接进行几何运算
    //2. 遍历顺序有可能不是按照实际数组的内部顺序
    //3. 使用for in会遍历数组所有的可枚举属性，包括原型。
    //例如上栗的原型方法method和name属性.所以for in更适合遍历对象，不要使用for in遍历数组. hasOwnPropery方法可以判断某属性是否是该对象的实例属性
   //for of

    //1. for of遍历的只是数组内的元素，而不包括数组的原型属性method和索引name
    //总结
    // for in 遍历的是数组的索引；for of 遍历的是数组的元素值
    //for of适用遍历数/数组对象/字符串/map/set等拥有迭代器对象的集合.但是不能遍历对象,因为没有迭代器对象.和和forEach()不同的是，它可以正确响应break、continue和return语句
    //for-of循环不支持普通对象，但如果你想迭代一个对象的属性，你可以用for-in循环（这也是它的本职工作）或内建的Object.keys()方法
   ```
- map ⽅法
    ```javascript
    //map的参数:fn(currentValue,index,arr)  返回的是一个新数组
    //1.currentValue  必须。当前元素的值   
    //2.index  可选。当期元素的索引值  
    //3.arr  可选。当期元素属于的数组对象
    const map = (fn)=>{
        if(Array.isArray(this) || this.length || typeof fn !== 'function'){
            return 
        }
        let len = this.length;
        let res = new Array(len);
        for(let i=0;i<len;i++){
            res[i] = fn(this[i],i,this)
        }
        return res;
    }
    ```
- reduce 方法
    ```javascript
    //reduce参数：（fn(total,currentValue,index,arr),initValue）
    //total：必需。初始值, 或者计算结束后的返回值。
    //currentValue  必需：当前元素的值   
    //index  当期元素的索引值  
    //arr  当期元素属于的数组对象
    //z注意 reduce() 对于空数组是不会执行回调函数的
    const myReduce = (fn,initValue)=>{
        if(Array.isArray(this) || this.length || typeof fn !== 'function'){
            return 
        }
        let len = this.length;
        let hasInitValue  = initValue !== undefined;
        let value = hasInitValue ? initValue:this[0];
        for(let i = hasInitValue?0:1;i<len;i++){
            value = fn(value,this[i],i,this)
        }
        return value;
    }
    ```
- filter 方法
    ```javascript
    //filter的参数:(fn(currentValue,index,arr))
    //满足条件才返回
    const myFilter = (fn)=>{
        if(Array.isArray(this) || this.length || typeof fn !== 'function'){
            return 
        }
        let len = this.length;
        let res = [];
        for(let i =0;i<len;i++){
            if(fn(this[i],i,this)){
                res.push(this[i])
            }
        }
        return res;
    }
    ```
- foreach 方法
    ```javascript
    //foreach和map类似 但是没有返回值: 没有返回值
    const myForrach = (fn)=>{
        if(Array.isArray(this) || this.length || typeof fn !== 'function'){
            return 
        }
        let len = this.length；
        for(let i =0;i<len;i++){
            fn(this[i],i,this)
        }
    }
    ```
- every 方法
    ```javascript
    //every() 方法使用指定函数检测数组中的所有元素
    //如果数组中检测到有一个元素不满足，则整个表达式返回 false ，且剩余的元素不会再进行检测。
    //如果所有元素都满足条件，则返回 true。
    //注意： every() 不会对空数组进行检测。
    //注意： every() 不会改变原始数组
    const myEvery = (fn)=>{
        if(Array.isArray(this) || this.length || typeof fn !== 'function'){
            return 
        }
        let len = this.length;
        for(let i =0;i<len;i++){
           if(! fn(this[i],i,this)){
            return false
           }
        }
        return true
    }
    ```
- some 方法
    ```javascript
    //some() 方法用于检测数组中的元素是否满足指定条件
    //如果有一个元素满足条件，则表达式返回true , 剩余的元素不会再执行检测。
    //如果没有满足条件的元素，则返回false
    //注意： some() 不会对空数组进行检测。
    //注意： some() 不会改变原始数组
    const mySome = (fn)=>{
        if(Array.isArray(this) || this.length || typeof fn !== 'function'){
            return 
        }
        let len = this.length;
        for(let i =0;i<len;i++){
           if(fn(this[i],i,this)){
            return true
           }
        }
        return false
    }
    ```
- 设计模式
  ```javascript
  //单例模式
  //限制类实例化次数只能一次，一个类只有一个实例，其运用场景是全局仅需要一个对象的场景
  //实现方式：使用一个变量存储实例对象，进行类实例化时判断类实例对象是否存在，存在返回该实例，不存在则创建实例后返回，多次调用类生成实例的方法，返回同一个实例对象。
  // 不透明的单例模式：
  let single = function(name){
    this.name = name;
    this.instance = null;
  }
  single.prototype.getName = function(){
      console.log(this.name)
  }
  single.getInstance = function(name){
      if(this.instance) return this.instance
      return this.instance = new single(name)
  }
  //测试
  let winner = single.getInstance('winner')
  let looser = single.getInstance('looser')
  console.log(winner === looser);    //true
  console.log(winner.getName);       //winner
  console.log(looser.getName);       //looser
  //采用闭包的单例模式
  let single = function(name){
    this.name = name;
  }
  single.prototype.getName = function(){
      console.log(this.name)
  }
  single.getInstance = (function(name){
      let instance = null;
      return function(name){
          return instance || (instance = new single(name))
      }
      if(this.instance) return this.instance
      return this.instance = new single(name)
  })()
  //分析说明：存在的问题：1.不透明，无法使用new来进行类实例化 2.管理单例的操作，与对象的操作功能代码耦合
  //透明的单例模式
  let Single = (function(){
      let instence = null;
      return function(name){
          if(instance) return instance
          this.name = name;
          return instance = this;
      }
  })()
  Single.prototype.getName = function(){
      console.log(this.name)
  }
    //测试
  let winner = new Single('winner')
  let looser = new Single('looser')
  console.log(winner === looser);    //true
  console.log(winner.getName);       //winner
  console.log(looser.getName);       //looser
  ```
- 判断括号
    ```javascript
    /**
    * 判断括号匹配
    * 说明：给定一个只包含 '() {} []' 6种字符的字符串，
    *   实现一个方法来检测该字符串是否合法，其规则为'()'、'{}'、'[]'必须互相匹配，可嵌套。
    * 示例：
    *   isValid('(');          // false
    *   isValid('()');         // true
    *   isValid('()[]{}');     // true
    *   isValid('{()[]}');     // true
    *   isValid('(]');         // false
    *   isValid('([)]');       // false
    *   isValid('({}[]([]))'); // true
    */
    function isValid(str) {
      let stack = [],len = str.length;
      for(let i=0;i<len;i++){
          if(str[i] === '(' || str[i] === '[' || str[i] === '{'){
              //左括号就添加进栈
              stack.push(str[i])
          }else if(str[i] === ')'){//遇到右括号判断数组最后一个元素是否与当前元素匹配
            if(stack[stack.length-1] === '('){
                stack.pop();//
            }else{
                return false
            }
          }else if(str[i] === ']'){
            if(stack[stack.length-1] === ']'){
                stack.pop();//
            }else{
                return false
            }
          }else{
            if(stack[stack.length-1] === '}'){
                stack.pop();//
            }else{
                return false
            }
          }
      }
      if(stack.length === 0) return true
      return false
    }
    ```
- 驼峰转下划线
    ```javascript
    /** 
    ** 驼峰转下划线/下划线转驼峰：
    */
    //下划线转驼峰
    function toHump(name) {
        return name.replace(/\_(\w)/g, function(all, letter){
            console.log(all,letter)
            return letter.toUpperCase();
        });
    } 
    //驼峰转下划线
    function toLine(name) {
        return name.replace(/([A-Z])/g,"_$1").toLowerCase();
    }
    ```
- 千分位实现
    ```javascript
    //正则实现在最后一次匹配之
    //?=：非获取匹配，正向肯定预查，在任何匹配pattern的字符串开始处匹配查找字符串，该匹配不需要获取供以后使用。例如，   “Windows(?=95|98|NT|2000)”能匹配“Windows2000”中的“Windows”，但不能匹配“Windows3.1”中的“Windows”。预查  不消耗字符，也就是说，在一个匹配发生后，后立即开始下一次匹配的搜索，而不是从包含预查的字符之后开始。
    // +匹配前面的子表达式一次或多次
    //^是正则表达式匹配字符串开始位置
    //$是正则表达式匹配字符串结束位置
    //$&表示replace()函数第一个正则表达式参数所匹配的内容
    str.replace(/\d{1,3}(?=(\d{3})+$)/g,'$&.')
    let str = '12345678'
    let res = str.replace(/\d{1,3}(?=(\d{3})+$)/g,'$&.')
    console.log(res)
    const covert = (str)=>{
        str = str+'';
        let res = '',len = str.length;
        for(let i=len-1,j=1;i>=0;i--,j++){
            if(j%3===0){//三位数 
                res+=str[i]+'.';
                continue
            }
            res+=str[i]
        }
        console.log(res)
        return res.split('').reverse().join('')
    }

    //考虑小数点
    function format(num) {
        return (
          num &&
          num.toString().replace(/^\d+/, m => m.replace(/\d{1,3}(?=(\d{3})+$)/g, '$&,'))
        )
    }
    console.log(format(1234567.9)) // output: 1,234,567.90
    ```
- "insurance-order-detail" => "InsuranceOrderDetail"
    ```javascript
    var str = "insurance-order-detail";
    function titleCase(str){
        let arr = str.toLowerCase().split('-');
        for(let i=0;i<arr.length;i++){
            arr[i] = arr[i][0].toUpperCase() + arr[i].substring(1,arr[i].length)
        }
        return arr.join('')
    }
    console.log('===',titleCase(str))
    ```
-  "​www.toutiao.com​"          => "com.toutiao.www"
    ```javascript
    var str = "​www.toutiao.com​";
    function titleCase(str){
        let arr = str.split('.');
        return arr.reverse().join('.')
    }
    console.log('===',titleCase(str))
    ```
- 模版匹配
    ```javascript
    let data = {
      name:'小明',
      age:18,
      sex:'男'
    }
    let obj2 = render(template, data); //我是小明，年龄18，性别男
    console.log(obj2);
    function render(template, data){
         return template.replace(/\{\{(\w+)\}\}/g,(p1,p2)=>{
            console.log(p1,p2)  //p1:{{name}}   p2:name
            return data[p2]
        })
    }
    //
    const fun = (str,obj)=>{
        let i = 0,len=str.length,start = 0,end=0,flag=false,res = '';
        while(i++<len){
            if(str.charAt(i) === '$' && str.charAt(i+1) === '{' ){
                start = i+2;
                flag = true;
            }else if(str.charAt(i) === '}' && flag ){
                let key = str.substring(start,i)// 找到key name age
                res += str.substring(end,start-2)+obj[key];
                end = i+1;
                flag = false
            }
        }
        console.log(end,'end')
        if(end<len){
            res +=str.substring(end,len)
        }
        return res
    }
    const str = '我是${name}年龄${age}性别'
    const obj = {
        name: 'xiaoming',
        age: 999
    }

    let nstr = fun(str,obj)
    console.log(nstr)

    ```
