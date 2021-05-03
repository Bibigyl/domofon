import { useState, useCallback } from 'react';
import { TextField, IconButton, Tooltip, Select, MenuItem  } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import SaveIcon from "@material-ui/icons/Save";
import RotateLeftIcon from "@material-ui/icons/RotateLeft";

import cl from "./Field.module.scss";


const Field = (props) => {
  const { label, value: propsValue, options, isEditing, onSave, onReset, onEdit, className } = props;
  const [value, setValue] = useState(propsValue || '');

  const handleValueChange = useCallback((ev) => {
    if (isEditing) setValue(ev.target.value);
  }, [isEditing]);

  return (
    <div className={`${cl.root} ${className}`}>
      <div className={cl.label}>{label}</div>
      <div className={cl.wrap}>
      {options
        ? <Select 
            className={cl.field} 
            value={value} 
            onChange={handleValueChange}
            autoFocus={isEditing}
            disabled
            {...(isEditing ? {open: false} : {})}
          >
            {options.map(opt => <MenuItem key={opt.id} value={opt.id}>{opt.value}</MenuItem>)}
          </Select>
        : <TextField 
          className={cl.field} 
          value={value}
          onChange={handleValueChange}
          autoFocus={isEditing}
        />
      }
      <div className={cl.buttons}>
        {!isEditing
          ?
          <Tooltip title="Редактировать">
            <IconButton onClick={onEdit}>
              <EditIcon />
            </IconButton>
          </Tooltip>
          : <>
            <Tooltip title="Сохранить">
              <IconButton onClick={onSave}>
                <SaveIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Отмена">
              <IconButton onClick={onReset}>
                <RotateLeftIcon />
              </IconButton>
            </Tooltip>
          </>
        }
      </div>
      </div>
    </div>
  );
};

export { Field };
