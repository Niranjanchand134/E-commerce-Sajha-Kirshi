import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';

import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { greeting, loginDetails } from '../../../services/authService';
import { ErrorMessageToast, SuccesfulMessageToast, WarningMessageToast } from '../../../utils/Tostify.util';
import { useAuth } from '../../../Context/AuthContext';
import { jwtDecode } from 'jwt-decode';
import { GoogleLogin } from "@react-oauth/google";
import axios from 'axios';

const Login = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(""); // global error message
    const [form, setForm] = useState({ email: "", password: "" });
    const [errors, setErrors] = useState({ email: "", password: "" }); // field-level errors

    const {user, login} = useAuth();

    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setForm({ ...form, [name]: value });

        let errorMsg = "";

        if (name === "email") {
            if (!value) errorMsg = "Email is required";
            else if (!validateEmail(value)) errorMsg = "Enter a valid email";
        }

        if (name === "password") {
            if (!value) errorMsg = "Password is required";
            else if (value.length < 6) errorMsg = "Password must be at least 6 characters";
        }

        setErrors({ ...errors, [name]: errorMsg });
    };

    const handleGoogleSuccess = async (
      credentialResponse
    ) => {
      try {
        // setIsLoading(true);

        // Decode the JWT token to get user info
        const decodedUser = jwtDecode(credentialResponse?.credential ?? "");

        // console.log("Here is the decodded data..",decodedUser);
        // Send the token to your backend
        const response = await axios.post(
          "http://localhost:8080/api/auth/google",
          {
            id_token: credentialResponse.credential,
          }
        );

        console.log(response.data);

        // Login with the received token
        login(response.data);
        // console.log("this just try ", decodedUser);
        console.log("credentials ", credentialResponse.credential);


        // Redirect to dashboard
        navigate("/");
      } catch (error) {
        console.error("Google login error:", error);
        setErrors("Google login failed. Please try again.");
      } finally {
        // setIsLoading(false);
      }
    };

    const handleGoogleError = () => {
      setErrors("Google login failed. Please try again.");
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        let valid = true;
        const newErrors = { email: "", password: "" };

        if (!form.email) {
            newErrors.email = "Email is required";
            valid = false;
        } else if (!validateEmail(form.email)) {
            newErrors.email = "Enter a valid email";
            valid = false;
        }

        if (!form.password) {
            newErrors.password = "Password is required";
            valid = false;
        } else if (form.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
            valid = false;
        }

        setErrors(newErrors);

        if (!valid) return;

        try {
            const token = await loginDetails(form.email, form.password);

            login(token);
            SuccesfulMessageToast("Successfully Login.");
                
            setTimeout(() => {

                const storedToken = localStorage.getItem("token");
                const decoded = jwtDecode(storedToken);
                const role = decoded.role;

                if(role === "buyer"){
                    navigate("/")
                }
                if(role === "farmer"){
                    navigate("/Farmerlayout/Farmerdashboard");
                }

                window.location.reload();
                
            }, 2000);
           
            
        } catch (err) {
            WarningMessageToast(err.message);
        }
    };

    useEffect(() => {
        const response = greeting();    
        console.log("here is the response", response);
    }, []);

    return (
      <div
        className="img-fluid d-flex justify-content-center align-items-center"
        style={{
          backgroundImage: "url('/assets/BuyersImg/images/Background-img.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "100vh",
        }}
      >
        <form
          className="bg-white p-4 rounded-3 shadow-lg w-75"
          onSubmit={handleSubmit}
        >
          <div style={{ width: "65%", margin: "0 auto" }}>
            <div className="text-center mb-3">
              <img
                src="/assets/BuyersImg/images/logo.png"
                alt="Logo"
                className="img-fluid mb-3 d-block mx-auto"
                style={{ width: "120px", height: "auto" }}
              />
              <h1 className="h1 bold">Get Started now</h1>
              <p className="lg">
                Create an account or log in to explore our site.
              </p>

              <div className="d-flex justify-content-center gap-2 mb-3">
                <button type="button" className="btn btn-sm w-50" style={{ backgroundColor: "#49A760", color: "white" }}>
                  Log In
                </button>
                <button
                  type="button"
                  className="btn btn-outline-success btn-sm w-50"
                  onClick={() => navigate("/Buyer-register")}
                >
                  Sign Up
                </button>
              </div>
            </div>

            {error && (
              <div className="text-danger text-center mb-3">{error}</div>
            )}

            <div className="mb-3">
              <label htmlFor="email" className="form-label d-flex small">
                Enter your Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className={`form-control form-control-sm shadow-sm ${
                  errors.email && "is-invalid"
                }`}
                placeholder="Hello@gmail.com"
              />
              {errors.email && (
                <small className="text-danger">{errors.email}</small>
              )}
            </div>

            <div className="mb-3 position-relative">
              <label htmlFor="Password" className="form-label d-flex small">
                Enter your Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="Password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className={`form-control form-control-sm shadow-sm pe-5 ${
                  errors.password && "is-invalid"
                }`}
                placeholder="**********"
              />
              <span
                className="position-absolute"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  top: "75%",
                  right: "10px",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  fontSize: "16px",
                  color: "#888",
                }}
              >
                {showPassword ? <EyeTwoTone /> : <EyeInvisibleOutlined />}
              </span>
              {errors.password && (
                <small className="text-danger">{errors.password}</small>
              )}
            </div>

            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="form-check">
                <input
                  type="checkbox"
                  id="Remember"
                  className="form-check-input"
                />
                <label htmlFor="Remember" className="form-check-label small">
                  Remember Me
                </label>
              </div>
              <a href="/forgetpassword" className="small">
                Forgot Password?
              </a>
            </div>

            <div className="d-grid gap-2">
              <button className="btn btn-sm" style={{ backgroundColor: "#49A760", color: "white" }} type="submit">
                Login
              </button>
              <div className="flex justify-center space-x-4">
                <div className="p-2 rounded-full bg-blue-50 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleError}
                    useOneTap
                    text="continue_with"
                    shape="pill"
                  />
                </div>
              </div>
              {/* <div className="text-center small d-flex align-items-center justify-content-center gap-2 mt-2">
                <span>Or login with</span>
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  useOneTap
                  text="continue_with"
                  shape="pill"
                />
                
                {/* <img
                  src="/assets/BuyersImg/images/google-logo.png"
                  onClick={
                    
                  }
                  alt="Google"
                  style={{ width: "20px", height: "20px" }}
                /> 
              </div> */}
            </div>
          </div>
        </form>
      </div>
    );
};

export default Login;
