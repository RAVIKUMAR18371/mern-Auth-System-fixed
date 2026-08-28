import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { ShieldAlert, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminPage() {
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const res = await API.get('/auth/admin');
        setAdminData(res.data);
      } catch (err) {
        const errMsg = err.response?.data?.message || 'Forbidden: Admin access required';
        setError(errMsg);
        toast.error(errMsg);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">
      <div className="flex items-center space-x-3 bg-amber-500/10 border border-amber-500/20 p-6 rounded-2xl">
        <ShieldAlert className="w-10 h-10 text-amber-400 flex-shrink-0" />
        <div>
          <h1 className="text-2xl font-bold text-white">Admin Control Panel</h1>
          <p className="text-amber-200/80 text-sm">Role-restricted protected route (`/api/auth/admin`)</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
        </div>
      ) : error ? (
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 flex items-center space-x-3 text-red-400">
          <AlertTriangle className="w-6 h-6 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-lg">Access Denied</h3>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      ) : (
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 space-y-4">
          <div className="flex items-center space-x-2 text-emerald-400">
            <CheckCircle className="w-6 h-6" />
            <h2 className="text-xl font-semibold text-white">Admin Verification Success!</h2>
          </div>
          <p className="text-slate-300 text-sm">
            Your role was verified by the backend middleware <code className="text-amber-300">authorize("admin")</code>.
          </p>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <h4 className="text-xs font-bold uppercase text-slate-500 mb-2">Backend Response Payload</h4>
            <pre className="text-xs font-mono text-amber-300 overflow-x-auto">
              {JSON.stringify(adminData, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
