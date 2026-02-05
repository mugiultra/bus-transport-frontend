import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <div className="navbar">
      <h1>🚍 Bus Transport Management System</h1>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/buses">Buses</Link>
        <Link to="/routes">Routes</Link>
        <Link to="/schedules">Schedules</Link>
        <Link to="/timetables">Timetables</Link>
        <Link to="/admin">Admin</Link>
        <Link to="/users">Users</Link>
      </div>
    </div>
  );
};

export default Navbar;
