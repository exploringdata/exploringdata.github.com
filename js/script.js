// adapt containerwidth to screen size
var containerwidth = function(selector) {
  return parseInt($(selector).width())
};
function containerDim(selector, dim) {
    return parseInt(d3.select(selector).style(dim))
}
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
  $('a[href*="http"]').attr('target', '_top');
});