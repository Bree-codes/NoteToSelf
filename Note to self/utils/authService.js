const AuthService = {
  async signup(name, email, password) {
    const users = await trickleListObjects('user', 100, true);
    const existingUser = users.items.find(u => u.objectData.email === email);
    
    if (existingUser) {
      throw new Error('Email already registered');
    }

    const user = await trickleCreateObject('user', {
      name,
      email,
      password: btoa(password),
      createdAt: new Date().toISOString()
    });

    localStorage.setItem('currentUser', JSON.stringify({
      id: user.objectId,
      name: user.objectData.name,
      email: user.objectData.email
    }));

    return { id: user.objectId, name: user.objectData.name, email: user.objectData.email };
  },

  async login(email, password) {
    const users = await trickleListObjects('user', 100, true);
    const user = users.items.find(u => 
      u.objectData.email === email && u.objectData.password === btoa(password)
    );

    if (!user) {
      throw new Error('Invalid email or password');
    }

    localStorage.setItem('currentUser', JSON.stringify({
      id: user.objectId,
      name: user.objectData.name,
      email: user.objectData.email
    }));

    return { id: user.objectId, name: user.objectData.name, email: user.objectData.email };
  },

  logout() {
    localStorage.removeItem('currentUser');
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
  }
};