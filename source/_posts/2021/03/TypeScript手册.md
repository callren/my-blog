---
title: TypeScript手册
date: 2021-03-06 16:57:18
tags: TypeScript
categories: 教程 笔记 TypeScript
---

## 基础

在调用之前就应该确保你的所调用的方法是存在的

tsc TypeScript编译器，也就是类型检查器，使用npm i -g typescript进行安装，然后编写你对应ts文件，使用tsc file.ts进行编译你的ts文件。如果ts文件写的不规范，tsc则会在命令行上出现错误。使用tsc --noEmitOnError file.ts对错误进行防御

tsc --target es2015 file.ts可以将输出的代码转成为相应的指定版本的js。noImplicitAny，隐藏类型不推断any，strictNullChecks标志操作null和undefined更加明确

## 日常类型

string、number、boolean是我们平常用的比较多的内置类型，大写的String、Number、Boolean是一些特殊的内置类型将，虽然是合法的，但是大写的很少出现在自己的代码中，始终对类型使用小写的字符

数组，可以用`number[]`，`string[]`，还有一种`Array<number>`，表示相同的意思，这个是用泛型进行的对应数组说明。`T<U>`

TS还有一个特殊的类型any，可以在不希望特定值引起任何类型检查错误的时候使用它，上下文类型，ts会自动判断当前所用的一些类型是从哪里来

```TypeScript
let arr = ['text1', 'text2']
arr.forEach(item => {
    console.log(item.toUpperCase())
})
// 如果调用的不是string的方法则会报错

function fn(arg: {x: number; y: number; z?: number}){ // 分割可以用,或者;
    console.log(arg.x + arg.y)
}
```

可选属性在属性名后面加一个？，如上面的z属性就是可选属性，对于可选属性来说，你必须先对其进行一个非undefined的判断然后再使用它

### 联合类型

可以直接调用他们共有的属性，否则就得使用条件进行对应的判断

```TypeScript
const strAndNum: string | number = 1;
```

### 类型别名

这两个之间可以自由选择，但是还是有一些对应的区别

```TypeScript
type Point = {
    x: number;
    y: number;
}
interface Point = {
    x: number;
    y: number;
}
```

| type        | interface |
| :---------  | :-------- |
| 扩展类型通过& | 扩展类型通过extends |
| 向现有见面增加字段  |  创建后无法改变类型  |
| 不参与声明合并 ｜ 可以声明合并 ｜
| 可以命名基元 ｜ 只能用于声明对象的形状，不能重命名基元 ｜

### 类型断言

如果你要使用document.getElementById()，ts仅知道其返回对应的HTMLElement，但是你知道你页面会一直存在对应的element，此时你就可以使用类型断言

```TypeScript
// 可以使用类型断言来指定具体的类型
const myCanvas = document.getElementById("main_canvas") as HTMLCanvasElement;
// 其中在tsx中你可以这样写
const myCanvas = <HTMLCanvasElement>document.getElementById("main_canvas");

// 当然你还可以这样
const x = "hello" as unknown as number;
const a = (expr as any) as T;
```

### 文字类型

```TypeScript
// 可以使用文字类型来接受一组你想要的值
function printText(s: string, align: 'left' | 'right' | 'center'){}
printText('hi', 'center')
```

数值类型类似，当然其可以与其它类型相互结合使用

### 字面推论

```TypeScript
const req = { url: "https://example.com", method: "GET" };
handleRequest(req.url, req.method);
// 如果说handleRequest第二个参数只接受GET或者POST那么上述代码是有问题的，因为req自动推断出method为字符串，但是handleRequest第二个参数只能是GET字符或者POST字符，则这样推断有问题，那么如何解决这个问题呢？
// 1
const req = { url: "https://example.com", method: "GET" as "GET" };
// 2
handleRequest(req.url, req.method as "GET");
// 3 可以使用as const，将req变成文字类型
const req = { url: "https://example.com", method: "GET" } as const;
```

### null和undefined

