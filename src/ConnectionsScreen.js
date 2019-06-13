import React, { Component } from 'react';
/*
Screen:LoginScreen
Loginscreen is the main screen which the user is shown on first visit to page and after
hitting logout
*/
import './App.css';
/*
Module:Material-UI
Material-UI is used for designing ui of the app
*/
import injectTapEventPlugin from 'react-tap-event-plugin';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import FontIcon from 'material-ui/FontIcon';
import {blue500, red500, greenA200} from 'material-ui/styles/colors';
import { Link, withRouter, Redirect} from "react-router-dom";
import TextField from 'material-ui/TextField';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {List, ListItem} from 'material-ui/List'
import axios from 'axios';
import * as Constants from "./Constants"
import IssuerBar from "./IssuerBar"

const apiBaseUrl = Constants.apiBaseUrl;

//var apiBaseUrl = ""REPLACE"";
//var apiBaseUrl = ""REPLACE"";

class ConnectionScreen extends Component {

    constructor(props){
        super(props);
        this.state={
          selectedRecipientDid: "",
          pairwiseConnections: []
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
        this.props.history.push({pathname: "/credential",state: {recipientDid: this.state.selectedRecipientDid}});
    }


    componentDidMount(){
        this.listPairwiseConnections()
    }
    // GET wallet/default/connection
    async listPairwiseConnections(){
        var self = this;
        var headers = {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem("token")
        }
        var payload = {
            'credentialRequestId': this.state.credentialRequestId,
            'values': this.state.credentialValues
        }
        await axios.get(apiBaseUrl + "wallet/default/connection", {headers: headers}).then(function(response){
            console.log(response);
            console.log(response.status);
            if (response.status === 200) {
              let pairwiseConnections = response.data.map((conn) => {
                  return(
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
          alert(error);
          console.log(error);
          });
    }

    render(){
      return(
        <div className="App">
        <MuiThemeProvider>
        <IssuerBar />
            <div>
                Selected recipient: {this.state.selectedRecipientDid}
                <RaisedButton label="Issue credential" 
                primary={true} style={style} 
                onClick={() => this.handleGoToIssuingClick()} 
                />
            </div>
        <div>
        <br />
        Pairwise connections:
        <br />
        <List>
        {this.state.pairwiseConnections.map((connection) => {return(
            <ListItem onClick={() => this.setState({selectedRecipientDid: connection.their_did})} >
                Username: {connection.theirUsername}
                <br />
                DID: {connection.their_did}
                <br />
                Endpoint DID: {connection.theirEndpointDid}
                <br />
            </ListItem>
                );
              })}
        </List>
        </div>
        </MuiThemeProvider>
      </div>
      )   
    }

}

const style = {
    margin: 15,
};
  
  export default withRouter(ConnectionScreen);