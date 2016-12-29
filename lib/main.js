var asyncFun = function(f, ctxt) {
	var fn = [], _main,
		ctxt = ctxt || window,
		lv = 'throw',
		is = function(fn, ty) {
			return typeof fn === (ty || 'function');
		},
		emfun = function(rtn, ct){
			_main.retn = rtn;
		},
		next = function(rtn, ctxt) {
			var nfn = fn.shift() || emfun;
			return nfn(rtn, ctxt);
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
	if (is(f)) {
		fn.push(f);
	}
	return (_main = {
		retn: null,
		level: function(l) {
			return lv = is(l)?l:(l=='log')?'log':'throw', this;
		},
		then: function(f) {
			var _ = this;
			if (is(f))
				fn.push(function(rtn, ct) {
					ctxt = ct || ctxt;
					_.retn = rtn || null;
					f.call(ctxt, next, err, _.retn);
				});
			return _;
		},
		run: function() {
			var f1 = fn.shift(),
				f2 = fn.shift() || emfun,
				args = [f2, err];
			if (arguments.length > 0) {
				for (var o = 0; o < arguments.length; o++) {
					args.push(arguments[o]);
				}
			}
			f1.apply(ctxt, args);
		}
	});
}
if ('undefined' != typeof module)
	module.exports = asyncFun;
//export default {asyncFun};
