import React, { Component, isValidElement} from 'react';
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
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import ArrowBackRounded from '@material-ui/icons/ArrowBackRounded';
import Box from '@material-ui/core/Box'
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container'
import AcceptIcon from '@material-ui/icons/Done'
import Footer from "./../components/footer"
import MoreAttributes from './../components/moreAttributesDialog'
import {Table, TableBody, TableRow, TableCell, TableHead } from '@material-ui/core';
import MoreHoriz from '@material-ui/icons/MoreHoriz';
import Avatar from '@material-ui/core/Avatar';
import Snackbar from './../components/customizedSnackbar'
import Button from '@material-ui/core/Button'

const apiBaseUrl = Constants.apiBaseUrl;
const mongoDBBaseUrl = Constants.mongoDBBaseUrl;

var rawModel ={}

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
                  <TableRow key={index}>
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
                  <TableRow key={index}>
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


  function ProofRequestTable(props) {

    return(
      <Grid item xs={12}  >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell children="pos." />
              <TableCell children="status" />
              <TableCell children="{...}" />
              <TableCell children="verify" />
            </TableRow>
          </TableHead>
        <TableBody>
              {props.this.state.proofRequests.map((req, index) => {
                console.log(req)
                return(
                  <TableRow>
                      <TableCell children={index} />
                      <TableCell children={req.status} />
                      <TableCell children={<MoreAttributes row={req} icon={<MoreHoriz/>} iconText=''/>} />
                      <TableCell children={<Button onClick={(event) => props.this.verifyProofIdClick(event, req.id)}><AcceptIcon /></Button>} />
                  </TableRow>
                )} )}
        </TableBody>
        </Table>
      </Grid>
    );
  }


class PersonScreen extends Component {
  constructor(props){
    super(props);
    console.log(props.location.state.person)
    Utils.checkLogin(this)
if( props.location.hasOwnProperty("state") && props.location.state !== undefined){
    this.state={ 
        person: props.location.state.person,
        myDid: props.location.state.person.did,
        ownDid: '',
        connectionState: 'notConnected',
        credentialOffers: '',
        credentialRequests: [],
        issuedCredentials:[],
        theirDid: '',
        proofRequests: [],
        proofId: "",
        connection: '',
        model: {},
        modelName: props.location.state.modelName,
        justSentCredentialOffer: props.location.state.hasOwnProperty("justSentCredentialOffer") ? props.location.state.justSentCredentialOffer : false
    }
  }
    else{
      this.state={ 
        person: props.location.state.person,
        myDid: props.location.state.person.did,
        ownDid: '',
        connectionState: 'notConnected',
        credentialOffers: '',
        credentialRequests: [],
        issuedCredentials:[],
        theirDid: '',
        proofRequests: [],
        proofId: "",
        connection: '',
        model:  {},
        justSentCredentialOffer: false,
        modelName: "",
        picture: ""
    }
    }
  }

