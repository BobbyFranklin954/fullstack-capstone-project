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

    // Format timestamp
    const formatDate = (timestamp) => {
        if (!timestamp) return 'Unknown Date'; // Handle missing timestamp
        const date = new Date(Number(timestamp)); // Convert timestamp to number if needed
        if (isNaN(date)) return 'Invalid Date'; // Handle invalid dates
        return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
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
                                src={gift.image || '/static/background-stars.jpg'}
                                className="card-img-top"
                                alt={gift.name}
                            />
                            <div className="card-body">
                                {/* Display gift name */}
                                <h5 className="card-title">{gift.name}</h5>

                                {/* Display formatted date */}
                                <p className="card-text text-muted">
                                    Added on: {formatDate(gift.timestamp)}
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