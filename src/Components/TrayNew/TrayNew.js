import React from 'react';

// Import components
import When from './When/When';
import Mode from './Mode/Mode';
import AutoComplete from './AutoComplete/AutoComplete';

// Import styles
import s from './TrayNew.module.scss';

const TrayNew = () => {
  return (
    <div className={`${s.tray} wmnds-grid wmnds-p-md`}>
      <When />
      <Mode />
      <AutoComplete />
    </div>
  );
};

export default TrayNew;