const node_map = {};
const agg_transfers = {};
const graph = {
    nodes: [],
    links: [],
    data: null,
    summary: {
        total: 0
    },
    teams: {},
    players: {}
};

const formatNumber = d3.format(',.0f');
const format = d => formatNumber(d) + '€';

function add_node(name) {
    if (!Object.prototype.hasOwnProperty.call(node_map, name)) {
        graph.nodes.push({ name });
        node_map[name] = graph.nodes.length - 1;
    }
    return node_map[name];
}

function add_team_fee(name, fee) {
    if (!Object.prototype.hasOwnProperty.call(graph.teams, name)) {
        graph.teams[name] = 0;
    }
    graph.teams[name] += fee;
}

function add_player_fee(name, fee) {
    if (!Object.prototype.hasOwnProperty.call(graph.players, name)) {
        graph.players[name] = 0;
    }
    graph.players[name] += fee;
}

function team_name(s) {
    return s.replace(/[FT]:/, '');
}

function make_graph(csv) {
    graph.data = csv;

    for (const row of csv) {
        const from_team = add_node('F:' + row['From Team Name']);
        const to_team = add_node('T:' + row['To Team Name']);

        const transfer_key = from_team + '|' + to_team;
        if (!Object.prototype.hasOwnProperty.call(agg_transfers, transfer_key)) {
            agg_transfers[transfer_key] = 0;
        }

        const fee = parseInt(row['Transfer Fee']);
        agg_transfers[transfer_key] += fee;
        graph.summary.total += fee;

        add_team_fee(from_team, fee);
        add_team_fee(to_team, -fee);

        add_player_fee(row['Player Name'], fee);
    }

    for (const [key, fee] of Object.entries(agg_transfers)) {
        const teams = key.split('|');
        graph.links.push({
            source: graph.nodes[teams[0]],
            target: graph.nodes[teams[1]],
            value: fee
        });
    }
}

function transfer_row(row) {
    return '<tr><td>' + row['Rank'] + '</td><td>' + row['Player Name'] + '</td><td>' + row['From Team Name'] + '</td><td>' + row['To Team Name'] + '</td><td>' + row['Transfer Season'] + '</td><td>' + format(row['Transfer Fee']) + '</td></tr>';
}

function transfer_modal(rows) {
    d3.select('#transfer-table tbody').html(rows.join(''));
    const tm = d3.select('#transfer-modal');
    tm.style('display', 'block');
    const top = window.pageYOffset + 200;
    tm.style('top', top.toString() + 'px');
}

function close_modal() {
    d3.select('#transfer-modal').style('display', 'none');
}

function money_flow_table() {
    graph.links = graph.links.sort((a, b) => b.value - a.value);

    const table = d3.select('#team-money-flow tbody');
    const rows = [];
    for (const link of graph.links.slice(0, 15)) {
        rows.push('<tr><td>' + team_name(link.source.name) + '</td><td>' + team_name(link.target.name) + '</td><td>' + format(link.value) + '</td></tr>');
    }
    table.html(rows.join(''));
}

function node_info(event, d) {
    let key, suffix;
    if (d.name[0] === 'F') {
        key = 'From Team Name';
        suffix = 'from ';
    } else {
        key = 'To Team Name';
        suffix = 'to ';
    }

    const rows = [];
    const tname = team_name(d.name);
    for (const row of graph.data) {
        if (row[key] === tname) {
            rows.push(transfer_row(row));
        }
    }

    transfer_modal(rows);
    d3.select('#transfer-table-suffix').text(suffix + tname);
}

function link_info(event, d) {
    const from_team = team_name(d.source.name);
    const to_team = team_name(d.target.name);
    const rows = [];
    for (const row of graph.data) {
        if (row['From Team Name'] === from_team && row['To Team Name'] === to_team) {
            rows.push(transfer_row(row));
        }
    }

    transfer_modal(rows);
    d3.select('#transfer-table-suffix').text(from_team + ' to ' + to_team);
}

