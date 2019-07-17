import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import ChevronLeftIcon from 'material-ui/svg-icons/navigation/chevron-left';
import List from 'material-ui/List';
import ListItem from 'material-ui/List/ListItem';
import IconButton from 'material-ui/IconButton';
import Divider from 'material-ui/Divider';
import { Link, withRouter} from "react-router-dom";
import Box from '@material-ui/core/Box';

class IssuerBar extends Component {
    constructor(props) {
        super(props);
        
        var localloginComponent=[];
        this.state = {
            username: '',
            password: '',
            loginComponent:localloginComponent,
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
          <MuiThemeProvider>
            <Box>
              <AppBar title="Issuer App" onLeftIconButtonClick={() => this.handleDrawerOpen()}>
            </AppBar>
              <Drawer
            variant="persistent"
            anchor="left"
            open={this.state.draweropen}
          >
            <div>
              <IconButton onClick={this.handleDrawerClose}>
                {<ChevronLeftIcon />}
              </IconButton>
            </div>
            <Divider />
            <List>
              {
                [['Home',""], ['Onboarding',"onboarding"], ['Credential',"credential"],['Cred. definition',"credentialdef"], ['Schemas',"schemas"], ['Connections',"connections"]].map((item, i) => (
                <Link key={i} to={item[1]} style={{ textDecoration: 'none' }}>
                <ListItem key={item[0]}>
                  {item[0]}
                </ListItem>
                </Link>
              ))}
            </List>
            <Divider />
            <List>
            <Link to="" style={{ textDecoration: 'none' }} onClick={() => this.handleLogout()}>
            <ListItem key={"Logout"}>
            Logout
            </ListItem>
            </Link>
            </List>
          </Drawer>
          </Box>
      </MuiThemeProvider>
            
        );
    }
}
export default withRouter(IssuerBar);