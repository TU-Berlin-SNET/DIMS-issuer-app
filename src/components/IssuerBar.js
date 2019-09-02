import React, { Component } from 'react';
import { Link} from "react-router-dom";
import Box from '@material-ui/core/Box';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import DIMSLogo from'./DIMSLogo';

var activeTab = 0;

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
            <Tab  component={Link}  value={0}  label={'Citizen'}  to={'user'} />
            <Tab  component={Link}  value={1}  label={'Onboarding'}  to={'onboarding'} />
            <Tab  component={Link}  value={2} label={'Credential'}    to={'credential'} />
            <Tab  component={Link}  value={3}  label={'Cred. definition'}  to={'credentialdef'} />
            <Tab  component={Link}  value={4}  label={'Proofs'}  to={'proofs'} />
            <Tab  component={Link}  value={5}  label={'Schemas'}  to={'schemas'} />
            <Tab  component={Link}  value={6}   label={'Connections'}  to={'connections'} />
              </Tabs>
              <Box  position= 'absolute'  top ='20%' right='1vw' >
              <Link underline='none' style= {{color: '#FFFFFF' }}   to={''}>Login</Link>
                  </Box>
        </AppBar>
      </Box>
    );
  }
}

export default withStyles({ withTheme: true })(IssuerBar);