var histselector = '#history',
    histselection = d3.select(histselector),
    wordselection = d3.select('#words'),
    selectiondetails = document.getElementById('selectiondetails'),
    sectionmap = null,
    colors = d3.scale.category20(),
    keyColor = function(d, i) {return colors(d.key)},
    getQueryDate = d3.time.format("%Y-%m-%d"),
    guParams = {
        'page-size':10,
        'page': 1,
        'order-by':'relevance',
        'format':'json',
        'show-fields': 'headline,thumbnail',
        'api-key': 'makz4y2wt4gw6td522wknwky'
    },
    currSeries = null,
    scrollOffset = selectiondetails.offsetTop - ($('#navbar').height + 10);

function getPrevDay(date) {
    return new Date(date - 86400)
}

function pagerClick() {
    $('.pager a').click(function(e) {
        e.preventDefault();
        guParams['page'] = $(this).attr('href').replace('#', '');
        getGuardianArticles();
    });
}

function historyClickHandler(currSeries, timestamp) {
    guParams['page'] = 1; // reset Guardian page parameter
    var date = new Date(timestamp);
    // milliseconds need to be converted back to seconds
    var file = currSeries.replace(' ', '-') + '/' + timestamp / 1000 + '.json';
    d3.json('/json/climate-changes-decade/' + file, function(freqdata) {
        barChart('#words', [{
            key: currSeries,
            values: barValues(freqdata.words)
        }]);
        barChart('#sections', [{
            key: currSeries,
            values: barValues(freqdata.sections)
        }]);
    });
    // enclose phrases in quotes
    getGuardianArticles('"' + currSeries + '"', date);
    window.scrollTo(0, selectiondetails.offsetTop - 50);
}

function historyClick() {
    histselection.selectAll('rect').on('click', function(d, i) {
        currSeries = d.q;
        document.location.hash = currSeries+ '|' + d.x;
    });
}

function getArticlePager(response) {
    var html = '',
        prevCls = '',
        nextCls = '',
        prevHref = '',
        nextHref = '',
        currPage = 1,
        page = guParams['page'];
    if (response.response.pages > 1) {
        currPage = response.response.currentPage;
        if (currPage == 1) {
            prevCls = ' class="disabled"';
        } else {
            prevHref = currPage - 1;
        }
        if (currPage == response.response.pages) {
            nextCls = ' class="disabled"';
        } else {
            nextHref = currPage + 1;
        }

        var prevCls = currPage == 1 ? ' class="disabled"' : '';
        var nextCls =  currPage == response.response.pages ? ' class="disabled"' : '';
        html = '<ul class="pager"><li' + prevCls + '><a href="#' + prevHref+ '">Previous</a></li><li' + nextCls + '><a href="#' + nextHref + '">Next</a></li></ul>';
    }
    return html;
}

function getGuardianArticles(query, date) {
    if ('undefined' !== typeof query) {
        guParams['q'] = query;
    }
    if ('undefined' !== typeof date) {
        // determine from and to date from given date
        from = getQueryDate(date);
        date.setMonth(date.getMonth() + 1);
        to = getQueryDate(getPrevDay(date));
        guParams['from-date'] = from;
        guParams['to-date'] = to;
    }
    $.getJSON('https://content.guardianapis.com/search?callback=?', guParams)
        .done(function(data) {
            var html = '';
            for (i in data.response.results) {
                var r = data.response.results[i];
                var src = 'undefined' !== typeof r.fields.thumbnail ? r.fields.thumbnail : '/img/no-image.70x42.png';
                html += '<div class="article row"><div class="image col-md-3"><a href="' + r.webUrl + '"><img src="' + src + '" class="img-thumbnail"></a></div><div class="col-md-9"><div title="' + r.webTitle + '"><a href="' + r.webUrl + '">' + r.fields.headline + '</a></div><span class="meta">📅</i> ' + new Date(r.webPublicationDate).toGMTString() + ' in ' + r.sectionName + '</span></div></div><hr>';
            }
            html += getArticlePager(data);
            d3.select('#articles').html(html);
            d3.select('#queryinfo').html(query + ' ' + d3.time.format('%Y-%m')(new Date(from)));
            pagerClick();
        }
    );
}

function getHistoryData(json) {
    return json.map(function(query){
        values = query.values.map(function(val){
            // Add q to know correct series in click handler.
            // Main data index differs from series index, when one or more
            // series are disabled.
            return {x:val[0], y:val[1], q: query['key']}
        });
        return {'key': query['key'], 'values': values};
    });
}

function acronymize(s) {
    return s.split(/\s+/).map(function(s){return s.substring(0, 1).toUpperCase()}).join('')
}

// acronymize too long labels in bar charts
function acronymizeBars(labels) {
    labels.text(function(d) {
        if (d && d.length > 18) d = acronymize(d);
        return d;
    });
}

// Guardian API doesn't allow to search for words in titles, thus no further filtering.
function barChart(selector, data) {
    nv.addGraph(function() {
        var chart = nv.models.multiBarHorizontalChart()
            .x(function(d) { return d.label })
            .y(function(d) { return d.value })
            .margin({top: 0, right: 20, bottom: 50, left: 115})
            .showValues(false)
            .tooltips(true)
            .showLegend(false)
            .showControls(false)
            .color(keyColor);

        chart.yAxis
            .tickFormat(d3.format(',d'));

        var ds = d3.select(selector);
        ds.selectAll('div.bar').remove();
        ds.append('div').attr('class', 'bar').append('svg')
            .datum(data)
            .transition().duration(500)
            .call(chart);

        var labels = ds.selectAll('.nv-x text');
        labels.append('text');
        acronymizeBars(labels);

        nv.utils.windowResize(function() {
            chart.update;
            acronymizeBars(labels);
        });
        return chart;
    });
}

function barValues(freqdata) {
    return freqdata.slice(0, 20).map(function(item){
        return {label: item[0], value: item[1]}
    });
}

function historyMultiBar(json) {
    nv.addGraph(function() {
        var data = getHistoryData(json);
        var chart = nv.models.multiBarChart()
            .stacked(true)
            .color(keyColor);
        chart.xAxis
            .showMaxMin(false)
            .tickFormat(function(d) { return d3.time.format('%Y-%m')(new Date(d)) });

        chart.yAxis
            .tickFormat(d3.format(',d'));

        var hist = histselection.append('div').attr('class', 'history').append('svg');
        hist.datum(data)
            .transition().duration(500).call(chart);

        // bind click events before and after chart updates
        historyClick();
        // adding event with d3 overrides nvd3 handler, thus use jquery
        $(histselector + ' .nv-legend .nv-series').click(historyClick);
        nv.utils.windowResize(function(){
            chart.update;
            historyClick();
        });
        return chart;
    });
}

function redirect() {
    var h = document.location.hash.replace('#', '').split('|');
    historyClickHandler(h[0], parseInt(h[1]));
}

d3.json('/json/climate-changes-decade/articles.json', function(json) {
    historyMultiBar(json.history);
    sectionmap = json.sectionmap;
    if (document.location.hash) {
        redirect();
    } else {
        var cl = json.history[0];
        historyClickHandler(cl.key, cl.values[cl.values.length-1][0]);
    }
});

$(window).bind('hashchange', function(event) {
    redirect();
});