/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { toJS } from "mobx";
import { IconButton, Tooltip, Paper, Checkbox } from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";

import { store } from "store";
import { Button } from "components";

import cl from "./Faces.module.scss";

const Faces = observer(({ openUser, className }) => {
  const { photoURLs, getPhotoURLs } = store.adminStore;

  useEffect(() => {
    if (openUser) getPhotoURLs(openUser);
  }, [getPhotoURLs, openUser]);

  const uploadPhoto = (ev, { url, name }) => {
    ev.preventDefault();
    const xhr = new XMLHttpRequest();
    xhr.responseType = "blob";
    xhr.onload = () => {
      const blob = xhr.response;
      const link = document.createElement("a");
      link.setAttribute("href", URL.createObjectURL(blob));
      link.setAttribute("download", `${name}.jpg`);
      link.click();
    };
    xhr.open("GET", url);
    xhr.send();
  };

  return (
    <Paper className={`${className} ${cl.root}`}>
      <h3>Domofon face</h3>
      <div className={cl.faces}>
        {openUser &&
          toJS(photoURLs).map((photo) => {
            const { name = "", surname = "" } =
              toJS(openUser.faces).find((el) => el.fileId === photo.id) || {};
            const fileName = `${openUser.phone}_${photo.id}`;
            return (
              <div key={photo.id} className={cl.face}>
                <img src={photo.url} alt="user" />
                <div className={cl.faceControls}>
                  <p>Имя: {name ? `${name} ${surname}` : "some text"}</p>
                  <p>
                    Обработано:
                    <Checkbox
                      color="primary"
                    // onChange={handleChange}
                    />
                  </p>
                  <div className={cl.saveButton}>
                    <Tooltip title="Скачать">
                      <IconButton
                        onClick={(e) =>
                          uploadPhoto(e, { url: photo.url, fileName })
                        }
                      >
                        <SaveIcon className={cl.saveIcon} />
                      </IconButton>
                    </Tooltip>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </Paper>
  );
});

export { Faces };
