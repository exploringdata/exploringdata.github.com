(function($) {
  var k = '38384040373937396665', input = '', f = function(i){return i}, last = [];
  $(document).keyup(function(e) {
    input += '/' + e.keyCode;
    last = input.split('/').slice(-10).filter(f);
    input = last.join('/');
    last.join('') == k && $(document).trigger('konami');
  });
})(jQuery);

$(document).bind('konami', function() {
  document.location.href = '/tools/tweet-shirt-generator/#u/konami';
});

$(function(){
  $('#sharemenu .zocial').click(function(e){
    var b = $(this);
    var url = b.attr('href');
    var win = $(window);
    if (b.hasClass('popup') && win.width() >= 400) {
      var w = win.width() / 2;
      var h = win.height() / 2;
      var left = w - (w/2);
      var top = h - (h/2);
      newwindow=window.open(url,'','width='+w+', height='+h+', top='+top+', left='+left);
      if (window.focus) {newwindow.focus()} return false;
    } else {
      document.location.href = url;
    }
  });

  var s = $('#social');
  if (s) {
    var t = $('#social').offset().top;
    var wh = $(window).height();
    if (wh < t) {
      s.hide();
      $(window).scroll(function(){
        if (t < $(window).scrollTop() + wh - 100) {
          s.show('slow');
        }
      });
    }
  }
});

