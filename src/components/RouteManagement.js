import React, { useState, useEffect } from 'react';
import { routeAPI } from '../services/api';

const RouteManagement = () => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentRoute, setCurrentRoute] = useState({
    routeNumber: '',
    source: '',
    destination: '',
    distance: '',
    estimatedDuration: '',
    stops: '',
    status: 'Active'
  });

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      setLoading(true);
      const response = await routeAPI.getAll();
      setRoutes(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch routes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await routeAPI.update(currentRoute.id, currentRoute);
        setSuccess('Route updated successfully!');
      } else {
        await routeAPI.create(currentRoute);
        setSuccess('Route created successfully!');
      }
      resetForm();
      fetchRoutes();
    } catch (err) {
      setError('Failed to save route');
      console.error(err);
    }
  };

  const handleEdit = (route) => {
    setCurrentRoute(route);
    setEditMode(true);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this route?')) {
      try {
        await routeAPI.delete(id);
        setSuccess('Route deleted successfully!');
        fetchRoutes();
      } catch (err) {
        setError('Failed to delete route');
        console.error(err);
      }
    }
  };

  const resetForm = () => {
    setCurrentRoute({
      routeNumber: '',
      source: '',
      destination: '',
      distance: '',
      estimatedDuration: '',
      stops: '',
      status: 'Active'
    });
    setEditMode(false);
    setShowForm(false);
  };

  const handleChange = (e) => {
    setCurrentRoute({
      ...currentRoute,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="glass-card">
      <div className="module-header">
        <span className="module-icon">🗺</span>
        <h2>Route Management Module</h2>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
        {showForm ? 'Cancel' : 'Add New Route'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
          <div className="form-group">
            <label>Route Number *</label>
            <input
              type="text"
              name="routeNumber"
              value={currentRoute.routeNumber}
              onChange={handleChange}
              required
              placeholder="e.g., R-101"
            />
          </div>

          <div className="form-group">
            <label>Source *</label>
            <input
              type="text"
              name="source"
              value={currentRoute.source}
              onChange={handleChange}
              required
              placeholder="e.g., Central Station"
            />
          </div>

          <div className="form-group">
            <label>Destination *</label>
            <input
              type="text"
              name="destination"
              value={currentRoute.destination}
              onChange={handleChange}
              required
              placeholder="e.g., Airport"
            />
          </div>

          <div className="form-group">
            <label>Distance (km) *</label>
            <input
              type="number"
              step="0.1"
              name="distance"
              value={currentRoute.distance}
              onChange={handleChange}
              required
              placeholder="e.g., 25.5"
            />
          </div>

          <div className="form-group">
            <label>Estimated Duration (minutes) *</label>
            <input
              type="number"
              name="estimatedDuration"
              value={currentRoute.estimatedDuration}
              onChange={handleChange}
              required
              placeholder="e.g., 45"
            />
          </div>

          <div className="form-group">
            <label>Stops (comma-separated)</label>
            <textarea
              name="stops"
              value={currentRoute.stops}
              onChange={handleChange}
              placeholder="e.g., Station A, Station B, Station C"
              rows="3"
            />
          </div>

          <div className="form-group">
            <label>Status *</label>
            <select name="status" value={currentRoute.status} onChange={handleChange} required>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary">
            {editMode ? 'Update Route' : 'Create Route'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={resetForm}>
            Cancel
          </button>
        </form>
      )}

      {loading ? (
        <div className="loading">Loading routes...</div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Route Number</th>
              <th>Source</th>
              <th>Destination</th>
              <th>Distance (km)</th>
              <th>Duration (min)</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {routes.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center' }}>No routes found</td>
              </tr>
            ) : (
              routes.map((route) => (
                <tr key={route.id}>
                  <td>{route.routeNumber}</td>
                  <td>{route.source}</td>
                  <td>{route.destination}</td>
                  <td>{route.distance}</td>
                  <td>{route.estimatedDuration}</td>
                  <td>{route.status}</td>
                  <td>
                    <button className="btn btn-warning" onClick={() => handleEdit(route)}>
                      Edit
                    </button>
                    <button className="btn btn-danger" onClick={() => handleDelete(route.id)}>
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

export default RouteManagement;
