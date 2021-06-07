import React, { useEffect, useState, useCallback } from "react";
import { observer } from "mobx-react-lite";
import { toJS } from "mobx";
import { IconButton, Tooltip, Paper, Checkbox } from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";

import { useForceUpdate } from "helpers/hooks";
import { photoURLs } from 'helpers';
import { store } from "store";
import { Button } from "components";

import cl from "./Faces.module.scss";

const Faces = observer(({ openUser, className }) => {
  const forceUpdate = useForceUpdate();

  const loadPhotoURLs = useCallback(async () => {
    await photoURLs.loadByUser(openUser);
    forceUpdate();
  }, [forceUpdate, openUser]);

  useEffect(() => {
    if (openUser) loadPhotoURLs();
  }, [loadPhotoURLs, openUser]);

  const uploadPhoto = (ev, { url, fileName }) => {
    ev.preventDefault();
    const xhr = new XMLHttpRequest();
    xhr.responseType = "blob";
    xhr.onload = () => {
      const blob = xhr.response;
      const link = document.createElement("a");
      link.setAttribute("href", URL.createObjectURL(blob));
      link.setAttribute("download", `${fileName}.jpg`);
      link.click();
    };
    xhr.open("GET", url);
    xhr.send();
  };

  const setFaceProcessed = (faceId, isProcessed) => {
    console.log(faceId, isProcessed);
  };

  return (
    <Paper className={`${className} ${cl.root}`}>
      <h3>Domofon face</h3>
      <div className={cl.faces}>
        {openUser &&
          toJS(openUser.faces).map(face => {
            const { id, fileId, name = "", surname = "" } = face;
            const fileName = `${openUser.phone}_${fileId}`;
            const url = photoURLs.get(fileId);
            if (!url) return null;

            return (
              <div key={id} className={cl.face}>
                <img src={url} alt="user" />
                <div className={cl.faceControls}>
                  <p>Имя: {name ? `${name} ${surname}` : "___"}</p>
                  <p>
                    Обработано:
                    <Checkbox
                      color="primary"
                     onChange={ev => setFaceProcessed(id, ev.target)}
                    />
                  </p>
                  <div className={cl.saveButton}>
                    <Tooltip title="Скачать">
                      <IconButton
                        onClick={(e) => uploadPhoto(e, { url, fileName })}
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
