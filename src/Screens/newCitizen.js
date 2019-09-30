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
import Avatar from '@material-ui/core/Avatar';
import axios from 'axios';
import * as Constants from "./../Constants";
import Footer from "./../components/footer"
import Container from '@material-ui/core/Container';

const mongoDBBaseUrl = Constants.mongoDBBaseUrl;
const modelName = localStorage.getItem('model')
const modelSingular = modelName[0].toUpperCase() +  modelName.slice(1, modelName.length-1)
//var apiBaseUrl = ""REPLACE"";
//var apiBaseUrl = ""REPLACE"";

const avatarImageStyle = {
    width: 200,
    height: 200,
  };

  
class newUserScreen extends Component {
  constructor(props){
     let userdata =  props.location.state
    super(props);
    Utils.checkLogin(this)
    this.state={
      connection_message: '',
      person_did:'',
      person_verkey:'',
      onboardChecked: false,
      personIdentitfier: userdata.id,
      familyName: userdata.familyName,
      firstName: userdata.firstName,
      did: "",
      profilePictureSrc: null,
      base64ProfilePic: "",
      snackbarOpen: false,
      snackbarMessage: "",
      snackbarVariant: "sent",
      model: {},
    }
  }

  componentDidMount(){
      document.title = "DIMS"
      this.getModel()
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

        await axios.post(mongoDBBaseUrl + modelName , self.state.model, {headers}).then(function (response) {
                if (response.status === 200) {
                  console.log(JSON.stringify(self.state.model))
                  if(self.state.onboardChecked===true){
                    self.props.history.push({
                        pathname: '/onboarding',
                        state: { person_id: self.state.personIdentitfier,
                                person_did: self.state.did,
                                person_firstName: self.state.firstName,
                                person_familyName: self.state.familyName
                             }
                      })
                }
                else{
                    self.props.history.push({
                        pathname: '/db',
                        state: {
                            newPerson: true,
                        }
                    })
                }
         
            }
        }).catch(function (error) {
          console.log(error);
      });
}


async getModel(event){
    var self = this;
    var model = {};
    var headers = {
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem("token") 
    }
    await axios.get(mongoDBBaseUrl + "models" , {headers}).then(function (response) {
            if (response.status === 200) {
                console.log(response.data)
                
                for(let model_name in response.data){
                    console.log(model_name)
                    if(model_name === modelName){
                        model = response.data[model_name]
                        for(let attribute in  model){
                            model[attribute] = "";
                        }
   
                    }
                }
                console.log(model) 
                self.setState({model}) 
            }
        }).catch(function (error) {
        console.log(error);
    });
}   

readUploadedFileAsDataURL(inputFile){
    const temporaryFileReader = new FileReader();
  
    return new Promise((resolve, reject) => {
      temporaryFileReader.onerror = () => {
        temporaryFileReader.abort();
        reject(new DOMException("Problem parsing input file."));
      };
  
      temporaryFileReader.onload = () => {
        resolve(temporaryFileReader.result);
      };
      temporaryFileReader.readAsDataURL(inputFile);
    });
  };



  render() {
    let profilePicture = this.state.profilePictureSrc !== null ? <Avatar style={avatarImageStyle} alt="Profile picture" src={this.state.profilePictureSrc} /> :  <Avatar style={avatarImageStyle} alt="Profile picture">A</Avatar>
    return (
      <MuiThemeProvider>
        <div className="App">
            <IssuerBar onTabChange={(newTab) => this.handleTabChange(newTab)} tabNr={this.props.tabNr}/>
            <div className="grid">

            <Grid item xs={12}  style={{margin:"auto"}}>
                <Container maxWidth='false' className="tableContainer">
                    <Grid 
                        container   
                        direction="row"
                        justify='space-evenly'
                        spacing={4}
                        xs={12} 
                        style={{margin:"auto"}}
                    >
                        <Grid item container spacing={0}>
                            <Grid item xs={1} />
                            <Grid item xs={10}>
                                <Typography variant="h5">
                                    {"New " + modelSingular}
                                </Typography> 
                            </Grid>
                            <Grid item xs={1} position='relative'>
                            </Grid>       
                        </Grid> 
                        <Grid item xs={12} /> 
                        <Grid
                            component= {Paper}
                            container
                            item
                            xs={12}
                            direction="row"
                            justify="center"
                            spacing={8}
                        >
    
                            <Grid 
                            item
                            container
                            direction="row"
                            justify="center"
                            xs={12}
                            >
                                {profilePicture}
                            </Grid>
                            <Grid item xs={6}>
                                <Button
                                color= 'primary'
                                variant="outlined"
                                component="label"
                                onChange={(event) => {
                                    let blobURLref = URL.createObjectURL(event.target.files[0])
                                    if(event.target.files[0] !== ""){
                                        this.readUploadedFileAsDataURL(event.target.files[0]).then(
                                            (base64img) => {
                                                this.setState({base64ProfilePic: base64img})
                                            })
                                        this.setState({ profilePictureSrc: blobURLref })
                                    }
                                }}
                                >
                                Upload picture 
                                <input
                                accept="image/*"
                                type="file"
                                style={{ display: "none" }}
                                />
                                </Button>
                            </Grid>
                            <Grid container item xs={12} justify='center'>

                                <Grid container 
                                    item xs={6}
                                    justify='center'>
                                    {Object.keys(this.state.model).map((key) => {
                                        return(
                                            <Grid item xs={6}>
                                                <TextField 
                                                    hintText={'Enter ' +  key}
                                                    floatingLabelText={key} 
                                                    onChange={(event, newValue) => {
                                                        let temp_model = this.state.model;
                                                        temp_model[key] = newValue;
                                                        this.setState({ model: temp_model})}}
                                                    />
                                            </Grid>  )}) }  
                                </Grid>
                            </Grid>

                            <Grid item xs={3}>
                                    All marked fields (*) are mandatory fields
                            </Grid>

                            <Grid item xs={6}></Grid>
                                    
                        
                            <Grid item xs={3}>
                                Onboard User?
                                <Checkbox  
                                    onChange={this.handleOnboardCheckChange}
                                    color='primary'
                                    checked={this.state.onboardChecked}
                                    value="onboardChecked"
                                />
                            </Grid> 
                        </Grid>
                        <Grid item xs={12} />
                        <Grid item container 
                        justify='center'
                        xs={12}>
                            <Button  style={{color: 'white'}} onClick={(event) => this.handleClickAdd(event)} >
                                Submit
                            </Button>       
                        </Grid>
                    </Grid>
                </Container>
            </Grid>
        </div> 
        <Footer />
    </div>
</MuiThemeProvider>       
    );
  }
}

export default withRouter(newUserScreen);