import React, { useState, useEffect } from 'react';
import { busAPI } from '../services/api';

const BusManagement = () => {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentBus, setCurrentBus] = useState({
    busNumber: '',
    busType: 'AC',
    totalSeats: '',
    registrationNumber: '',
    status: 'Active'
  });

  useEffect(() => {
    fetchBuses();
  }, []);

  const fetchBuses = async () => {
    try {
      setLoading(true);
      const response = await busAPI.getAll();
      setBuses(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch buses');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Convert totalSeats to number for proper API handling
      const busData = {
        ...currentBus,
        totalSeats: parseInt(currentBus.totalSeats)
      };
      
      if (editMode) {
        await busAPI.update(currentBus.id, busData);
        setSuccess('Bus updated successfully!');
      } else {
        await busAPI.create(busData);
        setSuccess('Bus created successfully!');
      }
      resetForm();
      fetchBuses();
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to save bus';
      setError(errorMessage);
      console.error('Error details:', err);
    }
  };

  const handleEdit = (bus) => {
    setCurrentBus(bus);
    setEditMode(true);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this bus?')) {
      try {
        await busAPI.delete(id);
        setSuccess('Bus deleted successfully!');
        fetchBuses();
      } catch (err) {
        setError('Failed to delete bus');
        console.error(err);
      }
    }
  };

  const resetForm = () => {
    setCurrentBus({
      busNumber: '',
      busType: 'AC',
      totalSeats: '',
      registrationNumber: '',
      status: 'Active'
    });
    setEditMode(false);
    setShowForm(false);
  };

  const handleChange = (e) => {
    setCurrentBus({
      ...currentBus,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="glass-card">
      <div className="module-header">
        <span className="module-icon">🚍</span>
        <h2>Bus Management Module</h2>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
        {showForm ? 'Cancel' : 'Add New Bus'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
          <div className="form-group">
            <label>Bus Number *</label>
            <input
              type="text"
              name="busNumber"
              value={currentBus.busNumber}
              onChange={handleChange}
              required
              placeholder="e.g., BUS-101"
            />
          </div>

          <div className="form-group">
            <label>Bus Type *</label>
            <select name="busType" value={currentBus.busType} onChange={handleChange} required>
              <option value="AC">AC</option>
              <option value="Non-AC">Non-AC</option>
              <option value="Sleeper">Sleeper</option>
              <option value="Semi-Sleeper">Semi-Sleeper</option>
            </select>
          </div>

          <div className="form-group">
            <label>Total Seats *</label>
            <input
              type="number"
              name="totalSeats"
              value={currentBus.totalSeats}
              onChange={handleChange}
              required
              placeholder="e.g., 50"
            />
          </div>

          <div className="form-group">
            <label>Registration Number *</label>
            <input
              type="text"
              name="registrationNumber"
              value={currentBus.registrationNumber}
              onChange={handleChange}
              required
              placeholder="e.g., KA-01-AB-1234"
            />
          </div>

          <div className="form-group">
            <label>Status *</label>
            <select name="status" value={currentBus.status} onChange={handleChange} required>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Under Maintenance">Under Maintenance</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary">
            {editMode ? 'Update Bus' : 'Create Bus'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={resetForm}>
            Cancel
          </button>
        </form>
      )}

      {loading ? (
        <div className="loading">Loading buses...</div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Bus Number</th>
              <th>Type</th>
              <th>Seats</th>
              <th>Registration</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {buses.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center' }}>No buses found</td>
              </tr>
            ) : (
              buses.map((bus) => (
                <tr key={bus.id}>
                  <td>{bus.busNumber}</td>
                  <td>{bus.busType}</td>
                  <td>{bus.totalSeats}</td>
                  <td>{bus.registrationNumber}</td>
                  <td>{bus.status}</td>
                  <td>
                    <button className="btn btn-warning" onClick={() => handleEdit(bus)}>
                      Edit
                    </button>
                    <button className="btn btn-danger" onClick={() => handleDelete(bus.id)}>
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

export default BusManagement;
