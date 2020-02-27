import React from 'react';
import Icon from 'components/shared/Icon/Icon';

const GoodServiceMessage = () => {
  return (
    <div className="wmnds-msg-summary wmnds-msg-summary--success wmnds-col-1">
      <div className="wmnds-msg-summary__header">
        <Icon iconName="general-success" iconClass="wmnds-msg-summary__icon" />
        <h3 className="wmnds-msg-summary__title">Good service</h3>
      </div>

      <div className="wmnds-msg-summary__info">No incidents reported.</div>
    </div>
  );
};

export default GoodServiceMessage;