表示缺少或者未初始化的值，strictNullChecks建议开启，用来确保在调用某些方法之前测试这些值的存在

```TypeScript
function doSomething(x: string | undefined) {
  if (x === undefined) {
    // do nothing
  } else {
    console.log("Hello, " + x.toUpperCase());
  }
}
```

### 非空断言运算符（!）

用于从类型中删除null和undefined不进行任何显式检查，实际上是一个类型断言，表明该值不是null或者undefined

```TypeScript
function liveDangerously(x?: number | undefined) {
  // No error
  console.log(x!.toFixed());
}
```

### 枚举

之后进行一个对应的填充

### 不常见的基元

bigint symbol

## Narrowing

在TS中，我们需要检验当前传进来的数据的各种情况，才能够缩小类型以便TS能够正常的解析。检查一些值的操作用到最多的就是typeof，但是一定要注意typeof null返回的是'object'字符，以下实例就是一个很好的说明

TS会自动缩小特定分支范围

```TypeScript
function printAll(strs: string | string[] | null) {
  if (typeof strs === "object") {
    for (const s of strs) {
      // Object is possibly 'null'.
      console.log(s);
    }
  } else if (typeof strs === "string") {
    console.log(strs);
  } else {
    // do nothing
  }
}
```

当然上述代码可以通过strs && typeof strs === 'object'来确定，也可以提前通过if来判断strs是否存在

```TypeScript
interface Container {
  value: number | null | undefined;
}

function multiplyValue(container: Container, factor: number) {
  // Remove both 'null' and 'undefined' from the type. 所以其不会报错
  if (container.value != null) {
    console.log(container.value);
//                        ^ = (property) Container.value: number

    // Now we can safely multiply 'container.value'.
    container.value *= factor;
  }
}
```

### 类型谓词

```TypeScript
function isFish(pet: Fish | Bird): pet is Fish{
  return (pet as Fish).swim !== undefined
}
const zoo: (Fish | Bird)[] = [getSmallPet(), getSmallPet(), getSmallPet()];
const underWater1: Fish[] = zoo.filter(isFish);
// or, equivalently
const underWater2: Fish[] = zoo.filter(isFish) as Fish[];

// The predicate may need repeating for more complex examples
const underWater3: Fish[] = zoo.filter((pet): pet is Fish => {
  if (pet.name === "sharkey") return false;
  return isFish(pet);
});
```

pet is Fish相当于我们手动指定了当前的类型

### never类型

在缩小范围的过程中，可以将并集缩小到所有可能性一无所有的程度，这种情况下，将使用never类型来表示不应该存在的状态

never类型可以分配给每种类型，但是，没有类型可以分配给never类型（自身除外）。

## 函数更多相关信息

### 函数类型表达式

```TypeScript
function greeter(fn: (a: string) => void){
  // 也可以用类型别名来命名函数类型
  // type GreetFunction = (a: string) => void
  fn('hello')
}

function printToConsole(s: string) {
  console.log(s)
}

greeter(printToConsole)
```

函数除了可以调用意外还具有属性，如何声明一个具有属性的函数？

```TypeScript
type DescribableFunction = {
  description: string;
  (someArg: number): boolean;
}
function doSomeThing(fn: DescribableFunction) {
  console.log(fn.description + 'required' + fn(6))
}
```

### 构造签名

构造函数的声明方式

```TypeScript
type SomeConstructor = {
  new (s: string): SomeObject;
}
function fn(ctor: SomeConstructor) {
  return new ctor('hello')
}

// 可以任意组合相同类型的调用签名和构造签名
interface CallOrConstruct {
  new (s: string): Date;
  (n?: number): number;
}

```

### 泛型函数

如果我们要描述两个值对应之间的关系的时候，要使用泛型，TS可以自动推断出一些类型

```TypeScript
function firstElement<Type>(arr: Type[]): Type {
  return arr[0]
}
// 指定参数类型
function combine<Type>(arr1: Type[], arr2: Type[]): Type[] {
  return arr1.concat(arr2)
}
// 这样写有问题
const arr = combine([1,2], ['hello'])

// 这样写OK
const arr = combine<string | number>([1,2], ['hello'])
```

