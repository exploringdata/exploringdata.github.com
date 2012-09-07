/*
TODOs
Language highlighting via search field with autocomplete?
          <div class="nav-collapse collapse">
            <form class="navbar-search pull-left">
              <input type="text" class="search-query" placeholder="Highlight Language">
            </form>
          </div>

Cache http request data in sessionStorage
*/
$(function(){
  var pmenu = $('#paradigms');
  Graph.init('sig');
  $('.showhelp').click(function(e){
    e.preventDefault();
    $('#help').modal();
  });
  pmenu.click(function(e){
    e.preventDefault();
    if ('a' == e.target.nodeName.toLowerCase()) {
      var t = $(e.target);
      var pid = t.attr('href');
      pmenu.find('li').removeClass('active');
      t.parent('li').addClass('active');
      Graph.hlParadigm(pid);
    }
  });
  $.getJSON('/js/programming-languages-influence-network/data.json', function(data) {
    pmenu.append('<li class="active"><a href="' + Graph.defaultPid + '">All languages (' + data.langs.length + ')</a></li>');
    $.each(data.paradigms, function(idx, item) {
      pmenu.append('<li><a href="' + item.id + '">' + item.name + ' (' + item.count + ')</a></li>');
    });
    Graph.graph(data.langs);
  });
});
