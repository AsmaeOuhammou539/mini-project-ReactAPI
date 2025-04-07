import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    price: 0,
    phone_number: '',
    ville: '',
    category_id: '',
    sub_category_id: '',
    image_url: null,
    previewImage: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const categoriesRes = await axios.get('http://localhost:8000/api/categories');
        setCategories(categoriesRes.data);

        // Fetch product data
        const productRes = await axios.get(`http://localhost:8000/api/products/${id}`);
        const product = productRes.data;
        
        setProductData({
          ...product,
          previewImage: product.image_url ? `http://localhost:8000/storage/${product.image_url}` : ''
        });

        // Fetch subcategories for the product's category
        if (product.category_id) {
          const subCategoriesRes = await axios.get(
            `http://localhost:8000/api/categories/${product.category_id}/subcategories`
          );
          setSubCategories(subCategoriesRes.data);
        }

        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching data');
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCategoryChange = async (e) => {
    const categoryId = e.target.value;
    setProductData(prev => ({
      ...prev,
      category_id: categoryId,
      sub_category_id: '' // Reset subcategory when category changes
    }));

    if (categoryId) {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/categories/${categoryId}/subcategories`
        );
        setSubCategories(res.data);
      } catch (err) {
        setError('Failed to load subcategories');
      }
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProductData(prev => ({
        ...prev,
        image_url: file,
        previewImage: URL.createObjectURL(file)
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData();
    for (const key in productData) {
      if (productData[key] !== null && key !== 'previewImage') {
        formData.append(key, productData[key]);
      }
    }

    try {
      const response = await axios.post(
        `http://localhost:8000/api/products/${id}`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
            'X-HTTP-Method-Override': 'PUT' // Pour les requêtes PUT via POST
          }
        }
      );

      navigate(`/product/${id}`, { state: { message: 'Product updated successfully!' } });
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating product');
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="edit-product-container">
      <h2>Edit Product</h2>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={productData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={productData.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Price (DH)</label>
          <input
            type="number"
            name="price"
            value={productData.price}
            onChange={handleChange}
            min="0"
            step="0.01"
            required
          />
        </div>

        <div className="form-group">
          <label>Phone Number</label>
          <input
            type="tel"
            name="phone_number"
            value={productData.phone_number}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>City</label>
          <input
            type="text"
            name="ville"
            value={productData.ville}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Category</label>
          <select
            name="category_id"
            value={productData.category_id}
            onChange={handleCategoryChange}
            required
          >
            <option value="">Select a category</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Subcategory</label>
          <select
            name="sub_category_id"
            value={productData.sub_category_id}
            onChange={handleChange}
            required
            disabled={!productData.category_id}
          >
            <option value="">Select a subcategory</option>
            {subCategories.map(subCategory => (
              <option key={subCategory.id} value={subCategory.id}>
                {subCategory.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Product Image</label>
          <input
            type="file"
            name="image_url"
            onChange={handleImageChange}
            accept="image/jpeg,image/png,image/jpg,image/gif"
          />
          {productData.previewImage && (
            <div className="image-preview">
              <img 
                src={productData.previewImage} 
                alt="Preview" 
                style={{ maxWidth: '200px', marginTop: '10px' }}
              />
            </div>
          )}
        </div>

        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? 'Updating...' : 'Update Product'}
        </button>
      </form>
    </div>
  );
}

export default EditProduct;