import React, { useState } from 'react'
import './Add.css'
import {assets} from '../../assets/assets'
import axios from 'axios'
import { toast } from 'react-toastify'

const Add = ({ url = import.meta.env.VITE_BACKEND_URL }) => {
  const [image,setImage] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const [data,setData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Salad"
  })

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data =>({...data,[name]:value}))
  }

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setIsUploading(true);
    
    const formData = new FormData();
    formData.append("name",data.name)
    formData.append("description",data.description)
    formData.append("price",Number(data.price))
    formData.append("category",data.category)
    formData.append("image",image)

    try {
      const response = await axios.post(`${url}/api/food/add`,formData);
      if (response.data.success) {
        setData({
          name: "",
          description: "",
          price: "",
          category: "Salad"
        })
        setImage(false)
        toast.success(response.data.message)
      } else {
        toast.error(response.data.message)
      }
    } catch (err) {
      toast.error('Failed to add food')
      console.error(err)
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className='add'>
      <div className="add-header">
        <h2>Add New Product</h2>
        <p>Fill in the details below to add a new menu item</p>
      </div>
      
      <form className='flex-col' onSubmit={onSubmitHandler}>
        <div className="add-image-upload flex-col">
          <p>Upload Image</p>
          <label htmlFor="image" className="image-upload-container">
            <div className="image-preview">
              <img src={image ? URL.createObjectURL(image) : assets.upload_area} alt="" />
              <div className="upload-overlay">
                <img src={assets.upload_icon} alt="Upload" className="upload-icon" />
                <span>{image ? "Change Image" : "Click to Upload"}</span>
              </div>
            </div>
            {image && <div className="file-name">{image.name}</div>}
          </label>
          <input onChange={(e)=> setImage(e.target.files[0])} type="file" id='image' hidden required />
        </div>
        
        <div className="form-row">
          <div className="add-product-name flex-col">
            <label htmlFor="name">Product Name</label>
            <input 
              onChange={onChangeHandler} 
              value={data.name} 
              type="text" 
              name='name' 
              id="name"
              placeholder='Type product name here' 
            />
          </div>
          
          <div className="add-category flex-col">
            <label htmlFor="category">Product Category</label>
            <select onChange={onChangeHandler} name="category" id="category" value={data.category}>
              <option value="Salad">Salad</option>
              <option value="Rolls">Rolls</option>
              <option value="Deserts">Deserts</option>
              <option value="Sandwich">Sandwich</option>
              <option value="Cake">Cake</option>
              <option value="Pure Veg">Pure Veg</option>
              <option value="Pasta">Pasta</option>
              <option value="Noodles">Noodles</option>
            </select>
          </div>
        </div>
        
        <div className="add-product-description flex-col">
          <label htmlFor="description">Product Description</label>
          <textarea  
            onChange={onChangeHandler} 
            value={data.description} 
            name="description" 
            id="description"
            rows="6" 
            placeholder='Write product description here' 
            required
          ></textarea>
          <div className="char-count">{data.description.length}/500 characters</div>
        </div>
        
        <div className="form-row">
          <div className="add-price flex-col">
            <label htmlFor="price">Product Price ($)</label>
            <div className="price-input-container">
              <span className="currency-symbol">$</span>
              <input  
                onChange={onChangeHandler} 
                value={data.price} 
                type="number" 
                name='price' 
                id="price"
                placeholder='20.00' 
                min="0"
                step="0.01"
              />
            </div>
          </div>
          
          <div className="add-submit">
            <button 
              type='submit' 
              className={`add-button ${isUploading ? 'loading' : ''}`}
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <div className="spinner"></div>
                  Adding Item...
                </>
              ) : (
                'Add Product'
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default Add