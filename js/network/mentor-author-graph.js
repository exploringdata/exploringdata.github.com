$(function(){
    var props = {
        drawing: {
            defaultLabelColor: '#fff',
            defaultLabelSize: 12,
            defaultLabelBGColor: '#fff',
            defaultLabelHoverColor: '#000',
            labelThreshold: 7,
            defaultEdgeType: 'curve'
        },
        graph: {
            minNodeSize: 3,
            maxNodeSize: 30,
            minEdgeSize: 2,
            maxEdgeSize: 20
        },
        forceLabel: 1,
        type: 'directed'
    };
    visgexf.init('sig', '/gexf/mentor-author-graph.json', props);
});