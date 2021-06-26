import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import { IconButton } from '@material-ui/core';

import { Header, Footer } from 'components';

import cl from './Layout.module.scss';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#2f7491',
      light: '#9dffae',
    },
    secondary: {
      main: '#fff',
    },
    default: {
      main: '#d4d4d4',
    },
  },
});

const Layout = (props) => {
  const { children, isLanding } = props;

  return (
    <ThemeProvider theme={theme}>
      <div className={`${cl.root} ${isLanding ? cl.landing : ''}`}>
        <Header />
        <IconButton className={cl.mobilMenu}>
          <MenuIcon />
        </IconButton>
        {/* <div className='mobilMenu' /> */}
        <main>{children}</main>
        <Footer />
      </div>
    </ThemeProvider>
  );
};

export { Layout };
