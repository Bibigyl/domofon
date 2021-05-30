/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import { toJS } from "mobx";
import { IconButton, Tooltip, Dialog, Paper } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import AssignmentIndIcon from "@material-ui/icons/AssignmentInd";
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import DeleteIcon from '@material-ui/icons/Delete';

import { store } from "store";
import { InfoRequest } from "components";

import { Edit, EditFace } from "./components";
import cl from "./UserCabinet.module.scss";

const UserCabinet = observer(() => {
  const { user, editUser, addresses, photoURLs, addFace, editFaces, deleteFace } = store.userStore;
  const [showEdit, setShowEdit] = useState(false);
  const [editingFaceId, setEditingFaceId] = useState(null);

  const getAddress = () => {
    if (!user.addresses) return '___';
    return addresses.find((ad) => ad.id === user.addresses[0])?.fullAddress || '___';
  };

  const handlePhotoAdd = (ev) => {
    const file = ev.target?.files[0];
    if (file) addFace(file);
  };

  const editFace = async (data) => {
    await editFaces({ faceId: editingFaceId, ...data });
  };

  return (
    <div className={cl.root}>
      <div className={cl.user}>
        <Paper className={cl.info}>
          <AssignmentIndIcon className={cl.infoIcon} color="primary" />
          <div className={cl.titleWarp}>
            <h2>{user.name ? `${user.name} ${user.surname}` : 'Заполните данные'}</h2>
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

        <Paper className={cl.facesWrap}>
          <h3>Фото</h3>
          <div className={cl.faces}>
            <div className={`${cl.faceNew} ${cl.face}`}>
              <Tooltip title="Добавить фото">
                  <IconButton
                    onClick={() => {}}
                    component="label"
                  >
                    <input type='file' hidden onChange={handlePhotoAdd} accept=".jpg" />   
                    <PersonAddIcon className={cl.newFaceIcon} />
                  </IconButton>
              </Tooltip>
            </div>
            {toJS(photoURLs).map((photo, id) => {
              const { name = '', surname = '' } = toJS(user.faces).find(el => el.fileId === photo.id) || {};
              return (
                <div key={photo.id || id} className={cl.face}>
                  <img src={photo.url} alt="user" />
                  <div className={cl.faceControls}>
                    <p>{name} {surname}</p>
                    <Tooltip title="Редактировать">
                      <IconButton onClick={() => setEditingFaceId(photo.id)}>
                        <EditIcon className={cl.faceIcon} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Удалить">
                      <IconButton onClick={() => deleteFace(photo.id)}>
                        <DeleteIcon className={cl.faceIcon} />
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

      <Dialog maxWidth="md" open={editingFaceId !== null} onClose={() => setEditingFaceId(null)}>
        <EditFace
          data={toJS(user.faces).find(el => el.fileId === editingFaceId)}
          onSave={editFace}
          onCancel={() => setEditingFaceId(null)}
        />
      </Dialog>
    </div>
  );
});

export { UserCabinet };
