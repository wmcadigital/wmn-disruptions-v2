// Using https://developers.arcgis.com/labs/browse/?product=javascript&topic=any and ESRI JS API
import React, { useContext, useEffect, useRef } from 'react';
import { loadModules } from 'esri-loader';
import axios from 'axios';

import { FetchDisruptionsContext, AutoCompleteContext, ModeContext } from 'globalState';

// Import map icons
import locateCircle from 'assets/svgs/map/locate-circle.svg';
// bus icons
import busMinor from 'assets/map-icons/bus-minor.png';
// import busMajor from 'assets/map-icons/bus-major.png';
// import busSevere from 'assets/map-icons/bus-severe.png';
// tram icons
// import tramMinor from 'assets/map-icons/tram-minor.png';
// import tramMajor from 'assets/map-icons/tram-major.png';
// import tramSevere from 'assets/map-icons/tram-severe.png';
// train icons
// import trainMinor from 'assets/map-icons/train-minor.png';
// import trainMajor from 'assets/map-icons/train-major.png';
// import trainSevere from 'assets/map-icons/train-severe.png';
// roads icons
// import roadsMinor from 'assets/map-icons/roads-minor.png';
// import roadsMajor from 'assets/map-icons/roads-major.png';
// import roadsSevere from 'assets/map-icons/roads-severe.png';

import s from './Map.module.scss';

