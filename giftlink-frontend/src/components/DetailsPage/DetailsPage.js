import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { urlConfig } from '../../config';
import './DetailsPage.css';

function DetailsPage() {
    const navigate = useNavigate();
    const { productId } = useParams();
    const [gift, setGift] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // const authenticationToken = sessionStorage.getItem('auth-token');
        // if (!authenticationToken) {
        //     // Task 1: Check for authentication and redirect
        //     navigate('/login'); // Redirect to login if no token
        // }

        // get the gift to be rendered on the details page
        const fetchGift = async () => {
            try {
                // Task 2: Fetch gift details
                const response = await fetch(`${urlConfig.backendUrl}/gifts/${productId}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setGift(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchGift();

        // Task 3: Scroll to top on component mount
        window.scrollTo(0, 0); // Scroll to the top of the page

    }, [productId]);


    const handleBackClick = () => {
        // Task 4: Handle back click
        navigate(-1); // Go back to the previous page
    };

    //The comments have been hardcoded for this project.
    const comments = [
        {
            author: "John Doe",
            comment: "I would like this!"
        },
        {
            author: "Jane Smith",
            comment: "Just DMed you."
        },
        {
            author: "Alice Johnson",
            comment: "I will take it if it's still available."
        },
        {
            author: "Mike Brown",
            comment: "This is a good one!"
        },
        {
            author: "Sarah Wilson",
            comment: "My family can use one. DM me if it is still available. Thank you!"
        }
    ];


    if (loading) {
        return (
            <div className="loading-message">
                <h3>Loading...</h3>
                <p>Please wait while we fetch the gift details for you.</p>
            </div>
        );
    }
    if (error) {
        return (
            <div className="error-message">
                <h3>Error</h3>
                <p>{error}</p>
                <button className="btn btn-primary" onClick={() => navigate(-1)}>
                    Go Back
                </button>
            </div>
        );
    }
    if (!gift) {
        return (
            <div className="error-message">
                <h3>Gift Not Found</h3>
                <p>The requested gift does not exist or has been removed.</p>
                <button className="btn btn-primary" onClick={() => navigate(-1)}>
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="container mt-5">
            <button className="btn btn-secondary mb-3" onClick={handleBackClick}>Back</button>
            <div className="card product-details-card">
                <div className="card-header text-white">
                    <h2 className="details-title">{gift.name}</h2>
                </div>
                <div className="card-body">
                    <div className="image-placeholder-large">
                        {gift.image ? (
                            // Task 5: Display gift image
                            <img
                                src={gift.image}
                                alt={gift.name}
                                className="product-image-large"
                            />
                        ) : (
                            <div className="no-image-available-large">No Image Available</div>
                        )}
                    </div>

                    <p><strong>Category:</strong> {gift.category || 'Not specified'}</p>
                    <p><strong>Condition:</strong> {gift.condition}</p>
                    <p><strong>Date Added:</strong> {gift.date_added ? new Date(gift.date_added * 1000).toLocaleDateString() : 'N/A'}</p>
                    <p><strong>Age (Years):</strong> {gift.age || 'N/A'}</p>
                    <p><strong>Description:</strong> {gift.description || 'No description available'}</p>
                </div>
            </div>
            <div className="comments-section mt-4">
                <h3 className="mb-3">Comments</h3>
                {comments.map((comment, index) => (
                    <div key={index} className="card mb-3">
                        <div className="card-body">
                            <p className="comment-author"><strong>{comment.author}:</strong></p>
                            <p className="comment-text">{comment.comment}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default DetailsPage;
