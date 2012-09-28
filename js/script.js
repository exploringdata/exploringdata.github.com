$(function(){
  $('#sharemenu .zocial').click(function(e){
    var b = $(this);
    var action = $.trim(b.attr('class').replace('zocial', '').replace('popup', ''));
    _gaq.push(['_trackEvent', 'Sharemenu', action]);
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
  $('.showhelp').click(function(e){
    e.preventDefault();
    $('#help').modal();
  });
});
