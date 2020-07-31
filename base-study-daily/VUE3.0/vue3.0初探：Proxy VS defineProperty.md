#### 前言

2019.10.5日发布了Vue3.0，到了2020年4月21日晚，Vue作者尤雨溪在B站直播分享了`Vue.js 3.0 Beta`最新进展，估计Vue3.0正式版也快出来了。

Vue3.0 为了达到更快、更小、更易于维护、更贴近原生、对开发者更友好的目的，在很多方面进行了重构：

1. 使用 Typescript
2. 放弃 class 采用 function-based API
3. 重构 complier
4. 重构 virtual DOM
5. 新的响应式机制

这次的分享就聊聊新的响应式机制，进入正文～

#### 回顾Vue2.x的响应式机制

##### 实现原理

> 相信用过Vue的基本上都知道Vue的响应式都是利用了[Object.defineProperty()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)。MDN上的解释是：[Object.defineProperty()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)方法会直接在一个对象上定义一个新属性，或者修改一个对象的现有属性，并返回此对象。
>
> 当你把一个普通的 JavaScript 对象传给 Vue 实例的 data 选项，Vue 将遍历此对象所有的属性，并使用  [Object.defineProperty()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)把这些属性全部转为` getter/setter`,在`getter`中做数据依赖收集处理，在`setter`中 监听数据的变化，并通知订阅当前数据的地方。

