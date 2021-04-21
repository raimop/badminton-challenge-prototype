const nodemailer = require("nodemailer");
require("dotenv").config();

const gmailSender = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendWithName = {
  name: "Sulgpall.eu",
  address: process.env.EMAIL_USER
}

module.exports.sendConfirmationEmail = (name, email, confirmationCode) => {
  gmailSender.sendMail({
    from: sendWithName,
    to: email,
    subject: "Palun kinnitage enda e-posti aadress",
    html: `<h2>Tere, ${name}</h2>
        <p>Aitäh, et registreerusite https://sulgpall.eu kasutajaks</p>
        <p><a href=https://sulgpall.eu/confirm/${confirmationCode}> Vajutage siia</a>, et kinnitada enda registreerumine</p>
        <p>Kui teie ei registreerunud selle e-postiga, siis ignoreerige seda kirja.</p>`,
  }).catch(err => console.log(err));
};

module.exports.sendNewChallengeEmail = (email, challenged, challenger) => {
  gmailSender.sendMail({
    from: sendWithName,
    to: email,
    subject: "Sulgpall.eu: Teile on esitatud väljakutse",
    html: `<h2>Tere, ${challenged}</h2>
        <p>${challenger} esitas teile väljakutse. <a href=https://sulgpall.eu/notifications>Vajutage siia</a>, et nõustuda või loobuda väljakutsest</p>`,
  }).catch(err => console.log(err));
};