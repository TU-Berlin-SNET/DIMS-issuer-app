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
    height:'80vh',
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

function SchemaTable(props) {
    const classes = useStyles();
    let self = props.this;
    return(
    <div className={classes.grid}>
      <Grid item xs={10} md={8} xl={6} style={{margin:"auto"}}>

    <Box position='relative' mt='10%'>
            <Grid
                component= {Paper}
                container
                direction="row"
                justify="center"
                alignItems="flex-start"
                >
                {/*padding*/}
                <Grid item xs={12} >
                    <Box height='5vh' />     
                </Grid>
                <Grid item display='inline-block' >
                    <Typography children={'Natural Person'}></Typography>
                    <Box>
                        <TextField
                            hintText="Enter username of citizen"
                            floatingLabelText="PersonIdentitfier"
                            value={self.state.username}
                            onChange={(event, newValue) => {self.setState({ username: newValue });self.handleConnMessage(event)}}
                        />
                    </Box>
                    <Box>
                        <TextField
                            hintText="Enter app name"
                            floatingLabelText="FamilyName"
                            value={self.state.app}
                            onChange={(event, newValue) => {self.setState({ app: newValue });self.handleConnMessage(event)}}
                            />
                    </Box>
                    <Box>
                        <TextField
                            hintText="Enter app name"
                            floatingLabelText="FirstName"
                            value={self.state.app}
                            onChange={(event, newValue) => {self.setState({ app: newValue });self.handleConnMessage(event)}}
                            />
                    </Box>
                    <Box>
                        <TextField
                            hintText="Enter app name"
                            floatingLabelText="DateOfBirth"
                            value={self.state.app}
                            onChange={(event, newValue) => {self.setState({ app: newValue });self.handleConnMessage(event)}}
                            />
                    </Box>
                    <Box>
                        <TextField
                            hintText="Enter app name"
                            floatingLabelText="BirthName"
                            value={self.state.app}
                            onChange={(event, newValue) => {self.setState({ app: newValue });self.handleConnMessage(event)}}
                            />
                    </Box>
                    <Box>
                        <TextField
                            hintText="Enter app name"
                            floatingLabelText="PlaceOfBirth"
                            value={self.state.app}
                            onChange={(event, newValue) => {self.setState({ app: newValue });self.handleConnMessage(event)}}
                            />
                    </Box>
                    <Box>
                        <TextField
                            hintText="Enter app name"
                            floatingLabelText="CurrentAddress"
                            value={self.state.app}
                            onChange={(event, newValue) => {self.setState({ app: newValue });self.handleConnMessage(event)}}
                            />
                    </Box>
                    <Box>
                        <TextField
                            hintText="Enter app name"
                            floatingLabelText="Gender"
                            value={self.state.app}
                            onChange={(event, newValue) => {self.setState({ app: newValue });self.handleConnMessage(event)}}
                            />
                    </Box>
                </Grid>  
                <Box display='inline-block' ml='10%'>
                    <Typography children={'Legal Person'}></Typography>
                    <Box>
                        <TextField
                            hintText="Enter username of citizen"
                            floatingLabelText="LegalPersonIdentifier"
                            value={self.state.username}
                            onChange={(event, newValue) => {self.setState({ username: newValue });self.handleConnMessage(event)}}
                        />
                    </Box>
                    <Box>
                        <TextField
                            hintText="Enter app name"
                            floatingLabelText="LegalName"
                            value={self.state.app}
                            onChange={(event, newValue) => {self.setState({ app: newValue });self.handleConnMessage(event)}}
                            />
                    </Box>
                    <Box>
                        <TextField
                            hintText="Enter app name"
                            floatingLabelText="LegalAddress"
                            value={self.state.app}
                            onChange={(event, newValue) => {self.setState({ app: newValue });self.handleConnMessage(event)}}
                            />
                    </Box>
                    <Box>
                        <TextField
                            hintText="Enter app name"
                            floatingLabelText="VATRegistration"
                            value={self.state.app}
                            onChange={(event, newValue) => {self.setState({ app: newValue });self.handleConnMessage(event)}}
                            />
                    </Box>
                    <Box>
                        <TextField
                            hintText="Enter app name"
                            floatingLabelText="TaxReference"
                            value={self.state.app}
                            onChange={(event, newValue) => {self.setState({ app: newValue });self.handleConnMessage(event)}}
                            />
                    </Box>
                    <Box>
                        <TextField
                            hintText="Enter app name"
                            floatingLabelText="LEI"
                            value={self.state.app}
                            onChange={(event, newValue) => {self.setState({ app: newValue });self.handleConnMessage(event)}}
                            />
                    </Box>
                    <Box>
                        <TextField
                            hintText="Enter app name"
                            floatingLabelText="EORI"
                            value={self.state.app}
                            onChange={(event, newValue) => {self.setState({ app: newValue });self.handleConnMessage(event)}}
                            />
                    </Box>
                    <Box>
                        <TextField
                            hintText="Enter app name"
                            floatingLabelText="SEED"
                            value={self.state.app}
                            onChange={(event, newValue) => {self.setState({ app: newValue });self.handleConnMessage(event)}}
                            />
                    </Box>
                    <Box>
                        <TextField
                            hintText="Enter app name"
                            floatingLabelText="SIC"
                            value={self.state.app}
                            onChange={(event, newValue) => {self.setState({ app: newValue });self.handleConnMessage(event)}}
                            />
                    </Box>
                </Box>  
                {/*padding*/}
                <Grid item xs={12} >
                    <Box height='5vh' />
                </Grid>
                <Box position='absolute' bottom={5} right= {5} style={{width:'10%' }}>
                <Button variant='contained' color= 'primary' fullWidth onClick={(event) => props.this.handleClickNext(event)} >
                    Onboard
                </Button>
                </Box>
            </Grid>
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



  render() {
    return (
      <div className="App">
      <MuiThemeProvider>

      <IssuerBar actualTab={0}/>
      <SchemaTable this={this} />
          </MuiThemeProvider>
          </div>
    );
  }
}

const style = {
  margin: 15,
};

export default withRouter(OnboardingScreen);