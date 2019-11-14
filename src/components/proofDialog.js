import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {withRouter} from "react-router-dom";


class ConfrimDialog extends Component {
    constructor(props){
      super(props);
      this.state= {
            open: false,
            title: "",
            message: "",
      }
    }

 handleClose(agree) {
    this.setState({open: false}, () =>     this.props.closeProofView()
    );
  }
  

  
  componentWillReceiveProps(){
    this.setState({open: this.props.open, title: this.props.title, message:this.props.message })
}

  render(){
      return(

        <Dialog
          open={this.state.open}
        >
          <DialogTitle> {this.state.title}</DialogTitle>
          <DialogContent>
            <DialogContentText >
              {this.state.message}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => this.handleClose(true)} style={{color: 'rgb(0, 200 ,0)'}} autoFocus>
              close
            </Button>
          </DialogActions>
        </Dialog>
    
      )
  } 

}
export default withRouter(ConfrimDialog);