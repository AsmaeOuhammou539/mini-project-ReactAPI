import axios from 'axios';
import React, { useEffect, useState } from 'react';
import '../Sass/main.css';

function Content2({ activeIndex }) {
    const [subCategoriesWithProducts, setSubCategoriesWithProducts] = useState([]);

    const fetchProducts = async () => {
        try {
            const url = `http://localhost:8000/api/categories/${activeIndex}/SubcategorieProducts`;
            const resp = await axios.get(url, {
                headers: {
                    'Cache-Control': 'no-cache',
                },
            });
            console.log('Données reçues depuis l\'API :', resp.data);

            console.log('Sous-catégories et produits reçus pour la catégorie:', activeIndex, resp.data);

            // Vérification et mise à jour des sous-catégories avec leurs produits
            if (resp.data.subcategories) {
                setSubCategoriesWithProducts(resp.data.subcategories);
            } else {
                console.error('Structure inattendue des données', resp.data);
                setSubCategoriesWithProducts([]);
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des sous-catégories et produits :', error);
            setSubCategoriesWithProducts([]);
        }
    };

    useEffect(() => {
        console.log('Catégorie active changée:', activeIndex);
        fetchProducts();
    }, [activeIndex]);

    return (
        <div className="product-grid">
            {subCategoriesWithProducts.length === 0 ? (
                <p>Aucune sous-catégorie ou produit disponible pour cette catégorie.</p>
            ) : (
                subCategoriesWithProducts.map((subCategory) => (
                    <div key={subCategory.id} className="subcategory-section">
                        <p className='subCat'>{subCategory.name}</p> {/* Affichage du nom de la sous-catégorie */}
                        {subCategory.products.length === 0 ? (
                            <p>Aucun produit disponible pour cette sous-catégorie.</p>
                        ) : (
                            <div className="product-list">
                                {subCategory.products.map((product) => (
                                    <div className="product-card" key={product.id}>
                                        <div className="product-image">
                                        <img src={`http://localhost:8000/storage/${product.image_url}`} alt={product.name || 'Produit'} />
                                        </div>
                                        <div className="product-info">
                                            <p>{product.name || 'Nom non disponible'}</p>
                                            <h3>
                                                {product.price
                                                    ? `${parseFloat(product.price).toFixed(2)} DH`
                                                    : 'Prix non disponible'}
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
