import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setSearchTerm, fetchData, editItem, deleteItem, addItem } from './store';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaEdit, FaTrash } from 'react-icons/fa';

const App = () => {
  const searchTerm = useSelector((state) => state.searchTerm);
  const data = useSelector((state) => state.data);
  const loading = useSelector((state) => state.loading);
  const error = useSelector((state) => state.error);
  let message = useSelector((state) => state.message);
  const dispatch = useDispatch();

  const [editingItem, setEditingItem] = useState(null);
  const [editForm, setEditForm] = useState({ id: '', name: '', email: '' });
  const [newItemForm, setNewItemForm] = useState({ name: '', email: '' });
  const [newItemError, setNewItemError] = useState('');
  const [apiMessage, setApiMessage] = useState('');

  useEffect(() => {
    dispatch(fetchData()).then((response) => {
      console.log(response);
      if (response && response.data.data.message) {
        setApiMessage(response.data.data.message);
      }
    });
  }, [dispatch]);

  const handleSearch = (event) => {
    dispatch(setSearchTerm(event.target.value));
  };

  const handleEditChange = (event) => {
    setEditForm({
      ...editForm,
      [event.target.name]: event.target.value,
    });
  };
  const handleCancel = (event) => {
    setEditingItem(null);
  };
  
  const handleNewItemChange = (event) => {
    setNewItemForm({
      ...newItemForm,
      [event.target.name]: event.target.value,
    });
  };

  const handleEdit = (item) => {
    setEditingItem(item.Id);
    setEditForm(item);
  };

  const handleSave = () => {
    if (!editForm.name.trim() || !editForm.email.trim()) {
      setNewItemError('Name and email cannot be empty');
      return;
    }
  
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(editForm.email.trim())) {
      setNewItemError('Please enter a valid email address');
      return;
    }
    dispatch(editItem(editForm))
    .then(() => {
      setEditingItem(null);
      setEditForm({ id: '', name: '', email: '' });
      
      setNewItemError('');
    })
    .catch((error) => {
      setNewItemError('Failed to update item');
      message = "Failed to update item";
    });
    
    
    setEditingItem(null);
    setEditForm({ id: '', name: '', email: '' });
  };

  const handleDelete = (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this item?");
  if (confirmed) {
    dispatch(deleteItem(id));
  }
  };

  const handleAdd = () => {
    if (!newItemForm.name.trim() || !newItemForm.email.trim()) {
      setNewItemError('Name and email cannot be empty');
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(newItemForm.email.trim())) {
      setNewItemError('Please enter a valid email address');
      return;
    }

    dispatch(addItem(newItemForm));
    setNewItemForm({ name: '', email: '' });
    setNewItemError('');
  };

  setTimeout(() => {
    dispatch({ type: 'CLEAR_MESSAGE' });
  }, 5000);

  const filteredData = Array.isArray(data)
    ? data.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <div className="container">
      <header className="text-center my-4">
        <h1>My Responsive App</h1>
      </header>
      <nav className="text-center mb-4">
        <ul className="nav justify-content-center">
          <li className="nav-item"><a className="nav-link" href="#">Home</a></li>
          <li className="nav-item"><a className="nav-link" href="#">About</a></li>
          <li className="nav-item"><a className="nav-link" href="#">Contact</a></li>
        </ul>
      </nav>
      <main className="mb-4">
      {apiMessage && <div className="alert alert-info">{apiMessage}</div>}
        
        <div className="mb-3 col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Name"
            name="name"
            required
            value={newItemForm.name}
            onChange={handleNewItemChange}
          />
          <input
            type="email"
            className="form-control mt-2"
            placeholder="Email"
            name="email"
            required
            value={newItemForm.email}
            onChange={handleNewItemChange}
          />
          <button className="btn btn-primary mt-2 mb-3" onClick={handleAdd}>Add</button>

          <div className="mt-2 col-md-4">
          <input
            type="text"
            className="form-control col-md-4"
            placeholder="Search by name"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
          {newItemError && <div className="text-warning">{newItemError}</div>}
          { <div className="text-success">{message}</div>}
        </div>
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
                <tr key={parseInt(item.Id)}>
                  <td>{index +1}</td>
                  <td>
                    {editingItem == parseInt(item.Id) ? (
                      <input
                        type="text"
                        name="name"
                        value={editForm.name}
                        onChange={handleEditChange}
                      />
                    ) : (
                      item.name
                    )}
                  </td>
                  <td>
                    {editingItem == parseInt(item.Id) ? (
                      <input
                        type="email"
                        name="email"
                        value={editForm.email}
                        onChange={handleEditChange}
                      />
                    ) : (
                      item.email
                    )}
                  </td>
                  <td>
                    {editingItem == parseInt(item.Id) ? (
                      <>
                      <button className="btn btn-success btn-sm mx-1" onClick={handleSave}>
                        Save
                      </button>
                       <button className="btn btn-danger mx-1" onClick={handleCancel}>
                       Cancel 
                     </button>
                     </>
                    ) : (
                      <>
                        <FaEdit className="btn btn-primary btn-sm mx-1" onClick={() => handleEdit(item)} size={28}/>
                        
                        <FaTrash className="btn btn-danger btn-sm mx-1" size={28} onClick={() => handleDelete(parseInt(item.Id))} />
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
    </div>
  );
};

export default App;
