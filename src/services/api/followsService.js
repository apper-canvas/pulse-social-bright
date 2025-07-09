import mockFollows from "@/services/mockData/follows.json";

export const followsService = {
  async getFollowers(userId) {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockFollows.filter(f => f.followingId === parseInt(userId));
  },

  async getFollowing(userId) {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockFollows.filter(f => f.followerId === parseInt(userId));
  },

  async follow(followerId, followingId) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const newFollow = {
      Id: Math.max(...mockFollows.map(f => f.Id), 0) + 1,
      followerId: parseInt(followerId),
      followingId: parseInt(followingId),
      createdAt: new Date().toISOString()
    };
    mockFollows.push(newFollow);
    return { ...newFollow };
  },

  async unfollow(followerId, followingId) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = mockFollows.findIndex(f => 
      f.followerId === parseInt(followerId) && f.followingId === parseInt(followingId)
    );
    if (index === -1) {
      throw new Error("Follow relationship not found");
    }
    mockFollows.splice(index, 1);
    return true;
  }
};