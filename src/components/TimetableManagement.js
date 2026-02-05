import React, { useState, useEffect } from 'react';
import { timetableAPI, scheduleAPI } from '../services/api';

const TimetableManagement = () => {
  const [timetables, setTimetables] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentTimetable, setCurrentTimetable] = useState({
    schedule: { id: '' },
    date: '',
    scheduledDeparture: '',
    scheduledArrival: '',
    actualDeparture: '',
    actualArrival: '',
    status: 'On Time',
    remarks: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [timetablesRes, schedulesRes] = await Promise.all([
        timetableAPI.getAll(),
        scheduleAPI.getAll()
      ]);
      setTimetables(timetablesRes.data);
      setSchedules(schedulesRes.data);
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
        await timetableAPI.update(currentTimetable.id, currentTimetable);
        setSuccess('Timetable updated successfully!');
      } else {
        await timetableAPI.create(currentTimetable);
        setSuccess('Timetable created successfully!');
      }
      resetForm();
      fetchData();
    } catch (err) {
      setError('Failed to save timetable');
      console.error(err);
    }
  };

  const handleEdit = (timetable) => {
    setCurrentTimetable(timetable);
    setEditMode(true);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this timetable?')) {
      try {
        await timetableAPI.delete(id);
        setSuccess('Timetable deleted successfully!');
        fetchData();
      } catch (err) {
        setError('Failed to delete timetable');
        console.error(err);
      }
    }
  };

  const resetForm = () => {
    setCurrentTimetable({
      schedule: { id: '' },
      date: '',
      scheduledDeparture: '',
      scheduledArrival: '',
      actualDeparture: '',
      actualArrival: '',
      status: 'On Time',
      remarks: ''
    });
    setEditMode(false);
    setShowForm(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'scheduleId') {
      setCurrentTimetable({ ...currentTimetable, schedule: { id: value } });
    } else {
      setCurrentTimetable({ ...currentTimetable, [name]: value });
    }
  };

  return (
    <div className="glass-card">
      <div className="module-header">
        <span className="module-icon">📅</span>
        <h2>Timetable Management Module</h2>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
        {showForm ? 'Cancel' : 'Add New Timetable Entry'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
          <div className="form-group">
            <label>Schedule *</label>
            <select
              name="scheduleId"
              value={currentTimetable.schedule.id}
              onChange={handleChange}
              required
            >
              <option value="">Select Schedule</option>
              {schedules.map((schedule) => (
                <option key={schedule.id} value={schedule.id}>
                  {schedule.bus?.busNumber} - {schedule.route?.routeNumber} ({schedule.departureTime})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Date *</label>
            <input
              type="date"
              name="date"
              value={currentTimetable.date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Scheduled Departure *</label>
            <input
              type="time"
              name="scheduledDeparture"
              value={currentTimetable.scheduledDeparture}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Scheduled Arrival *</label>
            <input
              type="time"
              name="scheduledArrival"
              value={currentTimetable.scheduledArrival}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Actual Departure</label>
            <input
              type="time"
              name="actualDeparture"
              value={currentTimetable.actualDeparture}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Actual Arrival</label>
            <input
              type="time"
              name="actualArrival"
              value={currentTimetable.actualArrival}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Status *</label>
            <select name="status" value={currentTimetable.status} onChange={handleChange} required>
              <option value="On Time">On Time</option>
              <option value="Delayed">Delayed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div className="form-group">
            <label>Remarks</label>
            <textarea
              name="remarks"
              value={currentTimetable.remarks}
              onChange={handleChange}
              placeholder="Any additional notes..."
              rows="3"
            />
          </div>

          <button type="submit" className="btn btn-primary">
            {editMode ? 'Update Timetable' : 'Create Timetable'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={resetForm}>
            Cancel
          </button>
        </form>
      )}

      {loading ? (
        <div className="loading">Loading timetables...</div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Bus</th>
              <th>Route</th>
              <th>Scheduled Dep</th>
              <th>Actual Dep</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {timetables.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center' }}>No timetables found</td>
              </tr>
            ) : (
              timetables.map((timetable) => (
                <tr key={timetable.id}>
                  <td>{timetable.date}</td>
                  <td>{timetable.schedule?.bus?.busNumber}</td>
                  <td>{timetable.schedule?.route?.routeNumber}</td>
                  <td>{timetable.scheduledDeparture}</td>
                  <td>{timetable.actualDeparture || '-'}</td>
                  <td>{timetable.status}</td>
                  <td>
                    <button className="btn btn-warning" onClick={() => handleEdit(timetable)}>
                      Edit
                    </button>
                    <button className="btn btn-danger" onClick={() => handleDelete(timetable.id)}>
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

export default TimetableManagement;
