##### 千分位实现
```javascript
//正则实现在最后一次匹配之
//?=：非获取匹配，正向肯定预查，在任何匹配pattern的字符串开始处匹配查找字符串，该匹配不需要获取供以后使用。例如，“Windows(?=95|98|NT|2000)”能匹配“Windows2000”中的“Windows”，但不能匹配“Windows3.1”中的“Windows”。预查不消耗字符，也就是说，在一个匹配发生后，后立即开始下一次匹配的搜索，而不是从包含预查的字符之后开始。
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
##### "insurance-order-detail" => "InsuranceOrderDetail"
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
##### "​www.toutiao.com​"          => "com.toutiao.www"
```javascript
var str = "​www.toutiao.com​";
function titleCase(str){
    let arr = str.split('.');
    return arr.reverse().join('.')
}
console.log('===',titleCase(str))
```
##### 模版匹配
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
```