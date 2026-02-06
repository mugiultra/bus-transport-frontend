import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import AnimatedBackground from './components/AnimatedBackground';
import Navbar from './components/Navbar';
import Home from './components/Home';
import BusManagement from './components/BusManagement';
import RouteManagement from './components/RouteManagement';
import ScheduleManagement from './components/ScheduleManagement';
import TimetableManagement from './components/TimetableManagement';
import AdminModule from './components/AdminModule';
import UserModule from './components/UserModule';

 function App() {
  return (
    <Router>
      <div className="App">
        <AnimatedBackground />
        <div className="content-container">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/buses" element={<BusManagement />} />
            <Route path="/routes" element={<RouteManagement />} />
            <Route path="/schedules" element={<ScheduleManagement />} />
            <Route path="/timetables" element={<TimetableManagement />} />
            <Route path="/admin" element={<AdminModule />} />
            <Route path="/users" element={<UserModule />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
