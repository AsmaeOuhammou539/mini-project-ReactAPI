import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import axios from 'axios';

function Content1({ products = [], categories }) {
  const [subCat, setSubCat] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (categories.length > 0) {
      setSubCat(categories.flatMap(cat => cat.subcategories || []));
    }
    if (token) {
      fetchFavorites();
    }
  }, [categories, token]);

  const fetchFavorites = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/favorites', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      // Extraction des IDs de produits favoris
      const favoriteIds = response.data.map(item => item.product_id || item.product?.id);
      setFavorites(favoriteIds);
    } catch (error) {
      console.error('Error fetching favorites:', {
        status: error.response?.status,
        data: error.response?.data
      });
    }
  };

  const toggleFavorite = async (productId, e) => {
    e.stopPropagation();
    
    if (!token) {
      navigate('/login');
      return;
    }

    const isFavorite = favorites.includes(productId);
    
    try {
      if (isFavorite) {
        await axios.delete(`http://localhost:8000/api/favorites/${productId}`, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        setFavorites(prev => prev.filter(id => id !== productId));
      } else {
        await axios.post(
          'http://localhost:8000/api/favorites',
          { product_id: productId },
          {
            headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        setFavorites(prev => [...prev, productId]);
      }
    } catch (error) {
      console.error('Error toggling favorite:', {
        status: error.response?.status,
        data: error.response?.data
      });
    }
  };

  return (
    <div className='container'>
      <div className="subcat">
        <div className="sub">
          <img src="https://images.ctfassets.net/xanbi6q061ft/2PbEUsB6mUYPaFr7jPsrwJ/83e70388a872f1cab9fb16c9df834d7a/20240521_hp_coop1_logo.png" alt='' className='subImg' />
          <p>Clothing & shoses</p>
        </div>
        <div className="sub">
          <img src="https://th.bing.com/th/id/OIP.W1v18AsxraLykGU1z2Za0wHaEK?w=2048&h=1152&rs=1&pid=ImgDetMain" alt='' className='subImg' />
          <p>Home & Living</p>
        </div>
        <div className="sub">
          <img src="https://img.freepik.com/premium-photo/abstract-background-with-smooth-wavy-lines-pink-blue-colors-generative-ai_804788-53816.jpg" alt='' className='subImg' />
          <p>Art & Collectibles</p>
        </div>
      </div>
      <p>Découvrez des produits variés dans différentes catégories</p>
      <div className="slider">
        <img src="https://i.pinimg.com/736x/74/24/34/7424342c64dafa61c814ee82590b9117.jpg" alt="first" style={{ '--pos': 1 }} />
        <img src="https://i.pinimg.com/474x/d5/77/87/d577876c4f108e8f715cb0824ae60a48.jpg" alt="second" style={{ '--pos': 2 }} />
        <img src="https://i.pinimg.com/736x/66/c2/3f/66c23f9566266ec63f39b2dac1a56585.jpg" alt="third" style={{ '--pos': 3 }} />
        <img src="https://i.pinimg.com/736x/76/9d/84/769d8454f78dabe81ec54e51fea6d156.jpg" alt="fourth" style={{ '--pos': 4 }} />
        <img src="https://i.pinimg.com/736x/8a/37/f5/8a37f52669d4a9d04bf723842f12eec4.jpg" alt="fifth" style={{ '--pos': 5 }} />
        <img src="https://i.pinimg.com/736x/c7/ce/17/c7ce17ab260fb40d168483fcb17837ce.jpg" alt="sixth" style={{ '--pos': 6 }} />
        <img src="https://i.pinimg.com/474x/48/73/3e/48733ea9f0dbbe44173f74cad5cc7d75.jpg" alt="first" style={{ '--pos': 7 }} />
        <img src="https://i.pinimg.com/474x/ee/37/f5/ee37f5edc878a12959678db2ddc11824.jpg" alt="second" style={{ '--pos': 8 }} />
        <img src="https://i.pinimg.com/474x/fa/c0/df/fac0dfe355dc9d1f56f62e79ebf67fc2.jpg" alt="third" style={{ '--pos': 9 }} />
        <img src="https://i.pinimg.com/474x/48/73/3e/48733ea9f0dbbe44173f74cad5cc7d75.jpg" alt="first" style={{ '--pos': 10 }} />
        <img src="https://i.pinimg.com/474x/ee/37/f5/ee37f5edc878a12959678db2ddc11824.jpg" alt="second" style={{ '--pos': 11 }} />
        <img src="https://i.pinimg.com/474x/fa/c0/df/fac0dfe355dc9d1f56f62e79ebf67fc2.jpg" alt="third" style={{ '--pos': 12 }} />
      </div>
      <div className="product-grid">
        {products.length === 0 ? (
          <p>Aucun produit trouvé</p>
        ) : (
          <div className="product-list">
            {products.map((product) => (
              <div className="product-card" key={product.id} onClick={() => navigate(`/product/${product.id}`)}>
                <div className="product-image">
                  <img 
                    src={`http://localhost:8000/storage/${product.image_url}`} 
                    alt={product.name || 'Produit'} 
                    onError={(e) => {
                      e.target.src = '/placeholder-product.jpg';
                    }}
                  />
                  <button 
                    className={`favorite-btn ${favorites.includes(product.id) ? 'active' : ''}`}
                    onClick={(e) => toggleFavorite(product.id, e)}
                    aria-label={favorites.includes(product.id) ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                  >
                    {favorites.includes(product.id) ? (
                      <FaHeart className="favorite-icon" style={{ color: 'red' }} />
                    ) : (
                      <FaRegHeart className="favorite-icon" style={{ color: 'gray' }} />
                    )}
                  </button>
                </div>
                <div className="product-info">
                  <p>{product.name || 'Nom non disponible'}</p>
                  <h3>
                    {product.price ? `${parseFloat(product.price).toFixed(2)} DH` : 'Prix non disponible'}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Content1;