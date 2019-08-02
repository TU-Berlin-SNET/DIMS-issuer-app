import React from 'react';
import { makeStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import MoreHoriz from '@material-ui/icons/MoreHoriz';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText'
import ListSubheader from '@material-ui/core/ListSubheader';


const useStyles = makeStyles(theme => ({
  subList: {
    marginLeft: '50px',
    paddingLeft: '50px',
  },
}));


function Sublist(props){

  const classes = useStyles();

  let row = props.row
  let attribute = props.attribute

  if(typeof row[attribute] !== 'object'){
    return(
      <List  >
        <ListSubheader disableSticky>{attribute}</ListSubheader>
        <ListItem divider={true}>
          <ListItemText >{row[attribute]}</ListItemText>
        </ListItem>
      </List>
    )
  }
  else{
    return( <List>
       <ListSubheader disableSticky>{attribute}</ListSubheader> 
        {Object.keys(row[attribute]).map(function(key,i){
          return(
            <List className={classes.subList} key={i}>
            <Sublist row={row[attribute]} attribute={key} />
            </List>
          )
        })}
      </List>

    )
  }
}


export default function AlertDialog(props) {
  const [open, setOpen] = React.useState(false);
  let row = []
  row =props.row;
  function handleClickOpen() {
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
  }




  return (
    <div>
      <IconButton onClick={handleClickOpen}>
        <MoreHoriz />
      </IconButton>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Attributes"}</DialogTitle>
        <DialogContent>
        <List component="nav" aria-label="Main mailbox folders">
          {props.attrNames.map(function(attribute, i) {
            return <Sublist row={row} attribute={attribute} key={i}/>
          })}
        </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

