require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const path = require('path');
const nodemailer = require('nodemailer');


const app = express();


app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');


app.use('/public', express.static(path.join(__dirname, 'public')));


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.get('/', (req, res) => {
    res.render('contact');
});

app.post('/send', (req, res) => {
    const output = `
        <p> You have a new contact request </p>
        <h3> Contact Details </h3>
        <ul>
            <li> Name: ${req.body.name} </li>
            <li> Company: ${req.body.company} </li>
            <li> Email: ${req.body.email} </li>
            <li> Phone: ${req.body.phone} </li>
        </ul>
        <h3> Message </h3>
        <p> ${req.body.message} </p>
    `;

    async function sendMail() {
        let testAccount = await nodemailer.createTestAccount();

        let transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.PASSWORD_USER
            }
        });

        let info = await transporter.sendMail({
            from: "Sofia",
            to: "sofiacpatrocinio@gmail.com",
            subject: "Hello ✔",
            text: "Hello world?",
            html: output
        });

        console.log("Message sent: %s", info.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

        res.render('contact', {msg: 'Email have been send.'})
    }

    sendMail().catch(console.error);
    module.exports = { sendMail }
});

app.listen(3001, () => console.log('Server started...'));