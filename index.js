import 'geojson-extent/geojson-extent';
import mapboxgl, { Map } from 'mapbox-gl';

mapboxgl.accessToken = 'pk.eyJ1IjoibmRlcXVla2VyIiwiYSI6ImNqaGNmZGI5MzA4NmgzY282bzhybHB5MzcifQ.5PP4hhbqa12HYVAYjlg7uA';

const statisticsEl = document.getElementById('statistics');
const distanceEl = document.getElementById('distance');
const durationEl = document.getElementById('duration');

const map = new Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/outdoors-v9',
  zoom: 3,
  center: [12, 54]
});

const mapLoaded = map =>
  new Promise(resolve => {
    map.on('load', () => {
      resolve();
    });
  });

const fetchRouteInfo = () =>
  import('./route-medium-resolution');

const renderRoute = (geojson, bounds) => {
  map.addLayer({
    "id": "route",
    "type": "line",
    "source": {
      "type": "geojson",
      "data": geojson
    },
    "layout": {
      "line-join": "round",
      "line-cap": "round"
    },
    "paint": {
      "line-color": "#888",
      "line-width": 3
    }
  });

  map.fitBounds(bounds, {
    padding: 125
  });
};

const showStatistics = statistics => {
  statisticsEl.classList.remove('is-hidden');

  distanceEl.innerText = Math.round(statistics.distance / 1000).toString();
  durationEl.innerText = `${Math.round(statistics.duration / 60 / 60)} uur`;
};

Promise
  .all([ mapLoaded(map), fetchRouteInfo() ])
  .then(response => {
    const { statistics, geojson, bounds } = response[1];
    showStatistics(statistics);
    renderRoute(geojson, bounds);
});
