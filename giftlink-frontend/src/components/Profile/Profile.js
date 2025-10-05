import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './Profile.css'
import {urlConfig} from '../../config';
import { useAppContext } from '../../context/AuthContext';

const Profile = () => {
  const [userDetails, setUserDetails] = useState({});
 const [updatedDetails, setUpdatedDetails] = useState({});
 const {setUserName} = useAppContext();
 const [changed, setChanged] = useState("");

 const [editMode, setEditMode] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const authtoken = sessionStorage.getItem("auth-token");
    if (!authtoken) {
      navigate("/app/login");
    } else {
      fetchUserProfile();
    }
  }, [navigate]);

  const fetchUserProfile = async () => {
    try {
      const authtoken = sessionStorage.getItem("auth-token");
      const email = sessionStorage.getItem("email");
      const name=sessionStorage.getItem('name');
      if (name || authtoken) {
                const storedUserDetails = {
                  name: name,
                  email:email
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
setUpdatedDetails({
  ...updatedDetails,
  [e.target.name]: e.target.value,
});
};
const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const authtoken = sessionStorage.getItem("auth-token");
    const email = sessionStorage.getItem("email");

    if (!authtoken || !email) {
      navigate("/app/login");
      return;
    }

    const payload = { ...updatedDetails };
    const response = await fetch(`${urlConfig.backendUrl}/api/auth/update`, {
      method: "PUT",//Step 1: Task 1
      headers: {//Step 1: Task 2
        "Authorization": `Bearer ${authtoken}`,
        "Content-Type": "application/json",
        "Email": email,
      },
      body: JSON.stringify(payload),//Step 1: Task 3
    });

    if (response.ok) {
      // Update the user details in session storage
      setUserName(updatedDetails.name);//Step 1: Task 4
      sessionStorage.setItem("name", updatedDetails.name);//Step 1: Task 5
      setUserDetails(updatedDetails);
      setEditMode(false);
      // Display success message to the user
      setChanged("Name Changed Successfully!");
      setTimeout(() => {
        setChanged("");
        navigate("/");
      }, 1000);

    } else {
      // Handle error case
      throw new Error("Failed to update profile");
    }
  } catch (error) {
    console.error(error);
    // Handle error case
  }
};

return (
<div className="container">
  <div className="card profile-container">
    {editMode ? (
    <form onSubmit={handleSubmit}>
    <div className="card-header">
      <h2 className="card-title">Edit Profile</h2>
    </div>
    <div className="card-body">
      <div className="form-group">
        <label className="form-label" htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          className="form-control"
          name="email"
          value={userDetails.email}
          disabled // Disable the email field
        />
      </div>
      <div className="form-group">
        <label className="form-label" htmlFor="name">Name</label>
        <input
          id="name"
          type="text"
          className="form-control"
          name="name"
          value={updatedDetails.name}
          onChange={handleInputChange}
        />
      </div>
    </div>
    <div className="card-footer">
      <button type="submit" className="btn btn-primary">Save Changes</button>
    </div>
    </form>
    ) : (
    <div>
      <div className="card-header">
        <h2 className="card-title">Your Profile</h2>
      </div>
      <div className="card-body profile-details">
        <h3 className="card-title">Hi, {userDetails.name}</h3>
        <p className="card-text"><strong>Email:</strong> {userDetails.email}</p>
        <button className="btn btn-primary" onClick={handleEdit}>Edit Profile</button>
        {changed && (
          <div className="alert alert-success mt-3">{changed}</div>
        )}
      </div>
    </div>
    )}
  </div>
</div>
);
};

export default Profile;