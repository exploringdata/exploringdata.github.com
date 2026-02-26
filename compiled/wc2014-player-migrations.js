let data = null;
const graph = {
    nodes: [],
    links: [],
    config: null
};
const node_map = {};
let path = null;
const sep = {
    link: ' → '
};
let svg = null;
const text_suffix = '\n\nClick to see the migrated players.';

function add_node(name) {
    if (!Object.prototype.hasOwnProperty.call(node_map, name)) {
        graph.nodes.push({ name });
        node_map[name] = graph.nodes.length - 1;
    }
    return node_map[name];
}

function node_name(s) {
    return s.replace(/[FT]:/, '');
}

function node_text(d) {
    return node_name(d.name) + ': ' + d.value;
}

function link_text(d) {
    return node_name(d.source.name) + sep.link + node_name(d.target.name) + ': ' + d.value;
}

function is_from(s) {
    return s.indexOf('F:') === 0;
}

function make_graph(config) {
    const agg_links = {};
    graph.config = config;

    for (const record of data) {
        const from_node = add_node('F:' + record[config.from.key]);
        const to_node = add_node('T:' + record[config.to.key]);

        const link_key = from_node + '|' + to_node;
        if (!Object.prototype.hasOwnProperty.call(agg_links, link_key)) {
            agg_links[link_key] = 0;
        }

        let agg_val;
        if (config.aggregate.key) {
            agg_val = parseInt(record[config.aggregate.key], 10);
        } else {
            agg_val = config.aggregate.value;
        }

        agg_links[link_key] += agg_val;
    }

    for (const [key, val] of Object.entries(agg_links)) {
        const nodes = key.split('|');
        graph.links.push({
            key,
            source: graph.nodes[nodes[0]],
            target: graph.nodes[nodes[1]],
            value: val
        });
    }
}

function draw_sankey() {
    let width = parseInt(d3.select('#vis').style('width').replace('px', ''));
    if (width < 400) {
        width = 400;
    }

    const margin = { top: 1, right: 1, bottom: 6, left: 1 };
    width = width - margin.left - margin.right;
    const height = 1080 - margin.top - margin.bottom;

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    svg = d3.select('#vis').append('svg').attr('width', width + margin.left + margin.right).attr('height', height + margin.top + margin.bottom).append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    const sankey = d3.sankey().nodeWidth(20).nodePadding(7).extent([[0, 0], [width, height]]).nodeId(d => d.name).nodeAlign(d3.sankeyJustify).iterations(32);

    const sankeyData = sankey({
        nodes: graph.nodes.map(d => Object.assign({}, d)),
        links: graph.links.map(d => ({
            source: d.source.name,
            target: d.target.name,
            value: d.value,
            key: d.key
        }))
    });

    const sankeyNodes = sankeyData.nodes;
    const sankeyLinks = sankeyData.links;

    for (const n of sankeyNodes) {
        const orig = graph.nodes[node_map[n.name]];
        Object.assign(orig, n);
    }
    for (let i = 0; i < sankeyLinks.length; i++) {
        Object.assign(graph.links[i], sankeyLinks[i]);
    }

    path = d3.sankeyLinkHorizontal();

    const link = svg.append('g').selectAll('.link').data(sankeyLinks);

    link.enter().append('path').attr('class', 'link').attr('d', path).style('stroke-width', d => Math.max(1, d.width)).sort((a, b) => b.width - a.width).on('click', link_click).append('title').text(d => link_text(d) + text_suffix);

    const node = svg.append('g').selectAll('.node').data(sankeyNodes).enter().append('g').attr('class', 'node').attr('transform', d => 'translate(' + d.x0 + ',' + d.y0 + ')');

    node.append('rect').attr('height', d => d.y1 - d.y0).attr('width', d => d.x1 - d.x0).style('fill', d => {
        d.color = color(node_name(d.name));return d.color;
    }).style('stroke', d => d3.rgb(d.color).darker(2)).on('click', node_click).append('title').text(d => node_text(d) + text_suffix);

    node.append('text').attr('x', -6).attr('y', d => (d.y1 - d.y0) / 2).attr('dy', '.35em').attr('text-anchor', 'end').attr('transform', null).text(d => node_name(d.name)).filter(d => d.x0 < width / 2).attr('x', 6 + sankey.nodeWidth()).attr('text-anchor', 'start');
}

function update_links(links) {
    const keys = new Set(links.map(d => d.key));
    svg.selectAll('path.link').style('opacity', d => keys.has(d.key) ? 1 : 0);
}

function draw_rankings() {
    const bar_options = {};
    bar_options.width = parseInt(d3.select('#sidebar').style('width').replace('px', ''), 10);

    const rank = graph.links.slice().sort((a, b) => b.value - a.value);
    let bar_data = rank.slice(0, 10).map(d => ({ name: link_text(d), value: d.value }));
    barh('#top-paths', bar_data, bar_options);

    const from = graph.nodes.filter(d => is_from(d.name));
    from.sort((a, b) => b.value - a.value);
    bar_data = from.slice(0, 10).map(d => ({ name: node_text(d), value: d.value }));
    barh('#most-emigrations', bar_data, bar_options);

    const to = graph.nodes.filter(d => !is_from(d.name));
    to.sort((a, b) => b.value - a.value);
    bar_data = to.slice(0, 10).map(d => ({ name: node_text(d), value: d.value }));
    barh('#most-immigrations', bar_data, bar_options);
}

function show_players(players) {
    players = players.slice().sort((a, b) => a.firstName > b.firstName ? 1 : -1);
    d3.select('#overlay').style('display', 'block');
    const container = d3.select('#detail-info');
    container.selectAll('div.row').remove();
    container.selectAll('div').data(players).enter().append('div').attr('class', 'row').html(d => '<div class="col-md-2"><img class="img-thumbnail" src="' + d.image + '"/></div>' + '<div class="player-info col-md-10"><h5>' + d.firstName + ' ' + d.lastName + ': ' + d.birthCountry + sep.link + d.nationality + '</h5></div>');
}

function position_detail_info() {
    d3.select('#rankings').style('display', 'none');
    d3.select('#overlay').style('top', window.pageYOffset + 'px');
}

function node_click(event, d) {
    position_detail_info();
    let key;
    if (is_from(d.name)) {
        update_links(d.sourceLinks);
        key = 'birthCountry';
    } else {
        update_links(d.targetLinks);
        key = 'nationality';
    }

    const country = node_name(d.name);
    const players = data.filter(rec => country === rec[key]);
    show_players(players);
}

function link_click(event, d) {
    position_detail_info();
    update_links([d]);

    const players = data.filter(rec => node_name(d.source.name) === rec.birthCountry && node_name(d.target.name) === rec.nationality);
    show_players(players);
}

function init_sankey(config, csv) {
    data = csv;
    make_graph(config);
    draw_sankey();
    draw_rankings();

    d3.select('#close-overlay').on('click', () => {
        d3.select('#overlay').style('display', 'none');
        d3.select('#rankings').style('display', 'block');
        update_links(graph.links);
    });
}

(typeof exports !== 'undefined' ? exports : this).init_sankey = init_sankey;