import React, { Component } from 'react';
/*
Screen:LoginScreen
Loginscreen is the main screen which the user is shown on first visit to page and after
hitting logout
*/
import './../App.css';
/*
Module:Material-UI
Material-UI is used for designing ui of the app
*/

import RaisedButton from 'material-ui/RaisedButton';
import {withRouter} from "react-router-dom";
import TextField from 'material-ui/TextField';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import axios from 'axios';
import IssuerBar from "./../components/IssuerBar";
import * as Constants from "./../Constants";
import * as Utils from "./../Utils";
import Select from 'react-select';
import {createMuiTheme,  makeStyles, withStyles} from '@material-ui/core/styles';

import Box from '@material-ui/core/Box'
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import Divider from '@material-ui/core/Divider';

import Button from '@material-ui/core/Button';
var QRCode = require('qrcode.react');



const apiBaseUrl = Constants.apiBaseUrl;



//var apiBaseUrl = ""REPLACE"";
//var apiBaseUrl = ""REPLACE"";

const useStyles = makeStyles(theme => ({
  progressBar:{
    position: 'relative',
    top: '2%',
  },
  card: {
    margin: '0 0',
    marginTop: '10vh',
    height: '60vh',
  },
  grid:{
    width: '100%',
  },
  attributeList: {
    margin: 'auto auto',
    width: '30%',
  },

}));

const styles = {
  root: {
    backgroundColor: props =>
      props.active === 'true'
        ? 'rgb(0, 188, 212)'
        : 'white',
    width: 30,
    height: 30,
    border: 'solid',
    borderWidth: '1px',
    borderRadius: 30/2,

    
  },
};

function CircleRaw(props) {
  const { classes, color, ...other } = props;
  return <Box className={classes.root} {...other} />;
}

CircleRaw.propTypes = {
  classes: PropTypes.object.isRequired,
  active: PropTypes.oneOf(['true', 'false']).isRequired,
};

const Circle = withStyles(styles)(CircleRaw);

function RenderQR(props){
  if(props.isOnboarded){
    return <QRCode value={props.connectionMessage} size={256}/>
  } else {
    return null
  }
}

function Progressbar(props){
  const classes = useStyles();
  let self = props.this;
  return(
    <Box className={classes.progressBar}>
      <Box position="absolute" left="10%">
        <Circle    active='true'></Circle>
        <Box  position= 'absolute' top={5} left = '120%'>
          <Typography color= 'textSecondary'>Register</Typography>
        </Box>
      </Box>
      <Box position="absolute" left="35%">
        <Circle    active='false'></Circle>
        <Box  position= 'absolute' top={5} left = '120%'>
          <Typography color= 'textSecondary' noWrap>Send Connection Offer</Typography>
        </Box>
      </Box>
      <Box position="absolute" left="60%">
        <Circle    active='false'></Circle>
        <Box  position= 'absolute' top={5} left = '120%'>
          <Typography color= 'textSecondary' noWrap>Onboard User</Typography>
        </Box>
      </Box>
      <Box position="absolute" left="85%">
        <Circle    active='false'></Circle>
        <Box  position= 'absolute' top={5} left = '120%'>
          <Typography color= 'textSecondary'>Finish</Typography>
        </Box>
      </Box>
    </Box>
    );
}

function SchemaTable(props) {
  const classes = useStyles();
  let self = props.this;
  return(
  <div className={classes.grid}>
    <Grid item xs={10} md={8} xl={6} style={{margin:"auto"}}>
      <Box position="relative">
        <Paper  className={classes.card}>
          <Progressbar this={self} />
          <Box position='absolute' bottom="50%" right={0} left={0}>
            <Box>
              <TextField
                    hintText="Enter username of citizen"
                    floatingLabelText="Citizen username"
                    value={self.state.username}
                    onChange={(event, newValue) => {self.setState({ username: newValue });self.handleConnMessage(event)}}
                />
            </Box>
            <Box>
              <TextField
                hintText="Enter app name"
                floatingLabelText="App name"
                value={self.state.app}
                onChange={(event, newValue) => {self.setState({ app: newValue });self.handleConnMessage(event)}}
               />
            </Box>
          </Box>  
          <Box position='absolute' bottom="2%" right= "1%" style={{width:'10%' }}>
          <Button variant='contained' label="Next"  fullWidth style={{backgroundColor :'rgb(0, 188, 212)' , color:'white'}} onClick={(event) => props.this.handleClickNext(event)} >
              Next
          </Button>
          </Box>
        </Paper>
        </Box>

    </Grid>
  </div>
  );
}

