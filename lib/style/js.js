(function ($) {
  function initSelectAndSwitch(parent) {
    $("body").on("click", function (e) {
      $("div.iamaselect").removeClass('on');
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
  }

  initSelectAndSwitch('.container');

})(jQuery);
