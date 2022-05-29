const getAlt=d=>d.elevation*6e-5;const ANIMATION_CYCLE=4000;const getTooltip=d=>`<div>
        <strong>${d.name}</strong><br>
        Elevation: ${d.elevation}m<br>
        Location: ${d.country}<br>
        Type: ${d.type}
    </div>
`;const G=Globe().globeImageUrl('/img/public/world-topo-bathy.jpg').backgroundImageUrl('/img/public/night-sky-fs8.png').pointLat('lat').pointLng('lon').pointAltitude(getAlt).pointRadius(.12).pointColor(()=>'#F7342B').pointLabel(getTooltip).labelLat('lat').labelLng('lon').labelAltitude(d=>getAlt(d)+1e-6).labelDotRadius(0.12).labelDotOrientation(()=>'bottom').labelText('name').labelSize(0.15).labelResolution(1).labelLabel(getTooltip)(document.getElementById('vis'));fetch('/csv/volcanoes.csv').then(res=>res.text()).then(csv=>d3.csvParse(csv,d=>{return{name:d['Volcano Name'],country:d['Country'],type:d['Type'],lat:d['Latitude (dd)'],lon:d['Longitude (dd)'],elevation:d['Elevation (m)']}})).then(data=>{G.pointsData(data).labelsData(data);index=0;setInterval(()=>{G.pointOfView({lat:data[index].lat,lng:data[index].lon,altitude:0.75},ANIMATION_CYCLE);index++},ANIMATION_CYCLE)});