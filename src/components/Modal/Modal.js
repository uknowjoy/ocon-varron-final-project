import React, { useState } from 'react';
import './Modal.css'; // Import CSS for styling

const Modal = ({ show, onClose }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = () => {
    // Handle form submission or any action when the modal is submitted
    console.log('Submitted:', inputValue);
    onClose(); // Close the modal after submission
  };

  return (
    <div className={`modal ${show ? 'show' : ''}`}>
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>Modal Title</h2>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter something..."
        />
        <button onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
};

export default Modal;
