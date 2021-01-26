const find =(str)=>{
  let map = [],max = '';
  for(let i=0;i<str.length;i++){
    let index = map.indexOf(str[i]);
    if(index !== -1){//map 里面有
      map.splice(0,index+1)
    }
    map.push(str[i]);
    if(max.length <map.length){
      max = '';
      for(let i = 0;i<map.length;i++){
        max+=map[i]
      }
    }
  }
  return max;
}
console.log(find('1231456'))