import { makeAutoObservable } from "mobx";

import { API } from "api";

class AddressesStore {

  addresses = [];

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });

    this.getAddresses = this.getAddresses.bind(this);
  }

  *getAddresses() {
    this.addresses = yield API.getAdrdesses();
  }
}

const addressesStore = new AddressesStore();

export { addressesStore };
