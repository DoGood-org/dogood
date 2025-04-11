// utils/mailer.js
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

// Configure mailer (use .env for credentials)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Support email
async function sendSupportEmail({ name, email, message }) {
  const mailOptions = {
    from: process.env.SMTP_USER,
    to: process.env.SUPPORT_EMAIL || "support@dogood.org",
    subject: `Support Request from ${name}`,
    html: `<p><strong>From:</strong> ${name} (${email})</p><p>${message}</p>`
  };

  return transporter.sendMail(mailOptions);
}

module.exports = {
  sendSupportEmail,
};
