import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const modules = [
    {
      path: '/buses',
      icon: '🚍',
      title: 'Bus Management',
      description: 'Manage bus fleet, types, and availability'
    },
    {
      path: '/routes',
      icon: '🗺',
      title: 'Route Management',
      description: 'Define and manage bus routes with stops'
    },
    {
      path: '/schedules',
      icon: '⏰',
      title: 'Schedule Management',
      description: 'Create and manage bus schedules'
    },
    {
      path: '/timetables',
      icon: '📅',
      title: 'Timetable Management',
      description: 'View and manage daily timetables'
    },
    {
      path: '/admin',
      icon: '🛠',
      title: 'Admin Module',
      description: 'Dashboard and system settings'
    },
    {
      path: '/users',
      icon: '👤',
      title: 'User Module',
      description: 'Manage users and view bus details'
    }
  ];

  return (
    <div className="glass-card">
      <div className="module-header">
        <span className="module-icon">🏠</span>
        <h2>Welcome to Bus Transport System</h2>
      </div>
      <p style={{ marginBottom: '20px', fontSize: '18px' }}>
        Smart Transport Management for Modern Cities
      </p>
      <div className="modules-grid">
        {modules.map((module, index) => (
          <Link to={module.path} key={index} className="module-card">
            <div className="module-icon">{module.icon}</div>
            <h3>{module.title}</h3>
            <p>{module.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;
