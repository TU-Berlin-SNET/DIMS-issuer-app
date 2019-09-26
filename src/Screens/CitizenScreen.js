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
import MoreAttributes from './../components/moreAttributesDialog'
import {Table, TableBody, TableRow, TableCell, TableHead } from '@material-ui/core';
import MoreHoriz from '@material-ui/icons/MoreHoriz';
import Avatar from '@material-ui/core/Avatar';
import Snackbar from './../components/customizedSnackbar'


const apiBaseUrl = Constants.apiBaseUrl;


//var apiBaseUrl = ""REPLACE"";
//var apiBaseUrl = ""REPLACE"";

/*
Module:superagent
superagent is used to handle post/get requests to server
*/
//var request = require('superagent');
const avatarImageStyle = {
  width: 200,
  height: 200,
};

function CredentialRequestsTable(props) {
    return(
      <Grid item xs={12}  >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell children="Nr." />
              <TableCell children="Credential Definiton ID" />
              <TableCell children="JSON" />
              <TableCell children="Send Credential" />
            </TableRow>
          </TableHead>
        <TableBody>
              {props.this.state.credentialRequests.map((credentialReq, index) => {
                return(
                  <TableRow>
                      <TableCell children={index}/>
                      <TableCell children={credentialReq.meta.offer.cred_def_id}/>
                      <TableCell children={<MoreAttributes row={credentialReq} icon={<MoreHoriz/>} iconText=''/>} />
                      <TableCell children={<IconButton onClick={()=>props.this.sendCredentials(credentialReq)}><AcceptIcon /></IconButton> } />
                  </TableRow>
                )} )}
        </TableBody>
        </Table>
      </Grid>
    );
  }

  function IssuedCredentialTable(props) {
    return(
      <Grid item xs={12}  >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell children="Nr." />
              <TableCell children="Credential Definiton ID" />
              <TableCell children="JSON" />
            </TableRow>
          </TableHead>
        <TableBody>
              {props.this.state.issuedCredentials.map((cred, index) => {
                return(
                  <TableRow>
                      <TableCell children={index}/>
                      <TableCell children={cred.message.message.cred_def_id}/>
                      <TableCell children={<MoreAttributes row={cred} icon={<MoreHoriz/>} iconText=''/>} />
                  </TableRow>
                )} )}
        </TableBody>
        </Table>
      </Grid>
    );
  }


class addASchemaScreen extends Component {
  constructor(props){
    super(props);
    Utils.checkLogin(this)
console.log(props.location.state.citizen)
if( props.location.hasOwnProperty("state") && props.location.state !== undefined){
    this.state={ 
        citizen: props.location.state.citizen,
        myDid: props.location.state.citizen.did,
        ownDid: '',
        connectionState: 'notConnected',
        credentialOffers: '',
        credentialRequests: [],
        issuedCredentials:[],
        theirDid: '',
        connection: '',
        justSentCredentialOffer: props.location.state.hasOwnProperty("justSentCredentialOffer") ? props.location.state.justSentCredentialOffer : false,
    }
    }
    else{
      this.state={ 
        citizen: props.location.state.citizen,
        myDid: props.location.state.citizen.did,
        ownDid: '',
        connectionState: 'notConnected',
        credentialOffers: '',
        credentialRequests: [],
        issuedCredentials:[],
        theirDid: '',
        connection: '',
        justSentCredentialOffer: false,
    }
    }
  }

  componentDidMount(){
      this.getWallet()
      this.getTheirDid()
      this.getConnectionStatus()
      this.getCredentialOffers()
      this.getCredentialRequests()
      this.getConnectionDetails()
      this.getIssuedCredentials()
      if(this.state.justSentCredentialOffer === true){
        this.setState({snackbarVariant: "sent", snackbarOpen: true, snackbarMessage: "credential offer sent"});
        this.forceUpdate()
      }
      this.timer = setInterval(() => {
        this.getCredentialRequests()
        this.getIssuedCredentials()
        }, 5000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
    this.timer = null;
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

  async getConnectionDetails(){
    var self = this;
    var headers = {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem("token")
    }
   
    await axios.get(apiBaseUrl + "wallet/default/connection", {headers: headers}).then(function(response){
        if (response.status === 200) {
         console.log(response)
         let connection = response.data.filter(connection => connection.my_did === self.state.myDid) 
         
         self.setState({connection})
        }
      }).catch(function (error) {
      console.log(error);
      });
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
       console.log(self.state.theirDid)
       console.log(response.status);
       if (response.status === 200) {
         
      /*   let data = response.data.sort(Utils.compareDates).map((credReq) => {
           //const {credentialValues} = self.state;
           credReq.meta.offer.key_correctness_proof.xr_cap.filter((elem => elem[0] !== "master_secret"))       
         }) */
        let allCredReq = response.data
        let credentialRequests = allCredReq.filter(credReq => credReq.senderDid === self.state.theirDid)
        self.setState({credentialRequests: credentialRequests})
       }
     }).catch(function (error) {
     //alert(error);
     console.log(error);
   })}

