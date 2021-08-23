---
title: JavaScript高级程序设计笔记
date: 2021-03-14 16:51:43
tags: 红宝书
categories: 红宝书
---

## HTML 中的 JavaScript

### script 元素属性

- async：立即开始下载脚本，不能阻止页面其它动作，只适用于外部脚本，异步脚本保证会在页面的 load 之前执行，但可能会在 DOMContentLoaded 的之前或之后
- charset：指定代码字符集
- crossorigin：配置相关请求的 cors 设置，也就是跨域资源共享
- defer：在文档解析和显示完成后再执行脚本，但是会立即开始下载，推迟执行，但是会在 DOMContentLoaded 事件之前执行，只对外部脚本有效
- integrity：允许对比接收到的资源和指定的加密签名以验证子资源完整性
- src：要执行代码的外部文件
- type：代码块中脚本语言的内容类型，一般为'text/javascript'，如果为'module'，则代码为 es6 模块，只有这个时候代码中才能够出现 import 和 export 关键字

一般来说代码块会被保存在解释器环境中，并且 js 代码在被解释的过程中，页面的其余内容不会被加载也不会被展示。在行内的 js 代码中，代码不能出现`</script>`字符串，否则会报错，需要转义字符反斜杠，也就是 js 代码会阻塞页面的渲染。

如果`script`标签中包含行内代码并且 src 有值，浏览器会下载并执行脚本文件而忽略行内代码

页面在浏览器解析到 body 标签的时候才开始渲染

如果想让浏览器的预加载器知道一些动态请求文件的存在，可以在文档头部显示声明它们

```HTML
<link rel='preload' href='preload.js'>
```

`<noscript>`标签中可以写入 html，以下两种情况会走`<noscript>`中的逻辑

1. 浏览器不支持脚本
2. 浏览器对脚本的支持被关闭

## 语言基础

1. 区分大小写
2. 标识符，也就是变量名称，函数名称等内容，最好驼峰命名法
3. 注释，多行，单行等
4. 严格模式，use strict
5. 语句，最好加上分号，不然浏览器会自己判断在哪里加上分号，影响性能，代码块由{}包裹
6. 关键字与保留字

### 变量

局部作用于定义全局变量很难维护，定义多个变量可用逗号分割进行定义

- var 变量提升，可多次定义同一个变量，声明的范围是函数作用域，全局作用域下会挂在到 window 上
- let 为块级作用域，暂时性死区（在 let 声明前的执行瞬间才叫暂时性死区），全局作用域下不会在 window 上
- 混用 let 和 var 都会冗余报错
- const 在声明的时候必须付值，在 for 循环中，每次迭代创建一个新的变量是 OK 的，但是如果赋值那就 fail

### 数据类型

简单数据类型：null，undefined，number，string，boolean，Symbol
复杂类型：object

typeof 是一个操作符而不是一个函数。

```JavaScript
typeof null // 'object null值表示一个空对象指针'
typeof function // 'function'
typeof {} // 'object'
```

对于未声明或者未初始化的变量，只能对它执行一个操作就是 typeof，总是会返回 undefined。所以在做对应的声明的同时也要对应的对其做出初始化的操作，这样在使用 typeof 的时候就知道到底是未声明还是未初始化

undefined 是由 null 派生来的，因此其表面上相等。所以 null == undefined 为 true，任何时候只要是保存对象，而其又没有对应的值，就将其初始值设置为 null，这样能够和 undefined 区分开

可以用 Boolean()方法将其余的所有类型转换成 boolean 类型

```JavaScript
Boolean(NaN) // false
```

#### 数字

- 八进制：第一个数字为 0 并且后续的数字为 0 ～ 7，如果后续的数字不为 0-7，则会忽略之前的 0，es6 的八进制的数字前缀为 0o
- 十六进制：数值前缀为 0x，然后是十六进制的数字，0-9 A-F/a-f
- 当其用作数学操作中的时候，则都会被视为 10 进制数值
- 科学计数法：1.3e10 表示 1.3 乘以 10 的 10 次幂，ECMAScript 会将小数点后至少包含 6 个 0 的数字转成科学计数法的形式
- 值的范围：最小值 Number.MIN_VALUE（5e-324）最大值 Number.MAX_VALUE（1.797 693 134 862 315 7e+308）如果某个计算数值超过了 MAX_VALUE，那么这个数值会被自动转换成 Infinity（无
  穷），Infinity 不可用于任何计算
