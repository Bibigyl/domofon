import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { IconButton, Tooltip, Dialog, Paper } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';

import { store } from 'store';
import { InfoRequest } from 'components';

import { Edit, Faces } from './components';
import cl from './UserCabinet.module.scss';
import { buttonHTML } from './button';

const UserCabinet = observer(() => {
  const { isAdmin } = store;
  const { user, editUser } = store.userStore;
  const { addresses } = store.addressesStore;
  const [showEdit, setShowEdit] = useState(false);

  const getAddresses = () =>
    user.addresses.map((userAddr) => {
      let string = addresses.find((ad) => ad.id === userAddr.id).fullAddress;
      if (userAddr.flat) string = `${string}, кв.${userAddr.flat}`;
      return string;
    });

  if (!user) return null;

  function createMarkup() {
    return { __html: buttonHTML };
  }

  const pay = () => {
    fetch('/api/pay', {
      method: 'POST',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    }).then((res) => {
      console.log(555555, res);
    });
  };

  return (
    <div className={cl.root}>
      <div className={cl.test}>
        тест оплаты
        <button type='button' onClick={pay}>
          click
        </button>
        <div dangerouslySetInnerHTML={createMarkup()} />
      </div>

      <div className={cl.user}>
        <Paper className={cl.info}>
          <AssignmentIndIcon className={cl.infoIcon} color='primary' />
          <div className={cl.titleWarp}>
            <h2>{user.fullName || 'Заполните данные'}</h2>
            <div className={cl.infoEdit}>
              <Tooltip title='Редактировать'>
                <IconButton
                  onClick={() => {
                    setShowEdit(true);
                  }}
                >
                  <EditIcon />
                </IconButton>
              </Tooltip>
            </div>
          </div>
          <dl>
            <dt>Телефон</dt>
            <dd>{user.phone || '___'}</dd>
            <dt>Email</dt>
            <dd>{user.email || '___'}</dd>
            <dt>Адреса</dt>
            <dd>
              {getAddresses().map((addr) => (
                <div key={addr}>{addr}</div>
              ))}
              {getAddresses().length === 0 && '___'}
            </dd>
            <dt>Номер договора</dt>
            <dd>{user.contractNumber || '___'}</dd>
          </dl>
        </Paper>

        <Faces className={cl.facesWrap} />
      </div>

      {!isAdmin && <InfoRequest className={cl.infoRequest} />}

      <Dialog maxWidth='md' open={showEdit} onClose={() => setShowEdit(false)}>
        <Edit onSave={editUser} onCancel={() => setShowEdit(false)} />
      </Dialog>
    </div>
  );
});

export { UserCabinet };
