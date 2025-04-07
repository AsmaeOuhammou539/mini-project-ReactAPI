import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
    } else {
      fetchFavorites();
    }
  }, [token]);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('http://localhost:8000/api/favorites', {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const formattedFavorites = data.map(item => ({
        id: item.id || item.pivot?.id,
        product_id: item.product_id || item.id,
        product: {
          id: item.product?.id || item.id,
          name: item.product?.name || item.name,
          price: item.product?.price || item.price,
          image_url: item.product?.image_url || item.image_url
        }
      }));
      
      setFavorites(formattedFavorites);
    } catch (error) {
      console.error('Error fetching favorites:', {
        status: error.response?.status,
        data: error.response?.data
      });
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (productId, e) => {
    e.stopPropagation();
    try {
      await axios.delete(`http://localhost:8000/api/favorites/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setFavorites(prev => prev.filter(fav => fav.product_id !== productId));
    } catch (error) {
      console.error('Error removing favorite:', {
        status: error.response?.status,
        data: error.response?.data
      });
    }
  };

  // Style pour le cercle
  const circleStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    border: '3px solid #8b9e70',
    margin: '2rem auto',
    color: '#8b9e70',
    fontSize: '1.2rem',
    fontWeight: 'bold'
  };

  if (loading) {
    return (
      <div className="favorites-page">
        <h2>Mes produits favoris</h2>
        <div style={circleStyle}>
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="favorites-page">
       
      <h2>Mes produits favoris</h2>
      {favorites.length === 0 ? (
        <div style={circleStyle}>
          <span>Vide</span>
        </div>
      ) : (
        <div className="product-list" style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: '1.5rem',
          marginTop: '1rem'
        }}>
          {favorites.map((fav) => (
            <div 
              className="product-card" 
              key={fav.id}
              style={{
                background: 'white',
                borderRadius: '8px',
                overflow: 'hidden',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onClick={() => navigate(`/product/${fav.product_id}`)}
            >
              <div className="product-image" style={{ 
                height: '200px',
                overflow: 'hidden',
                position: 'relative'
              }}>
                <img 
                  src={`http://localhost:8000/storage/${fav.product.image_url}`} 
                  alt={fav.product.name || 'Produit'} 
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.5s ease'
                  }}
                  onError={(e) => {
                    e.target.src = '/placeholder-product.jpg';
                  }}
                />
                <button 
                  className="favorite-btn"
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: 'rgba(255, 255, 255, 0.7)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '30px',
                    height: '30px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    zIndex: 10
                  }}
                  onClick={(e) => removeFavorite(fav.product_id, e)}
                  aria-label="Retirer des favoris"
                >
                  <FaHeart className="favorite-icon" style={{ color: 'red' }} />
                </button>
              </div>
              <div className="product-info" style={{ padding: '1.2rem' }}>
                <p style={{
                  margin: '0 0 0.5rem',
                  fontSize: '1rem',
                  fontWeight: 500,
                  color: '#333',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {fav.product.name || 'Nom non disponible'}
                </p>
                <h3 style={{ 
                  margin: 0,
                  color: '#8b9e70',
                  fontSize: '1.2rem'
                }}>
                  {fav.product.price ? `${parseFloat(fav.product.price).toFixed(2)} DH` : 'Prix non disponible'}
                </h3>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Favorites;