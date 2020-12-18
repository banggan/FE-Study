// 题目一：
// // const obj = { a: [123, 'abc'], b: [456], c: ['def'] }，
// //如何从 obj 获取得到新的数组: arr =  [123,  'abc', 456, def ]。

// function getNewArray(obj) {
//    let res = Object.values(obj)
//    return flatten(res)
// }
// function flatten(arr){
//     return arr.reduce((result, item)=> {
//         return result.concat(Array.isArray(item) ? flatten(item) : item);
//     }, []);
// }


// 题目二：
// //从数组 const arr = [{"id":1,"dictId":2},{"id":2,"dictId":3}] 中
// //取出所有dictId 对应的值，返回新的数组 arr2.
// function getDictId(arr){
//     let len = arr.length,res =[];
//     for(let i =0 ;i<arr.length;i++){
//         if(arr[i] && arr[i].dictId){
//             res.push(arr[i].dictId)
//         }
//     }
//     return res
// }



// 题目三：
// /*
//  * 重排数组
//  * 说明：给定一个长度为N的数组，N > 0，实现一个方法，将原数组头尾交替重排序，
//  *   如：[a1, a2, a3, ..., aN-1, aN]重排成[a1, aN, a2, aN-1, a3, aN-2, ...]
//  * 示例：
//  *   resort([1, 2, 3, 4]);   // 输出 [1, 4, 2, 3]
//  *   resort([1, 2, 3, 4, 5]);// 输出 [1, 5, 2, 4, 3]
//  *   resort([1, 2]);         // 输出 [1, 2]
//  *   resort(['a', 'b', 'x', 'e', 'g']); 输出 ['a', 'g', 'b', 'e', 'x']  
//  */
// function reort(arr){
//     let len = arr.length;
//     for(let i=0;i<len/2;i++){
//         let value = arr.pop()
//         arr.splice(i*2+1,0,value)
//     }
//     return arr
// }

// 题目四：
// /**
//  * 判断括号匹配
//  * 说明：给定一个只包含 '() {} []' 6种字符的字符串，
//  *   实现一个方法来检测该字符串是否合法，其规则为'()'、'{}'、'[]'必须互相匹配，可嵌套。
//  * 示例：
//  *   isValid('(');          // false
//  *   isValid('()');         // true
//  *   isValid('()[]{}');     // true
//  *   isValid('{()[]}');     // true
//  *   isValid('(]');         // false
//  *   isValid('([)]');       // false
//  *   isValid('({}[]([]))'); // true
//  */
// function isValid(str) {
//   let stack = [],len = str.length;
//   for(let i=0;i<len;i++){
//       if(str[i] === '(' || str[i] === '[' || str[i] === '{'){
//           //左括号就添加进栈
//           stack.push(str[i])
//       }else if(str[i] === ')'){//遇到右括号判断数组最后一个元素是否与当前元素匹配
//         if(stack[stack.length-1] === '('){
//             stack.pop();//
//         }else{
//             return false
//         }
//       }else if(str[i] === ']'){
//         if(stack[stack.length-1] === ']'){
//             stack.pop();//
//         }else{
//             return false
//         }
//       }else{
//         if(stack[stack.length-1] === '}'){
//             stack.pop();//
//         }else{
//             return false
//         }
//       }
//   }
//   if(stack.length === 0) return true
//   return false
// }

// 题目五：
// /** 
// ** 快速排序 
// */
// function quickSort(arr){
//     if(arr.length <2) return arr
//     let left = [],right = [];
//     let mid = arr.splice(Math.floor(arr.length/2),1)//取中间值
//     for(let i= 0;i<arr.length;i++){
//         if(arr[i]<mid){
//             left.push(arr[i])
//         }else{
//             right.push(arr[i])
//         }
//     }
//     return quickSort(left).concat(mid,quickSort(right))
// }

// 题目六：
// /** 
// ** 驼峰转下划线/下划线转驼峰：
// */
// //下划线转驼峰
// function toHump(name) {
//     return name.replace(/\_(\w)/g, function(all, letter){
//         console.log(all,letter)
//         return letter.toUpperCase();
//     });
// } 
// //驼峰转下划线
// function toLine(name) {
//     return name.replace(/([A-Z])/g,"_$1").toLowerCase();
// }
//模板匹配
let template = '我是{{name}}，年龄{{age}}，性别{{sex}}';

