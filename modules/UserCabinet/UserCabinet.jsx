import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import { toJS } from "mobx";
import {
  IconButton,
  Tooltip,
  Dialog,
  Paper,
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';

import { store } from "store";

import { Edit } from "./components";
import cl from "./UserCabinet.module.scss";

const UserCabinet = observer(() => {
  const { user, editUser, addresses } = store;
  const [showEdit, setShowEdit] = useState(false);

  return (
    <div className={cl.root}>
      <Paper className={cl.info}>
        <AssignmentIndIcon className={cl.infoIcon} color="primary" />
        <div className={cl.titleWarp}>
          <h2>{`${user.name} ${user.surname}`}</h2> 
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
      </Paper>

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
