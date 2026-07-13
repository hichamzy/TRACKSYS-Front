// Style MapLibre minimal pointant sur les tuiles raster OpenStreetMap standard (pas de clé API)
export const OSM_STYLE = {
  version: 8,
  sources: {
    osm: {
      type: 'raster',
      tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
      tileSize: 256,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    },
  },
  layers: [{ id: 'osm', type: 'raster', source: 'osm' }],
};

// Centre par défaut : Casablanca
export const CASABLANCA_CENTER = [-7.6200, 33.5780];
export const DEFAULT_ZOOM = 12.5;
