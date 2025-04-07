import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }

        const fetchUserProducts = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/user/products', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setProducts(response.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Erreur lors du chargement des produits');
                console.error('Error fetching user products:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchUserProducts();
    }, [token, navigate]);

    const handleEditProduct = (productId) => {
        navigate(`/edit-product/${productId}`);
    };

    const handleDeleteProduct = async (productId) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) return;

        try {
            await axios.delete(`http://localhost:8000/api/products/${productId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setProducts(products.filter(product => product.id !== productId));
        } catch (err) {
            console.error('Error deleting product:', err);
            alert('Erreur lors de la suppression du produit');
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Chargement de vos produits...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <p className="error-message">{error}</p>
                <button onClick={() => window.location.reload()}>Réessayer</button>
            </div>
        );
    }

    return (
        <div className="user-products-container">
            <div className="header">
                <h1>Mes produits partagés</h1>
                <button 
                    className="add-product-btn"
                    onClick={() => navigate('/Ajouter')}
                >
                    + Ajouter un produit
                </button>
            </div>

            {products.length === 0 ? (
                <div className="empty-state">
                    <p>Vous n'avez partagé aucun produit pour le moment.</p>
                    <button 
                        className="browse-products-btn"
                        onClick={() => navigate('/products')}
                    >
                        Parcourir les produits
                    </button>
                </div>
            ) : (
                <div className="products-grid">
                    {products.map(product => (
                        <div key={product.id} className="product-card">
                            <div 
                                className="product-image"
                                onClick={() => navigate(`/product/${product.id}`)}
                            >
                                <img 
                                    src={`http://localhost:8000/storage/${product.image_url}`} 
                                    alt={product.name} 
                                    onError={(e) => {
                                        e.target.src = '/placeholder-product.png';
                                    }}
                                />
                            </div>
                            <div className="product-info">
                                <h3 onClick={() => navigate(`/product/${product.id}`)}>
                                    {product.name}
                                </h3>
                                <p className="price">{parseFloat(product.price).toFixed(2)} DH</p>
                                <p className="description">{product.description}</p>
                                <div className="product-actions">
                                    <button 
                                        className="edit-btn"
                                        onClick={() => handleEditProduct(product.id)}
                                    >
                                        Modifier
                                    </button>
                                    <button 
                                        className="delete-btn"
                                        onClick={() => handleDeleteProduct(product.id)}
                                    >
                                        Supprimer
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UserProducts;