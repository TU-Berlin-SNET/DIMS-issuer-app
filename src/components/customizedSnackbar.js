import React, { Component } from 'react';
/*
Screen:LoginScreen
Loginscreen is the main screen which the user is shown on first visit to page and after
hitting logout
*/
//import './../CSS/App.css';
/*
Module:Material-UI
Material-UI is used for designing ui of the app
*/

import PropTypes from 'prop-types';
import { orange, amber, green, red } from '@material-ui/core/colors';

import SnackbarContent from '@material-ui/core/SnackbarContent';
import Snackbar from '@material-ui/core/Snackbar';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import CloseIcon from '@material-ui/icons/Close';
import { lighten, makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import IconButton from '@material-ui/core/IconButton';



const useStylesSnackbar = makeStyles(theme => ({
  sent: {
    backgroundColor: green[600],
  },
  error: {
    backgroundColor: theme.palette.error.dark,
  },
  icon: {
    fontSize: 20,
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing(1),
  },
  message: {
    display: 'flex',
    alignItems: 'center',
  },
}));

const variantIcon = {
    sent: CheckCircleIcon,
    error: ErrorIcon,
  };

  function SnackbarContentWrapper(props) {
    const classes = useStylesSnackbar();
    const { className, message, onClose, variant, ...other } = props;
    const Icon = variantIcon[variant];
  
    return (
      <SnackbarContent
        className={clsx(classes[variant], className)}
        aria-describedby="client-snackbar"
        message={
          <span id="client-snackbar" className={classes.message}>
            <Icon className={clsx(classes.icon, classes.iconVariant)} />
            {message}
          </span>
        }
        action={[
          <IconButton key="close" aria-label="close" color="inherit" onClick={onClose}>
            <CloseIcon className={classes.icon} />
          </IconButton>,
        ]}
        {...other}
      />
    );
  }

  SnackbarContentWrapper.propTypes = {
    className: PropTypes.string,
    message: PropTypes.string,
    onClose: PropTypes.func,
    variant: PropTypes.oneOf(['sent','error']).isRequired,
  };


class CustomizedSnackbar extends Component {
    constructor(props){
      super(props);
      this.state={
        snackbarOpen: false,
        variant: "sent",
        message: "put you message here"
      }
    }

    componentWillReceiveProps(){
        console.log(this.props)
        this.setState({snackbarOpen: this.props.snackbarOpen, message: this.props.message, variant: this.props.variant })
    }
      
    handleSnackbarClose(event, reason) {
    this.setState({snackbarOpen: false})
    if (reason === 'clickaway') {
      return;
    }
    this.props.closeSnackbar();
  } 

  render(){
      return(
            <Snackbar
            anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
            }}
            open={this.state.snackbarOpen}
            autoHideDuration={1000}
            onClose={() => this.handleSnackbarClose()}
        >
            <SnackbarContentWrapper
            onClose={() => this.handleSnackbarClose()}
            variant={this.state.variant}
            message={this.state.message}
            />
        </Snackbar>
      )}
}

export default (CustomizedSnackbar);