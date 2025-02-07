// Map Styles
const styles = {
    academic: new ol.style.Style({
        fill: new ol.style.Fill({
            color: 'rgba(0, 0, 255, 0.2)',
        }),
        stroke: new ol.style.Stroke({
            color: 'rgba(0, 0, 255, 1)',
            width: 2,
        }),
    }),
    grass: new ol.style.Style({
        fill: new ol.style.Fill({
            color: 'rgba(0, 255, 0, 0.2)',
        }),
        stroke: new ol.style.Stroke({
            color: 'rgba(0, 255, 0, 1)',
            width: 2,
        }),
    }),
    hostel: new ol.style.Style({
        fill: new ol.style.Fill({
            color: 'rgba(255, 165, 0, 0.2)',
        }),
        stroke: new ol.style.Stroke({
            color: 'rgba(255, 165, 0, 1)',
            width: 2,
        }),
    }),
    mess: new ol.style.Style({
        fill: new ol.style.Fill({
            color: 'rgba(255, 0, 0, 0.2)',
        }),
        stroke: new ol.style.Stroke({
            color: 'rgba(255, 0, 0, 1)',
            width: 2,
        }),
    }),
    parking: new ol.style.Style({
        fill: new ol.style.Fill({
            color: 'rgba(128, 128, 128, 0.2)',
        }),
        stroke: new ol.style.Stroke({
            color: 'rgba(128, 128, 128, 1)',
            width: 2,
        }),
    }),
    sports: new ol.style.Style({
        fill: new ol.style.Fill({
            color: 'rgba(147, 112, 219, 0.2)',
        }),
        stroke: new ol.style.Stroke({
            color: 'rgba(147, 112, 219, 1)',
            width: 2,
        }),
    }),
    temple: new ol.style.Style({
        fill: new ol.style.Fill({
            color: 'rgba(139, 69, 19, 0.2)',
        }),
        stroke: new ol.style.Stroke({
            color: 'rgba(139, 69, 19, 1)',
            width: 2,
        }),
    }),
    walkways: new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: '#8B4513', // Brown color for walkways
            width: 2,
        })
    }),
    circles: new ol.style.Style({
        fill: new ol.style.Fill({
            color: 'rgba(169, 169, 169, 0.2)', // Light gray
        }),
        stroke: new ol.style.Stroke({
            color: 'rgba(169, 169, 169, 1)',
            width: 2,
        })
    }),
    roads_main: new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: '#333333', // Dark gray for main roads
            width: 4,
        })
    }),
    roads_second: new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: '#666666', // Medium gray for secondary roads
            width: 3,
        })
    }),
    under_construction: new ol.style.Style({
        fill: new ol.style.Fill({
            color: 'rgba(255, 255, 0, 0.2)', // Yellow with transparency
        }),
        stroke: new ol.style.Stroke({
            color: '#FFD700', // Gold color
            width: 2,
            lineDash: [10, 10], // Dashed line for under construction areas
        })
    }),
    tree: new ol.style.Style({
        image: new ol.style.Circle({
            radius: 5,
            fill: new ol.style.Fill({
                color: 'rgba(34, 139, 34, 0.8)',}),
}),
}),
};

// Initialize Map
const map = new ol.Map({
target: 'map',
layers: [],
view: new ol.View({
center: [0, 0],
zoom: 17,
minZoom: 16,
maxZoom: 19,
constrainRotation: true,
}),
});

// Vector Sources Array
const vectorSources = [];

// Add GeoJSON Layer Function
function addGeoJSONLayer(url, style) {
const vectorSource = new ol.source.Vector({
url: url,
format: new ol.format.GeoJSON(),
});

vectorSources.push(vectorSource);

const vectorLayer = new ol.layer.Vector({
source: vectorSource,
style: style,
});

vectorSource.on('error', function(error) {
console.error('Error loading GeoJSON:', url, error);
});

map.addLayer(vectorLayer);
return vectorLayer;
}

// Add Layers
const layers = {
academic: addGeoJSONLayer('data/Academic Blocks.geojson', styles.academic),
grass: addGeoJSONLayer('data/Grasscover.geojson', styles.grass),
hostels: addGeoJSONLayer('data/Hostels.geojson', styles.hostel),
mess: addGeoJSONLayer('data/Mess.geojson', styles.mess),
parking: addGeoJSONLayer('data/Parking.geojson', styles.parking),
sports: addGeoJSONLayer('data/Sports.geojson', styles.sports),
temple: addGeoJSONLayer('data/temple.geojson', styles.temple),
trees: addGeoJSONLayer('data/Trees.geojson', styles.tree),
walkways: addGeoJSONLayer('data/walkways.geojson', styles.walkways),
circles: addGeoJSONLayer('data/circles.geojson', styles.circles),
roads_main: addGeoJSONLayer('data/roads_main.geojson', styles.roads_main),
roads_second: addGeoJSONLayer('data/roads_second.geojson', styles.roads_second),
under_construction: addGeoJSONLayer('data/Under_Construction.geojson', styles.under_construction),
};

