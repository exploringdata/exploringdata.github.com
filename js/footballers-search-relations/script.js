$(function(){
  var props = {
    drawing: {
      defaultLabelColor: '#fff',
      defaultLabelSize: 12,
      labelThreshold: 6,
      defaultEdgeType: 'curve'
    },
    graph: {
      minNodeSize: .5,
      maxNodeSize: 10,
      minEdgeSize: 1,
      maxEdgeSize: 1
    },
    forceLabel: 0,
    type: 'undirected'
  }

  var G = visgexf.init('sig', '/gexf/footballers-knowledge-graph-maxlevel-5-forceatlas2.json', props);
  nodeClick(G, 'footballers');
});