import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Content1 from './Content1';
import Content2 from './Content2';

function Home() {
  const [categories, setCategories] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [showOptions, setShowOptions] = useState(false);
  const name = location.state?.name || "Compte"; // Valeur par défaut

  useEffect(() => {
    console.log(location);
  }, [location]);

  const iconsAndColors = [
    { icon: '/icons/C.png', color: '#B7B7B7' },
    { icon: '/icons/H.png', color: '#ECDDCA' },
    { icon: '/icons/A.png', color: '#9F6400' },
    { icon: '/icons/D.png', color: '#67A4B9' },
    { icon: '/icons/I.png', color: '#F64A69' },
    { icon: '/icons/E.png', color: '#FBF7D3' },
    { icon: '/icons/B.png', color: '#DCCEBE' },
    { icon: '/icons/G.png', color: '#60625F' },
    { icon: '/icons/F.png', color: '#607D51' },
  ];

  const fetchCategories = async () => {
    try {
      const url = `http://localhost:8000/api/categories`;
      const resp = await axios.get(url);
      const catNames = resp.data.map((cat) => cat.name);
      setCategories(catNames);
    } catch (error) {
      console.error('Erreur lors de la récupération des catégories :', error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCategoryClick = (index) => {
    setActiveIndex(index);
  };

  const handleAllCategoryClick = () => {
    setActiveIndex(null);
  };

  const handleAddAnnouncement = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      navigate('/Ajouter');
    }
  };

  const handleLogout = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error("Aucun token trouvé.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/api/logout",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        localStorage.removeItem("token"); // Supprime le token
        navigate("/");
      }
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error);
    }
  };

  return (
    <>
      <header>
        <h1>ReVendre</h1>
        <div className="search">
          <div className="cat" onClick={handleAllCategoryClick}>
            All categories
          </div>
          <input type="text" placeholder="Search anything" />
          <img src="/icons/chercher.png" alt="Search" />
        </div>
        <div className="Account" onClick={() => setShowOptions(!showOptions)}>
          <p>
            {localStorage.getItem('token') ? name : <Link to="/login">Login</Link>}
          </p>
          {showOptions && (
            <div className="account-options">
              <p><Link to="/login">Login</Link></p>
              <p><Link to="/change-password">Modifier le mot de passe</Link></p>
              <p onClick={handleLogout} style={{ cursor: "pointer" }}>Se déconnecter</p>
            </div>
          )}
        </div>
        <img src="/icons/coeur.png" alt="Favorites" />
      </header>

      <nav>
        {categories.map((cat, index) => {
          const { icon, color } = iconsAndColors[index] || {};
          return (
            <div key={index} className="category-item">
              <div className="icon-container" style={{ backgroundColor: color || '#ddd' }}>
                {icon && <img className="icon" src={icon} alt={`Icone de ${cat}`} />}
              </div>
              <p
                onClick={() => handleCategoryClick(index + 1)}
                className={activeIndex === index + 1 ? 'active' : ''}
              >
                {cat}
              </p>
            </div>
          );
        })}
      </nav>

      <main>
        <div className="add" onClick={handleAddAnnouncement}>
          <img className="icon" src="/icons/J.png" alt="add" />
          <p>Déposer une annonce</p>
        </div>
        <div className="content">
          {activeIndex ? <Content2 activeIndex={activeIndex} /> : <Content1 />}
        </div>
      </main>
    </>
  );
}

export default Home;
