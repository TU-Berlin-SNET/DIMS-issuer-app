import React, { Component } from 'react';
import Loginscreen from './Loginscreen'
import {withRouter } from "react-router-dom";
import './App.css';
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
      <Box className="App">
        {this.state.loginPage}
      </Box>
    );
  }
}
export default withRouter(App);
