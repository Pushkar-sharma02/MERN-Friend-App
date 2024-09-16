import React, { useState } from 'react';
import axios from 'axios';

const SearchUser = ({ setFriends }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const searchRes = await axios.get(`${apiUrl}/api/friends/search`, {
        params: { query: searchQuery },
        headers: { Authorization: `Bearer ${token}` }
      });
      setSearchResults(searchRes.data);
    } catch (error) {
      console.error('Error searching users:', error);
    }
  };

  const handleSendFriendRequest = async (friendId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${apiUrl}/api/friends/request`, { friendId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSearchResults(searchResults.map(user => 
        user._id === friendId ? { ...user, requestSent: true } : user
      ));
    } catch (error) {
      console.error('Error sending friend request:', error);
    }
  };

  return (
    <div className="search-section">
      <h2>Search for Friends</h2>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search users..."
        />
        <button type="submit">Search</button>
      </form>
      {searchResults.length > 0 && (
        <ul>
          {searchResults.map(user => (
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
      )}
    </div>
  );
};

export default SearchUser;