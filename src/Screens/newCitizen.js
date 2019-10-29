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

import {withRouter, Link} from "react-router-dom";
import TextField from '@material-ui/core/TextField';
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
import ArrowBackRounded from '@material-ui/icons/ArrowBackRounded';

const mongoDBBaseUrl = Constants.mongoDBBaseUrl;
//var apiBaseUrl = ""REPLACE"";
//var apiBaseUrl = ""REPLACE"";

const avatarImageStyle = {
    width: 200,
    height: 200,
  };
var temp_model = {}

  
class newUserScreen extends Component {
  constructor(props){

     let   updatePerson = props.location.state.updatePerson


     let modelName = props.location.state.modelName

    super(props);
    Utils.checkLogin(this)
    this.state={
      connection_message: '',
      person_did:'',
      onboardChecked: false,
      person: props.location.state.person !== undefined? props.location.state.person : undefined ,
      did: "",
      profilePictureSrc: props.location.state.picture !== undefined? props.location.state.picture : null , 
      base64ProfilePic: props.location.state.picture !== undefined? props.location.state.picture : "" ,   
      snackbarOpen: false,
      snackbarMessage: "",
      snackbarVariant: "sent",
      model: {},
      modelName: modelName,
      modelSingular: modelName.slice(0, modelName.length-1),
      flag : false,
      updatePerson: updatePerson,

    }

  }


componentDidMount(){
      if(this.state.person !== undefined) temp_model = this.state.person
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


async addNewPerson(){
        
        var self = this;
        var headers = {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem("token") 
        }

        if(self.state.updatePerson === false){

            await axios.post(mongoDBBaseUrl + self.state.modelName , self.state.model, {headers}).then(function (response) {
                if (response.status === 200) {
                
                    console.log(JSON.stringify(self.state.model))
                    if(self.state.onboardChecked===true){
                        self.props.history.push({
                            pathname: '/onboarding',
                            state: { person_id: self.state.person.id,
                                    person_did: self.state.did,
                                    modelName: self.state.modelName
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
                    self.setState({flag: false})
                    console.log(error);
            });
        }     
}

async editPerson(){
    var self = this;
    var headers = {
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem("token") 
    }

    if(self.state.updatePerson === true){
        await axios.put(mongoDBBaseUrl + self.state.modelName + '/' + self.state.person.id , self.state.model, {headers}).then(function (response) {
            if (response.status === 200) {
            
            console.log(JSON.stringify(self.state.model))
            if(self.state.onboardChecked===true){
                self.props.history.push({
                    pathname: '/onboarding',
                    state: { person_id: self.state.person.id,
                            person_did: self.state.did,
                            modelName: self.state.modelName
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
}


handleClickAdd(evet){
    this.setState({flag: true}, () =>
        this.setState({model: temp_model}, () => {
            if(this.state.person === undefined){
                this.setState({person: temp_model}, () => {
                    this.addNewPerson()
                })  
            }
            else{
                console.log('aa')
                this.setState({person: temp_model}, () => {
                    this.editPerson()
                })  
            }
        })
    )
}






async getModel(event){
    var self = this;
    var rawModel = {};
    var model ={};
    var headers = {
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem("token") 
    }
    await axios.get(mongoDBBaseUrl + "models" , {headers}).then(function (response) {
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

  requiredField(key){
  }

  handleAttributeValueChanged(path, key, newValue){
      console.log(temp_model)
    if(path !== ""){
        if(temp_model[path] === undefined) temp_model[path] = {}
        if(newValue === ""){
            delete temp_model[path]
            return
        }         
        temp_model[path][key] = newValue;
    }
    else{
        temp_model[key] = newValue;
    }
    console.log(temp_model)
  }
  

toDate(wrongDateFormat){
     let year = wrongDateFormat.slice(0,4)
     let month= wrongDateFormat.slice(5,7)
     let day = wrongDateFormat.slice(8,10)
     return( month + "." + day + "." + year
             )
    }

createFields(model, person, path){
    if(this.state.flag === false){
    var component = []
    var is_required = false
    var keys = Object.keys(model)
    for (let key of keys){
    if(person !== undefined){
      if(model[key].hasOwnProperty('type')) {
        is_required = model[key].hasOwnProperty('required') ? " * " : ""
            if(person[key]!== undefined){
                if(model[key].type === 'Date'){
                    component.push(
                        <Grid item xs={6}>
                            <TextField   helperText={is_required + 'Enter ' +  key}
                                         defaultValue={this.toDate(person[key])}
                                         margin='normal'       
                                         onChange= { (event) => this.handleAttributeValueChanged(path, key, event.target.value) }   
                            ></TextField>
                        </Grid>
                  )
                }
                else{
                    component.push(
                        <Grid item xs={6}>
                            <TextField   helperText={is_required + 'Enter ' +  key}
                                         defaultValue={person[key]}
                                         margin='normal'       
                                         onChange= { (event) => this.handleAttributeValueChanged(path, key, event.target.value) }   
                            ></TextField>
                        </Grid>
                  )
                }
              }
              else{
                component.push(
                  <Grid item xs={6}>
                      <TextField helperText={is_required + 'Enter ' +  key}
                              margin='normal'         
                              onChange= { () => this.handleAttributeValueChanged(path, key, person[key]) }   
       
                      ></TextField>
                  </Grid>
                )
              } 
            }
            else{
                component.push(<Grid item container xs={12} justify='center'>
                                  <Grid item container xs={10} style={{backgroundColor: 'Whitesmoke'}}>
                                    <Grid item xs={12} style={{backgroundColor: 'lightgrey'}}>
                                      <Typography>{key}</Typography>
                                    </Grid>
                                    <Grid item xs={12} container justify='center'>                  
                                        {this.createFields(model[key], person[key], key)}                         
                                    </Grid>
                                  </Grid>
                              </Grid>)
              }
      }
      else{
        if(model[key].hasOwnProperty('type')) {
                is_required = model[key].hasOwnProperty('required') ? " * " : ""
                component.push(
                      <Grid item xs={6}>
                          <TextField   helperText={is_required + 'Enter ' +  key}
                                       margin='normal'       
                                       onChange= { (event) => this.handleAttributeValueChanged(path, key, event.target.value) }   
                          ></TextField>
                      </Grid>
                )
              }
        else{
            component.push(<Grid item container justify = 'center' xs={12}>
                                <Grid item container xs={10} style={{backgroundColor: 'Whitesmoke'}}>
                                <Grid item xs={12} style={{backgroundColor: 'lightgrey'}}>
                                    <Typography>{key}</Typography>
                                </Grid>
                                <Grid container item xs={12} justify='center'>                  
                                    {this.createFields(model[key], undefined, key)}                         
                                </Grid>
                                </Grid>
                            </Grid>)
            }
      }


    }
    return component
}
} 

  render() {
    let profilePicture = this.state.profilePictureSrc !== null ? <Avatar style={avatarImageStyle} alt="Profile picture" src={this.state.profilePictureSrc} /> :  <Avatar style={avatarImageStyle} alt="Profile picture">photo</Avatar>
    return (
      <MuiThemeProvider>
        <div className="App">
            <IssuerBar onTabChange={(newTab) => this.handleTabChange(newTab)} tabNr={this.props.tabNr} parentContext={this}/>
            <div className="grid">
            <Grid item xs={12}  style={{margin:"auto"}}>
                <Container maxWidth={false} className="tableContainer">
                    <Grid 
                        container   
                        item
                        direction="row"
                        justify='space-evenly'
                        spacing={4}
                        xs={12} 
                        style={{margin:"auto"}}
                    >
                        <Grid item container spacing={0}>
                            <Grid item xs={1} >       
                                <Link  to={"db"}>
                                <ArrowBackRounded style={{color:'white'}} fontSize="large" />
                                </Link>  
                            </Grid>
                            <Grid item xs={10}>
                                <Typography variant="h5">
                                    {"add " + this.state.modelSingular}
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
                                                this.setState({base64ProfilePic: base64img}, () =>
                                                temp_model.picture = this.state.base64ProfilePic,
                                                )
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
                                    item xs={8}
                                    justify='center'
                                    spacing={2}>
                                       {this.createFields(this.state.model, this.state.person, "")}
                                                        
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