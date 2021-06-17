import { makeAutoObservable } from "mobx";

import { API } from "api";

class AdminStore {
  addresses = [];

  users = [];

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });

    this.setFaceProcessed = this.setFaceProcessed.bind(this);
  }

  *getAddresses() {
    this.addresses = yield API.getAdrdesses();
  }

  *getUsers() {
    this.users = yield API.getUsers();
  }

  *setFaceProcessed({ userId, faceId, isProcessed }) {
    const userData = this.users.find((user) => user.id === userId);
    const faces = userData.faces.map((face) =>
      face.id === faceId ? { ...face, isProcessed } : face
    );
    const newUserData = { ...userData, faces };

    try {
      yield API.editUser(newUserData);
      this.users = this.users.map((user) =>
        user.id === userId ? newUserData : user
      );
    } catch {
      console.log("Произошла ошибка");
    }
  }
}

const adminStore = new AdminStore();

export { adminStore };
