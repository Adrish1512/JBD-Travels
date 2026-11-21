/**
 * JBD Travels - AI-Assisted Travel Planning and Management System
 * Single Page Application Component Architecture
 */

const { useState, useEffect, useRef } = React;

// ----------------------------------------------------
// TOAST NOTIFICATION COMPONENT
// ----------------------------------------------------
function ToastContainer({ toasts, removeToast }) {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-2 pointer-events-none">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-center p-4 rounded-xl shadow-xl text-white transform transition-all duration-300 ${
            toast.type === 'success' ? 'bg-emerald-600' :
            toast.type === 'error' ? 'bg-rose-600' : 'bg-slate-800'
          }`}
        >
          <div className="mr-3 text-lg">
            {toast.type === 'success' && <i className="fa-solid fa-circle-check"></i>}
            {toast.type === 'error' && <i className="fa-solid fa-circle-exclamation"></i>}
            {toast.type === 'info' && <i className="fa-solid fa-circle-info"></i>}
          </div>
          <div className="text-sm font-medium pr-3">{toast.message}</div>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-white/70 hover:text-white ml-auto"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
      ))}
    </div>
  );
}

// ----------------------------------------------------
// AUTH MODAL COMPONENT (Module 1: Authentication & Roles)
// ----------------------------------------------------
function AuthModal({ isOpen, onClose, onAuthSuccess, showToast }) {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('customer');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isRegister) {
        const res = await api.register({
          username,
          email,
          password,
          full_name: fullName,
          role
        });
        showToast(res.message, 'success');
        onAuthSuccess(res.user);
        onClose();
      } else {
        const res = await api.login(email || username, password);
        showToast(res.message, 'success');
        onAuthSuccess(res.user);
        onClose();
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Quick Demo Login Handler
  const handleQuickLogin = async (demoEmail, demoPassword) => {
    setLoading(true);
    try {
      const res = await api.login(demoEmail, demoPassword);
      showToast(`Logged in as ${res.user.full_name} (${res.user.role})`, 'success');
      onAuthSuccess(res.user);
      onClose();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative border border-slate-100 animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100"
        >
          <i className="fa-solid fa-xmark text-lg"></i>
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto mb-3 text-2xl">
            <i className="fa-solid fa-plane-departure"></i>
          </div>
          <h3 className="text-2xl font-bold text-slate-800">
            {isRegister ? 'Create JBD Travels Account' : 'Welcome to JBD Travels'}
          </h3>
          <p className="text-slate-500 text-sm mt-1">
            {isRegister ? 'Join our club for exclusive partner rates & AI planning' : 'Sign in to access your itineraries & partner discounts'}
          </p>
        </div>

        {/* Demo Fast Login Buttons */}
        <div className="mb-5 bg-slate-50 p-3 rounded-xl border border-slate-200">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 text-center">
            ⚡ Quick Demo Accounts (1-Click)
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('customer@jbdtravels.com', 'Customer123!')}
              className="text-xs py-1.5 px-2 bg-white border border-slate-200 rounded-lg font-medium text-slate-700 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700 transition"
            >
              <i className="fa-solid fa-user mr-1 text-emerald-600"></i> Customer
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('agent@jbdtravels.com', 'Agent123!')}
              className="text-xs py-1.5 px-2 bg-white border border-slate-200 rounded-lg font-medium text-slate-700 hover:bg-brand-50 hover:border-brand-300 hover:text-brand-700 transition"
            >
              <i className="fa-solid fa-headset mr-1 text-brand-600"></i> Agent
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('admin@jbdtravels.com', 'Admin123!')}
              className="text-xs py-1.5 px-2 bg-white border border-slate-200 rounded-lg font-medium text-slate-700 hover:bg-purple-50 hover:border-purple-300 hover:text-purple-700 transition"
            >
              <i className="fa-solid fa-shield-halved mr-1 text-purple-600"></i> Admin
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="e.g. Elena Rostova"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Username or Email</label>
            <input
              type="text"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="customer@jbdtravels.com"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          {isRegister && (
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Username</label>
              <input
                type="text"
                required
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="elena_travels"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          {isRegister && (
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Account Role</label>
              <select
                value={role}
                onChange={e => setRole(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
              >
                <option value="customer">Customer / Traveler</option>
                <option value="employee">Travel Agent / Employee</option>
                <option value="admin">System Administrator</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-semibold text-sm shadow-lg shadow-brand-500/25 transition flex items-center justify-center space-x-2"
          >
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <span>{isRegister ? 'Create Account' : 'Sign In to JBD Travels'}</span>
            )}
          </button>
        </form>

        <div className="mt-5 text-center text-xs text-slate-500">
          {isRegister ? 'Already have an account?' : "Don't have an account yet?"}{' '}
          <button
            type="button"
            onClick={() => setIsRegister(!isRegister)}
            className="text-brand-600 font-semibold hover:underline"
          >
            {isRegister ? 'Sign In' : 'Register Now'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// NAVBAR COMPONENT (Module 1)
// ----------------------------------------------------
function Navbar({ activeTab, setActiveTab, currentUser, onOpenAuth, onLogout, onQuickSwitchRole }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('explore')}>
            <div className="w-10 h-10 rounded-xl gradient-jbd flex items-center justify-center text-white text-xl shadow-md shadow-brand-600/20">
              <i className="fa-solid fa-plane-departure"></i>
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-slate-900">JBD</span>
              <span className="text-xl font-light text-brand-600 ml-1">Travels</span>
              <span className="hidden sm:inline-block ml-2 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200">
                AI Engine
              </span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="hidden lg:flex items-center space-x-1">
            <button
              onClick={() => setActiveTab('explore')}
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition ${
                activeTab === 'explore' ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <i className="fa-solid fa-compass mr-1.5 text-brand-600"></i> Explore & AI
            </button>

            <button
              onClick={() => setActiveTab('planner')}
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition ${
                activeTab === 'planner' ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <i className="fa-solid fa-calculator mr-1.5 text-amber-500"></i> Budget Planner
            </button>

            <button
              onClick={() => setActiveTab('compare')}
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition ${
                activeTab === 'compare' ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <i className="fa-solid fa-scale-balanced mr-1.5 text-indigo-500"></i> Price Compare
            </button>

            <button
              onClick={() => setActiveTab('hotels')}
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition ${
                activeTab === 'hotels' ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <i className="fa-solid fa-hotel mr-1.5 text-emerald-500"></i> Partner Hotels
            </button>

            <button
              onClick={() => setActiveTab('docs')}
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition ${
                activeTab === 'docs' ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <i className="fa-solid fa-passport mr-1.5 text-rose-500"></i> Visa & Docs
            </button>

            <button
              onClick={() => setActiveTab('itineraries')}
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition ${
                activeTab === 'itineraries' ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <i className="fa-solid fa-bookmark mr-1.5 text-amber-500"></i> My Trips
            </button>

            {/* Admin & Management Tab */}
            <button
              onClick={() => setActiveTab('admin')}
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition flex items-center ${
                activeTab === 'admin'
                  ? 'bg-purple-50 text-purple-700 border border-purple-200'
                  : 'text-purple-600 hover:bg-purple-50'
              }`}
            >
              <i className="fa-solid fa-chart-pie mr-1.5"></i> Admin Dashboard
              {currentUser && currentUser.role === 'admin' && (
                <span className="ml-1.5 px-1.5 py-0.2 text-[9px] uppercase font-bold rounded bg-purple-600 text-white">Admin</span>
              )}
            </button>
          </div>

          {/* User Profile / Auth Area */}
          <div className="flex items-center space-x-3">
            {currentUser ? (
              <div className="flex items-center space-x-2">
                {/* Role Switcher Pill */}
                <div className="hidden md:flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200 text-xs">
                  <span className="px-2 font-medium text-slate-500">Role:</span>
                  <button
                    onClick={() => onQuickSwitchRole('customer')}
                    className={`px-2 py-0.5 rounded-lg font-semibold transition ${currentUser.role === 'customer' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                  >
                    Customer
                  </button>
                  <button
                    onClick={() => onQuickSwitchRole('employee')}
                    className={`px-2 py-0.5 rounded-lg font-semibold transition ${currentUser.role === 'employee' ? 'bg-white text-brand-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                  >
                    Agent
                  </button>
                  <button
                    onClick={() => onQuickSwitchRole('admin')}
                    className={`px-2 py-0.5 rounded-lg font-semibold transition ${currentUser.role === 'admin' ? 'bg-white text-purple-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                  >
                    Admin
                  </button>
                </div>

                <div className="flex items-center space-x-2 pl-2">
                  <div className="w-8 h-8 rounded-full bg-brand-600 text-white flex items-center justify-center font-bold text-xs uppercase shadow">
                    {currentUser.username ? currentUser.username.substring(0, 2) : 'US'}
                  </div>
                  <div className="hidden sm:block text-left">
                    <div className="text-xs font-bold text-slate-800 leading-tight">
                      {currentUser.full_name || currentUser.username}
                    </div>
                    <div className="text-[10px] text-slate-500 capitalize">{currentUser.role}</div>
                  </div>
                </div>

                <button
                  onClick={onLogout}
                  title="Sign Out"
                  className="w-8 h-8 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition"
                >
                  <i className="fa-solid fa-arrow-right-from-bracket"></i>
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-brand-500/20 transition flex items-center space-x-1.5"
              >
                <i className="fa-solid fa-user-circle"></i>
                <span>Sign In / Demo</span>
              </button>
            )}

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
            >
              <i className={`fa-solid ${mobileMenuOpen ? 'fa-xmark' : 'fa-bars'} text-lg`}></i>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-4 space-y-1 animate-fadeIn">
          <button
            onClick={() => { setActiveTab('explore'); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-brand-50"
          >
            Explore & AI Recommendations
          </button>
          <button
            onClick={() => { setActiveTab('planner'); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-brand-50"
          >
            Budget Planner
          </button>
          <button
            onClick={() => { setActiveTab('compare'); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-brand-50"
          >
            Flight & Hotel Compare
          </button>
          <button
            onClick={() => { setActiveTab('hotels'); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-brand-50"
          >
            Partner Hotels
          </button>
          <button
            onClick={() => { setActiveTab('docs'); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-brand-50"
          >
            Visa & Documentation
          </button>
          <button
            onClick={() => { setActiveTab('itineraries'); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-brand-50"
          >
            My Trips
          </button>
          <button
            onClick={() => { setActiveTab('admin'); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-purple-700 hover:bg-purple-50"
          >
            Admin Dashboard
          </button>
        </div>
      )}
    </nav>
  );
}

// ----------------------------------------------------
// MODULE 3: AI-ASSISTED RECOMMENDATIONS & EXPLORE
// ----------------------------------------------------
function ExploreTab({ onSelectDestinationForPlan, showToast }) {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPrefs, setSelectedPrefs] = useState(['culture', 'sightseeing', 'foodie']);
  const [budgetSlider, setBudgetSlider] = useState(2500);
  const [durationDays, setDurationDays] = useState(5);
  const [aiRecs, setAiRecs] = useState([]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [selectedDestModal, setSelectedDestModal] = useState(null);

  const availableTags = [
    { id: 'culture', label: 'Cultural & Heritage', icon: 'fa-landmark' },
    { id: 'sightseeing', label: 'Sightseeing', icon: 'fa-monument' },
    { id: 'foodie', label: 'Culinary & Foodie', icon: 'fa-utensils' },
    { id: 'adventure', label: 'Adventure', icon: 'fa-hiking' },
    { id: 'relaxation', label: 'Relaxation & Spa', icon: 'fa-spa' },
    { id: 'nature', label: 'Nature & Wildlife', icon: 'fa-tree' },
    { id: 'beaches', label: 'Beaches & Oceans', icon: 'fa-umbrella-beach' },
    { id: 'nightlife', label: 'Nightlife & Bars', icon: 'fa-martini-glass' },
    { id: 'luxury', label: 'Luxury Experience', icon: 'fa-gem' },
    { id: 'shopping', label: 'Shopping', icon: 'fa-bag-shopping' }
  ];

  useEffect(() => {
    loadDestinations();
  }, []);

  const loadDestinations = async () => {
    try {
      const res = await api.getDestinations();
      setDestinations(res.destinations || []);
    } catch (err) {
      showToast('Error loading destinations', 'error');
    } finally {
      setLoading(false);
    }
  };

  const togglePref = (tagId) => {
    if (selectedPrefs.includes(tagId)) {
      setSelectedPrefs(selectedPrefs.filter(t => t !== tagId));
    } else {
      setSelectedPrefs([...selectedPrefs, tagId]);
    }
  };

  const runAiRecommendation = async () => {
    setIsAiLoading(true);
    try {
      const res = await api.getAiRecommendations({
        preferences: selectedPrefs,
        budget: budgetSlider,
        duration_days: durationDays,
        travelers_count: 1,
        limit: 4
      });
      setAiRecs(res.recommendations || []);
      showToast(`AI Engine generated ${res.recommendations.length} personalized recommendations!`, 'success');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsAiLoading(false);
    }
  };

  const openDestinationDetail = async (destId) => {
    try {
      const res = await api.getDestination(destId);
      setSelectedDestModal(res.destination);
    } catch (err) {
      showToast('Failed to load destination details', 'error');
    }
  };

  return (
    <div className="space-y-12 pb-16">
      
      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-slate-900 text-white min-h-[420px] flex items-center">
        <img
          src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1600"
          alt="World Travel"
          className="absolute inset-0 w-full h-full object-cover opacity-35 filter brightness-75 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/80 to-transparent"></div>

        <div className="relative max-w-3xl p-8 sm:p-12 z-10 space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 border border-brand-400/30 text-xs font-semibold backdrop-blur-sm">
            <i className="fa-solid fa-sparkles text-amber-400"></i>
            <span>Machine Learning & Vector Matching Engine</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight text-white">
            Where Intelligent Algorithms Craft Your Perfect Escape.
          </h1>

          <p className="text-slate-300 text-base sm:text-lg font-light leading-relaxed">
            JBD Travels combines multi-attribute preference cosine similarity, real-time partner hotel rates, and budget optimization algorithms to design unforgettable global itineraries.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={() => {
                const el = document.getElementById('ai-recommender-panel');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm shadow-lg shadow-brand-600/30 transition flex items-center space-x-2"
            >
              <i className="fa-solid fa-wand-magic-sparkles"></i>
              <span>Launch AI Recommender</span>
            </button>
            <button
              onClick={() => onSelectDestinationForPlan('Tokyo, Japan', 2500, 5)}
              className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm backdrop-blur-md border border-white/20 transition flex items-center space-x-2"
            >
              <i className="fa-solid fa-play"></i>
              <span>Try Featured Tokyo Plan</span>
            </button>
          </div>
        </div>
      </div>

      {/* AI Recommender Interactive Box (Module 3) */}
      <div id="ai-recommender-panel" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xl shadow-slate-200/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-100 gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-brand-700 bg-brand-50 px-2.5 py-1 rounded-lg mb-2">
              <i className="fa-solid fa-brain"></i>
              <span>Scikit-Learn Powered Recommendation Engine</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Personalized AI Destination Matcher</h2>
            <p className="text-slate-500 text-sm mt-0.5">
              Select your travel desires and target budget; our algorithm vectorizes your preferences against global destinations.
            </p>
          </div>

          <button
            onClick={runAiRecommendation}
            disabled={isAiLoading}
            className="px-6 py-3 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-brand-500/25 transition flex items-center justify-center space-x-2 self-start md:self-auto"
          >
            {isAiLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Calculating Vectors...</span>
              </>
            ) : (
              <>
                <i className="fa-solid fa-wand-magic-sparkles"></i>
                <span>Find Matches for Me</span>
              </>
            )}
          </button>
        </div>

        {/* Inputs & Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          {/* Preferences Multi-Select */}
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
              What do you love most about traveling? (Select Interests)
            </label>
            <div className="flex flex-wrap gap-2">
              {availableTags.map(tag => {
                const isSelected = selectedPrefs.includes(tag.id);
                return (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => togglePref(tag.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition ${
                      isSelected
                        ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <i className={`fa-solid ${tag.icon}`}></i>
                    <span>{tag.label}</span>
                    {isSelected && <i className="fa-solid fa-check ml-1 text-[10px]"></i>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Budget & Duration Inputs */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/70 space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold text-slate-700">Total Budget (USD)</span>
                <span className="text-sm font-extrabold text-brand-600">${budgetSlider.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="500"
                max="8000"
                step="100"
                value={budgetSlider}
                onChange={e => setBudgetSlider(Number(e.target.value))}
                className="w-full accent-brand-600 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold text-slate-700">Duration</span>
                <span className="text-sm font-extrabold text-slate-800">{durationDays} Days</span>
              </div>
              <input
                type="range"
                min="3"
                max="14"
                step="1"
                value={durationDays}
                onChange={e => setDurationDays(Number(e.target.value))}
                className="w-full accent-brand-600 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* AI Recommendations Results */}
        {aiRecs.length > 0 && (
          <div className="mt-8 pt-8 border-t border-slate-100">
            <div className="flex items-center space-x-2 mb-6">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <h3 className="text-lg font-bold text-slate-900">
                Top AI Matched Destinations For Your Preferences
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {aiRecs.map((rec, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition flex flex-col justify-between"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={rec.destination.image_url}
                      alt={rec.destination.name}
                      className="w-full h-full object-cover transition duration-500 hover:scale-105"
                    />
                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-extrabold text-brand-700 shadow flex items-center space-x-1">
                      <i className="fa-solid fa-bullseye text-emerald-500"></i>
                      <span>{rec.match_percentage}% Match</span>
                    </div>
                    <div className="absolute bottom-3 left-3 text-white drop-shadow-md">
                      <h4 className="text-xl font-extrabold">{rec.destination.name}</h4>
                      <p className="text-xs text-white/90">Best Time: {rec.destination.best_time_to_visit}</p>
                    </div>
                  </div>

                  <div className="p-5 space-y-3 flex-grow">
                    <div className="bg-brand-50/60 p-3 rounded-xl border border-brand-100 text-xs text-slate-700 flex items-start space-x-2">
                      <i className="fa-solid fa-sparkles text-brand-600 mt-0.5"></i>
                      <span>{rec.why_recommended}</span>
                    </div>

                    <div>
                      <div className="text-xs font-bold text-slate-600 mb-1.5">Highlights & Points of Interest:</div>
                      <div className="flex flex-wrap gap-1.5">
                        {rec.top_attractions.map((attr, aIdx) => (
                          <span
                            key={aIdx}
                            className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg font-medium"
                          >
                            📍 {attr.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-5 pt-0 flex items-center justify-between border-t border-slate-100 mt-3 pt-3">
                    <div>
                      <div className="text-[11px] text-slate-400">Avg Mid-tier Daily Cost</div>
                      <div className="text-sm font-bold text-slate-800">${rec.destination.avg_cost_per_day_mid} / day</div>
                    </div>
                    <button
                      onClick={() => onSelectDestinationForPlan(rec.destination.name, budgetSlider, durationDays)}
                      className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-md shadow-brand-500/20 transition flex items-center space-x-1.5"
                    >
                      <i className="fa-solid fa-calendar-plus"></i>
                      <span>Build Travel Plan</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Featured Global Destinations Catalog */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Explore World Destinations</h2>
            <p className="text-slate-500 text-sm">Discover popular cultural capitals, island getaways, and modern wonders.</p>
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-400">Loading destinations...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {destinations.map(dest => (
              <div
                key={dest.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition card-hover flex flex-col justify-between"
              >
                <div className="relative h-44 cursor-pointer" onClick={() => openDestinationDetail(dest.id)}>
                  <img
                    src={dest.image_url}
                    alt={dest.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2.5 right-2.5 bg-black/60 backdrop-blur-sm text-white px-2 py-0.5 rounded-md text-[11px] font-bold">
                    <i className="fa-solid fa-shield-halved text-emerald-400 mr-1"></i>
                    {dest.safety_rating}
                  </div>
                  <div className="absolute bottom-2.5 left-2.5 text-white drop-shadow">
                    <div className="text-xs uppercase font-extrabold tracking-wider text-brand-300">{dest.country}</div>
                    <div className="text-lg font-bold leading-tight">{dest.city}</div>
                  </div>
                </div>

                <div className="p-4 space-y-2.5 flex-grow">
                  <p className="text-xs text-slate-600 line-clamp-2">{dest.description}</p>
                  
                  <div className="flex flex-wrap gap-1">
                    {dest.tags.slice(0, 3).map((tag, tIdx) => (
                      <span key={tIdx} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium capitalize">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 pt-0 flex items-center justify-between border-t border-slate-100 pt-3">
                  <div>
                    <span className="text-[10px] text-slate-400 block">From</span>
                    <span className="text-sm font-bold text-slate-800">${dest.avg_cost_per_day_budget}</span>
                    <span className="text-[10px] text-slate-500"> /day</span>
                  </div>
                  <div className="flex space-x-1.5">
                    <button
                      onClick={() => openDestinationDetail(dest.id)}
                      className="p-2 text-slate-500 hover:text-brand-600 hover:bg-brand-50 rounded-lg text-xs"
                      title="View Details"
                    >
                      <i className="fa-solid fa-circle-info"></i>
                    </button>
                    <button
                      onClick={() => onSelectDestinationForPlan(dest.name, 2000, 5)}
                      className="px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-xs font-semibold shadow-sm transition"
                    >
                      Plan Trip
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Destination Detail Modal */}
      {selectedDestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto animate-fadeIn">
            <button
              onClick={() => setSelectedDestModal(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100"
            >
              <i className="fa-solid fa-xmark text-lg"></i>
            </button>

            <div className="relative h-56 -mx-6 -mt-6 sm:-mx-8 sm:-mt-8 mb-6 overflow-hidden rounded-t-3xl">
              <img
                src={selectedDestModal.banner_url || selectedDestModal.image_url}
                alt={selectedDestModal.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
              <div className="absolute bottom-4 left-6 text-white">
                <span className="text-xs uppercase font-extrabold tracking-wider bg-brand-600 text-white px-2 py-0.5 rounded">
                  {selectedDestModal.continent}
                </span>
                <h3 className="text-2xl font-black mt-1">{selectedDestModal.name}</h3>
                <p className="text-xs text-white/80">Airport Code: {selectedDestModal.airport_code} • Currency: {selectedDestModal.currency_code}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-1">About Destination</h4>
                <p className="text-slate-600 text-sm leading-relaxed">{selectedDestModal.description}</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Best Season</div>
                  <div className="text-xs font-bold text-slate-800">{selectedDestModal.best_time_to_visit}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Climate</div>
                  <div className="text-xs font-bold text-slate-800">{selectedDestModal.climate}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Safety Index</div>
                  <div className="text-xs font-bold text-emerald-600">{selectedDestModal.safety_rating} / 5.0</div>
                </div>
              </div>

              {selectedDestModal.attractions && selectedDestModal.attractions.length > 0 && (
                <div>
                  <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-2">Iconic Tourist Attractions</h4>
                  <div className="space-y-2">
                    {selectedDestModal.attractions.map((attr, i) => (
                      <div key={i} className="p-3 rounded-xl border border-slate-100 bg-white shadow-sm flex items-start space-x-3">
                        <img src={attr.image_url} alt={attr.name} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-bold text-slate-800">{attr.name}</span>
                            <span className="text-[10px] bg-brand-50 text-brand-700 px-1.5 py-0.5 rounded font-semibold">{attr.category}</span>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">{attr.description}</p>
                          <div className="text-[10px] text-slate-400 mt-1">
                            Duration: ~{attr.estimated_duration_hours}h • Ticket: {attr.ticket_price_usd === 0 ? 'Free' : `$${attr.ticket_price_usd}`}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4 flex justify-end space-x-3">
                <button
                  onClick={() => setSelectedDestModal(null)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    const name = selectedDestModal.name;
                    setSelectedDestModal(null);
                    onSelectDestinationForPlan(name, 2500, 5);
                  }}
                  className="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-sm font-bold shadow-md shadow-brand-500/20"
                >
                  Generate Budget Plan for this City
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// ----------------------------------------------------
// MODULE 2: BUDGET-BASED TRAVEL PLANNING COMPONENT
// ----------------------------------------------------
function BudgetPlannerTab({ initialDestination, initialBudget, initialDuration, currentUser, showToast, setActiveTab }) {
  const [destination, setDestination] = useState(initialDestination || 'Tokyo, Japan');
  const [budget, setBudget] = useState(initialBudget || 3000);
  const [duration, setDuration] = useState(initialDuration || 5);
  const [travelers, setTravelers] = useState(2);
  const [originCity, setOriginCity] = useState('New York');
  const [travelStyle, setTravelStyle] = useState('Cultural & Sightseeing');
  const [accommodationTier, setAccommodationTier] = useState('Comfort (3-4 Star)');
  const [startDate, setStartDate] = useState('2026-12-15');
  
  const [generatedPlan, setGeneratedPlan] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [inquirySpecialReq, setInquirySpecialReq] = useState('');
  const [isSubmittingInquiry, setIsSubmittingInquiry] = useState(false);

  // Sync if initial props change
  useEffect(() => {
    if (initialDestination) setDestination(initialDestination);
    if (initialBudget) setBudget(initialBudget);
    if (initialDuration) setDuration(initialDuration);
  }, [initialDestination, initialBudget, initialDuration]);

  const handleGeneratePlan = async () => {
    setIsGenerating(true);
    try {
      const res = await api.generateItinerary({
        destination,
        budget,
        duration_days: duration,
        travelers_count: travelers,
        travel_style: travelStyle,
        accommodation_tier: accommodationTier,
        origin_city: originCity,
        start_date: startDate
      });
      setGeneratedPlan(res.plan);
      showToast('AI Plan & Budget Breakdown generated successfully!', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveItinerary = async () => {
    if (!generatedPlan) return;
    setIsSaving(true);
    try {
      const res = await api.saveItinerary({
        title: generatedPlan.title,
        destination_id: generatedPlan.destination_id,
        destination_name: generatedPlan.destination_name,
        origin_city: generatedPlan.origin_city,
        start_date: generatedPlan.start_date,
        duration_days: generatedPlan.duration_days,
        travelers_count: generatedPlan.travelers_count,
        total_budget: generatedPlan.total_budget,
        estimated_cost: generatedPlan.estimated_cost,
        travel_style: generatedPlan.travel_style,
        accommodation_tier: generatedPlan.accommodation_tier,
        cost_breakdown: generatedPlan.cost_breakdown,
        daily_schedule: generatedPlan.daily_schedule,
        selected_flight: generatedPlan.selected_flight,
        selected_hotel: generatedPlan.selected_hotel,
        user_notes: 'Created via JBD AI Budget Planner'
      });
      showToast('Itinerary saved to your JBD account!', 'success');
      // Update plan with generated ID
      setGeneratedPlan({ ...generatedPlan, id: res.itinerary.id });
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmitInquiry = async () => {
    if (!generatedPlan) return;
    setIsSubmittingInquiry(true);
    try {
      let planId = generatedPlan.id;
      // If not saved yet, save first
      if (!planId) {
        const saved = await api.saveItinerary({
          title: generatedPlan.title,
          destination_id: generatedPlan.destination_id,
          destination_name: generatedPlan.destination_name,
          origin_city: generatedPlan.origin_city,
          start_date: generatedPlan.start_date,
          duration_days: generatedPlan.duration_days,
          travelers_count: generatedPlan.travelers_count,
          total_budget: generatedPlan.total_budget,
          estimated_cost: generatedPlan.estimated_cost,
          travel_style: generatedPlan.travel_style,
          accommodation_tier: generatedPlan.accommodation_tier,
          cost_breakdown: generatedPlan.cost_breakdown,
          daily_schedule: generatedPlan.daily_schedule,
          selected_flight: generatedPlan.selected_flight,
          selected_hotel: generatedPlan.selected_hotel
        });
        planId = saved.itinerary.id;
      }

      await api.submitInquiry(planId, {
        customer_name: currentUser ? (currentUser.full_name || currentUser.username) : 'Valued Traveler',
        customer_email: currentUser ? currentUser.email : 'traveler@jbdtravels.com',
        customer_phone: currentUser ? currentUser.phone : '+1 (555) 019-2831',
        special_requests: inquirySpecialReq
      });

      showToast('Inquiry submitted to JBD Travel Specialist! We will contact you with final confirmations.', 'success');
      setInquiryModalOpen(false);
      setActiveTab('itineraries');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsSubmittingInquiry(false);
    }
  };

  return (
    <div className="space-y-10 pb-16">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-brand-900 via-brand-800 to-indigo-950 rounded-3xl p-8 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <span className="text-xs uppercase font-extrabold tracking-wider bg-brand-500/30 text-brand-300 px-3 py-1 rounded-full border border-brand-400/30 inline-block mb-3">
            Module 2 • Budget Feasibility & Allocation
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Intelligent Budget-Based Travel Planner
          </h1>
          <p className="text-brand-100 text-sm sm:text-base font-light mt-2 leading-relaxed">
            Specify your financial constraints and journey style. Our allocation engine breaks down flights, partner accommodations, meals, and curated attractions down to the dollar.
          </p>
        </div>
      </div>

      {/* Planner Controls Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Input Form Column */}
        <div className="lg:col-span-1 bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-lg space-y-5 h-fit">
          <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center justify-between">
            <span>Trip Parameters</span>
            <i className="fa-solid fa-sliders text-brand-600"></i>
          </h3>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Destination</label>
            <input
              type="text"
              value={destination}
              onChange={e => setDestination(e.target.value)}
              placeholder="e.g. Tokyo, Japan or Paris, France"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Departure City</label>
            <input
              type="text"
              value={originCity}
              onChange={e => setOriginCity(e.target.value)}
              placeholder="e.g. New York, London, Chicago"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>

          {/* Budget Slider */}
          <div className="bg-brand-50/50 p-4 rounded-2xl border border-brand-100">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-bold text-slate-700 uppercase">Total Budget</span>
              <span className="text-base font-extrabold text-brand-700">${budget.toLocaleString()} USD</span>
            </div>
            <input
              type="range"
              min="500"
              max="15000"
              step="100"
              value={budget}
              onChange={e => setBudget(Number(e.target.value))}
              className="w-full accent-brand-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>$500</span>
              <span>$7,500</span>
              <span>$15,000</span>
            </div>
          </div>

          {/* Duration & Travelers */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Duration</label>
              <select
                value={duration}
                onChange={e => setDuration(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm bg-white font-medium"
              >
                {[3, 4, 5, 7, 10, 14, 21].map(d => (
                  <option key={d} value={d}>{d} Days</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Travelers</label>
              <select
                value={travelers}
                onChange={e => setTravelers(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm bg-white font-medium"
              >
                {[1, 2, 3, 4, 5, 6].map(t => (
                  <option key={t} value={t}>{t} {t === 1 ? 'Traveler' : 'Travelers'}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Travel Style */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Travel Style</label>
            <select
              value={travelStyle}
              onChange={e => setTravelStyle(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm bg-white font-medium"
            >
              <option value="Cultural & Sightseeing">Cultural & Sightseeing</option>
              <option value="Adventure & Nature">Adventure & Nature</option>
              <option value="Relaxation & Wellness">Relaxation & Wellness</option>
              <option value="Luxury & Romantic">Luxury & Romantic</option>
              <option value="Culinary & Foodie">Culinary & Foodie</option>
            </select>
          </div>

          {/* Accommodation Preference */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Hotel Category</label>
            <select
              value={accommodationTier}
              onChange={e => setAccommodationTier(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm bg-white font-medium"
            >
              <option value="Budget (Hostel / 2-Star)">Budget Friendly (Hostel / 2-Star)</option>
              <option value="Comfort (3-4 Star)">Comfort & Boutique (3-4 Star)</option>
              <option value="Luxury Collection (5-Star)">Luxury Collection (5-Star)</option>
            </select>
          </div>

          <button
            type="button"
            onClick={handleGeneratePlan}
            disabled={isGenerating}
            className="w-full py-3.5 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white rounded-xl font-bold text-sm shadow-xl shadow-brand-500/25 transition flex items-center justify-center space-x-2"
          >
            {isGenerating ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Calculating Expenses & Routes...</span>
              </>
            ) : (
              <>
                <i className="fa-solid fa-calculator"></i>
                <span>Generate Budget Itinerary</span>
              </>
            )}
          </button>
        </div>

        {/* Results & Schedule Column */}
        <div className="lg:col-span-2 space-y-6">
          {generatedPlan ? (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Feasibility & Financial Summary Card */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-lg">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
                  <div>
                    <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">AI Travel Proposal</span>
                    <h2 className="text-2xl font-black text-slate-900 mt-0.5">{generatedPlan.title}</h2>
                    <p className="text-xs text-slate-500">
                      Departing from {generatedPlan.origin_city} • {generatedPlan.duration_days} Days / {generatedPlan.duration_days - 1} Nights • {generatedPlan.travelers_count} Travelers
                    </p>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={handleSaveItinerary}
                      disabled={isSaving}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center space-x-1.5"
                    >
                      <i className="fa-regular fa-bookmark"></i>
                      <span>{isSaving ? 'Saving...' : 'Save Plan'}</span>
                    </button>
                    <button
                      onClick={() => setInquiryModalOpen(true)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition flex items-center space-x-1.5"
                    >
                      <i className="fa-solid fa-paper-plane"></i>
                      <span>Book with JBD Agent</span>
                    </button>
                  </div>
                </div>

                {/* Feasibility Alert Box */}
                <div className={`mt-4 p-4 rounded-2xl flex items-start space-x-3 text-xs ${
                  generatedPlan.budget_variance >= 0
                    ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                    : 'bg-amber-50 text-amber-900 border border-amber-200'
                }`}>
                  <div className="text-lg mt-0.5">
                    {generatedPlan.budget_variance >= 0 ? (
                      <i className="fa-solid fa-circle-check text-emerald-600"></i>
                    ) : (
                      <i className="fa-solid fa-triangle-exclamation text-amber-600"></i>
                    )}
                  </div>
                  <div>
                    <div className="font-bold text-sm">{generatedPlan.feasibility_status}</div>
                    <div className="mt-0.5 font-normal leading-relaxed">{generatedPlan.budget_advice}</div>
                  </div>
                </div>

                {/* Expense Breakdown Progress Bars (Module 2 Requirement) */}
                <div className="mt-6 pt-6 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Itemized Travel Expenses Breakdown
                    </h4>
                    <div className="text-right">
                      <span className="text-xs text-slate-400">Total Estimated: </span>
                      <span className="text-base font-extrabold text-slate-900">${generatedPlan.estimated_cost.toLocaleString()}</span>
                      <span className="text-xs text-slate-500"> / Target ${generatedPlan.total_budget.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    <div className="bg-sky-50 p-3 rounded-xl border border-sky-100">
                      <div className="flex items-center text-sky-700 text-xs font-bold mb-1">
                        <i className="fa-solid fa-plane mr-1.5"></i> Flights
                      </div>
                      <div className="text-lg font-black text-sky-900">${generatedPlan.cost_breakdown.flights}</div>
                      <div className="text-[10px] text-sky-600 mt-0.5">Roundtrip & baggage</div>
                    </div>

                    <div className="bg-indigo-50 p-3 rounded-xl border border-indigo-100">
                      <div className="flex items-center text-indigo-700 text-xs font-bold mb-1">
                        <i className="fa-solid fa-hotel mr-1.5"></i> Hotels
                      </div>
                      <div className="text-lg font-black text-indigo-900">${generatedPlan.cost_breakdown.hotel}</div>
                      <div className="text-[10px] text-indigo-600 mt-0.5">JBD partner rate</div>
                    </div>

                    <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100">
                      <div className="flex items-center text-emerald-700 text-xs font-bold mb-1">
                        <i className="fa-solid fa-ticket mr-1.5"></i> Activities
                      </div>
                      <div className="text-lg font-black text-emerald-900">${generatedPlan.cost_breakdown.activities}</div>
                      <div className="text-[10px] text-emerald-600 mt-0.5">Tours & admissions</div>
                    </div>

                    <div className="bg-amber-50 p-3 rounded-xl border border-amber-100">
                      <div className="flex items-center text-amber-700 text-xs font-bold mb-1">
                        <i className="fa-solid fa-utensils mr-1.5"></i> Dining
                      </div>
                      <div className="text-lg font-black text-amber-900">${generatedPlan.cost_breakdown.dining}</div>
                      <div className="text-[10px] text-amber-600 mt-0.5">Gourmet & local food</div>
                    </div>

                    <div className="bg-purple-50 p-3 rounded-xl border border-purple-100">
                      <div className="flex items-center text-purple-700 text-xs font-bold mb-1">
                        <i className="fa-solid fa-shield-heart mr-1.5"></i> Buffer
                      </div>
                      <div className="text-lg font-black text-purple-900">${generatedPlan.cost_breakdown.contingency_buffer}</div>
                      <div className="text-[10px] text-purple-600 mt-0.5">5% safety margin</div>
                    </div>
                  </div>
                </div>

                {/* Partner Accommodation & Flight Preview */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-100">
                  {generatedPlan.selected_hotel && (
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center text-xl flex-shrink-0">
                        <i className="fa-solid fa-hotel"></i>
                      </div>
                      <div className="flex-grow min-w-0">
                        <div className="text-[10px] uppercase font-bold text-indigo-600">Selected Partner Hotel</div>
                        <div className="text-xs font-bold text-slate-800 truncate">{generatedPlan.selected_hotel.name}</div>
                        <div className="text-[11px] text-slate-500">
                          ${generatedPlan.selected_hotel.jbd_partner_rate}/night <span className="text-emerald-600 font-semibold">(Save {generatedPlan.selected_hotel.partner_discount_percent}%)</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {generatedPlan.selected_flight && (
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center text-xl flex-shrink-0">
                        <i className="fa-solid fa-plane"></i>
                      </div>
                      <div className="flex-grow min-w-0">
                        <div className="text-[10px] uppercase font-bold text-sky-600">Selected Flight Route</div>
                        <div className="text-xs font-bold text-slate-800 truncate">{generatedPlan.selected_flight.airline_name} ({generatedPlan.selected_flight.flight_number})</div>
                        <div className="text-[11px] text-slate-500">
                          {generatedPlan.selected_flight.origin_city} ➔ {generatedPlan.selected_flight.destination_city} • ${generatedPlan.selected_flight.total_price_usd}/pax
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Day-by-Day Itinerary Schedule (Module 3) */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-slate-900">Personalized Day-by-Day Itinerary</h3>
                  <span className="text-xs text-slate-400 font-medium">Sequential Morning, Afternoon & Evening Schedule</span>
                </div>

                {generatedPlan.daily_schedule.map((dayItem, dIdx) => (
                  <div key={dIdx} className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-md space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div className="flex items-center space-x-3">
                        <span className="w-8 h-8 rounded-xl bg-brand-600 text-white font-extrabold flex items-center justify-center text-sm shadow">
                          {dayItem.day}
                        </span>
                        <div>
                          <h4 className="font-bold text-slate-800 text-base">{dayItem.theme}</h4>
                          <span className="text-xs text-slate-400">{dayItem.date}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-slate-700">${dayItem.day_total_cost}</span>
                        <span className="text-[10px] text-slate-400 block">Day's Activity Cost</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {/* Morning */}
                      <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/60 space-y-2">
                        <div className="flex items-center justify-between text-xs font-bold text-amber-800">
                          <span>🌅 Morning</span>
                          <span className="text-[10px] font-normal text-amber-700">{dayItem.morning.time}</span>
                        </div>
                        <h5 className="font-bold text-slate-900 text-xs">{dayItem.morning.title}</h5>
                        <p className="text-[11px] text-slate-600 leading-snug">{dayItem.morning.description}</p>
                        {dayItem.morning.insider_tip && (
                          <div className="text-[10px] text-amber-900 bg-amber-100/60 p-2 rounded-lg font-medium">
                            💡 Tip: {dayItem.morning.insider_tip}
                          </div>
                        )}
                      </div>

                      {/* Afternoon */}
                      <div className="p-3.5 rounded-2xl bg-brand-50/60 border border-brand-200/60 space-y-2">
                        <div className="flex items-center justify-between text-xs font-bold text-brand-800">
                          <span>☀️ Afternoon</span>
                          <span className="text-[10px] font-normal text-brand-700">{dayItem.afternoon.time}</span>
                        </div>
                        <h5 className="font-bold text-slate-900 text-xs">{dayItem.afternoon.title}</h5>
                        <p className="text-[11px] text-slate-600 leading-snug">{dayItem.afternoon.description}</p>
                        {dayItem.afternoon.insider_tip && (
                          <div className="text-[10px] text-brand-900 bg-brand-100/60 p-2 rounded-lg font-medium">
                            💡 Tip: {dayItem.afternoon.insider_tip}
                          </div>
                        )}
                      </div>

                      {/* Evening */}
                      <div className="p-3.5 rounded-2xl bg-indigo-50/60 border border-indigo-200/60 space-y-2">
                        <div className="flex items-center justify-between text-xs font-bold text-indigo-800">
                          <span>🌙 Evening</span>
                          <span className="text-[10px] font-normal text-indigo-700">{dayItem.evening.time}</span>
                        </div>
                        <h5 className="font-bold text-slate-900 text-xs">{dayItem.evening.title}</h5>
                        <p className="text-[11px] text-slate-600 leading-snug">{dayItem.evening.description}</p>
                        {dayItem.evening.insider_tip && (
                          <div className="text-[10px] text-indigo-900 bg-indigo-100/60 p-2 rounded-lg font-medium">
                            💡 Tip: {dayItem.evening.insider_tip}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 border border-slate-200/80 text-center shadow-sm space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto text-2xl">
                <i className="fa-solid fa-calculator"></i>
              </div>
              <h3 className="text-xl font-bold text-slate-800">Ready to Plan Your Trip?</h3>
              <p className="text-slate-500 text-sm max-w-md mx-auto">
                Configure your destination and budget on the left, then click <strong>Generate Budget Itinerary</strong> to view algorithmic expense breakdowns and sequenced schedules.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Inquiry Modal */}
      {inquiryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative animate-fadeIn">
            <button
              onClick={() => setInquiryModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100"
            >
              <i className="fa-solid fa-xmark text-lg"></i>
            </button>

            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-2 text-2xl">
                <i className="fa-solid fa-paper-plane"></i>
              </div>
              <h3 className="text-xl font-bold text-slate-900">Request JBD Concierge Booking</h3>
              <p className="text-slate-500 text-xs mt-1">
                Our certified travel specialists will secure your partner hotel rates and finalize your reservations.
              </p>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs space-y-1 mb-4">
              <div className="flex justify-between">
                <span className="text-slate-500">Destination:</span>
                <span className="font-bold text-slate-800">{generatedPlan.destination_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Duration:</span>
                <span className="font-bold text-slate-800">{generatedPlan.duration_days} Days / {generatedPlan.travelers_count} Travelers</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Estimated Quote:</span>
                <span className="font-extrabold text-emerald-700">${generatedPlan.estimated_cost.toLocaleString()} USD</span>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Special Requests or Preferences (Optional)
                </label>
                <textarea
                  rows="3"
                  value={inquirySpecialReq}
                  onChange={e => setInquirySpecialReq(e.target.value)}
                  placeholder="e.g. Preferred airline seating, dietary requirements, high-floor hotel rooms, airport transfer..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
                ></textarea>
              </div>

              <button
                type="button"
                onClick={handleSubmitInquiry}
                disabled={isSubmittingInquiry}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm shadow-lg shadow-emerald-600/25 transition flex items-center justify-center space-x-2"
              >
                {isSubmittingInquiry ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Submitting to Travel Agent...</span>
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-check"></i>
                    <span>Confirm & Send Inquiry</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// ----------------------------------------------------
// MODULE 4: FLIGHT & HOTEL PRICE COMPARISON
// ----------------------------------------------------
function PriceComparisonTab({ showToast, onSelectForPlan }) {
  const [activeSubTab, setActiveSubTab] = useState('flights'); // 'flights' or 'hotels'
  
  // Flight state
  const [flightOrigin, setFlightOrigin] = useState('New York');
  const [flightDest, setFlightDest] = useState('Paris');
  const [cabinClass, setCabinClass] = useState('Economy');
  const [flightStops, setFlightStops] = useState('');
  const [flightSort, setFlightSort] = useState('price');
  const [flightResults, setFlightResults] = useState([]);
  const [flightSourceNotice, setFlightSourceNotice] = useState('');
  const [isFlightLoading, setIsFlightLoading] = useState(false);

  // Hotel state
  const [hotelDest, setHotelDest] = useState('');
  const [hotelStars, setHotelStars] = useState('');
  const [hotelSort, setHotelSort] = useState('recommended');
  const [hotelResults, setHotelResults] = useState([]);
  const [isHotelLoading, setIsHotelLoading] = useState(false);

  useEffect(() => {
    searchFlights();
    searchHotels();
  }, []);

  const searchFlights = async () => {
    setIsFlightLoading(true);
    try {
      const res = await api.searchFlights({
        origin: flightOrigin,
        destination: flightDest,
        cabin_class: cabinClass,
        stops: flightStops,
        sort_by: flightSort
      });
      setFlightResults(res.flights || []);
      setFlightSourceNotice(res.notice || '');
    } catch (err) {
      showToast('Error searching flights', 'error');
    } finally {
      setIsFlightLoading(false);
    }
  };

  const searchHotels = async () => {
    setIsHotelLoading(true);
    try {
      const res = await api.getHotels({
        destination: hotelDest,
        stars: hotelStars,
        sort_by: hotelSort
      });
      setHotelResults(res.hotels || []);
    } catch (err) {
      showToast('Error searching hotels', 'error');
    } finally {
      setIsHotelLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Tab Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <span className="text-xs uppercase font-extrabold tracking-wider bg-indigo-100 text-indigo-700 px-2.5 py-0.5 rounded-full inline-block mb-1">
            Module 4 • Multi-Source Price Intelligence
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900">Flight & Hotel Price Comparison</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Compare live simulated market fares across airlines and examine exclusive JBD Partner Hotel rates against global OTAs.
          </p>
        </div>

        <div className="inline-flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 self-start sm:self-auto">
          <button
            onClick={() => setActiveSubTab('flights')}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
              activeSubTab === 'flights' ? 'bg-white text-brand-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <i className="fa-solid fa-plane"></i>
            <span>Compare Flights</span>
          </button>
          <button
            onClick={() => setActiveSubTab('hotels')}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
              activeSubTab === 'hotels' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <i className="fa-solid fa-hotel"></i>
            <span>Compare Hotels</span>
          </button>
        </div>
      </div>

      {/* FLIGHT PRICE COMPARISON SUBTAB */}
      {activeSubTab === 'flights' && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Simulated API Notice Banner (Mandatory Spec Requirement) */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-start space-x-3 text-xs text-amber-900">
            <i className="fa-solid fa-circle-info text-amber-600 text-base mt-0.5"></i>
            <div>
              <span className="font-bold block">Simulated Flight Distribution Engine (API Simulation Mode)</span>
              <span>{flightSourceNotice || 'Flight pricing and itineraries generated via JBD Mock GDS. Can be toggled to live Amadeus/Sabre APIs in enterprise production deployment.'}</span>
            </div>
          </div>

          {/* Flight Search Form */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-md">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 items-end">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Origin City</label>
                <input
                  type="text"
                  value={flightOrigin}
                  onChange={e => setFlightOrigin(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Destination City</label>
                <input
                  type="text"
                  value={flightDest}
                  onChange={e => setFlightDest(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Cabin Class</label>
                <select
                  value={cabinClass}
                  onChange={e => setCabinClass(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white"
                >
                  <option value="Economy">Economy</option>
                  <option value="Premium Economy">Premium Economy</option>
                  <option value="Business">Business Class</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Sort By</label>
                <select
                  value={flightSort}
                  onChange={e => setFlightSort(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white"
                >
                  <option value="price">Cheapest First</option>
                  <option value="duration">Fastest First</option>
                  <option value="stops">Fewest Stops</option>
                </select>
              </div>

              <button
                type="button"
                onClick={searchFlights}
                disabled={isFlightLoading}
                className="w-full py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-sm font-bold shadow-md shadow-brand-500/25 transition flex items-center justify-center space-x-1.5"
              >
                {isFlightLoading ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <>
                    <i className="fa-solid fa-magnifying-glass"></i>
                    <span>Search Flights</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Flight Offer Cards */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {flightResults.length} Carrier Options Found
              </span>
            </div>

            {flightResults.map(flight => (
              <div
                key={flight.id}
                className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-sm hover:shadow-lg transition flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                {/* Airline & Route */}
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-xl text-brand-600 flex-shrink-0">
                    <i className="fa-solid fa-plane"></i>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-extrabold text-base text-slate-900">{flight.airline_name}</span>
                      <span className="text-xs font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-600">{flight.flight_number}</span>
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {flight.aircraft_type} • {flight.cabin_class}
                    </div>
                  </div>
                </div>

                {/* Timing & Stops */}
                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <div className="text-base font-extrabold text-slate-900">{flight.departure_time}</div>
                    <div className="text-xs text-slate-400 font-semibold">{flight.origin_code || flight.origin_city}</div>
                  </div>

                  <div className="text-center px-2">
                    <div className="text-[11px] font-bold text-slate-500">{flight.duration_formatted}</div>
                    <div className="w-24 h-0.5 bg-slate-200 relative my-1">
                      <i className="fa-solid fa-plane text-[10px] text-brand-600 absolute -top-1.5 left-1/2 -translate-x-1/2"></i>
                    </div>
                    <div className="text-[10px] font-semibold text-slate-400">
                      {flight.stops === 0 ? 'Non-stop' : `${flight.stops} stop (${flight.stop_cities})`}
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="text-base font-extrabold text-slate-900">{flight.arrival_time}</div>
                    <div className="text-xs text-slate-400 font-semibold">{flight.destination_code || flight.destination_city}</div>
                  </div>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-1.5">
                  {flight.badges && flight.badges.map((b, bi) => (
                    <span
                      key={bi}
                      className={`text-[10px] uppercase tracking-wider font-extrabold px-2.5 py-1 rounded-full ${
                        b.type === 'cheapest' ? 'bg-emerald-100 text-emerald-800' :
                        b.type === 'fastest' ? 'bg-sky-100 text-sky-800' : 'bg-purple-100 text-purple-800'
                      }`}
                    >
                      ★ {b.label}
                    </span>
                  ))}
                </div>

                {/* Price & Action */}
                <div className="text-right flex md:flex-col items-center md:items-end justify-between w-full md:w-auto border-t md:border-t-0 pt-3 md:pt-0">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Total fare</span>
                    <span className="text-2xl font-black text-slate-900">${flight.total_price_usd}</span>
                    <span className="text-[10px] text-slate-400 block">incl. ${flight.tax_usd} taxes</span>
                  </div>
                  <button
                    onClick={() => {
                      showToast(`Selected ${flight.airline_name} flight. Launching Budget Planner...`, 'success');
                      onSelectForPlan(flight.destination_city, 2500, 5);
                    }}
                    className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-md shadow-brand-500/20 transition mt-2"
                  >
                    Select Flight
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* HOTEL PRICE COMPARISON SUBTAB */}
      {activeSubTab === 'hotels' && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Hotel Filters Bar */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-md">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 items-end">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Destination</label>
                <input
                  type="text"
                  value={hotelDest}
                  onChange={e => setHotelDest(e.target.value)}
                  placeholder="Filter by city (e.g. Tokyo, Paris...)"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Star Rating</label>
                <select
                  value={hotelStars}
                  onChange={e => setHotelStars(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white"
                >
                  <option value="">All Stars</option>
                  <option value="4">4+ Stars</option>
                  <option value="5">5-Star Luxury Only</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Sort By</label>
                <select
                  value={hotelSort}
                  onChange={e => setHotelSort(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white"
                >
                  <option value="recommended">JBD Recommended</option>
                  <option value="discount">Highest Discount %</option>
                  <option value="price_low">Lowest Price First</option>
                  <option value="stars">Highest Stars</option>
                </select>
              </div>

              <button
                type="button"
                onClick={searchHotels}
                disabled={isHotelLoading}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-md shadow-indigo-500/25 transition flex items-center justify-center space-x-1.5"
              >
                {isHotelLoading ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <>
                    <i className="fa-solid fa-magnifying-glass"></i>
                    <span>Filter Hotels</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Multi-Rate Hotel Price Comparison Cards */}
          <div className="space-y-6">
            {hotelResults.map(hotel => {
              const comp = hotel.price_comparison || {};
              return (
                <div
                  key={hotel.id}
                  className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-xl transition flex flex-col lg:flex-row"
                >
                  {/* Photo & Badge */}
                  <div className="lg:w-80 h-56 lg:h-auto relative overflow-hidden flex-shrink-0">
                    <img
                      src={hotel.image_url}
                      alt={hotel.name}
                      className="w-full h-full object-cover"
                    />
                    {hotel.is_partner && (
                      <div className="absolute top-3 left-3 bg-indigo-600 text-white text-[11px] font-extrabold px-3 py-1 rounded-full shadow-md flex items-center space-x-1">
                        <i className="fa-solid fa-handshake"></i>
                        <span>JBD Partner Club</span>
                      </div>
                    )}
                    <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white px-2.5 py-0.5 rounded text-xs font-semibold">
                      {'★'.repeat(hotel.stars)} {hotel.city}, {hotel.country}
                    </div>
                  </div>

                  {/* Hotel Info & OTA Rate Comparison Table */}
                  <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-slate-900">{hotel.name}</h3>
                        <div className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                          Rating {hotel.rating} / 5.0
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{hotel.description}</p>
                      
                      {/* Amenities Pills */}
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {hotel.amenities.slice(0, 5).map((am, i) => (
                          <span key={i} className="text-[11px] bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md font-medium">
                            ✓ {am}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* COMPARATIVE RATES MATRIX (Standard vs OTA vs JBD Partner Rate) */}
                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                      <div className="text-[11px] uppercase font-bold text-slate-500 mb-2">
                        Cross-Provider Rate Comparison (Per Night)
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                        {/* Standard Rate */}
                        <div className="p-2 rounded-xl bg-white border border-slate-200">
                          <span className="text-[10px] text-slate-400 block">Direct Hotel Price</span>
                          <span className="text-sm font-bold text-slate-500 line-through">${comp.standard_direct_rate}</span>
                        </div>

                        {/* Expedia */}
                        <div className="p-2 rounded-xl bg-white border border-slate-200">
                          <span className="text-[10px] text-slate-400 block">Expedia</span>
                          <span className="text-sm font-bold text-slate-600">${comp.expedia_rate}</span>
                        </div>

                        {/* Booking.com */}
                        <div className="p-2 rounded-xl bg-white border border-slate-200">
                          <span className="text-[10px] text-slate-400 block">Booking.com</span>
                          <span className="text-sm font-bold text-slate-600">${comp.booking_com_rate}</span>
                        </div>

                        {/* JBD Partner Exclusive Rate */}
                        <div className="p-2 rounded-xl bg-emerald-50 border-2 border-emerald-400 shadow-sm">
                          <span className="text-[10px] font-extrabold text-emerald-800 block">JBD Partner Club</span>
                          <span className="text-base font-black text-emerald-700">${comp.jbd_exclusive_partner_rate}</span>
                        </div>
                      </div>

                      {comp.customer_savings_vs_competitor > 0 && (
                        <div className="mt-2 text-center text-xs font-bold text-emerald-700">
                          🎉 Save ${comp.customer_savings_vs_competitor} per night vs major online travel agencies!
                        </div>
                      )}
                    </div>

                    {/* Nearby Attractions */}
                    {hotel.nearby_attractions && hotel.nearby_attractions.length > 0 && (
                      <div className="text-xs text-slate-500">
                        <strong className="text-slate-700">Nearby: </strong>
                        {hotel.nearby_attractions.map((na, i) => (
                          <span key={i} className="mr-3">📍 {na.name} ({na.distance})</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}

// ----------------------------------------------------
// MODULE 5: PARTNER HOTEL CATALOG
// ----------------------------------------------------
function PartnerHotelsTab({ showToast, onSelectDestinationForPlan }) {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHotels();
  }, []);

  const loadHotels = async () => {
    try {
      const res = await api.getHotels({ partner_only: true });
      setHotels(res.hotels || []);
    } catch (err) {
      showToast('Error loading partner hotels', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <span className="text-xs uppercase font-extrabold tracking-wider bg-brand-500/30 text-brand-300 px-3 py-1 rounded-full border border-brand-400/30 inline-block mb-3">
            Module 5 • Official JBD Partner Hotel Program
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold">JBD Partner Hotels & Resorts</h1>
          <p className="text-slate-300 text-sm mt-2 leading-relaxed font-light">
            Exclusive negotiated rates, VIP room upgrades, complimentary breakfasts, and guaranteed late checkouts available only to JBD Travels clients.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center text-slate-400">Loading partner hotels...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hotels.map(hotel => (
            <div
              key={hotel.id}
              className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-xl transition card-hover flex flex-col justify-between"
            >
              <div className="relative h-52">
                <img src={hotel.image_url} alt={hotel.name} className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3 bg-emerald-600 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow">
                  {hotel.partner_discount_percent}% Member Discount
                </div>
                <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white px-2.5 py-0.5 rounded text-xs font-semibold">
                  {'★'.repeat(hotel.stars)} {hotel.city}
                </div>
              </div>

              <div className="p-5 space-y-3 flex-grow">
                <h3 className="font-bold text-base text-slate-900 leading-tight">{hotel.name}</h3>
                <p className="text-xs text-slate-500 line-clamp-2">{hotel.description}</p>
                
                <div className="flex flex-wrap gap-1">
                  {hotel.amenities.slice(0, 4).map((am, i) => (
                    <span key={i} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
                      ✓ {am}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-slate-100 pt-3 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 line-through block">Standard ${hotel.standard_rate_per_night}</span>
                  <span className="text-lg font-black text-emerald-700">${hotel.jbd_partner_rate}</span>
                  <span className="text-[10px] text-slate-500"> / night</span>
                </div>
                <button
                  onClick={() => onSelectDestinationForPlan(hotel.city, 2500, 5)}
                  className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
                >
                  Book In Itinerary
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------
// MODULE 6: TRAVEL DOCUMENTATION (PASSPORT & VISA CHECKER)
// ----------------------------------------------------
function TravelDocsTab({ showToast }) {
  const [origins, setOrigins] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [originCountry, setOriginCountry] = useState('United States');
  const [destCountry, setDestCountry] = useState('Japan');
  const [advisory, setAdvisory] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCountries();
  }, []);

  const loadCountries = async () => {
    try {
      const res = await api.getSupportedCountries();
      setOrigins(res.origins || ['United States', 'United Kingdom', 'Canada', 'Australia']);
      setDestinations(res.destinations || ['Japan', 'France', 'Indonesia', 'United Arab Emirates']);
      // Run initial check
      checkVisaRequirement('United States', 'Japan');
    } catch (err) {
      showToast('Error loading country catalogue', 'error');
    }
  };

  const checkVisaRequirement = async (orig, dest) => {
    setLoading(true);
    try {
      const res = await api.checkTravelDocs(orig || originCountry, dest || destCountry);
      setAdvisory(res.advisory);
    } catch (err) {
      showToast('Failed to check travel documentation', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10 pb-16">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-rose-900 via-rose-800 to-slate-900 rounded-3xl p-8 sm:p-10 text-white shadow-xl">
        <div className="max-w-2xl">
          <span className="text-xs uppercase font-extrabold tracking-wider bg-rose-500/30 text-rose-200 px-3 py-1 rounded-full border border-rose-400/30 inline-block mb-3">
            Module 6 • Global Immigration & Entry Intelligence
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Passport, Visa & Entry Requirements
          </h1>
          <p className="text-rose-100 text-sm mt-2 leading-relaxed font-light">
            Stay compliant and avoid border delays. Check destination-specific visa policies, minimum passport validity thresholds, and direct government immigration portals.
          </p>
        </div>
      </div>

      {/* Interactive Visa Checker Control */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
              <i className="fa-solid fa-passport text-brand-600 mr-1.5"></i> Traveler's Passport / Citizenship
            </label>
            <select
              value={originCountry}
              onChange={e => {
                setOriginCountry(e.target.value);
                checkVisaRequirement(e.target.value, destCountry);
              }}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold bg-white"
            >
              {origins.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
              <i className="fa-solid fa-location-dot text-rose-600 mr-1.5"></i> Traveling To Destination
            </label>
            <select
              value={destCountry}
              onChange={e => {
                setDestCountry(e.target.value);
                checkVisaRequirement(originCountry, e.target.value);
              }}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold bg-white"
            >
              {destDestOptions(destinations).map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <button
            type="button"
            onClick={() => checkVisaRequirement(originCountry, destCountry)}
            disabled={loading}
            className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-bold shadow-md shadow-rose-600/20 transition flex items-center justify-center space-x-2"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <>
                <i className="fa-solid fa-magnifying-glass"></i>
                <span>Lookup Requirements</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Advisory Results Card */}
      {advisory && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-lg space-y-6 animate-fadeIn">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-3">
            <div>
              <span className="text-xs uppercase font-extrabold text-slate-400">Entry Status Assessment</span>
              <h3 className="text-2xl font-black text-slate-900 mt-0.5">
                {advisory.origin_country} Citizens Visiting {advisory.destination_country}
              </h3>
            </div>

            <div className={`px-4 py-2 rounded-2xl font-extrabold text-xs flex items-center space-x-2 ${
              advisory.visa_requirement_type.includes('Free')
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                : 'bg-amber-100 text-amber-800 border border-amber-200'
            }`}>
              <i className="fa-solid fa-stamp"></i>
              <span>{advisory.visa_requirement_type}</span>
            </div>
          </div>

          {/* Core Passport & Visa Criteria Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <span className="text-[11px] text-slate-400 font-bold uppercase block">Max Stay Duration</span>
              <span className="text-lg font-black text-slate-800">{advisory.max_stay_days} Days</span>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <span className="text-[11px] text-slate-400 font-bold uppercase block">Passport Validity</span>
              <span className="text-lg font-black text-slate-800">{advisory.passport_validity_months} Months</span>
              <span className="text-[10px] text-slate-400 block">Remaining on entry</span>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <span className="text-[11px] text-slate-400 font-bold uppercase block">Blank Pages</span>
              <span className="text-lg font-black text-slate-800">{advisory.blank_passport_pages_needed} Pages</span>
              <span className="text-[10px] text-slate-400 block">For visa/entry stamps</span>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <span className="text-[11px] text-slate-400 font-bold uppercase block">Estimated Fee</span>
              <span className="text-lg font-black text-slate-800">
                {advisory.estimated_fee_usd === 0 ? 'Free ($0)' : `$${advisory.estimated_fee_usd} USD`}
              </span>
            </div>
          </div>

          {/* Procedures & Checklist */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Border Entry Procedures & Regulations
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  {advisory.entry_procedures}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Immunization & Health Guidelines
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <i className="fa-solid fa-syringe mr-1.5 text-brand-600"></i>
                  {advisory.mandatory_vaccines}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Required Documents Checklist
                </h4>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                  {advisory.required_documents && advisory.required_documents.map((doc, idx) => (
                    <div key={idx} className="flex items-start space-x-2 text-xs text-slate-700">
                      <i className="fa-solid fa-circle-check text-emerald-500 mt-0.5"></i>
                      <span>{doc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {advisory.official_portal_url && (
                <div className="p-4 rounded-2xl bg-brand-50 border border-brand-200 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-brand-900">Official Immigration Authority</div>
                    <div className="text-[11px] text-brand-600">Verified government source link</div>
                  </div>
                  <a
                    href={advisory.official_portal_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center space-x-1.5"
                  >
                    <span>Visit Official Portal</span>
                    <i className="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

function destDestOptions(destinations) {
  const common = ['Japan', 'France', 'Indonesia', 'United Arab Emirates', 'Italy', 'South Africa', 'Thailand', 'United States'];
  return Array.from(new Set([...destinations, ...common])).sort();
}

// ----------------------------------------------------
// SAVED ITINERARIES & MY TRIPS
// ----------------------------------------------------
function ItinerariesTab({ currentUser, showToast, setActiveTab, onSelectDestinationForPlan }) {
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewModalItinerary, setViewModalItinerary] = useState(null);

  useEffect(() => {
    loadItineraries();
  }, []);

  const loadItineraries = async () => {
    try {
      const res = await api.getItineraries();
      setItineraries(res.itineraries || []);
    } catch (err) {
      showToast('Log in to view saved custom itineraries', 'info');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this itinerary?')) return;
    try {
      await api.deleteItinerary(id);
      showToast('Itinerary deleted successfully', 'success');
      setItineraries(itineraries.filter(it => it.id !== id));
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  return (
    <div className="space-y-8 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-3">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">My Travel Plans & Itineraries</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Review your generated itineraries, customize schedules, and track booking statuses with JBD Travel Agents.
          </p>
        </div>
        <button
          onClick={() => setActiveTab('planner')}
          className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-md shadow-brand-500/25 transition flex items-center space-x-1.5 self-start sm:self-auto"
        >
          <i className="fa-solid fa-plus"></i>
          <span>Create New Plan</span>
        </button>
      </div>

      {loading ? (
        <div className="py-12 text-center text-slate-400">Loading your itineraries...</div>
      ) : itineraries.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-sm max-w-lg mx-auto space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto text-2xl">
            <i className="fa-solid fa-suitcase-rolling"></i>
          </div>
          <h3 className="text-lg font-bold text-slate-800">No Itineraries Saved Yet</h3>
          <p className="text-slate-500 text-xs">
            Use our AI Budget Planner to generate custom itineraries, review attractions, and save your trip to this page!
          </p>
          <button
            onClick={() => setActiveTab('planner')}
            className="px-6 py-2.5 bg-brand-600 text-white rounded-xl text-xs font-bold hover:bg-brand-700 shadow-md transition"
          >
            Launch Budget Planner
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {itineraries.map(it => (
            <div
              key={it.id}
              className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-lg transition flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                    it.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-800' :
                    it.status === 'Inquired' ? 'bg-indigo-100 text-indigo-800' : 'bg-slate-100 text-slate-700'
                  }`}>
                    ● {it.status}
                  </span>
                  <span className="text-xs text-slate-400">ID #{it.id}</span>
                </div>

                <h3 className="text-xl font-bold text-slate-900">{it.title}</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Destination: <strong className="text-slate-700">{it.destination_name}</strong> • {it.duration_days} Days / {it.travelers_count} Travelers
                </p>

                <div className="grid grid-cols-2 gap-2 mt-4 bg-slate-50 p-3 rounded-2xl text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Estimated Cost</span>
                    <span className="font-extrabold text-slate-800">${it.estimated_cost.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Target Budget</span>
                    <span className="font-bold text-slate-600">${it.total_budget.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => setViewModalItinerary(it)}
                  className="px-4 py-2 bg-brand-50 hover:bg-brand-100 text-brand-700 rounded-xl text-xs font-bold transition flex items-center space-x-1"
                >
                  <i className="fa-solid fa-eye"></i>
                  <span>View Details</span>
                </button>

                <div className="flex space-x-1.5">
                  <button
                    onClick={() => handleDelete(it.id)}
                    className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg text-xs"
                    title="Delete Itinerary"
                  >
                    <i className="fa-regular fa-trash-can"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View Itinerary Modal */}
      {viewModalItinerary && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto animate-fadeIn space-y-6">
            <button
              onClick={() => setViewModalItinerary(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100"
            >
              <i className="fa-solid fa-xmark text-lg"></i>
            </button>

            <div>
              <span className="text-xs uppercase font-extrabold tracking-wider bg-brand-50 text-brand-700 px-2 py-0.5 rounded">
                Itinerary #{viewModalItinerary.id}
              </span>
              <h2 className="text-2xl font-black text-slate-900 mt-1">{viewModalItinerary.title}</h2>
              <p className="text-xs text-slate-500">
                Created for {viewModalItinerary.customer_name} • Total Cost: ${viewModalItinerary.estimated_cost}
              </p>
            </div>

            {/* Daily Schedule Listing */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Daily Schedule</h4>
              {viewModalItinerary.daily_schedule && viewModalItinerary.daily_schedule.map((day, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                  <div className="font-bold text-slate-900 text-sm">{day.theme}</div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-slate-600">
                    <div>
                      <strong>Morning:</strong> {day.morning.title} (${day.morning.cost_usd})
                    </div>
                    <div>
                      <strong>Afternoon:</strong> {day.afternoon.title} (${day.afternoon.cost_usd})
                    </div>
                    <div>
                      <strong>Evening:</strong> {day.evening.title} (${day.evening.cost_usd})
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                onClick={() => setViewModalItinerary(null)}
                className="px-5 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// ----------------------------------------------------
// MODULE 7: ADMINISTRATIVE DASHBOARD COMPONENT
// ----------------------------------------------------
function AdminDashboardTab({ currentUser, showToast }) {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adminHotels, setAdminHotels] = useState([]);
  const [adminInquiries, setAdminInquiries] = useState([]);
  const [settings, setSettings] = useState({});

  // CRUD Hotel Modal state
  const [hotelModalOpen, setHotelModalOpen] = useState(false);
  const [editingHotel, setEditingHotel] = useState(null);
  const [hotelFormName, setHotelFormName] = useState('');
  const [hotelFormCity, setHotelFormCity] = useState('');
  const [hotelFormCountry, setHotelFormCountry] = useState('');
  const [hotelFormRate, setHotelFormRate] = useState(250);
  const [hotelFormDiscount, setHotelFormDiscount] = useState(15);
  const [hotelFormCommission, setHotelFormCommission] = useState(12);
  const [hotelFormStars, setHotelFormStars] = useState(4);
  const [hotelFormDesc, setHotelFormDesc] = useState('');
  const [hotelFormImage, setHotelFormImage] = useState('');

  // Active view inside admin dashboard
  const [adminSubView, setAdminSubView] = useState('analytics'); // 'analytics', 'hotels', 'inquiries', 'settings'

  const chartRef1 = useRef(null);
  const chartInstance1 = useRef(null);
  const chartRef2 = useRef(null);
  const chartInstance2 = useRef(null);

  useEffect(() => {
    loadAllAdminData();
  }, []);

  const loadAllAdminData = async () => {
    setLoading(true);
    try {
      const [dashRes, hotelsRes, inqRes, setRes] = await Promise.all([
        api.getAdminDashboard(),
        api.getAdminHotels(),
        api.getAdminInquiries(),
        api.getAdminSettings()
      ]);
      setDashboardData(dashRes);
      setAdminHotels(hotelsRes.hotels || []);
      setAdminInquiries(inqRes.inquiries || []);
      setSettings(setRes.settings || {});
    } catch (err) {
      showToast('Access restricted: Employee or Admin privileges required.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Render Chart.js when dashboardData is available
  useEffect(() => {
    if (adminSubView === 'analytics' && dashboardData && chartRef1.current && chartRef2.current) {
      // Clean up previous charts if any
      if (chartInstance1.current) chartInstance1.current.destroy();
      if (chartInstance2.current) chartInstance2.current.destroy();

      const ctx1 = chartRef1.current.getContext('2d');
      const monthlyData = dashboardData.charts.monthly_trends;

      chartInstance1.current = new Chart(ctx1, {
        type: 'bar',
        data: {
          labels: monthlyData.labels,
          datasets: [
            {
              label: 'Gross Booked Revenue ($)',
              data: monthlyData.revenue,
              backgroundColor: 'rgba(2, 132, 199, 0.85)',
              borderRadius: 6
            },
            {
              label: 'JBD Commission Earned ($)',
              data: monthlyData.commission,
              backgroundColor: 'rgba(16, 185, 129, 0.85)',
              borderRadius: 6
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top' }
          }
        }
      });

      const ctx2 = chartRef2.current.getContext('2d');
      const stylesData = dashboardData.charts.travel_styles;

      chartInstance2.current = new Chart(ctx2, {
        type: 'doughnut',
        data: {
          labels: stylesData.labels,
          datasets: [
            {
              data: stylesData.data,
              backgroundColor: [
                '#0284c7', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'
              ]
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' }
          }
        }
      });
    }

    return () => {
      if (chartInstance1.current) chartInstance1.current.destroy();
      if (chartInstance2.current) chartInstance2.current.destroy();
    };
  }, [adminSubView, dashboardData]);

  // Open modal for hotel create or edit
  const openHotelModal = (hotel = null) => {
    if (hotel) {
      setEditingHotel(hotel);
      setHotelFormName(hotel.name);
      setHotelFormCity(hotel.city);
      setHotelFormCountry(hotel.country);
      setHotelFormRate(hotel.standard_rate_per_night);
      setHotelFormDiscount(hotel.partner_discount_percent);
      setHotelFormCommission(hotel.jbd_commission_percent);
      setHotelFormStars(hotel.stars);
      setHotelFormDesc(hotel.description);
      setHotelFormImage(hotel.image_url);
    } else {
      setEditingHotel(null);
      setHotelFormName('');
      setHotelFormCity('');
      setHotelFormCountry('');
      setHotelFormRate(200);
      setHotelFormDiscount(15);
      setHotelFormCommission(12);
      setHotelFormStars(4);
      setHotelFormDesc('Luxury hotel partner with exceptional hospitality.');
      setHotelFormImage('https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600');
    }
    setHotelModalOpen(true);
  };

  const handleSaveHotel = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: hotelFormName,
        city: hotelFormCity,
        country: hotelFormCountry,
        standard_rate_per_night: Number(hotelFormRate),
        partner_discount_percent: Number(hotelFormDiscount),
        jbd_commission_percent: Number(hotelFormCommission),
        stars: Number(hotelFormStars),
        description: hotelFormDesc,
        image_url: hotelFormImage,
        is_partner: true
      };

      if (editingHotel) {
        const res = await api.updateAdminHotel(editingHotel.id, payload);
        showToast(res.message, 'success');
        setAdminHotels(adminHotels.map(h => h.id === editingHotel.id ? res.hotel : h));
      } else {
        const res = await api.createAdminHotel(payload);
        showToast(res.message, 'success');
        setAdminHotels([res.hotel, ...adminHotels]);
      }
      setHotelModalOpen(false);
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleDeleteHotel = async (id) => {
    if (!confirm('Permanently remove this partner hotel from JBD Travel catalog?')) return;
    try {
      await api.deleteAdminHotel(id);
      showToast('Hotel deleted from network', 'success');
      setAdminHotels(adminHotels.filter(h => h.id !== id));
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleUpdateInquiryStatus = async (inqId, newStatus) => {
    try {
      const res = await api.updateAdminInquiry(inqId, { status: newStatus });
      showToast(`Inquiry #${inqId} status updated to ${newStatus}`, 'success');
      setAdminInquiries(adminInquiries.map(inq => inq.id === inqId ? res.inquiry : inq));
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      await api.updateAdminSettings(settings);
      showToast('Agency commission & pricing policy updated successfully', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  if (!currentUser || !['employee', 'admin'].includes(currentUser.role)) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-md max-w-md mx-auto space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto text-2xl">
          <i className="fa-solid fa-lock"></i>
        </div>
        <h3 className="text-xl font-bold text-slate-900">Restricted Admin Portal</h3>
        <p className="text-slate-500 text-xs leading-relaxed">
          The JBD Administrative Dashboard is reserved for authorized agency employees and system administrators.
        </p>
        <div className="pt-2">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Switch to Demo Staff Account:</p>
          <button
            onClick={() => {
              api.login('admin@jbdtravels.com', 'Admin123!').then(() => window.location.reload());
            }}
            className="px-5 py-2.5 bg-purple-600 text-white rounded-xl text-xs font-bold hover:bg-purple-700 shadow-md transition"
          >
            Sign In as Admin (Sarah Jenkins)
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      
      {/* Top Bar with Sub-View Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-200 gap-4">
        <div>
          <span className="text-xs uppercase font-extrabold tracking-wider bg-purple-100 text-purple-800 px-3 py-0.5 rounded-full inline-block mb-1">
            Module 7 • Administrative Governance & Analytics
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900">JBD Travels Management Console</h1>
          <p className="text-slate-500 text-xs">
            Logged in as <strong className="text-slate-700">{currentUser.full_name}</strong> ({currentUser.role.toUpperCase()})
          </p>
        </div>

        <div className="inline-flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 flex-wrap gap-1">
          <button
            onClick={() => setAdminSubView('analytics')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
              adminSubView === 'analytics' ? 'bg-white text-purple-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <i className="fa-solid fa-chart-line"></i>
            <span>Executive KPIs</span>
          </button>

          <button
            onClick={() => setAdminSubView('hotels')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
              adminSubView === 'hotels' ? 'bg-white text-purple-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <i className="fa-solid fa-hotel"></i>
            <span>Partner Hotels ({adminHotels.length})</span>
          </button>

          <button
            onClick={() => setAdminSubView('inquiries')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
              adminSubView === 'inquiries' ? 'bg-white text-purple-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <i className="fa-solid fa-clipboard-list"></i>
            <span>Bookings & Plans ({adminInquiries.length})</span>
          </button>

          {currentUser.role === 'admin' && (
            <button
              onClick={() => setAdminSubView('settings')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                adminSubView === 'settings' ? 'bg-white text-purple-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <i className="fa-solid fa-sliders"></i>
              <span>Pricing Rules</span>
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center text-slate-400">Loading management data...</div>
      ) : (
        <>
          {/* SUBVIEW 1: EXECUTIVE ANALYTICS & CHARTS */}
          {adminSubView === 'analytics' && dashboardData && (
            <div className="space-y-8 animate-fadeIn">
              
              {/* Executive KPI Stat Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm">
                  <div className="flex items-center justify-between text-brand-600 mb-2">
                    <span className="text-xs font-bold uppercase text-slate-500">Total Booked Volume</span>
                    <i className="fa-solid fa-sack-dollar text-xl"></i>
                  </div>
                  <div className="text-2xl font-black text-slate-900">
                    ${dashboardData.kpis.total_revenue.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-emerald-600 font-bold mt-1">
                    ↑ 18.4% vs last quarter
                  </div>
                </div>

                <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm">
                  <div className="flex items-center justify-between text-emerald-600 mb-2">
                    <span className="text-xs font-bold uppercase text-slate-500">Agency Commission Earned</span>
                    <i className="fa-solid fa-hand-holding-dollar text-xl"></i>
                  </div>
                  <div className="text-2xl font-black text-emerald-700">
                    ${dashboardData.kpis.total_commission_earned.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">
                    Avg margin: {dashboardData.kpis.avg_commission_rate}%
                  </div>
                </div>

                <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm">
                  <div className="flex items-center justify-between text-indigo-600 mb-2">
                    <span className="text-xs font-bold uppercase text-slate-500">Active Partner Hotels</span>
                    <i className="fa-solid fa-hotel text-xl"></i>
                  </div>
                  <div className="text-2xl font-black text-slate-900">
                    {dashboardData.kpis.active_partner_hotels}
                  </div>
                  <div className="text-[10px] text-indigo-600 font-semibold mt-1">
                    Avg negotiated discount: {dashboardData.kpis.avg_partner_discount}%
                  </div>
                </div>

                <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm">
                  <div className="flex items-center justify-between text-purple-600 mb-2">
                    <span className="text-xs font-bold uppercase text-slate-500">Customer Travel Plans</span>
                    <i className="fa-solid fa-map-location-dot text-xl"></i>
                  </div>
                  <div className="text-2xl font-black text-slate-900">
                    {dashboardData.kpis.total_travel_plans}
                  </div>
                  <div className="text-[10px] text-purple-600 font-semibold mt-1">
                    {dashboardData.kpis.total_inquiries} active inquiries
                  </div>
                </div>
              </div>

              {/* Chart.js Visualizations (Recommended Technology Stack) */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Revenue & Commission Trend Bar Chart */}
                <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-slate-900 text-base">Monthly Revenue & Commission Performance</h3>
                      <p className="text-xs text-slate-400">Financial growth tracking over recent operational period</p>
                    </div>
                    <span className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded-md font-semibold">
                      Chart.js Engine
                    </span>
                  </div>
                  <div className="h-64">
                    <canvas ref={chartRef1}></canvas>
                  </div>
                </div>

                {/* Popular Travel Styles Distribution Doughnut Chart */}
                <div className="lg:col-span-1 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-slate-900 text-base">Customer Travel Preferences</h3>
                      <p className="text-xs text-slate-400">Style distribution</p>
                    </div>
                  </div>
                  <div className="h-64">
                    <canvas ref={chartRef2}></canvas>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SUBVIEW 2: PARTNER HOTEL CRUD MANAGEMENT */}
          {adminSubView === 'hotels' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Partner Hotels Directory</h3>
                  <p className="text-xs text-slate-500">Configure standard rates, negotiated discounts, and JBD commission percentages.</p>
                </div>
                {currentUser.role === 'admin' && (
                  <button
                    onClick={() => openHotelModal()}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center space-x-1.5"
                  >
                    <i className="fa-solid fa-plus"></i>
                    <span>Add Partner Hotel</span>
                  </button>
                )}
              </div>

              <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 uppercase font-bold tracking-wider border-b border-slate-200">
                      <tr>
                        <th className="p-4">Hotel Name & City</th>
                        <th className="p-4">Stars</th>
                        <th className="p-4">Standard Rate</th>
                        <th className="p-4">Discount %</th>
                        <th className="p-4">Negotiated Rate</th>
                        <th className="p-4">Commission %</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {adminHotels.map(h => (
                        <tr key={h.id} className="hover:bg-slate-50/80 transition">
                          <td className="p-4">
                            <div className="font-bold text-slate-800">{h.name}</div>
                            <div className="text-[11px] text-slate-400">{h.city}, {h.country}</div>
                          </td>
                          <td className="p-4 text-amber-500 font-bold">
                            {'★'.repeat(h.stars)}
                          </td>
                          <td className="p-4 font-semibold text-slate-700">
                            ${h.standard_rate_per_night}
                          </td>
                          <td className="p-4">
                            <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-extrabold">
                              {h.partner_discount_percent}%
                            </span>
                          </td>
                          <td className="p-4 font-black text-emerald-800">
                            ${h.jbd_partner_rate}
                          </td>
                          <td className="p-4 font-bold text-purple-700">
                            {h.jbd_commission_percent}% (${h.commission_per_night}/nt)
                          </td>
                          <td className="p-4 text-right space-x-2">
                            {currentUser.role === 'admin' && (
                              <>
                                <button
                                  onClick={() => openHotelModal(h)}
                                  className="p-1.5 text-brand-600 hover:bg-brand-50 rounded-lg"
                                  title="Edit Pricing & Discounts"
                                >
                                  <i className="fa-regular fa-pen-to-square"></i>
                                </button>
                                <button
                                  onClick={() => handleDeleteHotel(h.id)}
                                  className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg"
                                  title="Delete Hotel"
                                >
                                  <i className="fa-regular fa-trash-can"></i>
                                </button>
                              </>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* SUBVIEW 3: CUSTOMER TRAVEL PLANS & INQUIRIES */}
          {adminSubView === 'inquiries' && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Customer Travel Plans & Booking Inquiries</h3>
                <p className="text-xs text-slate-500">Manage trip statuses, assign travel specialists, and confirm bookings.</p>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 uppercase font-bold tracking-wider border-b border-slate-200">
                      <tr>
                        <th className="p-4">ID</th>
                        <th className="p-4">Customer</th>
                        <th className="p-4">Trip Destination</th>
                        <th className="p-4">Quote Amount</th>
                        <th className="p-4">Commission</th>
                        <th className="p-4">Assigned Agent</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Update Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {adminInquiries.map(inq => (
                        <tr key={inq.id} className="hover:bg-slate-50/80 transition">
                          <td className="p-4 font-mono text-slate-400">#{inq.id}</td>
                          <td className="p-4">
                            <div className="font-bold text-slate-800">{inq.customer_name}</div>
                            <div className="text-[11px] text-slate-400">{inq.customer_email}</div>
                          </td>
                          <td className="p-4 font-semibold text-slate-700">
                            {inq.destination_name}
                          </td>
                          <td className="p-4 font-black text-slate-900">
                            ${inq.quote_amount.toLocaleString()}
                          </td>
                          <td className="p-4 font-bold text-emerald-700">
                            +${inq.commission_earned.toLocaleString()}
                          </td>
                          <td className="p-4 text-slate-600">
                            {inq.assigned_employee_name}
                          </td>
                          <td className="p-4">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                              inq.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-800' :
                              inq.status === 'In Review' ? 'bg-brand-100 text-brand-800' :
                              inq.status === 'Cancelled' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {inq.status}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <select
                              value={inq.status}
                              onChange={e => handleUpdateInquiryStatus(inq.id, e.target.value)}
                              className="px-2 py-1 rounded-lg border border-slate-200 text-xs bg-white font-medium"
                            >
                              <option value="Pending">Pending</option>
                              <option value="In Review">In Review</option>
                              <option value="Confirmed">Confirmed</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* SUBVIEW 4: SETTINGS & PRICING RULES */}
          {adminSubView === 'settings' && currentUser.role === 'admin' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm max-w-xl animate-fadeIn">
              <h3 className="text-xl font-bold text-slate-900 mb-1">Commission & Pricing Configuration</h3>
              <p className="text-xs text-slate-500 mb-6">
                Define agency-wide baseline commission percentages and partner discount margins.
              </p>

              <form onSubmit={handleSaveSettings} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Default JBD Agency Commission (%)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={settings.default_commission_percent || '12.0'}
                    onChange={e => setSettings({ ...settings, default_commission_percent: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">Applied to standard booking quotes and non-customized partner deals.</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Default Partner Hotel Discount (%)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={settings.default_discount_percent || '15.0'}
                    onChange={e => setSettings({ ...settings, default_discount_percent: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Customer Concierge Phone Hotline
                  </label>
                  <input
                    type="text"
                    value={settings.support_hotline || '+1 (800) 523-8728'}
                    onChange={e => setSettings({ ...settings, support_hotline: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs shadow-md transition"
                >
                  Save Global Configuration
                </button>
              </form>
            </div>
          )}
        </>
      )}

      {/* Hotel Add/Edit Modal */}
      {hotelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative max-h-[90vh] overflow-y-auto animate-fadeIn">
            <button
              onClick={() => setHotelModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100"
            >
              <i className="fa-solid fa-xmark text-lg"></i>
            </button>

            <h3 className="text-xl font-bold text-slate-900 mb-1">
              {editingHotel ? `Edit Hotel: ${editingHotel.name}` : 'Add New Partner Hotel'}
            </h3>
            <p className="text-xs text-slate-500 mb-4">Set pricing, discount %, and JBD commission percentages.</p>

            <form onSubmit={handleSaveHotel} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Hotel Name</label>
                <input
                  type="text"
                  required
                  value={hotelFormName}
                  onChange={e => setHotelFormName(e.target.value)}
                  placeholder="e.g. Grand Hyatt Tokyo"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={hotelFormCity}
                    onChange={e => setHotelFormCity(e.target.value)}
                    placeholder="Tokyo"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Country</label>
                  <input
                    type="text"
                    required
                    value={hotelFormCountry}
                    onChange={e => setHotelFormCountry(e.target.value)}
                    placeholder="Japan"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Public Rate ($)</label>
                  <input
                    type="number"
                    step="1"
                    required
                    value={hotelFormRate}
                    onChange={e => setHotelFormRate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Discount %</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={hotelFormDiscount}
                    onChange={e => setHotelFormDiscount(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Commission %</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={hotelFormCommission}
                    onChange={e => setHotelFormCommission(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Star Rating</label>
                <select
                  value={hotelFormStars}
                  onChange={e => setHotelFormStars(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                >
                  <option value="3">3 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="5">5 Stars (Luxury)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Image URL</label>
                <input
                  type="text"
                  value={hotelFormImage}
                  onChange={e => setHotelFormImage(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows="2"
                  value={hotelFormDesc}
                  onChange={e => setHotelFormDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                ></textarea>
              </div>

              <div className="pt-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setHotelModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-md"
                >
                  Save Partner Hotel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

// ----------------------------------------------------
// MAIN APPLICATION ROOT COMPONENT
// ----------------------------------------------------
function App() {
  const [activeTab, setActiveTab] = useState('explore');
  const [currentUser, setCurrentUser] = useState(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [toasts, setToasts] = useState([]);

  // Planner state passed between tabs
  const [plannerDestination, setPlannerDestination] = useState('');
  const [plannerBudget, setPlannerBudget] = useState(3000);
  const [plannerDuration, setPlannerDuration] = useState(5);

  useEffect(() => {
    // Check saved token or user
    const user = api.getUser();
    if (user) {
      setCurrentUser(user);
    } else {
      // Auto-load customer demo account for smooth initial presentation
      api.login('customer@jbdtravels.com', 'Customer123!').then(res => {
        setCurrentUser(res.user);
      }).catch(() => {});
    }
  }, []);

  const showToast = (message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const handleLogout = () => {
    api.logout();
    setCurrentUser(null);
    showToast('Signed out of JBD Travels.', 'info');
  };

  const handleQuickSwitchRole = async (targetRole) => {
    try {
      let email = 'customer@jbdtravels.com';
      let pass = 'Customer123!';
      if (targetRole === 'employee') {
        email = 'agent@jbdtravels.com';
        pass = 'Agent123!';
      } else if (targetRole === 'admin') {
        email = 'admin@jbdtravels.com';
        pass = 'Admin123!';
      }
      const res = await api.login(email, pass);
      setCurrentUser(res.user);
      showToast(`Switched active view to ${res.user.full_name} (${res.user.role.toUpperCase()})`, 'success');
      if (targetRole === 'admin' || targetRole === 'employee') {
        setActiveTab('admin');
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleSelectDestinationForPlan = (destName, budget = 2500, duration = 5) => {
    setPlannerDestination(destName);
    setPlannerBudget(budget);
    setPlannerDuration(duration);
    setActiveTab('planner');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onOpenAuth={() => setAuthModalOpen(true)}
        onLogout={handleLogout}
        onQuickSwitchRole={handleQuickSwitchRole}
      />

      {/* Main Tab Content */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-8">
        {activeTab === 'explore' && (
          <ExploreTab
            onSelectDestinationForPlan={handleSelectDestinationForPlan}
            showToast={showToast}
          />
        )}

        {activeTab === 'planner' && (
          <BudgetPlannerTab
            initialDestination={plannerDestination}
            initialBudget={plannerBudget}
            initialDuration={plannerDuration}
            currentUser={currentUser}
            showToast={showToast}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'compare' && (
          <PriceComparisonTab
            showToast={showToast}
            onSelectForPlan={handleSelectDestinationForPlan}
          />
        )}

        {activeTab === 'hotels' && (
          <PartnerHotelsTab
            showToast={showToast}
            onSelectDestinationForPlan={handleSelectDestinationForPlan}
          />
        )}

        {activeTab === 'docs' && (
          <TravelDocsTab
            showToast={showToast}
          />
        )}

        {activeTab === 'itineraries' && (
          <ItinerariesTab
            currentUser={currentUser}
            showToast={showToast}
            setActiveTab={setActiveTab}
            onSelectDestinationForPlan={handleSelectDestinationForPlan}
          />
        )}

        {activeTab === 'admin' && (
          <AdminDashboardTab
            currentUser={currentUser}
            showToast={showToast}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-10 border-t border-slate-800 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 text-white mb-2 font-bold text-base">
              <i className="fa-solid fa-plane-departure text-brand-500"></i>
              <span>JBD Travels</span>
            </div>
            <p className="text-slate-400 font-light leading-relaxed">
              Design & Development of an AI-Assisted Travel Planning and Management System.
            </p>
          </div>

          <div>
            <div className="font-bold text-white mb-2">Modules</div>
            <div className="space-y-1">
              <div>Module 1: UI & Role-Based Auth</div>
              <div>Module 2: Budget-Based Planning</div>
              <div>Module 3: AI Recommendations</div>
              <div>Module 4: Price Comparison Engine</div>
            </div>
          </div>

          <div>
            <div className="font-bold text-white mb-2">Management</div>
            <div className="space-y-1">
              <div>Module 5: Partner Hotel Management</div>
              <div>Module 6: Passport & Visa Intelligence</div>
              <div>Module 7: Administrative Dashboard</div>
            </div>
          </div>

          <div>
            <div className="font-bold text-white mb-2">Prototype Tech Stack</div>
            <div className="space-y-1">
              <div>Frontend: React.js & Tailwind CSS</div>
              <div>Backend: Python Flask & REST APIs</div>
              <div>AI: Scikit-Learn Cosine Similarity</div>
              <div>Visualisation: Chart.js</div>
            </div>
          </div>
        </div>
      </footer>

      {/* Global Modals & Notifications */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onAuthSuccess={user => setCurrentUser(user)}
        showToast={showToast}
      />

      <ToastContainer
        toasts={toasts}
        removeToast={removeToast}
      />
    </div>
  );
}

// Mount React Root
const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);
root.render(<App />);
