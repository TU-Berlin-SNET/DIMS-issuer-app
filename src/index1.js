import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import OnboardingScreen from './Screens/newUser';
import SchemasScreen from './Screens/SchemasScreen';
import addASchemaScreen from './Screens/addASchemaScreen';
import CredentialDefScreen from './Screens/CredentialDefScreen';
import LandingScreen from './Screens/LandingScreen';
import LoginScreen from './Screens/LoginScreen';
import CredentialScreen from './Screens/CredentialScreen';
import ConnectionsScreen from './Screens/ConnectionsScreen';
import ProofScreen from './Screens/ProofScreen'
import { Route,  BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/styles';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import CssBaseline from '@material-ui/core/CssBaseline';
import IssuerBar from "./components/IssuerBar"
import AppBar from 'material-ui/AppBar';
import { bgcolor } from '@material-ui/system';


import { withStyles, createStyles } from '@material-ui/core';

import withRoot from './withRoot';
import PropTypes from 'prop-types';
const routing = (
    <Router>
        <Route exact path="/" component={App} />
        <Route path="/login" component={LoginScreen} />
        <Route path="/home" component={LandingScreen} />
        <Route path="/onboarding" component={OnboardingScreen} />
        <Route path="/connections" component={ConnectionsScreen} />
        <Route path="/credentialdef" component={CredentialDefScreen} />
        <Route path="/schemas" component={SchemasScreen} />
        <Route path="/addASchema" component={addASchemaScreen} />
        <Route path="/credential" component={CredentialScreen} />
        <Route path="/proofs" component={ProofScreen} />
    </Router>
  )


class Index extends React.Component{



  static childContextTypes = {
    muiTheme: PropTypes.object
}
getChildContext() {
    return {
        muiTheme: this.props.theme
    }
  }
    render(){
      console.log(this.props)
        const { classes } = this.props;
        return(
<div>{routing}</div>
        )
    }  
}

Index.propTypes = {
    classes: PropTypes.object.isRequired,
  };



  export default withRoot((Index));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
