function(z) {
    var a = {
        event: {
            d: function(a, b, c, d) {
                var t = false;
                c = c.split('.');
                if (c.length != 2) {
                    c = c[0].split('#');
                    t = true;
                }
                if (c.length != 2) {
                    console.warn("匹配字符串不正确；E.class | E#id");
                    return;
                }
                a.addEventListener(b, function(e) {
                    var o = e.target;
                    if (o.nodeName == c[0].toUpperCase() && (t ? o.id == c[1] : o.className.split(' ').indexOf(c[1]) > -1)) {
                        typeof d == "function" && d.call(o, e);
                    }
                }, true);
            },
            e: function(a, b, c) {
                a.addEventListener(b, c);
            },
            s: function(e) {
                if (typeof e != 'event') return;
                e.stopPropagation();
            }
        },
        one: function(a) {
            return document.querySelector(a); },
        all: function(a) {
            return document.querySelectorAll(a); },
        ajax: function() {
            var xhr = new XMLHttpRequest();
            xhr.onerror = function(e) {
                console.log(e);
            }
            return {
                timeout: function(a) {
                    return xhr.timeout = a, this;
                },
                header: function(a, b) {
                    return xhr.setRequestHeader(a, b), this;
                },
                respMime: function(a) { // 用来指定reponse的数据类型 e.g. xhr.overrideMimeType('text/plain; charset=utf-8');
                    return xhr.overrideMimeType(a), this;
                },
                respType: function(a) {
                    //xhr level 2新增的属性，用来指定xhr.response的数据类型，目前还存在些兼容性问题
                    // text document json blob arrayBuffer
                    return xhr.responseType = a, this;
                },
                cb: function(a) {
                    if (typeof a == "function") {
                        xhr.onreadystatechange = function() {
                            if (this.readyState == 4 && this.status == 200) {
                                a.call(this, this.responseText);
                            }
                        }
                    }
                    return this;
                },
                progress: function(a, t) {
                    if (typeof a == "function") {
                        if (t == undefined || t == "download") {
                            xhr.onprogress = function(e) {
                                a.call(a, e.loaded, e.total, e);
                            }
                        } else if (t == "upload") {
                            xhr.upload.onprogress = function(e) {
                                a.call(a, e.loaded, e.total, e);
                            }
                        }
                    }
                    return this;
                },
                abort: function() {
                    xhr.abort();
                },
                get: function(a, b) {
                    b = b || true;
                    xhr.open("GET", a, b);
                    xhr.send(null);
                },
                post: function(a, b, c) {
                    c = c || true;
                    xhr.open("POST", a, c);
                    if (typeof FormData == "undefined" || !b instanceof FormData) {
                        this.header("Content-Type", "application/x-www-form-urlencoded");
                    }
                    xhr.send(b);
                }
            };
        }
    };
    var d = document,
        t = d.createElement('textarea');
    t.style.cssText = 'position:fixed;top:0;left:0;opacity:.2;z-index:10000;';
    d.body.appendChild(t);
    a.event.d(d.body, "click", "a#", function(e) {
        var o = d.activeElement;
        t.value = this.href;
        t.focus();
        t.select();
        d.execCommand('copy');
        o.focus();
        return false;
    });
    var c = a.ajax().cb(function(a) { console.log(a, this); }).get('/');
}
