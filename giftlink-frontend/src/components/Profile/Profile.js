import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './Profile.css'
import { urlConfig } from '../../config';
import { useAppContext } from '../../context/AuthContext';

const Profile = () => {
  const [userDetails, setUserDetails] = useState({});
  const [updatedDetails, setUpdatedDetails] = useState({});
  const { setUserName } = useAppContext();
  const [changed, setChanged] = useState("");

  const [editMode, setEditMode] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  useEffect(() => {
    const authtoken = sessionStorage.getItem("auth-token");
    if (!authtoken) {
      navigate("/login");
    } else {
      fetchUserProfile();
    }
  }, [navigate]);

  const fetchUserProfile = async () => {
    try {
      const authtoken = sessionStorage.getItem("auth-token");
      const firstName = sessionStorage.getItem('firstName');
      const lastName = sessionStorage.getItem('lastName');
      const email = sessionStorage.getItem("email");
      if (authtoken || email) {
        const storedUserDetails = {
          firstName: firstName,
          lastname: lastName,
          email: email
        };

        setUserDetails(storedUserDetails);
        setUpdatedDetails(storedUserDetails);
      }
    } catch (error) {
      console.error(error);
      // Handle error case
    }
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedDetails({
      ...updatedDetails,
      [name]: value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const authtoken = sessionStorage.getItem("auth-token");

      if (!authtoken) {
        navigate("/login");
        return;
      }

      const payload = {
        firstName: updatedDetails.firstName,
        lastName: updatedDetails.lastName,
        email: updatedDetails.email,
      };

      const response = await fetch(`${urlConfig.backendUrl}/auth/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authtoken}`,
          'email': `${userDetails.email}`
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json(); // Parse error response from server

        // Check if the errorData contains validation errors
        if (errorData.errors && Array.isArray(errorData.errors)) {
          const errorMessages = errorData.errors.map(err => err.msg).join(', ');
          setErrorMessage(errorMessages);
        } else {
          setErrorMessage(errorData.message || 'Failed to update profile.');
        }
        setTimeout(() => setErrorMessage(""), 4000);
        return;
      }

      if (response.ok) {
        // Update session storage and AppContext
        sessionStorage.setItem('firstName', updatedDetails.firstName);
        sessionStorage.setItem('lastName', updatedDetails.lastName);
        sessionStorage.setItem('email', updatedDetails.email);
        setUserName(updatedDetails.firstName);

        // Update local state
        setUserDetails(updatedDetails);
        setEditMode(false);

        // Show success message
        setChanged("Profile updated successfully!");
        setTimeout(() => setChanged(""), 2000);
      } else {
        // Handle validation errors or other server errors
        const errorData = await response.json();
        if (errorData.errors && Array.isArray(errorData.errors)) {
          const errorMessages = errorData.errors.map(err => err.msg).join(', ');
          setChanged(`Error: ${errorMessages}`);
        } else {
          setChanged(`Error: ${errorData.message || "Failed to update profile"}`);
        }
        console.error("Failed to update profile:", errorData);
      }
    } catch (error) {
      // Handle unexpected errors
      setChanged("Unexpected error occurred. Please try again.");
      setTimeout(() => setChanged(""), 4000); // Clear error message from UI
      console.error("Unexpected error:", error);
      const errorMsg = error.message
      setErrorMessage(errorMsg)
    }
  };

  return (

    <div className="profile-container">
      {errorMessage && (
        <div className="alert alert-danger" role="alert">
          {errorMessage}
        </div>
      )}
      {editMode ? (
        <form onSubmit={handleSubmit}>
          <label>
            Email
            <input
              type="email"
              name="email"
              value={updatedDetails.email}
              onChange={handleInputChange}
            // disabled // Keep this field disabled if it should not be updated
            />
          </label>
          <label>
            First Name
            <input
              type="text"
              name="firstName"
              value={updatedDetails.firstName}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Last Name
            <input
              type="text"
              name="lastName"
              value={updatedDetails.lastName}
              onChange={handleInputChange}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}
            />
          </label>
          <button type="submit">Save</button>
        </form>
      ) : (
        <div className="profile-details">
          <h1>
            Hi, {userDetails.firstName} {userDetails.lastName}
          </h1>
          <p>
            <b>Email:</b> {userDetails.email}
          </p>
          <button onClick={handleEdit}>Edit</button>
          <span
            style={{
              color: 'green',
              height: '.5cm',
              display: 'block',
              fontStyle: 'italic',
              fontSize: '12px',
            }}
          >
            {changed}
          </span>
        </div>
      )}
    </div>
  );
};

export default Profile;
