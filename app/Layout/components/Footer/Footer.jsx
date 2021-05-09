import { Container } from "components";

import cl from "./Footer.module.scss";

const Footer = () => {
  const y = 9;

  return (
    <footer className={cl.root}>
      <Container>
        <div className={cl.root}>footer</div>
      </Container>
    </footer>
  );
};

export { Footer };
