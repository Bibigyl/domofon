import { makeAutoObservable } from "mobx";
import firebase from "firebase/app";

import { API, adminAPI } from "api";

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
    const fullData = { ...this.user, ...newData };
    const { id, ...data } = { ...fullData };

    await API.editUser(id, data);
    this.user = fullData;
  };

  addFace = async (file) => {
    try {
      const fileId = `${this.user.id}_${Date.now()}`;
      const newFace = {
        fileId,
        name: "",
        surname: "",
        relation: "",
      };
      await API.uploadPhoto(fileId, file);
      await this.editUser({ faces: [...this.user.faces, newFace] });
      this.user.faces.push(newFace);
      this.photoURLs.push({ id: fileId, url: URL.createObjectURL(file) });
    } catch (err) {
      console.log(err);
      console.log('Не удалось загрузить фото');
    }
  };

  deleteFace = async (faceId) => {
    const faces = this.user.faces.filter((el) => el.fileId !== faceId);
    const photoURLs = this.photoURLs.filter((el) => el.id !== faceId);
    const fullData = { ...this.user, faces };
    const { id, ...data } = { ...fullData };

    // eslint-disable-next-line no-empty
    try { await API.deletePhoto(faceId); } catch {}
    await API.editUser(id, data);
    this.photoURLs = photoURLs;
    this.user = fullData;
  };

  editFaces = async ({ faceId, name = "", surname = "" }) => {
    // TODO баг когда два одинаковых файла
    const faces = this.user.faces.map((el) =>
      el.fileId === faceId ? { ...el, name, surname } : el
    );
    const fullData = { ...this.user, faces };
    const { id, ...data } = { ...fullData };

    await API.editUser(id, data);
    this.user = fullData;
  };

  getPhotoURLs = async (user) => {
    const photoURLs = await Promise.all((user?.faces || this.user.faces).map(async (face) => {
      try {
        const url = await API.getPhotoUrl(face.fileId);
        return { id: face.fileId, url };
      } catch {
        console.log("Произошла ошибка. Попробуйте добавить фотографию заново." );
        return { id: face.fileId, url: '' };
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
