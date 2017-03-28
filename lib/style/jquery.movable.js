/**
 * 拖动移动 ver 0.0.1
 * author: yam
 * date: 2016年7月8日
 * parameters: opt
   {
        bind: ''   //指定要监听的子节点，监听子节点当子节点拖动时父节点移动位置
                   //不指定则由父节点监听事件
   }
 * usage: $("...").makeItMovable({bind: '...'});  //监听子节点
          $("...").makeItMovable();  //监听父节点
**/
$.fn.makeItMovable = (function ($) {
  var _ = null,
      s = { x: 0, y: 0 },
      v = { x: 0, y: 0 },
      p = { x: 0, y: 0 },
      m = false;
  $("body").on("mousedown", function (e) {
    s.x = e.clientX;
    s.y = e.clientY;
  });
  $("body").on("mousemove", function (e) {
    if (m == true) {
      e.preventDefault();
      v.x = e.clientX - s.x;
      v.y = e.clientY - s.y;
      _.css({ top: p.y + v.y, left: p.x + v.x });
    }
  });
  function fins(e) {
    if (_ == null) return;
    m = false;
    s.x = 0; s.y = 0; v.x = 0; v.y = 0;
    p.x = parseInt(_.css("left"));
    p.y = parseInt(_.css("top"));
    _.addClass("ismoved");
  };
  //n.on("mouseup", fins).on("mouseout", fins);
  $("body").on("mouseup", fins);
  return function (opt) {
    var option = {
          bind: '',
        },
        n = this,
        o = this;
    $.extend(option, opt);
    if (option.bind && option.bind != '') {
      n = this.find(option.bind);
    }
    n.css("cursor", "move");
    n.on("mousedown", function (e) {
      p.x = parseInt(o.css("left"));
      p.y = parseInt(o.css("top"));
      m = true;
      _ = o;
    });
  }
})(jQuery);
