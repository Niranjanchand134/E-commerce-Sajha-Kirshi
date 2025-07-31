import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Component/Header";
import { CheckEmail } from "../../../services/authService";
import {
  ErrorMessageToast,
  SuccesfulMessageToast,
} from "../../../utils/Tostify.util";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleConfirm = async () => {
    if (!email.trim()) {
      setError("Please enter your email or phone number.");
      return;
    }

    const isEmail = /\S+@\S+\.\S+/.test(email);
    const isPhone = /^\d{7,15}$/.test(email);

    if (!isEmail && !isPhone) {
      setError("Enter a valid email or phone number.");
      return;
    }

    setError("");
    setLoading(true);
    try {
      const response = await CheckEmail({ email });
      console.log(response);
      if (response.status === 200) {
        SuccesfulMessageToast(response.data || "OTP sent successfully");
        navigate("/verifyOTP", { state: { email } });
        setEmail("");
      }
    } catch (error) {
      console.log(error);
      let errorMessage = "Failed to send OTP. Please try again.";
      if (error.response) {
        if (error.response.status === 404) {
          errorMessage = "This email does not exist.";
        } else if (error.response.status === 500) {
          errorMessage = error.response.data || "Server error occurred.";
        }
      }
      setError(errorMessage);
      ErrorMessageToast(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/Buyer-login");
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
        <div className="bg-white rounded p-3 w-full max-w-md">
          <h4>Forgot password</h4>
          <p className="text-[#6C7278]">
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
              placeholder="Hello@gmail.com"
            />
            {error && (
              <span className="text-red-500 text-sm mt-1">{error}</span>
            )}
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
              className="bg-[#49A760] p-2 text-white rounded-xl w-[90px] h-10 text-[16px] flex items-center justify-center"
              disabled={loading}
            >
              {loading ? (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                "Confirm"
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgetPassword;
