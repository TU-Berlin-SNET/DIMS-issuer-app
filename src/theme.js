import { createMuiTheme } from '@material-ui/core/styles';

var theme;

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
    

export default theme;