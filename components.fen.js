/************
 *  日历组件 ver 0.1.1
 *  author: yam
 *  date: 2016年4月27日
 *  parameters: 
 *		mdate     需要渲染的月份 支持 xxxx-xx 或 xx格式，xx格式为当年月份
 *  	options   
 *			{
 *				offset: 0,           //当模式是 auto:true 时组件会自动根据父节点宽度计算每个天节点的宽度
 *  	                               offset 可以在计算的宽度基础上 + offset 的值（可为负数及减少宽度）
 *				head: "cal-header",  //星期样式
 *				cell: "cal-cell",    //普通工作日样式
 *				weekend: "cal-weekend",  //周末样式
 *				normal: "no-cell",   //为让日期与星期对齐填充节点样式
 *				sunday: true,        //讲星期日放在第一位 true|false  true时在第一位
 *				active: "cal-active",//激活日期样式 暂无用处
 *				today: "cal-today",  //系统时间当天样式
 *              adddatecls: false,   //是否添加日期class    @+added: 2016年5月3日
 *				auto: true           //是否自动计算各个日期节点宽度 true|false 默认true
 *			};
 *  	cellfn 渲染到每个日期节点时的回调函数 函数体的上下文为日期节点本身
 *   	       追加一个calendar属性 通过 this.calendar 调用
 *   	       {type: "cell", year: 年, month: 月, date: 日, week: 星期(0-6)}
 *  	headfn 渲染到每个星期节点时的回调函数 上下文为节点本身
 *   	       追加一个calendar属性 通过 this.calendar 调用
 *   	       {type: "header", value: 星期(0-6)}
 *  others:
 *   	在节点执行该函数后，该函数会给节点追加一个 calendar 参数，内容：
 *   	.calendar.data {year: 年, month: 月}
 *   	.calendar.original 及为节点本身
 *  usage:
 *   	$(...).fenCal("2016-12", {...});	指定月
 *   	$(...).fenCal({....});				当前月
 *   	$(...).fenCal(cellfn);				当前月并设置日期节点回调
 *   	$(...).fenCal(cellfn, headfn);      ........................和星期头节点回调
 *   	$(...).fenCal("13", {...}, cellfn, headfn);
*************/

