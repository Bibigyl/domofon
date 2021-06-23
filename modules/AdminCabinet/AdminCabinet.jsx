import React, { useEffect, useState, useRef } from "react";
import { observer } from "mobx-react-lite";
import { toJS } from "mobx";
import {
  IconButton,
  Tooltip,
  Paper,
  TextField
} from "@material-ui/core";
import CheckIcon from "@material-ui/icons/Check";
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';

import { API } from 'api';
import { store } from "store";
import { Button } from "components";

import { Faces, Controls, Admins, Addresses } from "./components";
import cl from "./AdminCabinet.module.scss";

const AdminCabinet = observer(() => {
  const { users, getUsers } = store.adminStore;
  const { addresses } = store.addressesStore;
  const [openUser, setOpenUser] = useState(null);
  const [visibleUsers, setVisibleUsers] = useState(toJS(users));
  const [isPanelOpen, setIsPanelOpen] = useState(true);

  useEffect(() => {
    if (openUser) {
      setOpenUser(toJS(users).find(user => user.id === openUser.id) || null);
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
      return;
    };
    await API.editUser({ ...openUser, paidUntil });
    input.blur();
    getUsers();
  };

  const getText = (user, field) => {
    let text;
    if (field === 'name') text = (user.name || user.surname) && `${user.name} ${user.surname}`;
    if (field === 'phone') text = user.phone;
    if (field === 'email') text = user.email;
    if (field === 'address') text = addresses.find((ad) => ad.id === user.addresses[0])?.fullAddress;
    if (field === 'contractNumber') text = user.contractNumber;
    return text || '___';
  };

  // const getPaidUntilInput = () => {
  //   console.log(openUser.paidUntil);
  //   // const date = openUser.paidUntil.split('-').reverse.join('.');
  //   // const initialValue = openUser?.paidUntil?.split('-').reverse().join('.') || '';
  //   return <TextField 
  //     key={openUser.id}
  //     defaultValue={openUser?.paidUntil || ''}
  //     type='date' 
  //     onBlur={savePaidUntil} 
  //     onKeyPress={savePaidUntil} 
  //   />;};

  return (
    <div className={cl.root}>
      <div className={cl.usersHeader}>
        <Paper className={cl.user}>
          {openUser && isPanelOpen && <>
            <ul>
              <li><b>Имя: </b>{getText(openUser, 'name')}</li>
              <li><b>Телефон: </b>{getText(openUser, 'phone')}</li>
              <li><b>Email: </b>{getText(openUser, 'email')}</li>
              <li><b>Адрес: </b>{getText(openUser, 'address')}</li>
              <li><b>Номер договора: </b>{getText(openUser, 'contractNumber')}</li>
              <li><b>Оплачено до: </b>
                <TextField 
                  key={openUser.id}
                  defaultValue={openUser?.paidUntil || ''}
                  type='date' 
                  onBlur={savePaidUntil} 
                  onKeyPress={savePaidUntil} 
                />
              </li>
            </ul>
          </>}
          <Controls setVisibleUsers={setVisibleUsers} openUser={openUser}/>
          <Tooltip title={isPanelOpen ? "Скрыть панель" : "Показать панель"}>
            <IconButton hidden={!openUser} size="small" className={cl.hide} onClick={togglePanel} >
              <KeyboardArrowUpIcon  style={isPanelOpen ? {} : {transform: "rotate(180deg)"}}/> 
            </IconButton> 
          </Tooltip>
        </Paper>
        <Faces openUser={isPanelOpen ? openUser : null} className={cl.faces} />
      </div>
      <div className={cl.tableWrap}>
        <table className={cl.table}>
          <thead>
            <tr>
              <th data-content="phone">Номер телефона</th>
              <th data-content="name">Имя Фамилия</th>
              <th data-content="contractNumber">Номер договора</th>
              <th data-content="address">Адрес</th>
              <th data-content="email">Email</th>
              <th data-content="faces">Есть фото</th>
              <th data-content="facesProcessed">Необработанные фото</th>
            </tr>
          </thead>
          <tbody>
            {visibleUsers.map((user) => (<tr 
                className={openUser && openUser.id === user.id ? cl.selectedTr : ''} 
                key={user.id} 
                onClick={() => setOpenUser(user)}
              >
                <td data-content="phone">{getText(user, 'phone')}</td>
                <td data-content="name">{getText(user, 'name')}</td>
                <td data-content="contractNumber">{getText(user, 'contractNumber')}</td>
                <td data-content="address">{getText(user, 'address')}</td>
                <td data-content="email">{getText(user, 'email')}</td>
                <td data-content="faces">
                  {user.faces.length !== 0 && <CheckIcon style={{color: "green"}}/>}
                </td>
                <td data-content="facesProcessed">
                  {user.faces.length !== 0 
                    && user.faces.some(face => !face.isProcessed) 
                    && <ErrorOutlineIcon style={{color: "brown"}}/>
                  }
                </td>
              </tr>)
            )}
          </tbody>
        </table>
      </div>
      <Admins className={cl.admins}/>
      <Addresses className={cl.addresses}/>
    </div>
  );
});

export { AdminCabinet };
