import React, { Component } from 'react';
import Loginscreen from './LoginScreen'
import {withRouter } from "react-router-dom";
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box'
import './../CSS/App.css';


class App extends Component {
  constructor(props){
    super(props);
    this.state={
      loginPage:[]
    }
  }
  componentWillMount(){
    var loginPage =[];
    loginPage.push(<Loginscreen parentContext={this} onTabChange={(event, selected) => this.handleTabChange(event, selected)} />);
    this.setState({
                  loginPage:loginPage
                    })
  }
  componentDidMount(){
    console.log(this)
  }
  
  handleTabChange(newTab){
    console.log(newTab)
    this.props.onTabChange(newTab)
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