- 如何确定某个值是否有限大，使用 isFinite()函数，Number.NEGATIVE_INFINITY 和 Number.POSITIVE_INFINITY 也可以获取正、负 Infinity
- NAN 表示本来要返回数值的操作失败了，0/0 便会返回 NAN，NAN 不等于包括 NAN 在内的任何值。NAN == NAN 为 false，任何涉及 NAN 的计算都会返回 NAN，isNaN()函数可以判断一个参数是不是数字，注意 isNaN('10')为 true，因为其可以转换成数字
- isNaN 可用来测试对象，此时首先会调用 valueOf()，看其返回值是否是数字，否则再调用 toString()，测试其返回值
- 将非数值转换成数值方式：Number、parseInt、parseFloat，Number 可以用于任何数据类型，但是后面两个主要用于将字符串转换成数值
  - Number 可以将 true 以及 false 转换成数值，null 返回 0，undefined 返回 NaN，字符串转成数字，空字符串返回 0，否则返回 NaN。对象来说先调用 valueOf 的方法，按照上述规则进行转换。如果是 NaN 则调用 toString 的方式进行转换
  - parseInt 会从第一个非空格字符开始转换，如果第一个字符不是数字字符，加减号，立即返回 NaN，所以空字符串也会是 NaN，但是'1234blue'会返回 1234，后续不是数字的字符会被忽略，类似 22.5 会被转换成 22，其第二个参数是要解析的字符的进制数
  - parseFloat 会忽略字符串开头的 0，十六进制数值始终返回 0.parseFloat 只解析十进制，不能指定底数，字符串表示整数，它会返回整数

#### 字符串

字符字面量

- \n 换行
- \t 制表
- \b 退格
- \r 回车
- \f 换页
- \\ 反斜杠
- \' 单引号
- \" 双引号
- \` 反引号
- \xnn 以十六进制编码 nn 表示的字符
- \unnnn 以十六进制编码 nnnn 表示的 Unicode 字符

转义序列表示一个字符，如果字符包含双字节字符，那么 length 属性返回的可能是不准确的字符数

转换成字符串可使用 toString 方法，null 和 undefined 没有 toString 方法，toString 可以穿入一个参数，表示得到数值的哪种进制字符串。如果你不确定一个值是不是 null 或者 undefined，可以使用 String()函数，始终返回相应类型的值的字符串。内部的实现是如果有 toString 方法，则调用该方法（不穿参数）返回对应的结果。

用一个加号给一个值加上一个空字符串也可以将其转换成字符串

模版字符串：模版字符串内部的空格会被保留，在使用的时候要注意如果模版字符串是以一个换行符开头的话，那么其第一个字符全等于`\n`，任何通过${}插入的值都会被 toString()强制转换成字符串。标签函数可以自定义插值行为。标签函数会接收被插值记号分隔后的模版和对每个表达式求值的结果。标签函数接收到的参数依次是原始字符串数组和对每个表达式求值的结果，函数返回值是对模版字面量求值得到的字符串

```JavaScript
let a = 6
let b = 9
function simpleTag(strings, ...expressions){
  console.log(strings)
  for(const expression of expressions){
    console.log(expression)
  }
  return 'foobar'
}
let taggedResult = simpleTag`${ a } + ${ b } = ${ a + b }`
console.log(taggedResult)
// strings: ['', ' + ', ' = ', '']
// 6
// 9
// 15

// 对于想把字符串和对表达式的结果拼接起来作为默认返回的字符串可以这样
function zipTag(strings, ...expressions){
  return strings[0] + expressions.map((e, i) => `${e}${strings[i + 1]}`).join('')
}

