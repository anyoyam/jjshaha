const http = require("http")
	url = require("url"),
	fs = require("fs"),
	path = require("path");

var tool = {
	param: function(a) {
		var r = {};
		a.split("&").map((i) => {
			var t = i.split("=");
			r[t[0]] = decodeURIComponent(t[1]);
		});
		return r;
	},
	errJson: function(code, status, mesg) {
		return `{"result": ${code}, "status": ${status}, "message": "${mesg}"}`;
	}
};

var server = http.createServer((req, res) => {
	var html = '',
		u = url.parse(req.url);
	if (u.pathname == "/json") {
		res.setHeader('Content-Type', 'application/json');
		var r = tool.param(u.query);
		html = r.s ? r.s : html;
	} else if (u.pathname == "/jsonfile") {
		res.setHeader('Content-Type', 'application/json');
		var r = tool.param(u.query),
			e = false;
		if (r.filename) {
			var fpath = path.resolve(__dirname, "jsondata/", r.filename);
			var isexist = fs.existsSync(fpath);
			if (isexist) {
				html = fs.readFileSync(fpath);
				e = true;
			}
		}
		!e && (html = tool.errJson(200, -100, "文件不存在或没有传递文件名参数filename"));
	}
	res.write(html);
	res.end();
});
server.listen(19080);
console.warn("Listening port 19080...");
console.log("/json?s={a: 1, b: 2}");
console.log("/jsonfile?filename=../../data/a.json");
