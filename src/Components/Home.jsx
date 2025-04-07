import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Content1 from "./Content1";
import Content2 from "./Content2";

function Home() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // État pour la recherche
  const location = useLocation();
  const navigate = useNavigate();
  const [showOptions, setShowOptions] = useState(false);
  const name = location.state?.name || "Asmae";
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
  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const fetchCategories = async () => {
    try {
      const resp = await axios.get("http://localhost:8000/api/categories");
      setCategories(resp.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des catégories :", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const resp = await axios.get("http://localhost:8000/api/products");
      setProducts(resp.data);
      setFilteredProducts(resp.data); // Initialisation avec tous les produits
    } catch (error) {
      console.error("Erreur lors de la récupération des produits :", error);
    }
  };

  // Fonction de filtrage des produits
  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);

    // Filtrer les produits en fonction du terme de recherche
    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredProducts(filtered);
  };

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
      navigate('/Ajouter', { state: { categories } }); // Transmet un tableau d'objets { id, name }
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
          <input
            type="text"
            placeholder="Search anything"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <img src="/icons/chercher.png" alt="Search" />
        </div>
        <div className="Account" onClick={() => setShowOptions(!showOptions)}>
          <p className="name">
            {localStorage.getItem("token") ? name : <Link to="/login" className="name">Login</Link>}
          </p>
          {showOptions && (
            <aside>
              {!localStorage.getItem("token") ? (
                <div className="element1">
                  <Link className="text" to="/login">Login</Link>
                </div>
              ) : (
                <>
                  <div className="element1">
                    <Link className="text" to="/user-product">Mes produits</Link>
                  </div>
                  <div className="element1">
                    <Link className="text" to="/password">Password</Link>
                  </div>
                  <div className="element1">
                    <p onClick={() => { 
                        localStorage.removeItem("token");
                        navigate("/");
                      }} className="text">Logout</p>
                  </div>
                </>
              )}
            </aside>
          )}

          </div>
        
          <Link to="/favorites">
            <img src="/icons/coeur.png" alt="Favorites" />
          </Link>      
        </header>
      
      {/* Ajout de la navigation */}
      <div className="global-container">
      <nav>
        {categories.map((cat, index) => {
          const { icon, color } = iconsAndColors[index] || {};
          return (
            <div key={cat.id} className="category-item">
              <div className="icon-container" style={{ backgroundColor: color || '#ddd' }}>
                {icon && <img className="icon" src={icon} alt={`Icone de ${cat.name}`} />}
              </div>
              <p
                onClick={() => handleCategoryClick(cat.id)}
                className={activeIndex === cat.id ? 'active' : ''}
              >
                {cat.name}
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
          <main>
            <div className="content">
              {activeIndex ? (
                <Content2 activeIndex={activeIndex} />
              ) : (
                <Content1 products={searchTerm ? filteredProducts : products} categories={categories} />
              )}
            </div>
          </main>

        </div>
      </main>
      </div>
    </>
  );
}

export default Home;