  componentDidMount(){
    document.title = "DIMS"

    this.getModel()
      this.getWallet()
      this.getTheirDid()
      this.initPerson()
      this.getConnectionStatus()
      this.getCredentialOffers()
      this.getCredentialRequests()
      this.getConnectionDetails()
      this.getIssuedCredentials()
      this.getProofRequests()
      if(this.state.justSentCredentialOffer === true){
        this.setState({snackbarVariant: "sent", snackbarOpen: true, snackbarMessage: "credential offer sent"});
        this.forceUpdate()
      }
      this.timer = setInterval(() => {
        this.getCredentialRequests()
        this.getIssuedCredentials()
        this.getProofRequests()
        }, 5000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
    this.timer = null;

  }



async getModel(event){
  var self = this;
  var model ={};
  var headers = {
    'Content-Type': 'application/json',
    'Authorization': localStorage.getItem("token") 
  }
  await axios.get(mongoDBBaseUrl + "models" , {headers}).then(function (response) {
    console.log(self.state.modelName)

          if (response.status === 200) {
              for(let model_name in response.data){
         
                  if(model_name === self.state.modelName){
                      rawModel = response.data[model_name]
                      for(let attr in rawModel){
                        
                        if(attr !== 'createdAt' && attr !== 'updatedAt' && attr !== 'did' && attr !== 'meta' && attr!== 'picture'){
                          model[attr] = rawModel[attr]
                        }
                      }
                  }
              }
              self.setState({model} )      
          }
      }).catch(function (error) {
      console.log(error);
  });
}   


initPerson(){
  console.log(this.state.person)
  let person= {}
  for(let attr in this.state.person){
    console.log(attr)
    if(attr == 'picture')
      this.setState({picture: this.state.person[attr]})
          if(attr !== 'createdAt' && attr !== 'updatedAt' && attr !== 'did' && attr !== 'meta' && attr!== 'picture'){
            person[attr] = this.state.person[attr]
          }
        }
    this.setState({person})
}


  async getWallet(){
    var self = this;
    var headers = {
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem("token") 
    }
    axios.get(apiBaseUrl + "wallet/default" , {headers: headers}).then((response) => {
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


async verifyProof(){
  var self = this;
   var headers = {
    'Content-Type': 'application/json',
    'Authorization': localStorage.getItem("token") 
   }
   console.log(self.state.proofId)
   await axios.get(apiBaseUrl + 'proof/' + self.state.proofId , {headers: headers}).then(function (response) {
      console.log(response);
      console.log(response.status);
      if (response.status === 200) {
        let proof = response.data
        console.log(proof)
        if(typeof(proof.isValid) == 'undefined'){
          alert("Verification failed. Please try again!")
        } else {
          let isValid = proof.isValid ? "is" : "is not"
          alert("Proof " + isValid + " valid!")
          if(isValid) self.storeProofDataInDB(response.data.proof.requested_proof.revealed_attrs)
          
      }
      }
    }).catch(function (error) {
    console.log(error);
  })
  }

  verifyProofIdClick(event,id){
    this.setState({proofId: id}, () => this.verifyProof())
    
  }
  

  async storeProofDataInDB(revealed_attrs){

    var self = this;
    var headers = {
     'Content-Type': 'application/json',
     'Authorization': localStorage.getItem("token") 
    }

    let person_payload={meta: {},
                        firstname: " ",
                        lastname: " "}
    

    Object.keys(revealed_attrs).map((attr)=> {
      let newAttrName = attr.replace("_referent", "")
      person_payload.meta[newAttrName] = revealed_attrs[attr].raw
    })


    Object.keys(person_payload.meta).map((attr) => {
      if(attr == "firstname")
        person_payload.firstname = person_payload.meta[attr]
      else if(attr == "lastname")
        person_payload.lastname = person_payload.meta[attr]
    })

    console.log(person_payload)


    await axios.put(mongoDBBaseUrl  + self.props.location.state.modelName + '/' + self.state.person.id, person_payload, {headers}).then(function (response) {
      if (response.status === 200) {
      }
    }).catch(function (error) {
    console.log(error);
    });

  }


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
       if (response.status === 200) {
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
       if (response.status === 200) {
        let allIssuedCred = response.data
        let issuedCredentials = allIssuedCred.filter(cred => cred.recipientDid === self.state.theirDid)
        self.setState({issuedCredentials})
       }
     }).catch(function (error) {
     //alert(error);
     console.log(error);
   })}

   async getProofRequests(){
    var self = this;
    var headers = {
     'Content-Type': 'application/json',
     'Authorization': localStorage.getItem("token") 
    }
    await axios.get(apiBaseUrl + 'proof/' , {headers: headers}).then(function (response) {
       if (response.status === 200) {
        let allProofRequests = response.data
        let proofRequests = allProofRequests.filter(req => req.did === self.state.theirDid)
        self.setState({proofRequests})
       }
     }).catch(function (error) {
     console.log(error);
   })}


   handleEdit(event, selected){ //Fuction 
    this.setState({ selected: selected}); 
  } 
  
  
  sendCredentials(credReq){
  
    this.props.history.push({
      pathname: '/sendCredentials',
      state: { credReq: credReq,
              person: this.state.person,
              modelName: this.state.modelName}
      })
  }
  
  handleTabChange(newTab){
    this.props.onTabChange(newTab)
  }





  getAttributeValue(model, person){
    var component = []
    var keys = Object.keys(model)
    for (let key of keys){
      console.log(model[key])

      if(model[key].hasOwnProperty('type')) {
        if(person[key]!== undefined){
          if(model[key].type === 'Date'){
            component.push(
              <Grid item container xs={12}>
                <Grid item container style={{backgroundColor:'WhiteSmoke'}}>
                  <Grid item xs={6}>
                    <Typography>{key}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>{this.toDate(person[key])}</Typography>
                  </Grid>
                </Grid>
              </Grid>
            )
          }
          else{
            component.push(
              <Grid item container xs={12}>
                <Grid item container style={{backgroundColor:'WhiteSmoke'}}>
                  <Grid item xs={6}>
                    <Typography>{key}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>{person[key]}</Typography>
                  </Grid>
                </Grid>
              </Grid>
            )
          }

        }
        else{
          component.push(
            <Grid item container xs={12}>
              <Grid item container xs={12} style={{backgroundColor:'WhiteSmoke'}}>
                <Grid item xs={6}>
                  <Typography>{key}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography></Typography>
                </Grid>
              </Grid>
            </Grid>
          )
        } 
      }
      else{
        component.push(<Grid item container xs={12}>
                          <Grid item container xs={12} style={{backgroundColor: 'lightgrey'}}>
                            <Grid item xs={12}>
                              <Typography>{key}</Typography>
                            </Grid>
                            <Grid item xs={12}>
                              
                                {this.getAttributeValue(model[key], person[key])}
                            
                            </Grid>
                          </Grid>
                      </Grid>)
      }
    }
    return component
} 

  toDate(wrongDateFormat){
   console.log(wrongDateFormat)
    let year = wrongDateFormat.slice(0,4)
    let month= wrongDateFormat.slice(5,7)
    let day = wrongDateFormat.slice(8,10)
    return( month + "." + day + "." + year
            )
   }


  render() {

    let pictureAvatar
      if(this.state.person.picture !== ""){
        let base64Img = this.state.picture
        pictureAvatar = <Avatar src={base64Img} style={avatarImageStyle}/>
      } else {
        pictureAvatar  = <Avatar>A</Avatar>
      }
    return (
      <MuiThemeProvider>
        <div className='App'>
        <IssuerBar onTabChange={(newTab) => this.handleTabChange(newTab)} tabNr={this.props.tabNr} parentContext={this}/>
        <div className="grid">

        <Container maxWidth='false' className="tableContainer">
        <Box> 
    <Grid container   
         direction="row"
         justify='space-evenly'
         spacing={4}
         xs={12} style={{margin:"auto"}}>
        <Grid item container spacing={0} xs={12}>
          <Grid item xs={1}>
              <Link  to={"db"}>
                   <ArrowBackRounded style={{color:'white'}} fontSize="large" />
              </Link>  
          </Grid>
          <Grid item xs={10}>
            <Typography variant="h5">
               {this.props.location.state.modelName.slice(0, this.props.location.state.modelName.length-1 )}
            </Typography> 
          </Grid>   
        </Grid>
        <Grid item xs={12} />
      <Grid item container xs={12}
            justify='center'
            component={Paper}
            spacing={8}
          >
          {pictureAvatar}

         <Grid item container xs={12} justify='center'>
            
          <Grid container 
              item xs={6}
              justify='center'
              spacing={2}>
             <Box component={Grid} item container border='solid' spacing={2}>
                <Grid item xs={12}>
                  <Typography variant='h5'>Person</Typography>
                </Grid>
                {this.getAttributeValue(this.state.model, this.state.person)}   
              </Box>  
                              
              
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

          <Grid item container xs={12} justify='center'>
            <Grid item xs={12}>
              <Typography variant="h6">
                ProofRequests
              </Typography>   
            </Grid> 
            <Grid item xs={6} >
              <ProofRequestTable this={this}/>
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

export default withRouter(PersonScreen);

