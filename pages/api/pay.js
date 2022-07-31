import { v4 as uuidv4 } from 'uuid';

export default async (req, res) => {
  try {
    console.log('pay body', req.body);
    const { data, returnURL } = JSON.parse(req.body);

    // INFO: https://yookassa.ru/developers/api#create_payment
    const response = await fetch('https://api.yookassa.ru/v3/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'Idempotence-Key': uuidv4(),
        Authorization: `Basic ${Buffer.from(
          `${process.env.NEXT_PUBLIC_SHOP_ID}:${process.env.NEXT_PUBLIC_SECRET_KEY}`
        ).toString('base64')}`
      },
      body: JSON.stringify({
        amount: {
          value: '40.00',
          currency: 'RUB'
        },
        description: `Договор: ${data.contractNumber}; \n${data.fullName}; \n${data.address}`,
        // description: 'За использование приложения "Умный домофон"',
        confirmation: {
          type: 'redirect',
          return_url: returnURL
        },
        capture: true,
        metadata: data
      })
    });

    const result = await response.json();

    res.status(200).send(result);
  } catch (err) {
    console.log('pay error', err);
    res.status(err.responseCode || 500).send(err);
  }
};
