$(function(){
  var sigInst = sigma.init(document.getElementById('sig')).drawingProperties({
    defaultLabelColor: '#fff',
    defaultLabelSize: 12,
    defaultLabelBGColor: '#fff',
    defaultLabelHoverColor: '#000',
    labelThreshold: 4,
    defaultEdgeType: 'curve'
  }).graphProperties({
    minNodeSize: 0.5,
    maxNodeSize: 15,
    minEdgeSize: 1,
    maxEdgeSize: 1
  }).mouseProperties({
    maxRatio: 32
  });
  sigInst.parseGexf('/js/human-disease-network/diseasome.gexf');
  sigInst.draw();

  sigInst.bind('overnodes', function(event){
    var hnode = sigInst.getNodes(event.content)[0];
    if (0 == hnode.degree) return;
    var zoomratio = sigInst.graphProperties().position().ratio;
    var hlinks = {};
    sigInst.iterEdges(function(e){
      if (e.source != hnode.id && e.target != hnode.id) {
        e.hidden = 1;
      } else if (e.source == hnode.id) {
        hlinks[e.target] = true;
      }
    }).iterNodes(function(n){
      if (n.id != hnode.id && !hlinks[n.id]) {
        n.hidden = 1;
      }
    }).draw(2,2,2);
  }).bind('outnodes',function(event){
    sigInst.iterNodes(function(n){
      n.hidden = 0;
    }).iterEdges(function(e){
      e.hidden = 0;
    }).draw(2,2,2);
  });

  $('body').bind('mousewheel', function(){
    var zoomratio = sigInst.graphProperties().position().ratio;
    if (zoomratio > 4.5)
      sigInst.iterNodes(function(n){ n.forceLabel = 1; });
    else
      sigInst.iterNodes(function(n){ n.forceLabel = 0; });
  });

});
