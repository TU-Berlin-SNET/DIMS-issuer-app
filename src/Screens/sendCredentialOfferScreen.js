import React, { Component } from 'react';
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
import Button from '@material-ui/core/Button';
import {withRouter, Link} from "react-router-dom";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import axios from 'axios';
import Select from '@material-ui/core/Select';
import IssuerBar from "./../components/IssuerBar";
import * as Constants from "./../Constants";
import * as Utils from "./../Utils";
import CUSTOMPAGINATIONACTIONSTABLE from "./../components/tablepagination.js"
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper'
import MenuItem from '@material-ui/core/MenuItem'
import Divider from '@material-ui/core/Divider'
import Footer from "./../components/footer"
import Chip from '@material-ui/core/Chip';
import ArrowBackRounded from '@material-ui/icons/ArrowBackRounded';
import Checkbox from '@material-ui/core/Checkbox';
import Snackbar from './../components/customizedSnackbar';



const apiBaseUrl = Constants.apiBaseUrl;
const kindOfPerson = localStorage.getItem('kindOfPerson')


//var apiBaseUrl = ""REPLACE"";
//var apiBaseUrl = ""REPLACE"";




class CredentialOfferScreen extends Component {

    constructor(props){
        super(props);
      console.log(props.location.state)
        Utils.checkLogin(this)
        if(props.location.hasOwnProperty("state") && props.location.state !== undefined){
        this.state={
          credDef: {attributes: [],
            value: "",
            label: ""},
          recipientDid: props.location.state.hasOwnProperty("recipientDid") ? props.location.state.recipientDid : "",
          credDefId: props.location.state.hasOwnProperty("credDefId")  ? props.location.state.credDefId: [],
          credentialDefinitions: [],
          myDid: props.location.state.myDid,
          sendCredentialCheck: true,
          person_id: props.location.state.person_id,
          person: null,
          snackbarOpen: false,
          snackbarMessage: "",
          snackbarVariant: "sent",
          justOnboarded: props.location.state.hasOwnProperty("justOnboarded") ? props.location.state.justOnboarded : false,

        }
      } else {
        this.state={
          recipientDid: "",
          credDef: {attributes: [],
                    value: "",
                    label: ""},
          credentialDefinitions: [],
          selected: "",
          myDid: props.location.state.myDid,
          sendCredentialCheck: true,
          person: null,
          snackbarOpen: false,
          snackbarMessage: "",
          snackbarVariant: "sent",
          justOnboarded: false,
        }
      }
    }


