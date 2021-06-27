import { YooCheckout } from '@a2seven/yoo-checkout';

import { getUuid } from 'helpers/uuid';

const checkout = new YooCheckout({
  shopId: '816240',
  secretKey: 'test_ASbcD3PtQptwpyBLuBsayMIUUiC1uB3yHOKeEo37ylk',
});

const createPayload = {
  amount: {
    value: '2.00',
    currency: 'RUB',
  },
  confirmation: {
    type: 'redirect',
    return_url: 'test',
  },
  description: 'Заказ №1',
};

export const pay = async () => {
  try {
    const idempotenceKey = getUuid();
    const payment = await checkout.createPayment(createPayload, idempotenceKey);
    console.log(payment);
  } catch (error) {
    console.error(error);
  }
};
