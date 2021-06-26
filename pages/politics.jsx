/* eslint-disable react/display-name */
import Head from 'next/head';

import { Layout, Container, Politics } from 'components';

export default () => (
  <>
    <Head>
      <title>Политика конфиденциальности</title>
    </Head>
    <Layout>
      <Container>
        <Politics />
      </Container>
    </Layout>
  </>
);
