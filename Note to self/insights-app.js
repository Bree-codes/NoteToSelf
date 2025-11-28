const ChartJS = window.Chart;

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

function InsightsApp() {
  try {
    const [currentUser, setCurrentUser] = React.useState(null);
    const [isDarkMode, setIsDarkMode] = React.useState(false);
    const [entries, setEntries] = React.useState([]);
    const [stats, setStats] = React.useState({ total: 0, thisWeek: 0 });
    const chartRef = React.useRef(null);

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
        
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        const thisWeek = result.items.filter(e => 
          new Date(e.objectData.date) > weekAgo
        ).length;

        setStats({ total: result.items.length, thisWeek });
        renderChart(result.items);
      } catch (error) {
        console.error('Error loading entries:', error);
      }
    };

    const renderChart = (items) => {
      const moodCounts = {};
      items.forEach(item => {
        const mood = item.objectData.mood;
        if (mood) {
          moodCounts[mood] = (moodCounts[mood] || 0) + 1;
        }
      });

      const ctx = document.getElementById('moodChart');
      if (ctx && chartRef.current) {
        chartRef.current.destroy();
      }

      if (ctx) {
        chartRef.current = new ChartJS(ctx, {
          type: 'bar',
          data: {
            labels: Object.keys(moodCounts),
            datasets: [{
              label: 'Mood Frequency',
              data: Object.values(moodCounts),
              backgroundColor: ['#B8D4A8', '#B8E6F0', '#FFD700', '#FFA07A', '#9B8FE6']
            }]
          },
          options: {
            responsive: true,
            plugins: { legend: { display: false } }
          }
        });
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
      <div className="min-h-screen" data-name="insights-app" data-file="insights-app.js">
        <Navigation 
          currentUser={currentUser} 
          onLogout={handleLogout}
          isDarkMode={isDarkMode}
          onToggleTheme={toggleTheme}
        />
        
        <main className="container mx-auto px-4 py-8 max-w-6xl mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-center" style={{color: 'var(--primary-color)'}}>
            Your Wellness Journey
          </h1>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="card text-center">
              <div className="text-5xl mb-3">📚</div>
              <h3 className="text-3xl font-bold mb-2">{stats.total}</h3>
              <p className="opacity-80">Total Entries</p>
            </div>

            <div className="card text-center">
              <div className="text-5xl mb-3">📅</div>
              <h3 className="text-3xl font-bold mb-2">{stats.thisWeek}</h3>
              <p className="opacity-80">This Week</p>
            </div>
          </div>

          <div className="card mb-8">
            <h2 className="text-2xl font-semibold mb-6">Mood Overview</h2>
            <canvas id="moodChart"></canvas>
          </div>
        </main>
      </div>
    );
  } catch (error) {
    console.error('InsightsApp error:', error);
    return null;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<ErrorBoundary><InsightsApp /></ErrorBoundary>);