// Fit Map to Features
function fitMapToFeatures() {
let extent = null;
let loadedSources = 0;

vectorSources.forEach(source => {
source.once('change', function() {
    if (source.getState() === 'ready') {
        const sourceExtent = source.getExtent();
        if (extent === null) {
            extent = sourceExtent;
        } else {
            extent = ol.extent.extend(extent, sourceExtent);
        }
        
        loadedSources++;
        
        if (loadedSources === vectorSources.length) {
            map.getView().fit(extent, {
                padding: [50, 50, 50, 50],
                maxZoom: 19
            });
        }
    }
});
});
}

// UI Controls
const legendPanel = document.getElementById('legendPanel');
const searchPanel = document.getElementById('searchPanel');
const locationPopup = document.getElementById('locationPopup');
const popupTitle = document.getElementById('popupTitle');
const popupDescription = document.getElementById('popupDescription');
const popupTimestamp = document.getElementById('popupTimestamp');
const currentZoom = document.getElementById('currentZoom');
const currentTime = document.getElementById('currentTime');

// Toggle Controls
document.getElementById('toggleLegend').addEventListener('click', () => {
legendPanel.classList.toggle('active');
searchPanel.classList.remove('active');
});

document.getElementById('toggleSearch').addEventListener('click', () => {
searchPanel.classList.toggle('active');
legendPanel.classList.remove('active');
});

document.getElementById('closeLegend').addEventListener('click', () => {
legendPanel.classList.remove('active');
});

document.getElementById('closePopup').addEventListener('click', () => {
locationPopup.classList.remove('active');
});

// Center Map Button
document.getElementById('centerMap').addEventListener('click', () => {
fitMapToFeatures();
});

// Search Functionality
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');

function createSearchIndex() {
const searchIndex = [];
vectorSources.forEach(source => {
source.getFeatures().forEach(feature => {
    const name = feature.get('name');
    if (name) {
        searchIndex.push({
            name: name,
            feature: feature
        });
    }
});
});
return searchIndex;
}

searchInput.addEventListener('input', (e) => {
const query = e.target.value.toLowerCase();
const searchIndex = createSearchIndex();
searchResults.innerHTML = '';

if (query.length < 2) return;

const matches = searchIndex.filter(item => 
item.name.toLowerCase().includes(query)
);

matches.forEach(match => {
const div = document.createElement('div');
div.className = 'search-result-item';
div.textContent = match.name;
div.addEventListener('click', () => {
    const extent = match.feature.getGeometry().getExtent();
    map.getView().fit(extent, {
        padding: [50, 50, 50, 50],
        duration: 1000
    });
    showFeaturePopup(match.feature);
    searchPanel.classList.remove('active');
});
searchResults.appendChild(div);
});
});

// Show Feature Popup
function showFeaturePopup(feature) {
    const name = feature.get('name') || 'Unnamed Location';
    const description = feature.get('description') || 'No description available';

    popupTitle.textContent = name;
    popupDescription.textContent = description;
    popupTimestamp.textContent = new Date().toLocaleTimeString();

    // Get feature center and convert to pixel coordinates
    const extent = feature.getGeometry().getExtent();
    const center = ol.extent.getCenter(extent);
    const pixel = map.getPixelFromCoordinate(center);

    // Get viewport and popup dimensions
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    const popupHeight = locationPopup.offsetHeight;
    const popupWidth = locationPopup.offsetWidth;

    // Calculate available space above and below
    const spaceAbove = pixel[1];
    const spaceBelow = viewportHeight - pixel[1];

    // Calculate left position ensuring popup stays within viewport
    let left = pixel[0] - (popupWidth / 2);
    left = Math.max(10, Math.min(left, viewportWidth - popupWidth - 10));

    // Determine whether to show popup above or below based on available space
    let top;
    if (spaceAbove > popupHeight + 20 || spaceAbove > spaceBelow) {
        // Show above
        top = pixel[1] - popupHeight - 20;
    } else {
        // Show below
        top = pixel[1] + 20;
    }

    // Apply positions
    locationPopup.style.left = `${left}px`;
    locationPopup.style.top = `${top}px`;
    locationPopup.classList.add('active');
}

// Map Click Handler
map.on('click', function(event) {
const feature = map.forEachFeatureAtPixel(event.pixel, function(feature) {
return feature;
});

if (feature) {
showFeaturePopup(feature);
} else {
locationPopup.classList.remove('active');
}
});

// Hover Effect
map.on('pointermove', function(event) {
const pixel = map.getEventPixel(event.originalEvent);
const hit = map.hasFeatureAtPixel(pixel);
map.getTarget().style.cursor = hit ? 'pointer' : '';
});

// Update Stats
map.getView().on('change:resolution', function() {
currentZoom.textContent = `Zoom: ${Math.round(map.getView().getZoom())}`;
});

// Update Time
function updateTime() {
currentTime.textContent = new Date().toLocaleTimeString();
}
setInterval(updateTime, 1000);

// Initialize Map
fitMapToFeatures();
updateTime();