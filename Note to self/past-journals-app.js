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

function PastJournalsApp() {
  try {
    const [currentUser, setCurrentUser] = React.useState(null);
    const [isDarkMode, setIsDarkMode] = React.useState(false);
    const [entries, setEntries] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [selectedEntry, setSelectedEntry] = React.useState(null);

    const moodEmojis = {
      'Amazing': '😊',
      'Good': '😄',
      'Okay': '😐',
      'Low': '😔',
      'Difficult': '😢'
    };

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

      loadEntries(user.id);
    }, []);

    const loadEntries = async (userId) => {
      try {
        const result = await trickleListObjects(`journal:${userId}`, 100, true);
        setEntries(result.items);
      } catch (error) {
        console.error('Error loading entries:', error);
      } finally {
        setLoading(false);
      }
    };

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
      <div className="min-h-screen" data-name="past-journals-app" data-file="past-journals-app.js">
        <Navigation 
          currentUser={currentUser} 
          onLogout={handleLogout}
          isDarkMode={isDarkMode}
          onToggleTheme={toggleTheme}
        />
        
        <main className="container mx-auto px-4 py-8 max-w-5xl mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-center" style={{color: 'var(--primary-color)'}}>
            📖 Past Journals
          </h1>

          {loading ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">⏳</div>
              <p className="text-xl opacity-80">Loading your journals...</p>
            </div>
          ) : entries.length === 0 ? (
            <div className="card text-center py-12">
              <div className="text-6xl mb-4">📝</div>
              <h2 className="text-2xl font-semibold mb-4">No Journals Yet</h2>
              <p className="mb-6 opacity-80">Start your journaling journey today!</p>
              <button onClick={() => window.location.href = 'journal.html'} className="btn-primary">
                Write Your First Entry
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {entries.map((entry) => (
                <div 
                  key={entry.objectId}
                  className="card hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => setSelectedEntry(entry)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-2xl">{moodEmojis[entry.objectData.mood] || '💭'}</span>
                        <div>
                          <p className="font-semibold text-lg">{entry.objectData.mood || 'No mood recorded'}</p>
                          <p className="text-sm opacity-70">
                            {new Date(entry.objectData.date).toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                      <p className="opacity-90 line-clamp-2">{entry.objectData.entry || 'No entry text'}</p>
                    </div>
                    <div className="icon-chevron-right text-xl opacity-50"></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {selectedEntry && (
            <div 
              className="fixed inset-0 flex items-center justify-center p-4 z-50"
              style={{backgroundColor: 'rgba(0,0,0,0.7)'}}
              onClick={() => setSelectedEntry(null)}
            >
              <div 
                className="card max-w-2xl w-full max-h-[80vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{moodEmojis[selectedEntry.objectData.mood] || '💭'}</span>
                    <div>
                      <p className="font-semibold text-xl">{selectedEntry.objectData.mood}</p>
                      <p className="text-sm opacity-70">
                        {new Date(selectedEntry.objectData.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  <button onClick={() => setSelectedEntry(null)} className="text-2xl opacity-70 hover:opacity-100">
                    ✕
                  </button>
                </div>
                
                <div className="mb-6">
                  <h3 className="font-semibold mb-2">Journal Entry</h3>
                  <p className="opacity-90 whitespace-pre-wrap">{selectedEntry.objectData.entry}</p>
                </div>

                {selectedEntry.objectData.gratitude?.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">🙏 Gratitude</h3>
                    <ul className="space-y-2">
                      {selectedEntry.objectData.gratitude.map((item, index) => (
                        <li key={index} className="opacity-90">• {item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    );
  } catch (error) {
    console.error('PastJournalsApp error:', error);
    return null;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<ErrorBoundary><PastJournalsApp /></ErrorBoundary>);