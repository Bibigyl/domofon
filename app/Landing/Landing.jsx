import { Container } from "@material-ui/core";

import { Layout } from "app";

import cl from "./Landing.module.scss";

const Landing = () => {
  const y = 9;

  return (
    <Layout isLanding className={cl.root}>
      <div className={cl.bgTech}>
        <Container className={cl.alignCenter} maxWidth="lg">
          <h1>Domofondon.ru</h1>
        </Container>
      </div>
    </Layout>
  );
};

export { Landing };
