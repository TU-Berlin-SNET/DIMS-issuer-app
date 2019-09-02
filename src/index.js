import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './Screens/App';
import * as serviceWorker from './serviceWorker';
import OnboardingScreen from './Screens/OnboardingScreen';
import SchemasScreen from './Screens/SchemasScreen';
import addASchemaScreen from './Screens/addASchemaScreen';
import CredentialDefScreen from './Screens/CredentialDefScreen';
import LandingScreen from './Screens/LandingScreen';
import CredentialScreen from './Screens/CredentialScreen';
import ConnectionsScreen from './Screens/ConnectionsScreen';
import ProofScreen from './Screens/ProofScreen'
import { Route,  BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/styles';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import IssuerBar from "./components/IssuerBar"
import AppBar from 'material-ui/AppBar';
import { bgcolor } from '@material-ui/system';




import { WithStyles, createStyles } from '@material-ui/core';
import Index from './index1';

ReactDOM.render(<Index />, document.querySelector('#root'));
  
  

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
