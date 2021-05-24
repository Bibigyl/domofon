import Head from "next/head";
import { observer } from "mobx-react-lite";

import { Login, UserCabinet, AdminCabinet } from "modules";
import { store } from "store";
import { Layout, Loading, Container } from "components";

export default observer(() => {
  const { user, isGettingUser, isAdmin } = store;
  
  return (
    <>
      <Head>
        <title>Личный кабинет</title>
      </Head>
      <Layout>
        <Container>
          {isGettingUser && <Loading />}
          {!isGettingUser && !user && <Login />}
          {user && !isAdmin && <UserCabinet />}
          {user && isAdmin && <AdminCabinet />}
        </Container>
      </Layout>
    </>
  );
});
