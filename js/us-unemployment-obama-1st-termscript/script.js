// adapt containerwidth to screen size
var containerwidth = function(selector) {
  return parseInt(d3.select(selector).style('width'))
};

var mapselect = '#map',
  width = containerwidth(mapselect),
  height = width/2,
  map = d3.geo.albersUsa().scale(width),
  path = d3.geo.path().projection(map),
  countryname = function(d) {return d.properties.name};

var tf = function() {
  return 'translate(' + -width / 3 + ',' + -height / 3 + ')'
};

var quantize = d3.scale.quantize()
  .domain([0, 15])
  .range(d3.range(9).map(function(i) { return 'q' + i + '-9'; }));

var svg = d3.select(mapselect).append('svg')
  .attr('width', width)
  .attr('height', height);

queue()
  .defer(d3.json, '/json/us-states.json')
  .defer(d3.tsv, '/js/us-unemployment-obama-1st-termscript/unemployment.tsv')
  .await(ready);

function ready(error, states, unemployment) {
  var rateById = {};

  unemployment.forEach(function(d) { rateById[d['STATE']] = d['September 2012, %']; });

  svg.append('g')
    .attr('transform', tf)
    .attr('class', 'states')
  .selectAll('path')
    .data(states.features)
  .enter().append('path')
    .attr('class', function(d) {return quantize(rateById[d.properties.name])})
    .attr('d', path);

  d3.select('#selectstates').selectAll('label')
    .data(states.features)
  .enter().append('label')
    .text(countryname)
    .attr('class', 'checkbox')
  .append('input')
    .attr('type', 'checkbox')
    .attr('value', countryname);
}

(function() {
var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var parseDate = d3.time.format("%d-%b-%y").parse;

var x = d3.time.scale()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var line = d3.svg.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.close); });

var svg = d3.select("#timeline").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.tsv("/js/us-unemployment-obama-1st-termscript/data.tsv", function(error, data) {
  data.forEach(function(d) {
    d.date = parseDate(d.date);
    d.close = +d.close;
  });

  x.domain(d3.extent(data, function(d) { return d.date; }));
  y.domain(d3.extent(data, function(d) { return d.close; }));

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Price ($)");

  svg.append("path")
      .datum(data)
      .attr("class", "line")
      .attr("d", line);
});
})();
