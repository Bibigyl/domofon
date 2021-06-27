import nodemailer from 'nodemailer';

export default (req, res) => {
  const transporter = nodemailer.createTransport({
    port: 465,
    host: 'smtp.yandex.ru',
    auth: {
      user: 'domofondon.site@yandex.ru',
      pass: process.env.password,
    },
    secure: true,
  });

  const { service = '', fields = [] } = req.body;

  const html = `
    <h2>${service}</h2>
    ${fields.map(({ label, value }) => `<p>${label}: ${value || '___'}</p>`).join('')}
  `;

  const mailData = {
    from: 'domofondon.site@yandex.ru',
    to: 'ekaterina.kryakushina@yandex.ru',
    subject: `Сообщение с сайта Домофондон, от ${
      fields.find((el) => el.field === 'phone').value || ''
    }`,
    html,
  };

  transporter.sendMail(mailData, (err, info) => {
    if (err) console.log(err);
    else console.log(info);
  });

  res.send('success');
};
