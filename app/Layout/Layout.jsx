import { Container } from "@material-ui/core";

import { Button } from "components";
import { authAPI } from "api/authAPI";

import cl from "./Layout.module.scss";

const Layout = (props) => {
  const { children } = props;

  return (
    <div className={cl.root}>
      <header>
        <Container className={cl.container} maxWidth="lg">
          <Button onClick={authAPI.logout}>Выйти</Button>
        </Container>
      </header>
      <main>
        <Container className={cl.container} maxWidth="lg">
          {children}
        </Container>
      </main>
      <footer>
        <Container className={cl.container} maxWidth="lg">
          footer
        </Container>
      </footer>
    </div>
  );
};

export { Layout };
