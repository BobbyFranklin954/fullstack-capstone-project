import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { urlConfig } from '../../config';

function MainPage() {
    const [gifts, setGifts] = useState([]);
    const navigate = useNavigate();

    // Fetch gifts from API
    useEffect(() => {
        const fetchGifts = async () => {
            try {
                const response = await fetch(`${urlConfig.backendUrl}/gifts`);
                console.log('Response:', response); // Log response object
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                console.log('Fetched gifts:', data);
                setGifts(data);
            } catch (error) {
                console.error('Error fetching gifts:', error);
            }
        };

        fetchGifts();
    }, []);

    // Navigate to details page
    const goToDetailsPage = (giftId) => {
        navigate(`/gifts/${giftId}`);
    };

    // Get condition class for styling
    const getConditionClass = (condition) => {
        return condition === 'New' ? 'text-success' : 'text-warning';
    };

    return (
        <div className="container mt-5">
            <div className="row">
                {gifts.map((gift) => (
                    <div key={gift._id} className="col-md-4 mb-4">
                        <div className="card product-card h-100">
                            {/* Display gift image or placeholder */}
                            <img
                                src={gift.image || '/static/placeholder.webp'}
                                className="card-img-top"
                                alt={gift.name}
                            />
                            <div className="card-body">
                                {/* Display gift name */}
                                <h5 className="card-title">{gift.name}</h5>

                                {/* Display formatted date */}
                                <p className="card-text text-muted">
                                    Added on: {gift.date_added ? new Date(gift.date_added * 1000).toLocaleDateString() : 'N/A'}
                                </p>
                                {/* Display condition */}
                                <p className={`card-text ${getConditionClass(gift.condition)}`}>
                                    {gift.condition}
                                </p>

                                <button
                                    onClick={() => goToDetailsPage(gift._id)}
                                    className="btn btn-primary"
                                >
                                    View Details
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default MainPage;