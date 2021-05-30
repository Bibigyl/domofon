import { makeAutoObservable } from "mobx";
import firebase from "firebase/app";

import { API, adminAPI } from "api";
import { getPhotoUrl } from 'helpers';

// configure({
//   enforceActions: "never",
// });

class AdminStore {
  addresses = [];

  photoURLs = [];

  users = [];

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  getAddresses = async () => {
    this.addresses = await API.getAdrdesses();
  };

  getPhotoURLs = async (user) => {
    const photoURLs = await Promise.all((user?.faces).map(async (face) => {
      // const t = await getPhotoUrl(face.fileId);
      // return t;
      try {
        const url = await API.getPhotoUrl(face.fileId);
        return { id: face.fileId, url };
      } catch {
        console.log("Произошла ошибка. Фото не найдено." );
        return { id: face.fileId, url: '' };
      }
    }));
    this.photoURLs = photoURLs;
  };

  getUsers = async () => {
    this.users = await API.getUsers();
  };
}

const adminStore = new AdminStore();

export { adminStore };
