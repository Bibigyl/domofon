import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import { toJS } from "mobx";
import { IconButton, Tooltip, Dialog, Paper } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import AssignmentIndIcon from "@material-ui/icons/AssignmentInd";

import { store } from "store";
import { InfoRequest } from "components";

import { Edit, Faces } from "./components";
import cl from "./UserCabinet.module.scss";

const UserCabinet = observer(() => {
  const { isAdmin } = store;
  const { user, editUser } = store.userStore;
  const { addresses } = store.addressesStore;
  const [showEdit, setShowEdit] = useState(false);

  const getAddress = () => {
    if (!user.addresses) return '___';
    return addresses.find((ad) => ad.id === toJS(user).addresses[0])?.fullAddress || '___';
  };

  if (!user) return null;

  return (
    <div className={cl.root}>
      <div className={cl.user}>
        <Paper className={cl.info}>
          <AssignmentIndIcon className={cl.infoIcon} color="primary" />
          <div className={cl.titleWarp}>
            <h2>{(user.name || user.surname) ? `${user.name} ${user.surname}` : 'Заполните данные'}</h2>
            <div className={cl.infoEdit}>
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
          <dl>
            <dt>Телефон</dt>
            <dd>{user.phone || '___'}</dd>
            <dt>Email</dt>
            <dd>{user.email || '___'}</dd>
            <dt>Адрес</dt>
            <dd>{getAddress()}</dd>
            <dt>Номер договора</dt>
            <dd>{user.contractNumber || '___'}</dd>
          </dl>
        </Paper>

        <Faces className={cl.facesWrap} />
      </div>

      {!isAdmin && <InfoRequest className={cl.infoRequest} />}

      <Dialog maxWidth="md" open={showEdit} onClose={() => setShowEdit(false)}>
        <Edit
          data={toJS(user)}
          addresses={addresses}
          onSave={editUser}
          onCancel={() => setShowEdit(false)}
        />
      </Dialog>
    </div>
  );
});

export { UserCabinet };
