import Map from 'ol/Map.js';
import OSM from 'ol/source/OSM.js';
import TileLayer from 'ol/layer/Tile.js';
import View from 'ol/View.js';
import { useGeographic } from 'ol/proj'
import { Image } from 'ol/layer';
import { ImageStatic } from 'ol/source';
import { Vector as VectorSource } from 'ol/source';
import { Vector as VectorLayer } from 'ol/layer';
import GeoJSON from 'ol/format/GeoJSON'
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import {circular} from 'ol/geom/Polygon';
import { fromLonLat } from 'ol/proj';
import Control from 'ol/control/Control';
// useGeographic()

var focusOn={
    worldmap:{coord:[0,0], zoom:1, layers:[layer1]},
    bridge:{coord:[82.503237, 20.915524],zoom:15},
    bharatpur:{coord:[77.54888997676665952,27.21207894490000356], zoom:15},
    naguar:{coord:[73.737068,27.198381], zoom:17}
}

var view1 = new View({
    center: [0,0],
    zoom: 1,
})
// layer1 //////////////////////////////////////////////////////////////
var layer1 = new TileLayer({
    source: new OSM(),
})
// layer2 /////////////////////////////////////////////////////////////
var source2 = new ImageStatic({
    url: 'data/009_2023_BRIDGE_161_ODISHA_Ortho.png',
    projection: 'EPSG:4326',
    imageExtent: [82.500122990, 20.916153854, 82.504022669, 20.920769279]
})
var layer2 = new Image(
    {
        source: source2
    }
)
// layer 3 /////////////////////////////////////////////////////////////
var source3 = new ImageStatic({
    url: 'data/Bharathpur_Full_Ortho_Part_-8-6.png',
    projection: 'EPSG:4326',
    imageExtent: [77.548881399, 27.198279853, 77.564321379, 27.212084988]
})
var layer3 = new Image(
    {
        source: source3
    }
)
//layer4 //////////////////////////////////////////////////////////////////
var source4 = new VectorSource({
    url: 'data/Naguar.geojson',
    format: new GeoJSON()
  })
var layer4 = new VectorLayer({
    title: 'naguar',
    source: source4
})

var focusOn={
    worldmap:{coord:[0,0], zoom:1, layers:[layer1]},
    bridge:{coord:[82.503237, 20.915524],zoom:15, layers:[layer1, layer2]},
    bharatpur:{coord:[77.54888997676665952,27.21207894490000356], zoom:15, layers:[layer1, layer3]},
    naguar:{coord:[73.737068,27.198381], zoom:17, layers:[layer1, layer4]}
}

// layer 5 ///////////////////////////////////////////////////////////////////////////////////////

const source5 = new VectorSource();
const layer5 = new VectorLayer({
  source: source5,
});

// add layers to the map/////////////////////////////////////////////////////////////////////////
const map = new Map({
    layers: [
        layer1
    ],
    target: 'map',
    view: view1,
});

var ctrlBtnSet = document.getElementsByClassName("layerCtrlBtn")
var changeFocus = (e)=>{
    useGeographic()
    let target = e.target.id
    let coord = focusOn[target].coord
    let zoom = focusOn[target].zoom
    view1.setCenter(coord)
    view1.setZoom(zoom)
    map.setLayers([])
    let layers =focusOn[target].layers
    layers.forEach(element => {
        map.addLayer(element)
    });
}
for (let index = 0; index < ctrlBtnSet.length; index++) {
    const element = ctrlBtnSet[index]
    element.addEventListener("click",changeFocus)
}

var findMeBtn = document.getElementById("find-me")
findMeBtn.addEventListener("click", findMe)
function findMe(){
    navigator.geolocation.watchPosition(
        function (pos) {
          const coords = [pos.coords.longitude, pos.coords.latitude];
          const accuracy = circular(coords, pos.coords.accuracy);
          source5.clear(true);
          source5.addFeatures([
            new Feature(
              accuracy.transform('EPSG:4326', map.getView().getProjection())
            ),
            new Feature(new Point(fromLonLat(coords))),
          ]);
        },
        function (error) {
          alert(`ERROR: ${error.message}`);
        },
        {
          enableHighAccuracy: true,
        }
      );    
      map.setLayers([])
      map.addLayer(layer1)
      map.addLayer(layer5)
      if (!source5.isEmpty()) {
        map.getView().fit(source5.getExtent(), {
          maxZoom: 18,
          duration: 500,
        });
      }
}
