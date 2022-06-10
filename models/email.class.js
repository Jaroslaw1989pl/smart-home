// build-in modules
const nodemailer = require('nodemailer');


class Email {

  // private fields
  #service = 'gmail;'
  #user = 'dzidajaroslaw@gmail.com';
  #pass = 'kodpin89081011211';

  // protected fields
  _transporter;

  constructor() {
    this._transporter = nodemailer.createTransport({
      service: this.#service,
      auth: {
        user: this.#user,
        pass: this.#pass
      }
    });
  }

  send(email, subject, message) {
    const options = {
      from: this.#user,
      to: email,
      subject: subject || 'No subject',
      html: message || '<h1>Empty message</h1>'
    };

    this._transporter.sendMail(options, (error, info) => {
      if (error) console.log(error);
      // else console.log('Email sent: ' + info.messageId);
    });
  }
}

module.exports = Email;