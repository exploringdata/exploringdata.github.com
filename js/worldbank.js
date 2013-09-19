function initMap(error, geo_data, wb_data) {
    if (error) {
        alert('An error occurred when loading the data.')
        return;
    }

    var year = map.year.default;
    renderMap('#map', geo_data, getYearSeries(wb_data, year), year);

    // create year choices
    year_range = d3.range(map.year.min, map.year.max + 1);
    d3.select('#year-select').selectAll('li')
        .data(year_range).enter()
    .append('li')
        .attr('class', function(d) {
            return (d === map.year.selected) ? 'active': '';
        })
    .append('a')
        .text(function(d) { return d })
        .on('click', function() {
            var year = this.textContent;
            renderMap('#map', geo_data, getYearSeries(wb_data, year), year);
            d3.select('#year-select').selectAll('li').attr('class', '');
            d3.select(this.parentNode).attr('class', 'active');
        });

    // play animation
    var int_ani = null;
    var loop_years = function() {
        if (map.year.selected > map.year.max) {
            clearInterval(int_ani);
            return;
        }
        renderMap('#map', geo_data, getYearSeries(wb_data, map.year.selected), map.year.selected);
        map.year.selected++;
    };

    d3.select('#animate').on('click', function() {
        map.year.selected = map.year.min;
        int_ani = setInterval(loop_years, 1000);
        d3.select('#year-select').selectAll('li').attr('class', '');
    });
}


function getYearSeries(wb_data, year) {
    var series = [];
    for (i in wb_data) {
        var country_data = wb_data[i];
        var val = parseFloat(country_data[year]);
        series.push({key: country_data['Country Code'], value: val})
    }
    return series;
}


function getCountryVal(iso3, wb_data) {
    cc_data = wb_data.filter(function(d){ return d.key === iso3 }).shift();
    if (cc_data)
        return cc_data.value;
}


function renderMap(selector, geo_data, wb_data, year) {
    d3.select(selector).selectAll('svg').remove();

    var svg,
        width = containerDim(selector, 'width'),
        height = width * .46,
        f = d3.format('.2f');

    var max_val = d3.max(wb_data, function(d) { return d.value })
    var min_val = d3.min(wb_data, function(d) { return d.value })

    var quantize = d3.scale.quantize()
        .domain([1, max_val])
        .range(d3.range(colors.length).map(function(i) { return colors[i] }));

    var projection = d3.geo.naturalEarth()
        .scale(width/5.6)
        // hide most of Antarctica and move a little to the left
        .translate([(width / 2.2), (height / 1.8)])
        .precision(.1);

    var path = d3.geo.path()
        .projection(projection);

    svg = d3.select(selector).append('svg')
        .attr('width', width)
        .attr('height', height);
    svg.append('g')
        .attr('class', 'countries')
    .selectAll('path')
        .data(topojson.feature(geo_data, geo_data.objects.subunits).features)
    .enter().append('path')
        .attr('class', 'country')
        .style('fill', function(d) {return quantize(getCountryVal(d.id, wb_data)) })
        .attr('d', path)
        .append('title')
            .text(function (d) {
                var title = d.properties.name;
                if (val = getCountryVal(d.id, wb_data))
                    title += ': ' + f(val)
                return title;
            });

    svg.insert('path', '.graticule')
        .datum(topojson.mesh(geo_data, geo_data.objects.subunits, function(a, b) { return a !== b; }))
        .attr('class', 'boundary')
        .attr('d', path);

    // legend
    var lg = svg.append('g')
        .attr('width', map.legend.width)
        .attr('height', map.legend.height)
        .attr('transform', 'translate(' + (width - map.legend.width) + ', ' + (height - map.legend.height) +  ')');

    lg.append('rect')
        .attr('class', 'legend-box')
        .attr('width', map.legend.width)
        .attr('height', map.legend.height);

    lg.append('text')
        .text(map.legend.title + ' in ' + year)
        .attr('class', 'legend-title')
        .attr('x', 10)
        .attr('y', 25)

    // color scale
    var cscale = {w: 1, h: 10, offset_x: 40, offset_y: 22};
    sg = lg.append('g')
        .attr('transform', 'translate(10,' + (map.legend.height - cscale.h - cscale.offset_y) + ')');

    sg.append('text')
        .text(f(min_val))
        .attr('x', 0)
        .attr('y', 9);

    sg.append('text')
        .text(f(max_val))
        .attr('x', colors.length * cscale.w + cscale.offset_x + 5)
        .attr('y', 9);

    sg.append('text')
        .attr('class', 'source')
        .text('Data Source: ' + map.source.title)
        .attr('x', 0)
        .attr('y', cscale.offset_y + 8)
        .on('click', function() { window.open(map.source.url) });

    // draw color scale
    sg.selectAll('rect')
        .data(colors)
    .enter().append('rect')
        .attr('x', function(d, i) { return (i * cscale.w) + cscale.offset_x })
        .attr('fill', function(d, i) { return colors[i] })
        .attr('width', cscale.w)
        .attr('height', cscale.h);
}