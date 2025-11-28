function AuthModal({ onClose, onLogin }) {
  try {
    const [isLogin, setIsLogin] = React.useState(true);
    const [formData, setFormData] = React.useState({
      name: '',
      email: '',
      password: ''
    });
    const [error, setError] = React.useState('');

    const handleSubmit = async (e) => {
      e.preventDefault();
      setError('');

      try {
        let user;
        if (isLogin) {
          user = await AuthService.login(formData.email, formData.password);
        } else {
          user = await AuthService.signup(formData.name, formData.email, formData.password);
        }
        onLogin(user);
        window.location.reload();
      } catch (err) {
        setError(err.message);
      }
    };

    return (
      <div className="fixed inset-0 flex items-center justify-center p-4" style={{
        backgroundImage: 'url(https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=1920&q=80)',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }} data-name="auth-modal" data-file="components/AuthModal.js">
        <div className="absolute inset-0" style={{backgroundColor: 'rgba(15, 23, 42, 0.85)'}}></div>
        <div className="card max-w-md w-full relative z-10 shadow-2xl">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">💙</div>
            <h2 className="text-3xl font-bold mb-2">Note to Self</h2>
            <p className="opacity-80">Your personal wellness sanctuary 🌙</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block mb-2 font-medium">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border"
                  style={{borderColor: 'var(--border-color)', backgroundColor: 'var(--card-background)'}}
                  required
                />
              </div>
            )}

            <div>
              <label className="block mb-2 font-medium">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border"
                style={{borderColor: 'var(--border-color)', backgroundColor: 'var(--card-background)'}}
                required
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border"
                style={{borderColor: 'var(--border-color)', backgroundColor: 'var(--card-background)'}}
                required
              />
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-100 text-red-700">
                {error}
              </div>
            )}

            <button type="submit" className="w-full btn-primary">
              {isLogin ? 'Login' : 'Sign Up'}
            </button>
          </form>

          <div className="text-center mt-4">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="opacity-80 hover:opacity-100"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Login"}
            </button>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('AuthModal component error:', error);
    return null;
  }
}