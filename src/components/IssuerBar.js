import React, { Component } from 'react';

import './../CSS/App.css';


import { Link} from "react-router-dom";
import Box from '@material-ui/core/Box';
import { withStyles } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import DIMSLogo from'./DIMSLogo';
import AccountIcon from '@material-ui/icons/AccountBox'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button'
import governmentIcon from './../Icons/Government.png';
import bankIcon from './../Icons/Bank.png';
import shopIcon from './../Icons/Shop.png';


var activeTab = 0;

const links=[
  {label: "Database", to: 'db'},
  {label:'Cred. definition',  to:'credentialdef'},
  {label:'Proofs',  to:'proofs'},
  {label:'Schemas', to:'schemas'},
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

roleIcon(){
  switch(localStorage.getItem('role')){
    case 'government':
      return <img height='40' src={governmentIcon} alt="Logo" />
      break;
    case 'bank' :
        return <img height='40' src={bankIcon} alt="Logo" />
        break;
    case 'shop' :
        return <img height='40' src={shopIcon} alt="Logo" />
        break;
    default :
        return <img height='40' src={governmentIcon} alt="Logo" />
        break;
  }
}

showTabs(){
  if(this.props.showTabs === false && this.props.showTabs !== null){
    return(
    <Grid item container xs={10}>
        <Grid item xs={9} />
        <Grid container alignItems='center' item xs={2}> 
                  <Link to={"account"}>
                      {this.roleIcon()}
                  </Link>  
        </Grid>
        <Grid item xs={1} />
        
    </Grid>)
  }
  else{
    return(
      <Grid item container xs={10}>
        <Grid item xs={9}>
        <Tabs
        indicatorColor="#FFFFFF"
        value={this.props.tabNr}
        onChange={this.handleTabChange.bind(this)}
        centered
      >
        {links.map((link, key) => {return (
            <Tab key={key} component={Link} value={key} label={link.label} to={link.to}/>
        )})}
          </Tabs>
          </Grid>
          <Grid container alignItems='center' item xs={2}> 
                  <Link to={"account"}>
                      {this.roleIcon()}
                  </Link>  
          </Grid>
          <Grid item container alignItems='center' xs={1} >
            <Button  color="primary" style={{color:'white'}} onClick={(event) => this.handleLogout(event)}>Logout</Button>
          </Grid>
      </Grid>

  )
  }
}

handleLogout(event){
  // console.log("logout event fired",this.props);
  localStorage.clear();
  this.props.parentContext.props.history.push("/");
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

              {this.showTabs()}
            </Grid>
            </Container>
        </Box>
      </div>
    );
  }
}

export default withStyles({ withTheme: true })(IssuerBar);