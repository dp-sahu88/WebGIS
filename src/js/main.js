import Map from 'ol/Map.js';
import OSM from 'ol/source/OSM.js';
import TileLayer from 'ol/layer/Tile.js';
import View from 'ol/View.js';
import GeoTIFF from 'ol/source/GeoTIFF.js';
import WebGLTileLayer from 'ol/layer/WebGLTile.js';

var view1 = new View({
    center: [0, 0],
    zoom: 2,
})
var layer1 = new TileLayer({
    source: new OSM(),
})
// var source2 = new GeoTIFF({
//     sources: [
//       {
//         url: "data/NE1_LR_LC_SR_W_DR.tif"
//       },
//     ],
//   })
// var layer2 = new WebGLTileLayer({source:source2})
const map = new Map({
    layers: [
        layer1
    ],
    target: 'map',
    view: view1,
});

