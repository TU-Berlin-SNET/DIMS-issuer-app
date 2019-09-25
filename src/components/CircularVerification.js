import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import { green,red } from '@material-ui/core/colors';
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import CheckIcon from '@material-ui/icons/Check';
import SearchIcon from '@material-ui/icons/Search';
import axios from 'axios';
import * as Constants from "./../Constants";
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import CloseIcon from '@material-ui/icons/Close';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';

const apiBaseUrl = Constants.apiBaseUrl;

const variantIcon = {
    valid: CheckCircleIcon,
    invalid: ErrorIcon,
    pending: InfoIcon,
    error: ErrorIcon,
  };
  
  const useStylesProofSnackbar = makeStyles(theme => ({
    valid: {
      backgroundColor: green[600],
    },
    invalid: {
      backgroundColor: theme.palette.error.dark,
    },
    pending: {
      backgroundColor: theme.palette.primary.main,
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
  
  function ProofSnackbarContentWrapper(props) {
    const classes = useStylesProofSnackbar();
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
  
  ProofSnackbarContentWrapper.propTypes = {
    className: PropTypes.string,
    message: PropTypes.string,
    onClose: PropTypes.func,
    variant: PropTypes.oneOf(['valid', 'invalid', 'pending','error']).isRequired,
  };

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    alignItems: 'center',
  },
  wrapper: {
    margin: theme.spacing(1),
    position: 'relative',
  },
  buttonSuccess: {
    backgroundColor: green[500],
    '&:hover': {
      backgroundColor: green[700],
    },
  },
  buttonError: {
    backgroundColor: red[500],
    '&:hover': {
      backgroundColor: red[700],
    },
  },
  fabProgress: {
    color: green[500],
    position: 'absolute',
    top: -6,
    left: -6,
    zIndex: 1,
  },
  buttonProgress: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
}));

export default function CircularVerification(props) {
  const classes = useStyles();
  const { proofId } = props;
  const [loading, setLoading] = React.useState(false);
  const [proofState, setProofState] = React.useState("pending");
  const [verificationMessage, setVerificationMessage] = React.useState("Verify proof");
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);

  function handleSnackbarOpen() {
    setSnackbarOpen(true);
  }

  function handleSnackbarClose(event, reason) {
   setSnackbarOpen(false);
    if (reason === 'clickaway') {
      return;
    }
  }  


  /* GET /api/proof/:proof_request_id

*/
async function verifyProof(proofId){
    var headers = {
     'Content-Type': 'application/json',
     'Authorization': localStorage.getItem("token") 
    }
    await axios.get(apiBaseUrl + 'proof/' + proofId , {headers: headers}).then(function (response) {
       console.log(response);
       console.log(response.status);
       if (response.status === 200) {
         let proof = response.data
         if(typeof(proof.isValid) == 'undefined'){
          setProofState("error")
          setVerificationMessage("Verification failed. Please try again!")
          handleSnackbarOpen()
         } else {
           if(proof.status === "pending"){
            setProofState("pending")
            setVerificationMessage("The proof is pending")
            handleSnackbarOpen()
          } else {
           let isValid = proof.isValid ? "valid" : "invalid"
           let isValidM = proof.isValid ? "valid" : "not valid"
           setVerificationMessage("The proof is " + isValidM)
           setProofState(isValid)
           handleSnackbarOpen()
          }
       }
       }
     }).catch(function (error) {
      setProofState("error")
      setVerificationMessage("Verification error. Please try again!")
     console.log(error);
   })
   }

  const buttonClassname = clsx({
    [classes.buttonSuccess]: proofState === "valid",
  });


  const handleButtonClick = () => {
      setLoading(true);
      verifyProof(proofId).then(() => setLoading(false));
  };

  let verIcon = <SearchIcon />
  if(proofState === "valid"){ 
    verIcon =  <CheckIcon />
  } else if(proofState === "pending"){ 
    verIcon =  <SearchIcon />
  } else if(proofState === "invalid"){ 
    verIcon =  <ErrorIcon />
  } else if(proofState === "error"){ 
    verIcon =  <ErrorIcon />
  } else { 
    verIcon =  <SearchIcon />
  }
  return (
    <div className={classes.root}>
      <div className={classes.wrapper}>
        <Fab
          aria-label="save"
          color="primary"
          className={buttonClassname}
          onClick={handleButtonClick}
        >
          {verIcon}
        </Fab>
        {loading && <CircularProgress size={68} className={classes.fabProgress} />}
      </div>
      <div className={classes.wrapper}>
        <Button
          variant="contained"
          color="primary"
          className={buttonClassname}
          disabled={loading}
          onClick={handleButtonClick}
        >
          {verificationMessage}
        </Button>
        {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
      </div>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <ProofSnackbarContentWrapper
          onClose={handleSnackbarClose}
          variant={proofState}
          message={verificationMessage}
        />
      </Snackbar>
    </div>
  );
}