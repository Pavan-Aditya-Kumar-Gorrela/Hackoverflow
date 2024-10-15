import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 

const SignIn = () => {
  console.log("signin component rendered");
  const [Gmail, setGmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const navigate = useNavigate(); 

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post('http://localhost:9000/send-otp-signin', { Gmail });
      if (response.data.success) {
        setMessage(response.data.message);
        setStep(2);
      }
    } catch (error) {
      setMessage(error.response?.data?.error || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post('http://localhost:9000/verify-otp', { Gmail, otp, password });
      if (response.data.success) {
        setMessage(response.data.message);
        console.log('Redirecting to dashboard...');
        navigate('/dashboard');
      }
    } catch (error) {
      setMessage(error.response?.data?.error || 'Failed to verify OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post('http://localhost:9000/send-otp-reset', { Gmail });
      if (response.data.success) {
        setMessage(response.data.message);
        setStep(3); // Move to reset password step
      }
    } catch (error) {
      setMessage(error.response?.data?.error || 'Failed to send OTP for password reset');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post('http://localhost:9000/reset-password', { Gmail, otp, password });
      if (response.data.success) {
        setMessage(response.data.message);
        setForgotPassword(false); // Close forgot password flow
        setStep(1); // Return to sign-in step
      }
    } catch (error) {
      setMessage(error.response?.data?.error || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  // Inline styling objects
  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#f0f0f0',
    },
    form: {
      backgroundColor: '#fff',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
      width: '300px',
      textAlign: 'center',
    },
    heading: {
      color: '#333',
      marginBottom: '20px',
      fontSize: '24px',
      fontWeight: 'bold',
    },
    input: {
      width: '100%',
      padding: '10px',
      margin: '10px 0',
      border: '1px solid #ccc',
      borderRadius: '4px',
      fontSize: '16px',
    },
    sendOtpButton: {
      width: '100%',
      padding: '10px',
      border: 'none',
      borderRadius: '4px',
      background: 'blue',
      color: '#fff',
      fontSize: '16px',
      cursor: 'pointer',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease',
    },
    message: {
      color: '#d9534f', // Red color
      textAlign: 'center',
    },
    toggleText: {
      color: '#333',
      marginTop: '10px',
    },
    link: {
      color: '#007bff',
      cursor: 'pointer',
      textDecoration: 'underline',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.form}>
        <h2 style={styles.heading}>Sign In</h2>
        {message && <p style={styles.message}>{message}</p>}
        {step === 1 && !forgotPassword && (
          <form onSubmit={handleSendOtp}>
            <input
              type="email"
              placeholder="Email"
              value={Gmail}
              onChange={(e) => setGmail(e.target.value)}
              required
              style={styles.input}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.input}
            />
            <button type="submit" disabled={loading} style={styles.sendOtpButton}>
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
            <p style={styles.toggleText}>
              <span
                onClick={() => setForgotPassword(true)} // Navigate to forgot password flow
                style={styles.link}
              >
                Forgot Password?
              </span>
            </p>
          </form>
        )}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp}>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              style={styles.input}
            />
            <button type="submit" disabled={loading} style={styles.sendOtpButton}>
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </form>
        )}
        {forgotPassword && (
          <form onSubmit={handleForgotPassword}>
            <input
              type="email"
              placeholder="Enter Email for Password Reset"
              value={Gmail}
              onChange={(e) => setGmail(e.target.value)}
              required
              style={styles.input}
            />
            <button type="submit" disabled={loading} style={styles.sendOtpButton}>
              {loading ? 'Sending...' : 'Send Reset OTP'}
            </button>
          </form>
        )}
        {step === 3 && (
          <form onSubmit={handleResetPassword}>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              style={styles.input}
            />
            <input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.input}
            />
            <button type="submit" disabled={loading} style={styles.sendOtpButton}>
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}
        <p style={styles.toggleText}>
          Don't have an account? 
          <span
            onClick={() => navigate('/')} // Navigate to sign-up page
            style={styles.link}
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
