import React, { useState } from 'react';
import Header from "../Component/Header";
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const FarmerRegister = () => {
    const navigate = useNavigate();

    const [errors, setErrors] = useState({});
    const [form, setForm] = useState({
        name: "",
        contact: "",
        email: "",
        district: "",
        municipality: "",
        wardnumber: ""
    });

    const [registeredEmails, setRegisteredEmails] = useState([
        "test@example.com",
        "user@example.com"
    ]);

    const validateEmail = (email) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const validateContact = (contact) =>
        /^98\d{8}$/.test(contact); // Nepali mobile number pattern

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const validateForm = () => {
        const newErrors = {};

        if (!form.name.trim()) newErrors.name = "Name is required";

        if (!form.contact.trim()) newErrors.contact = "Contact is required";
        else if (!validateContact(form.contact))
            newErrors.contact = "Enter a valid Nepali mobile number";

        if (!form.email.trim()) newErrors.email = "Email is required";
        else if (!validateEmail(form.email))
            newErrors.email = "Enter a valid email address";

        if (!form.district.trim()) newErrors.district = "District is required";
        if (!form.municipality.trim()) newErrors.municipality = "Municipality is required";
        if (!form.wardnumber.trim()) newErrors.wardnumber = "Ward Number is required";

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
            <div className="text-center p-3">
                <h2 className="font-bold">Farmer Register</h2>
                <p>Discover Fresh and Healthy products directly from the farmers.</p>
            </div>
            <form className='d-flex justify-content-center align-items-center bg-light' onSubmit={handleSubmit}>
                <div style={{ width: '60%', margin: '0 auto' }}>
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
                                    name="contact"
                                    className={`form-control form-control-sm shadow-sm ${errors.contact && 'is-invalid'}`}
                                    placeholder="9800000000"
                                    value={form.contact}
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
                                <label htmlFor="district" className="form-label d-flex small">Enter your District</label>
                                <input
                                    type="text"
                                    id="district"
                                    name="district"
                                    className={`form-control form-control-sm shadow-sm ${errors.district && 'is-invalid'}`}
                                    placeholder="Darchula"
                                    value={form.district}
                                    onChange={handleChange}
                                />
                                {errors.district && <small className="text-danger">{errors.district}</small>}
                            </div>

                            <div className="mb-3 col position-relative">
                                <label htmlFor="municipality" className="form-label d-flex small">Municipality / Rural Municipality</label>
                                <input
                                    type="text"
                                    id="municipality"
                                    name="municipality"
                                    className={`form-control form-control-sm shadow-sm ${errors.municipality && 'is-invalid'}`}
                                    placeholder="Municipality / Rural Municipality"
                                    value={form.municipality}
                                    onChange={handleChange}
                                />
                                {errors.municipality && <small className="text-danger">{errors.municipality}</small>}
                            </div>

                            <div className="mb-3 col position-relative">
                                <label htmlFor="wardnumber" className="form-label d-flex small">Ward Number</label>
                                <input
                                    type="number"
                                    id="wardnumber"
                                    name="wardnumber"
                                    className={`form-control form-control-sm shadow-sm ${errors.wardnumber && 'is-invalid'}`}
                                    placeholder="00"
                                    value={form.wardnumber}
                                    onChange={handleChange}
                                />
                                {errors.wardnumber && <small className="text-danger">{errors.wardnumber}</small>}
                            </div>
                        </div>
                    </div>

                    <div className="form-check mb-3">
                        <input type="checkbox" id="Remember" className="form-check-input" />
                        <label htmlFor="Remember" className="form-check-label small">Remember Me</label>
                    </div>

                    <div className="d-grid gap-2">
                        <button className="btn btn-primary btn-sm" type="submit">Sign Up</button>
                    </div>
                </div>
            </form>
        </>
    );
};

export default FarmerRegister;
