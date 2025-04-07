import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function SignUp() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    ville: '',
    phone_number: '',
  });
  const navigate=useNavigate()
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const validateStep = () => {
    if (step === 1 && (!formData.name || !formData.email)) {
      setError('Veuillez remplir tous les champs.');
      return false;
    }
    if (step === 2 && (!formData.password || !formData.password_confirmation)) {
      setError('Veuillez remplir tous les champs.');
      return false;
    }
    if (step === 2 && formData.password !== formData.password_confirmation) {
      setError('Les mots de passe ne correspondent pas.');
      return false;
    }
    if (step === 3 && (!formData.ville || !formData.phone_number)) {
      setError('Veuillez remplir tous les champs.');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;

    try {
      const response = await axios.post('http://localhost:8000/api/users', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('Réponse du serveur:', response.data);
      alert('Inscription réussie !');
      navigate('/login');
      
    } catch (error) {
      console.error('Erreur:', error);
      if (error.response) {
        setError(`Erreur du serveur: ${error.response.data.message || 'Erreur inconnue'}`);
      } else if (error.request) {
        setError('Aucune réponse du serveur. Vérifiez votre connexion.');
      } else {
        setError('Erreur lors de la configuration de la requête.');
      }
    }
  };

  const renderFormStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="global">
            <h2>Étape 1 sur 3</h2>
            <p>Informations personnelles</p>
            <label htmlFor="name">Nom&prénom:</label>
            <input
              type="text"
              name="name"
              placeholder="Nom complet"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              name="email"
              placeholder="example@gmail.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <div className="button-group">
              <button type="button" onClick={nextStep}>Suivant</button>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="global">
            <h2>Étape 2 sur 3</h2>
            <p>Mot de passe</p>
            <label htmlFor="password">Mot de pass:</label>
            <input
              type="password"
              name="password"
              placeholder="Mot de passe"
              value={formData.password}
              onChange={handleChange}
              required
            />            
            <label htmlFor="password_confirmation">Confirmer le mot de pass:</label>
            <input
              type="password"
              name="password_confirmation"
              placeholder="Confirmez le mot de passe"
              value={formData.password_confirmation}
              onChange={handleChange}
              required
            />
            <div className="button-group">
              <button type="button" onClick={prevStep}>Précédent</button>
              <button type="button" onClick={nextStep}>Suivant</button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="global">
            <h2>Étape 3 sur 3</h2>
            <p>Informations supplémentaires</p>
            <label htmlFor="ville">ville:</label>
            <input
              type="text"
              name="ville"
              placeholder="Ville"
              value={formData.ville}
              onChange={handleChange}
              required
            />
            <label htmlFor="phone_number">Numéro de téléphone:</label>
            <input
              type="text"
              name="phone_number"
              placeholder="----------"
              value={formData.phone_number}
              onChange={handleChange}
              required
            />
            <div className="button-group">
              <button type="button" onClick={prevStep}>Précédent</button>
              <button type="submit">S'inscrire</button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-form">
          <h1>Inscription</h1>
          {error && <p className="error-message">{error}</p>}
          <form onSubmit={handleSubmit}>{renderFormStep()}</form>
        </div>
        <img className="auth-image" src="login3.jpg" alt="Login Illustration" />
        </div>
    </div>
  );
}

export default SignUp;