    async getPerson(person_id){
      let self = this
      let person = null
     var headers = {
       'Content-Type': 'application/json',
       'Authorization': localStorage.getItem("token") 
     }
     await axios.get(Constants.mongoDBBaseUrl + kindOfPerson + "?id=" + person_id, {headers}).then(function (response) {
       console.log(response);
       if (response.status === 200) {
         person = response.data[0]
         self.setState({person: person})
       }
     }).catch(function (error) {
       //alert(error);
       console.log(error);
     });
     return(person)
   }

/* POST /api/credentialoffer
 {
	"recipientDid": "{{prover_issuer_pairwise_did}}",
	"credDefId": "{{cred_def_id}}"
}
*/
async sendCredentialOffer(){
  var self = this
 var headers = {
  'Content-Type': 'application/json',
  'Authorization': localStorage.getItem("token") 
 }
 var payload = {
   'recipientDid': self.state.recipientDid,
   'credDefId': self.state.credDef.value
}
 await axios.post(apiBaseUrl + 'credentialoffer' ,payload, {headers}).then(function (response) {
  if (response.status === 201) {
    if(self.state.sendCredentialCheck === true){
      self.getPerson(self.state.person_id).then((person) =>
      {
        self.props.history.push({
          pathname: '/person',
          state: { person: person,
                   justSentCredentialOffer: true,
                }
        })
      })
    }
    else{
      self.props.history.push({
        pathname: '/db',
        state: { justSentCredentialOffer: true}
      })
    }
  }
}).catch(function (error) {
console.log(error);
});

}

async listCredDefs(){
  var self = this;
  var headers = {
    'Authorization': localStorage.getItem("token")
  }
  await axios.get(apiBaseUrl + "credentialdef/", {headers: headers}).then(function (response) {
    if (response.status === 200) {
      let credDefs = response.data.map((credDef) => {
    console.log(response.data)
        let attributes = Object.keys(credDef.data.value.primary.r).filter(elem => elem !== 'master_secret')

        return(
          {label: credDef.data.tag, value: credDef.credDefId, attributes: attributes}
        )
      } )
      self.setState({credentialDefinitions: credDefs})
    }
  }).catch(function (error) {
    //alert(error);
    console.log(error);
  });
}



componentDidMount(){
  document.title = "issuer app"
  this.listCredDefs()
  this.getTheirDid()
  if(this.state.justOnboarded === true){
    this.setState({snackbarVariant: "sent", snackbarOpen: true, snackbarMessage: "connection to " + kindOfPerson + " established"});
    this.forceUpdate()
  }
  this.timer = setInterval(() => {
    this.listCredDefs()}, 5000
    );
}

componentWillUnmount() {
  clearInterval(this.timer);
  this.timer = null;
}

sendCredentialOfferClick(){
  this.sendCredentialOffer()
}

handleEdit(event, selected){ //Fuction 
  this.setState({ selected: selected}); 
} 

handleTabChange(newTab){
  this.props.onTabChange(newTab)
}

getTheirDid(){
  let self = this
  var headers = {
  'Content-Type': 'application/json',
  'Authorization': localStorage.getItem("token")
}

    axios.get(apiBaseUrl + 'connection/' + self.state.myDid ,{headers: headers}).then(function (response) {
      console.log(response)
      if (response.status === 200) {
          self.state.recipientDid = response.data.theirDid
      }
    }).catch(function (error) {
    //alert(error);
    //alert(JSON.stringify(payload))
    console.log(error);
    });
}

currentAttribute(attr, index){
  return( 
    <Grid item  xs={3}>
        <Chip
        label={attr.replace("_referent","").replace(/_/g, " ")}
        variant="outlined"
        className="chip"
        />
    </Grid>
  )
}

handleCredentialSendCheckChange =  event => {
  this.setState({sendCredentialCheck: event.target.checked});
};


render() {
  return(
    <MuiThemeProvider>
    <div className="App">
    <IssuerBar onTabChange={(newTab) => this.handleTabChange(newTab)} tabNr={this.props.tabNr}/>
      
          <div className="SendCredentialOffer">


      </div>
<div className= 'grid'>



    <Container maxWidth='false' className='tableContainer'>
      <Box>
      <Grid container   
      direction="row"
      justify='center'
      spacing={4}
      xs={12} style={{margin:"auto"}}>
        <Grid item xs={12}>
          <Box position='relative'>
            <Box position="absolute" top={0} left={0}>
                <Link  to={"db"}>
                  <ArrowBackRounded style={{color:'white'}} fontSize="large" />
                </Link>  
            </Box>
            <Typography variant="h5">
              Send Credential Offer
            </Typography> 
            </Box>   
        </Grid>

            <Grid
                item
                component= {Paper}
                container
                justify="center"
                spacing={8}
                xs={12}
                style={{margin:'auto'}}
                >

                <Grid item container xs={8} justify='flex-start'>
                  <Grid item xs={6}>
                   Select Credential Definition:  
                   </Grid>  
                    <Grid item xs={6} container justify='flex-start'> 
                        <Grid item xs={2}>
                            <Select value={this.state.credDef.value}
                            style={{width: '400px'}}
            
                            renderValue={() => this.state.credDef.value}
                                onChange={(event) => this.setState({credDef: event.target.value})}
                            >
                              {this.state.credentialDefinitions.map((credD, key)=> {
                                return(
                                  <MenuItem value={credD} key={key} >{credD.value}</MenuItem>
                                )})}          
                            </Select>
                        </Grid>
                    </Grid>
                  </Grid>
         
                <Grid container item xs={12} justify='center' spacing={4}>
                  <Grid item xs={12} >
                      <Typography>Attributes</Typography>    
                      <Divider /> 
                   
                  </Grid>
                    <Grid container spacing={4} justify='space-evenly' item xs={4}>
                      
                    {this.state.credDef.attributes.map((attr, index) => {
                        return( this.currentAttribute(attr, index) )
                    })}  
                    </Grid>
                  </Grid>
                  <Grid container item spacing={4} justify='center' xs={12}>
                  <Grid item xs={12} >
                    send credentials now?
                    <Checkbox  
                    onChange={(event) => this.handleCredentialSendCheckChange(event)}
                    color='primary'
                    checked={this.state.sendCredentialCheck}
                    value={this.state.sendCredentialCheck}
                    />
                    </Grid>
                    </Grid>              
    
            </Grid>
            <Grid item container 
                  justify='center'
                  xs={12}>
                  <Button variant="outlined" style={{color:'white'}} onClick={(event) => this.sendCredentialOfferClick()}>
                    Send
                  </Button>
              </Grid>
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
  )
}

}

const style = {
    margin: 15,
};
  
  export default withRouter(CredentialOfferScreen);
