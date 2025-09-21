import React, { useState } from 'react'
import './Sidebar.css'
import {assets} from '../../assets/assets'
import { NavLink } from 'react-router-dom'

const Sidebar = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [activeMenu, setActiveMenu] = useState('');

  const handleMouseEnter = (menuName) => {
    setIsHovered(true);
    setActiveMenu(menuName);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setActiveMenu('');
  };

  return (
    <div className='sidebar'>
      <div className="sidebar-header">
        <h3>Admin Panel</h3>
        <div className="sidebar-toggle">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
      
      <div className="sidebar-options">
        <NavLink 
          to='/add' 
          className="sidebar-option"
          onMouseEnter={() => handleMouseEnter('add')}
          onMouseLeave={handleMouseLeave}
        >
          <div className="option-icon">
            <img src={assets.add_icon} alt="Add Items" />
            {activeMenu === 'add' && <span className="tooltip">Add Items</span>}
          </div>
          <p>Add Items</p>
          <div className="highlight-bar"></div>
        </NavLink>
        
        <NavLink 
          to='/list' 
          className="sidebar-option"
          onMouseEnter={() => handleMouseEnter('list')}
          onMouseLeave={handleMouseLeave}
        >
          <div className="option-icon">
            <img src={assets.order_icon} alt="List Items" />
            {activeMenu === 'list' && <span className="tooltip">List Items</span>}
          </div>
          <p>List Items</p>
          <div className="highlight-bar"></div>
        </NavLink>
        
        <NavLink 
          to='/orders' 
          className="sidebar-option"
          onMouseEnter={() => handleMouseEnter('orders')}
          onMouseLeave={handleMouseLeave}
        >
          <div className="option-icon">
            <img src={assets.order_icon} alt="Orders" />
            {activeMenu === 'orders' && <span className="tooltip">Orders</span>}
          </div>
          <p>Orders</p>
          <div className="highlight-bar"></div>
        </NavLink>
      </div>
      
      <div className="sidebar-footer">
        <div className="user-profile">
          <img src={assets.profile_image} alt="User" />
          <div className="user-info">
            <p>Admin User</p>
            <span>Administrator</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar