import React, { useState, useCallback, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { toJS } from "mobx";
import {
  TextField,
  IconButton,
  Tooltip,
  Select,
  MenuItem,
  Grid,
  Dialog,
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";

import { store } from "store";
import { userAPI } from "api";

import { Field, Edit } from "./components";
import cl from "./UserCabinet.module.scss";

const UserCabinet = observer(() => {
  const { user, editUser, addresses } = store;
  const [showEdit, setShowEdit] = useState(false);

  console.log('user  UserCabinet', user?.name);

  // const editUser = async (data) => {
  //   updateUser(data);
  // };

  return (
    <div className={cl.root}>
      <Grid container spacing={8}>
        <Grid item lg={4}>
          <div className={cl.info}>
            <h2>{`${user.name} ${user.surname}`}</h2>
            <dl>
              <dt>Телефон</dt>
              <dd>{`${user.phone}`}</dd>
              <dt>Email</dt>
              <dd>{`${user.email}`}</dd>
              <dt>Адрес</dt>
              <dd>{`${addresses.find(ad => ad.id === user.addresses[0])?.fullAddress}`}</dd>
              <dt>Номер договора</dt>
              <dd>{`${user.contractNumber}`}</dd>
            </dl>
            <div className={cl.buttonEdit}>
              <Tooltip title="Редактировать">
                <IconButton
                  onClick={() => {
                    setShowEdit(true);
                  }}
                >
                  <EditIcon />
                </IconButton>
              </Tooltip>
            </div>
          </div>
        </Grid>

        <Grid item lg={8}>
          <div className={cl.info}>
            <h2>{`${user.name} ${user.surname}`}</h2>
            <dl>
              <dt>Телефон</dt>
              <dd>{`${user.phone}`}</dd>
              <dt>Email</dt>
              <dd>{`${user.email}`}</dd>
              <dt>Номер договора</dt>
              <dd>{`${user.contractNumber}`}</dd>
            </dl>
            <div className={cl.buttonEdit}>
              <Tooltip title="Редактировать">
                <IconButton onClick={() => {}}>
                  <EditIcon />
                </IconButton>
              </Tooltip>
            </div>
          </div>
        </Grid>
      </Grid>

      <Dialog maxWidth="md" open={showEdit} onClose={() => setShowEdit(false)}>
        <Edit
          data={user}
          addresses={toJS(addresses)}
          onSave={editUser}
          onCancel={() => setShowEdit(false)}
        />
      </Dialog>
    </div>
  );
});

export { UserCabinet };
