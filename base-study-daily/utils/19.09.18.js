//浅拷贝：拷贝的是对象的指针，修改内容后相互修改
//深拷贝：整个对象拷贝到另一个内存空间，修改内容互不影响
//arr.slice和arr.concat为深拷贝的方法
let arr1=[1,2,3]
let arr2=arr1.slice(0)
let arr3=arr1.concat()
arr2[1]=5
arr3[1]=8
console.log("arr1",arr1)
console.log("arr2",arr2)
console.log("arr3",arr3)
//deepCopy1
function deepCopy1(obj){
    let newObj = obj.constructor ===Array ? []:{}
    newObj = JSON.parse(JSON.stringify(obj))
    return newObj
}
//bug:拷贝其他引用类型、拷贝函数、循环引用等情况
//deepCopy2
function deepCopy2(obj){
    let newObj = obj.constructor === Array ? []:{}
    if(typeof obj === 'object'){
        for(let i in obj){
            if(typeof obj[i] === 'object'){
                newObj[i] = deep(obj[i])
            }
            newObj[i] =obj[i];
        }
        return newObj
    }else{
        return obj
    }
}
//bug:循环引用的情况，如：
const target = {
    field1: 1,
    field2: undefined,
    field3: {
        child: 'child'
    },
    field4: [2, 4, 8]
};
target.target = target;
//我们可以额外开辟一个存储空间，来存储当前对象和拷贝对象的对应关系
//当需要拷贝当前对象时，先去存储空间中找，有没有拷贝过这个对象，如果有的话直接返回，如果没有的话继续拷贝
//WeakMap弱引用类型，自动回收垃圾
function deepCopy3(target, map = new WeakMap()) {
    if (typeof target === 'object') {
        let cloneTarget = Array.isArray(target) ? [] : {};
        if (map.get(target)) {//先去存储空间查看是否为拷贝的对象
            return map.get(target);//直接返回
        }
        map.set(target, cloneTarget);//拷贝
        for (const key in target) {//for in 耗时长-----性能优化成while
            cloneTarget[key] = deepCopy3(target[key], map);
        }
        return cloneTarget;
    } else {
        return target;
    }
};
let newTarget
 = deepCopy3(target)
//优化
function foreach(arr,iteratee){
    let index =-1,len=arr.length;
    while(++index <len){
        iteratee(arr[index],index)
    }
    return arr
}
//优化后的代码
function clone2(target, map = new WeakMap()) {
    if (typeof target === 'object') {
        const isArray = Array.isArray(target);
        let cloneTarget = isArray ? [] : {};
        if (map.get(target)) {
            return map.get(target);
        }
        map.set(target, cloneTarget);
        const keys = isArray ? undefined : Object.keys(target);
        forEach(keys || target, (value, key) => {
            if (keys) {
                key = value;
            }
            cloneTarget[key] = clone2(target[key], map);
        });

        return cloneTarget;
    } else {
        return target;
    }
}

