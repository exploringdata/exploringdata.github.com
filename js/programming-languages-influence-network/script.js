var hlang = null;
// langinfo must be accessible from the external freebase text service script
var langinfo = function(data) {
  var sl = $('#showlang');
  sl.find('h3').text(hlang.label);
  var influenced = [];
  $.each(hlang.attr.influenced, function(idx, item){
    influenced.push(item.name);
  });
  var desc = data.result + '... <a href="http://www.freebase.com/view/' + hlang.id + '">view on Freebase</a>';
  // in case of Ruby include Matz tweet
  if ('Ruby' === hlang.label) {
    desc = '<blockquote class="twitter-tweet"><p>NowBrowsing: Programming Languages Influence Network <a href="http://t.co/kzdSlrpt" title="http://exploringdata.github.com/vis/programming-languages-influence-network/">exploringdata.github.com/vis/programmin…</a></p>&mdash; Yukihiro Matsumoto (@yukihiro_matz) <a href="https://twitter.com/yukihiro_matz/status/251612155470823425" data-datetime="2012-09-28T09:19:47+00:00">September 28, 2012</a></blockquote><script src="//platform.twitter.com/widgets.js" charset="utf-8"></script>' + desc;
  }
  sl.find('.modal-body').html('<div>' + desc + '<h4>Languages Influenced</h4><p>' + influenced.join(', ') + '</p><hr><p>Search for ' + hlang.label + ' books on <a href="http://www.amazon.com/gp/search?ie=UTF8&camp=1789&creative=9325&index=books&keywords=' + encodeURIComponent(hlang.label) + '&linkCode=ur2&tag=xpdt-20">Amazon.com</a></p></div>');
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
