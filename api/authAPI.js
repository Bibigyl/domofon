import firebase from "firebase/app";
import "firebase/auth";

class AuthAPI {
  recaptchaVerifier = null;

  confirmationResult = null;

  recaptchaVerifierVisible = (callback) => {
    this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier("recaptcha", {
      size: "normal",
      callback,
    });
  };

  recaptchaVerifierInvisible = (callback) => {
    this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier("recaptcha", {
      size: "invisible",
      callback,
    });
  };

  phoneSignIn = (phoneNumber) => {
    firebase
      .auth()
      .signInWithPhoneNumber(phoneNumber, this.recaptchaVerifier)
      .then((confirmationResult) => {
        this.confirmationResult = confirmationResult;
      });
  };

  verifyCode = (code) => {
    this.confirmationResult.confirm(code);
  };

  logout = () => {
    firebase.auth().signOut();
  };
}

const authAPI = new AuthAPI();

export { authAPI };
