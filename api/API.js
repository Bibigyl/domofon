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
    let validPhone;
    if (phoneNumber) {
      validPhone = `+7${phoneNumber.replace(/\D/g, "").slice(1)}`;
      if (validPhone.length !== 12) throw new Error('Неправильный формат номера телефона');
    }
    const emptyUser = {
      phone: validPhone || "",
      addresses: [],
      contractNumber: "",
      email: "",
      faces: [],
      name: "",
      surname: "",
      paidUntil: "",
    };

    return db
      .collection("users")
      .add(emptyUser)
      .then((docRef) => ({
        id: docRef.id,
        ...emptyUser,
      }));
  };

  removeUser = async (userId) => 
    db
      .collection("users")
      .doc(userId)
      .delete()
  

  editUser = async (userData) => {
    const { id, ...data } = { ...userData };
    if (data.phone) {
      const validPhone = `+7${data.phone.replace(/\D/g, "").slice(1)}`;
      if (validPhone.length !== 12) throw new Error('Неправильный формат номера телефона');
      data.phone = validPhone;
    }

    return db
      .collection("users")
      .doc(id)
      .set(data)
      .then(() => ({ id, ...data }));
  };

  // checkIsAdmin = async (userId) =>
  //   db
  //     .collection("admins")
  //     .where("id", "==", userId)
  //     .get()
  //     .then((querySnapshot) => {
  //       let isAdmin = false;
  //       querySnapshot.forEach((doc) => {
  //         isAdmin = doc.data();
  //         isAdmin = true;
  //       });
  //       return isAdmin;
  //     });


  checkIsAdmin = async (userPhone) =>
    db
      .collection("admins")
      .where("phone", "==", userPhone)
      .get()
      .then((querySnapshot) => {
        let isAdmin = false;
        querySnapshot.forEach(() => {
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

  getAdmins = async () =>
    db
      .collection("admins")
      .get()
      .then((querySnapshot) => {
        const admins = [];
        querySnapshot.forEach((doc) => {
          const admin = doc.data();
          admins.push({ id: doc.id, ...admin });
        });
        return admins;
      });

  removeAdmin = async (adminId) => 
    db
      .collection("admins")
      .doc(adminId)
      .delete()

  createAdmin = async (data) => {
    if (!data.phone) throw new Error('Укажите номер телефона');
    const validPhone = `+7${data.phone.replace(/\D/g, "").slice(1)}`;
    if (validPhone.length !== 12) throw new Error('Неправильный формат номера телефона');

    const params = {
      phone: validPhone,
      name: data.name || '',
      surname: data.surname || '',
    };

    return db
      .collection("admins")
      .add(params)
      .then((docRef) => ({
        id: docRef.id,
        ...params,
      }));
  };

  removeAddress = async (addressId) => 
    db
      .collection("addresses")
      .doc(addressId)
      .delete()

  createAddress = async (data) => {
    const params = {
      city: data.city,
      address: data.address,
    };
    
    return db
      .collection("addresses")
      .add(params)
      .then((docRef) => ({
        id: docRef.id,
        ...params,
      }));
  };
}

const API = new FirebaseAPI();

export { API };
