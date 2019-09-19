import React, { Component} from 'react';
/*
Screen:LoginScreen
Loginscreen is the main screen which the user is shown on first visit to page and after
hitting logout
*/
/*
Module:Material-UI
Material-UI is used for designing ui of the app
*/

import './../CSS/App.css';

import {withRouter, Link} from "react-router-dom";
import TextField from 'material-ui/TextField';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import axios from 'axios';
import IssuerBar from "./../components/IssuerBar";
import * as Constants from "./../Constants";
import * as Utils from "./../Utils";
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import CloseIcon from '@material-ui/icons/Close';
import AddIcon from '@material-ui/icons/Add';
import ArrowBackRounded from '@material-ui/icons/ArrowBackRounded';
import {createMuiTheme,  makeStyles} from '@material-ui/core/styles';
import InputBase from '@material-ui/core/InputBase';
import Box from '@material-ui/core/Box'
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Container from '@material-ui/core/Container'
import AcceptIcon from '@material-ui/icons/Done'
import CUSTOMPAGINATIONACTIONSTABLE from "./../components/tablepagination.js"
import Footer from "./../components/footer"




const apiBaseUrl = Constants.apiBaseUrl;


//var apiBaseUrl = ""REPLACE"";
//var apiBaseUrl = ""REPLACE"";

/*
Module:superagent
superagent is used to handle post/get requests to server
*/
//var request = require('superagent');



function CredentialTable(props) {
    return(
    <div className="grid">
      <Grid item xs={12}  >
            {props.this.state.credentialRequests}
      </Grid>
    </div>
    );
  }


class addASchemaScreen extends Component {
  constructor(props){
    super(props);
    Utils.checkLogin(this)
console.log(props.location.state.citizen)
    this.state={ 
        citizen: props.location.state.citizen,
        myDid: props.location.state.citizen.did,
        ownDid: '',
        connectionState: 'notConnected',
        credentialOffers: '',
        credentialRequests: '',
        credentialRequestsOld:  <CUSTOMPAGINATIONACTIONSTABLE data={[]} showAttr={[]}/>,
        theirDid: '',
    }
  }

  componentDidMount(){
      this.getWallet()
      this.getTheirDid()
      this.getConnectionStatus()
      this.getCredentialOffers()
      this.getCredentialRequests()
  }



  async getWallet(){
    var self = this;
    var headers = {
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem("token") 
    }
    axios.get(apiBaseUrl + "wallet/default" , {headers: headers}).then((response) => {
      console.log(response)
      if(response.status === 200){
          this.setState({ownDid: response.data.ownDid})
      }
    }).catch((error)=> {
        console.log(error)
    })
  }


  async getTheirDid(){
    let self = this
    var headers = {
    'Content-Type': 'application/json',
    'Authorization': localStorage.getItem("token")
  }
  
      axios.get(apiBaseUrl + 'connection/' + self.state.myDid ,{headers: headers}).then(function (response) {
        if (response.status === 200) {
            self.state.theirDid = response.data.theirDid
        }
      }).catch(function (error) {
      //alert(error);
      //alert(JSON.stringify(payload))
      console.log(error);
      });
  }

  // get all CredentialOffers and retrieve those that belong to the citzien
  async getCredentialOffers(){
    let self = this
    var headers = {
    'Content-Type': 'application/json',
    'Authorization': localStorage.getItem("token")
  }
  
      axios.get(apiBaseUrl + 'credentialoffer/' ,{headers: headers}).then(function (response) {
        if (response.status === 200) {
            let allCredOffer = response.data
            console.log(response.data)
            let credentialOffers = allCredOffer.filter(credOffer => credOffer.senderDid === self.state.myDid)
            self.setState(credentialOffers)
        }
      }).catch(function (error) {
      //alert(error);
      //alert(JSON.stringify(payload))
      console.log(error);
      });
  }

// get all CredentialRequests and retrieve those that belong to the citzien

  getConnectionStatus(){
    var self = this;
    if(self.state.myDid === null) {
        self.state.connectionState = 'notConnected'
    }
    else{
        self.state.connectionState = 'connected'
    }
  }

