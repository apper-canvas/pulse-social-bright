import mockPosts from "@/services/mockData/posts.json";
import mockUsers from "@/services/mockData/users.json";

export const postsService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockPosts.map(post => {
      const author = mockUsers.find(u => u.Id === post.userId);
      return {
        ...post,
        author: author ? { ...author } : null
      };
    }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const post = mockPosts.find(p => p.Id === parseInt(id));
    if (!post) {
      throw new Error("Post not found");
    }
    const author = mockUsers.find(u => u.Id === post.userId);
    return {
      ...post,
      author: author ? { ...author } : null
    };
  },

  async getByUserId(userId) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockPosts
      .filter(p => p.userId === parseInt(userId))
      .map(post => {
        const author = mockUsers.find(u => u.Id === post.userId);
        return {
          ...post,
          author: author ? { ...author } : null
        };
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  async getTrending() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockPosts
      .map(post => {
        const author = mockUsers.find(u => u.Id === post.userId);
        return {
          ...post,
          author: author ? { ...author } : null
        };
      })
      .sort((a, b) => b.likes - a.likes)
      .slice(0, 10);
  },

  async create(postData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const maxId = Math.max(...mockPosts.map(p => p.Id));
    const newPost = {
      Id: maxId + 1,
      userId: 1, // Mock current user ID
      content: postData.content,
      media: postData.media || [],
      hashtags: postData.hashtags || [],
      likes: 0,
      comments: 0,
      isLiked: false,
      createdAt: new Date().toISOString()
    };
    mockPosts.push(newPost);
    return { ...newPost };
  },

  async update(id, postData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = mockPosts.findIndex(p => p.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Post not found");
    }
    mockPosts[index] = { ...mockPosts[index], ...postData };
    return { ...mockPosts[index] };
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = mockPosts.findIndex(p => p.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Post not found");
    }
    mockPosts.splice(index, 1);
    return true;
  },

  async toggleLike(postId, isLiked) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const post = mockPosts.find(p => p.Id === parseInt(postId));
    if (!post) {
      throw new Error("Post not found");
    }
    
    post.likes = isLiked ? post.likes + 1 : post.likes - 1;
    post.isLiked = isLiked;
    
    return { ...post };
  }
};