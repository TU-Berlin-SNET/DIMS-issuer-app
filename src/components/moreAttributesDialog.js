import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import Box from '@material-ui/core/Box';
import ReactJson from 'react-json-view'


export default function AlertDialog(props) {
  const [open, setOpen] = React.useState(false);
  let row =props;
  let raw = row.row
  let keys = Object.keys(raw).filter(key => key !== 'picture');

  var obj = {}
  for(let attr in raw){
    if(attr !== 'picture' && attr !== 'photo'){
      obj[attr] = raw[attr]
    }
  }

  /*  function filterObjectAttributes(raw){
    var temp_obj = {}
    for(let attr in raw){
      if(attr !== 'picture' && attr !== 'photo'){
        console.log(typeof(raw[attr]))

        if(typeof(raw[attr]) === 'object')
            filterObjectAttributes(raw[attr])
        else(temp_obj[attr] = raw[attr])
      }
    }
    Object.assign(obj, temp_obj)
  }
*/

  function handleClickOpen() {
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
  }

  return (
    <Box>
      <IconButton color='primary'  size='small' onClick={handleClickOpen}>
        {props.iconText} {props.icon}
      </IconButton>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Attributes"}</DialogTitle>
        <DialogContent>
        <ReactJson src={obj} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

