import { db, storageRef } from "../firebase";
import "firebase/storage";

class UserAPI {
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

    db.collection("users")
      .add(emptyUser)
      .then((docRef) => ({ id: docRef.id, ...emptyUser }));
  };

  editUser = async (id, data) => {
    db.collection("users")
      .doc(id)
      .set(data)
      .then((res) => console.log("res   ", res))
      .catch((err) => console.log("ошибка   ", err));
  };

  uploadPhoto = async (fileId, file) => {
    storageRef
      .child("users")
      .child(`${fileId}.jpg`)
      .put(file)
      .then((snapshot) => {
        console.log("Uploaded a blob or file!", snapshot);
        return file;
      });
  };

  getPhotoUrl = async (id) =>
    storageRef
      .child("users")
      .child(`${id}.jpg`)
      .getDownloadURL()
      .then((url) => url);

  deletePhoto = async (id) => {
    storageRef.child("users").child(`${id}.jpg`).delete();
  };
}

const userAPI = new UserAPI();

export { userAPI };
