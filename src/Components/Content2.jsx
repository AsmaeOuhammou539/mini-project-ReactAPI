import axios from "axios";
import React, { useEffect, useState } from "react";
import "../Sass/main.css";
import { useNavigate } from "react-router-dom";
import { FaHeart, FaRegHeart } from 'react-icons/fa';

function Content2({ activeIndex }) {
  const [subCategoriesWithProducts, setSubCategoriesWithProducts] = useState([]);
const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const fetchProducts = async () => {
    try {
      const url = `http://localhost:8000/api/categories/${activeIndex}/SubcategorieProducts`;
      const resp = await axios.get(url, {
        headers: {
          "Cache-Control": "no-cache",
        },
      });
      console.log("Données reçues depuis l'API :", resp.data);

      console.log(
        "Sous-catégories et produits reçus pour la catégorie:",
        activeIndex,
        resp.data
      );

      // Vérification et mise à jour des sous-catégories avec leurs produits
      if (resp.data.subcategories) {
        setSubCategoriesWithProducts(resp.data.subcategories);
      } else {
        console.error("Structure inattendue des données", resp.data);
        setSubCategoriesWithProducts([]);
      }
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des sous-catégories et produits :",
        error
      );
      setSubCategoriesWithProducts([]);
    }
  };

  useEffect(() => {
    console.log("Catégorie active changée:", activeIndex);
    fetchProducts();
    if (token) {
        fetchFavorites();
    }   
}, [activeIndex,token]);
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
    <div className="product-grid">
      {subCategoriesWithProducts.length === 0 ? (
        <p>Aucune sous-catégorie ou produit disponible pour cette catégorie.</p>
      ) : (
        subCategoriesWithProducts.map((subCategory) => (
          <div key={subCategory.id} className="subcategory-section">
            <p className="subCat">{subCategory.name}</p>
            {subCategory.products.length === 0 ? (
              <p>Aucun produit disponible pour cette sous-catégorie.</p>
            ) : (
              <div className="product-list">
                {subCategory.products.map((product) => (
                  <div
                    className="product-card"
                    key={product.id}
                    onClick={() => navigate(`/product/${product.id}`)}
                    style={{ cursor: "pointer" }} // Ajout du curseur pour indiquer qu'il est cliquable
                  >
                    <div className="product-image">
                      <img
                        src={`http://localhost:8000/storage/${product.image_url}`}
                        alt={product.name || "Produit"}
                      />
                    </div>
                    <button
                      className={`favorite-btn ${
                        favorites.includes(product.id) ? "active" : ""
                      }`}
                      onClick={(e) => toggleFavorite(product.id, e)}
                      aria-label={
                        favorites.includes(product.id)
                          ? "Retirer des favoris"
                          : "Ajouter aux favoris"
                      }
                    >
                      {favorites.includes(product.id) ? (
                        <FaHeart
                          className="favorite-icon"
                          style={{ color: "red" }}
                        />
                      ) : (
                        <FaRegHeart
                          className="favorite-icon"
                          style={{ color: "gray" }}
                        />
                      )}
                    </button>
                    <div className="product-info">
                      <p>{product.name || "Nom non disponible"}</p>
                      <h3>
                        {product.price
                          ? `${parseFloat(product.price).toFixed(2)} DH`
                          : "Prix non disponible"}
                      </h3>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default Content2;
