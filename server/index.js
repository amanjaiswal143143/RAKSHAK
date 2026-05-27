import express from 'express';
import cors from 'cors';
import twilio from 'twilio';

const app = express();

app.use(cors());

app.use(express.json());

const client = twilio(
  'AC30ef2b2f9b19a5557b42f9d8ef670240',
  'b65156b95812794aabd9f51e1695e0d0'
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