import { makeAutoObservable } from "mobx";
import firebase from "firebase/app";

import { API } from "api";
import { photoURLs } from 'helpers';

import { userStore } from './stores/userStore';
import { adminStore } from './stores/adminStore';


// configure({
//   enforceActions: "never",
// });

class Store {
  isGettingAuth = true;

  isAdmin = false;

  userStore = userStore;

  adminStore = adminStore;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
    firebase.auth().onAuthStateChanged(this.#handleAuthStateChange);
  }

  #handleAuthStateChange = async (user) => {
    this.isGettingAuth = true;
    if (user) {
      const phone = user.phoneNumber;

      let userInfo = await API.getUserInfo(phone);

      if (userInfo === null) {
        userInfo = await API.createUser(phone);
      }

      this.isAdmin = await API.checkIsAdmin(userInfo.id);
      this.userStore.setUser(userInfo);
      
      if (!this.isAdmin) {
        await this.userStore.getAddresses();
        await this.userStore.getPhotoURLs();
      } else {
        await this.adminStore.getUsers();
        await this.adminStore.getAddresses();
        await photoURLs.loadByUser(userInfo);
      }

    } else {
      this.isAdmin = false;
      this.user = null;
    }
    this.isGettingAuth = false;
  };
}

const store = new Store();

export { store };
