var asyncFun = function(f, ctxt) {
	var fn = [], _main,
		ctxt = ctxt || window,
		lv = 'throw',
		is = function(o, t) {
			return Object.prototype.toString.call(o).toLowerCase().split(' ')[1].replace(']', '') === (t || 'function').toLowerCase();
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
		fork: function(o) {
			var _ = this;
			if (is(o, 'object')) {
				fn.push(function(rtn, ct) {
					if (!is(rtn, 'object') || rtn.flag == undefined) {
						throw new Error('need flag to decide which function will be run, when start a FORK method.');
					}
					if (o[rtn.flag] == undefined || !is(o[rtn.flag])) {
						throw new Error('function "' + rtn.flag + '" not found.');
					}
					ctxt = ct || ctxt;
					_.retn = rtn || null;
					o[rtn.flag].call(ctxt, next, err, _.retn);
				});
			}
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