![img](https://user-gold-cdn.xitu.io/2018/4/11/162b38ab2d635662?imageslim)

> [部分源码 src/core/observer/index.js#L156-L193](https://github.com/vuejs/vue/blob/dev/src/core/observer/index.js#L156-L193), 版本为 2.6.11 如下:

```javascript
/**
 * Define a reactive property on an Object.
 */
export function defineReactive (  //defineReactive 的功能就是定义一个响应式对象，给对象动态添加 getter 和 sette
  obj: Object,
  key: string,
  val: any,
  customSetter?: ?Function,
  shallow?: boolean
) {
  const dep = new Dep()

  const property = Object.getOwnPropertyDescriptor(obj, key)          //对象属性的定义
  if (property && property.configurable === false) {               // false就什么都不做
    return
  }

  // cater for pre-defined getter/setters
  const getter = property && property.get
  const setter = property && property.set
  if ((!getter || setter) && arguments.length === 2) {     //  walk的时候   对key求值赋给val
    val = obj[key]
  }
let childOb = !shallow && observe(val)
 // 对 data中的数据进行深度遍历，给对象的每个属性添加响应式
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {//访问的时候触发    并依赖收集
      const value = getter ? getter.call(obj) : val
      if (Dep.target) {
         // 进行依赖收集
        dep.depend()
        if (childOb) {
          childOb.dep.depend()
          if (Array.isArray(value)) {
            // 是数组则需要对每一个成员都进行依赖收集，如果数组的成员还是数组，则递归。
            dependArray(value)
          }
        }
      }
      return value
    },
    set: function reactiveSetter (newVal) {//  修改触发   并派发更新
      const value = getter ? getter.call(obj) : val
      /* eslint-disable no-self-compare */
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      /* eslint-enable no-self-compare */
      if (process.env.NODE_ENV !== 'production' && customSetter) {
        customSetter()
      }
      if (getter && !setter) return
      if (setter) {
        setter.call(obj, newVal)
      } else {
        val = newVal
      }
      // 新的值需要重新进行observe，保证数据响应式 
      //Observer 是一个类，它的作用是给对象的属性添加 getter 和 setter，用于依赖收集和派发更新,这里就不看它的源码了
      childOb = !shallow && observe(newVal)
      dep.notify()
    }
  })
}
```

> `defineReactive` 函数最开始初始化 `Dep` 对象的实例，接着拿到 `obj` 的属性描述符，然后对子对象递归调用` observe` 方法，这样就保证了无论 `obj` 的结构多复杂，它的所有子属性也能变成响应式的对象，这样我们访问或修改 `obj` 中一个嵌套较深的属性，也能触发 `getter` 和 `setter`。最后利用 `Object.defineProperty `去给 `obj `的属性 `key `添加` getter `和 `setter`。

##### 存在的问题

- 检测不到对象属性的添加和删除：当你在对象上新加了一个属性`newProperty`，当前新加的这个属性并没有加入vue检测数据更新的机制(因为是在初始化之后添加的)。`vue.$set`是能让vue知道你添加了属性, 它会给你做处理，`$set`内部也是通过调用`Object.defineProperty()`去处理的

- 针对数组只实现了 `push,pop,shift,unshift,splice,sort,reverse` 这七个方法的监听，对于`item[indexOfItem] = newValue`这种是无法检测的。通过数组下标改变值的时候，是不能触发视图更新的。（并不是说Object.defineProperty 不能监听数组下标的改变,举个例子）

  ```javascript
  const arrData = [1,2,3,4,5];
  arrData.forEach((val,index)=>{
      Object.defineProperty(arrData,index,{
          set(newVal){
              console.log(`defineProperty set key: ${index} value: ${newVal}`)
          },
          get(){
              console.log(`defineProperty get key: ${index} value: ${val}`)
              return val;
          }
      })
  })
  //通过下标获取某个元素和修改某个元素的值
  //let index = arrData[1];
  //arrData[0] = "后";
  //数组的push
  //arrData.push(8);
  //数组的unshift
   arrData.unshift(0);
  ```

- 只能劫持对象的属性,因此我们需要对每个对象的每个属性进行遍历，如果属性值也是对象那么需要深度遍历,显然能劫持一个完整的对象是更好的选择。

#### 初探Vue3.0的响应式机制

##### [Proxy](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy)是什么？

> 什么是代理呢？Proxy是 ES6 中新增的一个特性。MDN上的解释是：**Proxy** 对象用于定义基本操作的自定义行为（如属性查找、赋值、枚举、函数调用等）。
>
> Proxy 可以理解成，在目标对象之前架设一层“拦截”，外界对该对象的访问，都必须先通过这层拦截，因此提供了一种机制，可以对外界的访问进行过滤和改写。
>
> 使用 Proxy 的核心优点是可以交由它来处理一些非核心逻辑（如：读取或设置对象的某些属性前记录日志；设置对象的某些属性值前，需要验证；某些属性的访问控制等）。 从而可以让对象只需关注于核心逻辑，达到关注点分离，降低对象复杂度等目的。

##### [Proxy](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy)用法？

```javascript
const p = new Proxy(target, handler);
//target：所要拦截的目标对象（可以是任何类型的对象，包括原生数组，函数，甚至另一个代理）
//handler：一个对象，定义要拦截的行为
//p 是代理后的对象。当外界每次对 p 进行操作时，就会执行 handler 对象上的一些方法。
```

> 可以理解为在对象之前设置一个“拦截”，当该对象被访问的时候，都必须经过这层拦截。意味着你可以在这层拦截中进行各种操作。Proxy支持的拦截操作一共 13 种。比如你可以在这层拦截中对原对象进行处理，返回你想返回的数据结构。举个例子：

```javascript
// 声明要响应式的对象,Proxy会自动代理
 const data = {
   name: "banggan",
   age: 26,
   info: {
     address: "北京" // 需要深度监听
   },
   nums: [10, 20, 30]
 }; 
const proxyData = new Proxy(data, {
   get(target,key,receive){ 
     // 只处理本身(非原型)的属性
     const ownKeys = Reflect.ownKeys(target)
     if(ownKeys.includes(key)){
       console.log('get',key) // 监听
     }
     const result = Reflect.get(target,key,receive)
     return result
   },
   set(target, key, val, reveive){
     // 重复的数据，不处理
     const oldVal = target[key]
     if(val == oldVal){
       return true
     }
     const result = Reflect.set(target, key, val,reveive)
     console.log('set', key, val)
     return result
   },
   deleteProperty(target, key){
     const result = Reflect.deleteProperty(target,key)
     console.log('delete property', key)
     console.log('result',result)
     return result
   }
 })
proxyData.name;
proxyData.age = '20';
proxyData.newPropKey = '新属性';
proxyData.info.tel = '88888888';
delete proxyData.name
```

> 上面代码可以看到，新增的属性，并不需要重新添加响应式处理，因为 `Proxy` 是对对象的操作，只要你访问对象，就会走到 `Proxy` 的逻辑中。
>
> `Reflect` 是一个内置对象，它提供拦截 JavaScript 操作的方法,可简化的创建 `Proxy`。它提供了一组操作与修改对象的 API，以便在 Proxy 对目标进行操作。
>
> `Reflect`和`proxy`关系就很明了了，Proxy 提供拦截操作，Reflect 提供修改操作.

> 既然Prox可以代理所有对象，那ES6 的Map、Set、WeakSet、WeakMap呢？尝试一下：

```javascript
let map = new Map([['company','58']])
let mapProxy = new Proxy(map, {
  get(target, key, receiver) {
    var value = Reflect.get(...arguments)
     console.log("取值:",...arguments)
    return typeof value == 'function' ? value.bind(target) : value
  }
})
mapProxy.get("company")
```

##### Proxy在Vue3.0的运用

> Vue3.0 使用 Proxy 作为响应式数据实现的核心，用 Proxy 返回一个代理对象，通过代理对象来收集依赖和触发更新。

###### Reactive

> `createReactiveObject`用于创建响应式代理对象：
>
> - 首先判断`target`是否是对象类型，如果不是对象，直接返回；
> - 然后判断目标对象是否已经是可观察的，如果是，直接返回已创建的响应式Proxy，`toProxy`就是`rawToReactive`这个`WeakMap`，用于映射响应式Proxy；
> - 然后判断目标对象是否已经是响应式Proxy，如果是，直接返回响应式Proxy，`toRaw`就是`reactiveToRaw`这个`WeakMap`，用于映射原始对象；
> - 然后创建响应式代理，对于`Set`、`Map`、`WeakMap`、`WeakSet`的响应式对象handler与`Object`和`Array`的响应式对象handler不同，需要分开处理；
> - 创建完立即更新`rawToReactive`和`reactiveToRaw`映射；

###### ref

> `ref`的作用是提供响应式包装对象， 为简单类型的值生成一个形为 `{ value: T }` 的包装，这样在修改的时候就可以通过 `count.value = 3` 去触发响应式的更新了。
>
> `ref`的底层就是`reactive`，`ref`对象具有对应的 getter 和 setter ，getter总是返回经过`convert`转化后的响应式对象`raw`，并触发 Vue 的依赖收集，对`ref`对象赋值会调用`setter`，`setter`调用会通知deps，通知依赖这一状态的对象更新，并重新更新`raw`，`raw`被保存为新的响应式包装对象。

###### effect

> `Effect`其核心在于响应式追踪变化，在创建响应式对象时，立即触发其`getter`一次，会使用`track`收集到其依赖，在响应式对象变更时，立即触发`trigger`，更新该响应式对象的依赖。
>
> ` track`用于收集依赖deps（依赖一般收集effect/computed/watch的回调函数):
>
> - `track`时，`effectStack`栈顶就是当前的`effect`，因为在调用原始监听函数前，执行了`effectStack.push(effect)`，在调用完成最后，会执行`effectStack.pop()`出栈;
> - `effect.active`为`false`时会导致`effectStack.length === 0`，这时不用收集依赖，在`track`函数调用开始时就做了此判断;
>
> `trigger `用于通知deps，通知依赖这一状态的对象更新:
>
> - 在`trigger`内部会维护两个队列`effects`和`computedRunners`，分别是普通属性和计算属性的依赖更新队列;
> - 在`trigger`调用时，Vue 会找到更新属性对应的依赖，然后将需要更新的`effect`放到执行队列里面，在完成了依赖查找之后，对`effects`和`computedRunners`进行遍历，调用`scheduleRun`进行更新;

![img](https://user-gold-cdn.xitu.io/2019/10/9/16dafca37b2e0534?imageslim)

- 初始化阶段

> 把 `origin`(`array`) 对象通过`reactive.ts`转化成响应式的 Proxy 对象 `state`。
>
> 把函数 `fn()` 作为一个响应式的` effect `函数并立即执行一次。**由于在 fn() 里面有引用到 Proxy 对象的属性，所以这一步会触发对象的 getter，从而启动依赖收集。**这个` effect `函数也会被压入一个名` effectStack`的栈中，供后续依赖收集的时候使用。

- 依赖收集阶段：

> 当上面的`effect`被立即执行，其内部的 `fn()` 触发了 Proxy 对象的 getter 的时候，启动依赖收集。创建targetMap依赖收集表。
>
> targetMap 是一个 WeakMap，其 key 值是~~当前的 Proxy 对象 `state`，而 value 则是该对象所对应的 depsMap。
>
> depsMap 是一个 Map，key 值为触发 getter 时的属性值（此处为 `count`），而 value 则是**触发过该属性值**所对应的各个 effect。
>
> 这样，`{ target -> key -> dep }` 的对应关系就建立起来了，依赖收集也就完成了。

- 响应阶段

> 当修改对象的某个属性值的时候，会触发对应的 setter。
>
> setter 里面的 trigger() 函数会从依赖收集表里找到当前属性对应的各个 dep，然后把它们推入到 `effects`和 `computedEffects（计算属性）`队列中，最后通过 `scheduleRun()`挨个执行里面的 effect。

#### 总结

- `Proxy`可以直接监听对象而非属性：`Proxy`直接可以劫持整个对象,并返回一个新对象,我们可以只操作新的对象达到目的,而`Object.defineProperty`只能遍历对象属性直接修改。不管是操作便利程度还是底层功能上都远强于`Object.defineProperty`。
- `Proxy`可以直接监听数组变(push、shift、splice)。
- `Proxy`可以监听set、map、weakSet、weakMap。
- `Proxy`有多达13种拦截方法,不限于apply、ownKeys、deleteProperty、has等等是`Object.defineProperty`不具备的。
- `Proxy`的劣势就是兼容性问题,而且无法用`polyfill`磨平。

