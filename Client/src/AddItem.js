// AddItem.js
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addItem } from './store';

const AddItem = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '' });
  const [error, setError] = useState('');
  const[success,setSuccess] = useState('');

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleAdd = () => {
    if (!form.name.trim() || !form.email.trim()) {
      setError('Name and email cannot be empty');
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(form.email.trim())) {
      setError('Please enter a valid email address');
      return;
    }

    dispatch(addItem(form))
      .then((response) => {
       // console.log(response);
        if(response.success) {


            setSuccess(response.message);
            setTimeout(function() {
               
                setError('');
                setForm({ name: '', email: '' });
                navigate('/');
            }, 2000);
            
           
        }
        else {
            setError(response.message);
         }
      })
      .catch((err) => {
        console.error(err);
        const serverError = err.message || 'Failed to add item';
            setError(serverError);
      });
  };

  return (
    <div className="container">
      <header className="text-center my-4">
        <h1>Add New Item</h1>
      </header>
      <main className="mb-4">
        <div className="mb-3 col-md-6 mx-auto">
          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Name"
            name="name"
            required
            value={form.name}
            onChange={handleChange}
          />
          <input
            type="email"
            className="form-control mb-2"
            placeholder="Email"
            name="email"
            required
            value={form.email}
            onChange={handleChange}
          />
          <button className="btn btn-primary" onClick={handleAdd}>Add Item</button>
        </div>
      </main>
    </div>
  );
};

export default AddItem;