class OnboardingScreen extends Component {
  constructor(props){
    super(props);
    Utils.checkLogin(this)
    this.state={
      //TODO: change username
      username: '',
      connection_message: '',
      app: "",
      citizen_did:'',
      citizen_verkey:'',
      onboarded:true,
      printingmessage:'',
      printButtonDisabled:false,
      newMyDid: "",
      credDefId: "",
      credentialDefinitions: []
    }
  }
  
  componentWillUnmount() {
    clearInterval(this.timer);
    this.timer = null;
  }

  //GET  /api/connection/:myDid
  pollNewConnectionStatus(){
    if(this.state.newMyDid !== "" && this.state.credDefId !== ""){
      var self = this;
      var headers = {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem("token") 
      }
      axios.get(apiBaseUrl + "connection/" + this.state.newMyDid, {headers: headers}).then((response) => {
        console.log(response.status)
        if(response.status === 200){
          let status = JSON.parse(response.data.acknowledged)
          if(status === true){
            let theirDid = response.data.theirDid;
            Utils.sendCredentialOffer(theirDid,self.state.credDefId)
            self.setState({newMyDid: ""})
            //this.props.history.push({pathname: "/credential",state: {credDefId: credDefId}});
          }
        }
      })
    }
  }

  handleOnboarding(event) {
    var self = this;
    var payload = {
        "did": this.state.citizen_did,
        "verkey": this.state.citizen_verkey,
        "role": "NONE"
    }
    var headers = {
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem("token") 
    }
    axios.post(apiBaseUrl + 'nym' ,payload, {headers: headers})
        .then(function (response) {
            console.log(response);
            console.log(response.status);
            if (response.status === 200) {
                console.log("Onboarding successfully executed");
                console.log(response.data);
                var payload_conn = {
                  "meta": {
                    "username": self.state.username
                  },
                  "data": {
                    "app": self.state.app
                  }
                }
                axios.post(apiBaseUrl + 'connectionoffer' ,payload_conn, {headers: headers})
                .then(function (response) {
                  console.log(response);
                  console.log(response.status);
                  if (response.status === 201) {
                    self.setState({connection_message: JSON.stringify(response.data.message), onboarded: true})
                  }
                }).catch(function (error) {
                  //alert(error);
                  console.log(error);
              });

            } else if (response.status === 204) {
                console.log("TODO: handle onboarding errors");
                //alert("TODO: handle onboarding errors")
            }
            else {
                console.log("Onboarding is unsuccesful");
                alert("Onboarding is unsuccesful");
            }
        })
        .catch(function (error) {
            //alert(error);
            console.log(error);
        });
}

  componentDidMount(){
    document.title = "issuer app"
    Utils.listCredDefs(this);
    this.timer = setInterval(() => this.pollNewConnectionStatus(), 5000);
    if(this.state.onboarded){
    var self = this;
    var headers = {
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem("token") 
    }
     var payload_conn = {
                  "meta": {
                    "username": self.state.username
                  },
                  "data": {
                    "app": self.state.app
                  }
                }
                axios.post(apiBaseUrl + 'connectionoffer' ,payload_conn, {headers: headers})
                .then(function (response) {
                  console.log(response);
                  console.log(response.status);
                  if (response.status === 201) {
                    self.setState({connection_message: JSON.stringify(response.data.message)})
                  }
                }).catch(function (error) {
                  //alert(error);
                  console.log(error);
              });
            } 

  }
  /*
  Function:handleCloseClick
  Parameters: event,index
  Usage:This fxn is used to remove file from filesPreview div
  if user clicks close icon adjacent to selected file
  */

