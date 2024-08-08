const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: "hamatestini@gmail.com",
    pass: "lgkdbpxczrdytzta",
  },
});

const sendEmail = async (email, subject, text) => {
  const mailOptions = {
    from: "hamatestini@gmail.com",
    to: email,
    subject: subject,
    text: text,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail; // Ensure this is the correct export statement
