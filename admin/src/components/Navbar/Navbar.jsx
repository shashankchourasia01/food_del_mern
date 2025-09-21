import React, { useState } from 'react';
import './Navbar.css';
import { assets } from '../../assets/assets';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(true);

  return (
    <div className='navbar'>
      <div className="navbar-left">
        <img className='logo' src={assets.logo} alt="Logo" />
        <button className="menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
      
      <div className={`navbar-center ${isMenuOpen ? 'active' : ''}`}>
        <div className="search-box">
          <input type="text" placeholder="Search..." />
          <img src={assets.search_icon} alt="Search" className="search-icon" />
        </div>
        <nav className="nav-links">
          <a href="#dashboard" className="nav-link">Dashboard</a>
          <a href="#analytics" className="nav-link">Analytics</a>
          <a href="#users" className="nav-link">Users</a>
          <a href="#settings" className="nav-link">Settings</a>
        </nav>
      </div>
      
      <div className="navbar-right">
        <div className="notifications">
          <div className="notification-icon">
            <img src={assets.bell_icon} alt="Notifications" />
            {showNotification && <span className="notification-badge"></span>}
          </div>
        </div>
        <div className="profile-container">
          <img className='profile' src={assets.sha} alt="Profile" />
          <div className="profile-dropdown">
            <span>Admin User</span>
            <img src={assets.dropdown_icon} alt="Dropdown" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Navbar