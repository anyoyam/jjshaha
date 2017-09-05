var ctool = {
  /**
   * 百度BD09坐标系转换为火星坐标系·
   *
   * ```sh
    地球坐标 (WGS84)
      国际标准，从专业GPS 设备中取出的数据的坐标系
      国际地图提供商使用的坐标系
    火星坐标 (GCJ-02)也叫国测局坐标系
      中国标准，从国行移动设备中定位获取的坐标数据使用这个坐标系
      国家规定： 国内出版的各种地图系统（包括电子形式），必须至少采用GCJ-02对地理位置进行首次加密。
    百度坐标 (BD-09)
      百度标准，百度 SDK，百度地图，Geocoding 使用
      (本来就乱了，百度又在火星坐标上来个二次加密)

    火星坐标系：
      iOS 地图（其实是高德）
      Gogole地图
      搜搜、阿里云、高德地图
    百度坐标系：
      当然只有百度地图
    WGS84坐标系：
      国际标准，谷歌国外地图、osm地图等国外的地图一般都是这个
   * ```
   * @class      BD09ToGCJ02 (name)
   * @param      {number}  lat     The lat
   * @param      {number}  lng     The lng
   * @return     {Object}  { description_of_the_return_value }
   */
  BD09ToGCJ02: function(lat, lng) {
    var x_pi = 3.14159265358979324 * 3000.0 / 180.0;
    var x = lng - 0.0065;
    var y = lat - 0.006;
    var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);
    var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);
    lng = z * Math.cos(theta);
    lat = z * Math.sin(theta);
    lat = lat.toFixed(6);
    lng = lng.toFixed(6);
    return { lng: parseFloat(lng), lat: parseFloat(lat) };
  },
  // 函数节流1 函数执行后置 在settimeout中执行
  throttle: function(fn, timeout) {
    var canRun = true;
    return function(ctxt, arg) {
      if (!canRun) return !0;
      canRun = false;
      setTimeout(function() {
        fn && fn.apply(ctxt, arg);
        canRun = true;
      }, timeout);
    }
  },
  // 函数防抖
  debounce: function(fn, timeout) {
    var timer = null; //, immediate = true;
    return function(ctxt, arg) {
      if (timer != null) clearTimeout(timer);
      timer = setTimeout(function() {
        fn && fn.apply(ctxt, arg);
      }, timeout);
    }
  },
  // 函数节流2 函数执行前置 settimeout仅做定时器
  freezeFunc: function(fn, timeout, ct) {
    var timer = null,
      canRun = true;
    return function(ctxt, arg) {
      if (canRun) {
        fn && fn.apply(ctxt, arg);
        canRun = false;
      }
      if (timer != null && ct === true) {
        return !0;
      }
      timer != null && clearTimeout(timer) && (timer = null);
      timer = setTimeout(function() {
        canRun = true;
        timer = null;
      }, timeout);
    }
  },
  is: function(o, t) {
    var a = Object.prototype.toString.call(o).toLowerCase().split(' ')[1].replace(']', '');
    (t != undefined) && (t = t.toLowerCase());
    return t == undefined ? a : (a == t ? !0 : !1);
  },
  asyncFun: function(f, ctxt) {
    var fn = [],
      $$,
      ctxt = ctxt || window,
      lv = 'throw',
      fc = 0,
      is = function(o, t) {
        return Object.prototype.toString.call(o).toLowerCase().split(' ')[1].replace(']', '') === (t || 'function').toLowerCase();
      },
      emfun = function(rtn, ct) {
        $$.status = 'finish';
        fc = 0;
        return extend.call($$, arguments);
      },
      next = function() {
        if ($$.status === 'finish') {
          return undefined;
        }
        var extr = extend.call($$, arguments);
        if (extr !== false) return extr;
        fc++;
        var n = typeof fn[fc] === "function" ? fn[fc] : emfun;
        if ((fn.length - 1) == fc) {
          $$.status = 'finish';
          fc = 0;
        }
        n.apply($$, arguments);
      },
      err = function(msg) {
        if (is(lv)) {
          return lv.call(ctxt, msg);
        }
        if (lv == 'log') {
          if (is(console, 'object') && is(console.error)) {
            console.error(msg);
          } else {
            alert(msg);
          }
        } else {
          throw new Error(msg);
        }
      };

    function extend(arg) {
      var _ = this,
        rtn = arg[0];
      if (typeof rtn === "string" && ["_cacheget", "_cacheset", "_cacherm", "_cacheclean"].indexOf(rtn) > -1) {
        return _.cache[rtn.replace("_cache", "")].apply(_.cache, [].slice.call(arg, 1));
      }
      if (typeof rtn === "string" && ["_log", "_err", "_goto"].indexOf(rtn) > -1) {
        return _.tool[rtn.replace("_", "")].apply(_.tool, [].slice.call(arg, 1));
      }
      return false;
    }
    return ($$ = {
      tool: {
        log: function(m) {
          if ($$.debug === true) {
            var args = [].slice.call(arguments, 0);
            args[0] = fc + '. ' + args[0];
            console.log && console.log.apply(console, args);
          }
          return next;
        },
        err: function(m) {
          if ($$.debug === true) {
            var args = [].slice.call(arguments, 0);
            args[0] = fc + '. ' + args[0];
            console.error && console.error.apply(console, args);
          }
          return next;
        },
        goto: function(index) {
          if (index > fn.length - 1 || !is(index, "number")) {
            return next;
          }
          fc = --index;
          // console.log("goto function:" + (fc + 1));
          return next;
        }
      },
      cache: function() {
        var cache = {};
        return {
          set: function(k, v) {
            if (!!k && !!v)
              cache[k] = v;
            return this;
          },
          get: function(k, d) {
            return (!!k && cache[k]) || d;
          },
          rm: function(k) {
            !!k && (delete cache[k]);
            return this;
          },
          clean: function() {
            cache = {};
            return this;
          }
        };
      }(),
      debug: false,
      fn: fn,
      status: 'standby',
      level: function(l) {
        return lv = is(l) ? l : (l == 'log') ? 'log' : 'throw', this;
      },
      then: function(f, ctx) {
        var _ = this;
        if (is(f))
          fn.push(function() {
            var a = arguments,
              arg = [next, err],
              ct = false;
            if (a.length > 0) {
              if (a.length > 1) {
                ct = [].slice.call(a, a.length - 1)[0];
                arg = arg.concat([].slice.call(a, 0, a.length - 1));
              } else {
                arg.push(a[0]);
              }
            }
            arg.push(fc);
            try {
              f.apply((ct || ctx || ctxt), arg);
            } catch (e) {
              console && console.error(e);
            }
          });
        _.status = 'standby';
        return _;
      },
      fork: function(o, ctx) {
        var _ = this;
        if (is(o, 'object')) {
          fn.push(function(rtn, ct) {
            if (!is(rtn, 'object') || rtn.flag == undefined) {
              throw new Error('need flag to decide which function will be run, when start a FORK method.');
            }
            if (o[rtn.flag] == undefined || !is(o[rtn.flag])) {
              throw new Error('function "' + rtn.flag + '" not found.');
            }
            o[rtn.flag].call((ct || ctx || ctxt), next, err, rtn);
          });
        }
        _.status = 'standby';
        return _;
      },
      run: function() {
        if (fn.length == 0) throw new Error("function queue is empty.");
        var f1 = fn[fc];
        fc = 0;
        this.status = 'running';
        fn.length == 1 && (this.status = 'finish', fc = 0);
        f1.apply(ctxt, [].slice.call(arguments, 0));
      },
      bind: function(o) {
        if (is(o, 'object')) {
          ctxt = o;
        }
        return this;
      }
    }, (is(f) && $$.then(f)), $$);
  },
  funs: function(f, ctxt) {
    return new this.asyncFun(f, ctxt);
  },
  /***
      ## `.chain` 用来链式取值
      ### 用法：
      ```javascript
      var a = tool.chain(res.data, '.HotelInfo.roomList[2].hotelName', '');
      ```
      ### 解释：
      函数会解析第二个参数，并依次从第一个参数中读取，直到读取到最后的.hotelName参数
      如果能到最后，则`a`的值为该值，若不能则为第三个参数的值（即默认值）
  ***/
  chain: function(o, str, def) {
    //a.b.c.e.f
    //a.b[1].c.e[2].f
    if (o == undefined) return def;
    if (str == '' || str == undefined) return o;
    str.split('.').forEach(function(i) {
      if (i == "" || o == undefined) return;
      if (/\[.+\]/.test(i)) {
        if (i[0] == '[') {
          i = i.replace('[', '');
        }
        var t = i.split('['),
          a = t.shift().replace(']', ''),
          b;
        (typeof o[a] == 'object' && (o = o[a])) && (t.forEach(function(i) {
          if (o == undefined) return;
          b = i.replace(']', '');
          if (o[b] != undefined) {
            o = o[b];
          } else {
            o = undefined;
          }
        }.bind(this)));
      } else if (this.is(i, 'string') && o[i] != undefined) {
        o = o[i];
      } else {
        o = undefined;
      }
    }.bind(this));
    if (o == undefined && def != undefined) {
      o = def;
    }
    return o;
  },
  /***
      ## `.checkForAssignment` 用来进行在多个参数中判断赋值
      ### 用法:
      ```javascript
      var a = tool.checkForAssignment([param.hotel, param.hid, param.id], [null, undefined, 0, ''], '1234');
      ```
      ### 解释：
      `a` 的值将为 `param.hotel`, `param.hid`, `param.id` 其中之一，从前往后，只要一个**不全等**
      第二个数组`[null, undefined, 0, '']`中的值，则`a`为该值，如果所有参数都遍历完后都不
      符合，则`a`的值为第三个参数（即默认值）
  ***/
  checkForAssignment: function(k, v, d) {
    if (this.is(k, 'array') && this.is(v, 'array')) {
      var f = false;
      for (var i = 0; i < k.length; i++) {
        f = false;
        for (var j = 0; j < v.length; j++) {
          if (k[i] === v[j]) {
            f = true;
            break;
          }
        }
        if (f) {
          continue;
        }
        return k[i];
      }
      return d;
    }
  },
  //设置data树
  applyToData: function(t, obj) {
    if ("object" == typeof obj) {
      var n, j, d;
      for (var i in obj) {
        d = t;
        n = i.split('.');
        for (j = 0; j < n.length; j++) {
          if (n[j].indexOf('[') > 0) { // 是数组
            n[j] = n[j].split('[');
            n[j][1] = n[j][1].replace(']', '');
            if ("object" == typeof d[n[j][0]] && "undefined" != typeof d[n[j][0]][n[j][1]]) {
              if (j == n.length - 1) { //已经循环到最后一层，直接赋值
                d[n[j][0]][n[j][1]] = obj[i];
                break;
              }
              d = d[n[j][0]][n[j][1]];
            } else {
              break;
            }
          } else if ("undefined" != typeof d[n[j]]) { // 是元素
            if (j == n.length - 1) { //已经循环到最后一层，直接赋值
              d[n[j]] = obj[i];
              break;
            }
            d = d[n[j]];
          } else {
            if (j == n.length - 1) {
              d[n[j]] = obj[i];
            }
            break;
          }
        }
      }
    }
  },
  extend: function() {
    var _ = null;
    var j = function(t) {
      _ = ctool;
      var d, c = [].slice.call(arguments, 1);
      if (typeof t == 'boolean') {
        d = t;
        t = c.shift();
      }
      c != null && c.forEach(function(s) {
        e(t, s, d);
      })
      return t;
    };
    var e = function(t, s, d) {
      for (var k in s)
        if (d && (_.is(s[k], 'object') || _.is(s[k], 'array'))) {
          if (_.is(s[k], 'object') && !_.is(t[k], 'object'))
            t[k] = {}
          if (_.is(s[k], 'array') && !_.is(t[k], 'array'))
            t[k] = []
          j(d, t[k], s[k])
        } else if (s[k] !== undefined) t[k] = s[k]
    };
    return j;
  }(),
  isNotEmptyString: function(str) {
    return typeof str === "string" && str !== "";
  },
  /**
   * 用来计算两个经纬度之间的距离
   * latitude ['lætə.tud] 纬度
   * longtitude ['lɑndʒɪ.tud] 经度
   * [!经纬度.png](http://www.w3resource.com/API/google-maps/earth-latitude-longitude.png)
   *
   * .tool.distance({lat: 120.757266, lng: 31.326814}, {lat: 120.728377, lng: 31.323683});
   * @return     {number}  { description_of_the_return_value }
   */
  distance: function() {
        function Rad(d){
           return d * Math.PI / 180.0; //经纬度转换成三角函数中度分表形式。
        }
        function GetDistance(lat1, lng1, lat2, lng2){
            var radLat1 = Rad(lat1);
            var radLat2 = Rad(lat2);
            var a = radLat1 - radLat2;
            var b = Rad(lng1) - Rad(lng2);
            var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
            s = s * 6378.137 ;// EARTH_RADIUS;
            s = Math.round(s * 10000) / 10000; //输出为公里
            return s;
        }
        return function(a, b) {
          // console.log((Math.sqrt(Math.pow(a.lng - b.lng, 2) + Math.pow(a.lat - b.lat, 2)) * 111));
          return GetDistance(a.lat, a.lng, b.lat, b.lng);
        }
  }(),
  /**
   * 用来将html代码段转化为小程序rich-text组件需要的json数据对象
   *
   * .tool.htmlToNodes("<div>test</div>")
   * @return     {(Array|Function)}  { description_of_the_return_value }
   */
  htmlToNodes: function() {
    var tag = ["a", "abbr", "b", "blockquote", "br", "code", "col", "colgroup", "dd", "del", "div", "dl", "dt", "em", "fieldset", "h1", "h2", "h3", "h4", "h5", "h6", "hr", "i", "img", "ins", "label", "legend", "li", "ol", "p", "q", "span", "strong", "sub", "sup", "table", "tbody", "td", "tfoot", "th", "thead", "tr", "ul"];
    var nodes, maps;
    var rTag = /\<[^\>]+?\>/gi,
        rAttr = /(\s[^\=]+?)\=['"][^'"]+?['"]/g,
        rRep = /[\<\>\/]/g,
        rNam = /\&[^\;]+?\;/gi;

    function analyseHTML(html) {
      nodes = [];
      var reg = rTag,
          res = (html.match(reg) || []).filter(function(t) {
            var i = t.indexOf(" "),
                j = t.replace(rRep, "");
            if (i != -1) {
              j = j.substring(0, i - 1);
            }
            return tag.indexOf(j) !== -1;
          }),
          len = res.length - 1;
      res.forEach(function(t, i) {
        var s = html.indexOf(t),
            e = 0,
            m = "";
        if (i < len) {
          e = html.indexOf(res[i + 1]);
          // 当两个节点元素一样时，后面的再往后查找一个
          if (s == e) {
            e = html.substring(s + t.length).indexOf(res[i + 1]) + s + t.length;
          }
          if (s > 0) {
            nodes.push(html.substring(0, s).trim());
          }
          nodes.push(t.trim());
          m = html.substring(s + t.length, e);
          if (m.length > 0) {
            nodes.push(m.trim());
          }
          html = html.substring(e);
        } else {
          if (s > 0) {
            nodes.push(html.substring(0, s).trim());
          }
          nodes.push(t.trim());
          m = html.substring(s + t.length);
          if (m.length > 0) {
            nodes.push(m.trim());
          }
        }
      });
    }
    function analyseTag() {
      var map = [];
      nodes.forEach(function(tg, index) {
        if (/^\<[^\/]+\>$/.test(tg)) {
          var attr = tg.match(rAttr), data;
          tg = tg.replace(rRep, "").trim().split(" ")[0].toLowerCase();
          data = {tag: tg, id: map.length, start: index, end: -1, attr: {}};
          if (attr != null && attr.length) {
            attr.forEach(function(it) {
              var s = it.indexOf("="), key = "", value = "";
              if (s > -1) {
                key = it.substring(0, s).trim();
                value = it.substring(s + 1).trim();
                value = value.substring(1, value.length - 1);
              }
              if (key && value) {
                data.attr[key] = value
              }
            });
          }
          map.push(data);
        } else if (/^\<\/.+\>$/.test(tg)) {
          tg = tg.replace(rRep, "").trim().toLowerCase();
          for (var i = map.length - 1; i >= 0; i--) {
            if (map[i].tag == tg && map[i].end === -1) {
              map[i].end = index;
              break;
            }
          }
        } else if (/^\<.+\/\>$/.test(tg)) {
          tg = tg.replace(rRep, "").trim();
          map.push({tag: tg, id: map.length, start: index, end: -1});
        }
      });
      maps = map;
      return map;
    }
    function toNodes(start, end, hmap) {
      var result = [];
      for (var i = start; i <= end; i++) {
        if (typeof hmap[i] == "undefined") {
          result.push({type: "text", text: nodes[i]});
        } else {
          var node = {name: hmap[i].tag, attrs: hmap[i].attr || {}, children: []};
          if (hmap[i].end != -1) {
            node.children = toNodes(hmap[i].start + 1, hmap[i].end - 1, hmap);
            i = hmap[i].end;
          }
          result.push(node);
        }
      }
      return result;
    }
    function make() {
      var result = [], hmap = {};
      maps.forEach(function(it) {
        hmap[it.start] = it;
      });
      return toNodes(0, nodes.length - 1, hmap);
    }
    return function(html) {
      html = html.replace(rNam, "");
      analyseHTML(html);
      analyseTag();
      var result = make();
      if (result.length == 0) {
        result.push({type: "text", text: html});
      }
      console.log(result);
      return result;
    }
  }()
};

module.exports = ctool;
