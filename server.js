require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Serve static files from the "public" directory
app.use(express.static('public'));

// Load environment variables
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

const client = new twilio(accountSid, authToken);

app.post('/send-sms', (req, res) => {
    const { to, message } = req.body;

    client.messages.create({
        body: message,
        from: twilioPhoneNumber,
        to: to
    })
    .then((message) => res.send({ success: true, message: 'SMS sent successfully', sid: message.sid }))
    .catch((error) => res.status(500).send({ success: false, message: error.message }));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
