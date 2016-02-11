var gexf = '/gexf/npmdepgraph.min10.json';

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
      minEdgeSize: .8,
      maxEdgeSize: .8
    },
    forceLabel: 1,
    type: 'directed'
  }

  visgexf.init('sig', gexf, props);
});