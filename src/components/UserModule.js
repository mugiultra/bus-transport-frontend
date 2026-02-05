import React, { useState, useEffect } from 'react';
import { userAPI } from '../services/api';

const UserModule = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    username: '',
    email: '',
    password: '',
    role: 'USER',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    status: 'Active'
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getAll();
      setUsers(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch users');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await userAPI.update(currentUser.id, currentUser);
        setSuccess('User updated successfully!');
      } else {
        await userAPI.create(currentUser);
        setSuccess('User created successfully!');
      }
      resetForm();
      fetchUsers();
    } catch (err) {
      setError('Failed to save user');
      console.error(err);
    }
  };

  const handleEdit = (user) => {
    setCurrentUser({ ...user, password: '' });
    setEditMode(true);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await userAPI.delete(id);
        setSuccess('User deleted successfully!');
        fetchUsers();
      } catch (err) {
        setError('Failed to delete user');
        console.error(err);
      }
    }
  };

  const resetForm = () => {
    setCurrentUser({
      username: '',
      email: '',
      password: '',
      role: 'USER',
      firstName: '',
      lastName: '',
      phoneNumber: '',
      status: 'Active'
    });
    setEditMode(false);
    setShowForm(false);
  };

  const handleChange = (e) => {
    setCurrentUser({
      ...currentUser,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="glass-card">
      <div className="module-header">
        <span className="module-icon">👤</span>
        <h2>User Module</h2>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
        {showForm ? 'Cancel' : 'Add New User'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
          <div className="form-group">
            <label>Username *</label>
            <input
              type="text"
              name="username"
              value={currentUser.username}
              onChange={handleChange}
              required
              placeholder="e.g., john_doe"
            />
          </div>

          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              name="email"
              value={currentUser.email}
              onChange={handleChange}
              required
              placeholder="e.g., john@example.com"
            />
          </div>

          <div className="form-group">
            <label>Password {!editMode && '*'}</label>
            <input
              type="password"
              name="password"
              value={currentUser.password}
              onChange={handleChange}
              required={!editMode}
              placeholder={editMode ? 'Leave blank to keep current password' : 'Enter password'}
            />
          </div>

          <div className="form-group">
            <label>Role *</label>
            <select name="role" value={currentUser.role} onChange={handleChange} required>
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          <div className="form-group">
            <label>First Name *</label>
            <input
              type="text"
              name="firstName"
              value={currentUser.firstName}
              onChange={handleChange}
              required
              placeholder="e.g., John"
            />
          </div>

          <div className="form-group">
            <label>Last Name *</label>
            <input
              type="text"
              name="lastName"
              value={currentUser.lastName}
              onChange={handleChange}
              required
              placeholder="e.g., Doe"
            />
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="tel"
              name="phoneNumber"
              value={currentUser.phoneNumber}
              onChange={handleChange}
              placeholder="e.g., +1234567890"
            />
          </div>

          <div className="form-group">
            <label>Status *</label>
            <select name="status" value={currentUser.status} onChange={handleChange} required>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary">
            {editMode ? 'Update User' : 'Create User'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={resetForm}>
            Cancel
          </button>
        </form>
      )}

      {loading ? (
        <div className="loading">Loading users...</div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center' }}>No users found</td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id}>
                  <td>{user.username}</td>
                  <td>{user.firstName} {user.lastName}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{user.phoneNumber || '-'}</td>
                  <td>{user.status}</td>
                  <td>
                    <button className="btn btn-warning" onClick={() => handleEdit(user)}>
                      Edit
                    </button>
                    <button className="btn btn-danger" onClick={() => handleDelete(user.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserModule;
