import { makeAutoObservable } from "mobx";

import { API } from "api";

class UserStore {
  user = null;

  addresses = [];

  photoURLs = [];

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  setUser = (user) => {
    this.user = user;
  }

  editUser = async (newData) => {
    try {
      await API.editUser(newData);
      this.user = newData;      
    } catch {
      console.log('Произошла ошибка');
    }
  };

  addFace = async (file) => {
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
      await API.uploadPhoto(id, file);
      await this.editUser({ faces: [...this.user.faces, newFace] });
      // this.user.faces.push(newFace);
    } catch (err) {
      console.log(err);
      console.log('Не удалось загрузить фото');
    }
  };

  deleteFace = async (id) => {
    const faces = this.user.faces.filter(face => face.id !== id);
    const userData = { ...this.user, faces };

    try { 
      await API.deletePhoto(id);
      await API.editUser(userData);
      this.user = userData;
    } catch { 
      console.error("Файл не удален из хранилища"); 
    }
  };

  editFace = async (face) => {
    const faces = this.user.faces.map(el =>
      el.id === face.id ? { ...el, ...face } : el
    );
    const userData = { ...this.user, faces };

    try {
      await API.editUser(userData);
      this.user = userData;      
    } catch {
      console.log('Произошла ошибка');
    }
  };

  getPhotoURLs = async (user) => {
    const photoURLs = await Promise.all((user?.faces || this.user.faces).map(async (face) => {
      try {
        const url = await API.getPhotoUrl(face.id);
        return { id: face.id, url };
      } catch {
        console.log("Произошла ошибка. Попробуйте добавить фотографию заново." );
        return { id: face.id, url: '' };
      }
    }));
    this.photoURLs = photoURLs;
  };

  getAddresses = async () => {
    this.addresses = await API.getAdrdesses();
  };
}

const userStore = new UserStore();

export { userStore };
