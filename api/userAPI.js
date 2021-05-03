import { db } from "../firebase";

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

  createUser = async (phoneNumber) =>
    db
      .collection("users")
      .add({ phone: phoneNumber })
      .then((docRef) => ({
          id: docRef.id,
          phone: phoneNumber,
        }));
}

const userAPI = new UserAPI();

export { userAPI };
