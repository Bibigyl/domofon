import { makeAutoObservable } from "mobx";
import firebase from "firebase/app";

import { userAPI, adminAPI } from "api";

// configure({
//   enforceActions: "never",
// });

class Store {
  user = null;

  isGettingUser = true;

  isAdmin = false;

  addresses = [];

  photoURLs = [];

  users = [];

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
    firebase.auth().onAuthStateChanged(this.#handleAuthStateChange);
  }

  #handleAuthStateChange = async (user) => {
    this.isGettingUser = true;
    if (user) {
      const phone = user.phoneNumber;

      let userInfo = await userAPI.getUserInfo(phone);

      if (userInfo === null) {
        userInfo = await userAPI.createUser(phone);
      }

      this.isAdmin = await adminAPI.checkIsAdmin(userInfo.id);
      this.user = userInfo;
      this.getAddresses();
      this.getPhotoURLs();
    } else {
      this.isAdmin = false;
      this.user = null;
    }
    this.isGettingUser = false;
  };

  editUser = async (newData) => {
    const fullData = { ...this.user, ...newData };
    const { id, ...data } = { ...fullData };

    await userAPI.editUser(id, data);
    this.user = fullData;
  };

  editFaces = async ({ faceId, name = "", surname = "" }) => {
    // TODO баг когда два одинаковых файла
    const faces = this.user.faces.map((el) =>
      el.fileId === faceId ? { ...el, name, surname } : el
    );
    const fullData = { ...this.user, faces };
    const { id, ...data } = { ...fullData };

    await userAPI.editUser(id, data);
    this.user = fullData;
  };

  deleteFace = async (faceId) => {
    const faces = this.user.faces.filter((el) => el.fileId !== faceId);
    const photoURLs = this.photoURLs.filter((el) => el.id !== faceId);
    const fullData = { ...this.user, faces };
    const { id, ...data } = { ...fullData };

    // eslint-disable-next-line no-empty
    try { await userAPI.deletePhoto(faceId); } catch {}
    await userAPI.editUser(id, data);
    this.photoURLs = photoURLs;
    this.user = fullData;
  };

  getAddresses = async () => {
    this.addresses = await adminAPI.getAdrdesses();
  };

  getPhotoURLs = async (user) => {
    const photoURLs = await Promise.all((user?.faces || this.user.faces).map(async (face) => {
      try {
        const url = await userAPI.getPhotoUrl(face.fileId);
        return { id: face.fileId, url };
      } catch {
        console.log("Произошла ошибка. Попробуйте добавить фотографию заново." );
        return { id: face.fileId, url: '' };
      }
    }));
    this.photoURLs = photoURLs;
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
      await userAPI.uploadPhoto(fileId, file);
      await this.editUser({ faces: [...this.user.faces, newFace] });
      this.user.faces.push(newFace);
      this.photoURLs.push({ id: fileId, url: URL.createObjectURL(file) });
    } catch (err) {
      console.log(err);
      console.log('Не удалось загрузить фото');
    }
  };

  getUsers = async () => {
    this.users = await adminAPI.getUsers();
  };
}

const store = new Store();

export { store };
