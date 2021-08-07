---
title: 下一代web工具-vite
date: 2021-08-04 20:18:04
tags: vite
categories: vite
---

## vite 为什么出现

在很久以前，浏览器上是没有 ESM 的，缺少对于模块化的支持，从页面中引入 js 的方案一般都是通过 script 进行加载，后来出现了比如 requirejs，commonjs 等相关的方案，之后随着技术的不断进步，我们又出现了 bundle 的方案进行一些模块化的引入，通过 webpack，rollup 等工具的 plugins 进行模块化打包。当然随着我们的项目的日益壮大，业务需求的不断完善，导致我们的工程越来越大，工程的启动时间和 热更新时间越来越长，每更新一次我都会去饮水机那接杯水喝一口，回来时间刚好。很大程度上影响了我们的开发效率和体验，性子比较着急的人当时可能内存就存了一团火，然后发泄给了 PM，出的这是什么需求，但是并不是需求的问题，当然也可能就是需求不爽。

那 vite 就是基于这样一个背景，来解决上述难题，当然不能解决需求问题，这点我认为它做的不够好。

## vite 为什么能够解决上述问题

要了解上述问题，我们首先要知道 webpack 的 dev server 是怎么启动的。

Bundle-Based Dev Server

首先来说它们都有一个对应的 js 入口，然后通过入口 js 进行扫描应用的子模块，当这些模块被解析的时候，当然一些动态的模块也会被解析，当这些模块被 bundle 之后，它会把这些 bundlejs 注入到 html 当中，然后才会启动 dev server，等待页面的访问。从这之中我们就能看到整个过程存在的一些问题。首先他会找到整个应用所依赖的所有模块，这也正是导致我们项目变大之后启动就会变的很卡的一个主要原因。虽然有很多模块都是动态加载的，但是要进行对应的 chunk 到 bundle 的操作，其实并不是真正意义上的动态加载。其必须等待所有模块构建完成，即使是分片的模块也需要构建。

![Bundle-Based Dev Server](https://gitee.com/RenYaNan/wx-photo/raw/master/2021-8-8/1628353848982-image.png)

ESM-Based Dev Server

ESM 是 es6 提出的概念，也就是可以原生支持 import，当然你得在 script 标签上增加一个 type='moudle'的属性。当你 import 某一个模块的时候，浏览器会发一个对应的请求，举个例子

<iframe height="300" style="width: 100%;" scrolling="no" title="es6_import_test" src="https://codepen.io/callren/embed/preview/xxdavxo?default-tab=html%2Cresult&theme-id=light" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/callren/pen/xxdavxo">
  es6_import_test</a> by 任亚楠 (<a href="https://codepen.io/callren">@callren</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

vite 启动的服务是以 index.html 为入口，然后进行对应的解析，找到我们的入口 js 文件，然后再加载下面的子模块，首屏只有少量的 js 模块，其它的一些动态的 js 模块是不需要被加载的，所以不需要 bundle 也能提升我们的页面性能

![ESM-Based Dev Server](https://gitee.com/RenYaNan/wx-photo/raw/master/2021-8-8/1628354171275-1628354100768.png)

当然除了上述的不需要 bundle 提高性能以外，ESM 也存在其对应的一些问题，因为 vite 是动态转换的，所以实时转换的一个性能是 vite 面临的一个最大的问题

- transform 的性能问题
  - 尽可能使用性能高的工具
  - 缓存 transform 的结果（浏览器缓存+HTTP 缓存）
- 非 ESM 模块的一个兼容性问题（TS/JSX...）
  - esbuild 进行转换，代替 TSC/Babel
  - es-module-lexer 扫描 import 语法
  - magic-string 重写 Node 模块的引用路径
  - ![magic-string](https://gitee.com/RenYaNan/wx-photo/raw/master/2021-8-8/1628354982634-1628354967066.png)
- Broswer ESM 不能加载 Node 模块
  - Node CJS 模块的兼容，转换成 ESM 模块
  - 模块请求数量较多
  - 依赖预优化，将 Node 模块打包成一个文件，缓存，根据模块元信息对其进行对应的转换，支持 CJS 模块的 Named import
  - 整个操作很耗性能，存在.vite 文件夹，下次再启动的时候检测版本进行复用
- Node 模块一些其它问题
  - 依赖预优化工具
  - v1: Rollup + @rollup/plugin-commonjs
  - v2: esbuild 依赖扫描，包装

## ESM HMR

![ESM HMR](https://gitee.com/RenYaNan/wx-photo/raw/master/2021-8-8/1628355736196-1628355729250.png)

1. 构建模块依赖图
2. 如果模块含有 import.meta.hot.accept 则将模块标记成 boundary
3. 当文件变更时，根据模块依赖图寻找 boundaries
4. boundaries 重新加载变更模块并执行更新
5. 如果没有查找到 boundaries，页面重新加载

![ESM HMR](https://gitee.com/RenYaNan/wx-photo/raw/master/2021-8-8/1628356351198-1628356344893.png)

## 上线方式

但是由于浏览器一些加载性能的问题，我们真正在上线代码的时候还是需要做对应的打包。可以做代码分片，压缩等一系列的事情。使用现有的 rollup 的方式

优势：

1. 基于 ESM bundler，和 vite 契合
2. 打包产物体积小，执行速度快
3. plugin API 灵活，比 webpack 更灵活
4. ESM Tree-Shaking
5. Bundle Code Size
6. 成熟稳定的生态
7. 常用来打包 library

劣势：

1. 配置 web app 比较复杂
2. framework 支持度

vite：

1. 内置了并简化了这些配置
2. 提供了 framework 模版（vue3，react，svelte，preact）
3. 内置常用 plugins（TS/JSX，PostCSS，CSS Modules，Assets...）
4. 继承 rollup plugins，并进行了扩展，SSR 支持等
5. dev 支持 rollup plugins
6. Node 环境加载 ESM，支持 HMR+Plugin

主要内容就是这些，感谢大家
