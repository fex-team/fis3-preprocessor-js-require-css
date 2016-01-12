fis3-preprocessor-js-require-css
===============
支持 js 中直接 require css. (es6 的 import 也支持，但是先通过 es6 => es5 的转换。)


只能在 fis3 中使用。

```
npm install -g fis3-preprocessor-js-require-css
```

使用方式配置如下：

```js
fis.match('*.{js,es,es6,jsx,ts,tsx}', {
  preprocessor: fis.plugin('js-require-css')
})
```

如果想 require 文件比如图片，请使用[fis3-preprocessor-js-require-file](https://github.com/fex-team/fis3-preprocessor-js-require-file)

两个可以同时使用，配置如下。

```js
fis.match('*.{js,es,es6,jsx,ts,tsx}', {
  preprocessor: [
    fis.plugin('js-require-file'),
    fis.plugin('js-require-css')
  ]
})
```

## 参数说明

`mode`: 加载模式，默认为 `dependency`
  * `dep | dependency` 【推荐】 简单的标记依赖，并将js语句中对应的 `require` 语句去除。fis 的资源加载程序能够分析到这块，并最终以 `<link>` 的方式加载 css.
  * `embed | inline` 将目标 css 文件转换成 js 语句, 并直接内嵌在当前 js 中，替换原有 `require` 语句。
  * `jsRequire` 将目标 css 文件转换成 js 语句，但是并不内嵌，而是产出一份同名的 js 文件，当前 `require` 语句替换成指向新产生的文件。
