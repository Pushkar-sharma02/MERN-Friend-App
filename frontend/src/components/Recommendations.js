import React from 'react';
import axios from 'axios';

const Recommendations = ({ recommendations, setRecommendations }) => {
  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const handleSendFriendRequest = async (friendId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${apiUrl}/api/friends/request`, { friendId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRecommendations(recommendations.map(user => 
        user._id === friendId ? { ...user, requestSent: true } : user
      ));
    } catch (error) {
      console.error('Error sending friend request:', error);
    }
  };

  return (
    <div className="recommendations">
      <h2>Friend Recommendations</h2>
      {recommendations.length > 0 ? (
        <ul>
          {recommendations.map(user => (
            <li key={user._id}>
              <span>{user.firstName} {user.lastName} ({user.username})</span>
              {!user.requestSent && (
                <button onClick={() => handleSendFriendRequest(user._id)}>
                  Send Friend Request
                </button>
              )}
              {user.requestSent && <span>Friend Request Sent</span>}
            </li>
          ))}
        </ul>
      ) : (
        <p>No recommendations at the moment.</p>
      )}
    </div>
  );
};

export default Recommendations;