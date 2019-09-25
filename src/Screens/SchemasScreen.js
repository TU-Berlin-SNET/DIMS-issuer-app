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

import {withRouter, Link} from "react-router-dom";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import axios from 'axios';
import IssuerBar from "./../components/IssuerBar";
import Footer from "./../components/footer"
import * as Constants from "./../Constants";
import * as Utils from "./../Utils";
import CUSTOMPAGINATIONACTIONSTABLE from "./../components/tablepagination.js"
import Grid from '@material-ui/core/Grid';
import AddIcon from '@material-ui/icons/Add';
import Box from '@material-ui/core/Box'
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper'
import OnboardIcon from "@material-ui/icons/Work"
import DeleteIcon from "@material-ui/icons/Delete"
import EditIcon from '@material-ui/icons/Edit'
import CredentialIcon from '@material-ui/icons/Assignment'
import Button from '@material-ui/core/Button'
const apiBaseUrl = Constants.apiBaseUrl;


function SchemaTable(props) {
  return(
  <div className="grid">
    <Grid item xs={12}  style={{margin:"auto"}}>
        <Container maxWidth='false' className="tableContainer">
        <Grid container   
      direction="row"
      justify='space-evenly'
      spacing={4}
      xs={12} style={{margin:"auto"}}>
        <Grid item container spacing={0} xs={12}>
            <Grid item xs={1} />
            <Grid item xs={10}>
            <Typography variant="h5">
              Schemas
            </Typography> 
            </Grid>
            <Grid item xs={1} position='relative'>
              <Box position='absolute' right={16}>
            <Button
              component={Link} 
              to={{
              pathname: "newSchema",
              state: {selected: props.this.state.selected, tabNr:props.this.props.tabNr},
              }}>
              <AddIcon style={{color:'white'}} fontSize="large" /> 
            </Button>
            </Box>
        </Grid> 
        </Grid>
      <Grid item xs={12} />
      <Grid item container xs={12}
        justify='center'
        component={Paper}
        spacing={8}
        >
                    {props.this.state.schemas}
          </Grid>
        <Grid item xs={12} />
          </Grid>
        </Container>
    </Grid>
  </div>
  );
}


//var apiBaseUrl = ""REPLACE"";
//var apiBaseUrl = ""REPLACE"";

/*
Module:superagent
superagent is used to handle post/get requests to server
*/
//var request = require('superagent');


class SchemaScreen extends Component {
  constructor(props){
    super(props);
    Utils.checkLogin(this)

    this.state={
      schemas: <CUSTOMPAGINATIONACTIONSTABLE data={[]} showAttr={["name","version", "schemaId"]}/>,
      selected: "",
    }
  }

  
  async listSchemas(){
    var self = this;
    var headers = {
      'Authorization': localStorage.getItem("token")
    }
    await axios.get(apiBaseUrl + "indyschema", {headers: headers}).then(function (response) {
      if (response.status === 200) {
        let schemas = <CUSTOMPAGINATIONACTIONSTABLE 
        onEdit={(event, selected) => self.handleEdit(event, selected)} 
        data={response.data} 
        showAttr={["name","version", "schemaId"]}
        rowFunctions={[
         { 
           rowFunction: function(selected){self.editSchema(selected)},
           rowFunctionName: 'Edit',
           rowFunctionIcon: <EditIcon />,
         },
         {
          rowFunction: function(selected){self.createCredDef(selected)},
          rowFunctionName: 'create Credential Definition',
          rowFunctionIcon: <CredentialIcon />,
         }
        ]}/>
        self.setState({schemas: schemas});
      }
    }).catch(function (error) {
      //alert(error);
      console.log(error);
    });
  }

  componentDidMount(){
    document.title = "issuer app"
    this.listSchemas()
  }


  editSchema(selected){

  }

  createCredDef(selected){
    console.log(selected)
    this.props.history.push({
      pathname: '/newCredDef',
      state: { name: selected.name,
              version: selected.version,
              id: selected.schemaId,
              attributes: selected.attrNames
        }
    })

  }

  handleClickNewSchema(event){
    this.createSchema(event)
  }

  handleEdit(event, selected){ //Fuction 
    this.setState({ selected: selected}); 
 } 

 handleTabChange(newTab){
  this.props.onTabChange(newTab)
}
  render() {

    return (
      <MuiThemeProvider>
        <div className='App'>
        <IssuerBar onTabChange={(newTab) => this.handleTabChange(newTab)} tabNr={this.props.tabNr}/>
          <SchemaTable this={this}/>
          <Footer />
        </div>
      </MuiThemeProvider> 
    );
  }
}

export default withRouter(SchemaScreen);


