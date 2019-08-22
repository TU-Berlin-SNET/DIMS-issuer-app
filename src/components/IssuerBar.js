import React, { Component } from 'react';
import Drawer from 'material-ui/Drawer';
import ChevronLeftIcon from 'material-ui/svg-icons/navigation/chevron-left';
import List from 'material-ui/List';
import ListItem from 'material-ui/List/ListItem';
import Divider from 'material-ui/Divider';
import { Link, withRouter} from "react-router-dom";
import Box from '@material-ui/core/Box';
import { withStyles } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { Button } from '@material-ui/core';
import Tab from '@material-ui/core/Tab';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import DIMSLogo from'./DIMSLogo';

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
  },
});

function StyledAppBar(props) {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);


  return (
    <Box>

    <AppBar position='relative' color='primary'>
      <Box position= 'absolute'  left='3vw'>
    <  DIMSLogo />
    </Box>
      <Tabs
        value={props.actualTab}
        indicatorColor="none"
        centered
      >
        <Tab  component={Link}  label={'Onboarding'}  to={'onboarding'} />
        <Tab  component={Link}  label={'Credential'}    to={'credential'} />
        <Tab  component={Link}   label={'Cred. definition'}  to={'credentialdef'} />
        <Tab  component={Link}   label={'Proofs'}  to={'proofs'} />
        <Tab  component={Link}   label={'Schemas'}  to={'schemas'} />
        <Tab  component={Link}   label={'Connections'}  to={'connections'} />
          </Tabs>
          <Box  position= 'absolute'  top ='20%' right='1vw' >
              {props.loginComponent}
              </Box>
    </AppBar>
    </Box>
  );
}




class IssuerBar extends Component {
    constructor(props) {
        super(props);
        console.log(props)
        this.state = {
            username: '',
            password: '',
            loginComponent: <Link underline='none' style= {{color: '#FFFFFF' }}   to={''}>Login</Link>,
            draweropen: false
        }
}
handleDrawerOpen = () => {
        this.setState({ draweropen: true });
};
    
handleDrawerClose = () => {
        this.setState({ draweropen: false });
};



    componentWillMount(){
        
    }

    handleLogout(){
      console.log("logout event fired",this.props);
      localStorage.clear();
      var self = this;
      self.props.history.push("/");
    }

    render() {

        return (
            <Box >
              <StyledAppBar zIndex='appBar' actualTab = {this.props.actualTab} loginComponent={this.state.loginComponent} />
          </Box>
        );
    }
}


export default withStyles({ withTheme: true })(IssuerBar);