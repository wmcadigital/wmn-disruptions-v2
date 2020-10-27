import React, { useContext } from 'react';
import { FetchDisruptionsContext, AutoCompleteContext } from 'globalState';
// Import customHooks
import useFilterLogic from 'customHooks/useFilterLogic';
// Imported components
import Message from 'components/shared/Message/Message';
import DisruptedService from './DisruptedService/DisruptedService';
import InfoAboutSelectedService from './InfoAboutSelectedService/InfoAboutSelectedService';

const SelectedService = () => {
  const [fetchDisruptionsState] = useContext(FetchDisruptionsContext);
  const [autoCompleteState] = useContext(AutoCompleteContext);
  // The below will check all disruptions and will return any disruption where the mode is bus and the id the user clicked in the autocomplete is within the servicesAffected array
  const selectedData = useFilterLogic();

  return (
    <>
      {autoCompleteState.selectedItem.id && autoCompleteState.selectedItem.severity && (
        <InfoAboutSelectedService />
      )}

      {/* If no selectedData then it must be good service */}
      {!selectedData.length && <Message />}

      {/* If there are selectedData then there must be disruptions, loop through */}
      {selectedData.length > 0 &&
        fetchDisruptionsState.isMapVisible &&
        selectedData.map((disruption) => (
          <DisruptedService disruption={disruption} key={disruption.id} />
        ))}
    </>
  );
};

export default SelectedService;
