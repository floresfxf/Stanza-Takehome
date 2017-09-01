import React, { Component } from 'react';

import Title from '../Components/Title'
import LeftMenu from '../Components/LeftMenu'

import RaisedButton from 'material-ui/RaisedButton';

export default class Header extends Component {
  render(){
    return(
      <div className="App-header">

          <Title className="title"
            handleToggle={this.props.leftToggle}
            headline={this.props.titleName}/>

          <RaisedButton
            label="Add to Calendar"
            style={{margin: 12}}
            backgroundColor="#EFAE45"
            labelColor='#fff'
            onClick={this.props.subClick}/>

          <h4>{this.props.subscriptions}K Subscribers</h4>

          <LeftMenu
            handleLeftClose={this.props.handleLeftClose}
            drawer={this.props.drawer}
            drawerChange={this.props.drawerChange}
            category={this.props.category}
          />

      </div>
    )
  }
}
