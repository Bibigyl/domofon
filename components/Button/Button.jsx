import React from "react";
import { Button as UIButton } from "@material-ui/core";

const Button = ({ children, ...props }) => (
  <UIButton type="button" color="primary" variant="contained" {...props}>
    {children}
  </UIButton>
);

export { Button };