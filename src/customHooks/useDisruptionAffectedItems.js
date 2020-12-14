import React, { useState, useContext } from 'react';
import { FetchDisruptionsContext } from 'globalState';
import useWindowHeightWidth from 'customHooks/useWindowHeightWidth';
import ToggleMoreAffectedItems from 'components/shared/ToggleMoreAffectedItems/ToggleMoreAffectedItems';
import FavBtn from 'components/shared/FavBtn/FavBtn';

const useDisruptionAffectedItems = (disruption) => {
  let iconLeft; // set icon to correct name for tram/metro, train/rail etc.
  let whatIsAffected; // Change copy of what is affected based on mode

  // Setup showing and hiding excess disrupted servces
  const { windowWidth } = useWindowHeightWidth();
  const [fetchDisruptionsState] = useContext(FetchDisruptionsContext);
  const maxShownBeforeHiding = !fetchDisruptionsState.isMapVisible && windowWidth >= 768 ? 7 : 4;
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleExpanded = () => setIsExpanded((prevState) => !prevState);
  const sliceUpper = isExpanded ? 100 : maxShownBeforeHiding;

  // Change placeholder vars above depending on mode
  switch (disruption.mode) {
    case 'tram':
      iconLeft = 'metro';
      whatIsAffected = 'stops';
      break;

    case 'train':
      iconLeft = 'rail';
      whatIsAffected = 'lines';
      break;

    // Bus
    default:
      iconLeft = disruption.mode;
      whatIsAffected = 'services';
      break;
  }

  // Set the correct title based on mode
  const title = () => (
    <>
      {disruption.title?.charAt(0).toUpperCase() + disruption.title?.slice(1) ||
        disruption.subtitle}
      {/* If bus, show 'at' subtitle */}
      {disruption.mode === 'bus' && (
        <>
          {' '}
          at <strong>{disruption.subtitle}</strong>
        </>
      )}
    </>
  );

  const affectedItems = () => (
    <>
      {/* Affected */}
      <div className="wmnds-col-1 ">
        <strong>Affected {whatIsAffected}:</strong>
      </div>
      <div className="wmnds-col-1">
        {/* Affected Services / Bus */}
        {disruption.servicesAffected && disruption.mode === 'bus' && (
          <>
            {disruption.servicesAffected
              .sort(
                (a, b) => a.serviceNumber.replace(/\D/g, '') - b.serviceNumber.replace(/\D/g, '')
              )
              .slice(0, sliceUpper)
              .map((affected) => (
                <FavBtn
                  id={affected.id}
                  severity={disruption.disruptionSeverity}
                  text={affected.serviceNumber}
                  title={`${affected.routeDescriptions[0].description} (${affected.operatorName})`}
                  mode={disruption.mode}
                  key={affected.id}
                />
              ))}
            {disruption.servicesAffected.length > maxShownBeforeHiding && (
              <ToggleMoreAffectedItems
                handleClick={toggleExpanded}
                id={`toggleMoreAffectedItems_${disruption.id}`}
                isExpanded={isExpanded}
                amountHidden={disruption.servicesAffected.length - maxShownBeforeHiding}
                serviceText={whatIsAffected}
              />
            )}
          </>
        )}
        {/* Affected Stops / Tram */}
        {disruption.servicesAffected &&
          disruption.mode === 'tram' &&
          disruption.stopsAffected
            .sort((a, b) => {
              // Convert stop name text to lowercase
              const x = a.name.toLowerCase();
              const y = b.name.toLowerCase();
              // Return minus or plus values when comparing prev/next string. This ensures alphabetical sorting.
              if (x < y) {
                return -1;
              }
              if (x > y) {
                return 1;
              }
              return 0;
            })
            .slice(0, sliceUpper)
            .map((affected) => (
              <FavBtn
                id={affected.atcoCode}
                severity={disruption.disruptionSeverity}
                text={affected.name}
                title={`${disruption.servicesAffected[0].routeDescriptions[0].description} (${disruption.servicesAffected[0].operatorName})`}
                mode={disruption.mode}
                key={affected.atcoCode}
              />
            ))}
        {/* Affected Stations / Train */}
        {disruption.servicesAffected[0].routeDescriptions &&
          disruption.mode === 'train' &&
          disruption.servicesAffected[0].routeDescriptions
            .sort((a, b) => {
              // Convert line name text to lowercase
              const x = a.description.toLowerCase();
              const y = b.description.toLowerCase();
              // Return minus or plus values when comparing prev/next string. This ensures alphabetical sorting.
              if (x < y) {
                return -1;
              }
              if (x > y) {
                return 1;
              }
              return 0;
            })
            .slice(0, sliceUpper)
            .map((affected) => (
              <FavBtn
                id={affected.description}
                severity={disruption.disruptionSeverity}
                text={affected.description}
                title={affected.description}
                mode={disruption.mode}
                key={affected.id}
              />
            ))}
      </div>
    </>
  );

  return { iconLeft, title, affectedItems };
};

export default useDisruptionAffectedItems;
