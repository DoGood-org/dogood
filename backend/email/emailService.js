const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

const sendVerificationEmail = (email, token) => {
    const mailOptions = {
        from: process.env.SMTP_USER,
        to: email,
        subject: "Verify your email",
        text: `Click here to verify your email: ${process.env.APP_URL}/verify?token=${token}`
    };
    return transporter.sendMail(mailOptions);
};

module.exports = { sendVerificationEmail };