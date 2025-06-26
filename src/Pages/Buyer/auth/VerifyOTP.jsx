import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../Component/Header';
import { CheckOtp } from '../../../services/authService';
import { ErrorMessageToast, SuccesfulMessageToast } from '../../../utils/Tostify.util';

const VerifyOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [otpSent, setOtpSent] = useState(true);
  const inputsRef = useRef([]);

  useEffect(() => {
    let timer;
    if (otpSent && countdown > 0) {
      timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [otpSent, countdown]);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (!/^[0-9]?$/.test(value)) return; // Only allow numbers

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto move to next input
    if (value && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handleOtpSubmit = async () => {
    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      setError("Please enter a 6-digit OTP.");
      ErrorMessageToast("Please enter a 6-digit OTP.");
      return;
    }

    setError("");
    setLoading(true);
    try {
      const response = await CheckOtp({ email, otp: otpCode });
      SuccesfulMessageToast(response || "OTP verified successfully");
      navigate("/reset-password", { state: { email } });
    } catch (error) {
      const errorMessage =
        error.response?.data || "Invalid OTP or expired. Please try again.";
      setError(errorMessage);
      ErrorMessageToast(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = () => {
    if (countdown === 0) {
      alert(`OTP resent to ${email}`);
      setCountdown(60);
      setOtpSent(true);
      setOtp(new Array(6).fill(''));
      inputsRef.current[0].focus();
    }
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
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "calc(102vh - 80px)",
        }}
      >
        <div className="bg-white rounded p-4 w-full max-w-md">
          <h4>Verify OTP</h4>
          <p className="text-[#6C7278]">Please enter the OTP via your email id to continue</p>
          <p className='font-semibold'>Email : <span className="font-semibold text-[#A5A49A]"> {email}</span></p>


          {/* OTP Input Boxes */}
          <div className="flex justify-between gap-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputsRef.current[index] = el)}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-10 h-12 border rounded text-center text-xl focus:outline-none focus:ring-0"
              />
            ))}
          </div>

          {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

          <div className="flex justify-between items-center mt-2">
            <span className="text-sm text-gray-600">
              Resend OTP in {countdown > 0 ? `${countdown}s` : '0s'}
            </span>
            <button
              onClick={handleResendOtp}
              disabled={countdown > 0}
              className={`text-sm underline ${
                countdown > 0 ? 'text-gray-400 cursor-not-allowed' : 'text-green-600'
              }`}
            >
              Resend OTP
            </button>
          </div>

          <div className="flex gap-3 justify-end mt-16">
            <button
              onClick={handleBack}
              className="border border-[#49A760] rounded p-2 w-[90px] h-10 text-green-500 text-[16px]"
            >
              Back
            </button>
            <button
              onClick={handleOtpSubmit}
              className="bg-[#49A760] p-2 text-white rounded-xl w-[90px] h-10 text-[16px]"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default VerifyOtp;
