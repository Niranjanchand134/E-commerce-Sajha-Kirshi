import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';

import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { UserRegister } from '../../../services/authService';
import { ErrorMessageToast, SuccesfulMessageToast } from '../../../utils/Tostify.util';

const Register = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [form, setForm] = useState({
        name: "",
        number: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const [formData, setFormData] = useState({
      name: "",
      number: "",
      email: "",
      password: "",
      role: "user"
    });
    const [errors, setErrors] = useState({});

    // Mock registered emails for demonstration
    const [registeredEmails, setRegisteredEmails] = useState([
        "test@example.com",
        "user@example.com",
    ]);

    const validateEmail = (email) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const validateContact = (contact) =>
        /^98\d{8}$/.test(contact); // Nepali mobile number pattern

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
        setFormData({...formData, [name]:value});
    };

    const validateForm = () => {
        const newErrors = {};

        if (!form.name.trim()) newErrors.name = "Name is required";

        if (!form.email.trim()) newErrors.email = "Email is required";
        else if (!validateEmail(form.email))
            newErrors.email = "Enter a valid email address";

        if (!form.password) newErrors.password = "Password is required";
        else if (form.password.length < 6)
            newErrors.password = "Password must be at least 6 characters";

        if (!form.confirmPassword)
            newErrors.confirmPassword = "Please confirm your password";
        else if (form.password !== form.confirmPassword)
            newErrors.confirmPassword = "Passwords do not match";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()){
            return;
        } 

        try{
          const response = await UserRegister(formData);

          SuccesfulMessageToast("Register Successfully!")

          navigate("/Buyer-login")

        }catch (err) {
            setErrors(err.message);
            ErrorMessageToast(err.message);
            return;
        }


        // Check if email already exists
        // if (registeredEmails.includes(form.email)) {
        //     setErrors(prevErrors => ({
        //         ...prevErrors,
        //         email: "Email is already registered"
        //     }));
        //     return;
        // }

        // Simulate registering the user by adding the email to the registered list
        // setRegisteredEmails(prev => [...prev, form.email]);

        // alert("Registration Successful!");
        // navigate("/Buyer-login");
    };

    return (
        <div
            className="img-fluid d-flex justify-content-center align-items-center"
            style={{
                backgroundImage: "url('/assets/BuyersImg/images/Background-img.png')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                minHeight: '100vh',
            }}
        >
            <form className="bg-white p-4 rounded-3 shadow-lg w-75" onSubmit={handleSubmit}>
                <div style={{ width: '60%', margin: '0 auto' }}>
                    <div className="text-center mb-3">
                        <img
                            src="/assets/BuyersImg/images/logo.png"
                            alt="Logo"
                            className="img-fluid mb-3 d-block mx-auto"
                            style={{ maxWidth: '120px', height: 'auto' }}
                        />
                        <h1 className="h1 bold">Get Started now</h1>
                        <p className="lg">Create an account to Sell Your Farming Products</p>

                        <div className="d-flex justify-content-center gap-2 mb-3">
                            <button
                                type="button"
                                className="btn btn-outline-success btn-sm w-50"
                                onClick={() => navigate('/Buyer-login')}
                            >
                                Log In
                            </button>
                            <button type="button" className="btn btn-success btn-sm w-50">
                                Sign Up
                            </button>
                        </div>
                    </div>

                    <div className="container text-start" style={{ width: '100%' }}>
                        <div className="row row-cols-2">
                            <div className="mb-2 col">
                                <label htmlFor="name" className="form-label d-flex small">Enter your Full Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    className={`form-control form-control-sm shadow-sm ${errors.name && 'is-invalid'}`}
                                    placeholder="Enter your Name"
                                    value={form.name}
                                    onChange={handleChange}
                                />
                                {errors.name && <small className="text-danger">{errors.name}</small>}
                            </div>

                            <div className="mb-3 col">
                                <label htmlFor="contact" className="form-label d-flex small">Enter your Phone Number</label>
                                <input
                                    type="text"
                                    id="contact"
                                    name="number"
                                    className={`form-control form-control-sm shadow-sm ${errors.contact && 'is-invalid'}`}
                                    placeholder="9800000000"
                                    value={form.number}
                                    onChange={handleChange}
                                />
                                {errors.contact && <small className="text-danger">{errors.contact}</small>}
                            </div>

                            <div className="mb-2 col">
                                <label htmlFor="emailId" className="form-label d-flex small">Enter your Email</label>
                                <input
                                    type="email"
                                    id="emailId"
                                    name="email"
                                    className={`form-control form-control-sm shadow-sm ${errors.email && 'is-invalid'}`}
                                    placeholder="Hello@gmail.com"
                                    value={form.email}
                                    onChange={handleChange}
                                />
                                {errors.email && <small className="text-danger">{errors.email}</small>}
                            </div>

                            <div className="mb-3 col position-relative">
                                <label htmlFor="Password" className="form-label d-flex small">Enter your Password</label>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="Password"
                                    name="password"
                                    className={`form-control form-control-sm shadow-sm pe-5 ${errors.password && 'is-invalid'}`}
                                    placeholder="**********"
                                    value={form.password}
                                    onChange={handleChange}
                                />
                                <span
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{
                                        position: 'absolute',
                                        top: '75%',
                                        right: '15px',
                                        transform: 'translateY(-50%)',
                                        cursor: 'pointer',
                                        fontSize: '16px',
                                        color: '#888'
                                    }}
                                >
                                    {showPassword ? <EyeTwoTone /> : <EyeInvisibleOutlined />}
                                </span>
                                {errors.password && <small className="text-danger">{errors.password}</small>}
                            </div>

                            <div className="mb-3 col position-relative">
                                <label htmlFor="confirmPassword" className="form-label d-flex small">Confirm your Password</label>
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    className={`form-control form-control-sm shadow-sm pe-5 ${errors.confirmPassword && 'is-invalid'}`}
                                    placeholder="**********"
                                    value={form.confirmPassword}
                                    onChange={handleChange}
                                />
                                <span
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    style={{
                                        position: 'absolute',
                                        top: '75%',
                                        right: '15px',
                                        transform: 'translateY(-50%)',
                                        cursor: 'pointer',
                                        fontSize: '16px',
                                        color: '#888'
                                    }}
                                >
                                    {showConfirmPassword ? <EyeTwoTone /> : <EyeInvisibleOutlined />}
                                </span>
                                {errors.confirmPassword && <small className="text-danger">{errors.confirmPassword}</small>}
                            </div>
                        </div>
                    </div>

                    <div className="form-check mb-3">
                        <input type="checkbox" id="Remember" className="form-check-input" />
                        <label htmlFor="Remember" className="form-check-label small">Remember Me</label>
                    </div>

                    <div className="d-grid gap-2">
                        <button onClick={handleSubmit} className="btn btn-primary btn-sm" type="submit">Sign Up</button>
                        <div className="text-center small d-flex align-items-center justify-content-center gap-2 mt-2">
                            <span>Or login with</span>
                            <img
                                src="/assets/BuyersImg/images/google-logo.png"
                                alt="Google"
                                style={{ width: '20px', height: '20px' }}
                            />
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Register;
