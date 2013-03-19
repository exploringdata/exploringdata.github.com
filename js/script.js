// adapt containerwidth to screen size
var containerwidth = function(selector) {
  return parseInt($(selector).width())
};
$(function(){
  $('.nav a[href="'+document.location.pathname+'"]').parent('li').attr('class', 'active');
  $('.share a').click(function(e){
    e.preventDefault();
    var b = $(this);
    var action = $.trim(b.find('i').attr('class').replace('icon-', ''));
    _gaq.push(['_trackEvent', 'Sharemenu', action]);
    window.open(b.attr('href'));
  });
  $('.showhelp').click(function(e){
    e.preventDefault();
    $('#help').modal();
  });
});