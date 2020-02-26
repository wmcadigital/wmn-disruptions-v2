import { useContext, useEffect } from 'react';
import { loadModules } from 'esri-loader';
import axios from 'axios';
import { AutoCompleteContext } from 'globalState';

const useMapPolyline = (_polyline, _view) => {
  const [autoCompleteState] = useContext(AutoCompleteContext); // Get the state of modeButtons from modeContext
  const polyline = _polyline; // Reassign injected useRef params to internal vars
  const view = _view;

  // This useEffect is to plot the line on the map
  useEffect(() => {
    if (polyline.current) {
      polyline.current.removeAll();
    }
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
          // lazy load the required ArcGIS API for JavaScript modules and CSS
          loadModules(['esri/Graphic']).then(([Graphic]) => {
            // Create a new polyline with the geoJSON from the API for the ID
            const poly = new Graphic({
              geometry: {
                type: 'polyline',
                paths: route.data.geoJson.features[0].geometry.coordinates
              },
              symbol: {
                type: 'simple-line', // autocasts as new SimpleLineSymbol()
                color: '#3c1053', // RGB color values as an array
                width: 4
              }
            });

            polyline.current.add(poly); // Add polyline to the map

            view.current.goTo({ target: poly });
          });
        });
    }
  }, [autoCompleteState.selectedService.id, polyline, view]);
};

export default useMapPolyline;