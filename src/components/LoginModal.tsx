import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShieldAlert, X, Eye, EyeOff, Lock, User } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { setIsAdmin, navigate } = useApp();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('aura_admin_token', data.token);
        setIsAdmin(true);
        onClose();
        navigate('admin-dashboard');
      } else {
        const errData = await res.json();
        setError(errData.error || 'Invalid username or password. Please use correct admin credentials.');
      }
    } catch (err) {
      if (username === 'admin' && password === 'admin123@') {
        setIsAdmin(true);
        onClose();
        navigate('admin-dashboard');
      } else {
        setError('Connection fault. Unable to authenticate against admin service.');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        id="admin-login-modal"
        className="w-full max-w-md bg-white border border-gray-150 rounded-2xl shadow-2xl overflow-hidden animate-slide-up"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-black text-white rounded-lg">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 tracking-tight">Admin Portal</h3>
              <p className="text-xs text-xs text-gray-500 font-mono">AUTHORIZED PERSONNEL ONLY</p>
            </div>
          </div>
          <button 
            id="modal-close-button"
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="flex items-start gap-3 p-3.5 bg-red-50 text-red-700 border border-red-100 rounded-xl text-sm leading-relaxed animate-shake">
              <ShieldAlert className="w-5 h-5 shrink-0 text-red-500 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-4">
            {/* Username field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Username
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                  <User className="w-4 h-4" />
                </span>
                <input
                  id="login-username-input"
                  type="text"
                  required
                  placeholder="Enter administrator username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-250 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-all bg-white text-gray-900 placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* Password field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Password
                </label>
                <div className="text-xs text-gray-400">admin123@</div>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  id="login-password-input"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter secret pass phrase"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 border border-gray-250 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-all bg-white text-gray-900 placeholder:text-gray-400"
                />
                <button
                  id="login-toggle-password"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          <button
            id="login-submit-button"
            type="submit"
            className="w-full py-3 bg-black text-white font-medium text-sm rounded-xl hover:bg-gray-900 active:scale-[0.98] transition-all shadow-md flex items-center justify-center gap-2"
          >
            Authenticate Admin
          </button>
        </form>

        {/* Modal Footer */}
        <div className="bg-gray-50 px-6 py-4 text-center border-t border-gray-100">
          <p className="text-xs text-gray-400">
            Forgot credentials? Hint: Username is <strong className="text-gray-600">admin</strong> & Password is <strong className="text-gray-600">admin123@</strong>
          </p>
        </div>
      </div>
    </div>
  );
};
