var Graph = {
  defaultColor: '#eee',
  srcColor: '#67A9CF',
  dstColor: '#EF8A62',
  defaultPid: '/all',
  pid: null,

  // vis is the element id of the visualization container
  init: function(vis) {
    Graph.nodesbyid = {};
    var container = document.getElementById(vis);
    container.innerHTML = '';
    Graph.sig = sigma.init(container).drawingProperties({
      defaultLabelColor: Graph.defaultColor,
      defaultLabelSize: 14,
      defaultLabelBGColor: Graph.defaultColor,
      defaultLabelHoverColor: '#000',
      labelThreshold: 6,
      defaultEdgeType: 'curve'
    }).graphProperties({
      minNodeSize: .5,
      maxNodeSize: 25,
      minEdgeSize: 1,
      maxEdgeSize: 1
    }).mouseProperties({
      maxRatio: 32
    });
  },

  nodeColor: function(cnt) {
    var color = '#EDF8E9';
    if (cnt > 40) color = '#006D2C';
    else if (cnt > 30) color = '#31A354';
    else if (cnt > 20) color = '#74C476';
    else if (cnt > 0) color = '#BAE4B3';
    return color;
  },

  addNode: function(node) {
    var nid = node['id'];
    Graph.nodesbyid[nid] = true;
    Graph.sig.addNode(nid, {
      x: Math.random(),
      y: Math.random(),
      size: node.size,
      color: Graph.nodeColor(node.size),
      label: node.label,
      id: nid,
      influenced: node.influenced,
      paradigms: node.paradigms
    });
  },

  hasParadigm: function(pid, lang) {
    for (i in lang.attr.paradigms) {
      var p = lang.attr.paradigms[i];
      if (pid == p.id) {
        return true;
      }
    }
    return false;
  },

  hlParadigm: function(pid) {
    Graph.pid = pid;
    Graph.sig.iterNodes(function(n){
      if (Graph.defaultPid == pid || Graph.hasParadigm(pid, n)) {
        n.hidden = 0;
        n.color = Graph.nodeColor(n.size);
      } else {
        n.hidden = 1;
      }
    }).iterEdges(function(e){
      e.hidden = 0;
      e.color = e.defaultColor;
    }).draw(2,2,2);
  },

  hlLang: function(hlang) {
    var influenced = {};
    var influencedby = {};
    Graph.sig.iterEdges(function(e){
      // set e.defaultColor only once
      if (!e.defaultColor) {
        e.defaultColor = e.color;
      }
      if (e.source == hlang.id) {
        e.color = Graph.srcColor;
        influenced[e.target] = true;
      } else if (e.target == hlang.id) {
        e.color = Graph.dstColor;
        influencedby[e.source] = true;
      } else {
        e.hidden = 1;
      }
    }).iterNodes(function(n){
      n.forceLabel = true;
      if (n.id != hlang.id) {
        if (influencedby[n.id]) {
          n.color = Graph.dstColor;
        } else if (influenced[n.id]) {
          n.color = Graph.srcColor;
        } else {
          n.hidden = 1;
          n.forceLabel = false;
        }
      }
    }).draw(2,2,2);
  },

  reset: function() {
    Graph.sig.iterNodes(function(n){
      n.color = Graph.nodeColor(n.size);
      n.hidden = 0;
      n.forceLabel = false;
    }).iterEdges(function(e){
      e.hidden = 0;
      e.color = e.defaultColor;
    }).draw(2,2,2);
  },

  graph: function(data) {
    $.each(data, function(idx, node) {
      Graph.addNode(node);
    });
    Graph.sig.iterNodes(function(n){
      $.each(n.attr.influenced, function(idx, dst) {
        if (Graph.nodesbyid[n.id] && Graph.nodesbyid[dst.id]) {
          Graph.sig.addEdge(n.id + dst.id, n.id, dst.id);
        }
      });
    });
    Graph.sig.draw();
  }

};