// 原始字符串
console.log(`\u00A9`) // ©️
console.log(String.raw`\u00A9`) // \u00A9
```

#### Symbol 类型

除了一些我们平时了解的一些方式，Symbol.for()方法可以创建相同的 symbol。

```JavaScript
Symbol.for('foo') === Symbol.for('foo') // true
```

Symbol.keyFor 可以查询注册表。其参数必须是 symbol 类型。等还有很多 Symbol 方式，就不介绍了

#### Object 类型

每个 Object 实例都有以下属性和方法：

- constructor：用于创建当前对象的函数
- hasOwnProperty(propertyName)：用于判断当前对象实例（不是原型）上是否存在给定的属性。要检查的属性名必须是字符串或者符号
- isPrototypeOf(object)：用于判断当前对象是否为另一个对象的原型
- propertyIsEnumerable(propertyName)：用来判断给定的属性是否可以使用
- toLocaleString()：返回对象的字符串表示，该字符串反映对象所在的本地化执行环境
- toString()：返回对象的字符串表示
- valueOd()：返回对象对应的字符串、数值或布尔值表示

### 操作符

++以及--有前缀操作和后缀操作，前缀操作就是先执行++然后赋值，后缀操作是先赋值后++。对象则会调用 valueOf 的方法取得可以操作的值，如果是 NaN，调用 toString 并再次应用其他规则

Infinity 乘以 0 返回 NaN，取余操作 26%5 结果为 1，Infinity / Infinity 结果为 NaN。指数操作符**，2**3 结果为 8，当然你也可以 16\*\*0.5

任何关系操作符在比较 NaN 的时候都返回 false，null == undefined 结果为 true，逗号操作符可以在一条语句中执行多个操作，如下 let num = (1, 2, 3, 4, 5) 最终 num 的值为 5

### 语句

do-while 语句循环体内代码在退出前至少执行一次，而 while 语句先检测退出条件，在执行循环体内代码。而 for 循环语句将循环相关的代码进行了封装，如果 while 循环实现不了的逻辑，那么 for 也实现不了

```JavaScript
// 创建一个无限循环
for(;;){
  dosomething()
}
```

for-in 语句是一种严格的迭代语句，枚举对象中的非符号键属性，for (property in expression) statement，for-in 语句不能保证返回对象属性的顺序

for-of 用于遍历可迭代对象的元素，按照可迭代对象的 next()方法产生值的顺序迭代，在此基础上还有 for-await-of 循环，对于嵌套循环语句来说，可以使用标签语句，对循环语句打上标签，然后可以通过 break 或者 continue 的语句进行引用

switch 在进行比较的时候都是全等的操作比较，不会强制转换数据类型

## 变量、作用域与内存

引用值和原始值的区别，函数内部是局部变量，typeof 是用来判断一个变量是否为原始类型最为合适，检测函数的时候也会返回 function，不同浏览器对于 typeof RegExp 有差异，如果是 null 则返回 object，对于引用类型，可以使用 instanceof 操作符，可以判断 Object、Array、RegExp，当然[] instantceof Object 也返回 true

函数上参数被认为是当前上下文中的变量，遵循和函数内部变量访问相同的规则。当然 eval()调用的内部存在第三种上下文，除了全局上下文和函数上下文，某些语句可以在作用域链前端临时添加一个上下文，try/catch 语句的 catch 块，with 语句。

如果想让整个对象不允许修改，需要使用 Object.freeze(),虽然使用不会报错，但是静默失败，尽量都用 const 声明

定时垃圾回收，垃圾回收方式：标记清理，引用计数（循环引用存在问题），循环引用的处理可以把循环引用的内容设置为 null。垃圾回收的性能问题，当然一些浏览器中也可以主动触发垃圾回收。内存管理内存优化指的是保证程序在执行的时候只保存必要的数据，数据不必要要将其设置为 null，释放其引用，也叫解除引用。const 和 let 提升性能，隐藏类和删除操作，内存泄漏方面：全局变量、定时器、闭包。静态分配与对象池。JavaScript 的数组是大小可变的，变化的时候引擎会先删除之前的，在创建一个新的。静态分配优化是一种极端的形式，可不用考虑

## 基本引用类型

### Date

- Date.parse() 接受一个表示日期的字符串参数，可将这个字符串表示的日期转换成毫秒数。这个字符串可以为 8/19/2021，May 23, 2019，Tue May 23 2019 00:00:00 GMT-0700，如果要创建一个 2019 年 5 月 23 日的日期对象，可以使用 let someDate = new Date(Date.parse("May 23, 2019"))，如果传入的并不能表示日期，则对应的返回 NaN，当然后台可自动的调用 Date.parse()，也就是 let someDate = new Date("May 23, 2019")和上面是等价的
- Date.UTC()返回日期的毫秒表示，参数是年月日时分秒毫秒，年月必须，其余默认为 0（日默认为 1），月从 0 开始。如果创建一个 2000 年 1 月 1 日 0 点，则为 new Date(Date.UTC(2000, 0))，当然 Date.UTC 也会隐式调用，可以直接在 new Date 中使用
- Date.now() 返回执行时刻的毫秒数
- toLocaleString - "2021/8/19"
- toString() - "Thu Aug 19 2021 14:39:24 GMT+0800 (中国标准时间)"
- valueOf() - 返回的是数字类型的日期的毫秒数
- toDateString() - "Thu Aug 19 2021"
- toTimeString() - "14:43:06 GMT+0800 (中国标准时间)"
- toLocaleDateString() - "2021/8/19"
- toLocaleTimeString() - "下午 2:44:19"
- toUTCString() - "Thu, 19 Aug 2021 06:44:54 GMT"

以下的去处了 UTC 的一些方式，类似 getUTCFullYear，setUTCFullYear 等

- getTime() 返回日期的毫秒数，同 valueOf()
- setTime() 设置日期的毫秒表示，从而修改整个日期
- getFullYear() 返回 4 位数年数
- setFullYear() 设置 4 位数年
- getMonth()
- setMonth()
- getDate()
- setDate()
- getDay() 返回日期中表示周几（0 为周日，6 为周六）
- getHours() 0-23 小时中的某一个
- setHours()
- getMinutes() 0-59 分钟数
- setMinutes()
- getSeconds()
- setSeconds()
- getMilliSeconds() 返回毫秒数
- setMilliseconds()
- getTimezoneOffset() 返回以分钟计的 UTC 与本地时区的偏移量

### RegExp

创建正则表达式 let expression = /pattern/flags，也可以使用 new RegExp(pattern, flags)

pattern 表示正则表达式

flags 表示匹配模式的标记

- g 全局模式，查找全部内容，而不是找到一个就结束
- i 不区分大小写
- m 多行模式，表示查找到一行文本末尾时会继续查找
- y 粘附模式，表示只查找从 lastIndex 开始以及之后的字符串
- u 启用 Unicode 匹配
- s dotAll 模式，表示元字符.匹配任何字符（包括\n 或者\r）

上述对应的实例属性有以下，对应的是提供了有关模式的各方信息，表示当前这个正则表达式是否开启了某个模式 global、ignoreCase、unicode、sticky、lastIndex、multiline、dotAll、source、flags，下面是 RegExp 实例方法

- exec() 参数为对应的要匹配的字符串，如果找到了匹配项，返回包含第一个匹配信息的数组，没找到返回 null，返回的数组包含两个额外的属性，index 和 input，index 是字符串中匹配模式的起始位置，input 是要查找的字符串

```JavaScript
let text = "mom and dad and baby";
let pattern = /mom( and dad( and baby)?)?/gi;
let matches = pattern.exec(text);
console.log(matches.index); // 0
console.log(matches.input); // "mom and dad and baby"
console.log(matches[0]); // "mom and dad and baby"
console.log(matches[1]); // " and dad and baby"
console.log(matches[2]); // " and baby"
```

- test() 接收一个字符串参数，如果输入的文本与模式匹配，则返回 true，否则返回 false。捕获组可以通过 RegExp.$1 访问，依此类推

### 原始包装类型

Number 重写了 valueOf 等方法，toString 可以接收一个参数，并返回相应基数形式的数值字符串

用于将数字格式转换成字符串格式的方法，整个数值范围是`-2**53到2**53-1`

- toFixed() 要包含的小数位数，如果超过对应的位数则四舍五入
- toExponential() 同 toFixed()一样，只不过结果用科学记数法表示
- toPrecision() 接收一个参数，表示结果中数字的总位数
- isInteger() 辨别一个数字是否为整数
- isSafeInteger() 鉴别计算后的整数是否在安全范围内

String 属性方法

- length 字符长度
- charAt() 返回给定索引位置的字符
- charCodeAt() 查看指定码元的字符编码
- fromCharCode()
- codePointAt() fromCodePoint()
- normalize()

不会修调用他们的字符串

- concat() 用于讲一个或多个字符拼接成一个新的字符
- slice() 第一个参数开始位置，第二个结束位置，第二个参数省略表示到字符结尾
- substr() 第一个参数开始位置，第二个参数表示返回的字符串数量，第二个参数省略表示到字符结尾
- substring() 第一个参数开始位置，第二个结束位置，第二个参数省略表示到字符结尾
- indexOf() 从头查找返回下标，第二个参数可选，表示开始搜索的位置
- lastIndexOf() 从尾查找返回下标
- trim() 创建一个字符串的副本，删除前后所有空格，trimLeft() trimRight() 从字符左侧还是右侧开始清理空格
- repeat() 表示将某个字符重复多少次
- padStart() padEnd() 填充字符串，第一个是填充后的长度，第二个参数是填充的内容，默认空格。如果指定长度小于当前字符长度，则返回原字符
- 可迭代字符`let iterator = 'abc'[Symbol.iterator]()`，即可 iterator.next()
- 可通过 for of 进行遍历字符，当然你也可以方便的分割字符数组`[...'abc']`
- toLowerCase()
- toLocaleLowerCase()
- toUpperCase()
- toLocaleUpperCase()

判断字符串中是否包含另一个字符串

- startsWith() 可选第二个参数表示开始位置
- endsWith()
- includes() 可选第二个参数表示开始位置
- match() 接收一个参数，可以是正则表达式对象，也可以是正则表达式字符串。同正则对象的 exec()
- search()
- replace() 第一个参数可以是正则或者字符串，第二个参数为要替换的内容，也可以是一个函数
- split() 第一个参数是以什么分割，可以是字符或正则，第二个参数是数组大小
- localeCompare() 比较两个字符串，返回字母表顺序相关 -1 0 1

### 单例内置对象

URL 编码方法，encodeURI 和 encodeURIComponent。

- encodeURI 用于整个 URI 进行编码，不会编码属于 url 的特殊字符，冒号，斜杠，问好，井号。对应的 decodeURI
- encodeURIComponent 用于单独组件的编码，对应的 decodeURIComponent
- eval

Math 方法

- Math.E 自然对数的基数 e 的值
- Math.LN10 10 为底的自然对数
- Math.LN2 2 为底的自然对数
- Math.LOG2E 以 2 为底 e 的对数
- Math.LOG10E 以 10 为底 e 的对数
- Math.PI π 的值
- Math.SQRT1_2 1/2 的平方根
- Math.SQRT2 2 的平方根
- Math.max 一组数的最大值
- Math.min 一组数的最小值

- Math.ceil 始终向上舍入为最接近的整数
- Math.floor 向下舍入为最接近的整数
- Math.round 四舍五入
- Math.found 返回数值最接近的单精度浮点值表示
- Math.random 0-1 之间的随机数，包含 0 但不包含 1

- Math.abs 绝对值
- Math.exp E 的 x 次幂
- Math.cos
- Math.sin
- Math.tan
- ...等

## 集合引用

### object

访问对应的变量可以使用.的方式，当然也可以使用中括号，区别就是中括号内部可以用变量

### Array

new Array()当中可以传入数字，表示设置的这个数组的初始化 length，你也可以传入要保存的元素

Array.form()参数为类数组对象，可任何迭代的结构，也可以对现有的数组进行浅复制。第二个参数可以为可选映射函数参数，第三个参数指定映射函数中 this 的值，当然重写的 this 在箭头函数中不适用。当然还有对应的 Array.of 可以把一组参数转换成数组

数组的空位为 undefined，map，forEach 等会跳过这个空位，所以一般空位要显性的设置为 undefined。join 则识空位为字符串，数组最多可以包含 4294967295 个元素

检测是否为数组，instanceof Array，isArray
