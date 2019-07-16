import React, { Component } from 'react';
/*
Screen:LoginScreen
Loginscreen is the main screen which the user is shown on first visit to page and after
hitting logout
*/
import './App.css';
/*
Module:Material-UI
Material-UI is used for designing ui of the app
*/

import {withRouter} from "react-router-dom";
/*
Module:superagent
superagent is used to handle post/get requests to server
*/
// var request = require('superagent');

class LandingScreen extends Component {
  constructor(props){
    super(props);

    this.state={
    }
  }

  componentDidMount(){

  }
  /*
  Function:handleCloseClick
  Parameters: event,index
  Usage:This fxn is used to remove file from filesPreview div
  if user clicks close icon adjacent to selected file
  */

  render() {
    return (
      <div className="App">
      </div>
    );
  }
}

export default withRouter(LandingScreen);