$.fn.fenCal = function(mdate, options, cellfn, headfn){
	/*var ___m = {January: 1, February: 2, March: 3, April: 4, May: 5, June: 6, July: 7, August: 8, September: 9, October: 10, November: 11, December: 12};*/
	var v = this;
	if (v.hasClass("has-calendar-render-end")) {return v};
	var z = {
		now: new Date()
	};
	var week = ["日", "一", "二", "三", "四", "五", "六"];   //星期
	var lenDay = [31,null,31,30,31,30,31,31,30,31,30,31];    //每月天数
	var o = {
		offset: 0,
		head: "cal-header",
		cell: "cal-cell",
		weekend: "cal-weekend",
		normal: "no-cell",
		sunday: true,
		active: "cal-active",
		today: "cal-today",
		adddatecls: false,
		auto: true
	};
	var t = {
		archeck: function(){
			switch (typeof(mdate)) {
				case "object":
					options = mdate;
					mdate = undefined;
					break;
				case "function":
					cellfn = mdate;
					mdate = undefined;
					break;
			}
			switch (typeof(options)) {
				case "function":
					headfn = options;
					options = {};
					break;
				case "string":
					mdate = options;
					options = {};
					break;
			}
		},
		isleap: function(year) {
			return 0 === year % 4 && 0 !== year % 100 || 0 === year % 400;
		},
		err: function(e){
			throw new Error(e);
		},
		analyse: function(a){
			var n = null,b = {};
			if (a == undefined)
				n = new Date();
			else {
				if (a.indexOf("-")>-1) {
					var d = a.split("-");
					n = new Date(d[0], d[1]-1, 1);
				}
				else
					n = new Date(z.now.getFullYear(), a-1, 1);
			}
			b.year = n.getFullYear();  //年份
			b.month = n.getMonth() + 1;  //月份
			//月天数
			if (b.month == 2) {
				b.dayCount = t.isleap(b.year) ? 29 : 28;
			} else {
				b.dayCount = lenDay[b.month-1];
			}
			b.startWeek = (new Date(b.year, b.month-1, 1)).getDay();  //1号星期几
			//需要渲染的月份时候包含当前日期 包含为日期 不包含为-1
			b.today = (n.getFullYear() == z.now.getFullYear() && n.getMonth() == z.now.getMonth()) ? z.now.getDate() : -1;
			$.extend(z, b);
		},
		cellwidth: function(){
			return Math.floor(v.width()/7) + o.offset;
		},
		nocount: function(){  //获取日历需要填充的数量
			return o.sunday ? z.startWeek : z.startWeek-1;
		},
		digit: function(n){
			return n < 10 ? '0' + (n|0) : n;
		},
		cell: function(text, width, fn, parent, attr){
			var _t = $("<div/>").text(text);
			if (attr.type == "header") {_t.addClass(o.head)}
			if (attr.type == "cell") {
				_t.addClass(o.cell);
				if (o.adddatecls) {
					_t.addClass("cal-date-" + [attr.year,this.digit(attr.month),this.digit(text)].join(""));
				}
				if (attr.date == z.today) {
					_t.addClass(o.today)
				}
			}
			_t[0].calendar = attr;
			if (o.auto) { _t.css({width: width}); }
			if (fn && typeof(fn) == "function") {
				_t[0].calFn = fn;
				_t[0].calFn.call(_t[0]);
			}
			_t.appendTo(parent);
			return _t;
		}
	};
	t.archeck();  //参数检查
	if (mdate == undefined) { //没有指定日期
	} else {
		if (!/^(20\d{2}\-)?([1-9]|(0[1-9])|1[0,1,2])$/.test(mdate)) {  //指定渲染日期
			t.err("需要渲染的日期格式不正确，正确格式为年份-月份(2016-10)或者只输入月份(12)");
		}
	}   
	//.call(作用域,arg1,arg2,arg3...)  //可将方法绑定到另一个指定对象上运行 更改上下文
	//.apply(作用域,[arg1,arg2,arg3...])
	var JRender = function(){
		$.extend(o, options);
		t.analyse(mdate);  //日期分析
		var w = t.cellwidth();  //计算单元格宽度
		if (o.sunday == false) {
			week.splice(0,1);
			week.push("日");
		}
		//渲染星期
		for(var i=0;i<7;i++) {
			t.cell(week[i], w, headfn, v, {type: "header", value: i});
		}
		//渲染1号之前的天保证星期对齐
		var nocount = t.nocount(),nohtml = "";
		for(var i=0;i<nocount;i++){
			nohtml = nohtml + '<div class="' + o.normal + '"' + (o.auto ? (' style="width: ' + w + 'px"') : '') + '>&nbsp;</div>';
		}
		$(nohtml).appendTo(v);
		//渲染月份中的每一天
		var wk = -1;
		for(var i=1;i<z.dayCount+1;i++){
			if (wk == -1) {
				wk = z.startWeek;
			} else {
				wk++;
			}
			if (wk == 7) wk = 0;
			t.cell(i, w, cellfn, v, {type: "cell", year: z.year, month: z.month, date: i, week: wk});
		}
		//渲染月末之后的天，保证星期对齐
		var endnocount = o.sunday ? 6 - wk : 7 - wk;
		nohtml = "";
		for(var i=0;i<endnocount;i++){
			nohtml+='<div class="' + o.normal + '"' + (o.auto ? (' style="width: ' + w + 'px"') : '') + '>&nbsp;</div>';
		}
		$(nohtml).appendTo(v);
		v.addClass("has-calendar-render-end");
		this.date = {year: z.year, month: z.month};
		this.original = v;
		v[0].calendar = this;
	}
	return new JRender();
};

