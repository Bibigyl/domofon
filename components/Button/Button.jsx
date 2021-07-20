import React from 'react';
import { Button as UIButton } from '@material-ui/core';

import cl from './Button.module.scss';

const Button = ({ children, theme, ...props }) => {
  const outlineConfig =
    theme === 'outlined'
      ? {
          className: cl.outlined,
          variant: 'outlined',
        }
      : {};

  const greyConfig =
    theme === 'grey'
      ? {
          color: 'default',
          size: 'small',
        }
      : {};

  return (
    <UIButton
      type='button'
      color='primary'
      variant='contained'
      {...props}
      {...outlineConfig}
      {...greyConfig}
    >
      {children}
    </UIButton>
  );
};

export { Button };
