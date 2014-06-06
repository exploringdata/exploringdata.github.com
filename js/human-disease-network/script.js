$(function(){
  var props = {
    drawing: {
      defaultLabelColor: '#fff',
      defaultLabelSize: 12,
      defaultLabelBGColor: '#fff',
      defaultLabelHoverColor: '#000',
      labelThreshold: 4,
      defaultEdgeType: 'curve'
    },
    graph: {
      minNodeSize: .5,
      maxNodeSize: 15,
      minEdgeSize: .2,
      maxEdgeSize: 1
    },
    forceLabel: 0,
    type: 'directed'
  }
  visgexf
    .init('sig', '/gexf/diseasome.json', props);
});
