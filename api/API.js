/* eslint-disable arrow-body-style */
import { db, storageRef } from '../firebase';
import 'firebase/storage';

const getFullName = ({ name, surname }) => {
  return (surname || '') + (surname && name ? ' ' : '') + (name || '');
};

const commonError = new Error('Произошла ошибка. Попробуйте обновить страницу.');
const errorText = 'Произошла ошибка.';

const emptyUser = {
  phone: '',
  addresses: [],
  contractNumber: '',
  email: '',
  faces: [],
  name: '',
  surname: '',
  paidUntil: '',
};

class FirebaseAPI {
  getUserInfo = async (phoneNumber) =>
    db
      .collection('users')
      .where('phone', '==', phoneNumber)
      .get()
      .then((querySnapshot) => {
        let userInfo = null;
        querySnapshot.forEach((doc) => {
          userInfo = doc.data();
          userInfo.id = doc.id;
          userInfo.fullName = getFullName(userInfo);
        });
        return { ...emptyUser, ...userInfo };
      })
      .catch(() => {
        throw commonError;
      });

  createUser = async (phoneNumber) => {
    let validPhone = '';
    if (phoneNumber) {
      validPhone = `+7${phoneNumber.replace(/\D/g, '').slice(1)}`;
      if (validPhone.length !== 12) throw new Error('Неправильный формат номера телефона');
    }
    return db
      .collection('users')
      .add({ ...emptyUser, phone: validPhone })
      .then((docRef) => ({
        id: docRef.id,
        fullName: '',
        ...emptyUser,
      }))
      .catch(() => {
        throw commonError;
      });
  };

  removeUser = async (userId) =>
    db
      .collection('users')
      .doc(userId)
      .delete()
      .catch(() => {
        throw new Error(`${errorText} Не удалось удалить пользователя.`);
      });

  editUser = async (userData) => {
    const { id, fullName, ...data } = userData;
    if (data.phone) {
      const validPhone = `+7${data.phone.replace(/\D/g, '').slice(1)}`;
      if (validPhone.length !== 12) throw new Error('Неправильный формат номера телефона');
      data.phone = validPhone;
    }

    return db
      .collection('users')
      .doc(id)
      .set({ ...emptyUser, ...data })
      .then(() => ({ ...emptyUser, id, fullName: getFullName(data), ...data }))
      .catch(() => {
        throw new Error(`${errorText} Не удалось сохранить данные.`);
      });
  };

  checkIsAdmin = async (userPhone) =>
    db
      .collection('admins')
      .where('phone', '==', userPhone)
      .get()
      .then((querySnapshot) => {
        let isAdmin = false;
        querySnapshot.forEach(() => {
          isAdmin = true;
        });
        return isAdmin;
      })
      .catch(() => {
        throw commonError;
      });

  getAddresses = async () =>
    db
      .collection('addresses')
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
      })
      .catch(() => {
        throw commonError;
      });

  uploadPhoto = async (fileId, file) =>
    storageRef
      .child('users')
      .child(`${fileId}.jpg`)
      .put(file)
      .then((snapshot) => {
        console.log('Uploaded a blob or file!', snapshot);
        return file;
      })
      .catch(() => {
        throw new Error(`${errorText} Не удалось загрузить изображение.`);
      });

  getPhotoUrl = async (fileId) =>
    storageRef
      .child('users')
      .child(`${fileId}.jpg`)
      .getDownloadURL()
      .then((url) => url)
      .catch(() => {
        console.log('Не удалось получить фото');
      });

  deletePhoto = async (fileId) =>
    storageRef
      .child('users')
      .child(`${fileId}.jpg`)
      .delete()
      .catch(() => {
        throw new Error(`${errorText} Не удалось удалить изображение.`);
      });

  getUsers = async () =>
    db
      .collection('users')
      .get()
      .then((querySnapshot) => {
        const users = [];
        querySnapshot.forEach((doc) => {
          const user = doc.data();
          users.push({ ...emptyUser, id: doc.id, fullName: getFullName(user), ...user });
        });
        return users;
      })
      .catch(() => {
        throw commonError;
      });

  getAdmins = async () =>
    db
      .collection('admins')
      .get()
      .then((querySnapshot) => {
        const admins = [];
        querySnapshot.forEach((doc) => {
          const admin = doc.data();
          admins.push({ id: doc.id, fullName: getFullName(admin), ...admin });
        });
        return admins;
      })
      .catch(() => {
        throw commonError;
      });

  removeAdmin = async (adminId) =>
    db
      .collection('admins')
      .doc(adminId)
      .delete()
      .catch(() => {
        throw commonError;
      });

  createAdmin = async (data) => {
    if (!data.phone) throw new Error('Укажите номер телефона');
    const validPhone = `+7${data.phone.replace(/\D/g, '').slice(1)}`;
    if (validPhone.length !== 12) throw new Error('Неправильный формат номера телефона');

    const params = {
      phone: validPhone,
      name: data.name || '',
      surname: data.surname || '',
    };

    return db
      .collection('admins')
      .add(params)
      .then((docRef) => ({
        id: docRef.id,
        ...params,
      }))
      .catch(() => {
        throw commonError;
      });
  };

  removeAddress = async (addressId) =>
    db
      .collection('addresses')
      .doc(addressId)
      .delete()
      .catch(() => {
        throw commonError;
      });

  createAddress = async (data) => {
    const params = {
      city: data.city,
      address: data.address,
    };

    return db
      .collection('addresses')
      .add(params)
      .then((docRef) => ({
        id: docRef.id,
        ...params,
      }))
      .catch(() => {
        throw commonError;
      });
  };

  editAddress = async (addressData) => {
    const { id, address = '', city = '' } = addressData;

    return db
      .collection('addresses')
      .doc(id)
      .set({ address, city })
      .then(() => ({ id, city, address, fullAddress: `${city}, ${address}` }))
      .catch(() => {
        throw new Error(`${errorText} Не удалось сохранить данные.`);
      });
  };
}

const API = new FirebaseAPI();

export { API };
