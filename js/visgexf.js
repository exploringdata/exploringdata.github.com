var dialog = $('#nodeinfo');

var visgexf = {
  visid: null,
  filename: null,
  sig: null,
  filters: {},
  graph: null,
  props: null,
  nodelabels: [],
  nodemap: {},
  searchInput: $('.typeahead'),
  activeFilterId: null,
  activeFilterVal: null,
  sourceColor: '#67A9CF',
  targetColor: '#EF8A62',

  init: function(visid, filename, props, callback) {
    $('#loading').show();
    visgexf.visid = visid;
    visgexf.filename = filename;
    visgexf.props = props;
    viscontainer = document.getElementById(visid);
    // adjust height of graph to screen
    var h_win = $(window).height() - $('#navbar').height();
    var h_vis = $(viscontainer).height();
    if (h_win > 400) {
      $(viscontainer).height(h_win);
    }
    visgexf.sig = sigma.init(viscontainer)
      .drawingProperties(props['drawing'])
      .graphProperties(props['graph'])
      .mouseProperties({maxRatio: 128});
    visgexf.sig.parseJson(filename, function(){
      visgexf.sig.draw();
      // create array of node labels used for auto complete once
      if (0==visgexf.nodelabels.length) {
        visgexf.sig.iterNodes(function(n){
          visgexf.nodelabels.push(n.label);
          visgexf.nodemap[n.label] = n.id;
          n.attr.label = n.label;// needed for highlighting
        });
        visgexf.nodelabels.sort();
      }
      visgexf.initSearch();
      visgexf.searchInput.focus();
      // call callback after json is parsed
      if (callback) callback();
      $('#loading').hide();
    });
    visgexf.sig.bind('upnodes', function(event){
      hnode = visgexf.sig.getNodes(event.content)[0];
      document.location.hash = hnode.attr.label;
    });
    return visgexf;
  },

  // set the color of node or edge
  setColor: function(o, c) {
    // don't change node an edge colors of undirected graphs
    if ('undirected' == visgexf.props.type) return;
    o.attr.hl = true;
    o.attr.color = o.color;
    o.color = c;
  },

  hex2dec: function(hexval) {
    return parseInt('0x' + hexval).toString(10)
  },

  // set the opacity of node or edge
  setOpacity: function(o, alpha) {
    var r,g,b;
    var color = o.color;
    // is it a hex color
    if (0 == color.indexOf('#')) {
      r = visgexf.hex2dec(color.slice(1,3));
      g = visgexf.hex2dec(color.slice(3,5));
      b = visgexf.hex2dec(color.slice(5,7));
    }
    else if (0 == color.indexOf('rgba')) {
      var m = color.match(/(\d+),(\d+),(\d+),(\d*.?\d+)/);
      if (m) {
        var colors = m.slice(1,5);
        r = colors[0];
        g = colors[1];
        b = colors[2];
      }
    }
    if (r && g && b)
      o.color = 'rgba(' + r + ',' + g + ',' + b + ',' + alpha + ')';
  },

  // called with array of ids of attributes to use as filters
  getFilters: function(attrids) {
    visgexf.sig.iterNodes(function(n) {
      for (i in attrids) {
        var aname = attrids[i];
        if (n.attr.attributes.hasOwnProperty(aname)) {
          var vals = n.attr.attributes[aname].split('|');
          for (v in vals) {
            val = vals[v];
            if (!visgexf.filters.hasOwnProperty(val)) {
              visgexf.filters[val] = 0;
            }
            visgexf.filters[val]++;
          }
        }
      }
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
    return node.attr.attributes.hasOwnProperty(filterid) && -1 !== node.attr.attributes[filterid].indexOf(filterval)
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

  resetNode: function(node, forceLabel) {
    node.hidden = 0;
    node.forceLabel = forceLabel;
    if (!node.label) node.label = node.attr.label;
    visgexf.setOpacity(node, 1);
  },

  // show node with optional color, check if it satisfies possibly set filter
  nodeShow: function(node, color) {
    if (visgexf.filteredOut(node)) return;
    if (color) visgexf.setColor(node, color);
    visgexf.resetNode(node, 0);
  },

  highlightNode: function(node) {
    visgexf.sig.goTo(node.displayX, node.displayY, 3);
    var sources = {},
        targets = {};
    visgexf.sig.iterEdges(function(e){
      if (e.source != node.id && e.target != node.id) {
        e.hidden = 1;
      } else if (e.source == node.id) {
        targets[e.target] = true;
        visgexf.setColor(e, visgexf.sourceColor);
        e.hidden = 0;
      } else if (e.target == node.id) {
        visgexf.setColor(e, visgexf.targetColor);
        sources[e.source] = true;
        e.hidden = 0;
      }
    }).iterNodes(function(n){
      if (n.id == node.id) {
        visgexf.nodeShow(n);
      } else if (sources[n.id]) {
        visgexf.nodeShow(n, visgexf.targetColor);
      } else if (targets[n.id]) {
        visgexf.nodeShow(n, visgexf.sourceColor);
      } else {
        visgexf.setOpacity(n, .05);
        n.label = null;
      }
    }).draw(2,2,2);
  },

  clear: function() {
    visgexf.sig.emptyGraph();
    document.getElementById(visgexf.visid).innerHTML = '';
  },

  initSearch: function() {
    var labels = new Bloodhound({
      datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
      queryTokenizer: Bloodhound.tokenizers.whitespace,
      local: $.map(visgexf.nodelabels, function(label) { return { value: label }; }),
      limit: 20
    });
    labels.initialize();
    var updater = function(event) {
      event.preventDefault();
      visgexf.redirectHash(visgexf.searchInput.val());
    };

    visgexf.searchInput.typeahead({
        hint: true,
        highlight: true
      }, {
        name: 'languages',
        displayKey: 'value',
        source: labels.ttAdapter()
    }).on('typeahead:selected', updater);
    $('#highlight-node').on('submit', updater);

    if (document.location.hash) {
      visgexf.redirectHash();
    }
    // search on hash change, unless it should trigger info or comments view
    $(window).bind('hashchange', function(event) {
      visgexf.redirectHash();
    });
    $('#search-reset').on('click', function(event) {
      visgexf.resetSearch();
    });
  },

  redirectHash: function(q) {
    if (q) {
      document.location.hash = q;
      return;
    }
    var h = decodeURIComponent(document.location.hash.replace(/^#/, ''));
    visgexf.nodeSearch(h);
  },

  queryHasResult: function(q) {
    return -1 !== visgexf.nodelabels.indexOf(q);
  },

  nodeSearch: function(query) {
    visgexf.resetFilter();
    if (visgexf.queryHasResult(query)) {
      document.location.hash = query;
      visgexf.searchInput.val(query);
      node = visgexf.sig.getNodes(visgexf.nodemap[query])
      visgexf.highlightNode(node);
      return query;
    }
  },

  resetNodes: function() {
    visgexf.sig.iterNodes(function(n){
      if (n.attr.hl) {
        n.color = n.attr.color;
        n.attr.hl = false;
      }
      visgexf.resetNode(n, 0);
      if (visgexf.filteredOut(n)) n.hidden = 1;
    }).iterEdges(function(e){
      if (e.attr.hl) {
        e.color = e.attr.color;
        e.attr.hl = false;
      }
      e.hidden = 0;
    }).draw(2,2,2);
  },

  resetSearch: function() {
    document.location.href = document.location.pathname;
  },

  resetFilter: function() {
    visgexf.activeFilterId = null;
    visgexf.activeFilterVal = null;
    $('.graphfilter li').removeClass('active');
    visgexf.resetNodes();
  },

  // FIXME avoid code duplication
  reset: function() {
    visgexf.activeFilterId = null;
    visgexf.activeFilterVal = null;
    visgexf.searchInput.val('');
    $('.graphfilter li').removeClass('active');
    visgexf.resetNodes();
    dialog.hide();
  }
};

// Node info dialog
function nodeinfo(heading, body) {
    dialog.find('.panel-heading h2').html(heading);
    dialog.find('.panel-body').html(body);
    dialog.show();
}

dialog.find('button').click(function() {
    dialog.hide();
});