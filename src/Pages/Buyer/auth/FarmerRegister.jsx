import React, { useState } from 'react'; 
import Header from "../Component/Header";
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { UserRegister } from '../../../services/authService';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { ErrorMessageToast, SuccesfulMessageToast } from '../../../utils/Tostify.util';

const FarmerRegister = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [form, setForm] = useState({
        name: '',
        address: '',
        email: '',
        password: '',
        confirmPassword: '',
        number: ''
    });

    const [formData, setFormData] = useState({
      name: "",
      number: "",
      email: "",
      password: "",
      role: "farmer",
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
      const { name, value } = e.target;
      setForm({ ...form, [name]: value });
      setFormData({ ...formData, [name]: value });
    };

    const validateField = (name, value) => {
        let error = "";

        switch (name) {
            case 'name':
                error = value.trim().length < 3 ? 'Full name must be at least 3 characters.' : '';
                break;
            case 'address':
                error = value.trim().length < 3 ? 'Address must be at least 3 characters.' : '';
                break;
            case 'email':
                error = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : 'Invalid email format.';
                break;
            case 'password':
                error = value.length < 6 ? 'Password must be at least 6 characters.' : '';
                break;
            case 'confirmPassword':
                error = value !== form.password ? 'Passwords do not match.' : '';
                break;
            case 'number':
                error = /^[0-9]{7,15}$/.test(value) ? '' : 'Enter a valid phone number.';
                break;
            default:
                break;
        }

        setErrors(prev => ({ ...prev, [name]: error }));
    };

    const validateForm = () => {
        const newErrors = {};
        Object.entries(form).forEach(([name, value]) => {
            validateField(name, value);
            if (value === '') {
                newErrors[name] = 'This field is required';
            }
        });
        setErrors(prev => ({ ...prev, ...newErrors }));

        // return true if no error messages
        return Object.values({ ...errors, ...newErrors }).every(err => err === '');
    };

    const handleSubmit = async (e) => {
            e.preventDefault();
    
            if (!validateForm()) return;
    
            try {
                const response = await UserRegister(formData);
                SuccesfulMessageToast("Register Successfully!");
                navigate("/Buyer-login");
            } catch (err) {
                setErrors({ ...errors, form: err.message });
                ErrorMessageToast(err.message);
            }
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
                <form className='bg-white fixed mb-16 p-4 rounded shadow-lg'
                    style={{ width: '60%', maxWidth: '900px', opacity: 0.95 }}
                    onSubmit={handleSubmit}
                >
                    <div className="text-center mb-1">
                        <h1 className="fw-bold">Farmer Register</h1>
                        <p className="text-muted">Create an account to Sell Your Farming Products</p>
                    </div>

                    <div className="row">
                        {/* Full Name */}
                        <div className="col-12 col-md-6 mb-1 px-2">
                            <label className="form-label small">Enter your Full Name</label>
                            <input
                                type="text"
                                name="name"
                                className="form-control form-control-sm shadow-md"
                                value={form.name}
                                onChange={handleChange}
                                style={{ height: '38px', borderRadius: '0.5rem' }}
                            />
                            {errors.name && <small className="text-danger">{errors.name}</small>}
                        </div>

                        {/* Address */}
                        <div className="col-12 col-md-6 mb-3 px-2">
                            <label className="form-label small">Address</label>
                            <input
                                type="text"
                                name="address"
                                className="form-control form-control-sm shadow-md"
                                value={form.address}
                                onChange={handleChange}
                                style={{ height: '38px', borderRadius: '0.5rem' }}
                            />
                            {errors.address && <small className="text-danger">{errors.address}</small>}
                        </div>

                        {/* Email */}
                        <div className="col-12 col-md-6 mb-3 px-2">
                            <label className="form-label small">Enter Your Email id</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="Hello@gmail.com"
                                className="form-control form-control-sm shadow-md"
                                value={form.email}
                                onChange={handleChange}
                                style={{ height: '38px', borderRadius: '0.5rem' }}
                            />
                            {errors.email && <small className="text-danger">{errors.email}</small>}
                        </div>

                        {/* Password */}
                        <div className="col-12 col-md-6 mb-3 px-2">
                            <label className="form-label small">Enter your Password</label>
                            <div className="position-relative" style={{ height: '38px' }}>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    placeholder="**********"
                                    className="form-control form-control-sm shadow-md pe-5"
                                    value={form.password}
                                    onChange={handleChange}
                                    style={{ height: '38px', borderRadius: '0.5rem' }}
                                />
                                <span
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{
                                        position: 'absolute',
                                        top: '50%',
                                        right: '15px',
                                        transform: 'translateY(-50%)',
                                        cursor: 'pointer',
                                        color: '#888'
                                    }}
                                >
                                    {showPassword ? <EyeTwoTone /> : <EyeInvisibleOutlined />}
                                </span>
                            </div>
                            {errors.password && <small className="text-danger">{errors.password}</small>}
                        </div>

                        {/* Phone Number */}
                        <div className="col-12 col-md-6 mb-3 px-2">
                            <label className="form-label small">Enter Your Phone Number</label>
                            <input
                                type="text"
                                name="number"
                                className="form-control form-control-sm shadow-md"
                                value={form.number}
                                onChange={handleChange}
                                style={{ height: '38px', borderRadius: '0.5rem'}}
                            />
                            {errors.number && <small className="text-danger">{errors.number}</small>}
                        </div>

                        {/* Confirm Password */}
                        <div className="col-12 col-md-6 mb-3 px-2">
                            <label className="form-label small">Confirm your Password</label>
                            <div className="position-relative rounded-xl" style={{ height: '38px' }}>
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    name="confirmPassword"
                                    placeholder="**********"
                                    className="form-control form-control-sm shadow-md pe-5"
                                    value={form.confirmPassword}
                                    onChange={handleChange}
                                    style={{ height: '38px', borderRadius: '0.5rem' }}
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
                            </div>
                            {errors.confirmPassword && <small className="text-danger">{errors.confirmPassword}</small>}
                        </div>
                    </div>

                    <div className="form-check mb-3">
                        <input type="checkbox" id="Remember" className="form-check-input" />
                        <label htmlFor="Remember" className="form-check-label small">Remember Me</label>
                    </div>

                    <div className="d-grid mt-3">
                        <button className="btn btn-sm" type="submit" style={{ backgroundColor: '#49A760', color: 'white' }}>
                            Sign Up
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default FarmerRegister;
