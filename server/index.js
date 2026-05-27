import express from 'express';
import cors from 'cors';
import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

app.post('/send-sos', async (req, res) => {

  try {

    const {
      guardians,
      latitude,
      longitude,
    } = req.body;

    for (const guardian of guardians) {

      if (!guardian.phone) continue;

      await client.messages.create({

        body: `🚨 RAKSHAK SOS ALERT

Emergency detected!

Live Location:
https://maps.google.com/?q=${latitude},${longitude}`,

        from:
          'whatsapp:+14155238886',

        to:
          `whatsapp:${guardian.phone}`,
      });

      console.log(
        'Message sent to:',
        guardian.phone
      );
    }

    res.json({
      success: true,
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      error: err.message,
    });
  }
});

app.listen(5000, () => {

  console.log(
    'Server running on port 5000'
  );
});