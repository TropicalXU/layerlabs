
const mail = require('nodemailer');
const mailGun = require('nodemailer-mailgun-transport');

const auth = {
    auth: {
        api_key: process.env.MAILGUN_KEY,
        domain: process.env.MAILGUN_DOMAIN
    }
}

//setting up the mail transport route using mailgun
const transporter = mail.createTransport(mailGun(auth));

//capturing our mail data and setting up our mail template
const sendMail = async(name, email, subject, text, callback) => {
    const mailOptions = {
        from: `${name} <${email}>`,
        to: 'layerlabs.io@gmail.com',
        subject,
        text:` Message: ${text}`
    };
    //sending the mail data to the recipient
    transporter.sendMail(mailOptions, function(err, data) {
        if(err) {
            callback(err, null);
        }else {
            callback(null, data);
        }
    
    });

}

module.exports = sendMail;

