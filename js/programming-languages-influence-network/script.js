var hlang = null;
// langinfo must be accessible from the external freebase text service script
var langinfo = function(data) {
  var sl = $('#showlang');
  sl.find('h3').text(hlang.label);
  var influenced = [];
  $.each(hlang.attr.influenced, function(idx, item){
    influenced.push(item.name);
  });
  sl.find('.modal-body').html('<div>' + data.result + '... <a href="http://www.freebase.com/view/' + hlang.id + '">view on Freebase</a><h4>Languages Influenced</h4><p>' + influenced.join(', ') + '</p><hr><p>Search for ' + hlang.label + ' books on <a href="http://www.amazon.com/gp/search?ie=UTF8&camp=1789&creative=9325&index=books&keywords=' + encodeURIComponent(hlang.label) + '&linkCode=ur2&tag=xpdt-20">Amazon.com</a></p></div>');
  sl.modal();
};

$(function(){
  var paradigmmenu = $('#paradigms');

  Graph.init('sig');

  $.getJSON('/js/programming-languages-influence-network/data.json', function(data) {
    paradigmmenu.append('<li class="active"><a href="' + Graph.defaultPid + '">All languages (' + data.langs.length + ')</a></li>');
    $.each(data.paradigms, function(idx, item) {
      paradigmmenu.append('<li><a href="' + item.id + '">' + item.name + ' (' + item.count + ')</a></li>');
    });
    Graph.graph(data.langs);
  });

  paradigmmenu.click(function(e){
    e.preventDefault();
    if ('a' == e.target.nodeName.toLowerCase()) {
      var t = $(e.target);
      var pid = t.attr('href');
      paradigmmenu.find('li').removeClass('active');
      t.parent('li').addClass('active');
      Graph.hlParadigm(pid);
    }
  });

  Graph.sig.bind('upnodes', function(event){
    hlang = Graph.sig.getNodes(event.content)[0];
    // add script with callback to avoid cross-origin request issues
    var script = document.createElement('script');
    script.src = 'https://usercontent.googleapis.com/freebase/v1/text' + hlang.id + '?callback=langinfo';
    script.type = 'text/javascript';
    document.getElementsByTagName('head')[0].appendChild(script);
  }).bind('overnodes',function(event){
    hlang = Graph.sig.getNodes(event.content)[0];
    if (0 == hlang.degree) return;
    Graph.hlLang(hlang);
  }).bind('outnodes',function(event){
    if (Graph.pid && Graph.pid != Graph.defaultPid) {
      Graph.hlParadigm(Graph.pid);
    } else {
      Graph.reset();
    }
  });

});
