const express = require('express');
const User = require('../models/User');
const router = express.Router();

// Search for users
router.get('/search', async (req, res) => {
  const query = req.query.query;
  const users = await User.find({ 
    $or: [
      { username: { $regex: query, $options: 'i' } },
      { email: { $regex: query, $options: 'i' } },
      { firstName: { $regex: query, $options: 'i' } },
      { lastName: { $regex: query, $options: 'i' } }
    ]
  }).select('-password');
  res.json(users);
});

router.get('/recommendations', async (req, res) => {
  try {
    const userId = req.user._id; //authentication middleware that sets req.user
    const currentUser = await User.findById(userId);

    if (!currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // IDs of current friends and sent requests
    const friendAndRequestIds = [
      ...currentUser.friends,
      ...currentUser.sentRequests,
      ...currentUser.friendRequests,
      userId // Include the current user's ID to exclude from recommendations
    ];

    // Find users who are not friends or haven't been sent/received requests
    const recommendations = await User.find({
      _id: { $nin: friendAndRequestIds }
    })
    .select('username firstName lastName') // Select only necessary fields
    .limit(10); // Limit to 10 recommendations

    res.json(recommendations);
  } catch (error) {
    console.error('Error fetching friend recommendations:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
// Fetch friends for a user
router.get('/', async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('friends', '-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user.friends);
  } catch (error) {
    console.error('Error fetching friends:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Send a friend request
router.post('/request', async (req, res) => {
  try {
    const { friendId } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    if (!user || !friend) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isFriendsWith(friendId)) {
      return res.status(400).json({ message: 'Already friends' });
    }

    if (friend.hasFriendRequestFrom(userId)) {
      return res.status(400).json({ message: 'Friend request already sent' });
    }

    user.sentRequests.push(friendId);
    friend.friendRequests.push(userId);

    await user.save();
    await friend.save();

    res.json({ message: 'Friend request sent' });
  } catch (error) {
    console.error('Error sending friend request:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
router.get('/requests', async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).populate('friendRequests', 'username firstName lastName');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user.friendRequests);
  } catch (error) {
    console.error('Error fetching friend requests:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
//accept friend request
router.post('/accept', async (req, res) => {
  try {
    const { requestId } = req.body;
    const user = await User.findById(req.user._id);
    const requester = await User.findById(requestId);

    if (!user || !requester) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.friends.push(requestId);
    requester.friends.push(user._id);
    user.friendRequests = user.friendRequests.filter(id => id.toString() !== requestId);
    requester.sentRequests = requester.sentRequests.filter(id => id.toString() !== user._id.toString());

    await user.save();
    await requester.save();

    res.json({ message: 'Friend request accepted', friend: requester });
  } catch (error) {
    console.error('Error accepting friend request:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Reject friend request
router.post('/reject', async (req, res) => {
  try {
    const { requestId } = req.body;
    const user = await User.findById(req.user._id);
    const requester = await User.findById(requestId);

    if (!user || !requester) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.friendRequests = user.friendRequests.filter(id => id.toString() !== requestId);
    requester.sentRequests = requester.sentRequests.filter(id => id.toString() !== user._id.toString());

    await user.save();
    await requester.save();

    res.json({ message: 'Friend request rejected' });
  } catch (error) {
    console.error('Error rejecting friend request:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
router.post('/unfriend', async (req, res) => {
  try {
    const { friendId } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    if (!user || !friend) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Remove friend from user's friend list
    user.friends = user.friends.filter(id => id.toString() !== friendId);
    
    // Remove user from friend's friend list
    friend.friends = friend.friends.filter(id => id.toString() !== userId.toString());

    await user.save();
    await friend.save();

    res.json({ message: 'Friend removed successfully' });
  } catch (error) {
    console.error('Error unfriending:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
module.exports = router;