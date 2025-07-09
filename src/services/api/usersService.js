import mockUsers from "@/services/mockData/users.json";

export const usersService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...mockUsers];
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const user = mockUsers.find(u => u.Id === parseInt(id));
    if (!user) {
      throw new Error("User not found");
    }
    return { ...user };
  },

  async getByUsername(username) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const user = mockUsers.find(u => u.username === username);
    if (!user) {
      throw new Error("User not found");
    }
    return { ...user };
  },

  async getSuggested(currentUserId) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockUsers
      .filter(u => u.Id !== parseInt(currentUserId))
      .slice(0, 5)
      .map(u => ({ ...u }));
  },

  async create(userData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const maxId = Math.max(...mockUsers.map(u => u.Id));
    const newUser = {
      Id: maxId + 1,
      ...userData,
      createdAt: new Date().toISOString()
    };
    mockUsers.push(newUser);
    return { ...newUser };
  },

  async update(id, userData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = mockUsers.findIndex(u => u.Id === parseInt(id));
    if (index === -1) {
      throw new Error("User not found");
    }
    mockUsers[index] = { ...mockUsers[index], ...userData };
    return { ...mockUsers[index] };
  },

async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = mockUsers.findIndex(u => u.Id === parseInt(id));
    if (index === -1) {
      throw new Error("User not found");
    }
    mockUsers.splice(index, 1);
    return true;
  },

  async updateOnlineStatus(id, isOnline) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const index = mockUsers.findIndex(u => u.Id === parseInt(id));
    if (index === -1) {
      throw new Error("User not found");
    }
    mockUsers[index].isOnline = isOnline;
    mockUsers[index].lastSeen = new Date().toISOString();
    return { ...mockUsers[index] };
  }
};