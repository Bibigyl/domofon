import { Container } from "@material-ui/core";

import cl from "./Footer.module.scss";

const Footer = () => {
  const y = 9;

  return (
    <footer className={cl.root}>
      <Container className={cl.container} maxWidth="lg">
        <div className={cl.root}>footer</div>
      </Container>
    </footer>
  );
};

export { Footer };
