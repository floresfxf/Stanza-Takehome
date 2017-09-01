import React, { Component } from 'react';
import axios from 'axios';
import './App.css';

import Header from './Containers/Header.js'
import Tile from './Components/Tile'
import styles from './Styles/styles.js'

import {GridList} from 'material-ui/GridList';
import Snackbar from 'material-ui/Snackbar';

const baseURL = `https://www.stanza.dance/api/graphql?query=%7B%0A%20%20calendar(shortname%3A%20%22livenation%22)%20%7B%0A%20%20%20%20name%0A%20%20%20%20images%20%7B%0A%20%20%20%20%20%20large%0A%20%20%20%20%7D%0A%20%20%20%20subscriberCount%0A%20%20%20%20upcomingEvents%3A%20events(first%3A%2010%2C%20filterBy%3A%20%7Bpast%3A%20false%7D)%20%7B%0A%20%20%20%20%20%20edges%20%7B%0A%20%20%20%20%20%20%20%20node%20%7B%0A%20%20%20%20%20%20%20%20%20%20name%0A%20%20%20%20%20%20%20%20%20%20category%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20name%0A%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%20%20ticketingPrimary%0A%20%20%20%20%20%20%20%20%20%20images%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20small%0A%20%20%20%20%20%20%20%20%20%20%20%20medium%0A%20%20%20%20%20%20%20%20%20%20%20%20large%0A%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%20%20dates%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20start%0A%20%20%20%20%20%20%20%20%20%20%20%20end%0A%20%20%20%20%20%20%20%20%20%20%20%20allDay%0A%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%0A%20%20%7D%0A%7D%0A`
//Query after URI encoding^

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      image: '',
      events: [],
      name: '',
      subCount: 0,
      headerImage:'',
      open: false,
      category: []
    }
  }
  componentDidMount(){//Load data after component mounts (quicker loading time)
    axios.get(baseURL)
    .then((response) => {
      const res = response.data.data.calendar;
      let obj = {};
      res.upcomingEvents.edges.forEach((tile) => {
        if (!obj[tile.node.category.name]){
          obj[tile.node.category.name] = 1; //No duplicates
        }
      })
      let newArr = ['All',...Object.keys(obj)]; //All option to turn off filters
      this.setState({
        events: res.upcomingEvents.edges,
        origEvents: res.upcomingEvents.edges,
        name: res.name,
        subCount: (parseInt(res.subscriberCount,10)/ 1000).toFixed(1), //to isplay as x.xk subs
        headerImage: res.images.large,
        category: newArr
      })
    })
  }

  leftMenuToggle = () => this.setState({drawerOpen: !this.state.open});
  drawer = (drawerOpen) => this.setState({drawerOpen});

  handleLeftClose = (cat) => { //set filter
   this.setState({
     drawerOpen: false
   },() => {
     this.filter(cat);
   });
  };
  subClick = () => {
    this.setState({
      open: true,
    });
  };
  snackbarClose = () => {
    this.setState({
      open: false,
    });
  };
  filter = (label)  => { //show all if label is All
    if (label === "All"){
      const events = [...this.state.origEvents]; //dont mutate original state
      this.setState({
        events: events
      });
    }else{
      const newEvents = this.state.origEvents.filter((event) => { //filter based on selection
        return event.node.category.name === label;
      });
      this.setState({
        events: newEvents
      });
    };
  };
  render() {
    return (
      <div className="App">
        <div className="bg-wrap" style={{backgroundImage:`url(${this.state.headerImage})` }}>

          <Header className="App-header"
            titleName={this.state.name}
            leftToggle={this.leftMenuToggle}
            subClick={this.subClick}
            category={this.state.category}
            subscriptions={this.state.subCount}
            drawer={this.state.drawerOpen}
            drawerChange={this.drawer}
            handleLeftClose={this.handleLeftClose}
          />

        </div>
        <div style={styles.root}>

          <GridList
            cellHeight={300}
            style={styles.gridList}
            cols={3}
            >

            {this.state.events.map((tile, i) => (<Tile key={i} tileVal={tile} />))}

          </GridList>

        </div>

        <Snackbar//for subscribe button confirmation
          open={this.state.open}
          message="Event added to your calendar"
          autoHideDuration={4000}
          onRequestClose={this.snackbarClose}
        />
      </div>
    );
  }
}

export default App;
