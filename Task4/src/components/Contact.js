import React, { useState } from 'react';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  // Handle input change - controlled form inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    // Prevent default form behavior
    e.preventDefault();

    // Log the form data to console
    console.log('Form Data Submitted:', formData);

    // Display success message
    setSubmitted(true);

    // Clear the form fields after 2 seconds
    setTimeout(() => {
      setFormData({
        name: '',
        email: '',
        message: ''
      });
      setSubmitted(false);
    }, 2000);
  };

  return (
    <section className="page-section">
      <h1>Contact Us</h1>
      <p>
        Please fill out the form below and we'll get back to you as soon as possible!
      </p>

      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            placeholder="Enter your full name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            placeholder="Enter your email address"
          />
        </div>

        <div className="form-group">
          <label htmlFor="message">Message:</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            required
            placeholder="Enter your message here"
          />
        </div>

        <button type="submit" className="submit-btn">
          Submit
        </button>

        {submitted && (
          <div className="success-message show">
            ✓ Thank you! Your message has been received. Form cleared.
          </div>
        )}
      </form>

      <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#f9f9f9', borderRadius: '4px' }}>
        <p style={{ color: '#666', fontSize: '0.9rem' }}>
          <strong>Note:</strong> Open the browser console (F12) to see the submitted form data logged.
        </p>
      </div>
    </section>
  );
}

export default Contact;
