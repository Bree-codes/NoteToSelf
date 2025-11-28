// Trickle Database SDK
const Trickle = {
  async listObjects(tableName, limit = 100, includeData = true) {
    // Mock implementation for demo purposes
    // In a real app, this would make API calls to Trickle's servers
    const stored = localStorage.getItem(`trickle_${tableName}`);
    const items = stored ? JSON.parse(stored) : [];
    return { items };
  },

  async createObject(tableName, data) {
    // Mock implementation for demo purposes
    const stored = localStorage.getItem(`trickle_${tableName}`);
    const items = stored ? JSON.parse(stored) : [];
    const newObject = {
      objectId: Date.now().toString(),
      objectData: data,
      createdAt: new Date().toISOString()
    };
    items.push(newObject);
    localStorage.setItem(`trickle_${tableName}`, JSON.stringify(items));
    return newObject;
  }
};

// Global functions for backward compatibility
window.trickleListObjects = Trickle.listObjects;
window.trickleCreateObject = Trickle.createObject;
