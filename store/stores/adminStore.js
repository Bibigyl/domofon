import { makeAutoObservable } from "mobx";

import { API } from "api";

class AdminStore {
  admin = null;

  users = [];

  admins = [];

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  setAdmin = userInfo => {
    this.admin = userInfo;
  }

  *getUsers() {
    const users = yield API.getUsers();
    const adminsPhones = this.admins.map(admin => admin.phone);
    this.users = users
      .filter(user => !adminsPhones.includes(user.phone))
      .sort((a, b) => a.fullName > b.fullName ? 1 : -1);
  }

  *getAdmins() {
    this.admins = yield API.getAdmins();
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
