var map,
    lat = 52.5233,
    lon = 13.4127,
    zoom = 11,
    routes = [{"name":"Wannsee-Route RR1","gpx":"/gpx/wannseeroute_rr1.gpx"},{"name":"Gatow-Route RR2","gpx":"/gpx/gatow_route_rr2.gpx"},{"name":"Spandau-Route RR3","gpx":"/gpx/spandau_route_rr3.gpx"},{"name":"Hellersdorf-Route RR8","gpx":"/gpx/hellersdorf_route_rr8.gpx"},{"name":"Teltow-Route RR12","gpx":"/gpx/teltow_route_rr12.gpx"},{"name":"Nordspange TR2","gpx":"/gpx/nordspange_tr2.gpx"},{"name":"Südspange TR4","gpx":"/gpx/suedspange_tr4.gpx"},{"name":"Berliner Mauerweg 1 (Stadtroute) ","gpx":"/gpx/mauerweg_1.gpx"},{"name":"Berliner Mauerweg 2 (Südroute)","gpx":"/gpx/mauerweg_2.gpx"},{"name":"Berliner Mauerweg 3 (Westroute)","gpx":"/gpx/mauerweg_3.gpx"},{"name":"Europaradweg R1 (West)","gpx":"/gpx/europaradweg_r1_west.gpx"},{"name":"Europaradweg R1 (Ost)","gpx":"/gpx/europaradweg_r1_ost.gpx"},{"name":"Radfernweg Berlin-Kopenhagen","gpx":"/gpx/radfernweg_berlin_kopenhagen.gpx"},{"name":"Radfernweg Berlin-Usedom","gpx":"/gpx/radfernweg_berlin_usedom.gpx"}];

function init() {
    $('#vis').height($(window).height() - $('#navbar').height());
    map = new OpenLayers.Map ("vis", {controls:[
        new OpenLayers.Control.Navigation(),
        new OpenLayers.Control.PanZoomBar(),
        new OpenLayers.Control.LayerSwitcher(),
        new OpenLayers.Control.Attribution()]
    });
    layerMapnik = new OpenLayers.Layer.OSM.Mapnik("Mapnik");
    map.addLayer(layerMapnik);
    var lonLat = new OpenLayers.LonLat(lon, lat).transform(new OpenLayers.Projection("EPSG:4326"), map.getProjectionObject());
    map.setCenter(lonLat, zoom);
}

function show_route(route, visibility) {
    var lgpx = new OpenLayers.Layer.Vector(route.name, {
        strategies: [new OpenLayers.Strategy.Fixed()],
        protocol: new OpenLayers.Protocol.HTTP({
            url: route.gpx,
            format: new OpenLayers.Format.GPX()
        }),
        style: {strokeColor: "#060", strokeWidth: 5, strokeOpacity: 0.7},
        projection: new OpenLayers.Projection("EPSG:4326"),
        visibility: visibility
    });
    map.addLayer(lgpx);
}

$(function(){
    init();
    for (i in routes) {
        show_route(routes[i], !parseInt(i));
    }
});