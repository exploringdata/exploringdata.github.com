var gexf = '/gexf/npmdepgraph.json';

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
      minEdgeSize: .15,
      maxEdgeSize: .15
    },
    forceLabel: 1,
    type: 'directed'
  }

  visgexf.init('sig', gexf, props);
});