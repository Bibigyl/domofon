import React, { useEffect, useState, useRef, useCallback } from "react";
import { toJS } from 'mobx';
import { observer } from "mobx-react-lite";
import {
  IconButton,
  Tooltip,
  TextField,
} from "@material-ui/core";
import Checkbox from '@material-ui/core/Checkbox';
import SearchIcon from '@material-ui/icons/Search';
import ClearIcon from '@material-ui/icons/Clear';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

import { store } from "store";

import cl from "./Controls.module.scss";


const Controls = observer(({ setVisibleUsers, openUser }) => {
  const { users, addresses } = store.adminStore;
  const [searchString, setSearchString] = useState('');
  const [showNotProcessed, setShowNotProcessed] = useState(false);
  const searchRef = useRef();

  useEffect(() => {
    applyFilters();
  }, [users, showNotProcessed, searchString, applyFilters]);

  const applyFilters = useCallback(() => {
    let filtered = toJS(users);
    const searchString = searchRef.current.value;

    if (searchString) filtered = filtered.filter(user => (
      JSON.stringify(user).toUpperCase().includes(searchString.toUpperCase()) ||
      getText(user, 'address').includes(searchString.toUpperCase())
    ));
    if (showNotProcessed) filtered = filtered.filter(user => (
      user.faces.length !== 0 && user.faces.some(face => !face.isProcessed)
    ));
    
    setVisibleUsers(filtered);
  }, [getText, setVisibleUsers, showNotProcessed, users]);

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

  const getText = useCallback((user, field) => {
    let text;
    if (field === 'name') text = user.name && `${user.name} ${user.surname}`;
    if (field === 'phone') text = user.phone;
    if (field === 'email') text = user.email;
    if (field === 'address') text = toJS(addresses).find((ad) => ad.id === user.addresses[0])?.fullAddress;
    if (field === 'contractNumber') text = user.contractNumber;
    return text || '___';
  }, [addresses]);

  return (
    <div className={cl.root}>
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
    <Tooltip title="Редактировать пользователя">
      <IconButton disabled={!openUser}  className={cl.addUser} >
        <EditIcon style={{color: "#2f7491"}}/> 
      </IconButton> 
    </Tooltip>
    <Tooltip title="Удалить пользователя">
      <IconButton disabled={!openUser}  className={cl.addUser} >
        <DeleteIcon style={{color: "#2f7491"}}/> 
      </IconButton> 
    </Tooltip>
    <Tooltip title="Добавить пользователя">
      <IconButton className={cl.addUser} >
        <PersonAddIcon style={{color: "#2f7491"}}/> 
      </IconButton> 
    </Tooltip>
  </div>
  );
});

export { Controls };