import {
  makeAutoObservable,
  configure,
  makeObservable,
  observable,
  flow,
} from "mobx";
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

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
    firebase.auth().onAuthStateChanged(this.handleAuthStateChange);
  }

  handleAuthStateChange = async (user) => {
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
    } else {
      this.isAdmin = false;
      this.user = null;
    }
    this.isGettingUser = false;
  };

  editUser = async (newData) => {
    this.isGettingUser = true;
    const { id, ...data } = { ...newData };
    await userAPI.editUser(id, data);
    this.user = { ...this.user, ...newData };
    this.isGettingUser = false;
  };

  getAddresses = async () => {
    this.addresses = await adminAPI.getAdrdesses();
  };
}

const store = new Store();

export { store };
