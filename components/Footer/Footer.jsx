import Link from 'next/link';

import { Container } from 'components';

import cl from './Footer.module.scss';

const Footer = () => (
  <footer className={cl.root}>
    <Container>
      <div className={cl.contacts}>
        <h4>Контакты</h4>
        <ul>
          <li>Адрес: Садовая 22</li>
          <li>Телефон: +7 999 555 22 33</li>
          <li>Email: email@mail.com</li>
        </ul>
      </div>
      <div className={cl.links}>
        <h4>Ссылки</h4>
        <ul>
          <li>Стоимость</li>
          <li>
            <Link href='/politics'>
              <a>Политика конфиденциальности</a>
            </Link>
          </li>
          <li>Реквизиты</li>
        </ul>
      </div>
    </Container>
  </footer>
);

export { Footer };
