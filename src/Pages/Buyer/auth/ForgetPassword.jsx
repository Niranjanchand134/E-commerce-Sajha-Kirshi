import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Component/Header';
import { CheckEmail } from '../../../services/authService';
import { ErrorMessageToast, SuccesfulMessageToast } from '../../../utils/Tostify.util';

const ForgetPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleConfirm = async () => {
    if (!email.trim()) {
      setError('Please enter your email or phone number.');
      return;
    }

    const isEmail = /\S+@\S+\.\S+/.test(email);
    const isPhone = /^\d{7,15}$/.test(email);

    if (!isEmail && !isPhone) {
      setError('Enter a valid email or phone number.');
      return;
    }

    setError('');
    setLoading(true);
    try {
      const response = await CheckEmail({ email });
      console.log(response);
      if (response.status === 200) {
        SuccesfulMessageToast(response.data || 'OTP sent successfully');
        navigate('/verifyOTP', { state: { email } });
        setEmail("");
      }
    } catch (error) { 
      console.log(error)
      let errorMessage = 'Failed to send OTP. Please try again.';
      if (error.response) { 
        if (error.response.status === 404) {
          errorMessage = 'This email does not exist.';
        } else if (error.response.status === 500) {
          errorMessage = error.response.data || 'Server error occurred.';
        }
      }
      setError(errorMessage);
      ErrorMessageToast(errorMessage);
    } finally {
      setLoading(false);
    }
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
            <label htmlFor="email">Please Enter your Email</label>
            <input
              type="text"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border p-1 rounded focus:outline-none focus:ring-0 mt-2"
              placeholder="Hello@gmail.com "
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
