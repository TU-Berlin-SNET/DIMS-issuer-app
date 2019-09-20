import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { lighten, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import SearchIcon from '@material-ui/icons/Search';
import SecurityIcon from '@material-ui/icons/Security';
import FilterListIcon from '@material-ui/icons/FilterList';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import * as Constants from "./../Constants";
import * as Utils from "./../Utils"
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import WarningIcon from '@material-ui/icons/Warning';
import Snackbar from '@material-ui/core/Snackbar';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import CloseIcon from '@material-ui/icons/Close';
import { amber, green, red } from '@material-ui/core/colors';
import VisibilityIcon from '@material-ui/icons/Visibility';

import CircularProgress from '@material-ui/core/CircularProgress';
import Fab from '@material-ui/core/Fab';

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


const apiBaseUrl = Constants.apiBaseUrl;

function ProofDialog(props) {
  const classes = useStyles();
  const { onClose, selectedValue, open } = props;
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [proofState, setProofState] = React.useState("pending")
  const [verificationMessage, setVerificationMessage] = React.useState("The proof is pending")
 
 
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
  
  let proof = selectedValue

  let proofVis = null
  if(proof === undefined){
    proofVis = "no proof selected"
  } if(proof === null){
    proofVis = "no proof selected"
  } else if(proof.status === "received"){
    
    proofVis = <List>
         <ListItem>
          <Button variant="outlined" color="primary" primary={true} onClick={() => verifyProof(proof.id)}>
           Verify
          </Button>
          </ListItem>
          <ListItem>
          Sender DID: {proof.did}
          </ListItem>
          <ListItem>
          Status: {proof.status}
          </ListItem>
          <ListItem>
          Credetial definition: {proof.cred_def_id}
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
          <Button variant="outlined" color="primary" primary={true} onClick={() => verifyProof(proof.id)}>
           Verify
          </Button>
          </ListItem>
        </List>
        } else {
      proofVis = <List>
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
          <Button variant="outlined" color="primary" primary={true} onClick={() => verifyProof(proof.id)}>
           Verify
          </Button>
          </ListItem>
        </List>
    }

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

function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function stableSort(array, cmp) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
  return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

const headCells = [
  { id: 'id', numeric: false, disablePadding: true, label: 'Proof ID' },
  { id: 'did', numeric: true, disablePadding: false, label: 'DID' },
  { id: 'status', numeric: true, disablePadding: false, label: 'Status' },
  { id: 'schema_id', numeric: true, disablePadding: false, label: 'Schema ID' },
  { id: 'cred_def_id', numeric: true, disablePadding: false, label: 'Credential Def ID' },
  { id: 'createdAt', numeric: true, disablePadding: false, label: 'Created At' },
];

function EnhancedTableHead(props) {
  const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
  const createSortHandler = property => event => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ 'aria-label': 'select all desserts' }}
          />
        </TableCell>
        {headCells.map(headCell => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={order}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const useToolbarStyles = makeStyles(theme => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(green[500], 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  spacer: {
    flex: '1 1 100%',
  },
  actions: {
    color: theme.palette.text.secondary,
  },
  title: {
    flex: '0 0 auto',
  },
}));

const EnhancedTableToolbar = props => {
  const classes = useToolbarStyles();
  const { numSelected } = props;
  const { proofId } = props;
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [proofState, setProofState] = React.useState("pending")
  const [verificationMessage, setVerificationMessage] = React.useState("The proof is pending")
 
 
   async function handleSnackbarOpen() {
     setSnackbarOpen(true);
   }
 
   async function handleSnackbarClose(event, reason) {
    setSnackbarOpen(false);
     if (reason === 'clickaway') {
       return;
     }
   }
  /* GET /api/proof/:proof_request_id

*/
async function verifyProof(){
  var headers = {
   'Content-Type': 'application/json',
   'Authorization': localStorage.getItem("token") 
  }
  let isProofValid = false
  await axios.get(apiBaseUrl + 'proof/' + proofId , {headers: headers}).then(function (response) {
     console.log(response);
     console.log(response.status);
     if (response.status === 200) {
       let proof = response.data
       if(typeof(proof.isValid) == 'undefined'){
        setProofState("error")
        setVerificationMessage("Verification error. Please try again!")
        handleSnackbarOpen()
         isProofValid = false
       } else {
         //let isValid = proof.isValid ? "is" : "is not"
         //alert("Proof " + isValid + " valid!")
         isProofValid = proof.isValid ? true : false
         if(proof.status === "pending"){
          setProofState("pending")
          setVerificationMessage("The proof is pending")
          handleSnackbarOpen()
        } else {
         let isValid = proof.isValid ? "valid" : "invalid"
         let isValidM = proof.isValid ? "valid" : "not valid"
         setVerificationMessage("The proof is " + isValidM)
         setProofState(isValid)
         //alert(proof.isValid)
         handleSnackbarOpen()
         //alert("Proof " + isValid + " valid!")
        }
     }
     }
   }).catch(function (error) {
   console.log(error);
   setProofState("error")
    setVerificationMessage("Verification error. Please try again!")
    handleSnackbarOpen()
   isProofValid = false
 })
 return(isProofValid)
 }

 const verificationStyles = makeStyles(theme => ({
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

function CircularIntegrationVerification() {
  const classes = verificationStyles();
  const { isValidProp } = props;
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isValid, setIsValid] = useState(isValidProp);


  const buttonClassname = clsx({
    [classes.buttonSuccess]: success,
  });

  //TODO: animation is not functioning perfectly at the moment
  async function handleButtonClick() {
    if (!loading) {
      setSuccess(false);
      setLoading(true);
      let isPValid = await verifyProof()
      //alert(isPValid)
      setIsValid(isPValid);
      setSuccess(isValid);
      setLoading(false);
    }
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
          {success ? <CheckIcon/> : <SearchIcon/>}
        </Fab>
        {loading && <CircularProgress size={68} className={classes.fabProgress} />}
      </div>
      <div className={classes.wrapper}>
        <Button
          variant="outlined"
          color="primary"
          className={buttonClassname}
          disabled={loading}
          onClick={handleButtonClick}
        >
          Verify
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

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      <div className={classes.title}>
        {numSelected > 0 ? (
          <Typography color="inherit" variant="subtitle1">
            {proofId} selected proof ID
          </Typography>
        ) : (
          <Typography variant="h6" id="tableTitle">
            Proofs
          </Typography>
        )}
      </div>
      <div className={classes.spacer} />
      <div className={classes.actions}>
        {/*numSelected > 0 ? (
          <Tooltip title="Verify">
            <IconButton aria-label="verify">
              <CheckIcon onClick={() => verifyProof()} />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title="Filter list">
            <IconButton aria-label="filter list">
              <FilterListIcon />
            </IconButton>
          </Tooltip>
        )*/}
        <CircularIntegrationVerification isValidProp={ proofState === "valid" } />
      </div>
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

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

export default function ProofTable() {
  const classes = useStyles();
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('calories');
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [proofs, setProofs] = useState([]);
  const [proofId, setProofId] = useState(null);
  const [toolbar, setToolbar] = useState(<EnhancedTableToolbar numSelected={selected.length}/>);
  const [dialogOpen, setDialogOpen] = useState(false);
 const [selectedProofValue, setSelectedProofValue] = useState(null);

  function handleClickProofOpen(proof) {
    setSelectedProofValue(proof)
    setDialogOpen(true);
  }

  const handleProofClose = value => {
    setDialogOpen(false);
    setSelectedProofValue(value);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      listProofs();
    }, 3000);
    return () => clearInterval(interval);
  }, []);

 useEffect(() => {
  setToolbar(<EnhancedTableToolbar numSelected={selected.length} proofId={proofId}/>)
}, [proofId]);

  /* GET /api/proof
*/
async function listProofs(){
    var headers = {
     'Content-Type': 'application/json',
     'Authorization': localStorage.getItem("token") 
    }
    await axios.get(apiBaseUrl + 'proof' , {headers: headers}).then(function (response) {
       console.log(response);
       console.log(response.status);
       if (response.status === 200) {
         let proofs =  response.data.sort(Utils.compareDates).map((proof) => {
            let did = proof.did
            let status = proof.status
            let createdAt = proof.createdAt
            let id =  proof.id
            let cred_def_id = ""
            let schema_id = ""
            if(proof.status === "received"){
                let attrs = Object.keys(proof.proof.requested_proof.revealed_attrs).map((key) => {
                let attr = [key.replace("_referent","").replace(/_/g, " "), proof.proof.requested_proof.revealed_attrs[key]["raw"]]
                return(attr)
            }
            );
            if( proof.proof !== null){
            if ( proof.hasOwnProperty("proof") && proof.proof.hasOwnProperty("identifiers") && (proof.proof.identifiers.length >=1) ){
            cred_def_id = proof.proof.identifiers[0].hasOwnProperty("cred_def_id") ? proof.proof.identifiers[0].cred_def_id : ""
            schema_id = proof.proof.identifiers[0].hasOwnProperty("schema_id") ? proof.proof.identifiers[0].schema_id : ""
          }}
            let wallet = proof.wallet
          
            return{ did, status, cred_def_id, schema_id, wallet, createdAt, id,attrs}
        } else {
            return {did, status, createdAt, id}
        }})
        setProofs(proofs)
    }
}).catch(function (error) {
     console.log(error);
    })
}

  function handleRequestSort(event, property) {
    const isDesc = orderBy === property && order === 'desc';
    setOrder(isDesc ? 'asc' : 'desc');
    setOrderBy(property);
  }

  function handleSelectAllClick(event) {
    if (event.target.checked) {
      const newSelecteds = proofs.map(n => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  }

  function handleClick(event, proofId) {
    setProofId(proofId)
    let newSelected = [selected.indexOf(proofId)];
    setSelected(newSelected);
  }

  function handleChangePage(event, newPage) {
    setPage(newPage);
  }

  function handleChangeRowsPerPage(event) {
    setRowsPerPage(+event.target.value);
    setPage(0);
  }

  function handleChangeDense(event) {
    setDense(event.target.checked);
  }

  const isSelected = id => id === proofId;

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, proofs.length - page * rowsPerPage);

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
      {toolbar}
        <div className={classes.tableWrapper}>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
          >
            <EnhancedTableHead
              classes={classes}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={proofs.length}
            />
            <TableBody>
              {stableSort(proofs, getSorting(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((proof, index) => {
                  const isItemSelected = isSelected(proof.id);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                
                    <TableRow
                      hover
                      onClick={event => handleClick(event, proof.id)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={proof.id}
                      selected={isItemSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isItemSelected}
                          inputProps={{ 'aria-labelledby': labelId }}
                        />
                      </TableCell>
                      <TableCell component="th" id={labelId} scope="row" padding="none">
                        {proof.id}
                      </TableCell>
                      <TableCell align="right">{proof.did}</TableCell>
                      <TableCell align="right">{proof.status}</TableCell>
                      <TableCell align="right">{proof.schema_id}</TableCell>
                      <TableCell align="right">{proof.cred_def_id}</TableCell>
                      <TableCell align="right">{proof.createdAt}</TableCell>
                      <TableCell align="right">
                        <Button variant="outlined" color="primary" onClick={() => handleClickProofOpen(proof)}>
                        <VisibilityIcon/>
                        </Button>
                      </TableCell>
                     </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 49 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={proofs.length}
          rowsPerPage={rowsPerPage}
          page={page}
          backIconButtonProps={{
            'aria-label': 'previous page',
          }}
          nextIconButtonProps={{
            'aria-label': 'next page',
          }}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
      <ProofDialog open={dialogOpen} selectedValue={selectedProofValue} onClose={handleProofClose} />
    </div>
  );
}