import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Password = () => {
    const [formData, setFormData] = useState({
        current_password: '',
        new_password: '',
        new_password_confirmation: ''
    });
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});
        
        try {
            const response = await axios.post(
                'http://localhost:8000/api/change-password',
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            setSuccess(true);
            setTimeout(() => {
                navigate('/'); // Rediriger vers le profil après succès
            }, 2000);
        } catch (error) {
            if (error.response && error.response.status === 400) {
                setErrors({ current_password: error.response.data.message });
            } else if (error.response && error.response.data.errors) {
                setErrors(error.response.data.errors);
            } else {
                setErrors({ general: 'Une erreur est survenue. Veuillez réessayer.' });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="change-password-container">
            <div className="change-password-card">
                <h2>Changer le mot de passe</h2>
                
                {success && (
                    <div className="success-message">
                        Mot de passe changé avec succès. Redirection en cours...
                    </div>
                )}

                {errors.general && (
                    <div className="error-message">
                        {errors.general}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="current_password">Mot de passe actuel</label>
                        <input
                            type="password"
                            id="current_password"
                            name="current_password"
                            value={formData.current_password}
                            onChange={handleChange}
                            className={errors.current_password ? 'error' : ''}
                        />
                        {errors.current_password && (
                            <span className="error-text">{errors.current_password}</span>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="new_password">Nouveau mot de passe</label>
                        <input
                            type="password"
                            id="new_password"
                            name="new_password"
                            value={formData.new_password}
                            onChange={handleChange}
                            className={errors.new_password ? 'error' : ''}
                        />
                        {errors.new_password && (
                            <span className="error-text">{errors.new_password.join(' ')}</span>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="new_password_confirmation">Confirmer le nouveau mot de passe</label>
                        <input
                            type="password"
                            id="new_password_confirmation"
                            name="new_password_confirmation"
                            value={formData.new_password_confirmation}
                            onChange={handleChange}
                            className={errors.new_password_confirmation ? 'error' : ''}
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="submit-btn"
                        disabled={loading}
                    >
                        {loading ? 'Chargement...' : 'Changer le mot de passe'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Password;