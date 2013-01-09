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
      maxNodeSize: 40,
      minEdgeSize: 0,
      maxEdgeSize: 2
    },
    forceLabel: 0,
    type: 'directed'
  }

  var G = visgexf.init('sig', '/gexf/votes-fruchterman.gexf', props);
  $('.showposter').click(function(e){e.preventDefault();$('#showposter').modal();});
});
