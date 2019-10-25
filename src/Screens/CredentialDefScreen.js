import React, { Component } from 'react';
/*
Screen:LoginScreen
Loginscreen is the main screen which the user is shown on first visit to page and after
hitting logout
*/
import  './../CSS/App.css';

/*
Module:Material-UI
Material-UI is used for designing ui of the app
*/

import {withRouter} from "react-router-dom";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import axios from 'axios';
import IssuerBar from "./../components/IssuerBar";
import * as Constants from "./../Constants";
import * as Utils from "./../Utils";
import CUSTOMPAGINATIONACTIONSTABLE from "./../components/tablepagination.js"
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';
import Footer from "./../components/footer"
import Snackbar from "./../components/customizedSnackbar"

const apiBaseUrl = Constants.apiBaseUrl;


function CredentialDefTable(props) {
  return(
  <div className="grid">
    <Grid item xs={12} >
      <Container  maxWidth='false' className="tableContainer" >
        <Grid container   
              direction="row"
              justify='space-evenly'
              spacing={4}
              xs={12} 
              style={{margin:"auto"}}
        >
          <Grid item xs={12}>
            <Typography variant="h5">
              credential definitions
            </Typography> 
          </Grid>
          <Grid item xs={12} />
          <Grid item container xs={12}
                justify='center'
                component={Paper}
                spacing={8}
          >
            {props.this.state.credDefs}
          </Grid>
          <Grid item xs={12} />
        </Grid>
      </Container>
    </Grid>
  </div>
  );
}

class CredentialDefScreen extends Component {
/*
{
	"schemaId": "{{schema_id}}",
	"tag": "jesse-credential-def3",
	"supportRevocation": false
}
*/
  constructor(props){
    super(props);
    Utils.checkLogin(this)
    if( props.location.hasOwnProperty("state") && props.location.state !== undefined){
      this.state={
        credDefs: <CUSTOMPAGINATIONACTIONSTABLE data={[]} />,
        schemaId: "Click on the schema to select ID",
        tag: "Add your tag",
        supportRevocation: false,
        selected: "",
        snackbarOpen: false,
        snackbarMessage: "",
        snackbarVariant: "sent",
        checkIfNewCredDef:  props.location.state.hasOwnProperty("newCredDef") ?  props.location.state.newCredDef  : false, 
      }
    }
    else{
      this.state={
        credDefs: <CUSTOMPAGINATIONACTIONSTABLE data={[]} />,
        schemaId: "Click on the schema to select ID",
        tag: "Add your tag",
        supportRevocation: false,
        selected: "",
        snackbarOpen: false,
        snackbarMessage: "",
        snackbarVariant: "sent",
        checkIfNewCredDef:  false, 
      }
    }
  }
  

  
  handleGoToIssuingClick(credDefId){
    this.props.history.push({pathname: "/credential",state: {credDefId: credDefId}});
  }

  async listCredDefs(){
    var self = this;
    var headers = {
      'Authorization': localStorage.getItem("token")
    }
    await axios.get(apiBaseUrl + "credentialdef", {headers: headers}).then(function (response) {
      console.log(response);
      console.log(response.status);
      console.log(response.data);
      if (response.status === 200) {
    let credDefs = <CUSTOMPAGINATIONACTIONSTABLE 
                      onEdit={(event, selected) => self.handleEdit(event, selected)}
                      data={response.data} 
                      showAttr={["wallet", "credDefId", "data.ver"]}
                      rowFunctions={[]}/>
        self.setState({credDefs: credDefs})
      }
    }).catch(function (error) {
      console.log(error);
    });
  }

  handleEdit(event, selected){ //Fuction 
    this.setState({ selected: selected}); 
 } 

  componentDidMount(){
    document.title = "DIMS"
    this.listCredDefs()
    if(this.state.checkIfNewCredDef === true){
      this.setState({snackbarVariant: "sent", snackbarOpen: true, snackbarMessage: "new credential definition created"});
      this.forceUpdate()
    }
  }

  handleClickNewCredDef(event){
    this.createCredentialDef(event)
  }


 handleTabChange(newTab){
  this.props.onTabChange(newTab)
}


  render() {
    return (

      <MuiThemeProvider>
        <div className="App">
          <IssuerBar onTabChange={(newTab) => this.handleTabChange(newTab)} tabNr={this.props.tabNr}  parentContext={this}/>
          <CredentialDefTable this={this}/>
          <Footer />  
          <Snackbar message={this.state.snackbarMessage}
                  variant={this.state.snackbarVariant} 
                  snackbarOpen={this.state.snackbarOpen} 
                  closeSnackbar={() => this.setState({snackbarOpen: false})} 
        />
        </div>


    </MuiThemeProvider>
    );
  }
}

const style = {
  margin: 15,
};
export default withRouter(CredentialDefScreen);