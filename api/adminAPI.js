import { db } from "../firebase";

class AdminAPI {
  checkIsAdmin = async (userId) =>
    db
      .collection("admins")
      .where("id", "==", userId)
      .get()
      .then((querySnapshot) => {
        let isAdmin = false;
        querySnapshot.forEach((doc) => {
          isAdmin = doc.data();
          isAdmin = true;
        });
        return isAdmin;
      });

  getAdrdesses = async () =>
    db
      .collection("addresses")
      .get()
      .then((querySnapshot) => {
        const addresses = [];
        querySnapshot.forEach((doc) => {
          const { city, address } = doc.data();
          addresses.push({ city, address, id: doc.id, fullAddress: `${city}, ${address}` });
        });
        return addresses;
      });

  getUsers = async () =>
    db
      .collection("users")
      .get()
      .then((querySnapshot) => {
        const users = [];
        querySnapshot.forEach((doc) => {
          const user = doc.data();
          users.push({ id: doc.id, ...user });
        });
        return users;
      });
}

const adminAPI = new AdminAPI();

export { adminAPI };
