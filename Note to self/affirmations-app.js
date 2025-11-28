class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
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
            <button onClick={() => window.location.reload()} className="btn-primary">Reload</button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function AffirmationsApp() {
  try {
    const [currentUser, setCurrentUser] = React.useState(null);
    const [isDarkMode, setIsDarkMode] = React.useState(false);
    const [featured, setFeatured] = React.useState('');

    const affirmations = [
      "You are enough, just as you are.",
      "Every day is a fresh start.",
      "Your feelings are valid and important.",
      "You deserve peace and happiness.",
      "Progress, not perfection.",
      "You are worthy of love and kindness.",
      "Take it one breath at a time.",
      "You are stronger than you think.",
      "It's okay to ask for help.",
      "You are doing the best you can.",
      "Your mental health matters.",
      "You have the power to create change.",
      "Rest is productive.",
      "You are not alone in this journey.",
      "Small steps lead to big changes.",
      "You deserve compassion, especially from yourself."
    ];

    React.useEffect(() => {
      const user = AuthService.getCurrentUser();
      if (!user) {
        window.location.href = 'index.html';
        return;
      }
      setCurrentUser(user);
      
      const theme = localStorage.getItem('theme') || 'dark';
      setIsDarkMode(theme === 'dark');
      document.documentElement.setAttribute('data-theme', theme);

      setFeatured(affirmations[Math.floor(Math.random() * affirmations.length)]);
    }, []);

    const toggleTheme = () => {
      const newTheme = isDarkMode ? 'light' : 'dark';
      setIsDarkMode(!isDarkMode);
      localStorage.setItem('theme', newTheme);
      document.documentElement.setAttribute('data-theme', newTheme);
    };

    const handleLogout = () => {
      AuthService.logout();
      window.location.href = 'index.html';
    };

    if (!currentUser) return null;

    return (
      <div className="min-h-screen" data-name="affirmations-app" data-file="affirmations-app.js">
        <Navigation 
          currentUser={currentUser} 
          onLogout={handleLogout}
          isDarkMode={isDarkMode}
          onToggleTheme={toggleTheme}
        />
        
        <main className="container mx-auto px-4 py-8 max-w-5xl mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-center" style={{color: 'var(--primary-color)'}}>
            Affirmations Library
          </h1>

          <div className="card mb-12 text-center py-12">
            <div className="text-6xl mb-6">✨</div>
            <p className="text-3xl italic mb-6 font-light">{featured}</p>
            <button 
              onClick={() => setFeatured(affirmations[Math.floor(Math.random() * affirmations.length)])}
              className="btn-primary"
            >
              Get New Affirmation
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {affirmations.map((affirmation, index) => (
              <div key={index} className="card hover:shadow-lg transition-all">
                <p className="text-lg">{affirmation}</p>
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  } catch (error) {
    console.error('AffirmationsApp error:', error);
    return null;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<ErrorBoundary><AffirmationsApp /></ErrorBoundary>);