import React, { useEffect, useState } from 'react'
import './List.css'
import axios from 'axios'
import { toast } from 'react-toastify'

const List = ({url = import.meta.env.VITE_BACKEND_URL}) => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const fetchList = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${url}/api/food/list`);
      
      if (response.data.success) {
        setList(response.data.data)
      } else {
        toast.error("Error fetching data")
      }
    } catch (error) {
      toast.error("Failed to fetch food items")
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const removeFood = async(foodId) => {
    try {
      const response = await axios.post(`${url}/api/food/remove`, {id: foodId})
      
      if (response.data.success) {
        toast.success(response.data.message)
        setList(list.filter(item => item._id !== foodId));
        setConfirmDelete(null);
      } else {
        toast.error("Error deleting item");
      }
    } catch (error) {
      toast.error("Failed to delete item");
      console.error(error);
    }
  }

  const handleDeleteClick = (foodId, foodName) => {
    setConfirmDelete({id: foodId, name: foodName});
  }

  const cancelDelete = () => {
    setConfirmDelete(null);
  }

  useEffect(() => {
    fetchList();
  }, [])

  return (
    <div className='list-container'>
      <div className="list-header">
        <h2>All Foods List</h2>
        <p>Manage your menu items</p>
        <div className="list-stats">
          <span className="stat-item">Total Items: <b>{list.length}</b></span>
          <span className="stat-item">Categories: <b>{new Set(list.map(item => item.category)).size}</b></span>
        </div>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading food items...</p>
        </div>
      ) : list.length === 0 ? (
        <div className="empty-state">
          <img src="/images/empty-state.svg" alt="No items" className="empty-image" />
          <h3>No Food Items Yet</h3>
          <p>Get started by adding your first menu item</p>
        </div>
      ) : (
        <div className="list-table-container">
          <div className="list-table">
            <div className="list-table-header">
              <div className="list-table-cell">Image</div>
              <div className="list-table-cell">Name</div>
              <div className="list-table-cell">Category</div>
              <div className="list-table-cell">Price</div>
              <div className="list-table-cell">Actions</div>
            </div>
            
            {list.map((item, index) => (
              <div key={item._id} className={`list-table-row ${index % 2 === 0 ? 'even' : 'odd'}`}>
                <div className="list-table-cell">
                  <img src={`${url}/images/` + item.image} alt={item.name} className="food-image" />
                </div>
                <div className="list-table-cell">
                  <p className="food-name">{item.name}</p>
                </div>
                <div className="list-table-cell">
                  <span className="category-tag">{item.category}</span>
                </div>
                <div className="list-table-cell">
                  <p className="food-price">${item.price}</p>
                </div>
                <div className="list-table-cell">
                  {confirmDelete?.id === item._id ? (
                    <div className="confirm-delete">
                      <span>Delete?</span>
                      <button 
                        className="confirm-btn" 
                        onClick={() => removeFood(item._id)}
                      >
                        ✓
                      </button>
                      <button 
                        className="cancel-btn" 
                        onClick={cancelDelete}
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div className="action-buttons">
                      <button className="edit-btn">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M18.5 2.5C18.8978 2.10217 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10217 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10217 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                      <button 
                        className="delete-btn"
                        onClick={() => handleDeleteClick(item._id, item.name)}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M10 11V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M14 11V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default List