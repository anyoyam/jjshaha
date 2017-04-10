(function ($) {
  function initSelectAndSwitch(parent) {
    $("body").on("click", function (e) {
      $("div.iamaselect").removeClass('on');
    });
    $(parent).on("click", "label.iamacheckbox", function () {
      var t = $(this),
          g = t.data('group');
      if (typeof g != "undefined" && g != '') {
        $("label.iamacheckbox[data-group='" + g + "']").removeClass('checked');
        t.addClass('checked');
      } else {
        t.toggleClass("checked");
      }
    });
    $(parent).on("click", "div.iamaselect", function (e) {
      e.stopPropagation();
      $("div.iamaselect.on").removeClass("on");
      $(this).toggleClass('on');
    });
    $(parent).on("click", "div.iamaselect ul li", function (e) {
      e.stopPropagation();
      $(this).siblings().removeClass("active");
      $(this).addClass("active");
      $(this).parents("div.iamaselect")
        .removeClass("on")
        .find("b").text($(this).text());
    });
    $(parent).on("click", "div.iamaswitch", function () {
      $(this).toggleClass("on");
    });
    $(parent).on("click", "span.iamanumber>i:first-child", function (e) {
      e.originalEvent.preventDefault();
      var t = $(this).parent(),
          it = t.find('input'),
          v = (it && parseInt(it.val())) || 0,
          min = t.data("min");
      if (it) {
        if (min != undefined && v <= min) return;
        it.val(--v);
      }
    });
    $(parent).on("click", "span.iamanumber>i:last-child", function (e) {
      e.originalEvent.preventDefault();
      var t = $(this).parent(),
          it = t.find('input'),
          v = (it && parseInt(it.val())) || 0,
          max = t.data("max");
      if (it) {
        if (max != undefined && v >= max) return;
        it.val(++v);
      }
    });
  }

  initSelectAndSwitch('.container');

})(jQuery);
