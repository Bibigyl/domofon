import React, { useState, useEffect } from 'react';
import { toJS } from 'mobx';
import { observer } from 'mobx-react-lite';
import { Dialog, TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';

import { store } from 'store';
import { Button } from 'components';

import cl from './PayButton.module.scss';

const textFields = [
  { label: 'Имя Фамилия', field: 'fullName', required: true },
  // { label: 'Email', field: 'email' },
  // { label: 'Телефон', field: 'phone', required: true },
  { label: 'Номер договора', field: 'contractNumber', required: true }
];

const getInitialData = (user, addresses) => {
  if (!user || addresses.length === 0) return {};

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

const PayButton = observer(({ className, children }) => {
  const { user } = store.userStore;
  const { addresses } = store.addressesStore;
  const [showForm, setShowForm] = useState(false);
  const [data, setData] = useState(getInitialData(toJS(user), toJS(addresses)));

  useEffect(() => {
    setData(getInitialData(toJS(user), toJS(addresses)));
  }, [user, addresses]);

  const handleSubmit = async (ev) => {
    ev.preventDefault();

    try {
      const response = await fetch('/api/pay', {
        method: 'POST',
        body: JSON.stringify({ data, returnURL: window.location.href })
      });

      const result = await response.json();
      window.open(result.confirmation.confirmation_url);

      setShowForm(false);
    } catch (err) {
      alert('Произошла ошибка');
      console.error(err);
    }
  };

  const getFullUserAddress = (userAddr) =>
    userAddr && addresses.length
      ? addresses.find((addr) => addr.id === userAddr.id).fullAddress +
        (userAddr.flat && `, кв. ${userAddr.flat}`)
      : '';

  return (
    <>
      <div onClick={() => setShowForm(true)} className={className || ''}>
        {children}
      </div>

      <Dialog maxWidth="md" open={showForm} onClose={() => setShowForm(false)}>
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
              defaultValue={toJS(user) && toJS(user).addresses[0]}
              getOptionLabel={getFullUserAddress}
              options={toJS(user) ? toJS(user).addresses : []}
              onChange={(_, addr) => setData({ ...data, address: getFullUserAddress(addr) })}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Адрес"
                  name="address"
                  onChange={(ev) => setData({ ...data, address: ev.target.value })}
                  required
                />
              )}
            />
          </div>

          <div className={cl.buttons}>
            <Button type="submit">Оплатить</Button>
            <Button onClick={() => setShowForm(false)}>Отмена</Button>
          </div>
        </form>
      </Dialog>
    </>
  );
});

export { PayButton };
