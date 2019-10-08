import { createMuiTheme } from '@material-ui/core/styles';

var theme;
      
      switch(localStorage.getItem('role')){
        case 'government' :
            theme =
        createMuiTheme({
          overrides:{
              MuiAppBar:{
                  colorPrimary: {
                    backgroundColor:  '#6980FF',
                  },
                  colorDefault: {
                      backgroundColor :'#A0A0A0'
                  },
              },
              MuiTab: {
                textColorPrimary: '#FFF',
                textColorSecondary: '#FFF',
              },
              MuiLink:{
                colorPrimary:'#FFFFFF',
                  textColorPrimary: '#FFFFFF'
              },
              MuiContainer: {
                root:{
                  backgroundColor: '#6980FF',
                  color: '#FFFFFF'
                }
              },
              MuiAvatar: {
                root:{
                  width: "50px",
                  height: "50px",
                }
              },
              MuiButton: {
                root:{
                  primary: {
                    color: '#6980FF',
                  },
                  secondary:{
                    color: '#FFF'
                  }
                  
                }
              }
          },
        typography: {
          useNextVariants: true,
          colorPrimary: '#FFFFFF',
        },
        palette: {
          primary: {
            main: '#6980ff',
            contrastText: '#FFF',
      
          },
          secondary:{
              main: '#FF7C7C',
              contrastText:'#FFFFFF'
          },
          colorDefault:{
            main: '#FF0000'
          }
        },
      });
      break;

      case 'bank' :
          theme=
          createMuiTheme({
            overrides:{
      
                MuiContainer: {
                  root:{
                    backgroundColor: '#cc0000',
                    color: '#FFFFFF'
                  }
                },
                MuiAvatar: {
                  root:{
                    width: "50px",
                    height: "50px",
                  }
                },
                MuiButton: {
                  root:{
                    primary: {
                      color: '#cc0000',
                    },
                    secondary:{
                      color: '#FFF'
                    }
                    
                  }
                }
            },
            typography: {
              useNextVariants: true,
              colorPrimary: '#FFFFFF',
            },
            palette: {
              primary: {
                main: '#cc0000',
                contrastText: '#FFF',
          
              },
              secondary:{
                  main: '#FF7C7C',
                  contrastText:'#FFFFFF'
              },
              colorDefault:{
                main: '#FF0000'
              }
            },
          });
          break;
      default:
          theme=
          createMuiTheme({
            overrides:{
      
                MuiContainer: {
                  root:{
                    backgroundColor: '#22a15c',
                    color: '#FFFFFF'
                  }
                },
                MuiAvatar: {
                  root:{
                    width: "50px",
                    height: "50px",
                  }
                },
                MuiButton: {
                  root:{
                    primary: {
                      color: '#22a15c',
                    },
                    secondary:{
                      color: '#FFF'
                    }
                    
                  }
                }
            },
            typography: {
              useNextVariants: true,
              colorPrimary: '#FFFFFF',
            },
            palette: {
              primary: {
                main: '#22a15c',
                contrastText: '#FFF',
          
              },
              secondary:{
                  main: '#FF7C7C',
                  contrastText:'#FFFFFF'
              },
              colorDefault:{
                main: '#FF0000'
              }
            },
          });
          break;
    }



   

    

export default theme;