import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

function Message({product}) {
    // const location = useLocation();
    // const product = location.state?.product;
    const [user, setUser] = useState(null);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [selectedMessageId, setSelectedMessageId] = useState(null);

    const token = localStorage.getItem("token");

    // Récupérer les messages
    const getMessages = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/messages/conversation/${product.user_id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setMessages(response.data.messages);
            console.log("Données récupérées :", response.data);
        } catch (error) {
            console.error("Erreur lors de la récupération des messages :", error);
        }
    };

    useEffect(() => {
        if (!product?.user_id) return;

        const fetchData = async () => {
            if (!token) {
                console.warn("Utilisateur non connecté !");
                return;
            }

            try {
                const response = await axios.get(`http://localhost:8000/api/users/${product.user_id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setUser(response.data);
            } catch (error) {
                console.error("Erreur lors de la récupération des données :", error.response?.data || error.message);
            }
        };

        fetchData();
        getMessages();
    }, [product?.user_id]);

    const sendMessage = async () => {
        if (!message.trim()) return;

        try {
            const response = await axios.post(
                `http://127.0.0.1:8000/api/message`,
                {
                    recepteur_id: product?.user_id,
                    message: message,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            console.log("Message envoyé :", response.data);
            setMessages(prevMessages => [
                ...prevMessages,
                { message: message, recepteur_id: product?.user_id }
            ]);

            setMessage("");
        } catch (error) {
            console.error("Erreur lors de l'envoi du message :", error.response?.data || error.message);
        }
    };

    const deletemsg = async (id) => {
        const confirmDelete = window.confirm("Voulez-vous vraiment supprimer ce message ?");
        if (!confirmDelete) return;

        try {
            await axios.delete(`http://127.0.0.1:8000/api/message/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setMessages(prevMessages => prevMessages.filter(msg => msg.id !== id));

            console.log("Message supprimé !");
        } catch (error) {
            console.error("Erreur lors de la suppression du message :", error.response?.data || error.message);
        }
    };

    return (
        <div className="message-container">
            {/* Infos utilisateur */}
            <div className="header">
                <div className="image"></div>
                <div className="user-info">
                    <p className="name">{user?.name || "......"}</p>
                    <p className="phone">{user?.phone_number || "........"}</p>
                    <p className="phone">{user?.ville || "..."}</p>
                </div>
            </div>

            <div className="chat">
                {/* Produit à discuter */}
                <div className="product-card-msg" key={product?.id} style={{ cursor: 'pointer' }}>
                    <div className="image-msg">
                        <img
                            src={product?.image_url ? `http://localhost:8000/storage/${product.image_url}` : '/placeholder.png'}
                            alt={product?.name || 'Produit'}
                        />
                    </div>
                    <div className="product-info">
                        <p>{product?.name || 'Nom non disponible'}</p>
                        <h3>
                            {product?.price
                                ? `${parseFloat(product.price).toFixed(2)} Dh`
                                : 'Prix non disponible'}
                        </h3>
                    </div>
                </div>

                {/* Messages */}
                <div className="messages-list">
                    {messages.length > 0 ? (
                        messages.map((msg, index) => (
                            <div
                                key={index}
                                className={msg.recepteur_id === product.user_id ? "emetteur" : "récepteur"}
                                onClick={() => setSelectedMessageId(prevId => (prevId === msg.id ? null : msg.id))} // Alterner entre afficher/masquer
                            >
                                {selectedMessageId === msg.id && ( // Afficher l'icône seulement pour le message sélectionné
                                    <img
                                        src="/icons/supprimer.png"
                                        alt="supprimer"
                                        className='supprimer'
                                        onClick={(e) => {
                                            e.stopPropagation(); // Empêche le clic de se propager et de rouvrir/fermer l'icône
                                            deletemsg(msg.id);
                                        }}
                                    />
                                )}
                                {msg.message}
                            </div>
                        ))
                    ) : (
                        <p>...</p>
                    )}
                </div>
            </div>

            {/* Écrire un message */}
            <div className="taper">
                <input
                    type="text"
                    className="placeholder"
                    placeholder='Taper un message'
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <img src="/icons/envoyer.png" alt="send" className="send-icon" onClick={sendMessage} />
            </div>
        </div>
    );
}

export default Message;
