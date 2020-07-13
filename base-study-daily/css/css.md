##### BFC

- 概念：`块级格式化上下文（block formatting context）`具有 BFC 特性的元素可以看作是隔离了的独立容器，容器里面的元素不会在布局上影响到外面的元素，并且 BFC 具有普通容器所没有的一些特性。
- 触发条件：body根元素、浮动元素、绝对定位元素、display=inline block\flex\table cells、overflow= hidden\auto\scroll
- 特性：1、同一个BFC外边距会重叠2、BFC可以包含浮动的元素（清楚浮动-设置父元素BFC）3、阻止元素被浮动元素覆盖（左图右文之类）

##### div
`
<div class = 'parent'>
    <div class='child'></div>
</div>
`
- flex布局
`
div.parent{
    display:flex;
    justify-content:center;
    align-items:center;
}
`
- 绝对定位
`
div.parent{
    position:relative
}
div.child{
    position:absolute;
    top:50%;
    left:50%;
    transform: translate(-50%, -50%); 
}
div.child{
    position:absolute;
    width: 50px;
    height: 50px;
    top:0;
    left:0;
    transform: translate(-50%, -50%); 
}
`
`
div.parent {
    display: grid;
}
div.child {
    justify-self: center;
    align-self: center;
}
`
