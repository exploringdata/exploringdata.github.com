var langinfo = function(hlang) {
  var influenced = [],
    influencedby = [],
    desc = '';

  if ('undefined' !== typeof hlang.attr.attributes.influenced) {
    hlang.attr.attributes.influenced.split('|').forEach(function(i){
      influenced.push('<a href="#' + i + '">' + i + '</a>');
    });
  }
  if ('undefined' !== typeof hlang.attr.attributes.influencedby) {
    hlang.attr.attributes.influencedby.split('|').forEach(function(i){
      influencedby.push('<a href="#' + i + '">' + i + '</a>');
    });
  }

  // in case of Ruby include Matz tweet
  if ('Ruby' === hlang.label) {
    desc = '<blockquote class="twitter-tweet"><p>NowBrowsing: Programming Languages Influence Network <a href="http://t.co/kzdSlrpt" title="http://exploringdata.github.com/vis/programming-languages-influence-network/">exploringdata.github.com/vis/programmin…</a></p>&mdash; Yukihiro Matsumoto (@yukihiro_matz) <a href="https://twitter.com/yukihiro_matz/status/251612155470823425" data-datetime="2012-09-28T09:19:47+00:00">September 28, 2012</a></blockquote><script src="//platform.twitter.com/widgets.js" charset="utf-8"></script>' + desc;
  }

  if (influenced.length)
    desc += '<h4>Languages Influenced</h4><p>' + influenced.join(', ') + '</p>';
  if (influencedby.length)
    desc += '<h4>Influenced by</h4><p>' + influencedby.join(', ') + '</p>';

  desc += '<hr><h4>Search for ' + hlang.label + ' books on</h4>';

  var s = encodeURIComponent(hlang.label);
  desc += '<a class="small" href="http://www.amazon.com/gp/search?ie=UTF8&camp=1789&creative=9325&index=books&keywords=' + s + '&linkCode=ur2&tag=xpdt-20">Amazon.com</a> • ';
  desc += '<a class="small" href="http://www.amazon.co.uk/gp/search?ie=UTF8&camp=1634&creative=6738&index=books&keywords=' + s + '&linkCode=ur2&tag=xpdt-21">Amazon.co.uk</a> • ';
  desc += '<a class="small" href="http://www.amazon.de/gp/search?ie=UTF8&camp=1638&creative=6742&index=english-books&keywords=' + s + '&linkCode=ur2&tag=xpdt0b-21">Amazon.de</a> • ';
  desc += '<a class="small" href="http://www.amazon.ca/gp/search?ie=UTF8&camp=15121&creative=330641&index=books-ca&keywords=' + s + '&linkCode=ur2&tag=xpdt0b-20">Amazon.ca</a>';

  nodeinfo(hlang.label, desc);
};

var menuclick = function(menu, event) {
  event.preventDefault();
  if ('a' == event.target.nodeName.toLowerCase()) {
    var t = $(event.target);
    menu.find('li').removeClass('active');
    t.parent('li').addClass('active');
    return t;
  }
  return false;
};

var randomNodeColor = function(num) {
  var color = '#bfbab7';
  if (num > 40) color = '#006D2C';
  else if (num > 30) color = '#31A354';
  else if (num > 20) color = '#74C476';
  else if (num > 0) color = '#BAE4B3';
  return color;
};

var nodeClick = function(Graph) {
  Graph.sig.bind('upnodes', function(event){
    hlang = Graph.sig.getNodes(event.content)[0];
    langinfo(hlang);
  });
};

$(function(){
  var props = {
    drawing: {
      defaultLabelColor: '#fff',
      defaultLabelSize: 12,
      defaultLabelBGColor: '#fff',
      defaultLabelHoverColor: '#000',
      labelThreshold: 3,
      defaultEdgeType: 'curve'
    },
    graph: {
      minNodeSize: .5,
      maxNodeSize: 25,
      minEdgeSize: 1,
      maxEdgeSize: 1
    },
    forceLabel: 1,
    type: 'directed'
  }

  visgexf.init('sig', gexf, props, function() {
    var filterid = 'paradigms';
    var filters = visgexf.getFilters([filterid]);
    nodeClick(visgexf);

    var pmenu = $('#paradigms');
    pmenu.append('<li class="active"><a href="#">All languages (' + visgexf.sig.getNodesCount() + ')</a></li>');
    $.each(filters, function(idx, item) {
      pmenu.append('<li><a href="#' + item[0] + '">' + item[0] + ' (' + item[1] + ')</a></li>');
    });
    pmenu.click(function(event){
      if (t = menuclick(pmenu, event))
        visgexf.setFilter(filterid, t.attr('href').replace('#', ''));
    });
  });

  $('.showposter').click(function(e){e.preventDefault();$('#showposter').modal();});
});