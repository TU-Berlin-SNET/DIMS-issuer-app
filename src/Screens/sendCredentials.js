import React, { Component } from 'react';
/*
Screen:LoginScreen
Loginscreen is the main screen which the user is shown on first visit to page and after
hitting logout
*/
/*
Module:Material-UI
Material-UI is used for designing ui of the app
*/
import styles from './../CSS/App.css';
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button';
import {withRouter} from "react-router-dom";
import TextField from '@material-ui/core/TextField';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import axios from 'axios';
import IssuerBar from "./../components/IssuerBar";
import * as Constants from "./../Constants";
import * as Utils from "./../Utils";
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Footer from "./../components/footer"
import { lighten, makeStyles } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';

import ListItem from '@material-ui/core/ListItem'
import List from '@material-ui/core/List';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import CircularVerification from "./../components/CircularVerification"
import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import CloseIcon from '@material-ui/icons/Close';
import { amber, green, red } from '@material-ui/core/colors';
import VisibilityIcon from '@material-ui/icons/Visibility';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import IconButton from '@material-ui/core/IconButton';
import clsx from 'clsx';




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

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(3),
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
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



function ProofDialog(props) {


  const classes = useStyles();
  const { onClose, selectedValue, open } = props;
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [proofState, setProofState] = React.useState("pending")
  const [verificationMessage, setVerificationMessage] = React.useState("The proof is pending")
  const [proofVis, setProofVis] = React.useState(null)
  const [proof, setProof] = React.useState(props.selectedValue)
  
   function handleSnackbarOpen() {
     setSnackbarOpen(true);
   }
 
   function handleSnackbarClose(event, reason) {
    setSnackbarOpen(false);
     if (reason === 'clickaway') {
       return;
     }
   }  

  function handleClose() {
    setProofVis(null)
    setProof(null)
    setProofState("pending")
    onClose(selectedValue);
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
         //alert("Proof " + isValid + " valid!")
        }
     }
     }
   }).catch(function (error) {
    setProofState("error")
    setVerificationMessage("Verification error. Please try again!")
    handleSnackbarOpen()
    console.log(error);
 })
 }

  function handleListItemClick(value) {
    onClose(value);
  }

  useEffect(() => {
    //For avoiding setting the proof once the value is set
      setProof(selectedValue)
    if(proof === undefined){
      setProofVis("no proof selected")
    } if(proof === null){
      setProofVis("no proof selected")
    } else if(proof.status === "received"){
      if(proof.hasOwnProperty("attrs")){
      setProofVis(<List>
            <ListItem>
            Sender DID: {proof.did}
            </ListItem>
            <ListItem>
            Status: {proof.status}
            </ListItem>
            <ListItem>
            Credential definition: {proof.cred_def_id}
            </ListItem>
            <ListItem>
            Schema: {proof.schema_id}
            </ListItem>
            <ListItem>
            Wallet: {proof.wallet}
            </ListItem>
            <ListItem>
            Created at: {proof.createdAt}
            </ListItem>
            <ListItem>
            Proof ID: {proof.id}
            </ListItem>
            <ListItem>
              <List>
              {proof.attrs.map((attr) => {return(
                <ListItem>
                {attr[0].replace("_referent","").replace(/_/g, " ") + ": " + attr[1]}
                </ListItem>
              )})}
              </List>
            </ListItem>
            <ListItem>
           <CircularVerification proofId={proof.id}/>
            </ListItem>
          </List>)
          } else {
            setProofVis(<List>
               <ListItem>
               Sender DID: {proof.did}
               </ListItem>
               <ListItem>
               Status: {proof.status}
               </ListItem>
               <ListItem>
               Credential definition: {proof.proof.identifiers[0].cred_def_id}
               </ListItem>
               <ListItem>
               Schema: {proof.proof.identifiers[0].schema_id}
               </ListItem>
               <ListItem>
               Wallet: {proof.wallet}
               </ListItem>
               <ListItem>
               Created at: {proof.createdAt}
               </ListItem>
               <ListItem>
               Proof ID: {proof.id}
               </ListItem>
               <ListItem>
                 <List>
                 {Object.keys(proof.proof.requested_proof.revealed_attrs).map((key) => {
                   let attr = proof.proof.requested_proof.revealed_attrs[key]
                   return(
                   <ListItem>
                   {key.replace("_referent","").replace(/_/g, " ") + ": " + attr["raw"]}
                   </ListItem>
                 )})}
                 </List>
               </ListItem>
               <ListItem>
                  <CircularVerification proofId={proof.id}/>
               </ListItem>
             </List>)
          }
      } else {
        setProofVis(<List>
            <ListItem>
            Sender DID: {proof.did}
            </ListItem>
            <ListItem>
            Status: {proof.status}
            </ListItem>
            <ListItem>
            Created at: {proof.createdAt}
            </ListItem>
            <ListItem>
            Proof ID: {proof.id}
            </ListItem>
            <ListItem>
            <CircularVerification proofId={proof.id}/>
            </ListItem>
          </List>)
      }
     
  },[proof,selectedValue,props.selectedValue]);

  return (
    <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
      <DialogTitle id="simple-dialog-title">Proof Request Details</DialogTitle>
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
      <div>
      {proofVis}
      </div>
    </Dialog>
  );
}

ProofDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  selectedValue: PropTypes.string.isRequired,
};
var tempAttributes = {}
//var apiBaseUrl = ""REPLACE"";
//var apiBaseUrl = ""REPLACE"";


class CredentialScreen extends Component {

