import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { toJS } from 'mobx';
import { IconButton, Tooltip, Paper, TextField } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

import { API } from 'api';
import { store } from 'store';

import { Faces, Controls, Admins, Addresses } from './components';
import cl from './AdminCabinet.module.scss';

const AdminCabinet = observer(() => {
  const { users, getUsers } = store.adminStore;
  const { addresses } = store.addressesStore;
  const [openUser, setOpenUser] = useState(null);
  const [visibleUsers, setVisibleUsers] = useState(toJS(users));
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [sortField, setSortField] = useState('paidUntil');
  const [isSortAsk, setIsSortAsk] = useState(true);

  useEffect(() => {
    if (openUser) {
      setOpenUser(toJS(users).find((user) => user.id === openUser.id) || null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [users]);

  const togglePanel = () => {
    setIsPanelOpen(!isPanelOpen);
  };

  const savePaidUntil = async (ev) => {
    if (ev.code && ev.code !== 'Enter') return;
    const paidUntil = ev.target.value;
    const input = ev.target;
    if (paidUntil.length !== 10) {
      alert('Неверный формат даты, дата не сохранена');
      input.value = openUser.paidUntil || '';
      input.blur();
      return;
    }
    try {
      await API.editUser({ ...openUser, paidUntil });
      getUsers();
    } catch (err) {
      alert(err);
    }
    input.blur();
  };

  const handleHeaderClick = (ev) => {
    const field = ev.target.dataset.content;
    if (!field) return;
    if (field === sortField) setIsSortAsk(!isSortAsk);
    setSortField(field);
  };

  const getText = (user, field) => {
    let text;
    if (field === 'fullName') text = user.fullName;
    if (field === 'phone') text = user.phone;
    if (field === 'email') text = user.email;
    if (field === 'paidUntil') text = user.paidUntil;
    if (field === 'address') text = getAddresses(user).join('; ');
    if (field === 'contractNumber') text = user.contractNumber;
    return text || '___';
  };

  const getAddresses = (user) =>
    user.addresses.map((userAddr) => {
      let string = addresses.find((ad) => ad.id === userAddr.id).fullAddress;
      if (userAddr.flat) string = `${string}, кв.${userAddr.flat}`;
      return string;
    });

  const sortedUsers = [...visibleUsers].sort((a, b) => {
    if (isSortAsk) {
      return a[sortField] > b[sortField] ? -1 : 1;
    }
    return a[sortField] > b[sortField] ? 1 : -1;
  });

  return (
    <div className={cl.root}>
      <div className={cl.usersHeader}>
        <Paper className={cl.user}>
          {openUser && isPanelOpen && (
            <ul>
              <li>
                <b>Имя: </b>
                {getText(openUser, 'fullName')}
              </li>
              <li>
                <b>Телефон: </b>
                {getText(openUser, 'phone')}
              </li>
              <li>
                <b>Email: </b>
                {getText(openUser, 'email')}
              </li>
              <li>
                <b>Номер договора: </b>
                {getText(openUser, 'contractNumber')}
              </li>
              <li>
                <b>Адресa: </b>
                {getText(openUser, 'address')}
              </li>
              <li>
                <b>Оплачено до: </b>
                <TextField
                  key={openUser.id}
                  defaultValue={openUser?.paidUntil || ''}
                  type="date"
                  onBlur={savePaidUntil}
                  onKeyPress={savePaidUntil}
                />
              </li>
            </ul>
          )}
          <Controls setVisibleUsers={setVisibleUsers} openUser={openUser} />
          <Tooltip title={isPanelOpen ? 'Скрыть панель' : 'Показать панель'}>
            <IconButton hidden={!openUser} size="small" className={cl.hide} onClick={togglePanel}>
              <KeyboardArrowUpIcon style={isPanelOpen ? {} : { transform: 'rotate(180deg)' }} />
            </IconButton>
          </Tooltip>
        </Paper>
        <Faces openUser={isPanelOpen ? openUser : null} className={cl.faces} />
      </div>
      <div className={cl.tableWrap}>
        <table className={cl.table}>
          <thead>
            <tr className={!isSortAsk ? cl.sortDesk : ''} onClick={handleHeaderClick}>
              <th className={sortField === "phone" ? cl.columnActive : ''} data-content="phone">Номер телефона</th>
              <th className={sortField === "fullName" ? cl.columnActive : ''} data-content="fullName">Фамилия Имя</th>
              <th className={sortField === "contractNumber" ? cl.columnActive : ''} data-content="contractNumber">Номер договора</th>
              <th className={sortField === "address" ? cl.columnActive : ''} data-content="address">Адрес</th>
              <th className={sortField === "email" ? cl.columnActive : ''} data-content="email">Email</th>
              <th className={sortField === "paidUntil" ? cl.columnActive : ''} data-content="paidUntil">Оплачено до</th>
              <th className={sortField === "faces" ? cl.columnActive : ''} data-content="faces">Есть фото</th>
              <th className={sortField === "facesProcessed" ? cl.columnActive : ''} data-content="facesProcessed">Необработанные фото</th>
            </tr>
          </thead>
          <tbody>
            {sortedUsers.map((user) => (
              <tr
                className={openUser && openUser.id === user.id ? cl.selectedTr : ''}
                key={user.id}
                onClick={() => setOpenUser(user)}
                onDoubleClick={() => setOpenUser(null)}
              >
                <td data-content="phone">{getText(user, 'phone')}</td>
                <td data-content="fullName">{getText(user, 'fullName')}</td>
                <td data-content="contractNumber">{getText(user, 'contractNumber')}</td>
                <td data-content="address">{getText(user, 'address')}</td>
                <td data-content="email">{getText(user, 'email')}</td>
                <td data-content="paidUntil">{getText(user, 'paidUntil')}</td>
                <td data-content="faces">
                  {user.faces.length !== 0 && <CheckIcon style={{ color: 'green' }} />}
                </td>
                <td data-content="facesProcessed">
                  {user.faces.length !== 0 && user.faces.some((face) => !face.isProcessed) && (
                    <ErrorOutlineIcon style={{ color: 'brown' }} />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Addresses className={cl.addresses} />
      <Admins className={cl.admins} />
    </div>
  );
});

export { AdminCabinet };
