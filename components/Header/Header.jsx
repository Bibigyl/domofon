/* eslint-disable jsx-a11y/anchor-is-valid */
import { observer } from 'mobx-react-lite';
import Link from 'next/link';

import { store } from 'store';
import { Button, Container } from 'components';
import { authAPI } from 'api/authAPI';

import cl from './Header.module.scss';

const Header = observer(() => {
  const { isAdmin } = store;
  const { user } = store.userStore;
  const { admin, admins } = store.adminStore;

  const hasAuth = (isAdmin && admin) || (!isAdmin && user);
  const data = isAdmin ? admin : user;

  const getUserName = () => {
    if ((isAdmin && !admins) || !data) return '';
    return (
      (isAdmin ? admins.find((admin) => admin.phone === data.phone)?.fullName : data.fullName) ||
      data.phone
    );
  };

  return (
    <header className={cl.root}>
      <Container className={cl.container}>
        <ul className={cl.menu}>
          <li>
            <Link href='/'>
              <a>Главная</a>
            </Link>
          </li>
          <li>
            <Link href='/cabinet'>
              <a>Личный кабинет</a>
            </Link>
          </li>
        </ul>
        <div className={cl.userInfo}>
          {hasAuth ? (
            <>
              {!isAdmin && user?.paidUntil && (
                <span className={cl.paidUntil}>
                  <span>Оплачено до: </span>
                  {user.paidUntil}
                </span>
              )}
              <span className={cl.userName}>{getUserName()}</span>
              <Button theme='outlined' onClick={authAPI.logout}>
                Выйти
              </Button>
            </>
          ) : (
            <Link href='/cabinet'>
              <a>
                <Button theme='outlined'>Личный кабинет</Button>
              </a>
            </Link>
          )}
        </div>
      </Container>
    </header>
  );
});

export { Header };
