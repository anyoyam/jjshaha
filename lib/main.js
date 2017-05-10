var asyncFun = function(f, ctxt) {
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
    }, (is(f) && $$.push(f)), $$);
}
if ('undefined' != typeof module)
	module.exports = asyncFun;
//export default {asyncFun};
