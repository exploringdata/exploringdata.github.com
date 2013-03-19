// popup based on sigma example http://sigmajs.org/examples/more_node_info.html
var popUp;

function getVotes(node) {
  if (!node.attr.attributes.hasOwnProperty('votes'))
    return false;
  votes = node.attr.attributes.votes.split('|');
  content = 'Votes given to:<br>';
  for (i in votes) {
    pos = parseInt(i) + 1;
    content += pos + ': ' + votes[i] + '<br>';
  }
  return content;
}

function showNodeInfo(event) {
  popUp && popUp.remove();
  var hnode = visgexf.sig.getNodes(event.content)[0];
  if (false === (content = getVotes(hnode)))
    return;
  popUp = $(document.createElement('div'));
  popUp.append(content)
  .attr('id', 'node-info'+visgexf.sig.getID())
  .css({
    'display': 'inline-block',
    'border-radius': 3,
    'padding': 5,
    'background': '#fff',
    'opacity': .7,
    'color': '#000',
    'box-shadow': '0 0 4px #666',
    'position': 'absolute',
    'left': hnode.displayX,
    'top': hnode.displayY+15
  });
  $('#sig').append(popUp);
}

function hideNodeInfo(event) {
  popUp && popUp.remove();
  popUp = false;
}

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
  visgexf
    .init('sig', '/gexf/ballon-dor-2012-votes-fruchterman.json', props)
    .sig.bind('overnodes', showNodeInfo).bind('outnodes', hideNodeInfo).draw();
  $('.showposter').click(function(e){e.preventDefault();$('#showposter').modal();});
});
