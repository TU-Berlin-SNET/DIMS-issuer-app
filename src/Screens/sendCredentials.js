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
import styles from './../CSS/App.css';
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button';
import {withRouter} from "react-router-dom";
import TextField from 'material-ui/TextField';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import axios from 'axios';
import Select from 'react-select';
import IssuerBar from "./../components/IssuerBar";
import * as Constants from "./../Constants";
import * as Utils from "./../Utils";
import CUSTOMPAGINATIONACTIONSTABLE from "./../components/tablepagination.js"
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';

import AcceptIcon from '@material-ui/icons/Done'

const apiBaseUrl = Constants.apiBaseUrl;

//var apiBaseUrl = ""REPLACE"";
//var apiBaseUrl = ""REPLACE"";


class CredentialScreen extends Component {

    constructor(props){
        console.log(props)
        super(props);
        Utils.checkLogin(this)
       
        this.state={
            credReq: props.location.state.credReq,
            attributes: []
        }
      }
    

componentDidMount(){
  document.title = "issuer app"
  this.getAttributeNames(this.props.location.state.credReq)
  this.timer = setInterval(() => {
    }, 5000
    );
}


componentWillUnmount() {
  clearInterval(this.timer);
  this.timer = null;
}

getAttributeNames(credReq){
    
    let attributes= credReq.meta.offer.key_correctness_proof.xr_cap
    attributes= attributes.filter((elem => elem[0] !== "master_secret")) 
    this.setState({attributes: attributes})
}


sendCredentialClick(){
  this.acceptCredentialRequestAndSendCred()
}

sendCredentialOfferClick(){
  this.sendCredentialOffer()
}

handleEdit(event, selected){ //Fuction 
  this.setState({ selected: selected}); 
} 



/* POST 
{
	"credentialRequestId": "5c7071b8db4eb00010a3779d",
	"values": {
		"given_name@string": "Jesse Digital",
        "address@string": "Digitalstreet 0101",
        "birth_date@date": "1998-01-19"
	}
}
*/
async acceptCredentialRequestAndSendCred(selected){
  console.log(selected)
  let self = this
  var headers = {
  'Content-Type': 'application/json',
  'Authorization': localStorage.getItem("token")
}
var payload = {
  'credentialRequestId': selected.id,
  'values':{}
}
axios.post(apiBaseUrl + 'credential' ,payload, {headers: headers}).then(function (response) {
  console.log(response);
  console.log(response.status);
  if (response.status === 201) {
    alert("credential succesfully issued")
    self.listCredentialRequests()
  }
}).catch(function (error) {
//alert(error);
//alert(JSON.stringify(payload))
console.log(error);
});
}

handleTabChange(newTab){
  this.props.onTabChange(newTab)
}


render() {
  return(
    <MuiThemeProvider>
    <div className="App">
    <IssuerBar onTabChange={(newTab) => this.handleTabChange(newTab)} tabNr={this.props.tabNr}/>
    <div className= {styles.grid}>

        <Grid container  xs={4}  style={{margin:"auto"}}>
            <Container className='tableContainer'>
                <Box position='relative' >
                    <Typography variant="h6">
                            Send Credentials
                    </Typography>
                </Box>
                <Box mt={3}>
                    <Grid
                        item
                        component={Paper}
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
                        <Grid item xs={12}>
                            {Object.keys(this.state.attributes).map((key) => {
                            return(
                                <Box mt={2}>
                                <Grid item xs={12}>
                                <TextField hintText={'Enter ' +  this.state.attributes[key][0]}
                                floatingLabelText={this.state.attributes[key][0]} 
                                onChange={(event, newValue) => {
                                    const {credentialValues} = this.state.attributes;
                                    this.state.attributes[key][1] = newValue;
                                    this.setState({ attributes: credentialValues})}}
                                    />
                                   </Grid>
                                   </Box> 
                                    );     
                                   
                            })}
                         <Grid item xs={12} >
                            <Box height='8vh' />     
                        </Grid>
                        </Grid>
                    </Grid>
                    </Box>
                <Box>
                    <Button  color='primary' style={{color:'white'}} onClick={(event) => this.sendCredentialOfferClick(event)}>Offer</Button>
                </Box>
            
            </Container>
        </Grid>
      </div>
      </div>
  
            

                    
    </MuiThemeProvider>
    
  )
}

}

const style = {
    margin: 15,
};
  
  export default withRouter(CredentialScreen);
