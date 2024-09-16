import React from 'react';
import axios from 'axios';

const FriendList = ({ friends, setFriends }) => {
  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const handleUnfriend = async (friendId) => {
    try {
      await axios.post(`${apiUrl}/api/friends/unfriend`, { friendId }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setFriends(friends.filter(friend => friend._id !== friendId));
    } catch (error) {
      console.error('Error unfriending:', error);
    }
  };

  return (
    <div className="friend-list">
      <h2>Your Friends</h2>
      {friends.length > 0 ? (
        <ul>
          {friends.map((friend) => (
            <li key={friend._id}>
              {friend.firstName} {friend.lastName} ({friend.username})
              <button onClick={() => handleUnfriend(friend._id)}>Unfriend</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>You don't have any friends yet.</p>
      )}
    </div>
  );
};

export default FriendList;