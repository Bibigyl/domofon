import { React, useState, useCallback, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { toJS } from "mobx";
import { Container } from "@material-ui/core";

import { Login, UserCabinet } from "modules";
import { Layout } from "app";
import { store } from "store";
import { Loading } from "components";

import cl from "./Cabinet.module.scss";

const Cabinet = observer(() => {
  const { user, isGettingUser, isAdmin } = store;

  return (
    <Layout>
      <Container className={cl.container} maxWidth="lg">
        {isGettingUser && <Loading />}
        {!isGettingUser && !user && <Login />}
        {user && isAdmin && <UserCabinet />}
        {user && !isAdmin && "ADMIN"}
      </Container>
    </Layout>
  );
});

export { Cabinet };
