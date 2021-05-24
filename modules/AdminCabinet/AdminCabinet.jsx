/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { toJS } from "mobx";
import { IconButton, Tooltip, Dialog, Paper } from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";

import { store } from "store";
import { Button } from "components";

import cl from "./AdminCabinet.module.scss";

const AdminCabinet = observer(() => {
  const { users, getUsers, photoURLs, getPhotoURLs } = store;
  const [openUser, setOpenUser] = useState(null);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  useEffect(() => {
    if (openUser) getPhotoURLs(openUser);
  }, [openUser, getPhotoURLs]);

  return (
    <div className={cl.root}>
      <div className={cl.users}>
        <table className={cl.table}>
          <thead>
            <tr>
              <th>Номер телефона</th>
              <th>Имя Фамилия</th>
              <th>Номер договора</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} onClick={() => setOpenUser(user)}>
                <td>{user.phone || "___"}</td>
                <td>{user.name ? `${user.name} ${user.surname}` : "___"}</td>
                <td>{user.contractNumber || "___"}</td>
                {/* <td>
                  <Button variant="text" startIcon={<SaveIcon />} size='small'>Скачать фото</Button>
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>

        <Paper className={cl.facesWrap}>
          <h3>Domofon face</h3>
          <div className={cl.faces}>
            {openUser &&
              toJS(photoURLs).map((photo, id) => {
                const { name = "", surname = "" } = toJS(openUser.faces).find((el) => el.fileId === photo.id) || {};
                // console.log('photo', photo);
                return (
                  <div key={photo.id || id} className={cl.face}>
                    <img src={photo.url} alt="user" />
                    <div className={cl.faceControls}>
                      <p>
                        {name} {surname}
                      </p>
                      {/* <a href={photo.url} download={`${photo.id}.jpg`} onClick={e => e.stopPropagation()} > */}
                      <Tooltip title="Скачать">
                        <IconButton>
                          <SaveIcon className={cl.faceIcon} />
                        </IconButton>
                      </Tooltip>
                      {/* </a> */}
                    </div>
                  </div>
                );
              })}
          </div>
        </Paper>
      </div>
    </div>
  );
});

export { AdminCabinet };
