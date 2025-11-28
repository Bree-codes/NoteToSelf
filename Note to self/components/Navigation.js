function Navigation({ currentUser, onLogout, isDarkMode, onToggleTheme }) {
  try {
    const [showUserMenu, setShowUserMenu] = React.useState(false);
    const [showMobileMenu, setShowMobileMenu] = React.useState(false);
    
    return (
      <nav className="border-b" style={{borderColor: 'var(--border-color)'}} data-name="navigation" data-file="components/Navigation.js">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <a href="index.html" className="flex items-center gap-2">
              <div className="icon-heart text-3xl" style={{color: 'var(--primary-color)'}}></div>
              <span className="text-2xl font-bold">Note to Self</span>
            </a>

            <div className="hidden md:flex items-center gap-6">
              <a href="index.html" className="nav-link">
                <div className="icon-home text-xl"></div>
                <span>Home</span>
              </a>
              <a href="journal.html" className="nav-link">
                <div className="icon-pen-line text-xl"></div>
                <span>Journal</span>
              </a>
              <a href="past-journals.html" className="nav-link">
                <div className="icon-book-open text-xl"></div>
                <span>Past Journals</span>
              </a>
              <a href="insights.html" className="nav-link">
                <div className="icon-chart-bar text-xl"></div>
                <span>Insights</span>
              </a>
              <a href="affirmations.html" className="nav-link">
                <div className="icon-sparkles text-xl"></div>
                <span>Affirmations</span>
              </a>
              
              <button onClick={onToggleTheme} className="nav-link">
                <div className={`icon-${isDarkMode ? 'sun' : 'moon'} text-xl`}></div>
              </button>

              <div className="relative">
                <button 
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="nav-link"
                >
                  <div className="icon-user text-xl"></div>
                  <span>{currentUser?.name}</span>
                </button>
                
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 card shadow-lg z-50">
                    <a href="profile.html" className="block px-4 py-2 hover:opacity-80">Profile Settings</a>
                    <button onClick={onLogout} className="block w-full text-left px-4 py-2 hover:opacity-80">
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>

            <button 
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2"
            >
              <div className={`icon-${showMobileMenu ? 'x' : 'menu'} text-2xl`}></div>
            </button>
          </div>

          {showMobileMenu && (
            <div className="md:hidden mt-4 space-y-2">
              <a href="index.html" className="nav-link">
                <div className="icon-home text-xl"></div>
                <span>Home</span>
              </a>
              <a href="journal.html" className="nav-link">
                <div className="icon-pen-line text-xl"></div>
                <span>Journal</span>
              </a>
              <a href="past-journals.html" className="nav-link">
                <div className="icon-book-open text-xl"></div>
                <span>Past Journals</span>
              </a>
              <a href="insights.html" className="nav-link">
                <div className="icon-chart-bar text-xl"></div>
                <span>Insights</span>
              </a>
              <a href="affirmations.html" className="nav-link">
                <div className="icon-sparkles text-xl"></div>
                <span>Affirmations</span>
              </a>
              <button onClick={onToggleTheme} className="nav-link w-full text-left">
                <div className={`icon-${isDarkMode ? 'sun' : 'moon'} text-xl`}></div>
                <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
              </button>
              <a href="profile.html" className="nav-link">
                <div className="icon-user text-xl"></div>
                <span>Profile</span>
              </a>
              <button onClick={onLogout} className="nav-link w-full text-left">
                <div className="icon-log-out text-xl"></div>
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </nav>
    );
  } catch (error) {
    console.error('Navigation component error:', error);
    return null;
  }
}
