import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import axios from 'axios';
import {withRouter} from "react-router-dom";
import IssuerBar from "./IssuerBar"
import * as Constants from "./Constants"
const apiBaseUrl = Constants.apiBaseUrl;

//var apiBaseUrl = ""REPLACE"";
//var apiBaseUrl = ""REPLACE"";


class Login extends Component {
    constructor(props) {
        super(props);
        
        var localloginComponent=[];
        this.state = {
            username: '',
            password: '',
            loginComponent:localloginComponent,
            draweropen: false
        }
}
handleDrawerOpen = () => {
        this.setState({ draweropen: true });
};
    
handleDrawerClose = () => {
        this.setState({ draweropen: false });
};

componentDidMount(){
    document.title = "issuer app"
  }



    componentWillMount(){
        
    }

    handleLoginClick(event) {
        var self = this;
        var payload = {
            "username": this.state.username,
            "password": this.state.password
        }
        axios.post(apiBaseUrl + 'login', payload)
            .then(function (response) {
                console.log(response);
                console.log(response.status);
                if (response.status === 200) {
                    console.log("Login successfull");
                    console.log(response.data.token);
                    //var issuerScreen = [];
                    //issuerScreen.push(<IssuerScreen appContext={self.props.appContext} />)
                    //self.props.appContext.setState({ loginPage: [], issuerScreen: issuerScreen })
                    localStorage.setItem('token', response.data.token)
                    self.props.handler()
                    self.props.history.push("/onboarding");


                }
                else if (response.status === 204) {
                    console.log("Username password do not match");
                    alert("username password do not match")
                }
                else {
                    console.log("Username does not exists");
                    alert("Username does not exist");
                }
            })
            .catch(function (error) {
                alert(error);
                console.log(error);
            });
    }
    render() {
        return (
          <MuiThemeProvider>
          <div>
              <IssuerBar />
              <TextField
                  hintText="Enter your Username"
                  floatingLabelText="Username"
                  onChange={(event, newValue) => this.setState({ username: newValue })}
              />
              <br />
              <TextField
                  type="password"
                  hintText="Enter your Password"
                  floatingLabelText="Password"
                  onChange={(event, newValue) => this.setState({ password: newValue })}
              />
              <br />
              <RaisedButton label="Submit" primary={true} style={style} onClick={(event) => this.handleLoginClick(event)} />
          </div>
          
      </MuiThemeProvider>
            
        );
    }
}
const style = {
    margin: 15,
};
export default withRouter(Login);