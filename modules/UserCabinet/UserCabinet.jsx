import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import { toJS } from "mobx";
import { IconButton, Tooltip, Dialog, Paper } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import AssignmentIndIcon from "@material-ui/icons/AssignmentInd";
import PersonAddIcon from '@material-ui/icons/PersonAdd';


import { store } from "store";
import { InfoRequest } from "components";

import { Edit } from "./components";
import cl from "./UserCabinet.module.scss";

const UserCabinet = observer(() => {
  const { user, editUser, addresses } = store;
  const [showEdit, setShowEdit] = useState(false);

  return (
    <div className={cl.root}>
      <div className={cl.user}>
        <Paper className={cl.info}>
          <AssignmentIndIcon className={cl.infoIcon} color="primary" />
          <div className={cl.titleWarp}>
            <h2>{`${user.name} ${user.surname}`}</h2>
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
            <dd>{`${user.phone}`}</dd>
            <dt>Email</dt>
            <dd>{`${user.email}`}</dd>
            <dt>Адрес</dt>
            <dd>{`${
              addresses.find((ad) => ad.id === user.addresses[0])?.fullAddress
            }`}</dd>
            <dt>Номер договора</dt>
            <dd>{`${user.contractNumber}`}</dd>
          </dl>
        </Paper>

        <Paper className={cl.facesWrap}>
          <h3>Domofon face</h3>
          <div className={cl.faces}>
            <div className={`${cl.faceNew} ${cl.face}`}>
              <Tooltip title="Добавить фото">
                <IconButton
                  onClick={() => {}}
                >
                  <PersonAddIcon className={cl.newFaceIcon} />
                </IconButton>
              </Tooltip>
            </div>
            {user.faces.map((face) => {
              const name = `${face.name} ${face.surname}`;
              return (
                <div key={name} className={cl.face}>
                  <img src={face.photoURL} alt="user" />
                  <p>{name}</p>
                  <div className={cl.faceEdit}>
                    <Tooltip title="Редактировать">
                      <IconButton
                        onClick={() => {}}
                      >
                        <EditIcon className={cl.editIcon} />
                      </IconButton>
                    </Tooltip>
                  </div>
                </div>
              );
            })}
          </div>
        </Paper>
      </div>

      <InfoRequest />

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
