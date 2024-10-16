import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const [userType, setUserType] = useState(''); // New state for user type
  const [name, setName] = useState('');
  const [gmail, setGmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');
  const [passwordRequirements, setPasswordRequirements] = useState('');
  const [department, setDepartment] = useState('');
  const [badgeNumber, setBadgeNumber] = useState('');
  const [designation, setDesignation] = useState('');
  const [organization, setOrganization] = useState('');
  const [gender, setGender] = useState('');
  const [address, setAddress] = useState('');
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await axios.post('http://localhost:9000/send-otp-signup', { Gmail: gmail });

      if (res.data.success) {
        alert('OTP sent to your email');
        setStep(2);
      } else {
        alert(res.data.error || 'Failed to send OTP');
      }
    } catch (error) {
      console.error('Error sending OTP:', error.response ? error.response.data : error.message);
      alert(error.response && error.response.data ? error.response.data.error : 'Failed to send OTP');
    }

    setIsLoading(false);
  };

  const handleOtpVerification = async (e) => {
    e.preventDefault();
    setIsLoading(true);
  
    try {
      const res = await axios.post('http://localhost:9000/verify-otp', {
        Gmail: gmail,
        password,
        otp,
        userType, // Include userType in the request body
        additionalFields: {
          department,
          badgeNumber,
          designation,
          organization,
          gender,
          address,
        },
      });
  
      if (res.data.success) {
        alert('Sign-up successful');
        navigate('/signin');
      } else {
        alert(res.data.error);
      }
    } catch (error) {
      console.error('Error during OTP verification:', error.response ? error.response.data : error.message);
      alert(error.response && error.response.data ? error.response.data.error : 'Failed to verify OTP');
    }
  
    setIsLoading(false);
  };
  

  const validatePasswordStrength = (password) => {
    const hasSpecialCharacter = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const isValidLength = password.length >= 8;

    if (isValidLength && hasSpecialCharacter && hasNumber && hasUppercase) {
      setPasswordStrength('Strong');
      setPasswordRequirements('');
    } else if (isValidLength && (hasSpecialCharacter || hasNumber || hasUppercase)) {
      setPasswordStrength('Medium');
      setPasswordRequirements('Password should have at least one capital letter, special character, and a number.');
    } else {
      setPasswordStrength('Weak');
      setPasswordRequirements('Password should be at least 8 characters long, and contain a capital letter, special character, and a number.');
    }
  };

  return (
    <div style={styles.container}>
      <form style={styles.form} onSubmit={step === 1 ? handleSendOtp : handleOtpVerification}>
        <h2 style={styles.heading}>Sign Up</h2>
        {step === 1 && (
          <>
            <select
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
              style={styles.input}
              required
            >
              <option value="">Select User Type</option>
              <option value="Citizen">Citizen</option>
              <option value="Authority">Authority</option>
              <option value="Administrator">Administrator</option>
            </select>

            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={styles.input}
              required
            />

            <input
              type="email"
              placeholder="Email ID"
              value={gmail}
              onChange={(e) => setGmail(e.target.value)}
              style={styles.input}
              required
            />

            <input
              type="text"
              placeholder="Mobile Number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              style={styles.input}
              required
            />

            {userType === 'Citizen' && (
              <>
                <input
                  type="text"
                  placeholder="Gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  style={styles.input}
                  required
                />
                <input
                  type="text"
                  placeholder="Address (Optional)"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  style={styles.input}
                />
              </>
            )}

            {userType === 'Authority' && (
              <>
                <input
                  type="text"
                  placeholder="Department"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  style={styles.input}
                  required
                />
                <input
                  type="text"
                  placeholder="Badge/ID Number"
                  value={badgeNumber}
                  onChange={(e) => setBadgeNumber(e.target.value)}
                  style={styles.input}
                  required
                />
                <input
                  type="text"
                  placeholder="Designation"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  style={styles.input}
                  required
                />
              </>
            )}

            {userType === 'Administrator' && (
              <input
                type="text"
                placeholder="Organization"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                style={styles.input}
                required
              />
            )}

            <input
              type="password"
              placeholder="Create Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                validatePasswordStrength(e.target.value);
              }}
              style={styles.input}
              required
            />
            <p style={styles.passwordStrength}>
              Password strength: <span style={{ color: getPasswordStrengthColor(passwordStrength) }}>{passwordStrength}</span>
            </p>
            {passwordRequirements && <p style={styles.requirements}>{passwordRequirements}</p>}

            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={styles.input}
              required
            />
            {password !== confirmPassword && <p style={styles.error}>Passwords do not match</p>}

            <button type="submit" style={styles.sendOtpButton} disabled={isLoading}>
              {isLoading ? 'Sending...' : 'Send OTP'}
            </button>
            <p style={styles.toggleText}>
              Already have an account? 
              <span onClick={() => navigate('/signin')} style={styles.link}>Sign In</span>
            </p>
          </>
        )}
        {step === 2 && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              style={styles.input}
              required
            />
            <button type="submit" style={styles.sendOtpButton} disabled={isLoading}>
              {isLoading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </>
        )}
      </form>
    </div>
  );
};

const getPasswordStrengthColor = (strength) => {
  switch (strength) {
    case 'Strong':
      return 'green';
    case 'Medium':
      return 'orange';
    case 'Weak':
      return 'red';
    default:
      return 'black';
  }
};

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
    fontWeight:'bold', }, 
    input: { width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '5px', border: '1px solid #ccc', fontSize: '14px', }, 
    passwordStrength: { textAlign: 'left', fontSize: '12px', marginBottom: '5px', }, 
    requirements: { fontSize: '12px', color: 'orange', marginBottom: '10px', textAlign: 'left', }, 
    sendOtpButton: { width: '100%', padding: '10px', backgroundColor: 'blue', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px', }, 
    toggleText: { marginTop: '10px', fontSize: '14px', color: '#666', }, 
    link: { color: '#007bff', cursor: 'pointer', },
    error: { color: 'red', fontSize: '12px', }, 
  };
  export default SignUp;