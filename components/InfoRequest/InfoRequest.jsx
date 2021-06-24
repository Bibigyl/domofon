import { Paper } from "@material-ui/core";
import BuildIcon from "@material-ui/icons/Build";
import PaymentIcon from "@material-ui/icons/Payment";
import AccountBalanceWalletIcon from "@material-ui/icons/AccountBalanceWallet";
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import CallEndIcon from "@material-ui/icons/CallEnd";
import VideocamIcon from "@material-ui/icons/Videocam";

import { Button } from "components";

import cl from "./InfoRequest.module.scss";

const InfoRequest = ({ className }) => {
  const y = '';

  return (
    <div className={`${cl.root} ${className}`}>
      <h2 className="h2">Услуги{y}</h2>
      <div className={cl.cards}>
        <Paper className={cl.card}>
          <BuildIcon className={cl.icon} />
          <h3>Вызов мастера</h3>
          <Button className={cl.button}>Заказать</Button>
        </Paper>

        <Paper className={cl.card}>
          <PaymentIcon className={cl.icon} />
          <h3>Оплата онлайн</h3>
          <Button className={cl.button}>Оплатить</Button>
        </Paper>

        <Paper className={cl.card}>
          <AccountBalanceWalletIcon className={cl.icon} />
          <h3>Узнать баланс счета</h3>
          <Button className={cl.button}>Заказать</Button>
        </Paper>

        <Paper className={cl.card}>
          <VpnKeyIcon className={cl.icon} />
          <h3>Ключи для домофона</h3>
          <Button className={cl.button}>Заказать</Button>
        </Paper>

        <Paper className={cl.card}>
          <CallEndIcon className={cl.icon} />
          <h3>Заменя трубки</h3>
          <Button className={cl.button}>Заказать</Button>
        </Paper>

        <Paper className={cl.card}>
          <VideocamIcon className={cl.icon} />
          <h3>Видеорегистрация в доме</h3>
          <Button className={cl.button}>Заказать</Button>
        </Paper>
      </div>
    </div>
  );
};

export { InfoRequest };
