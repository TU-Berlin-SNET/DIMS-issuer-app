import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
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
        }
    },
    avatar: {
      margin: 10,
    },
    bigAvatar: {
      margin: 10,
      width: 200,
      height: 200,
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
        light: '#000000',
        contrastText:'#FFFFFF'
    },
    colorDefault:{
      main: '#FF0000'
    }
  },
});

export default theme;