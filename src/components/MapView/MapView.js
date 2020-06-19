import React from 'react';
// Import customHooks
import useWindowHeightWidth from 'customHooks/useWindowHeightWidth';
// Import components
import Map from './Map/Map';
import Tray from '../shared/Tray/Tray';
// Import styles
import s from './MapView.module.scss';

const MapView = () => {
  const { appHeight, windowWidth } = useWindowHeightWidth(); // Get window height and width

  // Show correct height based on screen size
  const mapHeight = windowWidth < 998 ? appHeight : 'calc(100vh - 298px)'; // Minus 298px as this is the height of the header and footer

  return (
    <div className={s.disruptionsContainer} style={{ height: mapHeight }}>
      <Map />
      <Tray />
    </div>
  );
};

export default MapView;
