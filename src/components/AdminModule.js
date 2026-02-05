import React, { useState, useEffect } from 'react';
import { busAPI, routeAPI, scheduleAPI, userAPI } from '../services/api';

const AdminModule = () => {
  const [stats, setStats] = useState({
    totalBuses: 0,
    totalRoutes: 0,
    totalSchedules: 0,
    totalUsers: 0,
    activeBuses: 0,
    activeRoutes: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const [busesRes, routesRes, schedulesRes, usersRes] = await Promise.all([
        busAPI.getAll(),
        routeAPI.getAll(),
        scheduleAPI.getAll(),
        userAPI.getAll()
      ]);

      const buses = busesRes.data;
      const routes = routesRes.data;

      setStats({
        totalBuses: buses.length,
        totalRoutes: routes.length,
        totalSchedules: schedulesRes.data.length,
        totalUsers: usersRes.data.length,
        activeBuses: buses.filter(b => b.status === 'Active').length,
        activeRoutes: routes.filter(r => r.status === 'Active').length
      });
    } catch (err) {
      console.error('Failed to fetch stats', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card">
      <div className="module-header">
        <span className="module-icon">🛠</span>
        <h2>Admin Dashboard</h2>
      </div>

      {loading ? (
        <div className="loading">Loading statistics...</div>
      ) : (
        <div className="modules-grid">
          <div className="glass-card" style={{ textAlign: 'center' }}>
            <div className="module-icon">🚍</div>
            <h3>Total Buses</h3>
            <p style={{ fontSize: '32px', fontWeight: 'bold' }}>{stats.totalBuses}</p>
            <p>Active: {stats.activeBuses}</p>
          </div>

          <div className="glass-card" style={{ textAlign: 'center' }}>
            <div className="module-icon">🗺</div>
            <h3>Total Routes</h3>
            <p style={{ fontSize: '32px', fontWeight: 'bold' }}>{stats.totalRoutes}</p>
            <p>Active: {stats.activeRoutes}</p>
          </div>

          <div className="glass-card" style={{ textAlign: 'center' }}>
            <div className="module-icon">⏰</div>
            <h3>Total Schedules</h3>
            <p style={{ fontSize: '32px', fontWeight: 'bold' }}>{stats.totalSchedules}</p>
          </div>

          <div className="glass-card" style={{ textAlign: 'center' }}>
            <div className="module-icon">👥</div>
            <h3>Total Users</h3>
            <p style={{ fontSize: '32px', fontWeight: 'bold' }}>{stats.totalUsers}</p>
          </div>
        </div>
      )}

      <div style={{ marginTop: '30px' }}>
        <h3 style={{ marginBottom: '20px' }}>System Settings</h3>
        <div style={{ display: 'grid', gap: '15px' }}>
          <button className="btn btn-primary">Configure System</button>
          <button className="btn btn-secondary">View Reports</button>
          <button className="btn btn-warning" onClick={fetchStats}>Refresh Statistics</button>
        </div>
      </div>
    </div>
  );
};

export default AdminModule;
