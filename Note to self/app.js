class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
            <p className="mb-4">We're sorry, but something unexpected happened.</p>
            <button onClick={() => window.location.reload()} className="btn-primary">
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  try {
    const [currentUser, setCurrentUser] = React.useState(null);
    const [showAuthModal, setShowAuthModal] = React.useState(false);
    const [isDarkMode, setIsDarkMode] = React.useState(false);
    const [affirmation, setAffirmation] = React.useState('');

    const affirmations = [
      "You are enough, just as you are.",
      "Every day is a fresh start.",
      "Your feelings are valid and important.",
      "You deserve peace and happiness.",
      "Progress, not perfection.",
      "You are worthy of love and kindness.",
      "Take it one breath at a time.",
      "You are stronger than you think."
    ];

    React.useEffect(() => {
      const user = AuthService.getCurrentUser();
      setCurrentUser(user);
      
      const theme = localStorage.getItem('theme') || 'dark';
      setIsDarkMode(theme === 'dark');
      document.documentElement.setAttribute('data-theme', theme);

      const randomAffirmation = affirmations[Math.floor(Math.random() * affirmations.length)];
      setAffirmation(randomAffirmation);
    }, []);

    const toggleTheme = () => {
      const newTheme = isDarkMode ? 'light' : 'dark';
      setIsDarkMode(!isDarkMode);
      localStorage.setItem('theme', newTheme);
      document.documentElement.setAttribute('data-theme', newTheme);
    };

    const handleLogout = () => {
      AuthService.logout();
      setCurrentUser(null);
      window.location.reload();
    };

    if (!currentUser) {
      return <AuthModal onClose={() => {}} onLogin={setCurrentUser} />;
    }

    return (
      <div className="min-h-screen" data-name="app" data-file="app.js">
        <Navigation 
          currentUser={currentUser} 
          onLogout={handleLogout}
          isDarkMode={isDarkMode}
          onToggleTheme={toggleTheme}
        />
        
        <main className="container mx-auto px-4 py-8 max-w-6xl mb-8">
          <div className="text-center mb-12 space-y-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4" style={{color: 'var(--primary-color)'}}>
              Welcome back, {currentUser.name}
            </h1>
            <p className="text-lg sm:text-xl opacity-80">Your safe space for reflection and growth</p>
          </div>

          <div className="card mb-8 text-center py-8">
            <div className="text-6xl mb-4">✨</div>
            <h2 className="text-2xl font-semibold mb-3">Today's Affirmation</h2>
            <p className="text-xl italic mb-4">{affirmation}</p>
            <button 
              onClick={() => setAffirmation(affirmations[Math.floor(Math.random() * affirmations.length)])}
              className="btn-primary"
            >
              Get New Affirmation 🌟
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
            <div className="card hover:shadow-lg transition-all cursor-pointer" onClick={() => window.location.href = 'journal.html'}>
              <div className="flex flex-col items-center text-center gap-3">
                <div className="text-5xl">📝</div>
                <h3 className="text-xl font-semibold">Daily Journal</h3>
                <p className="opacity-80 text-sm">Write your thoughts and track your mood</p>
              </div>
            </div>

            <div className="card hover:shadow-lg transition-all cursor-pointer" onClick={() => window.location.href = 'past-journals.html'}>
              <div className="flex flex-col items-center text-center gap-3">
                <div className="text-5xl">📖</div>
                <h3 className="text-xl font-semibold">Past Journals</h3>
                <p className="opacity-80 text-sm">Review your previous entries</p>
              </div>
            </div>

            <div className="card hover:shadow-lg transition-all cursor-pointer" onClick={() => window.location.href = 'insights.html'}>
              <div className="flex flex-col items-center text-center gap-3">
                <div className="text-5xl">📊</div>
                <h3 className="text-xl font-semibold">Wellness Insights</h3>
                <p className="opacity-80 text-sm">View your mood patterns</p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <button 
              onClick={() => window.location.href = 'journal.html'}
              className="btn-primary text-lg px-8 py-4"
            >
              Start Journaling
            </button>
          </div>
        </main>
      </div>
    );
  } catch (error) {
    console.error('App component error:', error);
    return null;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);