let map;
const lat = 52.5233;
const lon = 13.4127;
const zoom = 11;

const routes = [{ name: 'Wannsee-Route RR1', gpx: '/gpx/wannseeroute_rr1.gpx' }, { name: 'Gatow-Route RR2', gpx: '/gpx/gatow_route_rr2.gpx' }, { name: 'Spandau-Route RR3', gpx: '/gpx/spandau_route_rr3.gpx' }, { name: 'Hellersdorf-Route RR8', gpx: '/gpx/hellersdorf_route_rr8.gpx' }, { name: 'Teltow-Route RR12', gpx: '/gpx/teltow_route_rr12.gpx' }, { name: 'Nordspange TR2', gpx: '/gpx/nordspange_tr2.gpx' }, { name: 'Südspange TR4', gpx: '/gpx/suedspange_tr4.gpx' }, { name: 'Berliner Mauerweg 1 (Stadtroute)', gpx: '/gpx/mauerweg_1.gpx' }, { name: 'Berliner Mauerweg 2 (Südroute)', gpx: '/gpx/mauerweg_2.gpx' }, { name: 'Berliner Mauerweg 3 (Westroute)', gpx: '/gpx/mauerweg_3.gpx' }, { name: 'Europaradweg R1 (West)', gpx: '/gpx/europaradweg_r1_west.gpx' }, { name: 'Europaradweg R1 (Ost)', gpx: '/gpx/europaradweg_r1_ost.gpx' }, { name: 'Radfernweg Berlin-Kopenhagen', gpx: '/gpx/radfernweg_berlin_kopenhagen.gpx' }, { name: 'Radfernweg Berlin-Usedom', gpx: '/gpx/radfernweg_berlin_usedom.gpx' }];

const routeStyle = {
  color: '#006600',
  weight: 5,
  opacity: 0.7
};

function setMapHeight() {
  const vis = document.getElementById('vis');
  const nav = document.querySelector('nav.navbar');
  const navHeight = nav ? nav.offsetHeight : 0;
  if (vis) {
    vis.style.height = `${window.innerHeight - navHeight}px`;
  }
}

function initMap() {
  setMapHeight();

  map = L.map('vis').setView([lat, lon], zoom);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  const layerControl = L.control.layers().addTo(map);

  routes.forEach((route, index) => {
    const gpxLayer = new L.GPX(route.gpx, {
      async: true,
      polyline_options: routeStyle,
      marker_options: {
        startIconUrl: null,
        endIconUrl: null,
        shadowUrl: null
      }
    });

    if (index === 0) {
      gpxLayer.addTo(map);
    }

    layerControl.addOverlay(gpxLayer, route.name);
  });
}

window.addEventListener('load', initMap);
window.addEventListener('resize', setMapHeight);