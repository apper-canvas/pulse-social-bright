import mockUsers from "@/services/mockData/users.json";
import mockPosts from "@/services/mockData/posts.json";

export const searchService = {
  async search(query) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const lowerQuery = query.toLowerCase();
    
    // Search users
    const users = mockUsers.filter(user => 
      user.displayName.toLowerCase().includes(lowerQuery) ||
      user.username.toLowerCase().includes(lowerQuery) ||
      (user.bio && user.bio.toLowerCase().includes(lowerQuery))
    );

    // Search posts
    const posts = mockPosts
      .filter(post => 
        post.content.toLowerCase().includes(lowerQuery) ||
        (post.hashtags && post.hashtags.some(tag => 
          tag.toLowerCase().includes(lowerQuery.replace("#", ""))
        ))
      )
      .map(post => {
        const author = mockUsers.find(u => u.Id === post.userId);
        return {
          ...post,
          author: author ? { ...author } : null
        };
      });

    // Search hashtags
    const hashtags = [];
    const hashtagPattern = /#(\w+)/g;
    mockPosts.forEach(post => {
      if (post.hashtags) {
        post.hashtags.forEach(tag => {
          const existing = hashtags.find(h => h.name === tag);
          if (existing) {
            existing.postsCount++;
          } else if (tag.toLowerCase().includes(lowerQuery.replace("#", ""))) {
            hashtags.push({
              name: tag,
              postsCount: 1
            });
          }
        });
      }
    });

    return {
      users: users.slice(0, 20),
      posts: posts.slice(0, 20),
      hashtags: hashtags.slice(0, 10)
    };
  }
};