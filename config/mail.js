const nodemailer = require('nodemailer')

exports.sendEmail = async (email, subject, text) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: "hamatestini@gmail.com",
      pass: "lgkdbpxczrdytzta",
    },
  });

  const mailOptions = {
    from: "hamatestini@gmail.com",
    to: email,
    subject: subject,
    text: text,
  };

  await transporter.sendMail(mailOptions);
}
