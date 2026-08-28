import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Phone, Lock, User, ArrowRight, Loader2, CheckCircle2, ShieldCheck, Send, Key } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { sendEmailOtp, verifyEmailOtp, sendPhoneOtp, verifyPhoneOtp, registerUser } = useAuth();

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  // Verification States
  const [emailOtp, setEmailOtp] = useState('');
  const [phoneOtp, setPhoneOtp] = useState('');
  const [isEmailOtpSent, setIsEmailOtpSent] = useState(false);
  const [isPhoneOtpSent, setIsPhoneOtpSent] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);

  // Loading States
  const [loadingEmailSend, setLoadingEmailSend] = useState(false);
  const [loadingEmailVerify, setLoadingEmailVerify] = useState(false);
  const [loadingPhoneSend, setLoadingPhoneSend] = useState(false);
  const [loadingPhoneVerify, setLoadingPhoneVerify] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  // 1. Send Email OTP
  const handleSendEmailOtp = async () => {
    if (!email || !phone) {
      toast.error('Please enter both Email and Phone Number first');
      return;
    }
    setLoadingEmailSend(true);
    try {
      const res = await sendEmailOtp(email, phone);
      setIsEmailOtpSent(true);
      toast.success(res.message || 'Email OTP sent! Check console log if offline.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send Email OTP');
    } finally {
      setLoadingEmailSend(false);
    }
  };

  // 2. Verify Email OTP
  const handleVerifyEmailOtp = async () => {
    if (!emailOtp) {
      toast.error('Please enter the 6-digit Email OTP');
      return;
    }
    setLoadingEmailVerify(true);
    try {
      const res = await verifyEmailOtp(email, emailOtp);
      setIsEmailVerified(true);
      toast.success(res.message || 'Email verified successfully! ✓');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid or expired Email OTP');
    } finally {
      setLoadingEmailVerify(false);
    }
  };

  // 3. Send Phone OTP
  const handleSendPhoneOtp = async () => {
    if (!email || !phone) {
      toast.error('Please enter both Email and Phone Number first');
      return;
    }
    setLoadingPhoneSend(true);
    try {
      const res = await sendPhoneOtp(email, phone);
      setIsPhoneOtpSent(true);
      toast.success(res.message || 'Phone OTP sent! Check console log if offline.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send Phone OTP');
    } finally {
      setLoadingPhoneSend(false);
    }
  };

  // 4. Verify Phone OTP
  const handleVerifyPhoneOtp = async () => {
    if (!phoneOtp) {
      toast.error('Please enter the 6-digit Phone OTP');
      return;
    }
    setLoadingPhoneVerify(true);
    try {
      const res = await verifyPhoneOtp(email, phoneOtp);
      setIsPhoneVerified(true);
      toast.success(res.message || 'Phone verified successfully! ✓');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid or expired Phone OTP');
    } finally {
      setLoadingPhoneVerify(false);
    }
  };

  // 5. Final Register Submit
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!isEmailVerified || !isPhoneVerified) {
      toast.error('You must verify both Email and Phone before creating an account.');
      return;
    }
    if (!name || !password) {
      toast.error('Please complete Name and Password fields.');
      return;
    }

    setIsRegistering(true);
    try {
      const res = await registerUser(name, email, password);
      toast.success(res.message || 'Account created successfully! Please log in.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed.');
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex p-3 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-bold text-white">Create Your Account</h1>
        <p className="text-slate-400 text-sm">
          Verify Email & Phone OTP to complete registration
        </p>
      </div>

      <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/60 p-6 sm:p-8 rounded-2xl shadow-xl space-y-6">
        
        {/* Full Name & Password Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full bg-slate-900/80 border border-slate-700 text-white rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 8 characters"
                className="w-full bg-slate-900/80 border border-slate-700 text-white rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Email Field with Send OTP Button right beside it */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-300">Email Address</label>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
              <input
                type="email"
                required
                disabled={isEmailVerified || isEmailOtpSent}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-slate-900/80 border border-slate-700 text-white rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-indigo-500 disabled:opacity-50"
              />
            </div>

            {isEmailVerified ? (
              <span className="flex items-center text-xs font-semibold text-emerald-400 gap-1 bg-emerald-500/20 px-3 py-2 rounded-lg border border-emerald-500/30">
                <CheckCircle2 className="w-4 h-4" /> Verified
              </span>
            ) : (
              <button
                type="button"
                onClick={handleSendEmailOtp}
                disabled={loadingEmailSend || !email || !phone}
                className="flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-medium px-4 py-2 rounded-lg transition shrink-0"
              >
                {loadingEmailSend ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                <span>{isEmailOtpSent ? 'Resend OTP' : 'Send Email OTP'}</span>
              </button>
            )}
          </div>

          {/* Email OTP Verification Sub-Row */}
          {!isEmailVerified && isEmailOtpSent && (
            <div className="flex items-center space-x-2 pt-1 pl-2 border-l-2 border-indigo-500">
              <input
                type="text"
                maxLength={6}
                value={emailOtp}
                onChange={(e) => setEmailOtp(e.target.value)}
                placeholder="Enter 6-digit Email OTP"
                className="flex-1 bg-slate-950 border border-slate-700 text-white rounded-lg px-3 py-1.5 text-xs font-mono tracking-wider focus:outline-none focus:border-indigo-500"
              />
              <button
                type="button"
                onClick={handleVerifyEmailOtp}
                disabled={loadingEmailVerify || !emailOtp}
                className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-medium px-4 py-1.5 rounded-lg transition flex items-center space-x-1"
              >
                {loadingEmailVerify ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                <span>Verify Email</span>
              </button>
            </div>
          )}
        </div>

        {/* Phone Field with Send OTP Button right beside it */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-300">Phone Number</label>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Phone className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
              <input
                type="tel"
                required
                disabled={isPhoneVerified || isPhoneOtpSent}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1234567890"
                className="w-full bg-slate-900/80 border border-slate-700 text-white rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-indigo-500 disabled:opacity-50"
              />
            </div>

            {isPhoneVerified ? (
              <span className="flex items-center text-xs font-semibold text-emerald-400 gap-1 bg-emerald-500/20 px-3 py-2 rounded-lg border border-emerald-500/30">
                <CheckCircle2 className="w-4 h-4" /> Verified
              </span>
            ) : (
              <button
                type="button"
                onClick={handleSendPhoneOtp}
                disabled={loadingPhoneSend || !email || !phone}
                className="flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-medium px-4 py-2 rounded-lg transition shrink-0"
              >
                {loadingPhoneSend ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                <span>{isPhoneOtpSent ? 'Resend OTP' : 'Send Phone OTP'}</span>
              </button>
            )}
          </div>

          {/* Phone OTP Verification Sub-Row */}
          {!isPhoneVerified && isPhoneOtpSent && (
            <div className="flex items-center space-x-2 pt-1 pl-2 border-l-2 border-indigo-500">
              <input
                type="text"
                maxLength={6}
                value={phoneOtp}
                onChange={(e) => setPhoneOtp(e.target.value)}
                placeholder="Enter 6-digit Phone OTP"
                className="flex-1 bg-slate-950 border border-slate-700 text-white rounded-lg px-3 py-1.5 text-xs font-mono tracking-wider focus:outline-none focus:border-indigo-500"
              />
              <button
                type="button"
                onClick={handleVerifyPhoneOtp}
                disabled={loadingPhoneVerify || !phoneOtp}
                className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-medium px-4 py-1.5 rounded-lg transition flex items-center space-x-1"
              >
                {loadingPhoneVerify ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                <span>Verify Phone</span>
              </button>
            </div>
          )}
        </div>

        {/* Final Registration Button */}
        <button
          type="button"
          onClick={handleRegister}
          disabled={!isEmailVerified || !isPhoneVerified || isRegistering}
          className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-medium py-3 rounded-lg flex items-center justify-center space-x-2 transition shadow-lg shadow-emerald-600/20"
        >
          {isRegistering ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <span>Complete Account Registration</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        <p className="text-center text-sm text-slate-400 pt-2">
          Already registered?{' '}
          <Link to="/login" className="text-indigo-400 hover:underline font-medium">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
