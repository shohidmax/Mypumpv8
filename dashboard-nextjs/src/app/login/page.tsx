"use client";
import { useState } from 'react';
import { auth, googleProvider } from '@/lib/firebase';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/dashboard');
    } catch (err: any) {
      setError("Invalid email or password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    try {
      await signInWithPopup(auth, googleProvider);
      router.push('/dashboard');
    } catch (err: any) {
      setError("Google Sign-In failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050511] relative overflow-hidden p-6">
      {/* Glow Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-blue-600/20 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-emerald-600/20 blur-[100px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl z-10 relative">
        <div className="mb-10 text-center">
          <Link href="/" className="inline-block text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400 tracking-tight mb-2">
            MultiPump OS
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-slate-400 text-sm">Enter your credentials to access the dashboard.</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm flex items-center gap-3">
            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
            <input 
              className="w-full px-5 py-3.5 rounded-xl bg-slate-950/50 border border-slate-700/50 text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition-all" 
              type="email" placeholder="hello@company.com" value={email} onChange={e => setEmail(e.target.value)} required 
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
               <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Password</label>
               <a href="#" className="text-xs text-emerald-400 hover:text-emerald-300 font-medium">Forgot?</a>
            </div>
            <input 
              className="w-full px-5 py-3.5 rounded-xl bg-slate-950/50 border border-slate-700/50 text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition-all" 
              type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required 
            />
          </div>
          
          <button 
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-bold py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] mt-4 disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {isLoading ? <span className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span> : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 flex items-center">
            <div className="flex-grow border-t border-slate-700/50"></div>
            <span className="shrink-0 px-4 text-xs font-semibold text-slate-500 uppercase">Or continue with</span>
            <div className="flex-grow border-t border-slate-700/50"></div>
        </div>

        <button 
            onClick={handleGoogleLogin}
            className="w-full mt-6 bg-slate-800 hover:bg-slate-700 text-white font-medium py-3.5 rounded-xl transition-colors border border-slate-700/50 flex items-center justify-center gap-3"
        >
            <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /><path fill="none" d="M1 1h22v22H1z" /></svg>
            Google
        </button>

        <p className="mt-8 text-center text-sm text-slate-400">
          Don't have an account?{' '}
          <Link href="/signup" className="text-emerald-400 hover:text-emerald-300 font-bold transition-colors">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