泛型都是关于将两个或者多个具有相同类型的值进行的关联，要尽可能使用类型参数本身，而不要限制它。如果类型参数仅出现在一个位置，则应当考虑我们是否实际需要它

### 可选参数

```TypeScript
function firstElement(arr?: string) {
  // ....
}
```

为回调编写函数类型时，切勿编写可选参数，除非你打算在不传递该参数的情况下调用该函数

### 函数重载

```TypeScript
function len(s: string): number;
function len(arr: any[]): number;
function len(x: any) {
  return x.length
}
len('') // OK
len([0]) // OK
len(Math.random() > 0.5 ? 'hello' : [0]) // fail 不能使用可能是字符串或数组的值来调用它
```

### 其它类型

- this相关
- void表示不返值的函数的返回值，但是如果type vf = () => void这种函数类型可以返回任何值，但是它将被忽略
- object表示不是原始值的任何值，不同于空对象类型，极有可能永远也用不上
- unknown表示任何值，与any类似，但是更安全，unknown做任何事情都是不合法的，可以描述一个返回值未知类型的函数
- never某些函数从不返回值，比如一些error的函数，确定没有任何东西的时候也会出现
- Function，所有函数的值相等，可以用() => void代替
- 剩余参数，`...m: number[]`
- 注意TS一般认为数组是可变的，所以在用扩展运算符给一个函数传递参数的时候会发生意想不到的效果，使用as const表达数组的不可变性
- 解构参数类型`function ({a, b, c}: {a: number; b: number; c: number}){}`

## 对象类型

上述我们可知道定义对象属性可通过type以及interface关键字对对象进行描述

### 属性修饰符

- 可选属性可以在对象属性key值后面添加?表示可选，可以给未指定的值设置默认值
- readonly只读

```TypeScript
interface PaintOptions {
  shape: Shape;
  xPos?: number;
  yPos?: number;
}
function paintShape({ shape, xPos = 0, yPos = 0 }: PaintOptions)
```

### 扩展类型

关键字extends可以使我们可以有效的复制其他命名类型的成员，并添加我们所需要的任何新的成员，并且extends可以从多种类型进行扩展`interface ColorfulCircle extends Colorful, Circle {}`

### 交叉点类型

关键字&，用于结合现有的对象类型`type ColorfulCircle = Colorful & Circle;`，ColorfulCircle表示其具有Colorful和Circle的所有成员

### 通用对象类型

使用泛型来声明一个type参数

```TypeScript
interface Box<Type> {
  contents: Type;
}
type Box<Type> = {
  contents: Type
}

type OrNull<Type> = Type | null;

type OneOrMany<Type> = Type | Type[];

type OneOrManyOrNull<Type> = OrNull<OneOrMany<Type>>;
//   ^ = type OneOrManyOrNull<Type> = OneOrMany<Type> | null

type OneOrManyOrNullStrings = OneOrManyOrNull<string>;
//   ^ = type OneOrManyOrNullStrings = OneOrMany<string> | null

function getProperty<Type, Key extends keyof Type>(obj: Type, key: Key) {
  return obj[key];
}
```

ReadonlyArray是一种特殊类型，描述不应该被改变的数组，也可以简写`readyonly string[]`

### 元组类型

```TypeScript
type StringNumberPair = [string, number, number?]
type StringNumberBooleans = [string, number, ...boolean[]];
type StringBooleansNumber = [string, ...boolean[], number];
type BooleansStringNumber = [...boolean[], string, number];
```

## Keyof类型运算符

作用于对象

```TypeScript
type Mapish = { [k: string]: boolean };
type M = keyof Mapish;
//   ^ = type M = string | number
```

对象的key值始终被强制转换成字符串，因此`obj[0]`与`obj['0']`始终相同

ts中也有一个typeof关键字，作用就是找到当前一些内容的ts类型

## class

## module