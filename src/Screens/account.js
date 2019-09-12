import React, { Component } from 'react';
/*
Screen:LoginScreen
Loginscreen is the main screen which the user is shown on first visit to page and after
hitting logout
*/
import styles from './../CSS/App.css';
/*
Module:Material-UI
Material-UI is used for designing ui of the app
*/

import {withRouter} from "react-router-dom";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import IssuerBar from "./../components/IssuerBar";
import * as Utils from "./../Utils";
import Box from '@material-ui/core/Box'
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import * as Constants from "./../Constants";
import axios from 'axios';
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'

const apiBaseUrl = Constants.apiBaseUrl;


//var apiBaseUrl = ""REPLACE"";
//var apiBaseUrl = ""REPLACE"";


class newUserScreen extends Component {
  constructor(props){
    super(props);
    Utils.checkLogin(this)
    this.state={
        username:"",
        wallet: ""
    }
  }
  
  componentWillUnmount() {
    clearInterval(this.timer);
    this.timer = null;
  }

  componentDidMount() {
    this.getWallet()
  }

  async getWallet(){
    var self = this;
    var headers = {
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem("token") 
    }
    axios.get(apiBaseUrl + "user/me" , {headers: headers}).then((response) => {
      console.log(response)
      if(response.status === 200){
          this.setState({username: response.data.username, wallet: response.data.wallet})
      }
    }).catch((error)=> {
        console.log(error)
    })
    
  }


   handleTabChange(newTab){
    console.log(newTab)
    this.props.onTabChange(newTab)
  }


  handleLogout(event){
    // console.log("logout event fired",this.props);
    localStorage.clear();
    var self = this;
    self.props.history.push("/");
  }


  render() {
    return (
      <MuiThemeProvider>
        <div className="App">
            <IssuerBar onTabChange={(newTab) => this.handleTabChange(newTab)} tabNr={this.props.tabNr}/>
            <div className={styles.grid}>
            <Grid container  xs={5} md={3} xl={2} style={{margin:"auto"}}
                  justify='center'>
              <Container className='tableContainer'>
              <Typography variant="h6">
                 User
              </Typography>
              <Box position='relative' mt={3}>
                <Grid container justify='center' xs={12}>
                <Grid
                    component= {Paper}
                    item
                    container
                    direction="row"
                    justify="center"
                    spacing={2}
                    xs={12}
                    >
                    <Grid container justify='center' item xs={10}>
                         <Grid item container justify='center' xs={6}>
                            username:
                        </Grid>
                        <Grid item container justify='center' xs={6}>
                            {this.state.username}
                        </Grid>
                    </Grid>
                    <Grid>
                      <Box height='4vh' />
                    </Grid>
                    <Grid container justify='center' item xs={10}>
                         <Grid item container justify='center' xs={6}>
                            wallet:
                        </Grid>
                        <Grid item container justify='center' xs={6}>
                            {this.state.wallet}
                        </Grid>
                    </Grid>

                    </Grid>
                </Grid>
                </Box>
                <Box mt={2}>
                  <Button  color="primary" style={{color:'white'}} onClick={(event) => this.handleLogout(event)}>Logout</Button>
                </Box>
            </Container>
        </Grid>
        </div> 
     </div>
    </MuiThemeProvider>
          
    );
  }
}

export default withRouter(newUserScreen);