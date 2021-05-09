/* eslint-disable jsx-a11y/anchor-is-valid */
import { Container } from "@material-ui/core";
import { observer } from "mobx-react-lite";
import Link from 'next/link';

import { store } from 'store';
import { Button } from "components";
import { authAPI } from "api/authAPI";

import cl from "./Header.module.scss";

const Header = observer(() => {
  const { user } = store;

  return (
    <header className={cl.root}>
      <Container className={cl.container} maxWidth="lg">
        <ul className={cl.menu}>
          <li>
            <Link href="/">
              <a>Главная</a>
            </Link>
          </li>
          <li>
            <Link href="/cabinet">
              <a>Личный кабинет</a>
            </Link>
          </li>
        </ul>
        <div className={cl.cabinet}>
          {user 
          ? <>
              {user.name && user.surname && <span className={cl.user}>{user.name} {user.surname}</span>}
              <Button  color="default" onClick={authAPI.logout}>Выйти</Button>
            </> 
          : <Link href="/">
              <Button color="default" onClick={authAPI.login}>Личный кабинет</Button>
            </Link>
          }
        </div>
      </Container>
    </header>
  );
});

export { Header };
