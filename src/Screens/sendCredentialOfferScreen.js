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
import {withRouter} from "react-router-dom";
import TextField from 'material-ui/TextField';
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

const apiBaseUrl = Constants.apiBaseUrl;

//var apiBaseUrl = ""REPLACE"";
//var apiBaseUrl = ""REPLACE"";




class CredentialScreen extends Component {

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
          credentialRequestId: props.location.state.hasOwnProperty("credentialRequestId") ? props.location.state.credentialRequestId : "",
          credentialRequests: [],
          credentialDefinitions: [],
          pairwiseConnectionsOptions: [],
          myDid: props.location.state.myDid
        }
      } else {
        this.state={
          recipientDid: "",
          credDef: {attributes: [],
                    value: "",
                    label: ""},
          credentialRequestId: "",
          credentialRequests:  <CUSTOMPAGINATIONACTIONSTABLE data={[]} showAttr={[]}/>,
          credentialDefinitions: [],
          selected: "",
          myDid: props.location.state.myDid
        }
      }
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
 axios.post(apiBaseUrl + 'credentialoffer' ,payload, {headers}).then(function (response) {
  if (response.status === 201) {
    alert("Credential offer successfully sent")
  }
}).catch(function (error) {
//alert(error);
//alert(JSON.stringify(payload))
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
    <Grid item container xs={3}>
     <Grid item container xs={10} 
           component={Paper}
           justify='center'
           alignItems='center'>
        <Grid item xs={12}>{attr}</Grid>

     </Grid>
    </Grid>
  )
}


render() {
  return(
    <MuiThemeProvider>
    <div className="App">
    <IssuerBar onTabChange={(newTab) => this.handleTabChange(newTab)} tabNr={this.props.tabNr}/>
      
          <div className="SendCredentialOffer">


      </div>
<div className= 'grid'>

    <Grid container xs={12}  style={{margin:"auto"}}>
    <Container className='tableContainer'>
    <Box position='relative' >
      <Typography variant="h6">
            Send Credential Offer
        </Typography>
        </Box>
        <Box mt={3}>
            <Grid
                item
                component= {Paper}
                container
                direction="row"
                justify="center"
                alignItems="flex-start"
                xs={12}
                >
                {/*padding*/}
                <Grid item xs={12} >
                    <Box height='8vh' />       
                </Grid>
                <Grid item container xs={8} justify='flex-start'>
                  <Grid item xs={6}>
                   Select Credential Definition:  
                   </Grid>  
                    <Grid item xs={6} containerjustify='flex-start'> 
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
                  <Grid item xs={12} >
                    <Box height='8vh' />       
                </Grid>
                <Grid item xs={12} >
                    <Typography>Attributes</Typography>     
                    <Divider />
                </Grid>
                <Grid item xs={12} >
                    <Box height='2vh' />       
                </Grid>
                  <Grid item container xs={10}
                    direction='row'
                    justify='space-evenly'
                    spacing={2}>
                    
                  {this.state.credDef.attributes.map((attr, index) => {
                       return( this.currentAttribute(attr, index) )
                  })}  
                  </Grid>               
                  <Grid item xs={12} >
                    <Box height='8vh' />       
                </Grid>
            </Grid>
            </Box>
            <Box>
                  <Button  color='primary' style={{color:'white'}} onClick={(event) => this.sendCredentialOfferClick(event)}>Offer</Button>
               </Box>
            </Container>
      </Grid>

      </div>
      <Footer />
      </div>
    </MuiThemeProvider>
  )
}

}

const style = {
    margin: 15,
};
  
  export default withRouter(CredentialScreen);
