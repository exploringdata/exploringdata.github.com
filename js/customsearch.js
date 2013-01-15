(function() {
  var cx = '017337174147211687926:ocjb1eiqcfw';
  var gcse = document.createElement('script'); gcse.type = 'text/javascript'; gcse.async = true;
  gcse.src = (document.location.protocol == 'https:' ? 'https:' : 'http:') +
      '//www.google.com/cse/cse.js?cx=' + cx;
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(gcse, s);
})();

jQuery(function($){
  //$('#gcse-data').submit(function)
  var query = decodeURIComponent(document.location.search.replace(/\?.*q=/, '')).replace(/\+/g, ' ');
  if (query) {
    $('#gsc-search').removeClass('hidden');
    $('#q').val(query);
  }
});
