/* eslint-disable jsx-a11y/anchor-is-valid */
import { observer } from "mobx-react-lite";
import Link from 'next/link';
import Alert from '@material-ui/lab/Alert';

import { store } from 'store';
import { Button, Container } from "components";
import { authAPI } from "api/authAPI";

import cl from "./Header.module.scss";

const Header = observer(() => {
  const { isAdmin } = store;
  const { user } = store.userStore;
  const { admin } = store.adminStore;
  
  console.log(isAdmin);
  const hasAuth = isAdmin && admin || !isAdmin && user;
  const data = isAdmin ? admin : user;
  const userName = (data?.name && data?.surname) ? `${data.name} ${data.surname}` : data?.phone;

  return (
    <header className={cl.root}>
      <Container className={cl.container}>
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
          {hasAuth 
            ? <>
                {!isAdmin && user?.paidUntil && <span className={cl.caption}>Оплачено до: {user.paidUntil}</span>}
                <span className={cl.caption}>Пользователь: {userName}</span>
                <Button theme='outlined' onClick={authAPI.logout}>Выйти</Button>
              </> 
            : <Link href="/cabinet">
                <a><Button theme='outlined'>Личный кабинет</Button></a>
              </Link>
          }
        </div>
      </Container>
    </header>
  );
});

export { Header };
