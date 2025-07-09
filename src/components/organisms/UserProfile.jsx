import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Avatar from "@/components/atoms/Avatar";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import PostList from "@/components/organisms/PostList";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import { usersService } from "@/services/api/usersService";
import { followsService } from "@/services/api/followsService";
import { formatDistanceToNow } from "date-fns";

const UserProfile = ({ currentUser }) => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [postsCount, setPostsCount] = useState(0);

  const loadUser = async () => {
    try {
      setLoading(true);
      setError("");
      
      const userData = await usersService.getByUsername(username);
      setUser(userData);
      
      // Load follow stats
      const [followers, following] = await Promise.all([
        followsService.getFollowers(userData.id),
        followsService.getFollowing(userData.id)
      ]);
      
      setFollowersCount(followers.length);
      setFollowingCount(following.length);
      setPostsCount(userData.postsCount || 0);
      
      // Check if current user is following this user
      if (currentUser && currentUser.id !== userData.id) {
        const isFollowingUser = followers.some(
          follow => follow.followerId === currentUser.id
        );
        setIsFollowing(isFollowingUser);
      }
    } catch (err) {
      setError(err.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (username) {
      loadUser();
    }
  }, [username, currentUser]);

  const handleFollow = async () => {
    if (!currentUser) {
      toast.error("Please log in to follow users");
      return;
    }

    try {
      if (isFollowing) {
        await followsService.unfollow(currentUser.id, user.id);
        setIsFollowing(false);
        setFollowersCount(prev => prev - 1);
        toast.success(`Unfollowed ${user.displayName}`);
      } else {
        await followsService.follow(currentUser.id, user.id);
        setIsFollowing(true);
        setFollowersCount(prev => prev + 1);
        toast.success(`Following ${user.displayName}`);
      }
    } catch (error) {
      toast.error("Failed to update follow status");
    }
  };

  const handleMessage = () => {
    // Navigate to messages with this user
    navigate(`/messages/${user.id}`);
  };

  if (loading) {
    return <Loading type="profile" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadUser} type="notfound" />;
  }

  if (!user) {
    return <Error message="User not found" type="notfound" />;
  }

  const isOwnProfile = currentUser?.id === user.id;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
      >
        {/* Cover Image */}
        <div className="h-48 bg-gradient-to-r from-primary via-secondary to-accent"></div>
        
        {/* Profile Info */}
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <Avatar
                src={user.avatar}
                alt={user.displayName}
                size="2xl"
                className="-mt-12 ring-4 ring-white"
              />
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {user.displayName}
                  </h1>
                  {user.isVerified && (
                    <ApperIcon name="BadgeCheck" className="w-6 h-6 text-blue-500" />
                  )}
                </div>
                <p className="text-gray-600 mb-2">@{user.username}</p>
                {user.bio && (
                  <p className="text-gray-700 max-w-md">{user.bio}</p>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {!isOwnProfile && (
                <>
                  <Button
                    variant="secondary"
                    onClick={handleMessage}
                    className="flex items-center gap-2"
                  >
                    <ApperIcon name="MessageCircle" className="w-4 h-4" />
                    Message
                  </Button>
                  <Button
                    variant={isFollowing ? "secondary" : "primary"}
                    onClick={handleFollow}
                    className="flex items-center gap-2"
                  >
                    <ApperIcon 
                      name={isFollowing ? "UserCheck" : "UserPlus"} 
                      className="w-4 h-4" 
                    />
                    {isFollowing ? "Following" : "Follow"}
                  </Button>
                </>
              )}
              
              {isOwnProfile && (
                <Button
                  variant="secondary"
                  onClick={() => navigate("/profile/edit")}
                  className="flex items-center gap-2"
                >
                  <ApperIcon name="Edit" className="w-4 h-4" />
                  Edit Profile
                </Button>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <ApperIcon name="Calendar" className="w-4 h-4" />
            <span>
              Joined {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}
            </span>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-xl font-bold text-gray-900">{postsCount}</p>
              <p className="text-sm text-gray-600">Posts</p>
            </div>
            <div className="text-center cursor-pointer hover:text-primary transition-colors">
              <p className="text-xl font-bold text-gray-900">{followersCount}</p>
              <p className="text-sm text-gray-600">Followers</p>
            </div>
            <div className="text-center cursor-pointer hover:text-primary transition-colors">
              <p className="text-xl font-bold text-gray-900">{followingCount}</p>
              <p className="text-sm text-gray-600">Following</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Posts Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Posts</h2>
          <PostList
            userId={user.id}
            type="user"
            currentUser={currentUser}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default UserProfile;