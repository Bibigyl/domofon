import React, { useState, useEffect, useRef } from 'react';
import { Dialog, TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';

import { store } from 'store';
import { Button } from 'components';

import { getYoukassaHtml } from './getYoukassaHtml';
import cl from './PayButton.module.scss';

const textFields = [
  { label: 'Имя Фамилия', field: 'fullName', required: true },
  { label: 'Email', field: 'email' },
  { label: 'Телефон', field: 'phone', required: true },
  { label: 'Номер договора', field: 'contractNumber', required: true },
];

const getInitialData = (user, addresses) => {
  if (!user || !addresses) return {};

  const data = {};
  textFields.forEach((el) => {
    data[el.field] = user[el.field];
  });

  const firstAddr = user.addresses[0];
  if (firstAddr) {
    data.address =
      addresses.find((addr) => addr.id === firstAddr.id).fullAddress +
      (firstAddr.flat && `, кв. ${firstAddr.flat}`);
    data.message = '';
  }
  return data;
};

const PayButton = ({ className, children }) => {
  const { user } = store.userStore;
  const { addresses } = store.addressesStore;
  const [showForm, setShowForm] = useState(false);
  const [data, setData] = useState(getInitialData(user, addresses));
  const youkassaButtonRef = useRef();

  useEffect(() => {
    setData(getInitialData(user, addresses));
  }, [user, addresses]);

  const handleSubmit = (ev) => {
    ev.preventDefault();

    youkassaButtonRef.current.querySelector('button').click();

    // const body = {
    //   fields: allFields.map((el) => ({ ...el, value: data[el.field] })),
    // };

    // console.log(body);

    return false;
  };

  const getFullUserAddress = (userAddr) =>
    userAddr
      ? addresses.find((addr) => addr.id === userAddr.id).fullAddress +
        (userAddr.flat && `, кв. ${userAddr.flat}`)
      : '';

  const createMarkup = () => ({ __html: getYoukassaHtml(data) });

  return (
    <>
      <div onClick={() => setShowForm(true)} className={className || ''}>
        {children}
      </div>

      <div hidden ref={youkassaButtonRef} dangerouslySetInnerHTML={createMarkup()} />

      <Dialog maxWidth='md' open={showForm} onClose={() => setShowForm(false)}>
        <form className={cl.form} onSubmit={handleSubmit}>
          <h2 className={cl.title}>Оплата</h2>
          <div className={cl.fields}>
            {textFields.map(({ label, field, required }) => (
              <TextField
                key={field}
                className={cl.field}
                label={label}
                value={data[field] || ''}
                onChange={(ev) => setData({ ...data, [field]: ev.target.value })}
                name={field}
                required={!!required}
              />
            ))}
            <Autocomplete
              freeSolo
              className={cl.field}
              defaultValue={user && user.addresses[0]}
              getOptionLabel={getFullUserAddress}
              options={user ? user.addresses : []}
              onChange={(_, addr) => setData({ ...data, address: getFullUserAddress(addr) })}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label='Адрес'
                  name='address'
                  onChange={(ev) => setData({ ...data, address: ev.target.value })}
                  required
                />
              )}
            />
          </div>

          <div className={cl.buttons}>
            <Button type='submit'>Оплатить</Button>
            <Button onClick={() => setShowForm(false)}>Отмена</Button>
          </div>
        </form>
      </Dialog>
    </>
  );
};

export { PayButton };
