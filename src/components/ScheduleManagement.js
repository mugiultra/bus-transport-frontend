import React, { useState, useEffect } from 'react';
import { scheduleAPI, busAPI, routeAPI } from '../services/api';

const ScheduleManagement = () => {
  const [schedules, setSchedules] = useState([]);
  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentSchedule, setCurrentSchedule] = useState({
    bus: { id: '' },
    route: { id: '' },
    departureTime: '',
    arrivalTime: '',
    frequency: 'Daily',
    status: 'Active'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [schedulesRes, busesRes, routesRes] = await Promise.all([
        scheduleAPI.getAll(),
        busAPI.getAll(),
        routeAPI.getAll()
      ]);
      setSchedules(schedulesRes.data);
      setBuses(busesRes.data);
      setRoutes(routesRes.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await scheduleAPI.update(currentSchedule.id, currentSchedule);
        setSuccess('Schedule updated successfully!');
      } else {
        await scheduleAPI.create(currentSchedule);
        setSuccess('Schedule created successfully!');
      }
      resetForm();
      fetchData();
    } catch (err) {
      setError('Failed to save schedule');
      console.error(err);
    }
  };

  const handleEdit = (schedule) => {
    setCurrentSchedule(schedule);
    setEditMode(true);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this schedule?')) {
      try {
        await scheduleAPI.delete(id);
        setSuccess('Schedule deleted successfully!');
        fetchData();
      } catch (err) {
        setError('Failed to delete schedule');
        console.error(err);
      }
    }
  };

  const resetForm = () => {
    setCurrentSchedule({
      bus: { id: '' },
      route: { id: '' },
      departureTime: '',
      arrivalTime: '',
      frequency: 'Daily',
      status: 'Active'
    });
    setEditMode(false);
    setShowForm(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'busId') {
      setCurrentSchedule({ ...currentSchedule, bus: { id: value } });
    } else if (name === 'routeId') {
      setCurrentSchedule({ ...currentSchedule, route: { id: value } });
    } else {
      setCurrentSchedule({ ...currentSchedule, [name]: value });
    }
  };

  return (
    <div className="glass-card">
      <div className="module-header">
        <span className="module-icon">⏰</span>
        <h2>Schedule Management Module</h2>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
        {showForm ? 'Cancel' : 'Add New Schedule'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
          <div className="form-group">
            <label>Bus *</label>
            <select
              name="busId"
              value={currentSchedule.bus.id}
              onChange={handleChange}
              required
            >
              <option value="">Select Bus</option>
              {buses.map((bus) => (
                <option key={bus.id} value={bus.id}>
                  {bus.busNumber} - {bus.busType}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Route *</label>
            <select
              name="routeId"
              value={currentSchedule.route.id}
              onChange={handleChange}
              required
            >
              <option value="">Select Route</option>
              {routes.map((route) => (
                <option key={route.id} value={route.id}>
                  {route.routeNumber} - {route.source} to {route.destination}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Departure Time *</label>
            <input
              type="time"
              name="departureTime"
              value={currentSchedule.departureTime}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Arrival Time *</label>
            <input
              type="time"
              name="arrivalTime"
              value={currentSchedule.arrivalTime}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Frequency *</label>
            <select name="frequency" value={currentSchedule.frequency} onChange={handleChange} required>
              <option value="Daily">Daily</option>
              <option value="Weekdays">Weekdays</option>
              <option value="Weekends">Weekends</option>
            </select>
          </div>

          <div className="form-group">
            <label>Status *</label>
            <select name="status" value={currentSchedule.status} onChange={handleChange} required>
              <option value="Active">Active</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Delayed">Delayed</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary">
            {editMode ? 'Update Schedule' : 'Create Schedule'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={resetForm}>
            Cancel
          </button>
        </form>
      )}

      {loading ? (
        <div className="loading">Loading schedules...</div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Bus</th>
              <th>Route</th>
              <th>Departure</th>
              <th>Arrival</th>
              <th>Frequency</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {schedules.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center' }}>No schedules found</td>
              </tr>
            ) : (
              schedules.map((schedule) => (
                <tr key={schedule.id}>
                  <td>{schedule.bus?.busNumber}</td>
                  <td>{schedule.route?.routeNumber}</td>
                  <td>{schedule.departureTime}</td>
                  <td>{schedule.arrivalTime}</td>
                  <td>{schedule.frequency}</td>
                  <td>{schedule.status}</td>
                  <td>
                    <button className="btn btn-warning" onClick={() => handleEdit(schedule)}>
                      Edit
                    </button>
                    <button className="btn btn-danger" onClick={() => handleDelete(schedule.id)}>
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

export default ScheduleManagement;
