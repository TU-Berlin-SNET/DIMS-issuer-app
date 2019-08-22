import React from 'react';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import IssuerBar from "./IssuerBar"

const theme = createMuiTheme({
  overrides: {
    MuiButton: {
      root: {
        fontSize: '1rem',
      },
    },
  },
  palette: {
      primary = '#000000'
  }
});

export default function nIssuerBar {
  return (
    <MuiThemeProvider theme={theme}>
<IssuerBar/>
    </MuiThemeProvider>
  );
}
