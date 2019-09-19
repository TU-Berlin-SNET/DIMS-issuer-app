import React, { Component} from 'react';
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

import {withRouter, Link} from "react-router-dom";
import TextField from 'material-ui/TextField';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import axios from 'axios';
import IssuerBar from "./../components/IssuerBar";
import * as Constants from "./../Constants";
import * as Utils from "./../Utils";
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import CloseIcon from '@material-ui/icons/Close';
import AddIcon from '@material-ui/icons/Add';
import ArrowBackRounded from '@material-ui/icons/ArrowBackRounded';
import {createMuiTheme,  makeStyles} from '@material-ui/core/styles';
import InputBase from '@material-ui/core/InputBase';
import Box from '@material-ui/core/Box'
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Container from '@material-ui/core/Container'

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Divider from '@material-ui/core/Divider'

const apiBaseUrl = Constants.apiBaseUrl;


const useStyles = makeStyles(() => ({
  headline: {
    border: 0,
    fontSize: 24,
    borderRadius: 3,
    textAlign: 'center'
  },
  attributeList: {
    color:'#FFFFFF' , 
    textAlign:'center', 
    marginTop: '30px',
    marginBottom: '30px',
  },
}));



class addASchemaScreen extends Component {
  constructor(props){
    super(props);
    Utils.checkLogin(this)
  
let schema = props.location.state
console.log(schema)
    this.state={
      schema_name: schema.name,
      schema_version: schema.version,
      id: schema.id,
      tag: "",
      supportRevocation: false,
      schema_attrNames: schema.attributes
    }
  }


  async createCredentialDef(event){
    var self = this;
    var headers = {
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem("token") 
    }
    var credDef_payload = { 
      "schemaId": self.state.id, 
      "tag": self.state.tag, 
      "supportRevocation": self.state.supportRevocation
    }
    await axios.post(apiBaseUrl + "credentialdef", credDef_payload, {headers: headers}).then(function (response) {
      console.log(response);
            console.log(response.status);
            if (response.status === 201) {
              alert("credential definition sucessfully created!")
            }
    }).catch(function (error) {
      alert(error);
      console.log(error);
  });
  }
  

  componentWillMount(){
  }

  componentDidMount(){
    document.title = "issuer app"
  }

  handleClickNewCredDef(event){
    this.createCredentialDef(event)
  }
  /*
  Function:handleCloseClick
  Parameters: event,index
  Usage:This fxn is used to remove file from filesPreview div
  if user clicks close icon adjacent to selected file
  */




  currentAttribute(attr, index){
    return(
   <div>
        <ListItem key={index} item  alignItems='center'>
          <ListItemText align='center'>
              {attr}
          </ListItemText>
        </ListItem>
        < Divider />
        </div>
    )}


    handleTabChange(newTab){
      this.props.onTabChange(newTab)
    }

  render() {
    return (
      <MuiThemeProvider>
        <div className='App'>
        <IssuerBar onTabChange={(newTab) => this.handleTabChange(newTab)} tabNr={this.props.tabNr}/>
        <div className="grid">

        <Container maxWidth='false' className="tableContainer">
        <Box > 
    <Grid container   
         direction="row"
         justify='space-evenly'
         spacing={4}
         xs={12} style={{margin:"auto"}}>
                    <Grid item xs={12}>
                          <Box position='relative'>
                            <Box position="absolute" top={0} left={0}>
                              <Link  to={"schemas"}>
                                <ArrowBackRounded style={{color:'white'}} fontSize="large" />
                              </Link>
                            </Box>
                            <Typography variant="h5">
                                create new credential definiton
                            </Typography>      
                            </Box>
                         </Grid>
    <Grid item container xs={5}
          justify='center'
          component={Paper}
          >
        
          <Grid item container xs={12} justify='center'   >
          
              <Grid item container justify='flex-end' xs={6}>
                <Grid  item xs={6} >
                    <Typography align='left'> Schema name:</Typography>
                    <Typography align='left'> Schema version:</Typography>
                </Grid>
              </Grid>
              <Grid item container justify='flex-start' xs={6}>
                <Grid item xs={6}>
                    <Typography>{this.state.schema_name}:</Typography>
                    <Typography>{this.state.schema_version}</Typography>
                </Grid>
              
              </Grid>
          </Grid>
          
          <Grid item container xs={12} justify='center'  >
              <Grid item container justify='flex-end' xs={6}>
                <Grid item xs={6}>
                    <Typography align='left'> revocation:</Typography>
                </Grid>
              </Grid>
              <Grid item container justify='flex-start' xs={6}>
                <Grid item xs={6}>
                  <select value={this.state.supportRevocation} onChange={(event, newValue) => this.setState({ supportRevocation: JSON.parse(event.target.value) })}>
                    <option value={true}>enabled</option>
                    <option value={false}>disabled</option>
                  </select>
                </Grid>
              </Grid>
          </Grid>
          
        
          <Grid item container xs={12} justify='flex-start' >
        
                <Grid item xs={12}>
                      <TextField
                      hintText="Enter the tag for the schema"
                      floatingLabelText="Tag"
                      value={this.state.tag}
                      onChange={(event, newValue) => this.setState({ tag: newValue })}
                  />
                </Grid>
              
          </Grid>
    </Grid>
    <Grid container item xs={5} >

      <Grid item container xs={12} 
            component= {Paper} 
            justify='space-around' 
            spacing={4}
            alignItems='center' >
          <Grid item container xs={12} >
            <Grid item xs={12}  >
              <Typography>Attributes</Typography>
            </Grid>
          </Grid>
          <Box width='100%'>
          <List alignItems='center'>
          {this.state.schema_attrNames.map((attr, index) => {
              return( this.currentAttribute(attr, index) )
          })} 
          </List>
          </Box>
       </Grid>
    </Grid>
    <Grid item container 
          justify='center'
          xs={12}>
      <Button style={{color:'white'}} onClick={(event) => this.handleClickNewCredDef(event)}>
        Submit
      </Button>
    </Grid>
  </Grid>

  </Box>
  </Container>

  </div>
        </div>
      </MuiThemeProvider> 
    );
  }
}

export default withRouter(addASchemaScreen);

