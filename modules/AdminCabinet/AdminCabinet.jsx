/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-use-before-define */
import React, { useEffect, useState, useRef } from "react";
import { observer } from "mobx-react-lite";
import { toJS } from "mobx";
import {
  IconButton,
  Tooltip,
  Dialog,
  Paper,
  TextField,
} from "@material-ui/core";
import Checkbox from '@material-ui/core/Checkbox';
import SaveIcon from "@material-ui/icons/Save";
import CheckIcon from "@material-ui/icons/Check";
import SearchIcon from '@material-ui/icons/Search';
import ClearIcon from '@material-ui/icons/Clear';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';

import { store } from "store";
import { Button } from "components";

import { Faces } from "./components";
import cl from "./AdminCabinet.module.scss";

const AdminCabinet = observer(() => {
  const { users, getUsers, photoURLs, getPhotoURLs, addresses } = store.adminStore;
  const [openUser, setOpenUser] = useState(null);
  const [visibleUsers, setVisibleUsers] = useState(users);
  const [searchString, setSearchString] = useState('');
  const [showNotProcessed, setShowNotProcessed] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const searchRef = useRef();

  useEffect(() => {
    applyFilters();
  }, [users, showNotProcessed, searchString]);

  const applyFilters = () => {
    let filtered = users;
    const searchString = searchRef.current.value;
    if (searchString) filtered = filtered.filter(user => (
      JSON.stringify(user).toUpperCase().includes(searchString.toUpperCase()) ||
      getText(user, 'address').includes(searchString.toUpperCase())
    ));
    if (showNotProcessed) filtered = filtered.filter(user => (
      user.faces.length !== 0 && user.faces.some(face => !face.isProcessed) !== 0
    ));
    setVisibleUsers(filtered);
  };

  const handleSearchKeyDown = ev => {
    if (ev.code === 'Enter') applySearch();
  };

  const applySearch = () => {
    const searchString = searchRef.current.value;
    setSearchString(searchString);
  };

  const resetSearch = () => {
    searchRef.current.value = '';
    setSearchString('');
  };

  const toggleNotProcessed = () => {
    setShowNotProcessed(!showNotProcessed);
  };

  const togglePanel = () => {
    setIsPanelOpen(!isPanelOpen);
  };

  const getText = (user, field) => {
    let text;
    if (field === 'name') text = user.name && `${user.name} ${user.surname}`;
    if (field === 'phone') text = user.phone;
    if (field === 'email') text = user.email;
    if (field === 'address') text = addresses.find((ad) => ad.id === user.addresses[0])?.fullAddress;
    if (field === 'contractNumber') text = user.contractNumber;
    return text || '___';
  };

  return (
    <div className={cl.root}>
      <div className={cl.users}>
        <div className={cl.controls}>
          <Paper className={cl.user}>
            {openUser && isPanelOpen && <>
              <ul>
                <li><b>Имя: </b>{getText(openUser, 'name')}</li>
                <li><b>Телефон: </b>{getText(openUser, 'phone')}</li>
                <li><b>Email: </b>{getText(openUser, 'email')}</li>
                <li><b>Адрес: </b>{getText(openUser, 'address')}</li>
                <li><b>Номер договора: </b>{getText(openUser, 'contractNumber')}</li>
              </ul>
            </>}
            <div className={cl.search}>
              <TextField 
                inputRef={searchRef}
                label="Поиск" 
                variant="outlined"
                size="small"
                onKeyDown={handleSearchKeyDown}
              />
              <Tooltip title="Найти">
                <IconButton onClick={applySearch} >
                  <SearchIcon /> 
                </IconButton>
              </Tooltip>
              <Tooltip title="Сбросить">
                <IconButton onClick={resetSearch} >
                  <ClearIcon /> 
                </IconButton> 
              </Tooltip>
              <label className={cl.checkbox}>
                <Checkbox 
                  onChange={toggleNotProcessed} 
                  checked={showNotProcessed} 
                  color="primary" 
                />
                Только необработанные
              </label>
              <Tooltip title="Добавить пользователя">
                <IconButton className={cl.addUser} >
                  <PersonAddIcon style={{color: "#2f7491"}}/> 
                </IconButton> 
              </Tooltip>
            </div>
            <Tooltip title={isPanelOpen ? "Скрыть панель" : "Показать панель"}>
              <IconButton hidden={!openUser} size="small" className={cl.hide} onClick={togglePanel} >
                <KeyboardArrowUpIcon  style={isPanelOpen ? {} : {transform: "rotate(180deg)"}}/> 
              </IconButton> 
            </Tooltip>
          </Paper>
          <Faces openUser={isPanelOpen ? openUser : null} className={cl.faces} />
        </div>
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
            {(visibleUsers).map((user) => (
              <tr 
                className={openUser && openUser.id === user.id && cl.selectedTr} 
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
                    && user.faces.some(face => !face.isProcessed) !== 0 
                    && <ErrorOutlineIcon style={{color: "brown"}}/>
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});

export { AdminCabinet };
