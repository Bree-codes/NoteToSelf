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

function ProfileApp() {
  try {
    const [currentUser, setCurrentUser] = React.useState(null);
    const [isDarkMode, setIsDarkMode] = React.useState(false);
    const [exporting, setExporting] = React.useState(false);

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

    const handleExport = async () => {
      setExporting(true);
      try {
        const entries = await trickleListObjects(`journal:${currentUser.id}`, 100, true);
        let text = `Journal Export - ${currentUser.name}\n\n`;
        
        entries.items.forEach(entry => {
          text += `Date: ${new Date(entry.objectData.date).toLocaleDateString()}\n`;
          text += `Mood: ${entry.objectData.mood || 'Not recorded'}\n`;
          text += `Entry: ${entry.objectData.entry}\n`;
          if (entry.objectData.gratitude?.length) {
            text += `Gratitude: ${entry.objectData.gratitude.join(', ')}\n`;
          }
          text += '\n---\n\n';
        });

        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'my-journal-export.txt';
        a.click();
      } catch (error) {
        console.error('Export error:', error);
      } finally {
        setExporting(false);
      }
    };

    if (!currentUser) return null;

    return (
      <div className="min-h-screen" data-name="profile-app" data-file="profile-app.js">
        <Navigation 
          currentUser={currentUser} 
          onLogout={handleLogout}
          isDarkMode={isDarkMode}
          onToggleTheme={toggleTheme}
        />
        
        <main className="container mx-auto px-4 py-8 max-w-3xl mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-center" style={{color: 'var(--primary-color)'}}>
            Profile Settings
          </h1>

          <div className="card mb-6">
            <h2 className="text-2xl font-semibold mb-4">Account Information</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm opacity-70 mb-1">Name</label>
                <p className="text-lg font-medium">{currentUser.name}</p>
              </div>
              <div>
                <label className="block text-sm opacity-70 mb-1">Email</label>
                <p className="text-lg font-medium">{currentUser.email}</p>
              </div>
            </div>
          </div>

          <div className="card mb-6">
            <h2 className="text-2xl font-semibold mb-4">Preferences</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium mb-1">Dark Mode</p>
                <p className="text-sm opacity-70">Switch between light and dark theme</p>
              </div>
              <button onClick={toggleTheme} className="btn-primary">
                {isDarkMode ? 'Light Mode' : 'Dark Mode'}
              </button>
            </div>
          </div>

          <div className="card">
            <h2 className="text-2xl font-semibold mb-4">Export Data</h2>
            <p className="mb-4 opacity-80">Download all your journal entries as a text file</p>
            <button onClick={handleExport} disabled={exporting} className="btn-primary">
              {exporting ? 'Exporting...' : 'Export Journal'}
            </button>
          </div>
        </main>
      </div>
    );
  } catch (error) {
    console.error('ProfileApp error:', error);
    return null;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<ErrorBoundary><ProfileApp /></ErrorBoundary>);