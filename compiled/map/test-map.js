let map=d3.geomap().geofile('/topojson/ne_10m_lakes.json');let selection=d3.select('#map');map.draw(selection);