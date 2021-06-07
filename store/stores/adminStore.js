import { makeAutoObservable } from "mobx";

import { API } from "api";
// import { getPhotoUrl } from 'helpers';

// configure({
//   enforceActions: "never",
// });

class AdminStore {
  addresses = [];

  users = [];

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  getAddresses = async () => {
    this.addresses = await API.getAdrdesses();
  };

  getUsers = async () => {
    this.users = await API.getUsers();
  };

  setFaceProcessed = async ({ userId, faceId, isProcessed }) => {
    const userData = this.users.find(user => user.id === userId);
    const faces = userData.faces.map(face => face.id === faceId ? {...face, isProcessed} : face);
    const newUserData = {...userData, faces};

    try {
      await API.editUser(newUserData);
      this.users = this.users.map(user => user.id === userId ? newUserData : user);
    } catch {
      console.log('Произошла ошибка');
    }
  }
}

const adminStore = new AdminStore();

export { adminStore };
