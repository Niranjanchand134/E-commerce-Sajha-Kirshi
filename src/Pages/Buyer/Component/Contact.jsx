import React, { useState } from "react";
import Footer from "./Footer";
import Header from "./Header";
import { ErrorMessageToast, SuccesfulMessageToast } from '../../../utils/Tostify.util';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      ErrorMessageToast('All fields are required!')
      return;
    }
    
    const formAction = "https://formsubmit.co/ajax/niranjachand134@gmail.com"; // Use AJAX endpoint

    try {
      const response = await fetch(formAction, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        SuccesfulMessageToast("Form submitted successfully!");
        setFormData({ name: "", email: "", message: "" }); // Reset form
      } else {
        throw new ErrorMessageToast('Form submission failed');
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <>
      <Header />
      <div className="max-w-[1200px] mx-auto px-3 py-1 sm:py-16 lg:px-10">
        <div className="lead container my-3 py-3">
          <h1 className="text-center">Contact Bikers Zone</h1>
          <hr />
          <p className="mb-4">
            If you have any queries or even just wanted to give us feedback, we are always
            here to help you. We welcome your feedback and criticism about SajhaKrishi
            and aim to improve your experience on our site.
          </p>
          <p className="mb-4">
            In case you are trying to get in touch with us regarding any issues or inquiries,
            email us at <br />
            <a className="text-blue-800" href="/">
              sajhakrishi@gmail.com
            </a>
          </p>
          <h2 className="text-2xl font-bold mb-4">Contact Details</h2>
          <ul className="marker:text-black list-disc pl-5 space-y-2 mb-4">
            <li>Address: Kumaripati, Lalitpur</li>
            <li>
              Email: <a className="text-blue-800" href="mailto:niranjachand134@gmail.com">sajhakrishi@gmail.com</a>
            </li>
            <li>Open Hours: Sun to Fri 10 AM to 6 PM</li>
          </ul>
        </div>
      </div>
      <div className="container my-3 py-2">
        <h1 className="text-center">Contact Us</h1>
        <hr />
        <div className="row my-4 h-100">
          <div className="col-md-4 col-lg-4 col-sm-8 mx-auto">
            <form onSubmit={handleSubmit}>
              <div className="form my-3">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  name="name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div className="form my-3">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="form my-3">
                <label htmlFor="message">Message</label>
                <textarea
                  rows={5}
                  className="form-control"
                  id="message"
                  name="message"
                  placeholder="Enter your message"
                  value={formData.message}
                  onChange={handleChange}
                />
              </div>
              <div className="text-center">
                <button className="my-2 px-4 mx-auto btn btn-success" type="submit">
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Contact;
