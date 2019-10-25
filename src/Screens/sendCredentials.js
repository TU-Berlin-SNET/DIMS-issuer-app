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
import TextField from '@material-ui/core/TextField';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import axios from 'axios';
import IssuerBar from "./../components/IssuerBar";
import * as Constants from "./../Constants";
import * as Utils from "./../Utils";
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Footer from "./../components/footer"



const apiBaseUrl = Constants.apiBaseUrl;
var tempAttributes = {}
//var apiBaseUrl = ""REPLACE"";
//var apiBaseUrl = ""REPLACE"";


class CredentialScreen extends Component {

    constructor(props){
        console.log(props)
        super(props);
        Utils.checkLogin(this)
       
        this.state={
            credReq: props.location.state.credReq,
            attributes: [],
            person: props.location.state.person,
            modelName: props.location.state.modelName
        }
      }
    


componentDidMount(){
  document.title = "issuer app"
  this.getAttributeNames(this.props.location.state.credReq)
  this.personAttributeNamesToLowerCase()

  this.timer = setInterval(() => {
    }, 5000
    );
}


componentWillUnmount() {
  clearInterval(this.timer);
  this.timer = null;
}

personAttributeNamesToLowerCase(){
  var attributeLowerCase
  var tempPerson = {}
  Object.keys(this.state.person).map((attribute) => {
     attributeLowerCase = attribute.toLowerCase()
     tempPerson[attributeLowerCase]  = this.state.person[attribute]
  })
  console.log(tempPerson)
}

getAttributeNames(credReq){
    let attributes= credReq.meta.offer.key_correctness_proof.xr_cap
    attributes= attributes.filter((elem => elem[0] !== "master_secret")) 
    this.loadValueFromDatabase(attributes)
    console.log(attributes)
}


sendCredentialsClick(){
  this.acceptCredentialRequestAndSendCred()
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

async acceptCredentialRequestAndSendCred(){
  let self = this
  var values = {};  // "object literal" syntax
  console.log(self.state.attributes)
  Object.keys(self.state.attributes).map((attr) => {

    
      let name = attr
      let value = self.state.attributes[attr]
      values[name] = value
  })

  console.log(values)
  var headers = {
    'Content-Type': 'application/json',
    'Authorization': localStorage.getItem("token")
  }
  var payload = {
    'credentialRequestId': this.state.credReq.id,
    'values': self.state.attributes
  }
  axios.post(apiBaseUrl + 'credential' ,payload, {headers: headers}).then(function (response) {
    console.log(response);
    console.log(response.status);
    if (response.status === 201) {
      self.props.history.push({
        pathname: '/db',
        state:{
          justIssuedCredentials : true,
        }
        })
    }
  }).catch(function (error) {
      console.log(error);
  });
}

handleTabChange(newTab){
  this.props.onTabChange(newTab)
}


toDate(wrongDateFormat){
  console.log(wrongDateFormat)
   let year = wrongDateFormat.slice(0,4)
   let month= wrongDateFormat.slice(5,7)
   let day = wrongDateFormat.slice(8,10)
   return( month + "." + day + "." + year
           )
  }

loadValueFromDatabase(attributes){
   tempAttributes = {}
  console.log(attributes)

  
  for(let attr of attributes){
    if(this.state.person[attr[0]] === undefined){
        tempAttributes[attr[0]] = 0
    }
    else{
      tempAttributes[attr[0]] = this.state.person[attr[0]]
    }
 console.log(this.state.person[attr])
  }
  console.log(tempAttributes)
  this.setState({attributes: tempAttributes}, () => this.forceUpdate() )



}


render() {
  return(
    <MuiThemeProvider>
    <div className="App">
    <IssuerBar onTabChange={(newTab) => this.handleTabChange(newTab)} tabNr={this.props.tabNr}/>
    <div className= {styles.grid}>

        <Grid container item   xs={6}  style={{margin:"auto"}}>
            <Container className='tableContainer'>
 
            <Grid 
              container
              item   
              direction="row"
              justify='space-evenly'
              spacing={4}
              xs={12} style={{margin:"auto"}}>
                <Grid item container spacing={0} xs={12}>
                  <Grid item xs={1} position='relative'>
                    <Box position='absolute' left={16}>
                    </Box>
                  </Grid>
                  <Grid item xs={10}>
                    <Typography variant="h5">
                        Send Credentials 
                    </Typography> 
                  </Grid>
                  <Grid item xs={1} position='relative'>
                  </Grid>     
                </Grid>
                <Grid item xs={12} />
                    <Grid
                        item
                        component={Paper}
                        container
                        direction="row"
                        justify="center"
                        alignItems="flex-start"
                        spacing={8}
                        xs={12}
                        >
                        {/*padding*/}
                        <Grid container item xs={12} direction='column' alignContent='center' spacing={2}>
                            {Object.keys(this.state.attributes).map((key, index) => {
                              console.log(this.state.attributes[key])
                              return(
                        
                              <Grid item xs={6} key={index}>
                              <TextField   helperText={'Enter ' +  key}
                                          defaultValue={this.state.attributes[key]}
                                         
                                          fullWidth
                                          onChange={(event) => {
                                          let values = this.state.attributes;
                                          values[key] = event.target.value;
                                          
                                          console.log(this.state.attributes)
                                          this.setState({ attributes: values})}} 
                                          
                              />
                              </Grid>
                              );     
                            })}
                        </Grid>
                    </Grid>
                    <Grid item xs={12} />
                    <Grid item xs={12}>
                        <Button  color='primary' style={{color:'white'}} onClick={(event) => this.sendCredentialsClick(event)}>Send</Button>
                    </Grid>
                  </Grid>        
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
