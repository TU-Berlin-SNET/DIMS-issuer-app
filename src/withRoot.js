import React from "react";
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';

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