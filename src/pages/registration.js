import React, { useState } from 'react';

const RegistrationForm = () => {
  const [errorMessage, setErrorMessage] = useState('');

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    firstname: '',
    lastname: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3001/api/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',   
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Registration successful
        console.log('Registration successful!');
        // Redirect or show a success message
        window.location.reload();
      } else {
        // Registration failed
        setErrorMessage('Registration failed. Error on Credentials.');
        // Handle error, show error message, etc.
      }
    } catch (error) {
      console.error('Error during registration:', error);
      // Handle error, show error message, etc.
    }
  };

  return (
    <form className=" mx-auto max-w-md p-6 border rounded-lg shadow-md bg-white">
      <h2 className="text-2xl font-bold mt-5 mb-4">Register</h2>
  <p className="error-message">{errorMessage}</p>
  <div className="mb-4">
    <input
      type="text"
      name="username"
      placeholder="Username"
      value={formData.username}
      onChange={handleChange}
      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-500"
    />
  </div>
  <div className="mb-4">
    <input
      type="text"
      name="firstname"
      placeholder="Firstname"
      value={formData.firstname}
      onChange={handleChange}
      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-500"
    />
  </div>
  <div className="mb-4">
    <input
      type="text"
      name="lastname"
      placeholder="Lastname"
      value={formData.lastname}
      onChange={handleChange}
      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-500"
    />
  </div>
  <div className="mb-4">
    <input
      type="email"
      name="email"
      placeholder="Email"
      value={formData.email}
      onChange={handleChange}
      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-500"
    />
  </div>
  <div className="mb-4">
    <input
      type="password"
      name="password"
      placeholder="Password"
      value={formData.password}
      onChange={handleChange}
      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-500"
    />
  </div>
  <button
    onClick={handleSubmit}
    className="w-[50%] bg-teal-600 hover:bg-teal-700 text-white py-2 rounded-md focus:outline-none focus:ring focus:border-teal-500"
  >
    Register
  </button>
</form>

  );
};

export default RegistrationForm;