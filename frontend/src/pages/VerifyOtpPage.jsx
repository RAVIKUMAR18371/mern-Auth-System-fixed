import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Key, Mail, Phone, RefreshCw, Loader2, CheckCircle2, Send } from 'lucide-react';
import toast from 'react-hot-toast';

export default function VerifyOtpPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { sendEmailOtp, verifyEmailOtp, sendPhoneOtp, verifyPhoneOtp } = useAuth();

  const [email, setEmail] = useState(location.state?.email || '');
  const [phone, setPhone] = useState('');
  const [activeTab, setActiveTab] = useState('email'); // 'email' | 'phone'
  const [otp, setOtp] = useState('');

  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);

  const handleSendOtp = async () => {
    if (!email || !phone) {
      toast.error('Both Email and Phone are required to send OTP');
      return;
    }
    setIsSending(true);
    try {
      if (activeTab === 'email') {
        const res = await sendEmailOtp(email, phone);
        toast.success(res.message || 'Email OTP sent!');
      } else {
        const res = await sendPhoneOtp(email, phone);
        toast.success(res.message || 'Phone OTP sent!');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setIsSending(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!email || !otp) {
      toast.error('Email and OTP code are required');
      return;
    }

    setIsVerifying(true);
    try {
      if (activeTab === 'email') {
        const res = await verifyEmailOtp(email, otp);
        setEmailVerified(true);
        toast.success(res.message || 'Email verified successfully!');
      } else {
        const res = await verifyPhoneOtp(email, otp);
        setPhoneVerified(true);
        toast.success(res.message || 'Phone verified successfully!');
      }
      setOtp('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid or expired OTP');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-slate-800/60 backdrop-blur-xl border border-slate-700/60 p-8 rounded-2xl shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Key className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-white">Verification Hub</h2>
          <p className="text-slate-400 text-sm">Verify your Email and Phone number</p>
        </div>

        {/* Tab Selection */}
        <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => setActiveTab('email')}
            className={`flex-1 py-2 rounded-lg text-xs font-medium flex items-center justify-center space-x-1 transition ${
              activeTab === 'email' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Email OTP</span>
            {emailVerified && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('phone')}
            className={`flex-1 py-2 rounded-lg text-xs font-medium flex items-center justify-center space-x-1 transition ${
              activeTab === 'phone' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Phone OTP</span>
            {phoneVerified && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
          </button>
        </div>

        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full bg-slate-900/80 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Phone Number</label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1234567890"
              className="w-full bg-slate-900/80 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-slate-400">Need code sent to {activeTab}?</span>
            <button
              type="button"
              onClick={handleSendOtp}
              disabled={isSending || !email || !phone}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center space-x-1 disabled:opacity-50"
            >
              {isSending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
              <span>Send {activeTab.toUpperCase()} OTP</span>
            </button>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Enter 6-Digit OTP Code</label>
            <input
              type="text"
              required
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="123456"
              className="w-full text-center tracking-[0.5em] font-mono text-lg bg-slate-900/80 border border-slate-700 text-white rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={isVerifying || !otp}
            className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-medium py-2.5 rounded-lg flex items-center justify-center space-x-2 transition shadow-md shadow-emerald-600/20"
          >
            {isVerifying ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Verify {activeTab.toUpperCase()}</span>
              </>
            )}
          </button>
        </form>

        <div className="pt-2 text-center">
          <Link to="/register" className="text-xs text-indigo-400 hover:underline">
            ← Return to Registration
          </Link>
        </div>
      </div>
    </div>
  );
}
