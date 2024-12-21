import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './SearchPage.css';
import { urlConfig } from '../../config';

function SearchPage() {

    //Task 1: Define state variables for the search query, age range, and search results.
    const [searchQuery, setSearchQuery] = useState(''); // Text input query
    const [ageRange, setAgeRange] = useState([0, 10]); // Default age range (0–10 years)
    const [isAgeRangeSet, setIsAgeRangeSet] = useState(false); // Track if the user adjusted the slider
    const [searchResults, setSearchResults] = useState([]); // Results from the API
    const [selectedCategory, setSelectedCategory] = useState(''); // Selected category filter
    const [selectedCondition, setSelectedCondition] = useState(''); // Selected condition filter


    const categories = ['Living', 'Bedroom', 'Bathroom', 'Kitchen', 'Office'];
    const conditions = ['New', 'Like New', 'Older'];

    useEffect(() => {
        // fetch all products
        const fetchProducts = async () => {
            try {
                let url = `${urlConfig.backendUrl}/api/gifts`
                console.log(url)
                const response = await fetch(url);
                if (!response.ok) {
                    //something went wrong
                    throw new Error(`HTTP error; ${response.status}`)
                }
                const data = await response.json();
                setSearchResults(data);
            } catch (error) {
                console.log('Fetch error: ' + error.message);
            }
        };

        fetchProducts();
    }, []);


    // Task 2. Fetch search results from the API based on user inputs.
    const handleSearch = async () => {
        try {
            const params = new URLSearchParams();

            // Add query parameters based on user input
            if (searchQuery) params.append('name', searchQuery);
            if (selectedCategory) params.append('category', selectedCategory);
            if (selectedCondition) params.append('condition', selectedCondition);
            if (isAgeRangeSet) { // Only include age range if explicitly set
                params.append('age_min', ageRange[0]);
                params.append('age_max', ageRange[1]);
            }

            const url = `${urlConfig.backendUrl}/search?${params.toString()}`;
            console.log('Fetching URL:', url);

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setSearchResults(data); // Update the search results state
        } catch (error) {
            console.error('Error fetching search results:', error);
        }
    };

    const handleAgeRangeChange = (e) => {
        const newRange = [0, Number(e.target.value)];
        setAgeRange(newRange);
        setIsAgeRangeSet(true); // Mark the range as set when the user interacts
    };

    const navigate = useNavigate();

    const goToDetailsPage = (productId) => {
        // Task 6. Enable navigation to the details page of a selected gift.
        navigate(`/gifts/${productId}`);

    };




    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="filter-section mb-3 p-3 border rounded">
                        <h5>Filters</h5>
                        <div className="d-flex flex-column">
                            {/* Task 3: Dynamically generate category and condition dropdown options.*/}
                            <div className="mb-3">
                                <label htmlFor="categoryFilter">Category</label>
                                <select
                                    id="categoryFilter"
                                    className="form-control dropdown-filter"
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                >
                                    <option value="">All Categories</option>
                                    {categories.map((category) => (
                                        <option key={category} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="conditionFilter">Condition</label>
                                <select
                                    id="conditionFilter"
                                    className="form-control dropdown-filter"
                                    value={selectedCondition}
                                    onChange={(e) => setSelectedCondition(e.target.value)}
                                >
                                    <option value="">All Conditions</option>
                                    {conditions.map((condition) => (
                                        <option key={condition} value={condition}>
                                            {condition}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {/* Task 4: Implement an age range slider and display the selected value. */}
                            <div className="mb-3">
                                <label htmlFor="ageRangeSlider">Age Range (Years)</label>
                                <input
                                    type="range"
                                    id="ageRangeSlider"
                                    className="age-range-slider"
                                    min={0}
                                    max={10}
                                    value={ageRange[1]}
                                    onChange={handleAgeRangeChange}
                                />
                                <p>
                                    Selected: {isAgeRangeSet ? `${ageRange[0]} to ${ageRange[1]} years` : "Any Range"}
                                </p>
                            </div>
                        </div>
                    </div>
                    {/* Task 7: Add text input field for search criteria*/}
                    <div className="mb-3">
                        <label htmlFor="searchInput">Search by Name</label>
                        <input
                            type="text"
                            id="searchInput"
                            className="form-control search-input"
                            placeholder="Enter gift name"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    {/* Task 8: Implement search button with onClick event to trigger search:*/}
                    <button
                        type="button"
                        className="btn btn-primary search-button mt-3"
                        onClick={handleSearch}
                    >
                        Search
                    </button>
                    {/*Task 5: Display search results and handle empty results with a message. */}
                    <div className="search-results-section mt-4">
                        {searchResults.length > 0 ? (
                            <div className="row">
                                {searchResults.map((result) => (
                                    <div key={result._id} className="col-md-4 mb-4">
                                        <div className="card search-results-card">
                                            <img
                                                src={result.image || '/static/placeholder.png'}
                                                className="card-img-top"
                                                alt={result.name}
                                            />
                                            <div className="card-body">
                                                <h5 className="card-title">{result.name}</h5>
                                                <p className="card-text">
                                                    <strong>Category:</strong> {result.category}
                                                </p>
                                                <p className="card-text">
                                                    <strong>Condition:</strong> {result.condition}
                                                </p>
                                                <p className="card-text">
                                                    <strong>Age:</strong> {result.age_years} years
                                                </p>
                                                <button
                                                    className="btn btn-primary"
                                                    onClick={() => goToDetailsPage(result._id)}
                                                >
                                                    View Details
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="alert alert-warning text-center" role="alert">
                                No results found. Try adjusting your filters.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SearchPage;