   async getIssuedCredentials(){
    var self = this;
    var headers = {
     'Content-Type': 'application/json',
     'Authorization': localStorage.getItem("token") 
    }
    await axios.get(apiBaseUrl + 'credential/' , {headers: headers}).then(function (response) {

       console.log(response.status);
       if (response.status === 200) {
         
      /*   let data = response.data.sort(Utils.compareDates).map((credReq) => {
           //const {credentialValues} = self.state;
           credReq.meta.offer.key_correctness_proof.xr_cap.filter((elem => elem[0] !== "master_secret"))       
         }) */
        let allIssuedCred = response.data
        let issuedCredentials = allIssuedCred.filter(cred => cred.recipientDid === self.state.theirDid)
        self.setState({issuedCredentials})
       }
     }).catch(function (error) {
     //alert(error);
     console.log(error);
   })}


   handleEdit(event, selected){ //Fuction 
    this.setState({ selected: selected}); 
  } 
  
  
  sendCredentials(credReq){
  
    this.props.history.push({
      pathname: '/sendCredentials',
      state: { credReq: credReq}
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
      
    let pictureAvatar = <Avatar>{this.state.citizen.firstName[0]}</Avatar>
      if(this.state.citizen.hasOwnProperty('picture') && this.state.citizen.picture !== ""){
        let base64Img = this.state.citizen['picture']
        pictureAvatar = <Avatar src={base64Img} style={avatarImageStyle}/>
      } else {
        pictureAvatar  = null
      }
    return (
      <MuiThemeProvider>
        <div className='App'>
        <IssuerBar onTabChange={(newTab) => this.handleTabChange(newTab)} tabNr={this.props.tabNr}/>
        <div className="grid">

        <Container maxWidth='false' className="tableContainer">
        <Box> 
    <Grid container   
         direction="row"
         justify='space-evenly'
         spacing={4}
         xs={12} style={{margin:"auto"}}>
        <Grid item xs={12}>
          <Box position='relative'>
            <Box position="absolute" top={0} left={0}>
                <Link  to={"citizens"}>
                   <ArrowBackRounded style={{color:'white'}} fontSize="large" />
                </Link>  
            </Box>
            <Typography variant="h5">
               Citizen  {this.state.citizen.firstName} {this.state.citizen.familyName}
            </Typography> 
            </Box>   
        </Grid>
        <Grid item xs={12} />
      <Grid item container xs={12}
            justify='center'
            component={Paper}
            spacing={8}
          >
          {pictureAvatar}
         <Grid item xs={12}>
            <Typography variant="h6">
               Attributes 
            </Typography>    
         </Grid>
         <Grid item container xs={8}>
          <Grid item container xs={4} justify='center'   >
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

          <Grid item container xs={4} justify='center'   >
              <Grid xs={6}>
                    <Typography align='left'> legal ID:  {this.state.citizen.legalId}</Typography>
                    <Typography align='left'> legal name: {this.state.citizen.legalName}</Typography>
                    <Typography align='left'> legal adress:  {this.state.citizen.legalAdress}</Typography>
              </Grid>
          </Grid>

          <Grid item container xs={4} justify='center'   >
              <Grid  xs={6}>
                    <Typography align='left'> vatRegistration:  {this.state.citizen.vatRegistration}</Typography>
                    <Typography align='left'> taxReference: {this.state.citizen.taxReference}</Typography>
                    <Typography align='left'> lei:  {this.state.citizen.lei}</Typography>
                    <Typography align='left'> eori:  {this.state.citizen.eori}</Typography>
                    <Typography align='left'> seed:  {this.state.citizen.seed}</Typography>
                    <Typography align='left'> sic:  {this.state.citizen.sic}</Typography>
              </Grid>
          </Grid>
          </Grid>
          <Grid item container xs={12} justify='center'>
            <Grid item xs={12}>
              <Typography variant="h6">
                Credential Requests
              </Typography>   
            </Grid> 
            <Grid item xs={6} >
              <CredentialRequestsTable this={this}/>
            </Grid>
         </Grid>

          <Grid item container xs={12} justify='center'>
            <Grid item xs={12}>
              <Typography variant="h6">
                Issued Credentials 
              </Typography>   
            </Grid> 
            <Grid item xs={6} >
              <IssuedCredentialTable this={this}/>
            </Grid>
         </Grid>      


         <Grid container item xs={12} justify='center'>
          <Grid container item xs={6} justify='center'>
           <MoreAttributes row={this.state.connection} iconText='Connection Information'/> 
              </Grid>
         </Grid>
    </Grid>
    <Grid item  xs={12} />
  
  </Grid>
  </Box>
  </Container>

  </div>
  <Footer />
  <Snackbar message={this.state.snackbarMessage}
                  variant={this.state.snackbarVariant} 
                  snackbarOpen={this.state.snackbarOpen} 
                  closeSnackbar={() => this.setState({snackbarOpen: false})} 
        />
    </div>
  </MuiThemeProvider> 
    );
  }
}

export default withRouter(addASchemaScreen);

