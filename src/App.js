import React, { Component } from 'react';
import Loginscreen from './Screens/LoginScreen'
import {withRouter } from "react-router-dom";

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';


import Box from '@material-ui/core/Box'




class App extends Component {
  constructor(props){
    super(props);
    this.state={
      loginPage:[]
    }
  }
  componentWillMount(){
    var loginPage =[];
    loginPage.push(<Loginscreen parentContext={this}/>);
    this.setState({
                  loginPage:loginPage
                    })
  }
  render() {
    return (
      <MuiThemeProvider>
      <Box className="App">
        {this.state.loginPage}
      </Box>
      </MuiThemeProvider>
    );
  }
}
export default withRouter(App);
