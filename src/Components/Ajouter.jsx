import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function Ajouter() {
  const location = useLocation();
  const categories = location.state?.categories || [];

  const [selectedCategory, setSelectedCategory] = useState("");
  const [subCategories, setSubCategories] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState("");

  const navigate=useNavigate();
  // Charger les sous-catégories selon la catégorie sélectionnée
  useEffect(() => {
    if (selectedCategory) {
      const fetchSubCategories = async () => {
        try {
          const url = `http://localhost:8000/api/categories/${selectedCategory}/SubcategorieProducts`;
          const resp = await axios.get(url, {
            headers: {
              'Cache-Control': 'no-cache',
            },
          });
          setSubCategories(resp.data.subcategories);
        } catch (error) {
          console.error('Erreur lors de la récupération des sous-catégories:', error);
        }
      };
      fetchSubCategories();
    } else {
      setSubCategories([]);
    }
  }, [selectedCategory]);

  // Fonction pour poster un produit
  const handleSubmit = async (e) => {
  e.preventDefault();
  const token = localStorage.getItem('token');

  if (!token) {
    alert("Vous devez être connecté pour ajouter un produit.");
    return;
  }

  const formData = new FormData();
  formData.append("category_id", selectedCategory);
  formData.append("sub_category_id", selectedSubCategory);
  formData.append("name", document.getElementById("name").value);
  formData.append("description", document.getElementById("description").value);
  formData.append("price", document.getElementById("price").value);
  formData.append("phone_number", document.getElementById("tel").value);
  formData.append("ville", document.getElementById("ville").value);

  const imageFile = document.getElementById("image").files[0];
  if (imageFile) {
    formData.append("image_url", imageFile); // Vérifie que le fichier est bien ajouté
  }

  console.log("Données envoyées:", Object.fromEntries(formData.entries()));

  try {
    const response = await axios.post("http://localhost:8000/api/products", formData, {
      headers: {
        Authorization: `Bearer ${token}`, 
        "Content-Type": "multipart/form-data", 
      },
    });

    alert("Produit ajouté avec succès !");
    console.log("Réponse serveur:", response.data);
    navigate('/')
  } catch (error) {
    console.error("Erreur ajout produit:", error.response?.data || error);
    alert("Erreur lors de l'ajout du produit.");
  }


  };

  return (
    <div className='Ajouter'>
      <header>
        <h1>ReVendre</h1>
        <div className='quitter' onClick={()=>{navigate('/')}}>
          <img src="icons/leave.png" alt="Quitter" />
          <p  >Quitter</p>
        </div>
      </header>
      <form onSubmit={handleSubmit}>
        <div className="form-columns">
          <div className="form-left">
            <label htmlFor="Catégorie">Catégorie:</label>
            <select
              name="Catégorie"
              id="Catégorie"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="" disabled>Choisissez une catégorie</option>
              {categories.map((item) => (
                <option key={item.id} value={item.id}>{item.name}</option>
              ))}
            </select>

            <label htmlFor="Sub-Catégorie">Sub-Catégorie:</label>
            <select
              name="Sub-Catégorie"
              id="Sub-Catégorie"
              value={selectedSubCategory}
              onChange={(e) => setSelectedSubCategory(e.target.value)}
            >
              <option value="" disabled>Choisissez une sous-catégorie</option>
              {subCategories.map((sub) => (
                <option key={sub.id} value={sub.id}>{sub.name}</option>
              ))}
            </select>

            <label htmlFor="name">Nom:</label>
            <input type="text" id="name" required />

            <label htmlFor="description">Description:</label>
            <textarea name="description" id="description" required></textarea>
          </div>

          <div className="form-right">
            <label htmlFor="price">Prix:</label>
            <input type="text" id="price" required />

            <label htmlFor="tel">Numéro de téléphone:</label>
            <input type="text" id="tel" required />

            <label htmlFor="ville">Ville:</label>
            <input type="text" id="ville" required />

            <label htmlFor="image">Image du produit:</label>
            <input type="file" id="image" accept="image/*" required />
          </div>
        </div>

        <button type="submit">
          <img src="icons/share.png" alt="Partager" />
          Déposer
        </button>
      </form>
    </div>
  );
}

export default Ajouter;
