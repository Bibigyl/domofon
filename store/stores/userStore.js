import { makeAutoObservable } from "mobx";

import { API } from "api";

class UserStore {
  user = null;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });

    this.editUser = this.editUser.bind(this);
    this.addFace = this.addFace.bind(this);
    this.deleteFace = this.deleteFace.bind(this);
    this.editFace = this.editFace.bind(this);
  }

  setUser = (user) => {
    this.user = user;
  };

  *editUser(newData) {
    try {
      const userData = { ...this.user, ...newData };
      this.user = yield API.editUser(userData);
    } catch {
      console.log("Произошла ошибка");
    }
  }

  *addFace(file) {
    try {
      const id = `${this.user.id}_${Date.now()}`;
      const newFace = {
        id,
        fileId: id,
        name: "",
        surname: "",
        relation: "",
        isProcessed: false,
      };
      yield API.uploadPhoto(id, file);
      this.editUser({ faces: [...this.user.faces, newFace] });
    } catch (err) {
      console.log("Не удалось загрузить фото");
    }
  }

  *deleteFace(id) {
    const faces = this.user.faces.filter((face) => face.id !== id);
    const userData = { ...this.user, faces };

    try {
      yield API.deletePhoto(id);
      yield API.editUser(userData);
      this.user = userData;
    } catch {
      console.error("Файл не удален из хранилища");
    }
  }

  *editFace(face) {
    const faces = this.user.faces.map((el) =>
      el.id === face.id ? { ...el, ...face } : el
    );
    const userData = { ...this.user, faces };

    try {
      yield API.editUser(userData);
      this.user = userData;
    } catch {
      console.log("Произошла ошибка");
    }
  }
}

const userStore = new UserStore();

export { userStore };
