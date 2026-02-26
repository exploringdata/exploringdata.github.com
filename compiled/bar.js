function barh(selector, data, options) {
    const width = options && options.width ? options.width : 400;
    const bar_height = 26;

    const x = d3.scaleLinear().domain([0, d3.max(data, d => d.value)]).range([0, width]);

    const chart = d3.select(selector).attr('width', width).attr('height', bar_height * data.length);

    const bar = chart.selectAll('g').data(data).enter().append('g').attr('transform', (d, i) => 'translate(0,' + i * bar_height + ')');

    bar.append('rect').attr('width', d => x(d.value)).attr('height', bar_height - 4);

    bar.append('text').attr('x', 3).attr('y', bar_height / 2).attr('dy', bar_height / 16).text(d => d.name);
}

(typeof exports !== 'undefined' ? exports : this).barh = barh;