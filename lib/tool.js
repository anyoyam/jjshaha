module.exports = {
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
        var a = Object.prototype.toString.call(o).toLowerCase().replace(/[\[\]]/g, '').split(' ')[1];
        (t != undefined) && (t = t.toLowerCase());
        return t == undefined ? a : (a == t ? !0 : !1);
    }
};
