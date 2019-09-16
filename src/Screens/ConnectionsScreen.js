import React, { Component } from 'react';
/*
Screen:LoginScreen
Loginscreen is the main screen which the user is shown on first visit to page and after
hitting logout
*/
import './../CSS/App.css';
/*
Module:Material-UI
Material-UI is used for designing ui of the app
*/

import Button from '@material-ui/core/Button';
import {withRouter} from "react-router-dom";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import axios from 'axios';
import IssuerBar from "./../components/IssuerBar";
import * as Constants from "./../Constants";
import * as Utils from "./../Utils";
import CUSTOMPAGINATIONACTIONSTABLE from "./../components/tablepagination.js"
import Box from '@material-ui/core/Box'
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import {createMuiTheme,  makeStyles} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Footer from "./../components/footer"

const apiBaseUrl = Constants.apiBaseUrl;


function SchemaTable(props) {
    return(
        <div className="grid">
        <Grid item xs={12} style={{margin:"auto"}}>
            <Container maxWidth='false'  className="tableContainer">
            <Box position="relative" >
                <Typography  variant="h5">
                Pairwise Connections
                </Typography>
            </Box>
            {props.this.state.pairwiseConnections}
            </Container>
        </Grid>
        </div>
    );
}
        

//var apiBaseUrl = ""REPLACE"";
//var apiBaseUrl = ""REPLACE"";

class ConnectionScreen extends Component {

    constructor(props){
        super(props);
        Utils.checkLogin(this)
        this.state={
          selectedRecipientDid: "",
          pairwiseConnections: <CUSTOMPAGINATIONACTIONSTABLE  
            data={[]}
            showAttr={["theirUsername","their_did", "theirEndpointDid"]}/>,
          selected: ""
        }
      }

    /*
{
        "my_did": "SRo7SD6Xr9WxL7pw82tByD",
        "their_did": "JrzrHXfRd56n4uNXMh7myT",
        "metadata": {
            "theirEndpointDid": "N9gtWsma4FW3o2yHSrL2xW",
            "theirEndpointVk": "CXb21LEVwq5Z1LABZUfnv6ESXyirmEWJV8MZvw3CmNgW",
            "theirEndpoint": "http://172.16.0.100:8000/indy",
            "acknowledged": true
        }
    }
*/

    handleGoToIssuingClick(){
        this.props.history.push({pathname: "/credential",state: {recipientDid: this.state.selected.their_did}});
    }


    componentDidMount(){
        document.title = "issuer app"
        this.listPairwiseConnections()
    }

    handleEdit(event, selected){ //Fuction 
      this.setState({ selected: selected}); 
   } 
   
    // GET wallet/default/connection
    async listPairwiseConnections(){
        var self = this;
        var headers = {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem("token")
        }
        /* not used??

        var payload = {
            'credentialRequestId': this.state.credentialRequestId,
            'values': this.state.credentialValues
        }

        */
       
        await axios.get(apiBaseUrl + "wallet/default/connection", {headers: headers}).then(function(response){
            if (response.status === 200) {

            let data= []
              let pairwiseConnections = <CUSTOMPAGINATIONACTIONSTABLE 
              onEdit={(event, selected) => self.handleEdit(event, selected)} 
              data={data} 
              showAttr={["theirUsername","their_did", "theirEndpointDid"]}
              rowFunctions={[]}/>
              response.data.map((conn) => {
                  data.push(
                    {
                        "my_did": conn.my_did, 
                        "their_did": conn.their_did, 
                        "theirEndpointDid": conn.metadata.theirEndpointDid,
                        "theirEndpointVk": conn.metadata.theirEndpointVk,
                        "theirEndpoint": conn.theirEndpoint,
                        "theirUsername": conn.metadata.username
                    }
                  )
              })
              self.setState({
                  pairwiseConnections: pairwiseConnections
              })
            }
          }).catch(function (error) {
          console.log(error);
          });
    }

    handleTabChange(newTab){
      this.props.onTabChange(newTab)
    }
    
    
    render(){
      return(
        <MuiThemeProvider>
        <div className="App">
        <IssuerBar onTabChange={(newTab) => this.handleTabChange(newTab)} tabNr={this.props.tabNr}/>
           {/* <div>
                Selected recipient: {this.state.selected.their_did}
                <Button variant='contained' color='primary' onClick={() => this.handleGoToIssuingClick()} >Issue credential</Button>
           </div> */}
        <SchemaTable this={this}/>
        <Footer />  
      </div>
      </MuiThemeProvider>
      )   
    }

}

  
  export default withRouter(ConnectionScreen);