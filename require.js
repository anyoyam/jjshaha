/*
# Tiny Browser Require
A tiny, simple CommonJS require() implemetation in browser-side, only 30+ lines.
## Usage
First put `require.js` on your page.
```html
<script src="require.js" />
```
Then use `require.register` to register your module.
```javascript
require.register("browser/debug.js", function(module, exports, require){
  // Module code goes here
});
```
Now you can use require function to load the module.
```javascript
var debug = require("browser/debug.js");
```
## License
MIT
*/
function require(p){
  var path = require.resolve(p);
  var mod = require.modules[path];
  if (!mod) throw new Error('failed to require "' + p + '"');
  if (!mod.exports) {
    mod.exports = {};
    mod.call(mod.exports, mod, mod.exports, require.relative(path));
  }
  return mod.exports;
}

require.modules = {};

require.resolve = function (path){
  var orig = path;
  var reg = path + '.js';
  var index = path + '/index.js';
  return require.modules[reg] && reg
    || require.modules[index] && index
    || orig;
};

require.register = function (path, fn){
  require.modules[path] = fn;
};

require.relative = function (parent) {
  return function(p){
    if ('.' != p.charAt(0)) return require(p);
    var path = parent.split('/');
    var segs = p.split('/');
    path.pop();

    for (var i = 0; i < segs.length; i++) {
      var seg = segs[i];
      if ('..' == seg) path.pop();
      else if ('.' != seg) path.push(seg);
    }

    return require(path.join('/'));
  };
};

/*
usage:
require.register('b.js', function(module, exports, require) {
  module.exports = function(a) {
    console.error(a);
  }
})

require.register('a.js', function(module, exports, require){
  console.log(require);
  var m = require('b.js');
  exports.add = function(a, b, c) {
    return !c && (a + b) || c && (m(a + b) && a + b);
  };
  exports.by = function(a, b, c) {
    return !c && (a / b) || c && (m(a / b) && a / b);
  };
});
*/