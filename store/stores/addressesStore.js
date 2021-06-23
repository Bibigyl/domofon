import { makeAutoObservable } from "mobx";

import { API } from "api";

class AddressesStore {

  addresses = [];

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  *getAddresses() {
    const addresses = yield API.getAddresses();
    this.addresses = addresses.sort((a, b) => a.fullAddress > b.fullAddress ? 1 : -1);
  }
}

const addressesStore = new AddressesStore();

export { addressesStore };
