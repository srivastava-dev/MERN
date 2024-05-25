import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { editItem } from './store';

const EditItem = () => {
    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const [form, setForm] = useState({ name: '', email: '', id: null });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const { name = '', email = '', id: stateId } = location?.state || {};
        setForm({ name, email, id: location.state.Id });
    }, [location, id]);

    const handleChange = (event) => {
        setForm({
            ...form,
            [event.target.name]: event.target.value,
        });
    };

    const handleEdit = () => {
        if (!form.name.trim() || !form.email.trim()) {
            setError('Name and email cannot be empty');
            return;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(form.email.trim())) {
            setError('Please enter a valid email address');
            return;
        }

        dispatch(editItem({ id: form.Id, ...form }))
            .then((response) => {
                if(response.success) {
                    setSuccess(response.message);
                    setTimeout(function() {
                setForm({ name: '', email: '', id: null });
                setError('');
               navigate('/');
            }, 2000);
                }else{
                    setSuccess('');
                    setError(response.message);
                }
            })
            .catch(() => {
                setError('Failed to update item');
            });
    };

    return (
        <div className="container">
            <header className="text-center my-4">
                <h1>Edit Item</h1>
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
                    <button className="btn btn-primary" onClick={handleEdit}>Save Changes</button>
                </div>
            </main>
        </div>
    );
};

export default EditItem;
