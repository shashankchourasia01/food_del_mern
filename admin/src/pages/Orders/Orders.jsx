import React, { useState, useEffect } from 'react';
import './Orders.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { assets } from '../../assets/assets';

const Orders = ({ url = import.meta.env.VITE_BACKEND_URL }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [expandedOrder, setExpandedOrder] = useState(null);

  const fetchAllOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${url}/api/order/list`);
      if (response.data.success) {
        setOrders(response.data.data);
      } else {
        toast.error('Error fetching orders');
      }
    } catch (error) {
      toast.error('Failed to fetch orders');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(`${url}/api/order/status`, {
        orderId,
        status: event.target.value,
      });
      if (response.data.success) {
        await fetchAllOrders();
        toast.success('Order status updated successfully');
      } else {
        toast.error('Error updating status');
      }
    } catch (error) {
      toast.error('Failed to update status');
      console.error(error);
    }
  };

  const toggleOrderExpand = (orderId) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
    } else {
      setExpandedOrder(orderId);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Food-Processing':
        return '#ff9800';
      case 'Out For Delivery':
        return '#2196f3';
      case 'Delivered':
        return '#4caf50';
      default:
        return '#9e9e9e';
    }
  };

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(order => order.status === filter);

  useEffect(() => {
    fetchAllOrders();
  }, []);

  return (
    <div className="orders-container">
      <div className="orders-header">
        <div className="header-content">
          <h2>Order Management</h2>
          <p>Manage and track customer orders</p>
        </div>
        <div className="orders-stats">
          <div className="stat-card">
            <span className="stat-number">{orders.length}</span>
            <span className="stat-label">Total Orders</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">
              {orders.filter(order => order.status === 'Delivered').length}
            </span>
            <span className="stat-label">Completed</span>
          </div>
        </div>
      </div>

      <div className="orders-controls">
        <div className="filter-tabs">
          <button 
            className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All Orders
          </button>
          <button 
            className={`filter-tab ${filter === 'Food-Processing' ? 'active' : ''}`}
            onClick={() => setFilter('Food-Processing')}
          >
            Processing
          </button>
          <button 
            className={`filter-tab ${filter === 'Out For Delivery' ? 'active' : ''}`}
            onClick={() => setFilter('Out For Delivery')}
          >
            Out for Delivery
          </button>
          <button 
            className={`filter-tab ${filter === 'Delivered' ? 'active' : ''}`}
            onClick={() => setFilter('Delivered')}
          >
            Delivered
          </button>
        </div>
        
        <button className="refresh-btn" onClick={fetchAllOrders}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M23 4V10H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M1 20V14H7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M3.51 9C4.01717 7.56678 4.87913 6.2854 6.01547 5.27542C7.1518 4.26543 8.52547 3.55976 10.0083 3.22426C11.4911 2.88875 13.0348 2.93434 14.4952 3.35677C15.9556 3.77921 17.2853 4.56471 18.36 5.64L23 10M1 14L5.64 18.36C6.71475 19.4353 8.04437 20.2208 9.50481 20.6432C10.9652 21.0657 12.5089 21.1112 13.9917 20.7757C15.4745 20.4402 16.8482 19.7346 17.9845 18.7246C19.1209 17.7146 19.9828 16.4332 20.49 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading orders...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="empty-state">
          <img src="/images/empty-orders.svg" alt="No orders" className="empty-image" />
          <h3>No Orders Found</h3>
          <p>{filter === 'all' ? 'You haven\'t received any orders yet.' : `No orders with status: ${filter}`}</p>
        </div>
      ) : (
        <div className="orders-list">
          {filteredOrders.map((order, index) => (
            <div key={order._id} className="order-card">
              <div className="order-header" onClick={() => toggleOrderExpand(order._id)}>
                <div className="order-info">
                  <div className="order-icon">
                    <img src={assets.parcel_icon} alt="Parcel Icon" />
                    <div 
                      className="status-indicator" 
                      style={{backgroundColor: getStatusColor(order.status)}}
                    ></div>
                  </div>
                  <div className="order-details">
                    <h4>Order #{order._id.slice(-6).toUpperCase()}</h4>
                    <p className="customer-name">
                      {`${order.address.firstName} ${order.address.lastName}`}
                    </p>
                    <p className="order-date">
                      {new Date(order.createdAt || Date.now()).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="order-actions">
                  <span className="order-amount">${order.amount}</span>
                  <svg 
                    className={`expand-icon ${expandedOrder === order._id ? 'expanded' : ''}`}
                    width="20" 
                    height="20" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>

              {expandedOrder === order._id && (
                <div className="order-expanded">
                  <div className="order-items">
                    <h5>Order Items ({order.items.length})</h5>
                    <div className="items-list">
                      {order.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="order-item">
                          <span className="item-name">{item.name}</span>
                          <span className="item-quantity">x{item.quantity}</span>
                          <span className="item-price">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="order-address">
                    <h5>Delivery Address</h5>
                    <p>{order.address.street}</p>
                    <p>{`${order.address.city}, ${order.address.state}, ${order.address.country}`}</p>
                    <p>Postal Code: {order.address.pincode}</p>
                    <p className="phone-number">📞 {order.address.phone}</p>
                  </div>

                  <div className="status-control">
                    <label>Update Status:</label>
                    <select
                      onChange={(event) => statusHandler(event, order._id)}
                      value={order.status || 'Food-Processing'}
                      style={{borderLeftColor: getStatusColor(order.status)}}
                    >
                      <option value="Food-Processing">Food Processing</option>
                      <option value="Out For Delivery">Out For Delivery</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;