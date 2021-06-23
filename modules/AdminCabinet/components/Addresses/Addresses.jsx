import React, { useEffect, useState, useRef } from "react";
import { observer } from "mobx-react-lite";
import { toJS } from "mobx";
import {
  IconButton,
  Tooltip,
  TextField,
  Dialog,
  Paper,
} from "@material-ui/core";
import AddLocationIcon from '@material-ui/icons/AddLocation';
import DeleteIcon from '@material-ui/icons/Delete';
import SaveIcon from "@material-ui/icons/Save";

import { Button } from "components";
import { store } from "store";
import { API } from 'api';

import cl from "./Addresses.module.scss";

const FORM = {
  CREATE: 'CREATE',
  REMOVE: 'REMOVE'
};

const textFields = [
  { label: "Город", field: "city", defaultValue: 'Ростов-на-Дону' },
  { label: "Адрес", field: "address" },
];

const Addresses = observer(({ className }) => {
  const { addresses, getAddresses } = store.addressesStore;
  const [openAddress, setOpenAddress] = useState(null);
  const [formType, setFormType] = useState(null);
  const formRef = useRef();

  useEffect(() => {
    if (openAddress) {
      setOpenAddress(toJS(addresses).find(address => address.id === openAddress.id) || null);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addresses]);

  const createAddress = async () => {
    const params = {};
    let isFilled = false;
    textFields.forEach(({ field }) => {
      const value = formRef.current.elements[field].value || '';
      isFilled = isFilled || !!value;
      params[field] = value;
    });
    if (isFilled) {
      try {
        await API.createAddress(params);
        await getAddresses();        
      } catch (err) {
        alert(err);
      }
    }
    setFormType(null);
  };

  const removeAddress = async () => {
    try {
      await API.removeAddress(openAddress.id);
      await getAddresses();      
    } catch (err) {
      alert(err);
    }
    setFormType(null);
  };

  return (
    <div className={`${cl.root} ${className}`}>
      <Paper className={cl.controls}>
        <h3>Адреса</h3>
        <Tooltip title="Удалить адрес">
          <IconButton 
            className={`${cl.createUser} ${!openAddress ? cl.disabled : ''}`} 
            onClick={() => setFormType(FORM.REMOVE)}
          >
            <DeleteIcon style={{color: "#2f7491"}}/> 
          </IconButton> 
        </Tooltip>
        <Tooltip title="Добавить адрес">
          <IconButton className={cl.createUser} onClick={() => setFormType(FORM.CREATE)}>
            <AddLocationIcon style={{color: "#2f7491"}}/> 
          </IconButton> 
        </Tooltip>
      </Paper>
      <div className={cl.tableWrap}>
        <table className={cl.table}>
          <thead>
            <tr>
              <th>Адрес</th>
            </tr>
          </thead>
          <tbody>
            {toJS(addresses).map((address) => (
              <tr 
                className={openAddress && openAddress.id === address.id ? cl.selectedTr : ''} 
                key={address.id} 
                onClick={() => setOpenAddress(address)}
              >
                <td>{address.fullAddress}</td>
              </tr>)
            )}
          </tbody>
        </table>
      </div>

      <Dialog
        maxWidth="md"
        open={!!formType} 
        onClose={() => setFormType(null)}
      >
        {formType === FORM.REMOVE && 
          <div className={cl.form}>
            <h3>Вы уверены что хотите удалить адрес?</h3>
            <p>{openAddress.fullAddress}</p>
            <div className={cl.formButtons}>
              <Button onClick={removeAddress}>Да</Button>
              <Button onClick={() => setFormType(null)}>Нет</Button>          
            </div>
          </div>
        }

        {formType === FORM.CREATE &&
          <form className={cl.form} ref={formRef}>
            <h2 className={cl.title}>Добавить адрес</h2>
            <div className={cl.fields}>
              {textFields.map(({ label, field, defaultValue }) => (
                <TextField
                  key={field}
                  className={cl.field}
                  label={label}
                  name={field}
                  defaultValue={defaultValue || ''}
                />
              ))}
            </div>
            <div className={cl.formButtons}>
              <Button startIcon={<SaveIcon />} onClick={createAddress}>Сохранить</Button>
              <Button onClick={() => setFormType(null)}>Отмена</Button>
            </div>
          </form>
        }
      </Dialog>
    </div>
  );
});

export { Addresses };