const WebMapView = () => {
  const mapRef = useRef();
  const view = useRef(); // view.current
  const map = useRef();
  const glayer = useRef();

  const [fetchDisruptionsState] = useContext(FetchDisruptionsContext); // Get the state of modeButtons from modeContext
  const [autoCompleteState] = useContext(AutoCompleteContext); // Get the state of modeButtons from modeContext
  const [modeState] = useContext(ModeContext); // Get the state of modeButtons from modeContext

  // Map useEffect (this is to apply core mapping stuff on page/component load)
  useEffect(() => {
    // lazy load the required ArcGIS API for JavaScript modules and CSS
    // Make sure that the referenced module is also injected as a param in the .then function below
    loadModules(
      [
        'esri/Map',
        'esri/views/MapView',
        'esri/Basemap',
        'esri/layers/VectorTileLayer',
        'esri/widgets/Locate',
        'esri/Graphic',
        'esri/layers/GraphicsLayer'
      ],
      {
        css: true
      }
    ).then(([Map, MapView, Basemap, VectorTileLayer, Locate, Graphic, GraphicsLayer]) => {
      // When loaded, create a new basemap
      const basemap = new Basemap({
        baseLayers: [
          new VectorTileLayer({
            portalItem: {
              // set the basemap to the one being used: https://tfwm.maps.arcgis.com/home/item.html?id=53f165a8863c4d40ba017042e248355e
              id: '53f165a8863c4d40ba017042e248355e'
            }
          })
        ]
      });

      // Create a new map with the basemap set above
      map.current = new Map({
        basemap
      });

      // Create a new map view with settings
      view.current = new MapView({
        container: mapRef.current,
        map: map.current,
        center: [-2.0047209, 52.4778132],
        zoom: 10
      });

      const locateBtn = new Locate({
        view: view.current, // Attaches the Locate button to the view
        graphic: new Graphic({
          // overwrites the default symbol used for the graphic placed at the location of the user when found
          symbol: {
            type: 'picture-marker',
            url: locateCircle, // Set to svg circle when user hits 'locate' button
            height: '150px',
            width: '150px'
          }
        })
      });

      view.current.ui.move(['zoom'], 'top-right');

      // Add the locate widget to the top left corner of the view.current
      view.current.ui.add(locateBtn, {
        position: 'top-right'
      });

      glayer.current = new GraphicsLayer();
      map.current.add(glayer.current);

      // eslint-disable-next-line no-plusplus

      return () => {
        if (view.current) {
          // destroy the map view
          view.current.container = null;
        }
      };
    });
  }, []);

  // This useEffect is to add the disruption icons to the map
  useEffect(() => {
    // If disruption state has data in it...
    if (fetchDisruptionsState.data.length) {
      // Load ESRI modules
      loadModules(['esri/Graphic', 'esri/layers/FeatureLayer']).then(([Graphic, FeatureLayer]) => {
        // Create new graphic for each lat long in disruptions list
        const graphics = fetchDisruptionsState.data.map(item => {
          let affectedIds = '';
          if (item.servicesAffected) {
            item.servicesAffected.forEach(service => {
              affectedIds += `${service.id}, `;
            });
          }

          return new Graphic({
            attributes: {
              id: item.id,
              title: item.title,
              mode: item.mode,
              servicesAffected: affectedIds
            },
            geometry: {
              type: 'point',
              longitude: item.lon || 0,
              latitude: item.lat || 0,
              spatialreference: { wkid: 4326 }
            },
            symbol: {
              type: 'picture-marker',
              url: busMinor, // Set to svg circle when user hits 'locate' button
              height: '30px',
              width: '51px'
            }
          });
        });

        const flayer = new FeatureLayer({
          source: graphics,
          objectIdField: 'oid', // This must be defined when creating a layer from `Graphic` objects
          // outFields: ['*'],
          fields: [
            {
              name: 'oid',
              alias: 'oid',
              type: 'oid'
            },
            {
              name: 'id',
              alias: 'id',
              type: 'string'
            },
            {
              name: 'title',
              alias: 'title',
              type: 'string'
            },
            {
              name: 'mode',
              alias: 'mode',
              type: 'string'
            },
            {
              name: 'servicesAffected',
              alias: 'servicesAffected',
              type: 'string'
            }
          ]
        });

        function addGraphics(result) {
          result.features.forEach(feature => {
            const g = new Graphic({
              geometry: feature.geometry,
              attributes: feature.attributes,
              popupTemplate: {
                // autocasts as new PopupTemplate()
                title: '{title}',
                content: [
                  {
                    type: 'fields',
                    fieldInfos: [
                      {
                        fieldName: 'title',
                        label: 'Title',
                        visible: true
                      },
                      {
                        fieldName: 'id',
                        label: 'id',
                        visible: true
                      },
                      {
                        fieldName: 'servicesAffected',
                        label: 'servicesAffected',
                        visible: true
                      }
                    ]
                  }
                ]
              },
              symbol: {
                // autocasts as new SimpleMarkerSymbol()
                type: 'picture-marker',
                url: busMinor, // Set to svg circle when user hits 'locate' button
                height: '30px',
                width: '51px'
              }
            });
            glayer.current.add(g);
          });
        }

        let queryBuilder;

        if (modeState.mode) {
          queryBuilder = `mode = '${modeState.mode}'`;
        }

        if (autoCompleteState.selectedService.id) {
          queryBuilder += ` AND servicesAffected LIKE '%${autoCompleteState.selectedService.id}%'`;
        }

        console.log({ queryBuilder });

        const query = flayer.createQuery();
        query.where = queryBuilder;

        flayer.queryFeatures(query).then(result => {
          glayer.current.removeAll();
          addGraphics(result);
          console.log({ map: map.current.layers });

          // view.goTo({ center: g, zoom: 15 });
        });
      });
    }
  }, [autoCompleteState.selectedService, fetchDisruptionsState.data, modeState.mode]);

  // This useEffect is to plot the line on the map
  useEffect(() => {
    // If there is an ID in state, then lets hit the API and get the geoJSON
    if (autoCompleteState.selectedService.id) {
      axios
        .get(
          `https://trasnport-api-isruptions-v2.azure-api.net/bus/v1/RouteGeoJSON/${autoCompleteState.selectedService.id}`,
          {
            headers: {
              'Ocp-Apim-Subscription-Key': '55060e2bfbf743c5829b9eef583506f7'
            }
          }
        )
        .then(route => {
          // Get esri modules
          loadModules(['esri/Graphic']).then(([Graphic]) => {
            // Create a new polyline with the geoJSON from the API for the ID
            const poly = new Graphic({
              geometry: {
                type: 'polyline',
                paths: route.data.geoJson.features[0].geometry.coordinates
              },
              symbol: {
                type: 'simple-line', // autocasts as new SimpleLineSymbol()
                color: [226, 119, 40], // RGB color values as an array
                width: 4
              }
            });
            view.current.graphics.add(poly); // Add polyline to the map
          });
        });
    }
  }, [autoCompleteState.selectedService.id]);

  return (
    <div id="disruptions-map" className={`webmap ${s.map}`} ref={mapRef} title="Disruptions map" />
  );
};

export default WebMapView;