    constructor(props){
        super(props);
        Utils.checkLogin(this)
       
        this.state={
            credReq: props.location.state.credReq,
            attributes: [],
            person: props.location.state.person,
            modelName: props.location.state.modelName
        }
      }
    


componentDidMount(){
  document.title = "issuer app"
  this.getAttributeNames(this.props.location.state.credReq)
  this.personAttributeNamesToLowerCase()

  this.timer = setInterval(() => {
    }, 5000
    );
}


componentWillUnmount() {
  clearInterval(this.timer);
  this.timer = null;
}

personAttributeNamesToLowerCase(){
  var attributeLowerCase
  var tempPerson = {}
  Object.keys(this.state.person).map((attribute) => {
     attributeLowerCase = attribute.toLowerCase()
     tempPerson[attributeLowerCase]  = this.state.person[attribute]
  })
}

getAttributeNames(credReq){
    let attributes= credReq.meta.offer.key_correctness_proof.xr_cap
    attributes= attributes.filter((elem => elem[0] !== "master_secret")) 
    this.loadValueFromDatabase(attributes)
}


sendCredentialsClick(){
  this.acceptCredentialRequestAndSendCred()
}




/* POST 
{
	"credentialRequestId": "5c7071b8db4eb00010a3779d",
	"values": {
		"given_name@string": "Jesse Digital",
        "address@string": "Digitalstreet 0101",
        "birth_date@date": "1998-01-19"
	}
}
*/

async acceptCredentialRequestAndSendCred(){
  let self = this
  var values = {};  // "object literal" syntax
  Object.keys(self.state.attributes).map((attr) => {

    
      let name = attr
      let value = self.state.attributes[attr]
      values[name] = value
  })

  var headers = {
    'Content-Type': 'application/json',
    'Authorization': localStorage.getItem("token")
  }
  var payload = {
    'credentialRequestId': this.state.credReq.id,
    'values': self.state.attributes
  }
  axios.post(apiBaseUrl + 'credential' ,payload, {headers: headers}).then(function (response) {
    if (response.status === 201) {
      self.props.history.push({
        pathname: '/db',
        state:{
          justIssuedCredentials : true,
        }
        })
    }
  }).catch(function (error) {
      console.log(error);
  });
}

handleTabChange(newTab){
  this.props.onTabChange(newTab)
}


toDate(wrongDateFormat){
   let year = wrongDateFormat.slice(0,4)
   let month= wrongDateFormat.slice(5,7)
   let day = wrongDateFormat.slice(8,10)
   return( month + "." + day + "." + year
           )
  }

loadValueFromDatabase(attributes){
   tempAttributes = {}

  let attribute_name
  
  for(let attr of attributes){
    attribute_name = attr[0]
    if(attribute_name.includes('0')){
      let index = attribute_name.indexOf('0')
      let obj = attribute_name.slice(index+1, attribute_name.length)
      attribute_name = attribute_name.slice(0, index)

      if(tempAttributes[attribute_name + '0' + obj] === undefined) tempAttributes[attribute_name + '0' + obj]= {}

        tempAttributes[attribute_name + '0' + obj] = this.state.person[obj][attribute_name]
    }
    else if(this.state.person[attribute_name] === undefined){
        tempAttributes[attribute_name] = 0
    }
    else{
      if(attr[0].includes("date"))
        tempAttributes[attribute_name] = this.toDate(this.state.person[attribute_name])
      else
        tempAttributes[attribute_name] = this.state.person[attribute_name]
    }
  }
  this.setState({attributes: tempAttributes}, () => this.forceUpdate())

}


createTextfields(key, index){

  return(      
    <Grid item xs={6} key={index}>
      <TextField   helperText={'Enter ' +  key}
                  defaultValue={this.state.attributes[key]}              
                  fullWidth
                  onChange={(event) => {
                  let values = this.state.attributes;
                  values[key] = event.target.value;                                         
                  this.setState({ attributes: values})}} 
                  
      />
    </Grid>
    ); 
  
}

render() {
  return(
    <MuiThemeProvider>
    <div className="App">
    <IssuerBar onTabChange={(newTab) => this.handleTabChange(newTab)} tabNr={this.props.tabNr}/>
    <div className= {styles.grid}>

        <Grid container item   xs={6}  style={{margin:"auto"}}>
            <Container className='tableContainer'>
 
            <Grid 
              container
              item   
              direction="row"
              justify='space-evenly'
              spacing={4}
              xs={12} style={{margin:"auto"}}>
                <Grid item container spacing={0} xs={12}>
                  <Grid item xs={1} position='relative'>
                    <Box position='absolute' left={16}>
                    </Box>
                  </Grid>
                  <Grid item xs={10}>
                    <Typography variant="h5">
                        Send Credentials 
                    </Typography> 
                  </Grid>
                  <Grid item xs={1} position='relative'>
                  </Grid>     
                </Grid>
                <Grid item xs={12} />
                    <Grid
                        item
                        component={Paper}
                        container
                        direction="row"
                        justify="center"
                        alignItems="flex-start"
                        spacing={8}
                        xs={12}
                        >
                        {/*padding*/}
                        <Grid container item xs={12} direction='column' alignContent='center' spacing={2}>
                            {Object.keys(this.state.attributes).map((key, index) => 
                              this.createTextfields(key, index)
                            )}
                        </Grid>
                    </Grid>
                    <Grid item xs={12} />
                    <Grid item xs={12}>
                        <Button  color='primary' style={{color:'white'}} onClick={(event) => this.sendCredentialsClick(event)}>Send</Button>
                    </Grid>
                  </Grid>        
            </Container>
        </Grid>
      </div>
      <Footer />
      </div>         
    </MuiThemeProvider>
    
  )
}

}

const style = {
    margin: 15,
};
  
  export default withRouter(CredentialScreen);
