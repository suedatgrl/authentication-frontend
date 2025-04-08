import React, { useState, useEffect } from 'react';
import AuthService from '../services/AuthService';

function UserProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await AuthService.getCurrentUser();
        setUser(userData);
        setLoading(false);
      } catch (err) {
        setError('Failed to load user data');
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="user-profile">
      <h2>User Profile</h2>
      {user && (
        <div>
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Authenticated:</strong> {user.authenticated ? 'Yes' : 'No'}</p>
          <p><strong>Authorities:</strong></p>
          <ul>
            {user.authorities && user.authorities.map((auth, index) => (
              <li key={index}>{auth}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default UserProfile;