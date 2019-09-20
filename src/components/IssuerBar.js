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
  {label: "Citizens", to: 'citizens'},
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
      <div className="grid">
               <Box position='relative'>
              <Container  maxWidth='false' >
        <Grid container xs={12}  
              direction="row"
              justify="center"
              alignItems="center">
            <Grid xs={2} item  >
              <DIMSLogo />
            </Grid>
            <Grid item xs={8}>
              <Tabs
                value={this.props.tabNr}
                onChange={this.handleTabChange.bind(this)}
                centered
              >
                {links.map((link, key) => {return (
                    <Tab key={key} component={Link} value={key} label={link.label} to={link.to}/>
                )})}
                  </Tabs>
            </Grid>
            <Grid item xs={1}> 
                <Link to={"account"}>
                   < AccountIcon style={{color:'white'}} fontSize='large'/>
                </Link>  
            </Grid>
            <Grid item xs={1} >
                  <Link underline='none' style= {{color: '#ffffff' }}   to={''}>Login</Link>
            </Grid>
            </Grid>

            </Container>
         
        
        </Box>
      </div>
    );
  }
}

export default withStyles({ withTheme: true })(IssuerBar);