import React from "react";
import { Button as UIButton } from "@material-ui/core";

const Button = ({ children, theme, ...props }) => {
  const outlineConfig = theme === "outlined"
    ? {
        style: { color: "white" },
        variant: "outlined",
        color: "secondary"
      }
    : {};

  return (
    <UIButton
      type="button"
      color="primary"
      variant="contained"
      {...props}
      {...outlineConfig}
    >
      {children}
    </UIButton>
  );
};

export { Button };
