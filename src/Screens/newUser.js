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
import TextField from 'material-ui/TextField';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import IssuerBar from "./../components/IssuerBar";
import * as Utils from "./../Utils";
import Box from '@material-ui/core/Box'
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';

//var apiBaseUrl = ""REPLACE"";
//var apiBaseUrl = ""REPLACE"";


function  handleClickAdd(props){

    console.log(props)
    let self = props
    if(self.state.onboardChecked===true)
        self.props.history.push("/onboarding");
}

class newUserScreen extends Component {
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
      credentialDefinitions: [],
      onboardChecked: true,
      
    }
  }
  
  componentWillUnmount() {
    clearInterval(this.timer);
    this.timer = null;
  }

 handleOnboardCheckChange =  event => {
     this.setState({onboardChecked: event.target.checked});
   };

   handleTabChange(newTab){
    console.log(newTab)
    this.props.onTabChange(newTab)
  }



  render() {
    return (
      <div className="App">
      <MuiThemeProvider>
      <IssuerBar onTabChange={(newTab) => this.handleTabChange(newTab)} tabNr={this.props.tabNr}/>
      <div className={styles.grid}>
    <Grid item xs={10} md={8} xl={6} style={{margin:"auto"}}>
    <Box position='relative' mt='5%'>
            <Grid
                component= {Paper}
                container
                direction="row"
                justify="center"
                alignItems="flex-start"
                >
                {/*padding*/}
                <Grid item xs={12} >
                    <Box height='2vh' />     
                    <Typography variant= 'h5' children={'New Citizen'} />
                    <Box height='2vh' />  
                </Grid>
          
                <Grid item display='block' >
                    <Typography children={'Natural Person'}></Typography>
                    <Box>
                        <TextField
                            hintText="Enter username of citizen"
                            floatingLabelText="PersonIdentitfier"
                            value={this.state.username}
                            onChange={(event, newValue) => {this.setState({ username: newValue });this.handleConnMessage(event)}}
                        />
                        *
                    </Box>
                    <Box>
                        <TextField
                            hintText="Enter app name"
                            floatingLabelText="FamilyName"
                            value={this.state.app}
                            onChange={(event, newValue) => {this.setState({ app: newValue });this.handleConnMessage(event)}}
                            />
                            *
                    </Box>
                    <Box>
                        <TextField
                            hintText="Enter app name"
                            floatingLabelText="FirstName"
                            value={this.state.app}
                            onChange={(event, newValue) => {this.setState({ app: newValue });this.handleConnMessage(event)}}
                            />
                            *
                    </Box>
                    <Box>
                        <TextField
                            hintText="Enter app name"
                            floatingLabelText="DateOfBirth"
                            value={this.state.app}
                            onChange={(event, newValue) => {this.setState({ app: newValue });this.handleConnMessage(event)}}
                            />
                            *
                    </Box>
                    <Box>
                        <TextField
                            hintText="Enter app name"
                            floatingLabelText="BirthName"
                            value={this.state.app}
                            onChange={(event, newValue) => {this.setState({ app: newValue });this.handleConnMessage(event)}}
                            />
                    </Box>
                    <Box>
                        <TextField
                            hintText="Enter app name"
                            floatingLabelText="PlaceOfBirth"
                            value={this.state.app}
                            onChange={(event, newValue) => {this.setState({ app: newValue });this.handleConnMessage(event)}}
                            />
                    </Box>
                    <Box>
                    <TextField
                            hintText="Enter app name"
                            floatingLabelText="CurrentAddress"
                            value={this.state.app}
                            onChange={(event, newValue) => {this.setState({ app: newValue });this.handleConnMessage(event)}}
                            />
                    </Box>
                    <Box>
                        <TextField
                            hintText="Enter app name"
                            floatingLabelText="Gender"
                            value={this.state.app}
                            onChange={(event, newValue) => {this.setState({ app: newValue });this.handleConnMessage(event)}}
                            />
                    </Box>
                </Grid>  
                <Box display='inline-block' ml='10%'>
                    <Typography children={'Legal Person'}></Typography>
                    <Box>
                        <TextField
                            hintText="Enter username of citizen"
                            floatingLabelText="LegalPersonIdentifier"
                            value={this.state.username}
                            onChange={(event, newValue) => {this.setState({ username: newValue });this.handleConnMessage(event)}}
                        />
                        *
                    </Box>
                    <Box>
                        <TextField
                            hintText="Enter app name"
                            floatingLabelText="LegalName"
                            value={this.state.app}
                            onChange={(event, newValue) => {this.setState({ app: newValue });this.handleConnMessage(event)}}
                            />
                            *
                    </Box>
                    <Box>
                        <TextField
                            hintText="Enter app name"
                            floatingLabelText="LegalAddress"
                            value={this.state.app}
                            onChange={(event, newValue) => {this.setState({ app: newValue });this.handleConnMessage(event)}}
                            />
                    </Box>
                    <Box>
                        <TextField
                            hintText="Enter app name"
                            floatingLabelText="VATRegistration"
                            value={this.state.app}
                            onChange={(event, newValue) => {this.setState({ app: newValue });this.handleConnMessage(event)}}
                            />
                    </Box>
                    <Box>
                        <TextField
                            hintText="Enter app name"
                            floatingLabelText="TaxReference"
                            value={this.state.app}
                            onChange={(event, newValue) => {this.setState({ app: newValue });this.handleConnMessage(event)}}
                            />
                    </Box>
                    <Box>
                        <TextField
                            hintText="Enter app name"
                            floatingLabelText="LEI"
                            value={this.state.app}
                            onChange={(event, newValue) => {this.setState({ app: newValue });this.handleConnMessage(event)}}
                            />
                    </Box>
                    <Box>
                        <TextField
                            hintText="Enter app name"
                            floatingLabelText="EORI"
                            value={this.state.app}
                            onChange={(event, newValue) => {this.setState({ app: newValue });this.handleConnMessage(event)}}
                            />
                    </Box>
                    <Box>
                        <TextField
                            hintText="Enter app name"
                            floatingLabelText="SEED"
                            value={this.state.app}
                            onChange={(event, newValue) => {this.setState({ app: newValue });this.handleConnMessage(event)}}
                            />
                    </Box>
                    <Box>
                        <TextField
                            hintText="Enter app name"
                            floatingLabelText="SIC"
                            value={this.state.app}
                            onChange={(event, newValue) => {this.setState({ app: newValue });this.handleConnMessage(event)}}
                            />
                    </Box>
                </Box>  
                {/*padding*/}
                <Grid item xs={12} >
                    <Box height='5vh' />
                </Grid>
                <Box position='absolute' bottom='8%' right= {8}>
                    Onboard User?
                    <Checkbox  
                        onChange={this.handleOnboardCheckChange}
                        color='primary'
                        checked={this.state.onboardChecked}
                        value="onboardChecked"
                    />
                </Box>
                <Box position='absolute' bottom='1%' right= {8} style={{width:'10%' }}>
                <Button variant='contained' color= 'primary' fullWidth onClick={(event) => handleClickAdd(this)} >
                    Add
                </Button>
                </Box>
                <Box position='absolute' bottom={8} left= {16} >
                       All marked fields (*) are mandatory fields
                </Box>
            </Grid>
            </Box>
      </Grid>
    </div> 

          </MuiThemeProvider>
          </div>
    );
  }
}

export default withRouter(newUserScreen);