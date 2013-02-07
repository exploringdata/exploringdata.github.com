var current_feed = null,
  timer = null;

var eqradius = function(feature, index) {
  return d3.scale.pow().exponent(10).domain([0, 10]).range([.8, 300])(feature.properties.mag)
}

var mapselect = '#map',
  width = containerwidth(mapselect),
  height = width/1.5,
  projection = d3.geo.mercator().scale(width/1.05).translate([0, 0]),
  path = d3.geo.path().projection(projection).pointRadius(eqradius),
  eqtitle = function(d) {
    return 'Magnitude: ' + d.properties.mag + ' Place: ' + d.properties.place
  };

var tf = function() {
  return 'translate(' + width / 2 + ',' + height / 2 + ')'
};

var rescale = function() {
  svg.attr('transform', 'translate(' + d3.event.translate + ')'
    + ' scale(' + d3.event.scale + ')')
}

var svg = d3.select(mapselect).append('svg')
  .attr('width', width)
  .attr('height', height)
  .call(d3.behavior.zoom().on('zoom', function() {rescale()}))
    .append('svg:g');

var contriesgroup = svg.append('g')
  .attr('transform', tf)
  .attr('class', 'countries');

var eqgroup = svg.append('g')
  .attr('transform', tf)
  .attr('class', 'earthquake');

// earthquake data
function set_eqs(url, title) {
  current_feed = url;
  if (title) d3.select('#eqtitle').text(title);

  d3.selectAll('.eqsrc').remove(); // cleanup existing scripts
  var script = document.createElement('script');
  script.src = url;
  script.className = 'eqsrc';
  document.getElementsByTagName('head')[0].appendChild(script);
}

function eqfeed_callback(data) {
  eqgroup.selectAll('path').remove();
  eqgroup.selectAll('path')
    .data(data.features)
  .enter().append('path')
    .attr('d', path)
    .on('click', function(d) {document.location.href = d.properties.url})
  .append('title')
    .text(eqtitle);
}

function select_eq(element) {
  d3.selectAll('#eqranges li').classed('active', false);
  var t = d3.select(element);
  d3.select(t[0][0].parentNode).classed('active', true);
  set_eqs(t.attr('href'), t.text());
}

// set refresh intervall
function refresh() {
  timer = setInterval(function(){set_eqs(current_feed)}, 60000);
}

// load eq data for last menu item by default
select_eq(d3.selectAll('#eqranges a')[0].slice(-1)[0]);

// local data
queue()
  .defer(d3.json, '/json/countries.geo.json')
  .await(ready);

function ready(countries) {
  contriesgroup.selectAll('path')
    .data(countries.features)
  .enter().append('path')
    .attr('class', 'country')
    .attr('d', path);
}

/***** events *****/
// range menu selection
d3.selectAll('#eqranges a').on('click', function() {
  window.event.preventDefault();
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
