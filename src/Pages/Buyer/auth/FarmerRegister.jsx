import React, { useState } from 'react';
import Header from "../Component/Header";
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';

const FarmerRegister = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [errors, setErrors] = useState({});
    const [form, setForm] = useState({
        name: "",
        address: "",
        email: "",
        password: "",
        number: "",
        confirmPassword: ""
    });

    const [registeredEmails, setRegisteredEmails] = useState([
        "test@example.com",
        "user@example.com"
    ]);

    const validateEmail = (email) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const validateContact = (contact) =>
        /^98\d{8}$/.test(contact); // Nepali number

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const validateForm = () => {
        const newErrors = {};

        if (!form.name.trim()) newErrors.name = "Name is required";

        if (!form.address.trim()) newErrors.address = "Address is required";

        if (!form.number.trim()) newErrors.number = "Number is required";
        else if (!validateContact(form.number))
            newErrors.number = "Enter a valid Nepali mobile number";

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

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        if (registeredEmails.includes(form.email)) {
            setErrors(prevErrors => ({
                ...prevErrors,
                email: "Email is already registered"
            }));
            return;
        }

        setRegisteredEmails(prev => [...prev, form.email]);

        alert("Registration Successful!");
        navigate("/Buyer-login");
    };

    return (
        <>
            <Header />
            <div
                className="d-flex justify-content-center align-items-center"
                style={{
                    backgroundImage: "url('/assets/BuyersImg/images/Farmer.png')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundAttachment: 'fixed',
                    minHeight: '100vh',
                }}
            >
                <form
                    className='bg-white fixed mb-16 p-4 rounded shadow-lg'
                    style={{
                        width: '60%',
                        maxWidth: '900px',
                        opacity: 0.95
                    }}
                    onSubmit={handleSubmit}
                >
                    <div className="text-center mb-4">
                        <h1 className="fw-bold">Farmer Register</h1>
                        <p className="text-muted">Create an account to Sell Your Farming Products</p>
                    </div>

                    <div className="row row-cols-1 row-cols-md-2 g-3">
                        {/* Full Name */}
                        <div>
                            <label className="form-label small">Enter your Full Name</label>
                            <input
                                type="text"
                                name="name"
                                className={`form-control form-control-sm shadow-sm ${errors.name && 'is-invalid'}`}
                                value={form.name}
                                onChange={handleChange}
                            />
                            {errors.name && <small className="text-danger">{errors.name}</small>}
                        </div>

                        {/* Address */}
                        <div>
                            <label className="form-label small">Address</label>
                            <input
                                type="text"
                                name="address"
                                className={`form-control form-control-sm shadow-sm ${errors.address && 'is-invalid'}`}
                                value={form.address}
                                onChange={handleChange}
                            />
                            {errors.address && <small className="text-danger">{errors.address}</small>}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="form-label small">Enter Your Email id</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="Hello@gmail.com"
                                className={`form-control form-control-sm shadow-sm ${errors.email && 'is-invalid'}`}
                                value={form.email}
                                onChange={handleChange}
                            />
                            {errors.email && <small className="text-danger">{errors.email}</small>}
                        </div>

                        {/* Password */}
                        <div className="position-relative">
                            <label className="form-label small">Enter your Password</label>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                placeholder="**********"
                                className={`form-control form-control-sm shadow-sm pe-5 ${errors.password && 'is-invalid'}`}
                                value={form.password}
                                onChange={handleChange}
                            />
                            <span
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: 'absolute',
                                    top: '40%',
                                    right: '15px',
                                    transform: 'translateY(-50%)',
                                    cursor: 'pointer',
                                    color: '#888'
                                }}
                            >
                                {showPassword ? <EyeTwoTone /> : <EyeInvisibleOutlined />}
                            </span>
                            {errors.password && <small className="text-danger">{errors.password}</small>}
                        </div>

                        {/* Phone Number */}
                        <div>
                            <label className="form-label small">Enter Your Phone Number</label>
                            <input
                                type="text"
                                name="number"
                                className={`form-control form-control-sm shadow-sm ${errors.number && 'is-invalid'}`}
                                value={form.number}
                                onChange={handleChange}
                            />
                            {errors.number && <small className="text-danger">{errors.number}</small>}
                        </div>

                        {/* Confirm Password */}
                        <div className="position-relative">
                            <label className="form-label small">Confirm your Password</label>
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                name="confirmPassword"
                                placeholder="**********"
                                className={`form-control form-control-sm shadow-sm pe-5 ${errors.confirmPassword && 'is-invalid'}`}
                                value={form.confirmPassword}
                                onChange={handleChange}
                            />
                            <span
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                style={{
                                    position: 'absolute',
                                    top: '50%',
                                    right: '15px',
                                    transform: 'translateY(-50%)',
                                    cursor: 'pointer',
                                    color: '#888'
                                }}
                            >
                                {showConfirmPassword ? <EyeTwoTone /> : <EyeInvisibleOutlined />}
                            </span>
                            {errors.confirmPassword && <small className="text-danger">{errors.confirmPassword}</small>}
                        </div>
                    </div>

                    {/* Remember me */}
                    <div className="form-check mt-3">
                        <input type="checkbox" className="form-check-input" id="rememberMe" />
                        <label className="form-check-label small" htmlFor="rememberMe">Remember me</label>
                    </div>

                    {/* Submit */}
                    <div className="d-grid mt-3">
                        <button type="submit" className="btn btn-sm" style={{ backgroundColor: '#49A760', color: 'white' }}>
                            Sign Up
                        </button>
                    </div>

                    {/* Google login */}
                    <div className="text-center small d-flex align-items-center justify-content-center gap-2 mt-2">
                            <span>Or login with</span>
                            <img
                                src="/assets/BuyersImg/images/google-logo.png"
                                alt="Google"
                                style={{ width: '20px', height: '20px' }}
                            />
                        </div>
                </form>
            </div>
        </>
    );
};

export default FarmerRegister;
