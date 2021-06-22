import { useState, useEffect } from "react";
import "firebase/auth";
import { Card, TextField } from "@material-ui/core";

import { CodeInput, Button } from "../../components";
import { authAPI } from "../../api/authAPI";
import cl from "./Login.module.scss";

const Login = () => {
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);

  useEffect(() => {
    authAPI.recaptchaVerifierInvisible(() => setIsCodeSent(true));
  }, []);

  const signIn = (ev) => {
    ev.preventDefault();
    const validPhone = `+7${phone.replace(/\D/g, "").slice(1)}`;
    if (validPhone.length !== 12) return;
    try {
      authAPI.phoneSignIn(validPhone);
    } catch (err) {
      alert(err.message);
    }
  };

  const verifyCode = (ev) => {
    ev.preventDefault();
    try {
      authAPI.verifyCode(code);
    } catch (err) {
      alert(err.message);
    }
  };

  const handlePhoneChange = (ev) => setPhone(ev.target.value);

  return (
    <div className={cl.root}>
      <Card className={cl.card}>
        <h1 className={cl.title}>Войти в личный кабинет</h1>
        {!isCodeSent ? (
          <form className={cl.form} onSubmit={signIn}>
            <TextField
              label="Введите телефон"
              type="tel"
              name="phone"
              className={cl.input}
              onChange={handlePhoneChange}
            />
            <div id="recaptcha" />
            <Button className={cl.button} type="submit">
              Далее
            </Button>
          </form>
        ) : (
          <form className={cl.form} onSubmit={verifyCode}>
            <div className={cl.phone}>{phone}</div>
            <CodeInput className={cl.input} onChange={setCode} />
            <Button className={cl.button} type="submit">
              Отправить код
            </Button>
          </form>
        )}
      </Card>
    </div>
  );
};

export { Login };
