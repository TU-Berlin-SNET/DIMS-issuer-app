import React from "react";
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';

import {createMuiTheme } from '@material-ui/core/styles';  
import purple from "@material-ui/core/colors/purple";
import green from "@material-ui/core/colors/green";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from 'material-ui/TextField';
import AppBar from "material-ui/AppBar/AppBar";
import IssuerBar from "./components/IssuerBar";
import theme from './theme'
// A theme with custom primary and secondary color.
// It's optional.


function withRoot(Component) {
  function WithRoot(props) {
    // MuiThemeProvider makes the theme available down the React tree
    // thanks to React context.
    return (

      <MuiThemeProvider  theme={theme} children={  <Component {...props} />}>

      </MuiThemeProvider>
    );
  }

  return WithRoot;
}

export default withRoot;