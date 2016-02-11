$(function(){
  var props = {
    drawing: {
      defaultLabelColor: '#fff',
      defaultLabelSize: 12,
      labelThreshold: 5,
      defaultEdgeType: 'curve'
    },
    graph: {
      minNodeSize: .5,
      maxNodeSize: 10,
      minEdgeSize: .5,
      maxEdgeSize: 1.5
    },
    forceLabel: 0,
    type: 'undirected'
  }

  var G = visgexf.init('sig', '/gexf/programmers_forceatlas2.json', props);
});