import cors from 'cors';
import express from 'express';
import nodemailer from 'nodemailer';
import { connectToDB, db } from './db.js';

const app = express();
app.use(cors());
app.use(express.json());

let otpStore = {};

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'akhilpadala45@gmail.com',
    pass: 'mgah glaw yqbz ycfp', // Replace with app-specific password
  },
  debug: true, // Enable debug mode for detailed logs
  logger: true, // Log information to see what's happening
});

// Send OTP for Signup
app.post('/send-otp-signup', async (req, res) => {
  const { Gmail } = req.body;

  if (!Gmail) {
    console.log('Email address not provided');
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    const existingUser = await db.collection('ast').findOne({ Gmail });
    if (existingUser) {
      console.log(`User with email ${Gmail} already exists.`);
      return res.status(409).json({ error: 'User already exists' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore[Gmail] = { otp, expiresAt: Date.now() + 300000 };

    const mailOptions = {
      from: 'akhilpadala45@gmail.com',
      to: Gmail,
      subject: 'Your OTP Code for Signup',
      text: `Your OTP code is ${otp}. It is valid for 5 minutes.`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(`Error sending email to ${Gmail}:`, error);
        res.status(500).json({ error: 'Failed to send OTP. Please check your email configuration.' });
      } else {
        console.log(`Email sent successfully to ${Gmail}. Response:`, info.response);
        res.json({ success: true, message: 'OTP sent successfully' });
      }
    });
  } catch (error) {
    console.error('An error occurred while sending OTP:', error.message);
    res.status(500).json({ error: 'Failed to send OTP due to an internal server error' });
  }
});

// Send OTP for Sign-In
app.post('/send-otp-signin', async (req, res) => {
  const { Gmail } = req.body;

  if (!Gmail) {
    console.log('Email address not provided');
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    const existingUser = await db.collection('ast').findOne({ Gmail });
    if (!existingUser) {
      console.log(`User with email ${Gmail} does not exist.`);
      return res.status(404).json({ error: 'User does not exist' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore[Gmail] = { otp, expiresAt: Date.now() + 300000 };

    const mailOptions = {
      from: 'akhilpadala45@gmail.com',
      to: Gmail,
      subject: 'Your OTP Code for Sign-In',
      text: `Your OTP code is ${otp}. It is valid for 5 minutes.`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(`Error sending email to ${Gmail}:`, error);
        res.status(500).json({ error: 'Failed to send OTP. Please check your email configuration.' });
      } else {
        console.log(`Email sent successfully to ${Gmail}. Response:`, info.response);
        res.json({ success: true, message: 'OTP sent successfully' });
      }
    });
  } catch (error) {
    console.error('An error occurred while sending OTP:', error.message);
    res.status(500).json({ error: 'Failed to send OTP due to an internal server error' });
  }
});

// Send OTP for Password Reset
app.post('/send-otp-reset', async (req, res) => {
  const { Gmail } = req.body;

  if (!Gmail) {
    console.log('Email address not provided');
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    const existingUser = await db.collection('ast').findOne({ Gmail });
    if (!existingUser) {
      console.log(`User with email ${Gmail} does not exist.`);
      return res.status(404).json({ error: 'User does not exist' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore[Gmail] = { otp, expiresAt: Date.now() + 300000 };

    const mailOptions = {
      from: 'akhilpadala45@gmail.com',
      to: Gmail,
      subject: 'Your OTP Code for Password Reset',
      text: `Your OTP code is ${otp}. It is valid for 5 minutes.`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(`Error sending email to ${Gmail}:`, error);
        res.status(500).json({ error: 'Failed to send OTP. Please check your email configuration.' });
      } else {
        console.log(`Email sent successfully to ${Gmail}. Response:`, info.response);
        res.json({ success: true, message: 'OTP sent successfully' });
      }
    });
  } catch (error) {
    console.error('An error occurred while sending OTP:', error.message);
    res.status(500).json({ error: 'Failed to send OTP due to an internal server error' });
  }
});

app.post('/verify-otp', async (req, res) => {
  const { Gmail, otp, password, userType, additionalFields } = req.body;
  const storedOtpDetails = otpStore[Gmail];

  if (!storedOtpDetails) {
    console.log('OTP not found or expired for email:', Gmail);
    return res.status(400).json({ error: 'OTP not found or expired' });
  }

  if (storedOtpDetails.otp === otp && storedOtpDetails.expiresAt > Date.now()) {
    try {
      const user = await db.collection('ast').findOne({ Gmail });

      if (user) {
        // User is signing in
        if (user.Password === password) {
          delete otpStore[Gmail]; // Clear OTP after successful verification
          console.log('Sign-in successful for:', Gmail);
          return res.json({ success: true, message: 'Sign-in successful' });
        } else {
          console.log('Invalid password for:', Gmail);
          return res.status(401).json({ error: 'Invalid password' });
        }
      } else {
        // User is signing up, handle different user types
        const userData = {
          Gmail,
          Password: password,
          userType,
          ...additionalFields // Spread additionalFields to include extra data for each user type
        };

        const result = await db.collection('ast').insertOne(userData);
        if (result) {
          delete otpStore[Gmail]; // Clear OTP after successful signup
          console.log('Signup successful for:', Gmail);
          return res.json({ success: true, message: 'Signup successful', values: result });
        } else {
          console.log('Failed to sign up for:', Gmail);
          return res.status(500).json({ error: 'Failed to sign up' });
        }
      }
    } catch (error) {
      console.error('Error during user verification:', error.message);
      return res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    console.log('Invalid or expired OTP for email:', Gmail);
    return res.status(400).json({ error: 'Invalid or expired OTP' });
  }
});


// Reset Password
app.post('/reset-password', async (req, res) => {
  const { Gmail, otp, password } = req.body;
  const storedOtpDetails = otpStore[Gmail];

  if (!storedOtpDetails) {
    console.log('OTP not found or expired for email:', Gmail);
    return res.status(400).json({ error: 'OTP not found or expired' });
  }

  if (storedOtpDetails.otp === otp && storedOtpDetails.expiresAt > Date.now()) {
    try {
      const result = await db.collection('ast').updateOne(
        { Gmail },
        { $set: { Password: password } }
      );
      if (result.modifiedCount > 0) {
        delete otpStore[Gmail];
        console.log('Password reset successful for:', Gmail);
        return res.json({ success: true, message: 'Password reset successful' });
      } else {
        console.log('Failed to reset password for:', Gmail);
        return res.status(500).json({ error: 'Failed to reset password' });
      }
    } catch (error) {
      console.error('Error during password reset:', error.message);
      return res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    console.log('Invalid or expired OTP for email:', Gmail);
    return res.status(400).json({ error: 'Invalid or expired OTP' });
  }
});


// Connect to the database and start the server
connectToDB(() => {
  app.listen(9000, () => {
    console.log('Server is running on port 9000');
  });
});
