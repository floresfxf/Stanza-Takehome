import React, { Component } from 'react';

import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

export default class Title extends Component {
  render(){
    return(
      <div className="title">
        <IconButton
        className="iconTop"
        onClick={this.props.handleToggle}
        iconStyle={{color:'white',}}
        ><MoreVertIcon /></IconButton>

        <h2>{this.props.headline}</h2>
      </div>
    )
  }
}
