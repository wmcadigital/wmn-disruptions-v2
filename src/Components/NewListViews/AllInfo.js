import React, { Component } from 'react';
import axios from 'axios';
import Debounce from 'react-debounce-component';

class RestInfo extends Component {
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

    return (
      <div>
        <h5>Info Below</h5>
        <Debounce ms={7000}>
          {disruptions.map(disruption => (
            <div>
              {disruption.title}
              <br />
              {disruption.mode}
              <br />
              {disruption.title}
            </div>
          ))}
        </Debounce>
      </div>
    );
  }
}

export default RestInfo;
