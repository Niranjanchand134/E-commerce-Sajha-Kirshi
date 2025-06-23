import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Component/Header';

const ForgetPassword = () => {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleConfirm = () => {
    if (!emailOrPhone.trim()) {
      setError('Please enter your email or phone number.');
      return;
    }

    const isEmail = /\S+@\S+\.\S+/.test(emailOrPhone);
    const isPhone = /^\d{7,15}$/.test(emailOrPhone);

    if (!isEmail && !isPhone) {
      setError('Enter a valid email or phone number.');
      return;
    }

    setError('');
    alert('Reset link sent (simulated).');
     navigate('/verifyOTP', { state: { emailOrPhone } });
    setEmailOrPhone('');
  };

  const handleBack = () => {
    navigate('/Buyer-login'); // Update to your actual login path
  };

  return (
    <>
      <Header />

      {/* Background section below header */}
      <div
        className="w-full flex justify-center items-center"
        style={{
          backgroundImage: "url('/assets/BuyersImg/images/Forgetbg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "calc(102vh - 80px)", // Adjust this height based on your header height
        }}
      >
        <div className="bg-white rounded p-3 w-full max-w-md">
          <h4>Forgot password</h4>
          <p className='text-[#6C7278]'>
            Please enter the account that you want to <br />
            reset the password.
          </p>

          <div className="flex flex-col mb-4">
            <label htmlFor="email">Phone Number or Email</label>
            <input
              type="text"
              id="email"
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
              className="border p-1 rounded focus:outline-none focus:ring-0 mt-2"
              placeholder="Hello@gmail.com or 9800000000"
            />
            {error && <span className="text-red-500 text-sm mt-1">{error}</span>}
          </div>

          <div className="flex gap-3 mt-16 justify-end">
            <button
              onClick={handleBack}
              className="border border-[#49A760] rounded p-2 w-[90px] h-10 text-green-500 text-[16px]"
            >
              Back
            </button>
            <button
              onClick={handleConfirm}
              className="bg-[#49A760] p-2 text-white rounded-xl w-[90px] h-10 text-[16px]"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgetPassword;
