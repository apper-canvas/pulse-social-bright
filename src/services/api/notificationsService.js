import mockNotifications from "@/services/mockData/notifications.json";
import mockUsers from "@/services/mockData/users.json";

export const notificationsService = {
  async getByUserId(userId) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockNotifications
      .filter(n => n.userId === parseInt(userId))
      .map(notification => {
        const actor = mockUsers.find(u => u.Id === notification.actorId);
        return {
          ...notification,
          actor: actor ? { ...actor } : null
        };
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  async markAsRead(notificationId) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const notification = mockNotifications.find(n => n.Id === parseInt(notificationId));
    if (!notification) {
      throw new Error("Notification not found");
    }
    notification.read = true;
    return { ...notification };
  },

  async markAllAsRead(userId) {
    await new Promise(resolve => setTimeout(resolve, 300));
    mockNotifications
      .filter(n => n.userId === parseInt(userId))
      .forEach(n => n.read = true);
    return true;
  },

  async create(notificationData) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const maxId = Math.max(...mockNotifications.map(n => n.Id));
    const newNotification = {
      Id: maxId + 1,
      ...notificationData,
      read: false,
      createdAt: new Date().toISOString()
    };
    mockNotifications.push(newNotification);
    return { ...newNotification };
  }
};