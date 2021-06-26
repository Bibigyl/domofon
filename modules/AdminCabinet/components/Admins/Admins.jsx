import React, { useEffect, useState, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { toJS } from 'mobx';
import { IconButton, Tooltip, TextField, Dialog, Paper } from '@material-ui/core';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import DeleteIcon from '@material-ui/icons/Delete';
import SaveIcon from '@material-ui/icons/Save';

import { Button } from 'components';
import { store } from 'store';
import { API } from 'api';

import cl from './Admins.module.scss';

const FORM = {
  CREATE: 'CREATE',
  REMOVE: 'REMOVE',
};

const textFields = [
  { label: 'Имя', field: 'name' },
  { label: 'Фамилия', field: 'surname' },
  { label: 'Телефон', field: 'phone' },
];

const Admins = observer(({ className }) => {
  const { admins, getAdmins, getUsers } = store.adminStore;
  const [openAdmin, setOpenAdmin] = useState(null);
  const [formType, setFormType] = useState(null);
  const formRef = useRef();

  useEffect(() => {
    if (openAdmin) {
      setOpenAdmin(toJS(admins).find((admin) => admin.id === openAdmin.id) || null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [admins]);

  const createAdmin = async () => {
    const params = {};
    let isFilled = false;
    textFields.forEach(({ field }) => {
      const value = formRef.current.elements[field].value || '';
      isFilled = isFilled || !!value;
      params[field] = value;
    });
    if (isFilled) {
      try {
        await API.createAdmin(params);
        await getAdmins();
        setFormType(null);
      } catch (err) {
        alert(err);
      }
    }
    getUsers();
  };

  const removeAdmin = async () => {
    try {
      await API.removeAdmin(openAdmin.id);
      await getAdmins();
    } catch (err) {
      alert(err);
    }
    setFormType(null);
    getUsers();
  };

  const getText = ({ name, surname, phone }, field) => {
    let text;
    if (field === 'name') text = (name || surname) && `${name} ${surname || ''}`;
    if (field === 'phone') text = phone;
    return text || '___';
  };

  return (
    <div className={`${cl.root} ${className}`}>
      <Paper className={cl.controls}>
        <h3>Администраторы</h3>
        <Tooltip title='Удалить администратора'>
          <IconButton
            className={`${!openAdmin ? cl.disabled : ''}`}
            onClick={() => setFormType(FORM.REMOVE)}
          >
            <DeleteIcon style={{ color: '#2f7491' }} />
          </IconButton>
        </Tooltip>
        <Tooltip title='Добавить администратора'>
          <IconButton onClick={() => setFormType(FORM.CREATE)}>
            <PersonAddIcon style={{ color: '#2f7491' }} />
          </IconButton>
        </Tooltip>
      </Paper>
      <div className={cl.tableWrap}>
        <table className={cl.table}>
          <thead>
            <tr>
              <th data-content='phone'>Номер телефона</th>
              <th data-content='name'>Имя Фамилия</th>
            </tr>
          </thead>
          <tbody>
            {toJS(admins).map((admin) => (
              <tr
                className={openAdmin && openAdmin.id === admin.id ? cl.selectedTr : ''}
                key={admin.id}
                onClick={() => setOpenAdmin(admin)}
              >
                <td data-content='phone'>{getText(admin, 'phone')}</td>
                <td data-content='name'>{getText(admin, 'name')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog maxWidth='md' open={!!formType} onClose={() => setFormType(null)}>
        {formType === FORM.REMOVE && (
          <div className={cl.form}>
            <h3>Вы уверены что хотите удалить администратора?</h3>
            {openAdmin?.name && <p>{`${openAdmin.name} ${openAdmin.surname}`}</p>}
            {openAdmin?.phone && <p>{openAdmin.phone}</p>}
            <div className={cl.formButtons}>
              <Button onClick={removeAdmin}>Да</Button>
              <Button onClick={() => setFormType(null)}>Нет</Button>
            </div>
          </div>
        )}

        {formType === FORM.CREATE && (
          <form className={cl.form} ref={formRef}>
            <h2 className={cl.title}>Создать администратора</h2>
            <div className={cl.fields}>
              {textFields.map(({ label, field }) => (
                <TextField key={field} className={cl.field} label={label} name={field} />
              ))}
            </div>
            <div className={cl.formButtons}>
              <Button startIcon={<SaveIcon />} onClick={createAdmin}>
                Сохранить
              </Button>
              <Button onClick={() => setFormType(null)}>Отмена</Button>
            </div>
          </form>
        )}
      </Dialog>
    </div>
  );
});

export { Admins };
