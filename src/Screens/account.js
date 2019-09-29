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
import ThemeProvider, { __esModule } from '@material-ui/styles/ThemeProvider';
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
    console.log(props)
    super(props);
    Utils.checkLogin(this)
    this.state={
        username:"",
        wallet: "",
        theme: "",
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
      <ThemeProvider>
           
        <div className="App">
        
            <IssuerBar onTabChange={(newTab) => this.handleTabChange(newTab)} tabNr={this.props.tabNr}/>
            <div className={styles.grid}>              
            <Box position='relative' mt={3} width='100%'>
              <Container  maxWidth='false' className='tableContainer'>
              <Grid container spacing={4} xs={12}  style={{margin:"auto"}}
                  justify='center' spacing={4}>
                    <Grid item xs={12} justify='center'>
                          <Typography  variant="h5">
                            User
                          </Typography>
                   </Grid>
                <Grid item xs={12} />
                <Grid
                    component= {Paper}
                    item
                    container
                    direction="row"
                    justify="center"
                    spacing={8}
                    xs={12}
                    >
                    <Grid  justify='center' item xs={10}>
                         username:  
                         <Typography color='primary'> {this.state.username} </Typography>
                    </Grid>
                    <Grid item justify='center' item xs={10}>
                        wallet:  
                        <Typography color='primary'> {this.state.wallet} </Typography>
                    </Grid>
                    </Grid>
                    <Grid item xs={12} />
                <Grid container item xs={12} justify='center'>
                  <Grid item xs={4}>
                  <Button  color="primary" style={{color:'white'}} onClick={(event) => this.handleLogout(event)}>Logout</Button>
                  </Grid>
                </Grid>
                </Grid>

    
            </Container>
            </Box>
        </div> 
     </div>
    </ThemeProvider>
          
    );
  }
}

export default withRouter(newUserScreen);