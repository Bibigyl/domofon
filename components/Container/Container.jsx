import React from "react";

import cl from "./Container.module.scss";

const Container = ({ isCenter, className, children }) => {
  const classes = [cl.root];
  if (className) classes.push(className);
  if (isCenter) classes.push(cl.center);

  return <div className={classes.join(" ")}>{children}</div>;
};

export { Container };
