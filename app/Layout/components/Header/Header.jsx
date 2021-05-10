/* eslint-disable jsx-a11y/anchor-is-valid */
import { observer } from "mobx-react-lite";
import Link from 'next/link';

import { store } from 'store';
import { Button, Container } from "components";
import { authAPI } from "api/authAPI";

import cl from "./Header.module.scss";

const Header = observer(() => {
  const { user } = store;

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
          {user 
            ? <>
                {user.name && user.surname 
                  ? <span className={cl.user}>{user.name} {user.surname}</span>
                  : <span className={cl.user}>{user.phone}</span>
                }
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
