map = L.map('map').setView([32.145476, -110.894806], 11);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);


// Fetch the GeoJSON file and add it to the map
fetch('overPassTucson.geojson')
    .then(response => response.json())
    .then(data => {
        // Add the GeoJSON layer to the map
        L.geoJson(data, {
            style: function (feature) {
                // Apply style based on the geometry type
                if (feature.geometry.type === 'Polygon') {
                    return {
                        'color': 'blue',     // Border color for polygons
                        'opacity': .5,
                        'weight': .5,        // Border thickness for polygons
                        //'fillColor': 'red',  // Fill color for polygons
                        //'fillOpacity': .5   // Fill opacity for polygons
                    };
                }
                // Return default style for other geometries (if needed)
                return {};
            },
            onEachFeature: function (feature, layer) {
                // Check if properties exist and format the popup content
                if (feature.properties) {
                    let popupContent = `<strong>Name:</strong> ${feature.properties.name || 'N/A'}<br>`;
                    popupContent += `<strong>Admin Level:</strong> ${feature.properties.admin_level || 'N/A'}<br>`;
                    popupContent += `<strong>Boundry:</strong> ${feature.properties.boundary || 'N/A'}<br>`;
                    // Add any other properties you want to display
                    if (feature.properties.population) {
                        popupContent += `<strong>Population:</strong> ${feature.properties.population}<br>`;
                    }
                    if (feature.properties.alt_name) {
                        popupContent += `<strong>Alternate Name:</strong> ${feature.properties.alt_name}<br>`;
                    }


                    //layer.bindPopup(popupContent);
                }
            }
        }).addTo(map);
    });


 //  hard code locations
/**
 *function onMapClick(e) {
    alert("You clicked the map at " + e.latlng);
}

map.on('click', onMapClick);


 * 
 *  
 const locations = [
    { name: "Downtown Tucson", lat: 32.2217, lng: -110.9265 },
    { name: "University of Arizona", lat: 32.2319, lng: -110.9501 },
    { name: "Sabino Canyon", lat: 32.3091, lng: -110.8182 }
];

locations.forEach(location => {
    const marker = L.marker([location.lat, location.lng]).addTo(map);
    marker.bindPopup(location.name);
});
 */


/** 
// Function to get fill color based on feature properties
function getFillColor(feature) {
    // Example: Change color based on properties (you can customize this logic)
    if (feature.properties && feature.properties.type === 'mountain') {
        return 'sandybrown'; // Color for mountains
    } else if (feature.properties && feature.properties.type === 'forest') {
        return 'forestgreen'; // Color for forests
    } else {
        return 'blue'; // Default color for land
    }
}
*/
/**
// need to do this

// Style for water (You can use a custom tile layer for this if needed)
var waterStyle = {
    weight: 1,
    color: 'red',
    fillColor: 'black',
    fillOpacity: 1
};

// Add water layer (if available in your GeoJSON or separately defined)
//L.geoJson(waterGeoJsonData, { // Replace with your actual water GeoJSON data
   // style: waterStyle
//}).addTo(map);
*/


/** */


//marker.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();
//circle.bindPopup("I am a circle.");
//polygon.bindPopup("I am a polygon.");

/**var popup = L.popup()
    .setLatLng([32.216868, -110.974298])
    .setContent("I am a standalone popup.")
    .openOn(map); */

/** 
// Load the global TopoJSON data for countries
$.getJSON('countries-50m.json', function (topoData) { 
    // Convert TopoJSON to GeoJSON and add it to the map
    L.geoJson(topojson.feature(topoData, topoData.objects.countries), {
        style: function (feature) { 
            return {
                'weight': 1,
                'color': 'orange',       // Border color for countries
                'fillColor': 'white',  // Dynamic fill color for countries
                'fillOpacity': 0     // Fill opacity for countries
            };
        }
    }).addTo(map); 
});
*/
