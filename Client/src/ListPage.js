// ListPage.js
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setSearchTerm, fetchData, deleteItem } from './store';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';




const ListPage = () => {
    const searchTerm = useSelector((state) => state.searchTerm);
    const data = useSelector((state) => state.data);
    const loading = useSelector((state) => state.loading);
    const error = useSelector((state) => state.error);
    const message = useSelector((state) => state.message);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    useEffect(() => {
        dispatch(fetchData());
    }, [dispatch]);

    const handleSearch = (event) => {
        dispatch(setSearchTerm(event.target.value));
    };

    const handleDelete = (id) => {
        const confirmed = window.confirm("Are you sure you want to delete this item?");
        if (confirmed) {
            dispatch(deleteItem(id));
        }
    };
    const handleEdit = (value) => {
        navigate("/edit", { state: value })
    }
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                dispatch({ type: 'CLEAR_MESSAGE' });
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [message, dispatch]);

    const filteredData = Array.isArray(data)
        ? data.filter((item) =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : [];

    return (
        <div className="container">
            <header className="text-center my-4">
                <h1>Item List</h1>
            </header>
            <div className="mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search by name"
                    value={searchTerm}
                    onChange={handleSearch}
                />
            </div>
            {message && <div className="alert alert-info">{message}</div>}
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>Error: {error}</p>
            ) : (
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
              
                        {filteredData.map((item, index) => (
                            
                            <tr key={item.Id}>
                                <td>{index + 1}</td>
                                <td>{item.name}</td>
                                <td>{item.email}</td>
                                <td>
                                   
                                    {/* <Link to={`/edit/${item.Id}`}> */}
                                    <FaEdit className="btn btn-primary btn-sm mx-1" onClick={() => handleEdit(item)} size={28} />
                                    {/* </Link> */}
                                    <FaTrash className="btn btn-danger btn-sm mx-1" size={28} onClick={() => handleDelete(item.Id)} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
          
        </div>
    );
};

export default ListPage;