 handleSelect(event) {
  var self = this;
  var headers = {
    'Content-Type': 'application/json',
    'Authorization': localStorage.getItem("token") 
  }
  this.setState({
    onboarded: event.target.value
  });
  if(event.target.value === true){
     var payload_conn = {
                  "meta": {
                    "username": self.state.username
                  },
                  "data": {
                    "app": self.state.app
                  }
                }
              axios.post(apiBaseUrl + 'connectionoffer' ,payload_conn, {headers: headers})
                .then(function (response) {
                  console.log(response);
                  console.log(response.status);
                  if (response.status === 201) {
                    self.setState({connection_message: JSON.stringify(response.data.message)})
                  }
                }).catch(function (error) {
                  //alert(error);
                  console.log(error);
              });
            } 
}

handleConnMessage(event) {
  var self = this;
  var headers = {
    'Content-Type': 'application/json',
    'Authorization': localStorage.getItem("token") 
  }
  var payload_conn = {
              "meta": {
                "username": self.state.username
              },
                "data": {
                  "app": self.state.app
                }
              }
            axios.post(apiBaseUrl + 'connectionoffer' ,payload_conn, {headers: headers})
              .then(function (response) {
                console.log(response);
                console.log(response.status);
                if (response.status === 201) {
                  self.setState({connection_message: JSON.stringify(response.data.message), newMyDid: response.data.meta.myDid})
                }
              }).catch(function (error) {
                //alert(error);
                console.log(error);
            });
}

/*
  Function:toggleDrawer
  Parameters: event
  Usage:This fxn is used to close the drawer when user clicks anywhere on the 
  main div
  */
handleDivClick(event){
  
}
/*
  Function:handleLogout
  Parameters: event
  Usage:This fxn is used to end user session and redirect the user back to login page
  */
handleLogout(event){
  // console.log("logout event fired",this.props);
  localStorage.clear();
  var self = this;
  self.props.history.push("/");
}

  render() {
    return (
      <div className="App">
      <MuiThemeProvider>
      <div>
      <center>
      <IssuerBar />
      <br />
      <SchemaTable this={this}/>
  
  Create connection QR code:
          <div>
          <TextField
                hintText="Enter username of citizen"
                floatingLabelText="Citizen username"
                value={this.state.username}
                onChange={(event, newValue) => {this.setState({ username: newValue });this.handleConnMessage(event)}}
            />
            <br/>
      <TextField
                hintText="Enter app name"
                floatingLabelText="App name"
                defaultValue="issuer app"
                value={this.state.app}
                onChange={(event, newValue) => {this.setState({ app: newValue });this.handleConnMessage(event)}}
            />
            <br/>
          <br />
          <RenderQR isOnboarded={this.state.onboarded} connectionMessage={this.state.connection_message}/>
          <br />
          </div>
          Select credential Definition for automatic credential offer:
      <br />
      <Select
          inputId="react-select-single"
          TextFieldProps={{
            label: 'User',
            InputLabelProps: {
              htmlFor: 'react-select-single',
              shrink: true,
            },
            placeholder: 'Search for credential definition ID',
          }}
          options={this.state.credentialDefinitions}
          onChange={(event) => this.setState({credDefId: event.value})}
        />
          <div>
        Is the citizen already onboarded? <br />
              <select value={this.state.onboarded} onChange={this.handleSelect.bind(this)}>
              <option value={true}>Already onboarded</option>
              <option value={false}>Not yet onboarded</option>
              </select>
          </div>
          <TextField
                hintText="Enter username of citizen"
                floatingLabelText="Citizen username"
                value={this.state.username}
                onChange={(event, newValue) => this.setState({ username: newValue })}
            />
            <br/>
          <TextField
                hintText="Enter citizen DID"
                floatingLabelText="Citizen DID"
                value={this.state.citizen_did}
                onChange={(event, newValue) => this.setState({ citizen_did: newValue })}
            />
            <br/>
            <TextField
                hintText="Enter citizen verkey"
                floatingLabelText="Citizen verkey"
                value={this.state.citizen_verkey}
                onChange={(event, newValue) => this.setState({ citizen_verkey: newValue })}
            />
             <br />
           <RaisedButton label="Onboard citizen" primary={true} style={style} onClick={(event) => this.handleOnboarding(event)}/>
      
      </center>
      </div>
          <div onClick={(event) => this.handleDivClick(event)}>
          <center>
          <br />
          </center>
           <RaisedButton label="Logout" primary={true} style={style} onClick={(event) => this.handleLogout(event)}/>
          </div>
          </MuiThemeProvider>
          </div>
    );
  }
}

const style = {
  margin: 15,
};

export default withRouter(OnboardingScreen);