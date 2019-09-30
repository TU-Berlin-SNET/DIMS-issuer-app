import React, { Component } from 'react';

import './../CSS/App.css';


import { Link} from "react-router-dom";
import Box from '@material-ui/core/Box';
import { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button'
import { palette } from '@material-ui/system';

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
        <Box   width="100%" position='fixed' zIndex='-1' bottom='0'>         
              <Container  maxWidth='false' >
                  <Box height='4vh' >
                    <Grid container justify='flex-end'>
                      <Button style={{color: 'white'}} component={Link} to={'about'}>Information</Button>
                    </Grid>
                  </Box>
            </Container>
        </Box>
    );
  }
}

export default withStyles({ withTheme: true })(Footer);