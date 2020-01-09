import React, { Component } from 'react';
import axios from 'axios';

class AllInfo extends Component {
  constructor() {
    super();

    this.state = {
      disruptions: []
    };
  }

  componentDidMount() {
    axios
      .get('https://trasnport-api-isruptions-v2.azure-api.net/Disruption/v2/', {
        headers: {
          'Ocp-Apim-Subscription-Key': '55060e2bfbf743c5829b9eef583506f7'
        }
      })
      .then(response => {
        this.setState({
          disruptions: response.disruptions
        });
      });
  }

  render() {
    const { disruptions } = this.state;

    const dis = disruptions.map(disruption => {
      return (
        <div>
          {disruption.title}
          <br />
          {disruption.mode}
          <br />
          {disruption.title}
        </div>
      );
    });

    return (
      <div>
        <h5>The Disruptions All Info:</h5>
        {dis}
      </div>
    );
  }
}

export default AllInfo;