// adapt containerwidth to screen size
var containerwidth = function(selector) {
  return parseInt($(selector).width())
};

$(function(){
  $('.share a').click(function(e){
    e.preventDefault();
    var b = $(this);
    var action = $.trim(b.find('i').attr('class').replace('icon-', ''));
    _gaq.push(['_trackEvent', 'Sharemenu', action]);
    var url = b.attr('href');
    document.location.href = url;
  });
  $('.showhelp').click(function(e){
    e.preventDefault();
    $('#help').modal();
  });
});

