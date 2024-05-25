// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import ListPage from './ListPage';
import AddItem from './AddItem';
import EditItem from './EditItem';

const App = () => {
  return (
    <Router>
      <div className="container">
        <header className="text-center my-4">
          <h1>My Responsive App</h1>
        </header>
        <nav className="text-center mb-4">
          <ul className="nav justify-content-center">
            <li className="nav-item">
              <Link className="nav-link" to="/">List</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/add">Add New Item</Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<ListPage />} />
          <Route path="/add" element={<AddItem />} />
          <Route path="/edit" element={<EditItem />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
