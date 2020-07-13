//斐波拉契数列
//原始解法：
function f1(n){
    if(n===1 || n===2) return 1;
    return f1(n-1)+f1(n-2)
}
//console.log('-====f1',f1(20)) //exited with code=0 in 0.321 seconds
//带备忘录的递归解法
let memo=[]
function f2(N) {
    if(N===0){
        return 
    }
    if(memo[N]){
        return memo[N]
    }
    if (N <= 2){
        memo[N] = 1;
        return 1;
    };
    memo.push(f2(N-1)+f2(N-2))
    return memo[N];
}
//console.log('====f2',f2(20)) //exited with code=0 in 0.103 seconds
//dp递归解法:
let dp = [];
function f3(n) {
    dp[1] = dp[2] = 1;
    for(let i=3;i<= n;i++){
        dp[i] = dp[i-1] + dp[i-2];
    }
    return dp[n]
}
//console.log('====f3',f3(20)) //exited with code=0 in 0.105 seconds
//最终
function fib(n) {
    if(n===1 || n===2) return 1;
    let prev = 1,curr =1;
    for(let i=3;i<=n;i++){
        let sum = prev + curr;
        prev = curr;
        curr = sum;
    }
    return curr;
}
//console.log('====fib',fib(20)) //exited with code=0 in 0.097 seconds
//凑零钱---暴力解法
function coin1(coins,n){
    if(n===0) return 0;
    if(n<0) return -1;
    let res = 100000;
    for(let i=0;i<coins.length;i++){
        let sub = coin1(coins,n-coins[i]);
        if(sub <0) continue;
        res = Math.min(res,sub+1)
    }
    if(res !== 100000){
        return res;
    }else{
        return -1;
    }
}
//console.log('=====coin',coin1([1,2,5],11)) //exited with code=0 in 0.273 seconds
//凑零钱---带有备忘录的解法
let memoCoin =[];
function coin2(coins,n){
    if(memoCoin[n]) return memoCoin[n]
    if(n<=0){
        let result = n===0?0:-1;
        memoCoin[n] = result;
        return result;
    }
    let res = 100000;
    for(let i=0;i<coins.length;i++){
        let sub = coin2(coins,n-coins[i]);
        if(sub <0) continue;
        res = Math.min(res,sub+1)
    }
    if(res !== 100000){
        memoCoin[n] = res;
        return res;
    }else{
        memoCoin[n] = -1;
        return -1;
    }
}
//console.log('=====coin2',coin2([1,2,5],11)) //exited with code=0 in 0.322 seconds
//dp算法

var coinChange = function(coins, amount) {
    coins.sort((a,b)=>(a-b));
    var T = [];
    for(let i=0; i<coins.length; i++){
        T[i] = [];
        for(let j=0; j<=amount; j++){
            T[i][j] = 0;
        }
    }
    console.log('1111',T)
    for(let i=0; i<T.length; i++){
        for(let j=0; j<T[i].length; j++){
            if(j==0){
                T[i][j] = 0;
                continue;
            }
            if(i==0){
                if(Number.isInteger(j/coins[i])){
                    T[i][j] = j/coins[i];
                }else{
                    T[i][j] = Infinity;
                }
            }else{
                if(j<coins[i]){
                    T[i][j] = T[i-1][j];
                }else{
                    T[i][j] = Math.min(T[i-1][j], T[i][j-coins[i]]+1);
                }
            }
        }
    }
    return T[T.length-1][T[0].length-1]===Infinity?-1:T[T.length-1][T[0].length-1];
};
console.log('=====coinChange',coinChange([1,2,5],11))

