jQuery(function($){
    $('#map').height($(window).height() - $('.navbar').height() - 20);
    var map = new mxn.Mapstraction('map', 'leaflet');
    var latlon = new mxn.LatLonPoint(52.5233, 13.4127);
    map.setCenterAndZoom(latlon, 11);
});

