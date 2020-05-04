// Create a map object.
var mymap = L.map('map', {
    center: [44.55, -102.33],
    zoom: 4,
    maxZoom: 10,
    minZoom: 3,
    detectRetina: true});

// Add a base map.
L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png').addTo(mymap);

// Add Airport data to the map
var airports = null;

// Add icon colors
var colors = chroma.scale('dark2').mode('lch').colors(2);

for (i = 0; i < 2; i++) {
     $('head').append($("<style> .marker-color-" + (i + 1).toString() + " { color: " + colors[i] + "; font-size: 15px; text-shadow: 0 0 3px #ffffff;} </style>"));
}

airports = L.geoJson.ajax("assets/airports.geojson",{
  onEachFeature: function (feature, layer) {
    layer.bindpopup(feature.properties.AIRPT_NAME);
  },

  pointToLayer: function (feature, latlng) {
    var id = 0;
    if (feature.properties.CNTL_TWR == "Y") { id = 0; }
    else { id = 1; }
    return L.marker(latlng, {icon: L.divIcon({className: 'fa fa-plane marker-color-' + (id + 1).toString() })});
  },
  attribution: 'Airports Data &copy; US Government | US States &copy; D3 | Base Map &copy; CartoDB | Made By Parth Wanage'
}).addTo(mymap);

colors = chroma.scale('YlOrRd').colors(6);

function setColor(count) {
    var id = 0;
    if (density > 40) { id = 5; }
    else if (density > 25 && density <= 40) { id = 4; }
    else if (density > 15 && density <= 25) { id = 3; }
    else if (density > 10 && density <= 15) { id = 2; }
    else if (density > 5 && density <= 10) { id = 1; }
    else  { id = 0; }
    return colors[id];
}

function style(feature) {
    return {
        fillColor: setColor(feature.properties.count),
        fillOpacity: 0.4,
        weight: 2,
        opacity: 1,
        color: '#b4b4b4',
        dashArray: '4'
    };
}

L.geoJson.ajax("assets/us-states.geojson", {
    style: style
}).addTo(mymap);

var legend = L.control({position: 'topright'});

legend.onAdd = function() {
    var div = L.DomUtil.create('div', 'legend');
    div.innerHTML += '<b> Airport</b><br/>';
    div.innerHTML += '<i style="background: ' + colors[5] + '; opacity: 0.5"></i><p>40+</p>';
    div.innerHTML += '<i style="background: ' + colors[4] + '; opacity: 0.5"></i><p>26-40</p>';
    div.innerHTML += '<i style="background: ' + colors[3] + '; opacity: 0.5"></i><p>16-25</p>';
    div.innerHTML += '<i style="background: ' + colors[2] + '; opacity: 0.5"></i><p>11-15</p>';
    div.innerHTML += '<i style="background: ' + colors[1] + '; opacity: 0.5"></i><p>6-10</p>';
    div.innerHTML += '<i style="background: ' + colors[0] + '; opacity: 0.5"></i><p>0-5</p>';
    div.innerHTML += '<hr><b>Air Traffic Control Presence</b><br/>';
    div.innerHTML += '<i class="fa fa-plane marker-color-1"></i><p> Control Tower PRESENT</p>';
    div.innerHTML += '<i class="fa fa-plane marker-color-2"></i><p> Control Tower ABSENT</p>';
    return div;
};

legend.addTo(mymap);

L.control.scale({position: 'bottomleft'}).addTo(mymap);

// Display Lat and Lng on click
var popup = L.popup();

function onMapClick(e) {
  popup.setLatLng(e.latlng).setContent("Coordinates: " + e.latlng.toString()).openOn(mymap);
}

mymap.on('click', onMapClick);
