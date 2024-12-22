import React from 'react';
import './Home.css';

export default function Home() {
    return (
        <div className="container my-5">
            <div className="text-center">
                {/* Main Heading */}
                <h1 className="main-heading">Welcome to GiftLink</h1>

                {/* Subheading */}
                <p className="subheading">Your personalized gift exchange made easy</p>

                {/* Inspirational Quote */}
                <p className="quote">&ldquo;The best gifts come from the heart, not the store.&rdquo;</p>

                {/* Get Started Button */}
                <a href="/get-started" className="btn-get-started">
                    Get Started
                </a>
            </div>
        </div>
    );
}