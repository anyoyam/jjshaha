
### box-orient：`horizontal` | vertical | inline-axis | block-axis 
**`伸缩盒容器`**

`horizontal`：设置伸缩盒对象的子元素从左到右水平排列  
`vertical`：设置伸缩盒对象的子元素从上到下纵向排列  
`inline-axis`：设置伸缩盒对象的子元素沿行轴排列  
`block-axis`：设置伸缩盒对象的子元素沿块轴排列  

**设置或检索伸缩盒对象的子元素的排列方式。**  
可以通过`box-orient:horizontal + box-direction:normal` 达到新版本 `flex-direction:row` 的效果；  
可以通过`box-orient:horizontal + box-direction:reverse` 达到新版本 `flex-direction:row-reverse` 的效果；  
可以通过`box-orient:vertical + box-direction:normal` 达到新版本 `flex-direction:column` 的效果；  
可以通过`box-orient:horizontal + box-direction:reverse` 达到新版本 `flex-direction:column-reverse` 的效果；  

### box-pack：`start` | center | end | justify 
**`伸缩盒容器`**

`start`：设置伸缩盒对象的子元素从开始位置对齐（大部分情况等同于左对齐，受）  
`center`：设置伸缩盒对象的子元素居中对齐  
`end`：设置伸缩盒对象的子元素从结束位置对齐（大部分情况等同于右对齐）  
`justify`：设置或伸缩盒对象的子元素两端对齐  

**设置或检索伸缩盒对象的子元素的对齐方式。**  
查看其兄弟属性`box-align`，两者的效果正好（相反）互补  
效果等同于过渡版本的`flex-pack`属性和新版本的`justify-content`属性；  
`box-pack`的对齐方式受`box-orient`影响；  
默认情况下（即`box-orient`设置为`horizontal`）`start`和`end`所呈现的效果等同于左对齐和右对齐；  
当`box-orient`设置为`vertical`时，`start`和`end`所呈现的效果等同于顶部对齐和底部对齐；  
对应的脚本特性为`boxPack`。  

### box-align：start | end | center | baseline | `stretch` 
**`伸缩盒容器`**

`start`：设置伸缩盒对象的子元素从开始位置对齐  
`center`：设置伸缩盒对象的子元素居中对齐  
`end`：设置伸缩盒对象的子元素从结束位置对齐  
`baseline`：设置伸缩盒对象的子元素基线对齐  
`stretch`：设置伸缩盒对象的子元素自适应父元素尺寸  

**设置或检索伸缩盒对象的子元素的对齐方式。**  
查看其兄弟属性`box-pack`，两者的效果正好（相反）互补  
效果等同于过渡版本的`flex-align`属性和新版本的`align-items`属性；  
`box-align`的对齐方式受`box-orient`影响；  
默认情况下（即`box-orient`设置为`horizontal`）`start`和`end`所呈现的效果等同于顶部对齐和底部对齐；  
当`box-orient`设置为`vertical`时，`start`和`end`所呈现的效果等同于左对齐和右对齐；  
对应的脚本特性为`boxAlign`。

### box-flex：<number> | `0` 
**`伸缩盒子元素`**

`<number>`：使用浮点数指定对象所分配其父元素剩余空间的比例。  

**设置或检索伸缩盒对象的子元素如何分配其剩余空间。**  
效果类似于过渡版本和新版本的flex属性；  

### box-flex-group：<integer> | `1` 
**`伸缩盒子元素`**

`<integer>`：用整数值来定义伸缩盒对象的子元素所在的组。  

**设置或检索伸缩盒对象的子元素的所属组。**  
动态给数值较大的组分配其内容所需的实际空间（如无内容、padding、border则不占空间），剩余空间则均分给数值最小的那个组（可能有1个或多个元素）  
对应的脚本特性为boxFlexGroup。

### box-ordinal-group：<integer> | `1` 
**`伸缩盒子元素`**

`<integer>`：用整数值来定义伸缩盒对象的子元素显示顺序。  

**设置或检索伸缩盒对象的子元素的显示顺序。**  
效果等同于过渡版本的`flex-order`属性和新版本的`order`属性；  
数值较低的元素显示在数值较高的元素前面；  
相同数值的元素，它们的显示顺序取决于它们的代码顺序；  
对应的脚本特性为`boxOrdinalGroup`。  

### box-direction：`normal` | reverse 
**`伸缩盒容器`**

`normal`：设置伸缩盒对象的子元素按正常顺序排列  
`reverse`：反转伸缩盒对象的子元素的排列顺序  

**设置或检索伸缩盒对象的子元素的排列顺序是否反转。**  
可以通过`box-orient:horizontal + box-direction:normal` 达到新版本 `flex-direction:row` 的效果；  
可以通过`box-orient:horizontal + box-direction:reverse` 达到新版本 `flex-direction:row-reverse` 的效果；  
可以通过`box-orient:vertical + box-direction:normal` 达到新版本 `flex-direction:column` 的效果；  
可以通过`box-orient:horizontal + box-direction:reverse` 达到新版本 `flex-direction:column-reverse` 的效果；  
Firefox设置`box-direction`为`reverse`时，在将元素的排列顺序反转的同时也将元素的对齐方式逆转了；Safari和Chrome则只是反转元素排列顺序
对应的脚本特性为`boxDirection`。

### box-lines：`single` | multiple 
**`伸缩盒容器`**

`single`：伸缩盒对象的子元素只在一行内显示  
`multiple`：伸缩盒对象的子元素超出父元素的空间时换行显示  

**设置或检索伸缩盒对象的子元素是否可以换行显示。**  
效果类似于过渡版本和新版本的`flex-wrap`属性；  
对应的脚本特性为`boxLines`。  
