import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  User,
  ShieldCheck,
  Mail,
  CheckCircle2,
  XCircle,
  RefreshCw,
  KeyRound,
  ShieldAlert,
  Clock,
  Laptop,
  Monitor,
  Smartphone,
  Globe,
  Trash2,
  LogOut,
  ChevronDown,
  ChevronUp,
  History,
  ShieldOff
} from 'lucide-react';
import API from '../services/api';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const { user, checkAuth, isAdmin } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [revokingOthers, setRevokingOthers] = useState(false);
  const [apiResponse, setApiResponse] = useState(null);

  // Login History & Sessions State
  const [recentHistory, setRecentHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [activeSessions, setActiveSessions] = useState([]);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [activeTab, setActiveTab] = useState('recentHistory'); // 'recentHistory' | 'activeSessions'
  const [historyLimit, setHistoryLimit] = useState(10);

  const fetchRecentHistory = async (limit = 10) => {
    setLoadingHistory(true);
    try {
      const res = await API.get(`/auth/login-history/recent?limit=${limit}`);
      const list = res.data?.data?.history || res.data?.history || [];
      setRecentHistory(list);
      setApiResponse({ action: 'Fetch Recent History', status: res.status, count: list.length });
    } catch (err) {
      toast.error('Failed to load recent login history');
    } finally {
      setLoadingHistory(false);
    }
  };

  const fetchActiveSessions = async () => {
    setLoadingSessions(true);
    try {
      const res = await API.get('/auth/sessions');
      const sessions = res.data?.data?.sessions || res.data?.sessions || [];
      setActiveSessions(sessions);
      setApiResponse({ action: 'Fetch Active Sessions', status: res.status, count: sessions.length });
    } catch (err) {
      toast.error('Failed to load active sessions');
    } finally {
      setLoadingSessions(false);
    }
  };

  useEffect(() => {
    fetchRecentHistory(historyLimit);
    fetchActiveSessions();
  }, []);

  const handleTestRefresh = async () => {
    setRefreshing(true);
    try {
      const res = await API.post('/auth/refresh');
      toast.success('Token refreshed successfully!');
      setApiResponse({ status: res.status, data: res.data });
      await checkAuth();
      fetchActiveSessions();
    } catch (err) {
      toast.error('Token refresh failed');
      setApiResponse({ status: err.response?.status, data: err.response?.data });
    } finally {
      setRefreshing(false);
    }
  };

  const handleRevokeSession = async (sessionId) => {
    try {
      await API.delete(`/auth/sessions/${sessionId}`);
      toast.success('Session revoked successfully');
      fetchActiveSessions();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to revoke session');
    }
  };

  const handleRevokeAllOtherSessions = async () => {
    if (!window.confirm('Are you sure you want to log out all other active sessions from all other devices?')) return;
    
    setRevokingOthers(true);
    try {
      const res = await API.delete('/auth/sessions');
      toast.success(res.data?.message || 'Logged out all active sessions on other devices!');
      setApiResponse({ action: 'Revoke All Other Sessions', status: res.status });
      await fetchActiveSessions();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to revoke other sessions');
    } finally {
      setRevokingOthers(false);
    }
  };

  const handleClearHistory = async () => {
    if (!window.confirm('Are you sure you want to clear your login history?')) return;
    try {
      await API.delete('/auth/login-history');
      toast.success('Login history cleared');
      setRecentHistory([]);
    } catch (err) {
      toast.error('Failed to clear history');
    }
  };

  const getDeviceIcon = (device) => {
    const dev = (device || '').toLowerCase();
    if (dev.includes('mobile')) return <Smartphone className="w-4 h-4 text-indigo-400" />;
    if (dev.includes('tablet')) return <Smartphone className="w-4 h-4 text-purple-400" />;
    return <Monitor className="w-4 h-4 text-blue-400" />;
  };

  const otherSessionsCount = activeSessions.filter(s => !s.current).length;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-800 to-indigo-950 border border-slate-700/80 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Welcome, {user?.name || 'User'}!</h1>
            <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${
              isAdmin 
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30'
            }`}>
              {user?.role?.toUpperCase() || 'USER'}
            </span>
          </div>
          <p className="text-slate-400 text-sm">Protected multisession authenticated system.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleRevokeAllOtherSessions}
            disabled={revokingOthers}
            className="flex items-center gap-1.5 px-4 py-2 bg-rose-600/90 hover:bg-rose-600 text-white rounded-lg text-sm font-medium shadow-md shadow-rose-600/20 transition disabled:opacity-50"
            title="Log out all other active sessions from all other devices"
          >
            <ShieldOff className="w-4 h-4" />
            <span>Log Out All Other Devices</span>
          </button>

          <button
            onClick={handleTestRefresh}
            disabled={refreshing}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium shadow-md shadow-indigo-600/20 transition disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh Token</span>
          </button>
        </div>
      </div>

      {/* User Details & Quick Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Account Profile */}
        <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/60 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <User className="w-5 h-5 text-indigo-400" />
              Account Profile
            </h3>
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">User ID</span>
              <span className="font-mono text-slate-200 text-xs">{user?._id || user?.id || 'N/A'}</span>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Full Name</span>
              <span className="text-slate-200 font-medium">{user?.name || 'N/A'}</span>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Email Address</span>
              <span className="text-slate-200 font-medium flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                {user?.email}
              </span>
            </div>

            <div className="flex justify-between py-1">
              <span className="text-slate-400">Verification Status</span>
              <span className="flex items-center gap-1 font-medium text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                Verified
              </span>
            </div>
          </div>
        </div>

        {/* Security Overview */}
        <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/60 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-indigo-400" />
              Multisession & Security
            </h3>
            <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
              {activeSessions.length} Active {activeSessions.length === 1 ? 'Device' : 'Devices'}
            </span>
          </div>

          <div className="space-y-3 text-sm text-slate-300">
            <p>
              Your account supports multi-device sessions. You can log out all other devices at once with a single click.
            </p>
            
            <div className="p-3 bg-slate-900/80 border border-slate-700/80 rounded-xl flex items-center justify-between gap-3">
              <div className="text-xs space-y-0.5">
                <div className="font-semibold text-white">Active Sessions on Other Devices</div>
                <div className="text-slate-400">
                  {otherSessionsCount > 0 
                    ? `${otherSessionsCount} other ${otherSessionsCount === 1 ? 'device is' : 'devices are'} currently logged in.`
                    : 'No other active devices logged in.'}
                </div>
              </div>
              <button
                onClick={handleRevokeAllOtherSessions}
                disabled={revokingOthers}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold shadow transition whitespace-nowrap flex items-center gap-1"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out Other Devices</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              <button
                onClick={() => { setActiveTab('recentHistory'); fetchRecentHistory(10); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition ${
                  activeTab === 'recentHistory'
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Recent 10 Login Sessions</span>
              </button>

              <button
                onClick={() => { setActiveTab('activeSessions'); fetchActiveSessions(); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition ${
                  activeTab === 'activeSessions'
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
              >
                <Laptop className="w-3.5 h-3.5" />
                <span>Active Devices ({activeSessions.length})</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Interactive Section: Sessions & History */}
      <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/60 rounded-2xl p-6 space-y-6">
        {/* Navigation Tabs Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-700 pb-4 gap-4">
          <div className="flex space-x-2">
            <button
              onClick={() => { setActiveTab('recentHistory'); fetchRecentHistory(10); }}
              className={`px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition ${
                activeTab === 'recentHistory'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <History className="w-4 h-4 text-indigo-300" />
              <span>Recent 10 Login Sessions</span>
              <span className="text-xs bg-slate-950 px-2 py-0.5 rounded-full text-indigo-300 font-mono">10</span>
            </button>

            <button
              onClick={() => { setActiveTab('activeSessions'); fetchActiveSessions(); }}
              className={`px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition ${
                activeTab === 'activeSessions'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Monitor className="w-4 h-4 text-emerald-300" />
              <span>Active Devices & Sessions</span>
              <span className="text-xs bg-slate-950 px-2 py-0.5 rounded-full text-emerald-300 font-mono">
                {activeSessions.length}
              </span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {activeTab === 'recentHistory' && (
              <>
                <button
                  onClick={() => fetchRecentHistory(10)}
                  disabled={loadingHistory}
                  className="p-2 bg-slate-700/60 hover:bg-slate-700 text-slate-300 rounded-lg text-xs flex items-center gap-1 transition"
                  title="Reload Recent 10"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loadingHistory ? 'animate-spin' : ''}`} />
                  <span>Reload</span>
                </button>
                {recentHistory.length > 0 && (
                  <button
                    onClick={handleClearHistory}
                    className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg text-xs flex items-center gap-1 transition"
                    title="Clear Login History"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear History</span>
                  </button>
                )}
              </>
            )}

            {activeTab === 'activeSessions' && (
              <>
                <button
                  onClick={fetchActiveSessions}
                  disabled={loadingSessions}
                  className="p-2 bg-slate-700/60 hover:bg-slate-700 text-slate-300 rounded-lg text-xs flex items-center gap-1 transition"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loadingSessions ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>

                <button
                  onClick={handleRevokeAllOtherSessions}
                  disabled={revokingOthers}
                  className="p-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-lg text-xs flex items-center gap-1 transition disabled:opacity-50"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out All Other Devices</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Tab 1: Recent 10 Login Sessions */}
        {activeTab === 'recentHistory' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-400" />
                Last 10 Login Attempts Across All Devices
              </h4>
              <span className="text-xs text-slate-500 font-mono">Showing max 10 recent records</span>
            </div>

            {loadingHistory ? (
              <div className="py-12 text-center text-slate-400 text-sm flex flex-col items-center gap-2">
                <RefreshCw className="w-6 h-6 animate-spin text-indigo-400" />
                <span>Loading recent login history...</span>
              </div>
            ) : recentHistory.length === 0 ? (
              <div className="py-12 text-center bg-slate-900/40 rounded-xl border border-slate-800 text-slate-400 text-sm space-y-1">
                <p className="font-semibold text-white">No login history recorded yet</p>
                <p className="text-xs text-slate-500">Your recent login attempts will be displayed here.</p>
              </div>
            ) : (
              <div className="overflow-x-auto border border-slate-700/60 rounded-xl bg-slate-900/60">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 font-semibold uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Device & Browser</th>
                      <th className="py-3 px-4">Operating System</th>
                      <th className="py-3 px-4">IP Address</th>
                      <th className="py-3 px-4">Date & Time</th>
                      <th className="py-3 px-4">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 text-slate-200">
                    {recentHistory.map((item, idx) => (
                      <tr key={item._id || idx} className="hover:bg-slate-800/40 transition">
                        <td className="py-3 px-4">
                          {item.status === 'SUCCESS' ? (
                            <span className="inline-flex items-center gap-1 text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 font-semibold">
                              <CheckCircle2 className="w-3 h-3" />
                              SUCCESS
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20 font-semibold">
                              <XCircle className="w-3 h-3" />
                              FAILED
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-4 font-medium flex items-center gap-2">
                          {getDeviceIcon(item.device)}
                          <div>
                            <div>{item.browser || 'Unknown Browser'}</div>
                            <div className="text-[10px] text-slate-400">{item.device || 'Unknown Device'}</div>
                          </div>
                        </td>

                        <td className="py-3 px-4 text-slate-300">
                          {item.operatingSystem || 'Unknown OS'}
                        </td>

                        <td className="py-3 px-4 font-mono text-xs text-indigo-300">
                          {item.ipAddress || 'Unknown IP'}
                        </td>

                        <td className="py-3 px-4 text-slate-400 text-[11px]">
                          {item.createdAt ? new Date(item.createdAt).toLocaleString() : 'N/A'}
                        </td>

                        <td className="py-3 px-4 text-slate-400 text-xs">
                          {item.failureReason ? (
                            <span className="text-rose-300">{item.failureReason}</span>
                          ) : (
                            <span className="text-slate-500">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Active Devices & Sessions */}
        {activeTab === 'activeSessions' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                <Monitor className="w-4 h-4 text-emerald-400" />
                Active Devices Currently Logged In ({activeSessions.length})
              </h4>
            </div>

            {loadingSessions ? (
              <div className="py-12 text-center text-slate-400 text-sm flex flex-col items-center gap-2">
                <RefreshCw className="w-6 h-6 animate-spin text-emerald-400" />
                <span>Loading active sessions...</span>
              </div>
            ) : activeSessions.length === 0 ? (
              <div className="py-12 text-center bg-slate-900/40 rounded-xl border border-slate-800 text-slate-400 text-sm space-y-1">
                <p className="font-semibold text-white">No active sessions found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeSessions.map((s, idx) => (
                  <div
                    key={s.sessionId || idx}
                    className={`p-4 rounded-xl border transition space-y-3 ${
                      s.current
                        ? 'bg-gradient-to-br from-indigo-950/40 to-slate-900 border-indigo-500/50 shadow-md'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 bg-slate-800 rounded-lg">
                          {getDeviceIcon(s.device)}
                        </div>
                        <div>
                          <div className="font-semibold text-sm text-white flex items-center gap-1.5">
                            <span>{s.browser || 'Browser'}</span>
                            {s.current && (
                              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                                THIS DEVICE
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-400">{s.operatingSystem} ({s.device})</div>
                        </div>
                      </div>

                      {!s.current && (
                        <button
                          onClick={() => handleRevokeSession(s.sessionId)}
                          className="px-2.5 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg text-xs font-medium transition flex items-center gap-1"
                        >
                          <LogOut className="w-3 h-3" />
                          <span>Revoke</span>
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-800/60 text-slate-400">
                      <div>
                        <span className="block text-[10px] text-slate-500 uppercase">IP Address</span>
                        <span className="font-mono text-indigo-300">{s.ipAddress || 'Unknown'}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-slate-500 uppercase">Last Active</span>
                        <span>{s.lastActiveAt ? new Date(s.lastActiveAt).toLocaleString() : 'Just now'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Debug Output */}
      {apiResponse && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-2">
          <h4 className="text-xs uppercase tracking-wider text-slate-500 font-bold">Latest Action Response</h4>
          <pre className="p-4 bg-slate-950 rounded-xl text-xs font-mono text-emerald-400 overflow-x-auto">
            {JSON.stringify(apiResponse, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
