$(function(){
    var props = {
        drawing: {
            defaultLabelColor: '#fff',
            defaultLabelSize: 12,
            defaultLabelBGColor: '#fff',
            defaultLabelHoverColor: '#000',
            labelThreshold: 8,
            defaultEdgeType: 'curve'
        },
        graph: {
            minNodeSize: 2,
            maxNodeSize: 20,
            minEdgeSize: .3,
            maxEdgeSize: .3
        },
        forceLabel: 1,
        type: 'undirected'
    };
    visgexf.init('sig', '/gexf/big-sister-cities.json', props);
});