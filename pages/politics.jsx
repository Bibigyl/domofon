import Head from 'next/head';

import { Layout, Container, Politics } from 'components';

const PoliticsPage = () => (
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

export default PoliticsPage;
