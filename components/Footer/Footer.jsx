import { Container } from "components";

import cl from "./Footer.module.scss";

const Footer = () => {
  const y = '';

  return (
    <footer className={cl.root}>
      <Container>
        <div className={cl.root}>footer{y}</div>
      </Container>
    </footer>
  );
};

export { Footer };
