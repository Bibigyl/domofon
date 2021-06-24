import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";

import { Header, Footer } from "components";

import cl from "./Layout.module.scss";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#2f7491",
      light: '#9dffae'
    },
    secondary: {
      main: "#fff",
    },
    default: {
      main: "#d4d4d4",
    }
  },
});

const Layout = (props) => {
  const { children, isLanding } = props;

  return (
    <ThemeProvider theme={theme}>
      <div className={`${cl.root} ${isLanding ? cl.landing : ""}`}>
        <Header />
        <main>{children}</main>
        <Footer />
      </div>
    </ThemeProvider>
  );
};

export { Layout };
