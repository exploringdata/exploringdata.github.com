var nodeClick = function(Graph) {
  Graph.sig.bind('upnodes', function(event){
    hnode = Graph.sig.getNodes(event.content)[0];
    desc = '<h4>James Bond films starred</h4><p>' + hnode.attr.attributes.films.split('|').sort().join('<br>') + '</p>';
    nodeinfo(hnode.label, desc);
  });
};

$(function(){
  var props = {
    drawing: {
      defaultLabelColor: '#fff',
      defaultLabelSize: 12,
      defaultLabelBGColor: '#fff',
      defaultLabelHoverColor: '#000',
      labelThreshold: 2,
      defaultEdgeType: 'curve'
    },
    graph: {
      minNodeSize: 1,
      maxNodeSize: 20,
      minEdgeSize: .5,
      maxEdgeSize: 2.5
    },
    forceLabel: 0,
    type: 'undirected'
  }

  visgexf.init('sig', '/gexf/jamesbond_fr.json', props, function(){
    var filterid = 'films';
    var filters = visgexf.getFilters([filterid]);
    nodeClick(visgexf);

    var pmenu = $('#paradigms');
    pmenu.append(`<li class="dropdown-item active"><a>All Films (${visgexf.sig.getNodesCount()})</a></li>`);
    $.each(filters, function(idx, item) {
      pmenu.append(`<li class="dropdown-item"><a id="${item[0]}">${item[0]} (${item[1]})</a></li>`);
    });
    pmenu.click(function(event){
      if (t = menuClick(pmenu, event))
        visgexf.setFilter(filterid, t.attr('id'));
    });
  });
});
