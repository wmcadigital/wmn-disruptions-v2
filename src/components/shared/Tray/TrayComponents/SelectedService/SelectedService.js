import React, { useContext } from 'react';
import { AutoCompleteContext, FetchDisruptionsContext } from 'globalState';
// Import customHooks
import useFilterLogic from 'customHooks/useFilterLogic';
// Imported components
import SelectedServiceHeader from './SelectedServiceHeader/SelectedServiceHeader';
import GoodService from './GoodService/GoodService';
import DisruptedService from './DisruptedService/DisruptedService';

const SelectedService = () => {
  const [fetchDisruptionsState] = useContext(FetchDisruptionsContext);
  const [autoCompleteState, autoCompleteDispatch] = useContext(AutoCompleteContext);
  // The below will check all disruptions and will return any disruption where the mode is bus and the id the user clicked in the autocomplete is within the servicesAffected array
  const selectedData = useFilterLogic();

  return (
    <>
      <SelectedServiceHeader
        autoCompleteState={autoCompleteState}
        autoCompleteDispatch={() => autoCompleteDispatch({ type: 'RESET_SELECTED_SERVICE' })}
      />

      {/* If no selectedData then it must be good service */}
      {!selectedData.length && <GoodService />}

      {/* If there are selectedData then there must be disruptions, loop through */}
      {selectedData.length > 0 &&
        fetchDisruptionsState.isMapVisible &&
        selectedData.map(disruption => (
          <DisruptedService
            disruption={disruption}
            key={disruption.id}
            disruptionID={autoCompleteState.disruptionID}
            autoCompleteDispatch={() => autoCompleteDispatch({ type: 'RESET_SELECTED_SERVICE' })}
          />
        ))}
    </>
  );
};

export default SelectedService;