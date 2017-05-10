module.exports = {
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
    chain: function(o, str, def) {
        //a.b.c.e.f
        //a.b[1].c.e[2].f
        str.split('.').forEach(function(i) {
            if (i == "" || o == undefined) return;
            if (/\[\d+\]/.test(i)) {
                var t = i.split('['),
                    a = t[0],
                    b = t[1].replace(']', '');
                    if (this.is(o[a], 'array') && o[a][b] != undefined) {
                        o = o[a][b];
                    } else {
                        o = undefined;
                    }
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
    }
};
