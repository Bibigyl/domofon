import { React, useState, useCallback, useEffect } from "react";
import { observer } from "mobx-react-lite";

import { Login, UserCabinet } from "modules";
import { Layout } from "app";
import { store } from "store";
import { Loading, Container } from "components";

import cl from "./Cabinet.module.scss";

const Cabinet = observer(() => {
  const { user, isGettingUser, isAdmin } = store;

  return (
    <Layout>
      <Container>
        {isGettingUser && <Loading />}
        {!isGettingUser && !user && <Login />}
        {user && !isAdmin && <UserCabinet />}
        {user && isAdmin && "ADMIN"}
      </Container>
    </Layout>
  );
});

export { Cabinet };
