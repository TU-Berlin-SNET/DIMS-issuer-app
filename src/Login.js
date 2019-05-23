import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import ChevronLeftIcon from 'material-ui/svg-icons/navigation/chevron-left';
import MenuIcon from 'material-ui/Menu';
import List from 'material-ui/List';
import ListItem from 'material-ui/List/ListItem';
import IconButton from 'material-ui/IconButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Divider from 'material-ui/Divider';
import Toolbar from 'material-ui/Toolbar';
import OnboardingScreen from './OnboardingScreen';
import axios from 'axios';
import { Link, withRouter, Redirect} from "react-router-dom";

var apiBaseUrl = ""REPLACE"";

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
    localloginComponent.push(
        <MuiThemeProvider>
        <div>
            <AppBar title="Login as Issuer">
            <Toolbar disableGutters={!this.state.draweropen}>
            <IconButton
              aria-label="Open drawer"
              onClick={this.handleDrawerOpen}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
          </AppBar>
            <Drawer
          variant="persistent"
          anchor="left"
          open={this.state.draweropen}
        >
          <div>
            <IconButton onClick={this.handleDrawerClose}>
              {<ChevronLeftIcon />}
            </IconButton>
          </div>
          <Divider />
          <List>
            {['Home', 'Onboarding', 'Credential', 'Schema'].map((text, index) => (
              <ListItem button key={text}>
                {text}
              </ListItem>
            ))}
          </List>
          <Divider />
        </Drawer>
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
}
handleDrawerOpen = () => {
        this.setState({ draweropen: true });
};
    
handleDrawerClose = () => {
        this.setState({ draweropen: false });
};



    componentWillMount(){
        var localloginComponent=[];
    localloginComponent.push(
        <MuiThemeProvider>
        <div>
        <AppBar title="Login to bank as issuer">
            <Toolbar disableGutters={!this.state.draweropen}>
            <IconButton
            color="blue"
              aria-label="Open drawer"
              onClick={this.handleDrawerOpen}/>
          </Toolbar>
          </AppBar>
            <Drawer
          variant="persistent"
          anchor="left"
          open={this.state.draweropen}
        >
          <div>
            <IconButton onClick={this.handleDrawerClose}>
              {<ChevronLeftIcon />}
            </IconButton>
          </div>
          <Divider />
          <List>
            {['Home', 'Onboarding', 'Credential', 'Schema'].map((text, index) => (
              <ListItem button key={text}>
                {text}
              </ListItem>
            ))}
          </List>
          <Divider />
        </Drawer>
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