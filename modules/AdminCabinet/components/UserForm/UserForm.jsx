import { observer } from 'mobx';
import { useState, useCallback } from "react";
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";

import { store } from 'store';
import { Button } from "components";

import cl from './UserForm.module.scss';

const textFields = [
  { label: "Имя", field: "name" },
  { label: "Фамилия", field: "surname" },
  { label: "Email", field: "email" },
  { label: "Телефон", field: "phone" },
  { label: "Номер договора", field: "contractNumber" },
];

const UserForm = observer(({ openUser, onSave, onCancel }) => {
  const { users, addresses } = store.adminStore;
  const [data, setData] = useState(openUser);

  const handleChange = useCallback(
    (field, value) => setData({ ...data, [field]: value }),
    [data]
  );

  const handleSaveClick = async () => {
    // await onSave(data);
    // onCancel();
  };

  return (
    <form className={cl.root}>
      <h2 className={cl.title}>Редактировать</h2>
      <div className={cl.fields}>
        {textFields.map(({ label, field }) => (
          <TextField
            key={field}
            className={cl.field}
            label={label}
            value={data[field] || ""}
            onChange={(ev) => handleChange(field, ev.target.value)}
          />
        ))}
        <FormControl className={cl.field}>
          <InputLabel shrink id5="select">
            Адрес
          </InputLabel>
          <Select
            value={data.addresses[0] || ""}
            onChange={(ev) =>
              handleChange(
                "addresses",
                ev.target.value ? [ev.target.value] : []
              )
            }
          >
            <MenuItem value="">
              <em>Не выбран</em>
            </MenuItem>
            {addresses.map((addr) => (
              <MenuItem key={addr.id} value={addr.id}>
                {addr.fullAddress}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      <div className={cl.buttons}>
        <Button startIcon={<SaveIcon />} onClick={handleSaveClick}>
          Сохранить
        </Button>
        <Button onClick={onCancel}>Отмена</Button>
      </div>
    </form>
  );
});

export { UserForm };