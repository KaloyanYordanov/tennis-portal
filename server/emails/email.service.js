const crypto = require('crypto');
const nodemailer = require('nodemailer');
const {
  Emails,
  UserActivationCodes
} = require('../db');
const { EmailType, EmailStatus } = require('../infrastructure/enums');

const footer = `
<br>
<br>
--------------------------------------
<br>
Този имейл е автоматично генериран, моля не изпращайте отговор.
`;

class EmailService {
  async createRegistrationEmail(model) {
    let token = crypto.randomBytes(16).toString('hex');
    let url = `${process.env.CLIENT_HOST}/account/activation?token=${token}`;
    let expires = new Date();
    expires.setHours(expires.getHours() + 24);

    let email = {
      to: model.email,
      type: EmailType.REGISTRATION,
      status: EmailStatus.PENDING,
      subject: 'Активиране на акаунт в Тенис клуб "Диана"',
      body: `
      Здравейте ${model.name},
      <br>
      Вашият акаунт беше успешно създаден. Моля, за да го активирате, последвайте следният 
      <a href="${url}">линк</a>
      <br>
      <br>
      В случай, че линкът не работи, моля навигирайте ръчно на следния адрес:
      <div>${url}</div>
      ` + footer
    };

    email = await Emails.create(email);
    await UserActivationCodes.create({ userId: model.id, token, expires });
    await this.processEmail(email);
  }

  async createRecoveryEmail(model) {
    let token = crypto.randomBytes(16).toString('hex');
    let url = `${process.env.CLIENT_HOST}/recovery/step2?token=${token}`;
    let expires = new Date();
    expires.setHours(expires.getHours() + 24);

    let email = {
      to: model.email,
      type: EmailType.REGISTRATION,
      status: EmailStatus.PENDING,
      subject: 'Забравена парола за Тенис клуб "Диана"',
      body: `
      Здравейте,
      <br>
      За вашия акаунт в Тенис клуб "Диана" беше заявен код за възстановяване на забравена парола.
      <br>
      Моля, последвайте следния <a href="${url}">линк</a>, за да изберете нова парола за своя акаунт.
      <br>
      <br>
      В случай, че линкът не работи, моля навигирайте ръчно на следния адрес:
      <div>${url}</div>
      ` + footer
    };

    email = await Emails.create(email);
    await UserActivationCodes.create({ userId: model.id, token, expires });
    await this.processEmail(email);
  }

  async processEmail(email) {
    try {
      await this.sendEmail(email);
      await email.update({ status: EmailStatus.SENT });
    }
    catch (err) {
      await email.update({ status: EmailStatus.FAILED });
      throw err;
    }
  }

  async sendEmail(email) {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: true,
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    const options = {
      from: process.env.SMTP_USERNAME,
      to: email.to,
      subject: email.subject,
      html: email.body
    };

    return await transporter.sendMail(options);
  }
}

module.exports = new EmailService();