import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import IssuerScreen from './IssuerScreen'
import axios from 'axios';
import { Link, withRouter, Redirect} from "react-router-dom";

class Login extends Component {
    constructor(props) {
        super(props);
        var localloginComponent=[];
    localloginComponent.push(
        <MuiThemeProvider>
        <div>
            <AppBar title="Login" />
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
            <RaisedButton label="Submit" primary={true} style={style} onClick={(event) => this.handleClick(event)} />
        </div>
    </MuiThemeProvider>
    )
    this.state = {
        username: '',
        password: '',
        loginComponent:localloginComponent
    }
    }
    componentWillMount(){
        var localloginComponent=[];
    localloginComponent.push(
        <MuiThemeProvider>
        <div>
            <AppBar title="Login" />
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
            <RaisedButton label="Submit" primary={true} style={style} onClick={(event) => this.handleClick(event)} />
        </div>
    </MuiThemeProvider>
    )
    this.setState({loginComponent:localloginComponent})
    }
    handleClick(event) {
        var apiBaseUrl = "http://localhost:8000/api/";
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
                    self.props.history.push("/issuer");


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
            <div>
            {this.state.loginComponent}
            </div>
        );
    }
}
const style = {
    margin: 15,
};
export default withRouter(Login);