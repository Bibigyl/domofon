import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC3zHAPQ_EPGeOKh4xneM1pI3MU2txPZr8",
  authDomain: "profdelodon-8aaf0.firebaseapp.com",
  projectId: "profdelodon-8aaf0",
  storageBucket: "profdelodon-8aaf0.appspot.com",
  messagingSenderId: "988806903810",
  appId: "1:988806903810:web:565dfac0aaffb36137cf1b",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const storage = firebase.storage();

export const storageRef = storage.ref();

export const db = firebase.firestore();
