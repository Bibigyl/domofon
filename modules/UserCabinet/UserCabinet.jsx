import React, { useState, useCallback, useEffect } from "react";
import { TextField, IconButton, Select, MenuItem } from "@material-ui/core";

import { authAPI } from "api/authAPI";

import { Field } from "./components";
import cl from "./UserCabinet.module.scss";

const textFields = [
  { label: "Имя", field: "name" },
  { label: "Фамилия", field: "surname" },
  { label: "Email", field: "email" },
  { label: "Телефон", field: "phone" },
  { label: "Номер договора", field: "contractNumber" },
];

const UserCabinet = ({ user, addresses }) => {
  const [editingField, setEditingField] = useState(null);

  return (
    <div className={cl.root}>
      <div className={cl.fields}>

      <h2>{`${user.name} ${user.surname}`}</h2>
      <dl>
        <dt>Телефон</dt>
        <dd>{`${user.phone}`}</dd>
        <dt>Email</dt>
        <dd>{`${user.email}`}</dd>
        <dt>Номер договора</dt>
        <dd>{`${user.contractNumber}`}</dd>
      </dl>


        {/* {textFields.map(({ label, field }) => (
          <Field
            key={field}
            className={cl.field}
            label={label}
            value={user[field]}
            isEditing={editingField === field}
            onSave={() => {}}
            onReset={() => {}}
            onEdit={() => setEditingField(field)}
          />
        ))}
        <Field
          className={cl.field}
          label="Адрес"
          value={user.addresses[0]}
          options={addresses.map(el => ({ id: el.id, value: el.fullAddress }))}
          isEditing={editingField === "address"}
          onSave={() => {}}
          onReset={() => {}}
          onEdit={() => setEditingField("address")}
        /> */}
      </div>
    </div>
  );
};

export { UserCabinet };
