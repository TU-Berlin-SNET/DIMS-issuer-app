import React, { Component } from 'react';

import './../CSS/App.css';


import { Link} from "react-router-dom";
import Box from '@material-ui/core/Box';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import DIMSLogo from'./DIMSLogo';
import AccountIcon from '@material-ui/icons/AccountBox'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton'

var activeTab = 0;

const links=[
  {label: "Citizen", to: 'citizen'},
  {label:'Credential' ,to:'credential'},
  {label:'Cred. definition',  to:'credentialdef'},
  {label:'Proofs',  to:'proofs'},
  {label:'Schemas', to:'schemas'},
  {label:'Connections' , to:'connections'}
]

class Footer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            logText: 'login',
            
        }
}




handleTabChange(event,newValue) {
  activeTab = newValue
  this.props.onTabChange(activeTab)
}


  render() {
    return (
        <Box  width="100%" position='fixed' bottom='0'>

              <Container  maxWidth='false' >
                  <Box height='4vh' />
            </Container>
        </Box>
    );
  }
}

export default withStyles({ withTheme: true })(Footer);