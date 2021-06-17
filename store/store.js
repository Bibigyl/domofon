import { makeAutoObservable } from "mobx";
import firebase from "firebase/app";

import { API } from "api";
import { photoURLs } from "helpers";

import { userStore } from "./stores/userStore";
import { adminStore } from "./stores/adminStore";

class Store {
  isGettingAuth = true;

  isAdmin = false;

  userStore = userStore;

  adminStore = adminStore;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
    firebase.auth().onAuthStateChanged(this.handleAuthStateChange.bind(this));
  }

  *handleAuthStateChange(user) {
    this.isGettingAuth = true;
    if (user) {
      const phone = user.phoneNumber;

      let userInfo = yield API.getUserInfo(phone);

      if (userInfo === null) {
        userInfo = yield API.createUser(phone);
      }

      this.isAdmin = yield API.checkIsAdmin(userInfo.id);
      this.userStore.setUser(userInfo);

      if (!this.isAdmin) {
        yield this.userStore.getAddresses();
      } else {
        yield this.adminStore.getUsers();
        yield this.adminStore.getAddresses();
        yield photoURLs.loadByUser(userInfo);
      }
    } else {
      this.isAdmin = false;
      this.user = null;
    }
    this.isGettingAuth = false;
  }
}

const store = new Store();

export { store };
