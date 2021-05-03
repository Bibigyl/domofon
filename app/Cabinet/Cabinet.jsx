import { React, useState, useCallback, useEffect } from "react";
import { observer } from "mobx-react-lite";

import { Login, UserCabinet } from "modules";
import { Layout } from "app";
import { store } from "store";
import { Loading } from "components";

import cl from "./Cabinet.module.scss";

const Cabinet = observer(() => {
  const { user, isGettingUser, isAdmin, addresses } = store;

  return (
    <Layout>
      {isGettingUser
        ? <Loading />
        : <>
          {!user && <Login />}
          {user && isAdmin && <UserCabinet user={user} addresses={addresses} />}
          {user && !isAdmin && "ADMIN"}
          </>
      }
    </Layout>
  );
});

export { Cabinet };
