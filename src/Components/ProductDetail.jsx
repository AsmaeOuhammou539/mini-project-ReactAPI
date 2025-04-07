import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Message from "./Message";

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [showMessage, setShowMessage] = useState(false);
  const navigate = useNavigate();
  const messageRef = useRef();

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/products/${id}`)
      .then((response) => {
        setProduct(response.data);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération du produit :", error);
      });
  }, [id]);

  // Gestion du clic en dehors du message
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (messageRef.current && !messageRef.current.contains(event.target)) {
        setShowMessage(false);
      }
    };

    if (showMessage) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMessage]);

  if (!product) {
    return <p className="text-center mt-4">Chargement du produit...</p>;
  }

  const token = localStorage.getItem("token");

  return (
    <div className="detaills-container">
      <header>
        <h1>ReVendre</h1>
        <div
          className="quitter"
          onClick={() => {
            navigate("/");
          }}
        >
          {/* <img src="icons/leave.png" alt="" /> */}
          <p>Quitter</p>
        </div>
      </header>
      
      <div className="detail-container">
        <div className="container d-flex justify-content-center align-items-center mt-5">
          <div className="product-card p-4 shadow-sm">
            <div className="row">
              <div className="col-md-5">
                <img
                  className="img-fluid rounded product-image"
                  src={`http://localhost:8000/storage/${product.image_url}`}
                  alt={product.name}
                />
              </div>
              <div className="col-md-7">
                <h2 className="product-title">{product.name}</h2>
                <p className="product-description">
                  <strong>Description :</strong> {product.description}
                </p>
                <p>
                  <strong>Ville :</strong> {product.ville || "Non spécifiée"}
                </p>
                <p>
                  <strong>Téléphone du posteur :</strong>{" "}
                  {product.phone_number || "Non disponible"}
                </p>
                <p className="product-price">
                  <strong>Prix :</strong> {parseFloat(product.price).toFixed(2)}{" "}
                  <small>DH</small>
                </p>
                {token && (
                  <button
                    className="contact-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowMessage(!showMessage);
                    }}
                  >
                    Contacter le vendeur <span>💬</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Overlay bleu semi-transparent */}
      {showMessage && (
        <div 
          className="message-overlay"
          onClick={() => setShowMessage(false)}
        />
      )}
      
      {/* Container du message */}
      {showMessage && (
        <div 
          ref={messageRef}
          className="message-container"
          onClick={(e) => e.stopPropagation()}
        >
          <Message product={product} />
        </div>
      )}
    </div>
  );
}

export default ProductDetail;