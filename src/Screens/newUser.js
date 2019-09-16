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
import axios from 'axios';
import * as Constants from "./../Constants";
import Footer from "./../components/footer"

const mongoDBBaseUrl = Constants.mongoDBBaseUrl;

//var apiBaseUrl = ""REPLACE"";
//var apiBaseUrl = ""REPLACE"";


class newUserScreen extends Component {
  constructor(props){
     let userdata =  props.location.state
    super(props);
    Utils.checkLogin(this)
    this.state={
      citizens: '',
      connection_message: '',
      citizen_did:'',
      citizen_verkey:'',
      onboardChecked: true,
      personIdentitfier: userdata.id,
      familyName: userdata.familyName,
      firstName: userdata.firstName,
      dateOfBirth: userdata.dateOfBirth,
      birthName: userdata.birthName,
      placeOfBirth: userdata.placeOfBirth,
      currentAddress: userdata.currentAddress,
      gender: userdata.gender,
      legalPersonIdentifier: userdata.legalPersonIdentifier,
      legalName: userdata.legalName,
      legalAdress: userdata.legalAddress,
      vatRegistration: userdata.vatRegistration,
      taxReference: userdata.taxReference,
      lei: userdata.lei,
      eori: userdata.eori,
      seed: userdata.seed,
      sic: userdata.sic,
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

    async handleClickAdd(event){
        var self = this;
        var headers = {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem("token") 
        }
        var citizen_payload = { 
            "id": self.state.personIdentitfier,
            "familyName": self.state.familyName,
            "firstName": self.state.firstName,
            "dateOfBirth": self.state.dateOfBirth,
            "placeOfBirth": self.state.placeOfBirth,
            "address": self.state.currentAddress,
            "gender": self.state.gender,
            "legalId": self.state.legalPersonIdentifier,
            "legalName": self.state.legalName,
            "legalAdress":self.state.legalAdress,
            "vatRegistration": self.state.vatRegistration,
            "taxReference": self.state.taxReference,
            "lei": self.state.lei,
            "eori": self.state.eori,
            "seed": self.state.seed,
            "sic": self.state.sic,
        }
        
        await axios.post(mongoDBBaseUrl + "citizens", citizen_payload, {headers}).then(function (response) {
          console.log(response);
                console.log(response.status);
                if (response.status === 200) {
                  alert("new Citizen added sucessfully !")
                  if(self.state.onboardChecked===true){}
                  self.props.history.push({
                      pathname: '/onboarding',
                      state: { firstName: self.state.firstName, familyName: self.state.familyName}
                  })
                }
        }).catch(function (error) {
          //alert(JSON.stringify(schema_payload))
          //alert(error);
          console.log(error);
      });
    
        
}



  render() {
    return (
      <MuiThemeProvider>
        <div className="App">
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
                                hintText="Enter PersonIdentitfier"
                                floatingLabelText="PersonIdentitfier"
                                value={this.state.personIdentitfier}
                                onChange={(event, newValue) => {this.setState({ personIdentitfier: newValue })}}
                            />
                            *
                        </Box>
                        <Box>
                            <TextField
                                hintText="Enter FamilyName"
                                floatingLabelText="FamilyName"
                                value={this.state.familyName}
                                onChange={(event, newValue) => {this.setState({ familyName: newValue })}}
                                />
                                *
                        </Box>
                        <Box>
                            <TextField
                                hintText="Enter FirstName"
                                floatingLabelText="FirstName"
                                value={this.state.firstName}
                                onChange={(event, newValue) => {this.setState({ firstName: newValue })}}
                                />
                                *
                        </Box>
                        <Box>
                            <TextField
                                hintText="Enter DateOfBirth"
                                floatingLabelText="DateOfBirth"
                                value={this.state.dateOfBirth}
                                onChange={(event, newValue) => {this.setState({ dateOfBirth: newValue })}}
                                />
                        </Box>

                        <Box>
                            <TextField
                                hintText="Enter PlaceOfBirth"
                                floatingLabelText="PlaceOfBirth"
                                value={this.state.placeOfBirth}
                                onChange={(event, newValue) => {this.setState({ placeOfBirth: newValue })}}
                                />
                        </Box>
                        <Box>
                        <TextField
                                hintText="Enter CurrentAddress"
                                floatingLabelText="CurrentAddress"
                                value={this.state.currentAddress}
                                onChange={(event, newValue) => {this.setState({ currentAddress: newValue })}}
                                />
                        </Box>
                        <Box>
                            <TextField
                                hintText="Enter Gender"
                                floatingLabelText="Gender"
                                value={this.state.gender}
                                onChange={(event, newValue) => {this.setState({ gender: newValue })}}
                                />
                        </Box>
                    </Grid>  
                    <Box display='inline-block' ml='10%'>
                        <Typography children={'Legal Person'}></Typography>
                        <Box>
                            <TextField
                                hintText="Enter LegalPersonIdentifier"
                                floatingLabelText="LegalPersonIdentifier"
                                value={this.state.legalPersonIdentifier}
                                onChange={(event, newValue) => {this.setState({ legalPersonIdentifier: newValue })}}
                            />
                            *
                        </Box>
                        <Box>
                            <TextField
                                hintText="Enter LegalName"
                                floatingLabelText="LegalName"
                                value={this.state.legalName}
                                onChange={(event, newValue) => {this.setState({ legalName: newValue })}}
                                />
                                *
                        </Box>
                        <Box>
                            <TextField
                                hintText="Enter LegalAddress"
                                floatingLabelText="LegalAddress"
                                value={this.state.legalAddress}
                                onChange={(event, newValue) => {this.setState({ legalAddress: newValue })}}
                                />
                        </Box>
                        <Box>
                            <TextField
                                hintText="Enter VATRegistration"
                                floatingLabelText="VATRegistration"
                                value={this.state.vatRegistration}
                                onChange={(event, newValue) => {this.setState({ vatRegistration: newValue })}}
                                />
                        </Box>
                        <Box>
                            <TextField
                                hintText="Enter TaxReference"
                                floatingLabelText="TaxReference"
                                value={this.state.taxReference}
                                onChange={(event, newValue) => {this.setState({ taxReference: newValue })}}
                                />
                        </Box>
                        <Box>
                            <TextField
                                hintText="Enter LEI "
                                floatingLabelText="LEI"
                                value={this.state.lei}
                                onChange={(event, newValue) => {this.setState({ lei: newValue })}}
                                />
                        </Box>
                        <Box>
                            <TextField
                                hintText="Enter EORI"
                                floatingLabelText="EORI"
                                value={this.state.eori}
                                onChange={(event, newValue) => {this.setState({ eori: newValue })}}
                                />
                        </Box>
                        <Box>
                            <TextField
                                hintText="Enter SEED"
                                floatingLabelText="SEED"
                                value={this.state.seed}
                                onChange={(event, newValue) => {this.setState({ seed: newValue })}}
                                />
                        </Box>
                        <Box>
                            <TextField
                                hintText="Enter SIC"
                                floatingLabelText="SIC"
                                value={this.state.sic}
                                onChange={(event, newValue) => {this.setState({ sic: newValue })}}
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
                    <Button variant='contained' color= 'primary' fullWidth onClick={(event) => this.handleClickAdd(event)} >
                        Submit
                    </Button>
                    </Box>
                    <Box position='absolute' bottom={8} left= {16} >
                        All marked fields (*) are mandatory fields
                    </Box>
                </Grid>
                </Box>
        </Grid>
        </div> 
     </div>
    </MuiThemeProvider>
          
    );
  }
}

export default withRouter(newUserScreen);