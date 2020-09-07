const add = function(){
    let args = Array.prototype.slice.call(arguments);
    console.log('进入add --- args',args)
    let chain = function(){
        var sub_arg = Array.prototype.slice.call(arguments);
        console.log('进入chain --- sub_arg',sub_arg)
        return add.apply(this,args.concat(sub_arg));//args.concat(sub_arg)把全部参数聚集到参数的入口为一个参数
    }
    chain.valueOf = function(){
        console.log('valueOf --- args',args)
        return args.reduce((a,b)=>{
            return a+b;
        },0)
    }
    return chain;
}
//console.log(add(1,2).valueOf())
console.log(add(1)(2).valueOf()) // 3
// console.log(add(1)(2)(3)) // 6
// console.log(add(1,2,3)(4)) // 10
