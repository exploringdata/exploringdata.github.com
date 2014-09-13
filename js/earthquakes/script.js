var current_feed = null,
    timer = null,
    scaleradius = d3.scale.pow().exponent(10).domain([0, 10]).range([1.2, 360])
    mapselect = '#map',
    width = containerwidth(mapselect),
    height = width * .48,
    eqtitle = function(d) {
      return 'Magnitude: ' + d.properties.mag + ' ◦ Place: ' + d.properties.place
    };

var worldmap = d3.geomap()
    .geofile('/topojson/world/countries.json')
    .width(width)
    .height(height)
    .scale(width/6.2)
    .translate([width/2, height/2.1])
    // fix eq locations on zoom before activating click to zoom
    .postUpdate(postUpdate);

d3.select(mapselect)
    .call(worldmap.draw, worldmap);

var eqgroup = worldmap.svg().append('g')
  .attr('class', 'earthquake zoom');

// earthquake data
function set_eqs(url, title) {
  current_feed = url;
  if (title) d3.select('#eqtitle').text(title);
  $.ajax({
    url: url,
    jsonp: 'eqfeed_callback',
    dataType: 'jsonp'
  });
}

function eqfeed_callback(data) {
  eqgroup.selectAll('circle').remove();
  eqgroup.selectAll('circle')
      .data(data.features)
    .enter().append('circle')
      .attr('transform', function(d) { return 'translate(' + worldmap.properties.path.centroid(d) + ')'; })
      .attr('r', function(d) { return scaleradius(d.properties.mag); })
      .on('click', function(d) { window.open(d.properties.url); })
    .append('title')
      .text(eqtitle);
}

function select_eq(element) {
  d3.selectAll('#eqranges li').classed('active', false);
  var t = d3.select(element);
  d3.select(t.node().parentNode).classed('active', true);
  set_eqs(t.attr('url'), t.text());
}

// set refresh intervall
function refresh() {
  timer = setInterval(function(){set_eqs(current_feed)}, 60000);
}

// load eq data for last menu item by default
select_eq(d3.selectAll('#eqranges a')[0].slice(-1)[0]);

/***** events *****/
// range menu selection
d3.selectAll('#eqranges a').on('click', function() {
  d3.event.preventDefault();
  select_eq(this);
});

// auto update
d3.select('#refresh input').on('change', function() {
  if (this.checked) {
    refresh()
  } else {
    clearInterval(timer)
  }
});
