import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';

import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Register = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    return (
        <div className="img-fluid d-flex justify-content-center align-items-center" style={{
            backgroundImage: "url('/assets/BuyersImg/images/Background-img.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'no-repeat',
            minHeight: '100vh',
        }}>
            <form className="bg-white p-4 rounded-3 shadow-lg w-75">
                <div style={{ width: '60%', margin: '0 auto' }}>
                    <div className="text-center mb-3">
                        <img src="/assets/BuyersImg/images/logo.png" alt="Logo" className="img-fluid mb-3" style={{ width: '120px', height: 'auto' }} />
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
                            <button
                                type="button"
                                className="btn btn-success btn-sm w-50"
                            >
                                Sign Up
                            </button>
                        </div>
                    </div>

                    <div className='container text-center' style={{ width: '100%' }}>
                        <div className="row row-cols-2">

                            <div className="mb-2 col">
                                <label htmlFor="emailId" className="form-label d-flex justify-content-center small">Enter your Email id</label>
                                <input
                                    type="email"
                                    id="emailId"
                                    className="form-control form-control-sm shadow-sm"
                                    placeholder="Hello@gmail.com"
                                />
                            </div>

                            <div className="mb-2 col">
                                <label htmlFor="location" className="form-label d-flex justify-content-center small">Enter your location</label>
                                <input
                                    type="text"
                                    id="location"
                                    className="form-control form-control-sm shadow-sm"
                                    placeholder="Ktm"
                                />
                            </div>

                            {/* Password Field */}
                            <div className="mb-3 col position-relative">
                                <label htmlFor="Password" className="form-label d-flex justify-content-center small">Enter your Password</label>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="Password"
                                    className="form-control form-control-sm shadow-sm pe-5"
                                    placeholder="**********"
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
                            </div>

                            <div className="mb-3 col">
                                <label htmlFor="contact" className="form-label d-flex justify-content-center small">Enter your Contact</label>
                                <input
                                    type="number"
                                    id="contact"
                                    className="form-control form-control-sm shadow-sm"
                                    placeholder="9800000000"
                                />
                            </div>

                            {/* Confirm Password Field */}
                            <div className="mb-3 col position-relative">
                                <label htmlFor="confirmPassword" className="form-label d-flex justify-content-center small">Confirm your Password</label>
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    id="confirmPassword"
                                    className="form-control form-control-sm shadow-sm pe-5"
                                    placeholder="**********"
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
                            </div>
                        </div>
                    </div>

                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <div className="form-check">
                            <input type="checkbox" id="Remember" className="form-check-input" />
                            <label htmlFor="Remember" className="form-check-label small">Remember Me</label>
                        </div>
                    </div>

                    <div className="d-grid gap-2">
                        <button className="btn btn-primary btn-sm" type="button">Log In</button>
                        <div className="text-center small d-flex align-items-center justify-content-center gap-2 mt-2">
                            <span>Or login with</span>
                            <img
                                src="/assets/images/google-logo.png"
                                alt="Google"
                                style={{ width: '20px', height: '20px' }}
                            />
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default Register;
