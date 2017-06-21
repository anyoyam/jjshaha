var ctool = {
    BD09ToGCJ02: function (lat, lng) {
        var x_pi = 3.14159265358979324 * 3000.0 / 180.0;
        var x = lng - 0.0065;
        var y = lat - 0.006;
        var z = Math.sqrt( x * x + y * y ) - 0.00002 * Math.sin( y * x_pi );
        var theta = Math.atan2( y, x ) - 0.000003 * Math.cos( x * x_pi );
        lng = z * Math.cos( theta );
        lat = z * Math.sin( theta );
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
        var timer = null, canRun = true;
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
        var fn = [], $$,
            ctxt = ctxt || window,
            lv = 'throw',
            is = function(o, t) {
                return Object.prototype.toString.call(o).toLowerCase().split(' ')[1].replace(']', '') === (t || 'function').toLowerCase();
            },
            emfun = function(rtn, ct){
                $$.status = 'finish';
                $$.retn = rtn;
            },
            next = function(rtn, rct) {
                var nfn = fn.shift() || emfun;
                fn.length == 0 && ($$.status = 'finish');
                return nfn(rtn, rct);
            },
            err = function(msg) {
                if (is(lv)) {
                    return lv.call(ctxt, msg);
                }
                if (lv == 'log') {
                    if (is(console,'object') && is(console.error)) {
                        console.error(msg);
                    } else {
                        alert(msg);
                    }
                } else {
                    throw new Error(msg);
                }
            };
        return ($$ = {
            retn: null,
            fn: fn,
            status: 'standby',
            level: function(l) {
                return lv = is(l)?l:(l=='log')?'log':'throw', this;
            },
            then: function(f, ctx) {
                var _ = this;
                if (is(f))
                    fn.push(function(rtn, ct) {
                        ctxt = ct || ctx || ctxt;
                        _.retn = rtn || null;
                        f.call(ctxt, next, err, _.retn);
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
                        ctxt = ct || ctx || ctxt;
                        _.retn = rtn || null;
                        o[rtn.flag].call(ctxt, next, err, _.retn);
                    });
                }
                _.status = 'standby';
                return _;
            },
            run: function() {
                this.status = 'running';
                if (fn.length == 0) throw new Error("function queue is empty.");
                var f1 = fn.shift(),
                    args = [undefined, undefined];
                fn.length == 0 && (this.status = 'finish');
                if (arguments.length > 0) {
                    for (var o = 0; o < arguments.length; o++) {
                        args.push(arguments[o]);
                    }
                }
                f1.apply(ctxt, args);
            }
        }, (is(f) && $$.then(f)), $$);
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
                    a = t.shift().replace(']', ''), b;
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
    applyChangeToData: function(t, obj) {
        if ("object" == typeof obj) {
            var n,j,d;
            for (var i in obj) {
                d = t;
                n = i.split('.');
                for (j = 0; j < n.length; j++) {
                    if (n[j].indexOf('[') > 0) {  // 是数组
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
                    }
                    else if ("undefined" != typeof d[n[j]]) { // 是元素
                        if (j == n.length - 1) { //已经循环到最后一层，直接赋值
                            d[n[j]] = obj[i];
                            break;
                        }
                        d = d[n[j]];
                    }
                    else {
                        if (j == n.length - 1) {
                            d[n[j]] = obj[i];
                        }
                        break;
                    }
                }
            }
        }
    },
    extend: (function() {
        var _ = null;
        var j = function(t) {
          _ = ctool;
          var d, c = [].slice.call(arguments, 1);
          if (typeof t == 'boolean') {
            d = t
            t = c.shift()
          }
          c.forEach(function (s) {
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
    })()
};

module.exports = ctool;
