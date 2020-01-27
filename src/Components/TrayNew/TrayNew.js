import React from 'react';

// Import components
import When from './When/When';
import Mode from './Mode/Mode';
// Import context
import { WhenProvider } from './When/WhenContext';
import { ModeProvider } from './Mode/ModeContext';
// Import styles
import s from './TrayNew.module.scss';

const TrayNew = () => {
  return (
    <div className={`${s.tray} wmnds-grid wmnds-p-md`}>
      <WhenProvider>
        <When />
      </WhenProvider>

      <ModeProvider>
        <Mode />
      </ModeProvider>
    </div>
  );
};

export default TrayNew;