/******************
 *  多选组件 ver 0.1
 *  author: yam
 *  date: 2016年4月27日
 *  parameters:
 *		opt
 *			{
 *				container: null,      //父容器 （必填）
 *				item: null,           //需要处理的子节点 每个节点会对应一个位置坐标 {x:0, y:0}（必填）
 *				step: 7,              //步长
 *              selectOne: false,     //为true时会禁用多选，只可以单选 @+added: 2016年5月3日
 *				clsPrefix: "_mutilSel",  //状态类选择器前缀
 									       每个节点会自动添加一个选择器 [prefix]_x坐标y坐标
 									       选中状态的节点会有 [prefix]_sel
 									       高亮预选节点（多选时）会有 [prefix]_preSel
 *				mutilKey: "ctrlKey",  //多选及多选反选时需要触发的键盘键
 				mselPreview: false    //多选时是否高亮预选节点
 *			};
 *		fn 在完成单选或多选后触发该回调 上下文为最后鼠标触发时间的节点本身 两个参数
		   1. {type: 多选还是单选(single|mutil), item:选中的节点(单选时为节点本身，所选时为当次选择区域的节点), host: 对象本身}
		   2. 事件对象
 *		attr  附加参数 用来对对象进行标记 通过 .flag 来获取
 *	others:
 		执行该函数后，会对父容器追加一个 mutilSel 参数 该参数及为该函数返回的对象的引用
 		对象包含以下定义的属性和方法
 		   .points         选中的所有坐标集合
 		   .flag           调用函数时传入的附加参数
 		   .related        作用在的父容器对象引用
 		   .getSelItems()  获取所有选中的节点对象集合
 		   .selectX(x, true|false)   设置横向选择 (x坐标 反选)
 		   .selectY(y, true|false)   设置纵向选择 (y坐标 反选)
 		   .clear()    清楚所有选中项
 *	usage:
 		$.mutilSel({...}, fn, {...});
 		$.mutilSel({...}, {...});  没有回调函数
******************/
$.mutilSel = function(opt, fn, attr){
	//通用工具
	var tool = {
		isEqu: function(){
			if(pstart.x == pend.x && pstart.y == pend.y) return true;
			return false;
		},
		reSet: function(a){
			if ((pend.x < pstart.x) || (pstart.x == pend.x && pend.y<pstart.y)) {
				a = pend;
				pend = pstart;
				pstart = a;
			}
		},
		err: function(a) {
			throw new Error(a);
		}
	};
	if (opt == undefined || typeof(opt) != "object") {
		t.err("多选组件参数不正确，第一个参数必须为对象");
	}
	if (opt.container == undefined || opt.item == undefined) {
		t.err("参数不正确，container和item为必填参数");
	}
	if (typeof(fn) != "function" && typeof(fn) == "object") {
		attr = fn;
		fn = undefined;
	}
	if ($(opt.container).hasClass("has-mutilsel-render-end")) {return false};
	//初始化参数
	var z = {
		container: null,
		item: null,
		step: 7,
		selectOne: false,
		clsPrefix: "_mutilSel",
		mutilKey: "ctrlKey",
		mselPreview: false
	};
	var x = []; //选中元素的坐标集合
	var itm = [];  //选择元素的原始对象集合
	var fn = (fn && typeof(fn) == "function") ? fn : null;
	$.extend(z, opt);
	//鼠标开始点
	var pstart = {x:-1,y:-1};
	//鼠标结束点
	var pend = {x:0,y:0};
	//选中与未选中
	var actItem = function(a,b,c){
		c = $(z.container + " ." + z.clsPrefix + "_" + a.x +"" + a.y);
		if(b == false) {
			c.removeClass(z.clsPrefix + "_sel");
		} else {
			c.addClass(z.clsPrefix + "_sel");
			itm.push(c[0]);
		}
	};
	//从数组中移除
	var rmPop = function(a, b) {
		b = b || $.parseJSON(a);
		if (x.indexOf(a)>-1){
			x.splice(x.indexOf(a), 1);
			actItem(b, false);
		}
	}
	//添加到数组中  当按中alt有反选效果
	var arrPush = function(a, b) {
		if (b && x.indexOf(a)>-1) {
			return rmPop(a);
		}
		if (x.indexOf(a)>-1) return !1;
		x.push(a);
		actItem($.parseJSON(a));
	}
	//鼠标坐标处理
	var dataProcess = function(a){
		if (!a) return !1;
		for(var i=pstart.x;i<=pend.x;i++) {
			if (pstart.x == pend.x) { //单行
				for(var j=pstart.y;j<=pend.y;j++) {
					arrPush('{"x":' + i + "," + '"y":' + j +"}", a);
				}
				break;
			}
			else {
				if (i == pstart.x) {
					for(var j=pstart.y;j<=z.step;j++) {
						arrPush('{"x":' + i + "," + '"y":' + j +"}", a);
					}
				}
				else if(i == pend.x) {
					for(var j=1;j<=pend.y;j++) {
						arrPush('{"x":' + i + "," + '"y":' + j +"}", a);
					}					
				}
				else {
					for(var j=1;j<=z.step;j++) {
						arrPush('{"x":' + i + "," + '"y":' + j +"}", a);
					}
				}
				continue;
			}
		}
	};
	//行选择方法，调用时需要设置上下文
	// k 要对比的值  l 指定是x轴还是y轴 e 键盘事件true|false
	var lineSel = function (k,l,e) {
		var its = this.children;
		for (var i=0;i<its.length;i++) {
			var a = $(its[i]);
			var b = a.data("x"), c = a.data("y");
			var d = (l=="x") ? b : c;  //
			var f = '{"x":' + b + ',"y":' + c + '}';
			if (d == k) {
				arrPush(f, e);
			}
		}
	}
	function main(){
		var _j = this;
		_j.points = x;
		_j.flag = attr;
		_j.related = $(z.container);
		_j.getSelItems = function(){
			return _j.related.children("." + z.clsPrefix + "_sel");
		};
		_j.children = _j.related.children(z.item);
		_j.selectX = function(x, k) {
			lineSel.apply(_j, [x, "x", k]);
		};
		_j.selectY = function(y, k) {
			lineSel.apply(_j, [y, "y", k]);
		};
		_j.clear = function(){
			while (_j.points.length>0) {
				rmPop(_j.points[0]);
			}
		};
		_j.related[0].mutilSel = _j;
		var ismutil = false;
		//开始点击事件
		var dstart = function(e){
			e.preventDefault();
			pstart.x = $(this).data("x");
			pstart.y = $(this).data("y");
			//$(this).addClass(z.clsPrefix + "_sel");
			if (e[z.mutilKey]) {
				ismutil = true;
			}
		};
		//结束点击事件
		var dend = function(e){
			if (pstart.x == -1) return !1;
			var ctrl = e[z.mutilKey];
			itm = [];  //清空节点集合
			e.preventDefault();
			pend.x = $(this).data("x");
			pend.y = $(this).data("y");
			tool.reSet(); //开始点与结束点检查
			//去掉预选背景色
			$(z.container + " ." + z.clsPrefix + "_preSel").removeClass(z.clsPrefix + "_preSel");
			ismutil = false;
			if (tool.isEqu()) { //判断是否是点击事件
				var _ad = '{"x":' + pend.x + "," + '"y":' + pend.y +"}";
				var _tm = x.indexOf(_ad);
				if(_tm>-1) {  //存在
					rmPop(_ad);
				} else { //不存在
					if (z.selectOne && _j.points.length>0) {

					} else {
						arrPush(_ad);
					}
				}
				fn && fn.call(this, {type:"single", item:itm, host:_j}, e);  //执行回调
				return !0;
			} else {
				if (z.selectOne) return !0;
				dataProcess(ctrl);
			}
			fn && fn.call(this, {type:"mutil", item:itm, host:_j}, e);  //执行回调
		};

		var h=1,y=1;
		$(z.container + " " + z.item).each(function(i){
			if (i==0){
				var idx = $(this).index() % z.step;  //起始坐标
				if (idx!=0)
					y = ++idx;
			}
			$(this).attr("data-x", h).attr("data-y", y);
			$(this).addClass(z.clsPrefix + "_" + h +"" + y);
			y++;
			if (y>z.step) {
				h++;y=1;
			}
		}).on("mousedown", dstart).on("mouseup", dend).on("mouseover", function(){
			if (pstart.x == -1 || !ismutil || !z.mselPreview) return !1;
			var m = $(this);
			var pend = {x:m.data("x"), y:m.data("y")};
			var preList = [];
			var preClass = z.clsPrefix + "_preSel";
			for(var i=pstart.x;i<=pend.x;i++) {
				if (pstart.x == pend.x) { //单行
					for(var j=pstart.y;j<=pend.y;j++) {
						preList.push(z.container + " ." + z.clsPrefix + "_" + i + "" + j);
					}
					break;
				}
				else {
					if (i == pstart.x) {
						for(var j=pstart.y;j<=z.step;j++) {
							preList.push(z.container + " ." + z.clsPrefix + "_" + i + "" + j);
						}
					}
					else if(i == pend.x) {
						for(var j=1;j<=pend.y;j++) {
							preList.push(z.container + " ." + z.clsPrefix + "_" + i + "" + j);
						}					
					}
					else {
						for(var j=1;j<=z.step;j++) {
							preList.push(z.container + " ." + z.clsPrefix + "_" + i + "" + j);
						}
					}
					continue;
				}
			}
			$(z.container + " ." + preClass).removeClass(preClass);
			$(preList.join(",")).addClass(preClass);
		});
		$(z.container).addClass("has-mutilsel-render-end");
	};
	return new main();
}

$.doo = function(fn, context) {
	if (typeof(fn) != "function") return !1;
	if (!context || typeof(context) != "object") return !1;

	var _call = function(fn, ctxt, para){
		var ctxt = ctxt == null ? fn : ctxt;
		var args = [];
		if (para.length>2) {
			for(var i=2;i<para.length;i++) {
				args.push(para[i]);
			}
		}
		return fn.apply(ctxt,args);
	}
	var main = function(a, b, c) {
		var _t = this;
		_t.retn = null;
		_t.then = function(fn, context) {
			if (typeof(fn) != "function") return !1;
			if (!context || typeof(context) != "object") return !1;
			_t.retn = _call(fn, context, arguments);
			return _t;
		};
		_t.retn = _call(fn, b, c);
	}
	return new main(fn, context, arguments);
}