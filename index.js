var lang = fis.compile.lang;
var rRequire = /"(?:[^\\"\r\n\f]|\\[\s\S])*"|'(?:[^\\'\n\r\f]|\\[\s\S])*'|(\/\/[^\r\n\f]+|\/\*[\s\S]+?(?:\*\/|$))|\brequire\s*\(\s*('|")(.+?)\2\s*\)/g;
var css2js = require('fis3-preprocessor-css2js');

module.exports = function(content, file, options) {
  var mode = options.mode;

  return content.replace(rRequire, function(m, comment, quote, value) {
    if (!value)return m;

    var info = fis.project.lookup(value, file);

    if (!info.file || !info.file.isCssLike) {
      if (!info.file && /\.css$/.test(value)) {
        m = "''/*@require " +value+ "*/";
      }

      return m;
    }

    switch (mode) {
      case 'dep':
      case 'dependency':
        m = "'" + lang.info.wrap(lang.require.wrap(value)) + "'/*@require " + lang.uri.wrap(value) + "*/";
        break;


      case 'embed':
      case 'inline':
        var f = info.file;
        fis.compile(f);
        var content = css2js.processCss(f.getContent(), {
          template: 'vanilla_runner'
        });
        m = content;

        break;

      case 'jsRequire':
        var f = info.file;
        fis.compile(f);
        var newFile = fis.file.wrap(f.dirname + '/' + f.filename + f.rExt + '.js');
        var content = css2js.processCss(f.getContent(), {
          template: 'vanilla_runner'
        });
        newFile.setContent(content);
        newFile.isMod = true;
        newFile.moduleId = newFile.id;
        fis.compile(newFile);
        // 其他文件的require中引用的是moduleId，方便从ret.ids中查找到文件，参考deps-pack打包。
        file.extras = file.extras || {};
        file.extras.derived = file.extras.derived || [];
        file.extras.derived.push(newFile);

        m = 'require(' + quote + (newFile.moduleId || newFile.id) + quote + ')'

        break;

      default:
        break;
    }

    return m;
  })
};


module.exports.defaultOptions = {
  
  // 可选择的值
  // dep|dependency 【推荐】 简单的标记依赖，fis 资源加载器能把这些依赖分析到，然后直接在 <head> 中用 link 插入：
  // embed | inline  像 webpack 那样直接把 css 转成 js 插入到 js 里面。
  // jsRequire  将目标文件转成 js 但是并不内嵌，而是可以通过 js 的 require 方式加载。
  mode: 'dep'

}