function draw_sankey() {
    let width = parseInt(d3.select('#vis').style('width').replace('px', ''));
    if (width < 400) {
        width = 400;
    }

    const click_hint = '\n\nClick for more details.';

    const margin = { top: 1, right: 1, bottom: 6, left: 1 };
    width = width - margin.left - margin.right;
    const height = 1200 - margin.top - margin.bottom;

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const svg = d3.select('#vis').append('svg').attr('width', width + margin.left + margin.right).attr('height', height + margin.top + margin.bottom).append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    const sankey = d3.sankey().nodeWidth(15).nodePadding(10).extent([[0, 0], [width, height]]).nodeId(d => d.name).nodeAlign(d3.sankeyJustify).iterations(46);

    const sankeyData = sankey({
        nodes: graph.nodes.map(d => Object.assign({}, d)),
        links: graph.links.map(d => ({
            source: d.source.name,
            target: d.target.name,
            value: d.value
        }))
    });

    const sankeyNodes = sankeyData.nodes;
    const sankeyLinks = sankeyData.links;

    const linkPath = d3.sankeyLinkHorizontal();

    const link = svg.append('g').selectAll('.link').data(sankeyLinks).enter().append('path').attr('class', 'link').attr('d', linkPath).style('stroke-width', d => Math.max(1, d.width)).sort((a, b) => b.width - a.width).on('click', link_info);

    link.append('title').text(d => team_name(d.source.name) + ' → ' + team_name(d.target.name) + '\n' + format(d.value) + click_hint);

    const node = svg.append('g').selectAll('.node').data(sankeyNodes).enter().append('g').attr('class', 'node').attr('transform', d => 'translate(' + d.x0 + ',' + d.y0 + ')');

    node.append('rect').attr('height', d => d.y1 - d.y0).attr('width', d => d.x1 - d.x0).style('fill', d => {
        d.color = color(team_name(d.name));return d.color;
    }).style('stroke', d => d3.rgb(d.color).darker(2)).on('click', node_info).append('title').text(d => team_name(d.name) + '\n' + format(d.value) + click_hint);

    node.append('text').attr('x', -6).attr('y', d => (d.y1 - d.y0) / 2).attr('dy', '.35em').attr('text-anchor', 'end').attr('transform', null).text(d => team_name(d.name)).filter(d => d.x0 < width / 2).attr('x', 6 + sankey.nodeWidth()).attr('text-anchor', 'start');
}

function summary() {
    d3.select('#summary-total').text(format(graph.summary.total));

    graph.teams = Object.entries(graph.teams).map(([key, value]) => ({ key, value })).sort((a, b) => b.value - a.value);

    const team_spent = graph.teams[graph.teams.length - 1];
    const team_spent_name = team_name(graph.nodes[team_spent.key].name);
    d3.select('#summary-team-spent').text(team_spent_name);
    d3.select('#summary-team-spent-total').text(format(team_spent.value));

    const team_earned = graph.teams[0];
    const team_earned_name = team_name(graph.nodes[team_earned.key].name);
    d3.select('#summary-team-earned').text(team_earned_name);
    d3.select('#summary-team-earned-total').text(format(team_earned.value));

    graph.players = Object.entries(graph.players).map(([key, value]) => ({ key, value })).sort((a, b) => b.value - a.value);
    const player = graph.players[0];
    d3.select('#summary-player').text(player.key);
    d3.select('#summary-player-total').text(format(player.value));
}

function init_sankey(config, csv) {
    make_graph(csv);
    draw_sankey();
    summary();
    money_flow_table();
    d3.select('#transfer-modal .close').on('click', close_modal);
    document.body.onkeydown = e => e.keyCode === 27 && close_modal();
}

(typeof exports !== 'undefined' ? exports : this).init_sankey = init_sankey;