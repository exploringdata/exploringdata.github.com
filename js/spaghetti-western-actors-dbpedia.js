$(function(){
  var props = {
    drawing: {
      defaultLabelColor: '#fff',
      defaultLabelSize: 12,
      defaultLabelBGColor: '#fff',
      defaultLabelHoverColor: '#000',
      labelThreshold: 8,
      defaultEdgeType: 'curve'
    },
    graph: {
      minNodeSize: 1,
      maxNodeSize: 28,
      minEdgeSize: 0.1,
      maxEdgeSize: 10
    },
    forceLabel: 0,
    type: 'undirected'
  }
  visgexf.init('sig', '/gexf/spaghetti-western-actors-dbpedia.json', props);
});
