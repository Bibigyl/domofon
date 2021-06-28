import { YooCheckout } from '@a2seven/yoo-checkout';

// import { getUuid } from 'helpers/uuid';

const checkout = new YooCheckout({
  shopId: process.env.NEXT_PUBLIC_SHOP_ID,
  secretKey: process.env.NEXT_PUBLIC_SECRET_KEY,
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

export default async (req, res) => {
  try {
    // const idempotenceKey = getUuid();
    const payment = await checkout.createPayment(createPayload, 'dfghdfghdfghfg');
    console.log(payment);
    res.status(200).send('success');
  } catch (err) {
    console.error(err);
    res.status(err.responseCode).send(err.message);
  }
};
