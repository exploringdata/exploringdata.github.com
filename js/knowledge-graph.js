var nodeinfo = function(dataid, data, name) {
  var sl = $('#shownode');
  sl.find('h3').text(hnode.label);
  var desc = '<div><img src="/img/' + name + '/' + dataid + '.jpg" class="img-polaroid pull-right" alt="Photo of ' + hnode.label + '">';
  desc += data.abstract + ' <a href="' + data.wikipedia_url + '">Wikipedia</a><div>';
  if (data.twitter_url)
    desc += '<a class="btn" href="' + data.twitter_url + '"></a> ';
  if (data.facebook_url)
    desc += '<a class="btn" href="' + data.facebook_url + '"></a> ';
  if (data.gplus_url)
    desc += '<a class="btn" href="' + data.gplus_url + '"></a> ';
  if (data.related_searches) {
    desc += '<h4>Related Searches</h4><ul>';
    for(i in data.related_searches) {
      var q = data.related_searches[i];
      // make sure this is a node in the graph, could still be a rejected query
      if (visgexf.queryHasResult(q))
        desc += '<li><a href="#' + q + '">' + q + '</a></li>';
    }
    desc += '</ul>';
  }
  if (data.related_books) {
    desc += '<h4>Related Book</h4><ul>';
    for(i in data.related_books) {
      var q = data.related_books[i];
      var s = encodeURIComponent(q);
      desc += '<li><a href="http://www.amazon.com/gp/search?ie=UTF8&camp=1789&creative=9325&index=books&keywords=' + q + '&linkCode=ur2&tag=xpdt-20">' + q + '</a></li>';
    }
    desc += '</ul>';
  }
  sl.find('.modal-body').html(desc);
  sl.modal();
};

var nodeClick = function(Graph, name) {
  Graph.sig.bind('upnodes', function(event){
    hnode = Graph.sig.getNodes(event.content)[0];
    dataid = hnode.id;
    // legacy exception for programmers
    if ('undefined' !== typeof hnode.attr.attributes.dataid)
      dataid = hnode.attr.attributes.dataid;
    $.getJSON('/json/' + name + '/' + dataid + '.json', function(data){
      nodeinfo(dataid, data, name);
    });
  });
};