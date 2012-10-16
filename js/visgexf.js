var visgexf = {
  visid: null,
  filename: null,
  sig: null,
  filters: {},
  graph: null,
  props: null,
  activeFilterId: null,
  activeFilterVal: null,
  sourceColor: '#67A9CF',
  targetColor: '#EF8A62',
  init: function(visid, filename, props) {
    visgexf.visid = visid;
    visgexf.filename = filename;
    visgexf.props = props;
    visgexf.sig = sigma.init(document.getElementById(visid))
      .drawingProperties(props['drawing'])
      .graphProperties(props['graph'])
      .mouseProperties({maxRatio: 128});
    visgexf.sig.parseGexf(filename);
    visgexf.sig.draw();
    visgexf.events();
    return visgexf;
  },

  // set the color of node or edge
  setColor: function(o, c) {
    // don't change node an edge colors of undirected graphs
    if ('undirected' == visgexf.props.type) return;
    type: 'directed'
    o.attr.hl = true;
    o.attr.color = o.color;
    o.color = c;
  },

  // called with array of ids of attributes to use as filters
  getFilters: function(attrids) {
    visgexf.sig.iterNodes(function(n) {
      n.attr.attributes.map(function(node) {
        if (-1 !== attrids.indexOf(parseInt(node.attr))) {
          var vals = node.val.split('|');
          for (v in vals) {
            val = vals[v];
            if (!visgexf.filters.hasOwnProperty(val)) {
              visgexf.filters[val] = 0;
            }
            visgexf.filters[val]++;
          }
        }
      });
    });
    // sort by frequencies of filter attributes
    var sorted = [];
    for (var a in visgexf.filters) {
      sorted.push([a, visgexf.filters[a]]);
    }
    sorted.sort(function(a, b) { return b[1] - a[1] });
    return sorted;
  },

  nodeHasFilter: function(node, filterid, filterval) {
    var hasFilter = false;
    for (i in node.attr.attributes) {
      var item = node.attr.attributes[i];
      if (filterid === parseInt(item.attr)) {
        if (-1 !== item.val.indexOf(filterval)) {
          hasFilter = true;
          break;
        }
      }
    }
    return hasFilter;
  },

  // show only nodes that match filter
  setFilter: function(filterid, filterval) {
    visgexf.activeFilterId = filterid;
    visgexf.activeFilterVal = filterval;
    visgexf.sig.iterNodes(function(n){
      n.hidden = filterval ? 1 : 0;
      if (visgexf.nodeHasFilter(n, filterid, filterval)) {
        n.hidden = 0;
      }
    }).draw(2,2,2);
  },

  // return true if given node does not satisfy set filter, else false
  filteredOut: function(node) {
    if (null !== visgexf.activeFilterId
        && null !== visgexf.activeFilterVal
        && !visgexf.nodeHasFilter(node, visgexf.activeFilterId, visgexf.activeFilterVal)) {
      return true;
    }
    return false;
  },

  // show node with optional color, check if it satisfies possibly set filter
  nodeShow: function(node, color) {
    if (visgexf.filteredOut(node)) return;
    if (color) visgexf.setColor(node, color);
    if (visgexf.props.forceLabel) node.forceLabel = 1;
    node.hidden = 0;
  },

  events: function() {
    visgexf.sig.bind('overnodes', function(event){
      var hnode = visgexf.sig.getNodes(event.content)[0];
      if (0 == hnode.degree) return;
      var zoomratio = visgexf.sig.graphProperties().position().ratio;
      var sources = {},
          targets = {};
      visgexf.sig.iterEdges(function(e){
        if (e.source != hnode.id && e.target != hnode.id) {
          e.hidden = 1;
        } else if (e.source == hnode.id) {
          targets[e.target] = true;
          visgexf.setColor(e, visgexf.sourceColor);
        } else if (e.target == hnode.id) {
          visgexf.setColor(e, visgexf.targetColor);
          sources[e.source] = true;
        }
      }).iterNodes(function(n){
        if (n.id == hnode.id) {
          visgexf.nodeShow(n);
        } else if (sources[n.id]) {
          visgexf.nodeShow(n, visgexf.targetColor);
        } else if (targets[n.id]) {
          visgexf.nodeShow(n, visgexf.sourceColor);
        } else {
          n.hidden = 1;
        }
      }).draw(2,2,2);
    }).bind('outnodes',function(event){
      visgexf.sig.iterNodes(function(n){
        if (n.attr.hl) {
          n.color = n.attr.color;
          n.attr.hl = false;
        }
        n.hidden = 0;
        n.forceLabel = 0;
        if (visgexf.filteredOut(n)) n.hidden = 1;
      }).iterEdges(function(e){
        if (e.attr.hl) {
          e.color = e.attr.color;
          e.attr.hl = false;
        }
        e.hidden = 0;
      }).draw(2,2,2);
    });
  },

  clear: function() {
    visgexf.sig.emptyGraph();
    document.getElementById(visgexf.visid).innerHTML = '';
  },

  reset: function() {
    visgexf.activeFilterId = null;
    visgexf.activeFilterVal = null;
    visgexf.sig.iterNodes(function(n){
      n.hidden = 0;
    }).iterEdges(function(e){
      e.hidden = 0;
    }).draw(2,2,2);
  }
};