  async getCredentialRequests(){
    var self = this;
    var headers = {
     'Content-Type': 'application/json',
     'Authorization': localStorage.getItem("token") 
    }
    await axios.get(apiBaseUrl + 'credentialrequest/' , {headers: headers}).then(function (response) {
       console.log(response);
       console.log(response.status);
       if (response.status === 200) {
         
      /*   let data = response.data.sort(Utils.compareDates).map((credReq) => {
           //const {credentialValues} = self.state;
           credReq.meta.offer.key_correctness_proof.xr_cap.filter((elem => elem[0] !== "master_secret"))       
         }) */
        let allCredReq = response.data
        let credentialRequests = allCredReq.filter(credReq => credReq.senderDid === self.state.theirDid)

        let credReqs = <CUSTOMPAGINATIONACTIONSTABLE 
        onEdit={(event, selected) => self.handleEdit(event, selected)} 
        data={response.data} 
        showAttr={["meta.recipientDid","senderDid", "id"]}
        rowFunctions={[
         { 
           rowFunction: function (selected){self.sendCredentials(selected)},
          rowFunctionName : 'accept and send',
          rowFunctionIcon : <AcceptIcon />
         }
        ]}/>
        
        self.setState({credentialRequests: credReqs})
       }
     }).catch(function (error) {
     //alert(error);
     console.log(error);
   })}


   handleEdit(event, selected){ //Fuction 
    this.setState({ selected: selected}); 
  } 
  
  
  sendCredentials(selected){
  
    this.props.history.push({
      pathname: '/sendCredentials',
      state: { credReq: selected}
      })
  }
  
  handleTabChange(newTab){
    this.props.onTabChange(newTab)
  }


  render() {
      let dateOfBirth = new Date(this.state.citizen.dateOfBirth)
      let year = dateOfBirth.getFullYear()
      let month= dateOfBirth.getMonth() + 1
      let day = dateOfBirth.getDate()
    return (
      <MuiThemeProvider>
        <div className='App'>
        <IssuerBar onTabChange={(newTab) => this.handleTabChange(newTab)} tabNr={this.props.tabNr}/>
        <div className="grid">
        <Box position='relative'> 
        <Container maxWidth='false' className="tableContainer">
     
    <Grid container   
         direction="row"
         justify='space-evenly'
         spacing={4}
         xs={12} style={{margin:"auto"}}>
        <Grid item xs={12}>
            <Typography variant="h5">
               Citizen  {this.state.citizen.firstName} {this.state.citizen.familyName}
            </Typography>    
        </Grid>
    <Grid item container xs={12}
          justify='center'
          component={Paper}
          >
         <Grid item xs={12}>
            <Typography variant="h6">
               Attributes 
            </Typography>    
         </Grid>
        
          <Grid item container xs={3} justify='center'   >
              
                <Grid  item xs={6} >
                    <Typography align='left'> personal identifier:  {this.state.citizen.id}</Typography>
                    <Typography align='left'> first name: {this.state.citizen.firstName}</Typography>
                    <Typography align='left'> family name:  {this.state.citizen.familyName}</Typography>
                    <Typography align='left'> date of birth:  {day + "." + month + "." + year}</Typography>
                    <Typography align='left'> place of birth:  {this.state.citizen.placeOfBirth}</Typography>
                    <Typography align='left'> adress:  {this.state.citizen.adress}</Typography>
                    <Typography align='left'> gender:  {this.state.citizen.gender}</Typography>
                </Grid>
              
          </Grid>

          <Grid item container xs={3} justify='center'   >
              <Grid xs={6}>
                    <Typography align='left'> legal ID:  {this.state.citizen.legalId}</Typography>
                    <Typography align='left'> legal name: {this.state.citizen.legalName}</Typography>
                    <Typography align='left'> legal adress:  {this.state.citizen.legalAdress}</Typography>
              </Grid>
          </Grid>

          <Grid item container xs={3} justify='center'   >
              <Grid  xs={6}>
                    <Typography align='left'> vatRegistration:  {this.state.citizen.vatRegistration}</Typography>
                    <Typography align='left'> taxReference: {this.state.citizen.taxReference}</Typography>
                    <Typography align='left'> lei:  {this.state.citizen.lei}</Typography>
                    <Typography align='left'> eori:  {this.state.citizen.eori}</Typography>
                    <Typography align='left'> seed:  {this.state.citizen.seed}</Typography>
                    <Typography align='left'> sic:  {this.state.citizen.sic}</Typography>
              </Grid>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6">
               Credentials 
            </Typography>    
         </Grid>        
         <CredentialTable this={this}/>
    </Grid>



    <Box position="absolute" left='0'>
        <Link  to={"citizens"}>
          <ArrowBackRounded style={{color:'white'}} fontSize="large" />
        </Link>
    </Box>
  </Grid>

  </Container>
  </Box>
  </div>
  <Footer />
        </div>
      </MuiThemeProvider> 
    );
  }
}

export default withRouter(addASchemaScreen);

