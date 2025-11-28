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
            <button onClick={() => window.location.reload()} className="btn-primary">Reload Page</button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function JournalApp() {
  try {
    const [currentUser, setCurrentUser] = React.useState(null);
    const [isDarkMode, setIsDarkMode] = React.useState(false);
    const [journalEntry, setJournalEntry] = React.useState('');
    const [selectedMood, setSelectedMood] = React.useState('');
    const [gratitude, setGratitude] = React.useState(['', '', '']);
    const [isSaving, setIsSaving] = React.useState(false);

    const moods = [
      { name: 'Amazing', emoji: '😊', color: '#4ADE80' },
      { name: 'Good', emoji: '😄', color: '#60A5FA' },
      { name: 'Okay', emoji: '😐', color: '#FBBF24' },
      { name: 'Low', emoji: '😔', color: '#FB923C' },
      { name: 'Difficult', emoji: '😢', color: '#F87171' }
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

    const handleSaveEntry = async () => {
      if (!journalEntry && !selectedMood && gratitude.every(g => !g)) {
        return;
      }

      setIsSaving(true);
      try {
        await trickleCreateObject(`journal:${currentUser.id}`, {
          entry: journalEntry,
          mood: selectedMood,
          gratitude: gratitude.filter(g => g),
          date: new Date().toISOString()
        });

        setJournalEntry('');
        setSelectedMood('');
        setGratitude(['', '', '']);
        alert('Journal entry saved successfully!');
      } catch (error) {
        console.error('Error saving entry:', error);
        alert('Failed to save entry. Please try again.');
      } finally {
        setIsSaving(false);
      }
    };

    if (!currentUser) return null;

    return (
      <div className="min-h-screen" data-name="journal-app" data-file="journal-app.js">
        <Navigation 
          currentUser={currentUser} 
          onLogout={handleLogout}
          isDarkMode={isDarkMode}
          onToggleTheme={toggleTheme}
        />
        
        <main className="container mx-auto px-4 py-8 max-w-4xl mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-center" style={{color: 'var(--primary-color)'}}>
            Daily Journal
          </h1>

          <div className="card mb-6">
            <h2 className="text-xl font-semibold mb-4">How are you feeling today?</h2>
            <div className="flex gap-4 flex-wrap">
              {moods.map(mood => (
                <button
                  key={mood.name}
                  onClick={() => setSelectedMood(mood.name)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-all ${
                    selectedMood === mood.name ? 'ring-2' : ''
                  }`}
                  style={{
                    backgroundColor: selectedMood === mood.name ? mood.color + '30' : 'transparent',
                    borderColor: mood.color,
                    border: '2px solid',
                    ringColor: mood.color
                  }}
                >
                  <span className="text-3xl">{mood.emoji}</span>
                  <span className="text-sm font-medium">{mood.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="card mb-6">
            <h2 className="text-xl font-semibold mb-4">Write your thoughts</h2>
            <textarea
              value={journalEntry}
              onChange={(e) => setJournalEntry(e.target.value)}
              className="w-full h-64 p-4 rounded-xl border resize-none"
              style={{borderColor: 'var(--border-color)', backgroundColor: 'var(--card-background)'}}
              placeholder="What's on your mind today? Write freely..."
            />
          </div>

          <div className="card mb-6">
            <h2 className="text-xl font-semibold mb-4">Three things I'm grateful for</h2>
            <div className="space-y-3">
              {gratitude.map((item, index) => (
                <input
                  key={index}
                  type="text"
                  value={item}
                  onChange={(e) => {
                    const newGratitude = [...gratitude];
                    newGratitude[index] = e.target.value;
                    setGratitude(newGratitude);
                  }}
                  className="w-full px-4 py-3 rounded-xl border"
                  style={{borderColor: 'var(--border-color)', backgroundColor: 'var(--card-background)'}}
                  placeholder={`Gratitude ${index + 1}`}
                />
              ))}
            </div>
          </div>

          <div className="text-center">
            <button 
              onClick={handleSaveEntry}
              disabled={isSaving}
              className="btn-primary text-lg px-8 py-4"
            >
              {isSaving ? 'Saving...' : 'Save Entry'}
            </button>
          </div>
        </main>
      </div>
    );
  } catch (error) {
    console.error('JournalApp component error:', error);
    return null;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ErrorBoundary>
    <JournalApp />
  </ErrorBoundary>
);