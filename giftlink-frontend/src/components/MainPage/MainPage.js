import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { urlConfig } from '../../config';

function MainPage() {
    const [gifts, setGifts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchGifts = async () => {
            try {
                const response = await fetch(`${urlConfig.backendUrl}/api/gifts`, { cache: 'no-store' });
                if (!response.ok) {
                    throw new Error(`HTTP error; ${response.status}`);
                }
                const data = await response.json();
                setGifts(data);
            } catch (error) {
                console.error('Error fetching gifts:', error.message);
            } finally {
                setLoading(false);
            }
        };
        
        fetchGifts();
    }, []);

    const goToDetailsPage = (productId) => {
        navigate(`/app/gifts/${productId}`);
    };

    const formatDate = (timestamp) => {
        const date = new Date(timestamp * 1000);
        return date.toLocaleDateString('default', { month: 'long', day: 'numeric', year: 'numeric' });
    };

    const getConditionClass = (condition) => {
        return condition === "New" ? "list-group-item-success" : "list-group-item-warning";
    };

    return (
        <div className="container">
            <div className="py-5">
                <div className="text-center mb-5">
                    <h1 className="display-4 fw-bold">Discover Amazing Gifts</h1>
                    <p className="lead">Find the perfect gift for your loved ones</p>
                </div>

                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="mt-3">Loading gifts...</p>
                    </div>
                ) : gifts.length === 0 ? (
                    <div className="text-center py-5">
                        <div className="mb-4">
                            <div className="no-gifts-icon">🎁</div>
                        </div>
                        <h3>No gifts available yet</h3>
                        <p className="text-muted">Check back later for new arrivals</p>
                    </div>
                ) : (
                    <div className="row g-4">
                        {gifts.map((gift) => (
                            <div key={gift.id} className="col-md-6 col-lg-4">
                                <div className="product-card h-100">
                                    <div className="product-image">
                                        {gift.image ? (
                                            <img src={gift.image} alt={gift.name} />
                                        ) : (
                                            <div className="no-image-available">No Image</div>
                                        )}
                                    </div>
                                    <div className="product-info">
                                        <h3 className="product-title">{gift.name}</h3>
                                        <div className="product-price">${gift.price.toFixed(2)}</div>
                                        <div className={`product-condition ${getConditionClass(gift.condition)}`}>
                                            {gift.condition}
                                        </div>
                                        <p className="product-description">Added on: {formatDate(gift.added_timestamp)}</p>
                                        <div className="product-actions">
                                            <button 
                                                className="btn btn-primary" 
                                                onClick={() => goToDetailsPage(gift.id)}
                                            >
                                                View Details
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="text-center mt-5">
                    <p className="text-muted">Found {gifts.length} gifts</p>
                </div>
            </div>
        </div>
    );
}

export default MainPage;