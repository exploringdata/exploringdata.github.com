var twitter_list = function(heading, screen_names) {
  var html = '';
  if (screen_names.length > 0) {
    list = [];
    for(i in screen_names) {
      var sn = screen_names[i];
      // make sure this is a node in the graph, could still be a rejected query
      if (visgexf.queryHasResult(sn))
        list.push('<a href="#' + sn + '">' + sn + '</a>')
    }
    html += '<h4>' + heading + '</h4>' + list.join(' - ');
  }
  return html;
};

var nodeClick = function(Graph) {
    Graph.sig.bind('upnodes', function(event){
        hnode = Graph.sig.getNodes(event.content)[0];
        $.getJSON('/json/visualisingdata-census-twitter/' + hnode.id + '.json', function(data){
            var desc = '<blockquote><p>' + data.description + '</p></blockquote>';
            desc += '<p><a href="https://twitter.com/' + data.screen_name + '">Twitter Profile</a>';
            if (data.url.length > 0)
              desc += ' | <a href="' + data.url + '">Homepage</a>';
            desc += '</p>';
            desc += twitter_list('Twitter Friends from Census', data.friends_census);
            desc += twitter_list('Twitter Followers from Census', data.followers_census);
            nodeinfo(data.name, desc);
        });
    });
};

$(function(){
  var props = {
    drawing: {
      defaultLabelColor: '#fff',
      defaultLabelSize: 12,
      defaultLabelBGColor: '#fff',
      defaultLabelHoverColor: '#000',
      labelThreshold: 6,
      defaultEdgeType: 'curve'
    },
    graph: {
      minNodeSize: .5,
      maxNodeSize: 40,
      minEdgeSize: .3,
      maxEdgeSize: .3
    },
    forceLabel: 1,
    type: 'directed'
  }

  visgexf.init('sig', '/gexf/visualisingdata-census-twitter-processed.json', props, function() {
    nodeClick(visgexf);
  });
});