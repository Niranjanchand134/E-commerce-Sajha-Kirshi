import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../Component/Header';

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const emailOrPhone = location.state?.emailOrPhone || ''; // Optional if you want to show it

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    // Basic validations
    if (!password) {
      setError('Please enter a new password.');
      return;
    }
    if (password.length < 6) {
      setError('Password should be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setError('');
    // Simulate API call or password reset process
    alert('Password reset successful! Please login with your new password.');
    navigate('/Buyer-login');
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <>
      <Header />
      <div
        className="w-full flex justify-center items-center"
        style={{
          backgroundImage: "url('/assets/BuyersImg/images/Forgetbg.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: 'calc(102vh - 80px)',
        }}
      >
        <div className="bg-white rounded p-4 w-full max-w-md">
          <h4>Reset Password</h4>

          {emailOrPhone && (
            <p className="text-[#6C7278] mb-4">
              Reset password for: <span className="font-semibold text-black">{emailOrPhone}</span>
            </p>
          )}

          <div className="flex flex-col mb-4">
            <label htmlFor="password">New Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border p-2 rounded focus:outline-none focus:ring-0 mt-2"
              placeholder="Enter new password"
            />
          </div>

          <div className="flex flex-col mb-4">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="border p-2 rounded focus:outline-none focus:ring-0 mt-2"
              placeholder="Confirm new password"
            />
          </div>

          {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

          <div className="flex gap-3 justify-end mt-8">
            <button
              onClick={handleBack}
              className="border border-[#49A760] rounded p-2 w-[90px] h-10 text-green-500 text-[16px]"
            >
              Back
            </button>
            <button
              onClick={handleSubmit}
              className="bg-[#49A760] p-2 text-white rounded-xl w-[90px] h-10 text-[16px]"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
