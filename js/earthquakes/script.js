// adapt containerwidth to screen size
var containerwidth = function(selector) {
  return parseInt(d3.select(selector).style('width'))
};

var eqradius = function(feature, index) {
  return Math.pow(2, feature.properties.mag) / 20
}

var mapselect = '#map',
  width = containerwidth(mapselect),
  height = width/1.5,
  projection = d3.geo.mercator().scale(width/1.05).translate([0, 0]),
  path = d3.geo.path().projection(projection).pointRadius(eqradius),
  eqtitle = function(d) {return 'Magnitude: ' + d.properties.mag + ' Place: ' + d.properties.place};

var tf = function() {
  return 'translate(' + width / 2 + ',' + height / 2 + ')'
};

var svg = d3.select(mapselect).append('svg')
  .attr('width', width)
  .attr('height', height);

// earthquake data
var script = document.createElement('script');
script.src = 'http://earthquake.usgs.gov/earthquakes/feed/geojsonp/1.0/week';
document.getElementsByTagName('head')[0].appendChild(script);

function eqfeed_callback(data) {
  svg.append('g')
    .attr('transform', tf)
    .attr('class', 'earthquake')
  .selectAll('path')
    .data(data.features)
  .enter().append('path')
    .attr('d', path)
  .append('title')
    .text(eqtitle);
}

// local data
queue()
  .defer(d3.json, '/json/countries.geo.json')
  .await(ready);

function ready(error, countries) {
  svg.append('g')
    .attr('transform', tf)
    .attr('class', 'countries')
  .selectAll('path')
    .data(countries.features)
  .enter().append('path')
    .attr('d', path);
}
