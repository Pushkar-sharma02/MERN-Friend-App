import React from 'react';
import axios from 'axios';

const FriendRequests = ({ requests, setFriendRequests, setFriends }) => {
  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const handleRequest = async (requestId, action) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${apiUrl}/api/friends/${action}`, 
        { requestId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (action === 'accept') {
        setFriends(prevFriends => [...prevFriends, response.data.friend]);
      }

      setFriendRequests(prevRequests => prevRequests.filter(request => request._id !== requestId));
    } catch (error) {
      console.error(`Error ${action}ing friend request:`, error);
    }
  };

  return (
    <div className="friend-requests">
      <h2>Friend Requests</h2>
      {requests.length > 0 ? (
        <ul>
          {requests.map(request => (
            <li key={request._id}>
              {request.username}
              <button className="accept-button" onClick={() => handleRequest(request._id, 'accept')}>Accept</button>
              <button className="reject-button" onClick={() => handleRequest(request._id, 'reject')}>Reject</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No pending friend requests</p>
      )}
    </div>
  );
};

export default FriendRequests;