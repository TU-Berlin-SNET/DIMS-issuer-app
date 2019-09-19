import React, { Component } from 'react';
import { Link} from "react-router-dom";
import Box from '@material-ui/core/Box';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import DIMSLogo from'./DIMSLogo';

var activeTab = 0;

const links=[
  {label: "Citizen", to: 'citizen'},
  {label:'Credential' ,to:'credential'},
  {label:'Cred. definition',  to:'credentialdef'},
  {label:'Proofs',  to:'proofs'},
  {label:'Schemas', to:'schemas'},
  {label:'Connections' , to:'connections'}
]

class IssuerBar extends Component {
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
      <Box>
        <AppBar position='relative' color='primary'>
          <Box position= 'absolute'  left='3vw'>
        <  DIMSLogo />
        </Box>
          <Tabs
            value={this.props.tabNr}
            onChange={this.handleTabChange.bind(this)}
            centered
          >
            {links.map((link, key) => {return (
                <Tab key={key} component={Link} value={key} label={link.label} to={link.to}/>
            )})}
              </Tabs>
            <Box  position= 'absolute'  top ='20%' right='1vw' >
              <Link underline='none' style= {{color: '#ffffff' }}   to={''}>Login</Link>
            </Box>
        </AppBar>
      </Box>
    );
  }
}

export default withStyles({ withTheme: true })(IssuerBar);