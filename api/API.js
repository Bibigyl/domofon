/* eslint-disable arrow-body-style */
import { db, storageRef } from "../firebase";
import "firebase/storage";

class FirebaseAPI {
  getUserInfo = async (phoneNumber) =>
    db
      .collection("users")
      .where("phone", "==", phoneNumber)
      .get()
      .then((querySnapshot) => {
        let userInfo = null;
        querySnapshot.forEach((doc) => {
          userInfo = doc.data();
          userInfo.id = doc.id;
        });
        return userInfo;
      });

  createUser = async (phoneNumber) => {
    const emptyUser = {
      phone: phoneNumber,
      addresses: [],
      contractNumber: "",
      email: "",
      faces: [],
      name: "",
      surname: "",
    };

    return db
      .collection("users")
      .add(emptyUser)
      .then((docRef) => ({
        id: docRef.id,
        ...emptyUser,
      }));
  };

  editUser = async (userData) => {
    const { id, ...data } = { ...userData };
    return db
      .collection("users")
      .doc(id)
      .set(data)
      .then((res) => console.log("res   ", res));
  }

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
          addresses.push({
            city,
            address,
            id: doc.id,
            fullAddress: `${city}, ${address}`,
          });
        });
        return addresses;
      });

  uploadPhoto = async (fileId, file) =>
    storageRef
      .child("users")
      .child(`${fileId}.jpg`)
      .put(file)
      .then((snapshot) => {
        console.log("Uploaded a blob or file!", snapshot);
        return file;
      });

  getPhotoUrl = async (fileId) =>
    storageRef
      .child("users")
      .child(`${fileId}.jpg`)
      .getDownloadURL()
      .then((url) => url);

  deletePhoto = async (fileId) =>
    storageRef.child("users").child(`${fileId}.jpg`).delete();

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

const API = new FirebaseAPI();

export { API };
