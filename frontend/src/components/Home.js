import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import FriendList from './FriendList';
import FriendRequests from './FriendRequests';
import Recommendations from './Recommendations';
import SearchUser from './SearchUser';
import '../App.css';

const Home = () => {
  const [friends, setFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        const [friendsRes, requestsRes, recommendationsRes] = await Promise.all([
          axios.get(`${apiUrl}/api/friends`, { headers }),
          axios.get(`${apiUrl}/api/friends/requests`, { headers }),
          axios.get(`${apiUrl}/api/friends/recommendations`, { headers })
        ]);

        setFriends(friendsRes.data);
        setFriendRequests(requestsRes.data);
        setRecommendations(recommendationsRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [apiUrl]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="container">
      <h1>Hello user, Welcome to Your Dashboard</h1>
      <button className="logout-button" onClick={handleLogout}>Logout</button>
      <div className="home">
        <div className="left-column">
          <FriendRequests 
            requests={friendRequests} 
            setFriendRequests={setFriendRequests} 
            setFriends={setFriends} 
          />
          <Recommendations 
            recommendations={recommendations} 
            setRecommendations={setRecommendations}
          />
        </div>
        <div className="right-column">
          <FriendList friends={friends} setFriends={setFriends} />
          <SearchUser setFriends={setFriends} />
        </div>
      </div>
    </div>
  );
};

export default Home;