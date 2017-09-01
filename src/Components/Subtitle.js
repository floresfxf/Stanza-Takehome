import React, { Component } from 'react';

export default class Subtitle extends Component {
  render(){
    return(
      <div>
        <div>
          <b>{new Date(this.props.dateTime).toLocaleDateString()}</b>
        </div>
        <div>
          <b>{new Date(this.props.dateTime).toLocaleTimeString()}</b>
        </div>
      </div>

    )
  }
}
